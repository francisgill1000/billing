<?php

use App\Http\Controllers\Billing\CustomerController;
use App\Http\Controllers\Billing\DashboardController;
use App\Http\Controllers\Billing\InvoiceController;
use App\Http\Controllers\Billing\PaymentController;
use App\Http\Controllers\Billing\PortalController;
use App\Http\Controllers\Billing\QuotationController;
use App\Http\Controllers\Billing\RecurringController;
use App\Http\Controllers\Billing\ReportController;
use App\Http\Controllers\Billing\SettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('billing.dashboard')
        : redirect()->route('login');
})->name('home');

// Public portal — no auth required
Route::get('pay/{number}', [PortalController::class, 'show'])->name('billing.portal');

Route::middleware(['auth'])->group(function () {
    // Billing dashboard + resources
    Route::get('dashboard', [DashboardController::class, 'index'])->name('billing.dashboard');

    // Invoices
    Route::get('invoices', [InvoiceController::class, 'index'])->name('billing.invoices.index');
    Route::get('invoices/create', [InvoiceController::class, 'create'])->name('billing.invoices.create');
    Route::post('invoices', [InvoiceController::class, 'store'])->name('billing.invoices.store');
    Route::get('invoices/{invoice}', [InvoiceController::class, 'show'])->name('billing.invoices.show');
    Route::get('invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('billing.invoices.edit');
    Route::put('invoices/{invoice}', [InvoiceController::class, 'update'])->name('billing.invoices.update');
    Route::post('invoices/{invoice}/send', [InvoiceController::class, 'send'])->name('billing.invoices.send');
    Route::post('invoices/{invoice}/mark-paid', [InvoiceController::class, 'markPaid'])->name('billing.invoices.markPaid');
    Route::delete('invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('billing.invoices.destroy');

    // Quotations
    Route::get('quotations', [QuotationController::class, 'index'])->name('billing.quotations.index');
    Route::get('quotations/create', [QuotationController::class, 'create'])->name('billing.quotations.create');
    Route::post('quotations', [QuotationController::class, 'store'])->name('billing.quotations.store');
    Route::get('quotations/{quotation}', [QuotationController::class, 'show'])->name('billing.quotations.show');
    Route::get('quotations/{quotation}/edit', [QuotationController::class, 'edit'])->name('billing.quotations.edit');
    Route::put('quotations/{quotation}', [QuotationController::class, 'update'])->name('billing.quotations.update');
    Route::post('quotations/{quotation}/accept', [QuotationController::class, 'accept'])->name('billing.quotations.accept');
    Route::post('quotations/{quotation}/decline', [QuotationController::class, 'decline'])->name('billing.quotations.decline');
    Route::post('quotations/{quotation}/convert', [QuotationController::class, 'convertToInvoice'])->name('billing.quotations.convert');
    Route::delete('quotations/{quotation}', [QuotationController::class, 'destroy'])->name('billing.quotations.destroy');

    // Customers
    Route::get('customers', [CustomerController::class, 'index'])->name('billing.customers.index');
    Route::post('customers', [CustomerController::class, 'store'])->name('billing.customers.store');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('billing.customers.show');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('billing.customers.update');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->name('billing.customers.destroy');

    // Payments
    Route::get('payments', [PaymentController::class, 'index'])->name('billing.payments.index');
    Route::post('payments', [PaymentController::class, 'store'])->name('billing.payments.store');

    // Recurring
    Route::get('recurring', [RecurringController::class, 'index'])->name('billing.recurring.index');
    Route::post('recurring/{schedule}/toggle', [RecurringController::class, 'toggle'])->name('billing.recurring.toggle');
    Route::post('recurring/{schedule}/issue', [RecurringController::class, 'issueNow'])->name('billing.recurring.issue');
    Route::delete('recurring/{schedule}', [RecurringController::class, 'destroy'])->name('billing.recurring.destroy');

    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('billing.reports.index');

    // Billing settings (company / tax / templates / etc.)
    Route::get('billing-settings', [SettingsController::class, 'index'])->name('billing.settings.index');
    Route::put('billing-settings', [SettingsController::class, 'update'])->name('billing.settings.update');
});

require __DIR__.'/settings.php';
