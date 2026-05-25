import { Head, router } from '@inertiajs/react';
import BillingLayout from '@/billing/BillingLayout';
import { Icons } from '@/billing/icons';
import { Badge, Btn, Card, CustomerCell, PageHeader, StatTile } from '@/billing/ui';
import { formatAED, formatDate, daysUntil } from '@/billing/format';
import type { RecurringSchedule } from '@/billing/types';

export default function Index({ schedules }: { schedules: RecurringSchedule[] }) {
    const active = schedules.filter((s) => s.status === 'active');
    const monthly = active.reduce((s, r) => {
        const factor =
            r.frequency === 'monthly' ? 1 : r.frequency === 'quarterly' ? 1 / 3 : r.frequency === 'yearly' ? 1 / 12 : r.frequency === 'weekly' ? 4.33 : 1;
        return s + r.total * factor;
    }, 0);

    return (
        <BillingLayout active="recurring" title="Recurring">
            <Head title="Recurring" />
            <div className="page">
                <PageHeader
                    title="Recurring"
                    subtitle={`${active.length} active schedules · AED ${Math.round(monthly).toLocaleString('en-AE')} per month, automated`}
                    actions={
                        <>
                            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
                            <Btn variant="primary" icon={<Icons.Plus size={15} />}>New schedule</Btn>
                        </>
                    }
                />

                <div className="grid-stats" style={{ marginBottom: 24 }}>
                    <StatTile label="Monthly run-rate" currency="AED" value={Math.round(monthly).toLocaleString('en-AE')} delta={`${active.length} schedules`} deltaDir="up" />
                    <StatTile label="Issued automatically" value={`${active.length} invoices`} delta="this period" deltaDir="up" />
                    <StatTile label="Paused" value={schedules.filter((s) => s.status === 'paused').length} />
                    <StatTile label="Next run" value={active[0]?.next_date ? formatDate(active[0].next_date) : '—'} />
                </div>

                <Card padding={false}>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Schedule</th>
                                    <th>Customer</th>
                                    <th>Description</th>
                                    <th>Frequency</th>
                                    <th>Next issue</th>
                                    <th>Status</th>
                                    <th className="right">Amount</th>
                                    <th style={{ width: 140 }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((r) => {
                                    const desc =
                                        r.items.length === 1
                                            ? r.items[0].description
                                            : `${r.items[0]?.description ?? ''} · +${r.items.length - 1} more`;
                                    return (
                                        <tr key={r.id}>
                                            <td><span className="doc-id">{r.number}</span></td>
                                            <td><CustomerCell customer={r.customer} /></td>
                                            <td style={{ color: 'var(--text-2)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</td>
                                            <td>
                                                <span className="badge badge-draft" style={{ textTransform: 'capitalize' }}>
                                                    <Icons.Repeat size={11} />
                                                    <span>{r.frequency}</span>
                                                </span>
                                            </td>
                                            <td>
                                                {r.next_date ? (
                                                    <>
                                                        <div style={{ color: 'var(--text-1)' }}>{formatDate(r.next_date)}</div>
                                                        <div style={{ fontSize: 11, color: 'var(--text-4)' }}>in {daysUntil(r.next_date)} days</div>
                                                    </>
                                                ) : (
                                                    <span className="muted">—</span>
                                                )}
                                            </td>
                                            <td><Badge status={r.status} /></td>
                                            <td className="right num">{formatAED(r.total)}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                    {r.status === 'active' && (
                                                        <Btn
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<Icons.Send size={13} />}
                                                            title="Issue now"
                                                            onClick={() => router.post(`/recurring/${r.id}/issue`, {}, { preserveScroll: true })}
                                                        />
                                                    )}
                                                    <Btn
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={r.status === 'active' ? <Icons.Pause size={13} /> : <Icons.Play size={13} />}
                                                        title={r.status === 'active' ? 'Pause' : 'Resume'}
                                                        onClick={() => router.post(`/recurring/${r.id}/toggle`, {}, { preserveScroll: true })}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </BillingLayout>
    );
}
