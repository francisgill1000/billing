<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\CompanySetting;
use App\Models\Invoice;
use App\Support\Presenter;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function show(string $number): Response
    {
        $invoice = Invoice::with('customer', 'user')->where('number', $number)->firstOrFail();
        $settings = CompanySetting::forUser($invoice->user);

        return Inertia::render('billing/portal/show', [
            'invoice' => Presenter::invoice($invoice),
            'company' => Presenter::settings($settings),
        ]);
    }
}
