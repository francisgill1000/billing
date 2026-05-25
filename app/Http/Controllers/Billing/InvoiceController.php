<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use App\Models\CompanySetting;
use App\Models\Invoice;
use App\Support\Numbering;
use App\Support\Presenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $invoices = $user->invoices()->with('customer')->orderByDesc('issue_date')->get()
            ->map(fn ($i) => Presenter::invoice($i));

        return Inertia::render('billing/invoices/index', [
            'invoices' => $invoices,
        ]);
    }

    public function show(Request $request, Invoice $invoice): Response
    {
        $this->authorizeOwnership($request, $invoice);

        return Inertia::render('billing/invoices/show', [
            'invoice' => Presenter::invoice($invoice->load('customer')),
            'company' => Presenter::settings(CompanySetting::forUser($request->user())),
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('billing/invoices/editor', [
            'mode' => 'create',
            'customers' => $user->customers()->orderBy('name')->get()->map(fn ($c) => Presenter::customer($c)),
            'catalog' => $user->catalogItems()->orderBy('name')->get(),
            'next_number' => CompanySetting::forUser($user)->invoice_prefix.str_pad((string) CompanySetting::forUser($user)->next_invoice_number, 4, '0', STR_PAD_LEFT),
            'invoice' => null,
            'initial' => session('editor_initial'),
        ]);
    }

    public function edit(Request $request, Invoice $invoice): Response
    {
        $this->authorizeOwnership($request, $invoice);
        $user = $request->user();

        return Inertia::render('billing/invoices/editor', [
            'mode' => 'edit',
            'customers' => $user->customers()->orderBy('name')->get()->map(fn ($c) => Presenter::customer($c)),
            'catalog' => $user->catalogItems()->orderBy('name')->get(),
            'invoice' => Presenter::invoice($invoice),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePayload($request);
        $invoice = $request->user()->invoices()->create([
            'customer_id' => $data['customer_id'],
            'number' => Numbering::nextInvoiceNumber($request->user()),
            'issue_date' => $data['issue_date'],
            'due_date' => $data['due_date'],
            'status' => $data['status'] ?? 'draft',
            'items' => $data['items'],
            'tax_rate' => $data['tax_rate'] ?? 5,
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()->route('billing.invoices.show', $invoice)->with('flash', $invoice->number.' '.($invoice->status === 'draft' ? 'saved as draft' : 'sent'));
    }

    public function update(Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorizeOwnership($request, $invoice);
        $data = $this->validatePayload($request);

        $invoice->update([
            'customer_id' => $data['customer_id'],
            'issue_date' => $data['issue_date'],
            'due_date' => $data['due_date'],
            'status' => $data['status'] ?? $invoice->status,
            'items' => $data['items'],
            'tax_rate' => $data['tax_rate'] ?? 5,
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()->route('billing.invoices.show', $invoice)->with('flash', $invoice->number.' updated');
    }

    public function send(Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorizeOwnership($request, $invoice);
        $invoice->update(['status' => 'sent']);

        return back()->with('flash', $invoice->number.' sent to customer');
    }

    public function markPaid(Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorizeOwnership($request, $invoice);
        $invoice->update(['status' => 'paid', 'paid_date' => now()->toDateString()]);

        return back()->with('flash', $invoice->number.' marked as paid');
    }

    public function destroy(Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorizeOwnership($request, $invoice);
        $invoice->delete();

        return redirect()->route('billing.invoices.index')->with('flash', 'Invoice deleted');
    }

    private function authorizeOwnership(Request $request, Invoice $invoice): void
    {
        abort_unless($invoice->user_id === $request->user()->id, 403);
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'customer_id' => 'required|integer|exists:customers,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'status' => 'nullable|in:draft,sent,overdue,partial,paid',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.qty' => 'required|numeric|min:0',
            'items.*.price' => 'required|numeric|min:0',
        ]);
    }
}
