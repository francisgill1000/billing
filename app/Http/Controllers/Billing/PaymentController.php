<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Support\Numbering;
use App\Support\Presenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $payments = $request->user()->payments()->with(['customer', 'invoice'])->orderByDesc('paid_at')->get()
            ->map(fn ($p) => Presenter::payment($p));

        return Inertia::render('billing/payments/index', [
            'payments' => $payments,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'invoice_id' => 'required|integer|exists:invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'method' => 'required|string',
            'paid_at' => 'required|date',
            'reference' => 'nullable|string|max:128',
            'note' => 'nullable|string',
        ]);

        $invoice = Invoice::findOrFail($data['invoice_id']);
        abort_unless($invoice->user_id === $request->user()->id, 403);

        $payment = $request->user()->payments()->create([
            'invoice_id' => $invoice->id,
            'customer_id' => $invoice->customer_id,
            'number' => Numbering::nextPaymentNumber($request->user()),
            'paid_at' => $data['paid_at'],
            'amount' => $data['amount'],
            'method' => $data['method'],
            'reference' => $data['reference'] ?? null,
            'note' => $data['note'] ?? null,
        ]);

        // Update invoice status based on accumulated payments
        $invoice->refresh();
        $totalPaid = $invoice->amountPaid();
        $invoiceTotal = $invoice->total();
        if ($totalPaid + 0.01 >= $invoiceTotal) {
            $invoice->update(['status' => 'paid', 'paid_date' => $data['paid_at']]);
            $flash = "Payment recorded · {$invoice->number} marked paid";
        } else {
            $invoice->update(['status' => 'partial']);
            $flash = "Partial payment recorded against {$invoice->number}";
        }

        return back()->with('flash', $flash);
    }
}
