<?php

namespace App\Support;

use App\Models\CompanySetting;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Quotation;
use App\Models\RecurringSchedule;

class Presenter
{
    public static function customer(Customer $c): array
    {
        return [
            'id' => $c->id,
            'name' => $c->name,
            'contact' => $c->contact,
            'email' => $c->email,
            'phone' => $c->phone,
            'trn' => $c->trn,
            'city' => $c->city,
            'country' => $c->country,
            'initials' => $c->initials ?: mb_strtoupper(mb_substr($c->name, 0, 2)),
            'since' => optional($c->customer_since)->format('Y-m-d'),
            'notes' => $c->notes,
        ];
    }

    public static function invoice(Invoice $i, ?Customer $customer = null): array
    {
        $customer = $customer ?? $i->customer;

        return [
            'id' => $i->id,
            'number' => $i->number,
            'customer' => $customer ? self::customer($customer) : null,
            'customer_id' => $i->customer_id,
            'issue_date' => $i->issue_date->format('Y-m-d'),
            'due_date' => $i->due_date->format('Y-m-d'),
            'status' => $i->status,
            'paid_date' => optional($i->paid_date)->format('Y-m-d'),
            'items' => $i->items ?? [],
            'tax_rate' => (float) $i->tax_rate,
            'notes' => $i->notes,
            'subtotal' => $i->subtotal(),
            'tax' => $i->taxAmount(),
            'total' => $i->total(),
            'amount_paid' => $i->amountPaid(),
            'balance' => $i->balance(),
        ];
    }

    public static function quotation(Quotation $q, ?Customer $customer = null): array
    {
        $customer = $customer ?? $q->customer;

        return [
            'id' => $q->id,
            'number' => $q->number,
            'customer' => $customer ? self::customer($customer) : null,
            'customer_id' => $q->customer_id,
            'issue_date' => $q->issue_date->format('Y-m-d'),
            'valid_until' => $q->valid_until->format('Y-m-d'),
            'status' => $q->status,
            'items' => $q->items ?? [],
            'tax_rate' => (float) $q->tax_rate,
            'notes' => $q->notes,
            'subtotal' => $q->subtotal(),
            'tax' => $q->taxAmount(),
            'total' => $q->total(),
        ];
    }

    public static function payment(Payment $p): array
    {
        return [
            'id' => $p->id,
            'number' => $p->number,
            'invoice_id' => $p->invoice_id,
            'invoice_number' => $p->invoice?->number,
            'customer_id' => $p->customer_id,
            'customer' => $p->customer ? self::customer($p->customer) : null,
            'paid_at' => $p->paid_at->format('Y-m-d'),
            'amount' => (float) $p->amount,
            'method' => $p->method,
            'reference' => $p->reference,
            'note' => $p->note,
        ];
    }

    public static function recurring(RecurringSchedule $r, ?Customer $customer = null): array
    {
        $customer = $customer ?? $r->customer;

        return [
            'id' => $r->id,
            'number' => $r->number,
            'customer' => $customer ? self::customer($customer) : null,
            'customer_id' => $r->customer_id,
            'frequency' => $r->frequency,
            'next_date' => optional($r->next_date)->format('Y-m-d'),
            'status' => $r->status,
            'start_date' => $r->start_date->format('Y-m-d'),
            'end_date' => optional($r->end_date)->format('Y-m-d'),
            'items' => $r->items ?? [],
            'tax_rate' => (float) $r->tax_rate,
            'last_issued' => optional($r->last_issued)->format('Y-m-d'),
            'sent_count' => $r->sent_count,
            'subtotal' => $r->subtotal(),
            'total' => $r->total(),
        ];
    }

    public static function settings(CompanySetting $s): array
    {
        return $s->only([
            'company_name', 'trn', 'trade_license', 'address', 'email', 'phone',
            'currency', 'vat_rate', 'vat_return_period',
            'invoice_prefix', 'next_invoice_number',
            'quotation_prefix', 'next_quotation_number',
            'payment_terms_days', 'late_fee', 'footer_note',
            'accent_color', 'notify_paid', 'notify_overdue', 'auto_remind',
            'bank_name', 'iban', 'swift',
        ]);
    }
}
