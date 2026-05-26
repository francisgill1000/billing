import { Head, router } from '@inertiajs/react';
import * as React from 'react';
import AddCustomerDrawer from '@/billing/AddCustomerDrawer';
import BillingLayout from '@/billing/BillingLayout';
import { Icons } from '@/billing/icons';
import { Btn, Card, PageHeader, Toolbar } from '@/billing/ui';
import { formatAED, formatDate } from '@/billing/format';
import type { Customer } from '@/billing/types';

export default function Index({ customers }: { customers: Customer[] }) {
    const [query, setQuery] = React.useState('');
    const [showAdd, setShowAdd] = React.useState(false);

    const filtered = customers.filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()));
    const totalOutstanding = customers.reduce((s, c) => s + (c.outstanding ?? 0), 0);

    return (
        <BillingLayout active="customers" title="Customers">
            <Head title="Customers" />
            <div className="page">
                <PageHeader
                    title="Customers"
                    subtitle={`${customers.length} customers · AED ${totalOutstanding.toLocaleString('en-AE', { maximumFractionDigits: 0 })} outstanding`}
                    actions={
                        <>
                            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
                            <Btn variant="primary" icon={<Icons.Plus size={15} />} onClick={() => setShowAdd(true)}>Add customer</Btn>
                        </>
                    }
                />

                <Toolbar>
                    <div className="search" style={{ width: 320 }}>
                        <Icons.Search size={14} />
                        <input placeholder="Search customers…" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                    <Btn variant="secondary" size="sm" icon={<Icons.Filter size={14} />}>Filter</Btn>
                    <div className="toolbar-spacer"></div>
                </Toolbar>

                <Card padding={false}>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Contact</th>
                                    <th>Location</th>
                                    <th className="right">Invoices</th>
                                    <th className="right">Outstanding</th>
                                    <th className="right">Lifetime</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((c) => (
                                    <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => router.visit(`/customers/${c.id}`)}>
                                        <td>
                                            <div className="cust-row">
                                                <div className="cust-avatar">{c.initials}</div>
                                                <div>
                                                    <div className="cust-name">{c.name}</div>
                                                    <div className="cust-sub">Since {formatDate(c.since)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ color: 'var(--text-1)' }}>{c.contact}</div>
                                            <div style={{ color: 'var(--text-4)', fontSize: 12 }}>{c.email}</div>
                                        </td>
                                        <td className="muted">{c.city}{c.city && ', '}{c.country}</td>
                                        <td className="right num">{c.invoice_count ?? 0}</td>
                                        <td className="right num" style={{ color: (c.outstanding ?? 0) > 0 ? '#fca5a5' : 'var(--text-3)' }}>
                                            {(c.outstanding ?? 0) > 0 ? formatAED(c.outstanding!) : '—'}
                                        </td>
                                        <td className="right num" style={{ color: 'var(--text-1)' }}>{formatAED(c.total ?? 0)}</td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={6} className="empty">No customers yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <AddCustomerDrawer open={showAdd} onClose={() => setShowAdd(false)} />
        </BillingLayout>
    );
}
