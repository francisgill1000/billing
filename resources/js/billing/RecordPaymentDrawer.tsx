import { router } from '@inertiajs/react';
import * as React from 'react';
import { Icons } from './icons';
import { Badge, Btn, CustomerCell, Drawer, Field, Input, Select, Textarea } from './ui';
import { formatAED } from './format';
import type { Invoice } from './types';

export default function RecordPaymentDrawer({
    open,
    invoice,
    onClose,
}: {
    open: boolean;
    invoice: Invoice | null;
    onClose: () => void;
}) {
    const total = invoice ? invoice.balance : 0;
    const [amount, setAmount] = React.useState<string>(String(total));
    const [method, setMethod] = React.useState('Bank transfer');
    const [paidAt, setPaidAt] = React.useState(new Date().toISOString().slice(0, 10));
    const [reference, setReference] = React.useState('');
    const [note, setNote] = React.useState('');

    React.useEffect(() => {
        if (invoice) {
            setAmount(String(invoice.balance));
            setReference('');
            setNote('');
        }
    }, [invoice]);

    if (!invoice) return null;
    const isFull = Number(amount) + 0.001 >= total;

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();
        router.post(
            '/payments',
            {
                invoice_id: invoice.id,
                amount: Number(amount),
                method,
                paid_at: paidAt,
                reference: reference || `${method.toUpperCase().split(' ')[0]}-${Math.floor(Math.random() * 90000 + 10000)}`,
                note,
            },
            {
                onSuccess: () => onClose(),
                preserveScroll: true,
            },
        );
    };

    return (
        <Drawer
            open={open}
            onClose={onClose}
            title="Record payment"
            footer={
                <>
                    <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
                    <Btn variant="primary" icon={<Icons.Check size={15} />} onClick={() => submit()}>
                        {isFull ? 'Record full payment' : 'Record partial payment'}
                    </Btn>
                </>
            }
        >
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ padding: 16, background: 'var(--surface-1)', borderRadius: 12, border: '1px solid var(--border-2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div>
                            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-4)', marginBottom: 4 }}>Against invoice</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span className="doc-id" style={{ fontSize: 15 }}>{invoice.number}</span>
                                <Badge status={invoice.status} />
                            </div>
                            <CustomerCell customer={invoice.customer} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-4)' }}>Outstanding</div>
                            <div className="num" style={{ fontSize: 22, fontWeight: 600, color: 'var(--mint-300)', marginTop: 4 }}>{formatAED(total)}</div>
                        </div>
                    </div>
                </div>

                <Field label="Amount received">
                    <Input prefix="AED" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </Field>

                {!isFull && Number(amount) > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--warn-soft)', border: '1px solid rgba(244,184,96,0.22)', borderRadius: 10, fontSize: 13, color: 'var(--warn)' }}>
                        <Icons.Sparkle size={14} />
                        <span>Partial payment · AED {Math.max(0, total - Number(amount)).toLocaleString('en-AE', { minimumFractionDigits: 2 })} will remain outstanding.</span>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Payment date">
                        <Input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
                    </Field>
                    <Field label="Method">
                        <Select value={method} onChange={(e) => setMethod(e.target.value)}>
                            <option>Bank transfer</option>
                            <option>Card</option>
                            <option>Cheque</option>
                            <option>Cash</option>
                            <option>Other</option>
                        </Select>
                    </Field>
                </div>

                <Field label="Reference" hint="Bank transaction ID, cheque number, etc.">
                    <Input placeholder="e.g. ENBD-99821" value={reference} onChange={(e) => setReference(e.target.value)} />
                </Field>

                <Field label="Internal note (optional)">
                    <Textarea placeholder="Anything else to remember about this payment…" value={note} onChange={(e) => setNote(e.target.value)} />
                </Field>

                <div style={{ padding: 14, background: 'rgba(0,255,204,0.05)', border: '1px solid var(--border-mint)', borderRadius: 10, fontSize: 12.5, color: 'var(--mint-200)', display: 'flex', gap: 10 }}>
                    <Icons.Check size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>The customer will receive a receipt automatically once you save this payment.</span>
                </div>
            </form>
        </Drawer>
    );
}
