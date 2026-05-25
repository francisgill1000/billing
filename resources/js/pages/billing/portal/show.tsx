import { Head } from '@inertiajs/react';
import { Icons, Logo } from '@/billing/icons';
import { Badge, Btn } from '@/billing/ui';
import { formatAED, formatDate } from '@/billing/format';
import type { CompanySettings, Invoice } from '@/billing/types';

export default function Portal({ invoice, company }: { invoice: Invoice; company: CompanySettings }) {
    const cust = invoice.customer!;
    const isPaid = invoice.status === 'paid';

    return (
        <div className="billing-root">
            <Head title={`Invoice ${invoice.number}`} />
            <div className="portal-shell">
                <div className="portal-card">
                    <div className="portal-banner">
                        <Icons.Shield size={14} />
                        <span>
                            Secure invoice portal · <strong style={{ color: 'var(--mint-100)' }}>{typeof window !== 'undefined' ? window.location.host : ''}/pay/{invoice.number.toLowerCase()}</strong>
                        </span>
                    </div>

                    <div style={{ padding: '36px 44px 28px', borderBottom: '1px solid var(--border-1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div className="brand-mark" style={{ width: 30, height: 30 }}><Logo size={20} /></div>
                            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--mint-300)', letterSpacing: '-0.02em' }}>{company.company_name}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 6 }}>Invoice {invoice.number}</div>
                                <h1 style={{ margin: 0, fontSize: 38, fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--text-1)' }}>
                                    <span style={{ fontSize: 18, color: 'var(--text-3)', fontWeight: 500, marginRight: 6 }}>AED</span>
                                    <span className="num">{Number(invoice.total).toLocaleString('en-AE', { minimumFractionDigits: 2 })}</span>
                                </h1>
                                <div style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 8 }}>
                                    {isPaid ? `Paid in full on ${formatDate(invoice.paid_date)}` : `Due by ${formatDate(invoice.due_date)}`}
                                </div>
                            </div>
                            <Badge status={invoice.status} />
                        </div>
                    </div>

                    {!isPaid && (
                        <div style={{ padding: '24px 44px', borderBottom: '1px solid var(--border-1)' }}>
                            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 14 }}>Pay this invoice</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <button className="portal-pay" type="button">
                                    <div className="icon-box"><Icons.Card size={18} /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>Pay with card</div>
                                        <div className="sub">Visa, Mastercard, Amex · instant confirmation</div>
                                    </div>
                                    <Icons.ChevronRight size={16} style={{ color: 'var(--text-4)' }} />
                                </button>
                                <button className="portal-pay" type="button">
                                    <div className="icon-box"><Icons.Building size={18} /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>Bank transfer</div>
                                        <div className="sub">IBAN {company.iban} · 1–2 business days</div>
                                    </div>
                                    <Icons.ChevronRight size={16} style={{ color: 'var(--text-4)' }} />
                                </button>
                                <button className="portal-pay" type="button">
                                    <div className="icon-box"><Icons.Wallet size={18} /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>Apple Pay · Google Pay</div>
                                        <div className="sub">Pay from your device in seconds</div>
                                    </div>
                                    <Icons.ChevronRight size={16} style={{ color: 'var(--text-4)' }} />
                                </button>
                            </div>
                        </div>
                    )}

                    {isPaid && (
                        <div style={{ padding: '24px 44px', borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--mint-soft)', border: '1px solid var(--border-mint)', display: 'grid', placeItems: 'center', color: 'var(--mint-300)' }}>
                                <Icons.Check size={20} />
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-1)', fontWeight: 500, fontSize: 15 }}>Payment received — thank you.</div>
                                <div style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>A receipt has been emailed to {cust.email}.</div>
                            </div>
                            <Btn variant="secondary" size="sm" icon={<Icons.Download size={13} />} style={{ marginLeft: 'auto' }}>Receipt</Btn>
                        </div>
                    )}

                    <div style={{ padding: '28px 44px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
                            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)' }}>What you're paying for</div>
                            <Btn variant="ghost" size="sm" icon={<Icons.Download size={13} />}>Download PDF</Btn>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {invoice.items.map((it, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border-1)' }}>
                                        <td style={{ padding: '12px 0', color: 'var(--text-1)', fontSize: 14 }}>
                                            {it.description}
                                            {it.qty > 1 && <span style={{ color: 'var(--text-4)', marginLeft: 8, fontSize: 12.5 }}>× {it.qty}</span>}
                                        </td>
                                        <td className="num" style={{ padding: '12px 0', textAlign: 'right', color: 'var(--text-1)', fontSize: 14 }}>{formatAED(it.qty * it.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
                            <div style={{ width: 260 }}>
                                <div className="totals-row"><span>Subtotal</span><span className="num">{formatAED(invoice.subtotal)}</span></div>
                                <div className="totals-row"><span>VAT ({invoice.tax_rate}%)</span><span className="num">{formatAED(invoice.tax)}</span></div>
                                <div className="totals-row grand"><span>Total</span><span className="num">{formatAED(invoice.total)}</span></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '20px 44px', borderTop: '1px solid var(--border-1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, fontSize: 12.5 }}>
                        <div>
                            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8 }}>Billed to</div>
                            <div style={{ color: 'var(--text-1)', fontWeight: 500 }}>{cust.name}</div>
                            <div style={{ color: 'var(--text-3)', lineHeight: 1.6 }}>
                                {cust.contact && <>{cust.contact}<br /></>}
                                {cust.email && <>{cust.email}<br /></>}
                                {cust.city && <>{cust.city}, {cust.country}</>}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8 }}>From</div>
                            <div style={{ color: 'var(--text-1)', fontWeight: 500 }}>{company.company_name}</div>
                            <div style={{ color: 'var(--text-3)', lineHeight: 1.6 }}>
                                {company.email && <>{company.email}<br /></>}
                                {company.phone && <>{company.phone}<br /></>}
                                {company.address?.split('\n').slice(-1)[0]}
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '16px 44px', background: 'rgba(0,0,0,0.25)', textAlign: 'center', fontSize: 12, color: 'var(--text-4)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                        <Icons.Lock size={11} />
                        <span>Secured by Billing · questions? <a href={`mailto:${company.email}`}>{company.email}</a></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
