<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->unique();
            $table->string('company_name')->default('Eloquent Studio FZE');
            $table->string('trn')->nullable();
            $table->string('trade_license')->nullable();
            $table->text('address')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('currency', 8)->default('AED');
            $table->decimal('vat_rate', 5, 2)->default(5);
            $table->string('vat_return_period')->default('quarterly');
            $table->string('invoice_prefix')->default('INV-2026-');
            $table->unsignedInteger('next_invoice_number')->default(149);
            $table->string('quotation_prefix')->default('QUO-2026-');
            $table->unsignedInteger('next_quotation_number')->default(43);
            $table->unsignedInteger('payment_terms_days')->default(14);
            $table->string('late_fee')->default('2% per month');
            $table->text('footer_note')->nullable();
            $table->string('accent_color', 16)->default('#00ffcc');
            $table->boolean('notify_paid')->default(true);
            $table->boolean('notify_overdue')->default(true);
            $table->boolean('auto_remind')->default(false);
            $table->string('bank_name')->nullable();
            $table->string('iban')->nullable();
            $table->string('swift')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};
