import { Head, Link, router } from '@inertiajs/react';
import * as React from 'react';
import BillingLayout from '@/billing/BillingLayout';
import { Icons } from '@/billing/icons';
import { Badge, Btn, Card, StatTile, Tabs } from '@/billing/ui';
import { formatAED, formatDate } from '@/billing/format';
import type { Customer, Invoice, Payment, Quotation } from '@/billing/types';

type Props = {
    customer: Customer;
    stats: { total: number; paid: number; outstanding: number; paid_count: number };
    invoices: Invoice[];
    quotations: Quotation[];
    payments: Payment[];
};

type Tab = 'invoices' | 'quotations' | 'payments';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-1)' }}>
            <span style={{ color: 'var(--text-4)', fontSize: 12 }}>{label}</span>
            <span style={{ color: 'var(--text-1)', textAlign: 'right' }}>{value}</span>
        </div>
    );
}

export default function Show({ customer, stats, invoices, quotations, payments }: Props) {
    const [tab, setTab] = React.useState<Tab>('invoices');

    return (
        <BillingLayout active="customers" title={customer.name} crumb={<Link href="/customers">Customers</Link>}>
            <Head title={customer.name} />
            <div className="page">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <Btn variant="ghost" size="sm" icon={<Icons.ChevronLeft size={14} />} as="a" href="/customers">Back to customers</Btn>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div className="cust-avatar" style={{ width: 56, height: 56, fontSize: 18, borderRadius: 12 }}>{customer.initials}</div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 26, letterSpacing: '-0.025em', fontWeight: 600 }}>{customer.name}</h1>
                            <div style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 4, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                                {customer.contact && <span>{customer.contact}</span>}
                                {customer.contact && customer.email && <span style={{ color: 'var(--text-5)' }}>·</span>}
                                {customer.email && <span>{customer.email}</span>}
                                {customer.city && <><span style={{ color: 'var(--text-5)' }}>·</span><span>{customer.city}, {customer.country}</span></>}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Btn variant="secondary" icon={<Icons.Mail size={15} />}>Email</Btn>
                        <Btn variant="secondary" icon={<Icons.Edit size={15} />}>Edit</Btn>
                        <Btn variant="primary" icon={<Icons.Plus size={15} />} onClick={() => router.visit('/invoices/create')}>New invoice</Btn>
                    </div>
                </div>

                <div className="grid-stats" style={{ marginBottom: 24 }}>
                    <StatTile label="Lifetime value" currency="AED" value={Number(stats.total).toLocaleString('en-AE', { maximumFractionDigits: 0 })} />
                    <StatTile label="Paid" currency="AED" value={Number(stats.paid).toLocaleString('en-AE', { maximumFractionDigits: 0 })} delta={`${stats.paid_count} invoices`} deltaDir="flat" />
                    <StatTile label="Outstanding" currency="AED" value={Number(stats.outstanding).toLocaleString('en-AE', { maximumFractionDigits: 0 })} delta={stats.outstanding > 0 ? 'Action required' : 'All clear'} deltaDir={stats.outstanding > 0 ? 'down' : 'up'} />
                    <StatTile label="Customer since" value={customer.since ? new Date(customer.since).getFullYear() : '—'} />
                </div>

                <div className="bil-stack-mobile" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                    <div>
                        <Tabs<Tab>
                            tabs={[
                                { id: 'invoices', label: 'Invoices', count: invoices.length },
                                { id: 'quotations', label: 'Quotations', count: quotations.length },
                                { id: 'payments', label: 'Payments', count: payments.length },
                            ]}
                            value={tab}
                            onChange={setTab}
                        />
                        <Card padding={false}>
                            <div className="table-wrap">
                                {tab === 'invoices' && (
                                    <table className="table">
                                        <thead><tr><th>Invoice</th><th>Issued</th><th>Due</th><th>Status</th><th className="right">Amount</th></tr></thead>
                                        <tbody>
                                            {invoices.map((i) => (
                                                <tr key={i.id} onClick={() => router.visit(`/invoices/${i.id}`)} style={{ cursor: 'pointer' }}>
                                                    <td><span className="doc-id">{i.number}</span></td>
                                                    <td className="muted">{formatDate(i.issue_date)}</td>
                                                    <td className="muted">{formatDate(i.due_date)}</td>
                                                    <td><Badge status={i.status} /></td>
                                                    <td className="right num">{formatAED(i.total)}</td>
                                                </tr>
                                            ))}
                                            {invoices.length === 0 && <tr><td colSpan={5} className="empty">No invoices yet.</td></tr>}
                                        </tbody>
                                    </table>
                                )}
                                {tab === 'quotations' && (
                                    <table className="table">
                                        <thead><tr><th>Quotation</th><th>Issued</th><th>Valid until</th><th>Status</th><th className="right">Amount</th></tr></thead>
                                        <tbody>
                                            {quotations.map((q) => (
                                                <tr key={q.id} onClick={() => router.visit(`/quotations/${q.id}`)} style={{ cursor: 'pointer' }}>
                                                    <td><span className="doc-id">{q.number}</span></td>
                                                    <td className="muted">{formatDate(q.issue_date)}</td>
                                                    <td className="muted">{formatDate(q.valid_until)}</td>
                                                    <td><Badge status={q.status} /></td>
                                                    <td className="right num">{formatAED(q.total)}</td>
                                                </tr>
                                            ))}
                                            {quotations.length === 0 && <tr><td colSpan={5} className="empty">No quotations yet.</td></tr>}
                                        </tbody>
                                    </table>
                                )}
                                {tab === 'payments' && (
                                    <table className="table">
                                        <thead><tr><th>Payment</th><th>Date</th><th>Method</th><th>Reference</th><th className="right">Amount</th></tr></thead>
                                        <tbody>
                                            {payments.map((p) => (
                                                <tr key={p.id}>
                                                    <td><span className="doc-id">{p.number}</span></td>
                                                    <td className="muted">{formatDate(p.paid_at)}</td>
                                                    <td className="muted">{p.method}</td>
                                                    <td className="mono muted" style={{ fontSize: 12 }}>{p.reference}</td>
                                                    <td className="right num">{formatAED(p.amount)}</td>
                                                </tr>
                                            ))}
                                            {payments.length === 0 && <tr><td colSpan={5} className="empty">No payments yet.</td></tr>}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Card title="Details">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
                                {customer.contact && <DetailRow label="Primary contact" value={customer.contact} />}
                                {customer.email && <DetailRow label="Email" value={customer.email} />}
                                {customer.phone && <DetailRow label="Phone" value={customer.phone} />}
                                {customer.trn && <DetailRow label="TRN" value={<span className="mono">{customer.trn}</span>} />}
                                {customer.city && <DetailRow label="Address" value={<>{customer.city}, {customer.country}</>} />}
                                <DetailRow label="Customer since" value={formatDate(customer.since)} />
                            </div>
                        </Card>
                        {customer.notes && (
                            <Card title="Notes">
                                <div style={{ color: 'var(--text-3)', fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-line' }}>{customer.notes}</div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </BillingLayout>
    );
}
