<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quotation extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'issue_date' => 'date',
        'valid_until' => 'date',
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
}
