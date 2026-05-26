import { Head, router } from '@inertiajs/react';
import * as React from 'react';
import BillingLayout from '@/billing/BillingLayout';
import { Icons, Logo } from '@/billing/icons';
import { Btn, Card, Field, Input, PageHeader, Select, Textarea } from '@/billing/ui';
import type { CompanySettings } from '@/billing/types';

type Tab = 'company' | 'invoicing' | 'templates' | 'tax' | 'notifications' | 'billing';

function SettingRow({ title, desc, value, onChange }: { title: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-1)', gap: 16 }}>
            <div>
                <div style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 500 }}>{title}</div>
                <div style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>{desc}</div>
            </div>
            <div className={`switch ${value ? 'on' : ''}`} onClick={() => onChange(!value)} role="switch" aria-checked={value}></div>
        </div>
    );
}

function EmailTemplatePreview({ kind, company }: { kind: 'invoice' | 'reminder' | 'receipt'; company: CompanySettings }) {
    const subject =
        kind === 'invoice'
            ? `Invoice INV-2026-0150 from ${company.company_name} · AED 25,200`
            : kind === 'reminder'
                ? `Friendly reminder: INV-2026-0150 is due soon`
                : `Receipt for your payment · INV-2026-0150`;
    return (
        <div className="email-mockup">
            <div className="email-mockup-header">
                <div className="brand-mark" style={{ width: 26, height: 26 }}><Logo size={16} /></div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--mint-300)' }}>{company.company_name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-4)' }}>{company.email}</div>
                </div>
            </div>
            <div className="email-mockup-body">
                <div style={{ color: '#6b736e', fontSize: 12, marginBottom: 6 }}>To: client@example.com</div>
                <h2 style={{ margin: '0 0 18px', fontSize: 19, fontWeight: 600, color: '#1a1f1d', letterSpacing: '-0.015em' }}>{subject}</h2>
                {kind === 'invoice' && <p>Hi there,<br />Your invoice <strong>INV-2026-0150</strong> is ready and attached as a PDF. You can also pay online in a single tap below.</p>}
                {kind === 'reminder' && <p>Hi there,<br />Just a gentle reminder that invoice <strong>INV-2026-0150</strong> is due. If you've already paid, please ignore this — and thank you.</p>}
                {kind === 'receipt' && <p>Hi there,<br />We've received your payment for invoice <strong>INV-2026-0150</strong> — thank you. Your receipt is below for your records.</p>}
                <dl className="email-mockup-meta">
                    <div><dt>Amount</dt><dd>AED 25,200.00</dd></div>
                    <div><dt>Due</dt><dd>14 days</dd></div>
                    <div><dt>Invoice number</dt><dd style={{ fontFamily: 'var(--font-mono)' }}>INV-2026-0150</dd></div>
                    <div><dt>Reference</dt><dd>Project work</dd></div>
                </dl>
                <a href="#" className="email-mockup-cta">{kind === 'invoice' ? 'View & pay invoice' : kind === 'reminder' ? 'Pay now' : 'View receipt'} <span style={{ marginLeft: 8 }}>→</span></a>
                <p style={{ marginTop: 18, color: '#6b736e', fontSize: 12.5 }}>Questions? Just reply to this email.</p>
                <p style={{ marginTop: 18 }}>Warmly,<br /><strong>{company.company_name}</strong></p>
            </div>
            <div className="email-mockup-footer">
                {company.company_name} · {company.address?.split('\n')[0]}<br />
                TRN {company.trn}
            </div>
        </div>
    );
}

