<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\CompanySetting;
use App\Models\Quotation;
use App\Support\Numbering;
use App\Support\Presenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuotationController extends Controller
{
    public function index(Request $request): Response
    {
        $quotations = $request->user()->quotations()->with('customer')->orderByDesc('issue_date')->get()
            ->map(fn ($q) => Presenter::quotation($q));

        return Inertia::render('billing/quotations/index', [
            'quotations' => $quotations,
        ]);
    }

    public function show(Request $request, Quotation $quotation): Response
    {
        $this->authorizeOwnership($request, $quotation);

        return Inertia::render('billing/quotations/show', [
            'quotation' => Presenter::quotation($quotation->load('customer')),
            'company' => Presenter::settings(CompanySetting::forUser($request->user())),
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('billing/quotations/editor', [
            'mode' => 'create',
            'customers' => $user->customers()->orderBy('name')->get()->map(fn ($c) => Presenter::customer($c)),
            'catalog' => $user->catalogItems()->orderBy('name')->get(),
            'next_number' => CompanySetting::forUser($user)->quotation_prefix.str_pad((string) CompanySetting::forUser($user)->next_quotation_number, 4, '0', STR_PAD_LEFT),
            'quotation' => null,
        ]);
    }

    public function edit(Request $request, Quotation $quotation): Response
    {
        $this->authorizeOwnership($request, $quotation);
        $user = $request->user();

        return Inertia::render('billing/quotations/editor', [
            'mode' => 'edit',
            'customers' => $user->customers()->orderBy('name')->get()->map(fn ($c) => Presenter::customer($c)),
            'catalog' => $user->catalogItems()->orderBy('name')->get(),
            'quotation' => Presenter::quotation($quotation),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePayload($request);
        $quote = $request->user()->quotations()->create([
            'customer_id' => $data['customer_id'],
            'number' => Numbering::nextQuotationNumber($request->user()),
            'issue_date' => $data['issue_date'],
            'valid_until' => $data['valid_until'],
            'status' => $data['status'] ?? 'pending',
            'items' => $data['items'],
            'tax_rate' => $data['tax_rate'] ?? 5,
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()->route('billing.quotations.show', $quote)->with('flash', $quote->number.' '.($quote->status === 'draft' ? 'saved as draft' : 'sent'));
    }

    public function update(Request $request, Quotation $quotation): RedirectResponse
    {
        $this->authorizeOwnership($request, $quotation);
        $data = $this->validatePayload($request);

        $quotation->update([
            'customer_id' => $data['customer_id'],
            'issue_date' => $data['issue_date'],
            'valid_until' => $data['valid_until'],
            'status' => $data['status'] ?? $quotation->status,
            'items' => $data['items'],
            'tax_rate' => $data['tax_rate'] ?? 5,
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()->route('billing.quotations.show', $quotation)->with('flash', $quotation->number.' updated');
    }

    public function accept(Request $request, Quotation $quotation): RedirectResponse
    {
        $this->authorizeOwnership($request, $quotation);
        $quotation->update(['status' => 'accepted']);

        return back()->with('flash', $quotation->number.' marked as accepted');
    }

    public function decline(Request $request, Quotation $quotation): RedirectResponse
    {
        $this->authorizeOwnership($request, $quotation);
        $quotation->update(['status' => 'declined']);

        return back()->with('flash', $quotation->number.' marked as declined');
    }

    public function convertToInvoice(Request $request, Quotation $quotation): RedirectResponse
    {
        $this->authorizeOwnership($request, $quotation);

        return redirect()->route('billing.invoices.create')->with('editor_initial', [
            'customer_id' => $quotation->customer_id,
            'items' => $quotation->items,
            'tax_rate' => $quotation->tax_rate,
            'notes' => $quotation->notes,
            'from_quote' => $quotation->number,
        ]);
    }

    public function destroy(Request $request, Quotation $quotation): RedirectResponse
    {
        $this->authorizeOwnership($request, $quotation);
        $quotation->delete();

        return redirect()->route('billing.quotations.index')->with('flash', 'Quotation deleted');
    }

    private function authorizeOwnership(Request $request, Quotation $quotation): void
    {
        abort_unless($quotation->user_id === $request->user()->id, 403);
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'customer_id' => 'required|integer|exists:customers,id',
            'issue_date' => 'required|date',
            'valid_until' => 'required|date',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'status' => 'nullable|in:pending,accepted,declined,draft',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.qty' => 'required|numeric|min:0',
            'items.*.price' => 'required|numeric|min:0',
        ]);
    }
}
