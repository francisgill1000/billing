<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('number')->unique();
            $table->date('issue_date');
            $table->date('due_date');
            $table->string('status')->default('draft'); // draft, sent, overdue, partial, paid
            $table->date('paid_date')->nullable();
            $table->json('items'); // [{description, qty, price}]
            $table->decimal('tax_rate', 5, 2)->default(5);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'issue_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
