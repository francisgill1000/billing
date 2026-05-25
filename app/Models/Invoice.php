<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'paid_date' => 'date',
        'items' => 'array',
        'tax_rate' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function subtotal(): float
    {
        return collect($this->items ?? [])->sum(fn ($it) => (float) ($it['qty'] ?? 0) * (float) ($it['price'] ?? 0));
    }

    public function taxAmount(): float
    {
        return round($this->subtotal() * ((float) $this->tax_rate) / 100, 2);
    }

    public function total(): float
    {
        return round($this->subtotal() + $this->taxAmount(), 2);
    }

    public function amountPaid(): float
    {
        return (float) $this->payments()->sum('amount');
    }

    public function balance(): float
    {
        return round($this->total() - $this->amountPaid(), 2);
    }
}
