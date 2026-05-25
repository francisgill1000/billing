<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\RecurringSchedule;
use App\Support\Numbering;
use App\Support\Presenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecurringController extends Controller
{
    public function index(Request $request): Response
    {
        $schedules = $request->user()->recurringSchedules()->with('customer')->orderBy('next_date')->get()
            ->map(fn ($r) => Presenter::recurring($r));

        return Inertia::render('billing/recurring/index', [
            'schedules' => $schedules,
        ]);
    }

    public function toggle(Request $request, RecurringSchedule $schedule): RedirectResponse
    {
        abort_unless($schedule->user_id === $request->user()->id, 403);
        $schedule->update(['status' => $schedule->status === 'active' ? 'paused' : 'active']);

        return back()->with('flash', 'Schedule updated');
    }

    public function issueNow(Request $request, RecurringSchedule $schedule): RedirectResponse
    {
        abort_unless($schedule->user_id === $request->user()->id, 403);

        $invoice = $request->user()->invoices()->create([
            'customer_id' => $schedule->customer_id,
            'number' => Numbering::nextInvoiceNumber($request->user()),
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(14)->toDateString(),
            'status' => 'sent',
            'items' => $schedule->items,
            'tax_rate' => $schedule->tax_rate,
            'notes' => "Generated from recurring schedule {$schedule->number}.",
        ]);

        $schedule->update([
            'last_issued' => now()->toDateString(),
            'sent_count' => $schedule->sent_count + 1,
        ]);

        return back()->with('flash', "{$invoice->number} issued to {$schedule->customer->name}");
    }

    public function destroy(Request $request, RecurringSchedule $schedule): RedirectResponse
    {
        abort_unless($schedule->user_id === $request->user()->id, 403);
        $schedule->delete();

        return back()->with('flash', 'Schedule removed');
    }
}
