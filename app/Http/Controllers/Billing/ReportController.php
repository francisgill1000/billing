<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $invoices = $user->invoices()->with('customer')->get();

        $months = collect(range(11, 0))->map(fn ($i) => now()->subMonths($i));
        $revenueMonthly = $months->map(function ($m) use ($user) {
            $v = (int) round($user->invoices()
                ->whereYear('issue_date', $m->year)
                ->whereMonth('issue_date', $m->month)
                ->get()
                ->sum(fn ($i) => $i->total()) / 1000);

            return ['m' => $m->format('M'), 'v' => $v];
        });

        $totalYTD = $revenueMonthly->sum('v') * 1000;
        $lastQuarter = $revenueMonthly->slice(-3)->sum('v') * 1000;
        $avgInvoice = $invoices->count() ? $invoices->sum(fn ($i) => $i->total()) / $invoices->count() : 0;
        $paidCount = $invoices->where('status', 'paid')->count();
        $totalCount = max(1, $invoices->count());
        $collectionRate = round($paidCount / $totalCount * 100);

        $topCustomers = $user->customers()->with('invoices')->get()
            ->map(function ($c) {
                return [
                    'name' => $c->name,
                    'amount' => $c->invoices->sum(fn ($i) => $i->total()),
                ];
            })
            ->sortByDesc('amount')
            ->take(5)
            ->values();

        $totalTop = max(1, $topCustomers->sum('amount'));
        $topCustomers = $topCustomers->map(fn ($t) => array_merge($t, [
            'share' => round($t['amount'] / $totalTop * 100),
        ]));

        $today = now();
        $aging = [
            ['bucket' => 'Current', 'amount' => 0.0, 'color' => '#00ffcc'],
            ['bucket' => '1–30 days', 'amount' => 0.0, 'color' => '#60a5fa'],
            ['bucket' => '31–60 days', 'amount' => 0.0, 'color' => '#f4b860'],
            ['bucket' => '60+ days', 'amount' => 0.0, 'color' => '#f87171'],
        ];
        foreach ($invoices->whereNotIn('status', ['paid', 'draft']) as $i) {
            $daysOver = $today->diffInDays($i->due_date, false) * -1;
            $bucket = $daysOver <= 0 ? 0 : ($daysOver <= 30 ? 1 : ($daysOver <= 60 ? 2 : 3));
            $aging[$bucket]['amount'] += $i->total();
        }

        $taxableSales = $invoices->whereIn('status', ['sent', 'paid', 'partial'])->sum(fn ($i) => $i->subtotal());
        $vatCollected = $invoices->whereIn('status', ['sent', 'paid', 'partial'])->sum(fn ($i) => $i->taxAmount());

        return Inertia::render('billing/reports/index', [
            'stats' => [
                'revenue_ytd' => $totalYTD,
                'last_quarter' => $lastQuarter,
                'avg_invoice' => round($avgInvoice),
                'collection_rate' => $collectionRate,
            ],
            'revenue_monthly' => $revenueMonthly,
            'aging' => $aging,
            'top_customers' => $topCustomers,
            'tax' => [
                'taxable_sales' => $taxableSales,
                'vat_collected' => round($vatCollected, 2),
                'input_vat' => 0,
                'net_payable' => round($vatCollected, 2),
            ],
        ]);
    }
}
