import { Head, Link, router } from '@inertiajs/react';
import * as React from 'react';
import BillingLayout from '@/billing/BillingLayout';
import InvoicePaper from '@/billing/InvoicePaper';
import RecordPaymentDrawer from '@/billing/RecordPaymentDrawer';
import { Icons } from '@/billing/icons';
import { Badge, Btn, Card, CustomerCell } from '@/billing/ui';
import { formatAED, formatDate } from '@/billing/format';
import type { CompanySettings, Invoice } from '@/billing/types';

function MiniActivity({ icon, mint, text }: { icon: React.ReactNode; mint?: boolean; text: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-1)', fontSize: 13 }}>
            <div className={`activity-dot ${mint ? 'mint' : ''}`} style={{ width: 24, height: 24 }}>{icon}</div>
            <div style={{ color: 'var(--text-2)', flex: 1 }}>{text}</div>
        </div>
    );
}

export default function Show({ invoice, company }: { invoice: Invoice; company: CompanySettings }) {
    const [showPayDrawer, setShowPayDrawer] = React.useState(false);
    const cust = invoice.customer!;

    return (
        <BillingLayout active="invoices" title={invoice.number} crumb={<Link href="/invoices">Invoices</Link>}>
            <Head title={invoice.number} />
            <div className="page">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <Btn variant="ghost" size="sm" icon={<Icons.ChevronLeft size={14} />} as="a" href="/invoices">Back to invoices</Btn>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                            <h1 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.025em', fontWeight: 600 }}>{invoice.number}</h1>
                            <Badge status={invoice.status} />
                        </div>
                        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>
                            Issued {formatDate(invoice.issue_date)} · Due {formatDate(invoice.due_date)}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <Btn variant="ghost" icon={<Icons.ExternalLink size={15} />} as="a" href={`/pay/${invoice.number}`}>Preview portal</Btn>
                        <Btn variant="ghost" icon={<Icons.Download size={15} />}>PDF</Btn>
                        <Btn variant="ghost" icon={<Icons.Edit size={15} />} as="a" href={`/invoices/${invoice.id}/edit`}>Edit</Btn>
                        {invoice.status !== 'paid' && (
                            <Btn variant="secondary" icon={<Icons.Send size={15} />} onClick={() => router.post(`/invoices/${invoice.id}/send`, {}, { preserveScroll: true })}>Send</Btn>
                        )}
                        {invoice.status !== 'paid' && (
                            <Btn variant="primary" icon={<Icons.Wallet size={15} />} onClick={() => setShowPayDrawer(true)}>Record payment</Btn>
                        )}
                        {invoice.status === 'paid' && (
                            <Btn variant="secondary" icon={<Icons.Receipt size={15} />}>Receipt</Btn>
                        )}
                    </div>
                </div>

                <div className="bil-stack-mobile" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                    <InvoicePaper doc={invoice} company={company} kind="invoice" />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Card title="Summary">
                            <div className="kpi-row">
                                <span className="kpi-label">Subtotal</span>
                                <span className="kpi-value num">{formatAED(invoice.subtotal)}</span>
                            </div>
                            <div className="kpi-row">
                                <span className="kpi-label">VAT ({invoice.tax_rate}%)</span>
                                <span className="kpi-value num">{formatAED(invoice.tax)}</span>
                            </div>
                            <div className="kpi-row">
                                <span className="kpi-label">Paid</span>
                                <span className="kpi-value num">{formatAED(invoice.amount_paid)}</span>
                            </div>
                            <div className="kpi-row" style={{ borderTop: '1px solid var(--border-2)', marginTop: 6, paddingTop: 14 }}>
                                <span className="kpi-label" style={{ color: 'var(--text-1)', fontWeight: 500 }}>Balance</span>
                                <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--mint-300)' }} className="num">{formatAED(invoice.balance)}</span>
                            </div>
                        </Card>

                        <Card title="Customer">
                            <CustomerCell customer={cust} />
                            <div className="divider"></div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-2)' }}>
                                {cust.email && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icons.Mail size={13} /><span>{cust.email}</span></div>}
                                {cust.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icons.Phone size={13} /><span>{cust.phone}</span></div>}
                                {cust.city && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icons.Building size={13} /><span>{cust.city}, {cust.country}</span></div>}
                                {cust.trn && <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', fontSize: 12 }}><span>TRN</span><span>{cust.trn}</span></div>}
                            </div>
                        </Card>

                        <Card title="Activity">
                            <div className="activity">
                                {invoice.status === 'paid' && (
                                    <MiniActivity icon={<Icons.Check size={13} />} mint text={<>Marked as paid · {formatDate(invoice.paid_date)}</>} />
                                )}
                                <MiniActivity icon={<Icons.Eye size={13} />} text="Customer viewed" />
                                <MiniActivity icon={<Icons.Send size={13} />} text={<>Sent via email · {formatDate(invoice.issue_date)}</>} />
                                <MiniActivity icon={<Icons.Plus size={13} />} text={<>Created · {formatDate(invoice.issue_date)}</>} />
                            </div>
                        </Card>

                        {invoice.status !== 'paid' && (
                            <Card title="Actions">
                                <Btn variant="secondary" size="sm" onClick={() => router.post(`/invoices/${invoice.id}/mark-paid`, {}, { preserveScroll: true })}>
                                    <Icons.Check size={14} /> Mark as paid
                                </Btn>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
            <RecordPaymentDrawer open={showPayDrawer} invoice={invoice} onClose={() => setShowPayDrawer(false)} />
        </BillingLayout>
    );
}
