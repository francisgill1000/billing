import { Head, Link, router } from '@inertiajs/react';
import BillingLayout from '@/billing/BillingLayout';
import InvoicePaper from '@/billing/InvoicePaper';
import { Icons } from '@/billing/icons';
import { Badge, Btn, Card, CustomerCell } from '@/billing/ui';
import { formatAED, formatDate } from '@/billing/format';
import type { CompanySettings, Quotation } from '@/billing/types';

export default function Show({ quotation, company }: { quotation: Quotation; company: CompanySettings }) {
    const cust = quotation.customer!;

    return (
        <BillingLayout active="quotations" title={quotation.number} crumb={<Link href="/quotations">Quotations</Link>}>
            <Head title={quotation.number} />
            <div className="page">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <Btn variant="ghost" size="sm" icon={<Icons.ChevronLeft size={14} />} as="a" href="/quotations">Back to quotations</Btn>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                            <h1 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.025em', fontWeight: 600 }}>{quotation.number}</h1>
                            <Badge status={quotation.status} />
                        </div>
                        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>
                            Issued {formatDate(quotation.issue_date)} · Valid until {formatDate(quotation.valid_until)}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Btn variant="ghost" icon={<Icons.Download size={15} />}>PDF</Btn>
                        <Btn variant="ghost" icon={<Icons.Edit size={15} />} as="a" href={`/quotations/${quotation.id}/edit`}>Edit</Btn>
                        {quotation.status === 'pending' && (
                            <>
                                <Btn variant="danger" icon={<Icons.X size={15} />} onClick={() => router.post(`/quotations/${quotation.id}/decline`, {}, { preserveScroll: true })}>Mark declined</Btn>
                                <Btn variant="primary" icon={<Icons.Check size={15} />} onClick={() => router.post(`/quotations/${quotation.id}/accept`, {}, { preserveScroll: true })}>Mark accepted</Btn>
                            </>
                        )}
                        {quotation.status === 'accepted' && (
                            <Btn variant="primary" icon={<Icons.Invoice size={15} />} onClick={() => router.post(`/quotations/${quotation.id}/convert`)}>Convert to invoice</Btn>
                        )}
                    </div>
                </div>

                <div className="bil-stack-mobile" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                    <InvoicePaper doc={quotation} company={company} kind="quote" />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Card title="Summary">
                            <div className="kpi-row"><span className="kpi-label">Subtotal</span><span className="kpi-value num">{formatAED(quotation.subtotal)}</span></div>
                            <div className="kpi-row"><span className="kpi-label">VAT ({quotation.tax_rate}%)</span><span className="kpi-value num">{formatAED(quotation.tax)}</span></div>
                            <div className="kpi-row" style={{ borderTop: '1px solid var(--border-2)', marginTop: 6, paddingTop: 14 }}>
                                <span className="kpi-label" style={{ color: 'var(--text-1)', fontWeight: 500 }}>Total</span>
                                <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--mint-300)' }} className="num">{formatAED(quotation.total)}</span>
                            </div>
                        </Card>
                        <Card title="Customer">
                            <CustomerCell customer={cust} />
                            <div className="divider"></div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-2)' }}>
                                {cust.email && <div style={{ display: 'flex', gap: 8 }}><Icons.Mail size={13} /><span>{cust.email}</span></div>}
                                {cust.phone && <div style={{ display: 'flex', gap: 8 }}><Icons.Phone size={13} /><span>{cust.phone}</span></div>}
                                {cust.city && <div style={{ display: 'flex', gap: 8 }}><Icons.Building size={13} /><span>{cust.city}, {cust.country}</span></div>}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </BillingLayout>
    );
}
