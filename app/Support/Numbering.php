<?php

namespace App\Support;

use App\Models\CompanySetting;
use App\Models\User;

class Numbering
{
    public static function nextInvoiceNumber(User $user): string
    {
        $settings = CompanySetting::forUser($user);
        $num = $settings->next_invoice_number;
        $settings->update(['next_invoice_number' => $num + 1]);

        return $settings->invoice_prefix.str_pad((string) $num, 4, '0', STR_PAD_LEFT);
    }

    public static function nextQuotationNumber(User $user): string
    {
        $settings = CompanySetting::forUser($user);
        $num = $settings->next_quotation_number;
        $settings->update(['next_quotation_number' => $num + 1]);

        return $settings->quotation_prefix.str_pad((string) $num, 4, '0', STR_PAD_LEFT);
    }

    public static function nextPaymentNumber(User $user): string
    {
        $count = $user->payments()->count();

        return 'PAY-'.str_pad((string) (1043 + $count), 4, '0', STR_PAD_LEFT);
    }

    public static function nextRecurringNumber(User $user): string
    {
        $count = $user->recurringSchedules()->count();

        return 'REC-'.str_pad((string) ($count + 1), 3, '0', STR_PAD_LEFT);
    }
}
