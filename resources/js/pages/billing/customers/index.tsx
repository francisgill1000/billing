import { Head, router } from '@inertiajs/react';
import * as React from 'react';
import BillingLayout from '@/billing/BillingLayout';
import { Icons } from '@/billing/icons';
import { Btn, Card, Field, Input, PageHeader, Toolbar } from '@/billing/ui';
import { formatAED, formatDate } from '@/billing/format';
import type { Customer } from '@/billing/types';

export default function Index({ customers }: { customers: Customer[] }) {
    const [query, setQuery] = React.useState('');
    const [showAdd, setShowAdd] = React.useState(false);
    const [form, setForm] = React.useState({ name: '', contact: '', email: '', phone: '', city: '', country: 'UAE', trn: '' });

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

            {showAdd && (
                <>
                    <div className="drawer-overlay" onClick={() => setShowAdd(false)}></div>
                    <div className="drawer">
                        <div className="drawer-header">
                            <h2>Add customer</h2>
                            <Btn variant="ghost" size="sm" icon={<Icons.X size={16} />} onClick={() => setShowAdd(false)} />
                        </div>
                        <div className="drawer-body">
                            <div style={{ display: 'grid', gap: 14 }}>
                                <Field label="Company name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                                <Field label="Primary contact"><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></Field>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                    <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
                                    <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                    <Field label="City"><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
                                    <Field label="Country"><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
                                </div>
                                <Field label="TRN"><Input value={form.trn} onChange={(e) => setForm({ ...form, trn: e.target.value })} /></Field>
                            </div>
                        </div>
                        <div className="drawer-footer">
                            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
                            <Btn variant="primary" onClick={() => router.post('/customers', form, { onSuccess: () => setShowAdd(false) })}>
                                <Icons.Check size={14} /> Add customer
                            </Btn>
                        </div>
                    </div>
                </>
            )}
        </BillingLayout>
    );
}
