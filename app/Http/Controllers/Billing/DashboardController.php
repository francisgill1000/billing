<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Quotation;
use App\Support\Presenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $invoices = $user->invoices()->with('customer')->get();
        $quotations = $user->quotations()->get();

        $outstanding = $invoices->whereIn('status', ['sent', 'overdue', 'partial'])->sum(fn ($i) => $i->total());
        $overdueCount = $invoices->where('status', 'overdue')->count();
        $thisMonthStart = now()->startOfMonth();
        $paidThisMonth = $invoices->where('status', 'paid')
            ->filter(fn ($i) => $i->paid_date && $i->paid_date->greaterThanOrEqualTo($thisMonthStart))
            ->sum(fn ($i) => $i->total());
        $activeQuotes = $quotations->where('status', 'pending')->count();
        $pipelineValue = $quotations->where('status', 'pending')->sum(fn ($q) => $q->total());

        // Status segments for donut
        $totalCount = max(1, $invoices->count());
        $segments = [
            ['label' => 'Paid', 'value' => round($invoices->where('status', 'paid')->count() / $totalCount * 100), 'color' => '#00ffcc'],
            ['label' => 'Sent', 'value' => round($invoices->where('status', 'sent')->count() / $totalCount * 100), 'color' => '#60a5fa'],
            ['label' => 'Partial', 'value' => round($invoices->where('status', 'partial')->count() / $totalCount * 100), 'color' => '#f4b860'],
            ['label' => 'Overdue', 'value' => round($invoices->where('status', 'overdue')->count() / $totalCount * 100), 'color' => '#f87171'],
        ];

        // Revenue per month last 12
        $months = collect(range(11, 0))->map(fn ($i) => now()->subMonths($i));
        $revenueMonthly = $months->map(function ($m) use ($user) {
            $v = (int) round($user->invoices()
                ->whereYear('issue_date', $m->year)
                ->whereMonth('issue_date', $m->month)
                ->get()
                ->sum(fn ($i) => $i->total()) / 1000);

            return ['m' => $m->format('M'), 'v' => $v];
        });

        $recent = $invoices->sortByDesc('issue_date')->take(5)->values()
            ->map(fn ($i) => Presenter::invoice($i));

        return Inertia::render('billing/dashboard', [
            'stats' => [
                'outstanding' => $outstanding,
                'paid_this_month' => $paidThisMonth,
                'overdue_count' => $overdueCount,
                'active_quotes' => $activeQuotes,
                'pipeline_value' => $pipelineValue,
            ],
            'segments' => $segments,
            'revenue_monthly' => $revenueMonthly,
            'recent_invoices' => $recent,
            'greeting_name' => explode(' ', $user->name)[0],
        ]);
    }
}
