import { router } from '@inertiajs/react';
import * as React from 'react';
import { Icons } from './icons';
import { Btn, Field, Input, Textarea } from './ui';

type Props = {
    open: boolean;
    onClose: () => void;
    /**
     * When 'back', the server stays on the current page and flashes new_customer_id.
     * When omitted, the server redirects to the customer's detail page.
     */
    redirectTo?: 'back' | null;
    onCreated?: () => void;
};

const empty = {
    name: '',
    contact: '',
    email: '',
    phone: '',
    city: '',
    country: 'UAE',
    trn: '',
    notes: '',
};

export default function AddCustomerDrawer({ open, onClose, redirectTo, onCreated }: Props) {
    const [form, setForm] = React.useState(empty);
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (open) setForm(empty);
    }, [open]);

    React.useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setSubmitting(true);
        router.post(
            '/customers',
            { ...form, redirect_to: redirectTo ?? '' },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSubmitting(false);
                    onCreated?.();
                    onClose();
                },
                onError: () => setSubmitting(false),
            },
        );
    };

    return (
        <>
            <div className="drawer-overlay" onClick={onClose}></div>
            <div className="drawer">
                <div className="drawer-header">
                    <h2>Add customer</h2>
                    <Btn variant="ghost" size="sm" icon={<Icons.X size={16} />} onClick={onClose} />
                </div>
                <form onSubmit={submit} className="drawer-body" style={{ display: 'grid', gap: 14 }}>
                    <Field label="Company name">
                        <Input
                            autoFocus
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </Field>
                    <Field label="Primary contact">
                        <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                    </Field>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <Field label="Email">
                            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </Field>
                        <Field label="Phone">
                            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </Field>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <Field label="City">
                            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                        </Field>
                        <Field label="Country">
                            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="TRN">
                        <Input value={form.trn} onChange={(e) => setForm({ ...form, trn: e.target.value })} />
                    </Field>
                    <Field label="Notes (optional)">
                        <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </Field>
                </form>
                <div className="drawer-footer">
                    <Btn variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Btn>
                    <Btn variant="primary" icon={<Icons.Check size={14} />} onClick={() => submit()} disabled={submitting || !form.name}>
                        {submitting ? 'Adding…' : 'Add customer'}
                    </Btn>
                </div>
            </div>
        </>
    );
}
