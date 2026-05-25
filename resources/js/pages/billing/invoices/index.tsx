import { Head, Link, router } from '@inertiajs/react';
import BillingLayout from '@/billing/BillingLayout';
import { Icons } from '@/billing/icons';
import { Badge, Btn, Card, CustomerCell, PageHeader, Tabs, Toolbar } from '@/billing/ui';
import { formatAED, formatDate, daysUntil } from '@/billing/format';
import type { Invoice } from '@/billing/types';
import * as React from 'react';

type Tab = 'all' | 'sent' | 'overdue' | 'partial' | 'paid' | 'draft';

export default function Index({ invoices }: { invoices: Invoice[] }) {
    const [tab, setTab] = React.useState<Tab>('all');
    const [query, setQuery] = React.useState('');

    const filtered = invoices.filter((i) => {
        if (tab !== 'all' && i.status !== tab) return false;
        if (query) {
            const q = query.toLowerCase();
            return i.number.toLowerCase().includes(q) || (i.customer && i.customer.name.toLowerCase().includes(q));
        }
        return true;
    });

    const counts: Record<Tab, number> = {
        all: invoices.length,
        sent: invoices.filter((i) => i.status === 'sent').length,
        overdue: invoices.filter((i) => i.status === 'overdue').length,
        partial: invoices.filter((i) => i.status === 'partial').length,
        paid: invoices.filter((i) => i.status === 'paid').length,
        draft: invoices.filter((i) => i.status === 'draft').length,
    };

    const total = invoices.reduce((s, i) => s + i.total, 0);

    return (
        <BillingLayout active="invoices" title="Invoices">
            <Head title="Invoices" />
            <div className="page">
                <PageHeader
                    title="Invoices"
                    subtitle={`${invoices.length} invoices · AED ${total.toLocaleString('en-AE', { maximumFractionDigits: 0 })} total`}
                    actions={
                        <>
                            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
                            <Btn variant="primary" icon={<Icons.Plus size={15} />} as="a" href="/invoices/create">New invoice</Btn>
                        </>
                    }
                />

                <Tabs<Tab>
                    tabs={[
                        { id: 'all', label: 'All', count: counts.all },
                        { id: 'sent', label: 'Sent', count: counts.sent },
                        { id: 'overdue', label: 'Overdue', count: counts.overdue },
                        { id: 'partial', label: 'Partial', count: counts.partial },
                        { id: 'paid', label: 'Paid', count: counts.paid },
                        { id: 'draft', label: 'Draft', count: counts.draft },
                    ]}
                    value={tab}
                    onChange={setTab}
                />

                <Toolbar>
                    <div className="search" style={{ width: 320 }}>
                        <Icons.Search size={14} />
                        <input placeholder="Search by invoice # or customer…" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                    <Btn variant="secondary" size="sm" icon={<Icons.Filter size={14} />}>Filter</Btn>
                    <Btn variant="secondary" size="sm" icon={<Icons.Calendar size={14} />}>Last 90 days</Btn>
                    <div className="toolbar-spacer"></div>
                    <span className="muted" style={{ fontSize: 12 }}>{filtered.length} of {invoices.length}</span>
                </Toolbar>

                <Card padding={false}>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Customer</th>
                                    <th>Issued</th>
                                    <th>Due</th>
                                    <th>Status</th>
                                    <th className="right">Amount</th>
                                    <th style={{ width: 50 }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((i) => {
                                    const dueIn = daysUntil(i.due_date);
                                    return (
                                        <tr key={i.id} style={{ cursor: 'pointer' }} onClick={() => router.visit(`/invoices/${i.id}`)}>
                                            <td><span className="doc-id">{i.number}</span></td>
                                            <td><CustomerCell customer={i.customer} /></td>
                                            <td className="muted">{formatDate(i.issue_date)}</td>
                                            <td>
                                                <div style={{ color: i.status === 'overdue' ? '#fca5a5' : 'var(--text-2)' }}>{formatDate(i.due_date)}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-4)' }}>
                                                    {i.status === 'overdue' ? `${Math.abs(dueIn)}d overdue` : i.status === 'sent' && dueIn >= 0 ? `in ${dueIn}d` : ''}
                                                </div>
                                            </td>
                                            <td><Badge status={i.status} /></td>
                                            <td className="right num">{formatAED(i.total)}</td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <Btn variant="ghost" size="sm" icon={<Icons.More size={16} />} />
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={7} className="empty">No invoices match your filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </BillingLayout>
    );
}
