import { Head, router } from '@inertiajs/react';
import * as React from 'react';
import BillingLayout from '@/billing/BillingLayout';
import { Icons } from '@/billing/icons';
import { Badge, Btn, Card, CustomerCell, PageHeader, Tabs } from '@/billing/ui';
import { formatAED, formatDate } from '@/billing/format';
import type { Quotation } from '@/billing/types';

type Tab = 'all' | 'pending' | 'accepted' | 'declined';

export default function Index({ quotations }: { quotations: Quotation[] }) {
    const [tab, setTab] = React.useState<Tab>('all');
    const filtered = quotations.filter((q) => tab === 'all' || q.status === tab);
    const counts: Record<Tab, number> = {
        all: quotations.length,
        pending: quotations.filter((q) => q.status === 'pending').length,
        accepted: quotations.filter((q) => q.status === 'accepted').length,
        declined: quotations.filter((q) => q.status === 'declined').length,
    };
    const pipeline = quotations.filter((q) => q.status === 'pending').reduce((s, q) => s + q.total, 0);

    return (
        <BillingLayout active="quotations" title="Quotations">
            <Head title="Quotations" />
            <div className="page">
                <PageHeader
                    title="Quotations"
                    subtitle={`${counts.pending} pending · AED ${pipeline.toLocaleString('en-AE', { maximumFractionDigits: 0 })} in pipeline`}
                    actions={
                        <>
                            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
                            <Btn variant="primary" icon={<Icons.Plus size={15} />} as="a" href="/quotations/create">New quotation</Btn>
                        </>
                    }
                />

                <Tabs<Tab>
                    tabs={[
                        { id: 'all', label: 'All', count: counts.all },
                        { id: 'pending', label: 'Pending', count: counts.pending },
                        { id: 'accepted', label: 'Accepted', count: counts.accepted },
                        { id: 'declined', label: 'Declined', count: counts.declined },
                    ]}
                    value={tab}
                    onChange={setTab}
                />

                <Card padding={false}>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Quotation</th>
                                    <th>Customer</th>
                                    <th>Issued</th>
                                    <th>Valid until</th>
                                    <th>Status</th>
                                    <th className="right">Amount</th>
                                    <th style={{ width: 130 }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((q) => (
                                    <tr key={q.id} style={{ cursor: 'pointer' }} onClick={() => router.visit(`/quotations/${q.id}`)}>
                                        <td><span className="doc-id">{q.number}</span></td>
                                        <td><CustomerCell customer={q.customer} /></td>
                                        <td className="muted">{formatDate(q.issue_date)}</td>
                                        <td className="muted">{formatDate(q.valid_until)}</td>
                                        <td><Badge status={q.status} /></td>
                                        <td className="right num">{formatAED(q.total)}</td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            {q.status === 'accepted' ? (
                                                <Btn
                                                    variant="secondary"
                                                    size="sm"
                                                    icon={<Icons.ChevronRight size={13} />}
                                                    onClick={() => router.post(`/quotations/${q.id}/convert`)}
                                                >
                                                    Convert
                                                </Btn>
                                            ) : (
                                                <Btn variant="ghost" size="sm" icon={<Icons.More size={16} />} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={7} className="empty">No quotations here yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </BillingLayout>
    );
}
