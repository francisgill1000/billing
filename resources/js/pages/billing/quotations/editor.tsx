import { Head, router } from '@inertiajs/react';
import * as React from 'react';
import BillingLayout from '@/billing/BillingLayout';
import { Icons } from '@/billing/icons';
import { Btn, Card, CustomerCell, Field, Input, PageHeader, Select, Textarea } from '@/billing/ui';
import { formatAED, formatAEDShort } from '@/billing/format';
import type { Customer, LineItem, Quotation } from '@/billing/types';

type Props = {
    mode: 'create' | 'edit';
    customers: Customer[];
    catalog: { id: number; name: string; price: number; unit: string }[];
    next_number?: string;
    quotation: Quotation | null;
};

export default function Editor({ mode, customers, catalog, next_number, quotation }: Props) {
    const [customerId, setCustomerId] = React.useState<number>(quotation?.customer_id ?? (customers[0]?.id ?? 0));
    const [issueDate, setIssueDate] = React.useState(quotation?.issue_date ?? new Date().toISOString().slice(0, 10));
    const [validUntil, setValidUntil] = React.useState(quotation?.valid_until ?? new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
    const [taxRate, setTaxRate] = React.useState<number>(quotation?.tax_rate ?? 5);
    const [notes, setNotes] = React.useState(quotation?.notes ?? '');
    const [items, setItems] = React.useState<LineItem[]>(quotation?.items ?? [{ description: '', qty: 1, price: 0 }]);
    const [catalogOpen, setCatalogOpen] = React.useState(false);

    const updateItem = (i: number, patch: Partial<LineItem>) =>
        setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
    const addItem = () => setItems([...items, { description: '', qty: 1, price: 0 }]);
    const removeItem = (i: number) => setItems(items.length > 1 ? items.filter((_, idx) => idx !== i) : items);

    const sub = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
    const tax = Math.round(sub * (Number(taxRate) || 0)) / 100;
    const total = sub + tax;
    const customer = customers.find((c) => c.id === customerId);

    const save = (status: 'draft' | 'pending') => {
        const payload = {
            customer_id: customerId,
            issue_date: issueDate,
            valid_until: validUntil,
            tax_rate: Number(taxRate),
            notes,
            items: items.filter((it) => it.description),
            status,
        };
        if (mode === 'edit' && quotation) {
            router.put(`/quotations/${quotation.id}`, payload);
        } else {
            router.post('/quotations', payload);
        }
    };

    return (
        <BillingLayout active="quotations" title={mode === 'edit' ? `Edit ${quotation?.number}` : 'New quotation'} crumb="Quotations">
            <Head title={mode === 'edit' ? 'Edit quotation' : 'New quotation'} />
            <div className="page">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <Btn variant="ghost" size="sm" icon={<Icons.ChevronLeft size={14} />} as="a" href="/quotations">Cancel</Btn>
                </div>

                <PageHeader
                    title={mode === 'edit' ? `Edit ${quotation?.number}` : 'New quotation'}
                    subtitle="Draft a quote for client approval."
                    actions={
                        <>
                            <Btn variant="ghost" as="a" href="/quotations">Discard</Btn>
                            <Btn variant="secondary" icon={<Icons.Edit size={15} />} onClick={() => save('draft')}>Save as draft</Btn>
                            <Btn variant="primary" icon={<Icons.Send size={15} />} onClick={() => save('pending')}>Send quotation</Btn>
                        </>
                    }
                />

                <div className="bil-stack-mobile" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Card title="Quotation details">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <Field label="Customer">
                                    <Select value={customerId} onChange={(e) => setCustomerId(Number(e.target.value))}>
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </Select>
                                </Field>
                                <Field label="Quotation number">
                                    <Input value={quotation?.number ?? next_number ?? ''} readOnly />
                                </Field>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                                <Field label="Issue date">
                                    <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                                </Field>
                                <Field label="Valid until">
                                    <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                                </Field>
                                <Field label="VAT rate (%)">
                                    <Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                                </Field>
                            </div>
                        </Card>

                        <Card
                            title="Line items"
                            action={
                                <div style={{ position: 'relative', display: 'flex', gap: 6 }}>
                                    <Btn variant="secondary" size="sm" icon={<Icons.Sparkle size={14} />} onClick={() => setCatalogOpen((o) => !o)}>From catalog</Btn>
                                    <Btn variant="secondary" size="sm" icon={<Icons.Plus size={14} />} onClick={addItem}>Add row</Btn>
                                    {catalogOpen && (
                                        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 320, background: 'var(--surface-1)', border: '1px solid var(--border-2)', borderRadius: 12, padding: 8, zIndex: 20, boxShadow: '0 18px 40px -10px rgba(0,0,0,0.6)' }}>
                                            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', padding: '8px 10px' }}>Catalog</div>
                                            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                                                {catalog.map((it) => (
                                                    <button
                                                        key={it.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setItems([...items.filter((x) => x.description), { description: it.name, qty: 1, price: it.price }]);
                                                            setCatalogOpen(false);
                                                        }}
                                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '9px 10px', background: 'transparent', border: 0, color: 'var(--text-2)', fontSize: 13, cursor: 'pointer', borderRadius: 7, textAlign: 'left' }}
                                                    >
                                                        <span>{it.name}</span>
                                                        <span className="num" style={{ color: 'var(--text-3)', fontSize: 12 }}>{formatAEDShort(it.price)}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            }
                            padding={false}
                        >
                            <div className="line-items" style={{ border: 0, borderRadius: 0 }}>
                                <div className="line-items-header">
                                    <div>Description</div>
                                    <div style={{ textAlign: 'right' }}>Qty</div>
                                    <div style={{ textAlign: 'right' }}>Unit price</div>
                                    <div style={{ textAlign: 'right' }}>Total</div>
                                    <div></div>
                                </div>
                                {items.map((it, i) => (
                                    <div key={i} className="line-item">
                                        <Input placeholder="Service or product" value={it.description} onChange={(e) => updateItem(i, { description: e.target.value })} />
                                        <Input type="number" style={{ textAlign: 'right' }} value={it.qty} onChange={(e) => updateItem(i, { qty: Number(e.target.value) })} />
                                        <Input prefix="AED" type="number" value={it.price} onChange={(e) => updateItem(i, { price: Number(e.target.value) })} />
                                        <Input value={formatAED((Number(it.qty) || 0) * (Number(it.price) || 0))} readOnly style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.015)' }} />
                                        <button type="button" className="remove-btn" onClick={() => removeItem(i)} title="Remove">
                                            <Icons.Trash size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Notes & terms">
                            <Textarea
                                placeholder="e.g. 50% deposit required to commence. Quote valid for 30 days."
                                value={notes ?? ''}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </Card>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Card title="Summary" action={<span className="muted" style={{ fontSize: 12 }}>Live preview</span>}>
                            <div className="kpi-row"><span className="kpi-label">Items</span><span className="kpi-value">{items.filter((it) => it.description).length}</span></div>
                            <div className="kpi-row"><span className="kpi-label">Subtotal</span><span className="kpi-value num">{formatAED(sub)}</span></div>
                            <div className="kpi-row"><span className="kpi-label">VAT ({taxRate}%)</span><span className="kpi-value num">{formatAED(tax)}</span></div>
                            <div className="kpi-row" style={{ borderTop: '1px solid var(--border-2)', marginTop: 6, paddingTop: 14 }}>
                                <span className="kpi-label" style={{ color: 'var(--text-1)', fontWeight: 500 }}>Total</span>
                                <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--mint-300)' }} className="num">{formatAED(total)}</span>
                            </div>
                        </Card>

                        {customer && (
                            <Card title="Quote for">
                                <CustomerCell customer={customer} />
                                <div className="divider"></div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--text-3)' }}>
                                    {customer.email && <div>{customer.email}</div>}
                                    {customer.phone && <div>{customer.phone}</div>}
                                    {customer.city && <div>{customer.city}, {customer.country}</div>}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </BillingLayout>
    );
}
