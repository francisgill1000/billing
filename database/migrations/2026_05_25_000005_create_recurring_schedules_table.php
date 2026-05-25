<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recurring_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('number')->unique();
            $table->string('frequency'); // monthly, quarterly, yearly, weekly
            $table->date('next_date')->nullable();
            $table->string('status')->default('active'); // active, paused
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->json('items');
            $table->decimal('tax_rate', 5, 2)->default(5);
            $table->date('last_issued')->nullable();
            $table->unsignedInteger('sent_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recurring_schedules');
    }
};
