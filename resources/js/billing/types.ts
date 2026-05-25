export type Customer = {
    id: number;
    name: string;
    contact: string | null;
    email: string | null;
    phone: string | null;
    trn: string | null;
    city: string | null;
    country: string | null;
    initials: string;
    since: string | null;
    notes: string | null;
    invoice_count?: number;
    total?: number;
    outstanding?: number;
};

export type LineItem = {
    description: string;
    qty: number;
    price: number;
};

export type Invoice = {
    id: number;
    number: string;
    customer: Customer | null;
    customer_id: number;
    issue_date: string;
    due_date: string;
    status: 'draft' | 'sent' | 'overdue' | 'partial' | 'paid';
    paid_date: string | null;
    items: LineItem[];
    tax_rate: number;
    notes: string | null;
    subtotal: number;
    tax: number;
    total: number;
    amount_paid: number;
    balance: number;
};

export type Quotation = {
    id: number;
    number: string;
    customer: Customer | null;
    customer_id: number;
    issue_date: string;
    valid_until: string;
    status: 'pending' | 'accepted' | 'declined' | 'draft';
    items: LineItem[];
    tax_rate: number;
    notes: string | null;
    subtotal: number;
    tax: number;
    total: number;
};

export type Payment = {
    id: number;
    number: string;
    invoice_id: number;
    invoice_number: string | null;
    customer_id: number;
    customer: Customer | null;
    paid_at: string;
    amount: number;
    method: string;
    reference: string | null;
    note: string | null;
};

export type RecurringSchedule = {
    id: number;
    number: string;
    customer: Customer | null;
    customer_id: number;
    frequency: string;
    next_date: string | null;
    status: 'active' | 'paused';
    start_date: string;
    end_date: string | null;
    items: LineItem[];
    tax_rate: number;
    last_issued: string | null;
    sent_count: number;
    subtotal: number;
    total: number;
};

export type CompanySettings = {
    company_name: string;
    trn: string | null;
    trade_license: string | null;
    address: string | null;
    email: string | null;
    phone: string | null;
    currency: string;
    vat_rate: number;
    vat_return_period: string;
    invoice_prefix: string;
    next_invoice_number: number;
    quotation_prefix: string;
    next_quotation_number: number;
    payment_terms_days: number;
    late_fee: string;
    footer_note: string | null;
    accent_color: string;
    notify_paid: boolean;
    notify_overdue: boolean;
    auto_remind: boolean;
    bank_name: string | null;
    iban: string | null;
    swift: string | null;
};
