import { Head } from '@inertiajs/react';
import BillingLayout from '@/billing/BillingLayout';
import { Icons } from '@/billing/icons';
import { Btn, Card, CustomerCell, PageHeader, StatTile } from '@/billing/ui';
import { formatAED, formatDate } from '@/billing/format';
import type { Payment } from '@/billing/types';

export default function Index({ payments }: { payments: Payment[] }) {
    const total = payments.reduce((s, p) => s + p.amount, 0);
    const fmt = (n: number) => Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });

    return (
        <BillingLayout active="payments" title="Payments">
            <Head title="Payments" />
            <div className="page">
                <PageHeader
                    title="Payments"
                    subtitle={`${payments.length} payments received · AED ${fmt(total)} total`}
                    actions={
                        <>
                            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
                        </>
                    }
                />

                <div className="grid-stats" style={{ marginBottom: 24 }}>
                    <StatTile label="Received total" currency="AED" value={fmt(total)} delta={`${payments.length} payments`} deltaDir="up" />
                    <StatTile label="Avg. payment time" value="11 days" delta="2 days faster" deltaDir="up" />
                    <StatTile label="Methods" value={new Set(payments.map((p) => p.method)).size + ' active'} />
                    <StatTile label="Failed / disputed" value="0" delta="All clear" deltaDir="up" />
                </div>

                <Card padding={false} title="Recent payments" action={<Btn variant="ghost" size="sm" icon={<Icons.Filter size={14} />}>Filter</Btn>}>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Payment</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Invoice</th>
                                    <th>Method</th>
                                    <th>Reference</th>
                                    <th className="right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p.id}>
                                        <td><span className="doc-id">{p.number}</span></td>
                                        <td className="muted">{formatDate(p.paid_at)}</td>
                                        <td><CustomerCell customer={p.customer} /></td>
                                        <td><span className="doc-id" style={{ fontSize: 12.5 }}>{p.invoice_number}</span></td>
                                        <td>
                                            <span className="badge badge-paid" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-2)', borderColor: 'var(--border-2)' }}>
                                                {p.method === 'Bank transfer' && <Icons.Building size={11} />}
                                                {p.method === 'Card' && <Icons.Card size={11} />}
                                                {p.method === 'Cheque' && <Icons.Receipt size={11} />}
                                                <span>{p.method}</span>
                                            </span>
                                        </td>
                                        <td className="mono muted" style={{ fontSize: 12.5 }}>{p.reference}</td>
                                        <td className="right num" style={{ color: 'var(--mint-300)' }}>{formatAED(p.amount)}</td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr><td colSpan={7} className="empty">No payments recorded yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </BillingLayout>
    );
}
