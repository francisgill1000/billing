<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanySetting extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'vat_rate' => 'decimal:2',
        'notify_paid' => 'boolean',
        'notify_overdue' => 'boolean',
        'auto_remind' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function forUser(User $user): self
    {
        return static::firstOrCreate(['user_id' => $user->id], []);
    }
}
