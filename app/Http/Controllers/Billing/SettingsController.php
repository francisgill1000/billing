<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\CompanySetting;
use App\Support\Presenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        $settings = CompanySetting::forUser($request->user());

        return Inertia::render('billing/settings/index', [
            'settings' => Presenter::settings($settings),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'trn' => 'nullable|string|max:32',
            'trade_license' => 'nullable|string|max:64',
            'address' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:64',
            'currency' => 'nullable|string|max:8',
            'vat_rate' => 'nullable|numeric|min:0|max:100',
            'vat_return_period' => 'nullable|in:monthly,quarterly',
            'invoice_prefix' => 'nullable|string|max:32',
            'next_invoice_number' => 'nullable|integer|min:1',
            'payment_terms_days' => 'nullable|integer|min:0',
            'late_fee' => 'nullable|string|max:64',
            'footer_note' => 'nullable|string',
            'accent_color' => 'nullable|string|max:16',
            'notify_paid' => 'nullable|boolean',
            'notify_overdue' => 'nullable|boolean',
            'auto_remind' => 'nullable|boolean',
            'bank_name' => 'nullable|string|max:128',
            'iban' => 'nullable|string|max:64',
            'swift' => 'nullable|string|max:32',
        ]);

        $settings = CompanySetting::forUser($request->user());
        $settings->fill($data)->save();

        return back()->with('flash', 'Settings saved');
    }
}
