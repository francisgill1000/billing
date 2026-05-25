// Sample data for Billing — generic agency, AED
window.AppData = (function () {
  const customers = [
    { id: 'c1', name: 'Crescent Media Group', contact: 'Layla Haddad', email: 'finance@crescent.media', phone: '+971 4 558 2210', trn: '100123456700003', city: 'Dubai', country: 'UAE', initials: 'CM', since: '2023-04-12' },
    { id: 'c2', name: 'Atlas Architecture LLC', contact: 'Omar Al-Rashid', email: 'accounts@atlas-arch.ae', phone: '+971 2 441 8800', trn: '100455671200001', city: 'Abu Dhabi', country: 'UAE', initials: 'AA', since: '2022-11-04' },
    { id: 'c3', name: 'Vertex Studio FZE', contact: 'Marina Petrova', email: 'hello@vertexstudio.io', phone: '+971 4 277 9912', trn: '100887766550002', city: 'Dubai', country: 'UAE', initials: 'VS', since: '2024-01-22' },
    { id: 'c4', name: 'Northwind Trading LLC', contact: 'Saeed Hamdan', email: 'ar@northwindtrade.ae', phone: '+971 6 552 3344', trn: '100332211440005', city: 'Sharjah', country: 'UAE', initials: 'NT', since: '2021-08-30' },
    { id: 'c5', name: 'Helix Software DMCC', contact: 'Aisha Naseem', email: 'billing@helix.dev', phone: '+971 4 803 1100', trn: '100776655330001', city: 'Dubai', country: 'UAE', initials: 'HS', since: '2023-09-19' },
    { id: 'c6', name: 'Meridian Logistics', contact: 'Tom Vance', email: 'invoices@meridian-logs.com', phone: '+971 4 660 7788', trn: '100889900110002', city: 'Jebel Ali', country: 'UAE', initials: 'ML', since: '2022-03-08' },
    { id: 'c7', name: 'Lumen Hospitality Group', contact: 'Priya Menon', email: 'finance@lumenhg.ae', phone: '+971 4 326 4400', trn: '100445566770008', city: 'Dubai', country: 'UAE', initials: 'LH', since: '2024-07-01' },
    { id: 'c8', name: 'Orion Capital Partners', contact: 'Khalid Al-Mansouri', email: 'ap@orioncapital.ae', phone: '+971 2 666 1212', trn: '100998877660003', city: 'Abu Dhabi', country: 'UAE', initials: 'OC', since: '2020-12-15' },
  ];

  const items = [
    { name: 'Brand identity system', price: 18000, unit: 'project' },
    { name: 'Website design (5 pages)', price: 14500, unit: 'project' },
    { name: 'Webflow development', price: 9800, unit: 'project' },
    { name: 'Monthly retainer — Design', price: 12000, unit: 'month' },
    { name: 'Monthly retainer — Content', price: 7500, unit: 'month' },
    { name: 'Logo refinement', price: 2400, unit: 'project' },
    { name: 'Brand guidelines document', price: 3200, unit: 'doc' },
    { name: 'Pitch deck design', price: 4800, unit: 'deck' },
    { name: 'Senior designer — hourly', price: 420, unit: 'hour' },
    { name: 'Art direction — hourly', price: 560, unit: 'hour' },
    { name: 'Photography day rate', price: 3800, unit: 'day' },
    { name: 'Motion graphics — 30s', price: 5200, unit: 'spot' },
  ];

  const invoices = [
    { id: 'INV-2026-0148', customerId: 'c1', issueDate: '2026-05-18', dueDate: '2026-06-01', status: 'paid',    paidDate: '2026-05-22', items: [
      { description: 'Brand identity system — Phase 2', qty: 1, price: 18000 },
      { description: 'Brand guidelines document', qty: 1, price: 3200 },
      { description: 'Senior designer — hourly', qty: 8, price: 420 },
    ], notes: 'Thanks for the continued partnership.', taxRate: 5 },

    { id: 'INV-2026-0147', customerId: 'c2', issueDate: '2026-05-14', dueDate: '2026-05-28', status: 'sent',    items: [
      { description: 'Website design (5 pages)', qty: 1, price: 14500 },
      { description: 'Webflow development', qty: 1, price: 9800 },
    ], notes: '', taxRate: 5 },

    { id: 'INV-2026-0146', customerId: 'c3', issueDate: '2026-04-26', dueDate: '2026-05-10', status: 'overdue', items: [
      { description: 'Pitch deck design', qty: 1, price: 4800 },
      { description: 'Art direction — hourly', qty: 6, price: 560 },
    ], notes: 'Please confirm receipt at your earliest.', taxRate: 5 },

    { id: 'INV-2026-0145', customerId: 'c5', issueDate: '2026-05-10', dueDate: '2026-05-24', status: 'paid',    paidDate: '2026-05-20', items: [
      { description: 'Monthly retainer — Design (May)', qty: 1, price: 12000 },
    ], notes: '', taxRate: 5 },

    { id: 'INV-2026-0144', customerId: 'c4', issueDate: '2026-05-08', dueDate: '2026-05-22', status: 'partial', items: [
      { description: 'Logo refinement', qty: 2, price: 2400 },
      { description: 'Photography day rate', qty: 3, price: 3800 },
    ], notes: 'AED 8,000 received on 2026-05-15.', taxRate: 5 },

    { id: 'INV-2026-0143', customerId: 'c6', issueDate: '2026-05-04', dueDate: '2026-05-18', status: 'sent',    items: [
      { description: 'Motion graphics — 30s', qty: 2, price: 5200 },
      { description: 'Senior designer — hourly', qty: 12, price: 420 },
    ], notes: '', taxRate: 5 },

    { id: 'INV-2026-0142', customerId: 'c7', issueDate: '2026-05-02', dueDate: '2026-05-16', status: 'paid',    paidDate: '2026-05-09', items: [
      { description: 'Brand identity system', qty: 1, price: 18000 },
    ], notes: '', taxRate: 5 },

    { id: 'INV-2026-0141', customerId: 'c8', issueDate: '2026-04-22', dueDate: '2026-05-06', status: 'paid',    paidDate: '2026-05-01', items: [
      { description: 'Monthly retainer — Design (April)', qty: 1, price: 12000 },
      { description: 'Monthly retainer — Content (April)', qty: 1, price: 7500 },
    ], notes: '', taxRate: 5 },

    { id: 'INV-2026-0140', customerId: 'c2', issueDate: '2026-04-18', dueDate: '2026-05-02', status: 'draft',   items: [
      { description: 'Pitch deck design', qty: 1, price: 4800 },
    ], notes: 'Draft — awaiting scope sign-off.', taxRate: 5 },
  ];

  const quotations = [
    { id: 'QUO-2026-0042', customerId: 'c3', issueDate: '2026-05-20', validUntil: '2026-06-19', status: 'pending', items: [
      { description: 'Brand identity system', qty: 1, price: 18000 },
      { description: 'Brand guidelines document', qty: 1, price: 3200 },
      { description: 'Pitch deck design', qty: 1, price: 4800 },
    ], notes: '50% deposit required to commence.', taxRate: 5 },

    { id: 'QUO-2026-0041', customerId: 'c7', issueDate: '2026-05-17', validUntil: '2026-06-16', status: 'accepted', items: [
      { description: 'Brand identity system', qty: 1, price: 18000 },
    ], notes: '', taxRate: 5 },

    { id: 'QUO-2026-0040', customerId: 'c4', issueDate: '2026-05-12', validUntil: '2026-06-11', status: 'pending', items: [
      { description: 'Photography day rate', qty: 4, price: 3800 },
      { description: 'Motion graphics — 30s', qty: 3, price: 5200 },
    ], notes: '', taxRate: 5 },

    { id: 'QUO-2026-0039', customerId: 'c1', issueDate: '2026-05-08', validUntil: '2026-06-07', status: 'accepted', items: [
      { description: 'Monthly retainer — Design (June+)', qty: 6, price: 12000 },
    ], notes: 'Converted to retainer agreement.', taxRate: 5 },

    { id: 'QUO-2026-0038', customerId: 'c5', issueDate: '2026-04-30', validUntil: '2026-05-30', status: 'declined', items: [
      { description: 'Website design (5 pages)', qty: 1, price: 14500 },
      { description: 'Webflow development', qty: 1, price: 9800 },
    ], notes: 'Client postponed Q3 launch.', taxRate: 5 },

    { id: 'QUO-2026-0037', customerId: 'c6', issueDate: '2026-04-22', validUntil: '2026-05-22', status: 'pending', items: [
      { description: 'Brand identity system', qty: 1, price: 18000 },
      { description: 'Senior designer — hourly', qty: 24, price: 420 },
    ], notes: '', taxRate: 5 },
  ];

  const recurring = [
    { id: 'REC-001', customerId: 'c5', frequency: 'monthly', nextDate: '2026-06-01', status: 'active',  startDate: '2024-09-01', endDate: null,         items: [{ description: 'Monthly retainer — Design', qty: 1, price: 12000 }], taxRate: 5, lastIssued: '2026-05-01', sentCount: 21 },
    { id: 'REC-002', customerId: 'c8', frequency: 'monthly', nextDate: '2026-06-01', status: 'active',  startDate: '2023-01-01', endDate: null,         items: [{ description: 'Monthly retainer — Design', qty: 1, price: 12000 }, { description: 'Monthly retainer — Content', qty: 1, price: 7500 }], taxRate: 5, lastIssued: '2026-05-01', sentCount: 41 },
    { id: 'REC-003', customerId: 'c1', frequency: 'monthly', nextDate: '2026-06-15', status: 'active',  startDate: '2025-06-15', endDate: '2026-12-15', items: [{ description: 'Brand identity system — Phase 2', qty: 1, price: 18000 }], taxRate: 5, lastIssued: '2026-05-15', sentCount: 12 },
    { id: 'REC-004', customerId: 'c2', frequency: 'quarterly', nextDate: '2026-07-01', status: 'active', startDate: '2025-01-01', endDate: null,        items: [{ description: 'Quarterly brand audit', qty: 1, price: 8500 }], taxRate: 5, lastIssued: '2026-04-01', sentCount: 6 },
    { id: 'REC-005', customerId: 'c6', frequency: 'monthly', nextDate: null,         status: 'paused',  startDate: '2024-03-01', endDate: null,         items: [{ description: 'Monthly retainer — Content', qty: 1, price: 7500 }], taxRate: 5, lastIssued: '2026-03-01', sentCount: 14 },
  ];

  const payments = [
    { id: 'PAY-1042', invoiceId: 'INV-2026-0148', customerId: 'c1', date: '2026-05-22', amount: 23310, method: 'Bank transfer', ref: 'ENBD-99821' },
    { id: 'PAY-1041', invoiceId: 'INV-2026-0145', customerId: 'c5', date: '2026-05-20', amount: 12600, method: 'Bank transfer', ref: 'EI-44219' },
    { id: 'PAY-1040', invoiceId: 'INV-2026-0144', customerId: 'c4', date: '2026-05-15', amount: 8000,  method: 'Cheque', ref: 'CHQ-008871' },
    { id: 'PAY-1039', invoiceId: 'INV-2026-0142', customerId: 'c7', date: '2026-05-09', amount: 18900, method: 'Card', ref: 'STR_4f...e21' },
    { id: 'PAY-1038', invoiceId: 'INV-2026-0141', customerId: 'c8', date: '2026-05-01', amount: 20475, method: 'Bank transfer', ref: 'ADIB-77110' },
  ];

  // Revenue series — last 12 months (AED, thousands)
  const revenueMonthly = [
    { m: 'Jun', v: 42 }, { m: 'Jul', v: 51 }, { m: 'Aug', v: 38 }, { m: 'Sep', v: 64 },
    { m: 'Oct', v: 72 }, { m: 'Nov', v: 81 }, { m: 'Dec', v: 95 }, { m: 'Jan', v: 67 },
    { m: 'Feb', v: 78 }, { m: 'Mar', v: 88 }, { m: 'Apr', v: 96 }, { m: 'May', v: 112 },
  ];

  // Helpers
  function findCustomer(id) { return customers.find(c => c.id === id); }
  function invoiceSubtotal(inv) { return inv.items.reduce((s, it) => s + it.qty * it.price, 0); }
  function invoiceTax(inv) { return Math.round(invoiceSubtotal(inv) * (inv.taxRate || 0)) / 100; }
  function invoiceTotal(inv) { return invoiceSubtotal(inv) + invoiceSubtotal(inv) * (inv.taxRate || 0) / 100; }
  function formatAED(n) {
    if (n == null || isNaN(n)) return 'AED 0.00';
    return 'AED ' + Number(n).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function formatAEDShort(n) {
    if (n == null || isNaN(n)) return 'AED 0';
    return 'AED ' + Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });
  }
  function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function daysUntil(iso) {
    const d = new Date(iso); const now = new Date('2026-05-25');
    return Math.round((d - now) / (1000 * 60 * 60 * 24));
  }

  return {
    customers, items, invoices, quotations, payments, revenueMonthly, recurring,
    findCustomer, invoiceSubtotal, invoiceTax, invoiceTotal,
    formatAED, formatAEDShort, formatDate, daysUntil,
    today: '2026-05-25',
  };
})();
