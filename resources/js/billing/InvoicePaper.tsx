import * as React from 'react';
import { Logo } from './icons';
import { Badge } from './ui';
import { formatAED, formatDate } from './format';
import type { Invoice, Quotation, CompanySettings } from './types';

type Doc = Invoice | Quotation;

function isInvoice(d: Doc): d is Invoice {
    return (d as Invoice).due_date !== undefined;
}

export default function InvoicePaper({ doc, company, kind = 'invoice' }: { doc: Doc; company: CompanySettings; kind?: 'invoice' | 'quote' }) {
    const customer = doc.customer!;
    const totalCol = kind === 'invoice' ? 'Amount due' : 'Total estimate';
    const docLabel = kind === 'invoice' ? 'Invoice' : 'Quotation';
    const billLabel = kind === 'invoice' ? 'Billed to' : 'Prepared for';
    const dateLabel = kind === 'invoice' ? 'Due' : 'Valid until';
    const dateValue = kind === 'invoice' ? formatDate((doc as Invoice).due_date) : formatDate((doc as Quotation).valid_until);

    return (
        <div className="doc-paper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <div className="brand-mark" style={{ width: 28, height: 28 }}><Logo size={18} /></div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--mint-300)', letterSpacing: '-0.02em' }}>{company.company_name}</div>
                    </div>
                    <div style={{ color: 'var(--text-3)', fontSize: 12, lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                        {company.address}
                        {company.trn && (
                            <>
                                <br />
                                <span className="mono" style={{ color: 'var(--text-4)' }}>TRN {company.trn}</span>
                            </>
                        )}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: 4 }}>{docLabel}</div>
                    <div className="mono" style={{ fontSize: 24, fontWeight: 500, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{doc.number}</div>
                    <div style={{ marginTop: 14 }}><Badge status={doc.status} /></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 36 }}>
                <div>
                    <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8 }}>{billLabel}</div>
                    <div style={{ fontWeight: 500, color: 'var(--text-1)', marginBottom: 4 }}>{customer.name}</div>
                    <div style={{ color: 'var(--text-3)', fontSize: 12.5, lineHeight: 1.6 }}>
                        {customer.contact}<br />
                        {customer.email}<br />
                        {customer.city}, {customer.country}<br />
                        {customer.trn && <span className="mono" style={{ color: 'var(--text-4)' }}>TRN {customer.trn}</span>}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8 }}>Issued</div>
                    <div style={{ color: 'var(--text-1)', fontSize: 13.5 }}>{formatDate(doc.issue_date)}</div>
                    <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginTop: 14, marginBottom: 8 }}>{dateLabel}</div>
                    <div style={{ color: 'var(--text-1)', fontSize: 13.5 }}>{dateValue}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8 }}>{totalCol}</div>
                    <div style={{ fontSize: 30, fontWeight: 600, color: 'var(--mint-300)', letterSpacing: '-0.025em' }} className="num">
                        <span style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 500, marginRight: 4 }}>AED</span>
                        {Number(doc.total).toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-2)' }}>
                        <th style={{ textAlign: 'left', padding: '10px 0', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', fontWeight: 500 }}>Description</th>
                        <th style={{ textAlign: 'right', padding: '10px 0', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', fontWeight: 500, width: 70 }}>Qty</th>
                        <th style={{ textAlign: 'right', padding: '10px 0', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', fontWeight: 500, width: 130 }}>Unit price</th>
                        <th style={{ textAlign: 'right', padding: '10px 0', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', fontWeight: 500, width: 130 }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {doc.items.map((it, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-1)' }}>
                            <td style={{ padding: '14px 0', color: 'var(--text-1)', fontSize: 14 }}>{it.description}</td>
                            <td style={{ padding: '14px 0', textAlign: 'right', color: 'var(--text-2)' }} className="num">{it.qty}</td>
                            <td style={{ padding: '14px 0', textAlign: 'right', color: 'var(--text-2)' }} className="num">{formatAED(it.price)}</td>
                            <td style={{ padding: '14px 0', textAlign: 'right', color: 'var(--text-1)' }} className="num">{formatAED(it.qty * it.price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: 280 }}>
                    <div className="totals-row"><span>Subtotal</span><span className="num">{formatAED(doc.subtotal)}</span></div>
                    <div className="totals-row"><span>VAT ({doc.tax_rate}%)</span><span className="num">{formatAED(doc.tax)}</span></div>
                    <div className="totals-row grand"><span>Total</span><span className="num">{formatAED(doc.total)}</span></div>
                </div>
            </div>

            {doc.notes && (
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-1)' }}>
                    <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8 }}>Notes</div>
                    <div style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6 }}>{doc.notes}</div>
                </div>
            )}

            {kind === 'invoice' && isInvoice(doc) && (
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, fontSize: 12 }}>
                    <div>
                        <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8 }}>Pay by bank transfer</div>
                        <div style={{ color: 'var(--text-2)', lineHeight: 1.65 }} className="mono">
                            {company.bank_name}<br />
                            IBAN {company.iban}<br />
                            Swift {company.swift}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8 }}>Pay online</div>
                        <div style={{ color: 'var(--text-2)', lineHeight: 1.65 }}>
                            <a href={`/pay/${doc.number}`} style={{ color: 'var(--mint-300)' }}>
                                {window.location.host}/pay/{doc.number.toLowerCase()}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