export default function Settings({ settings }: { settings: CompanySettings }) {
    const [tab, setTab] = React.useState<Tab>('company');
    const [form, setForm] = React.useState<CompanySettings>(settings);
    const [emailKind, setEmailKind] = React.useState<'invoice' | 'reminder' | 'receipt'>('invoice');

    const save = (patch?: Partial<CompanySettings>) => {
        const data = { ...form, ...(patch || {}) };
        router.put('/billing-settings', data as Record<string, unknown>, { preserveScroll: true });
    };

    const navItems: { id: Tab; label: string; icon: typeof Icons.Building }[] = [
        { id: 'company', label: 'Company profile', icon: Icons.Building },
        { id: 'invoicing', label: 'Invoicing defaults', icon: Icons.Invoice },
        { id: 'templates', label: 'Email templates', icon: Icons.Mail },
        { id: 'tax', label: 'Tax & currency', icon: Icons.Receipt },
        { id: 'notifications', label: 'Notifications', icon: Icons.Bell },
        { id: 'billing', label: 'Plan & billing', icon: Icons.Card },
    ];

    return (
        <BillingLayout active="settings" title="Settings">
            <Head title="Settings" />
            <div className="page">
                <PageHeader title="Settings" subtitle="Manage your company profile and billing." />

                <div className="bil-settings-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'flex-start' }}>
                    <div className="bil-settings-nav" style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 88 }}>
                        {navItems.map((t) => {
                            const Icon = t.icon;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    className={`nav-item ${tab === t.id ? 'active' : ''}`}
                                    onClick={() => setTab(t.id)}
                                >
                                    <span className="nav-icon"><Icon size={16} /></span>
                                    <span>{t.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 740 }}>
                        {tab === 'company' && (
                            <>
                                <Card title="Company">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <Field label="Company name"><Input value={form.company_name ?? ''} onChange={(e) => setForm({ ...form, company_name: e.target.value })} /></Field>
                                        <Field label="Trade license"><Input value={form.trade_license ?? ''} onChange={(e) => setForm({ ...form, trade_license: e.target.value })} /></Field>
                                        <Field label="TRN"><Input value={form.trn ?? ''} onChange={(e) => setForm({ ...form, trn: e.target.value })} /></Field>
                                        <Field label="Email"><Input value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
                                        <Field label="Phone"><Input value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <Field label="Address"><Textarea value={form.address ?? ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                                        <Btn variant="ghost" onClick={() => setForm(settings)}>Cancel</Btn>
                                        <Btn variant="primary" onClick={() => save()}>Save changes</Btn>
                                    </div>
                                </Card>
                                <Card title="Brand">
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                                        <div style={{ width: 72, height: 72, background: 'linear-gradient(160deg, var(--mint-400), var(--mint-700))', borderRadius: 14, display: 'grid', placeItems: 'center', boxShadow: '0 8px 24px -8px rgba(0,255,204,0.55)' }}>
                                            <Logo size={36} />
                                        </div>
                                        <div>
                                            <div style={{ color: 'var(--text-1)', fontWeight: 500, marginBottom: 6 }}>Logo</div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Btn variant="secondary" size="sm">Upload new</Btn>
                                                <Btn variant="ghost" size="sm">Remove</Btn>
                                            </div>
                                        </div>
                                    </div>
                                    <Field label="Accent color">
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            {['#00ffcc', '#60a5fa', '#a78bfa', '#f4b860', '#f87171'].map((c) => (
                                                <div
                                                    key={c}
                                                    onClick={() => save({ accent_color: c })}
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        background: c,
                                                        borderRadius: 8,
                                                        cursor: 'pointer',
                                                        border: form.accent_color === c ? '2px solid var(--text-1)' : '2px solid transparent',
                                                        boxShadow: form.accent_color === c ? '0 0 0 2px var(--bg-1)' : 'none',
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </Field>
                                </Card>
                            </>
                        )}

                        {tab === 'invoicing' && (
                            <Card title="Invoicing defaults">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <Field label="Invoice prefix"><Input value={form.invoice_prefix} onChange={(e) => setForm({ ...form, invoice_prefix: e.target.value })} /></Field>
                                    <Field label="Next number"><Input type="number" value={form.next_invoice_number} onChange={(e) => setForm({ ...form, next_invoice_number: Number(e.target.value) })} /></Field>
                                    <Field label="Payment terms (days)">
                                        <Select value={form.payment_terms_days} onChange={(e) => setForm({ ...form, payment_terms_days: Number(e.target.value) })}>
                                            <option value={0}>Due on receipt</option>
                                            <option value={7}>Net 7</option>
                                            <option value={14}>Net 14</option>
                                            <option value={30}>Net 30</option>
                                        </Select>
                                    </Field>
                                    <Field label="Late fee"><Input value={form.late_fee} onChange={(e) => setForm({ ...form, late_fee: e.target.value })} /></Field>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <Field label="Default footer note">
                                            <Textarea value={form.footer_note ?? ''} onChange={(e) => setForm({ ...form, footer_note: e.target.value })} />
                                        </Field>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                                    <Btn variant="ghost" onClick={() => setForm(settings)}>Cancel</Btn>
                                    <Btn variant="primary" onClick={() => save()}>Save changes</Btn>
                                </div>
                            </Card>
                        )}

                        {tab === 'tax' && (
                            <Card title="Tax & currency">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <Field label="Default currency">
                                        <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                                            <option>AED</option><option>USD</option><option>EUR</option><option>GBP</option>
                                        </Select>
                                    </Field>
                                    <Field label="VAT rate (%)"><Input type="number" value={form.vat_rate} onChange={(e) => setForm({ ...form, vat_rate: Number(e.target.value) })} /></Field>
                                    <Field label="Tax registration number"><Input value={form.trn ?? ''} onChange={(e) => setForm({ ...form, trn: e.target.value })} /></Field>
                                    <Field label="VAT return period">
                                        <Select value={form.vat_return_period} onChange={(e) => setForm({ ...form, vat_return_period: e.target.value })}>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                        </Select>
                                    </Field>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                                    <Btn variant="primary" onClick={() => save()}>Save changes</Btn>
                                </div>
                            </Card>
                        )}

                        {tab === 'templates' && (
                            <Card
                                title="Email templates"
                                action={
                                    <div style={{ display: 'flex', gap: 4, background: 'var(--surface-1)', padding: 4, borderRadius: 9, border: '1px solid var(--border-1)' }}>
                                        {(['invoice', 'reminder', 'receipt'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setEmailKind(t)}
                                                type="button"
                                                style={{
                                                    border: 0,
                                                    background: emailKind === t ? 'var(--surface-3)' : 'transparent',
                                                    color: emailKind === t ? 'var(--text-1)' : 'var(--text-3)',
                                                    padding: '5px 11px',
                                                    borderRadius: 6,
                                                    fontSize: 12,
                                                    cursor: 'pointer',
                                                    fontFamily: 'inherit',
                                                    fontWeight: 500,
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {t === 'invoice' ? 'Sent' : t}
                                            </button>
                                        ))}
                                    </div>
                                }
                            >
                                <div style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>
                                    {emailKind === 'invoice' && 'Sent when you issue a new invoice to a customer.'}
                                    {emailKind === 'reminder' && 'Sent automatically 3 days before due, on due date, and 7 days after.'}
                                    {emailKind === 'receipt' && 'Sent to confirm a payment has been recorded.'}
                                </div>
                                <EmailTemplatePreview kind={emailKind} company={form} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-3)' }}>
                                        <Icons.Sparkle size={13} style={{ color: 'var(--mint-400)' }} />
                                        <span>Variables like <span className="mono">{'{{customer.name}}'}</span> and <span className="mono">{'{{invoice.total}}'}</span> are auto-filled.</span>
                                    </div>
                                    <Btn variant="secondary" size="sm" icon={<Icons.Edit size={13} />}>Edit copy</Btn>
                                </div>
                            </Card>
                        )}

                        {tab === 'notifications' && (
                            <Card title="Notifications">
                                <SettingRow
                                    title="Email me when invoices are paid"
                                    desc="You'll receive a confirmation as soon as a payment lands."
                                    value={form.notify_paid}
                                    onChange={(v) => save({ notify_paid: v })}
                                />
                                <SettingRow
                                    title="Alert me about overdue invoices"
                                    desc="Daily summary of unpaid invoices past their due date."
                                    value={form.notify_overdue}
                                    onChange={(v) => save({ notify_overdue: v })}
                                />
                                <SettingRow
                                    title="Auto-send payment reminders"
                                    desc="Politely nudge customers 3 days before and after due date."
                                    value={form.auto_remind}
                                    onChange={(v) => save({ auto_remind: v })}
                                />
                            </Card>
                        )}

                        {tab === 'billing' && (
                            <Card title="Plan & billing">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0 16px', borderBottom: '1px solid var(--border-1)', marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--mint-300)', marginBottom: 4 }}>Current plan</div>
                                        <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-1)' }}>Pro · AED 149/month</div>
                                        <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Unlimited invoices, priority support.</div>
                                    </div>
                                    <Btn variant="secondary">Change plan</Btn>
                                </div>
                                <div className="kpi-row"><span className="kpi-label">Next renewal</span><span className="kpi-value">15 June 2026</span></div>
                                <div className="kpi-row"><span className="kpi-label">Payment method</span><span className="kpi-value">Visa ·· 4242</span></div>
                                <div className="kpi-row"><span className="kpi-label">Billing email</span><span className="kpi-value">{form.email}</span></div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </BillingLayout>
    );
}
