<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Support\Presenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $customers = $user->customers()->with(['invoices'])->orderBy('name')->get()->map(function ($c) {
            $invoices = $c->invoices;
            $total = $invoices->sum(fn ($i) => $i->total());
            $outstanding = $invoices->whereNotIn('status', ['paid', 'draft'])->sum(fn ($i) => $i->total());

            return array_merge(Presenter::customer($c), [
                'invoice_count' => $invoices->count(),
                'total' => $total,
                'outstanding' => $outstanding,
            ]);
        });

        return Inertia::render('billing/customers/index', [
            'customers' => $customers,
        ]);
    }

    public function show(Request $request, Customer $customer): Response
    {
        $this->authorizeOwnership($request, $customer);

        $invoices = $customer->invoices()->orderByDesc('issue_date')->get();
        $quotations = $customer->quotations()->orderByDesc('issue_date')->get();
        $payments = $customer->payments()->orderByDesc('paid_at')->get();

        $total = $invoices->sum(fn ($i) => $i->total());
        $paid = $invoices->where('status', 'paid')->sum(fn ($i) => $i->total());
        $outstanding = $invoices->whereNotIn('status', ['paid', 'draft'])->sum(fn ($i) => $i->total());

        return Inertia::render('billing/customers/show', [
            'customer' => Presenter::customer($customer),
            'stats' => [
                'total' => $total,
                'paid' => $paid,
                'outstanding' => $outstanding,
                'paid_count' => $invoices->where('status', 'paid')->count(),
            ],
            'invoices' => $invoices->map(fn ($i) => Presenter::invoice($i)),
            'quotations' => $quotations->map(fn ($q) => Presenter::quotation($q)),
            'payments' => $payments->map(fn ($p) => Presenter::payment($p)),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:64',
            'trn' => 'nullable|string|max:32',
            'city' => 'nullable|string|max:128',
            'country' => 'nullable|string|max:128',
            'notes' => 'nullable|string',
        ]);

        $data['initials'] = collect(explode(' ', $data['name']))->take(2)
            ->map(fn ($w) => mb_strtoupper(mb_substr($w, 0, 1)))->implode('');
        $data['customer_since'] = now()->toDateString();

        $customer = $request->user()->customers()->create($data);

        return redirect()->route('billing.customers.show', $customer)->with('flash', 'Customer added');
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $this->authorizeOwnership($request, $customer);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:64',
            'trn' => 'nullable|string|max:32',
            'city' => 'nullable|string|max:128',
            'country' => 'nullable|string|max:128',
            'notes' => 'nullable|string',
        ]);

        $customer->update($data);

        return back()->with('flash', 'Customer updated');
    }

    public function destroy(Request $request, Customer $customer): RedirectResponse
    {
        $this->authorizeOwnership($request, $customer);
        $customer->delete();

        return redirect()->route('billing.customers.index')->with('flash', 'Customer removed');
    }

    private function authorizeOwnership(Request $request, Customer $customer): void
    {
        abort_unless($customer->user_id === $request->user()->id, 403);
    }
}
