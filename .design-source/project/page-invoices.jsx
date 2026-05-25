// Invoices: list, detail, create/edit
const D2 = window.AppData;

window.PageInvoices = function PageInvoices({ invoices, onOpen, onNew }) {
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = invoices.filter(i => {
    if (tab !== 'all' && i.status !== tab) return false;
    if (query) {
      const cust = D2.findCustomer(i.customerId);
      const q = query.toLowerCase();
      return i.id.toLowerCase().includes(q) || (cust && cust.name.toLowerCase().includes(q));
    }
    return true;
  });
  const counts = {
    all: invoices.length,
    sent: invoices.filter(i => i.status === 'sent').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    draft: invoices.filter(i => i.status === 'draft').length,
  };

  return (
    <div className="page">
      <PageHeader
        title="Invoices"
        subtitle={`${invoices.length} invoices · AED ${invoices.reduce((s, i) => s + D2.invoiceTotal(i), 0).toLocaleString('en-AE', { maximumFractionDigits: 0 })} total`}
        actions={
          <>
            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
            <Btn variant="primary" icon={<Icons.Plus size={15} />} onClick={onNew}>New invoice</Btn>
          </>
        }
      />

      <Tabs
        tabs={[
          { id: 'all',     label: 'All',     count: counts.all },
          { id: 'sent',    label: 'Sent',    count: counts.sent },
          { id: 'overdue', label: 'Overdue', count: counts.overdue },
          { id: 'partial', label: 'Partial', count: invoices.filter(i => i.status === 'partial').length },
          { id: 'paid',    label: 'Paid',    count: counts.paid },
          { id: 'draft',   label: 'Draft',   count: counts.draft },
        ]}
        value={tab}
        onChange={setTab}
      />

      <Toolbar>
        <div className="search" style={{width: 320}}>
          <Icons.Search size={14} />
          <input placeholder="Search by invoice # or customer…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Btn variant="secondary" size="sm" icon={<Icons.Filter size={14} />}>Filter</Btn>
        <Btn variant="secondary" size="sm" icon={<Icons.Calendar size={14} />}>Last 90 days</Btn>
        <div className="toolbar-spacer"></div>
        <span className="muted" style={{fontSize: 12}}>{filtered.length} of {invoices.length}</span>
      </Toolbar>

      <Card padding={false}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Issued</th>
                <th>Due</th>
                <th>Status</th>
                <th className="right">Amount</th>
                <th style={{width: 50}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => {
                const cust = D2.findCustomer(i.customerId);
                const dueIn = D2.daysUntil(i.dueDate);
                let dueSub = D2.formatDate(i.dueDate);
                if (i.status === 'overdue') dueSub = `${Math.abs(dueIn)}d overdue`;
                else if (i.status === 'sent' && dueIn >= 0) dueSub = `in ${dueIn}d`;
                return (
                  <tr key={i.id} style={{cursor: 'pointer'}} onClick={() => onOpen(i.id)}>
                    <td><span className="doc-id">{i.id}</span></td>
                    <td><CustomerCell customer={cust} /></td>
                    <td className="muted">{D2.formatDate(i.issueDate)}</td>
                    <td>
                      <div style={{color: i.status === 'overdue' ? '#fca5a5' : 'var(--text-2)'}}>{D2.formatDate(i.dueDate)}</div>
                      <div style={{fontSize: 11, color: 'var(--text-4)'}}>{i.status === 'overdue' ? `${Math.abs(dueIn)}d overdue` : i.status === 'sent' && dueIn >= 0 ? `in ${dueIn}d` : ''}</div>
                    </td>
                    <td><Badge status={i.status} /></td>
                    <td className="right num">{D2.formatAED(D2.invoiceTotal(i))}</td>
                    <td><Btn variant="ghost" size="sm" icon={<Icons.More size={16} />} onClick={(e) => e.stopPropagation()} /></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="7" className="empty">No invoices match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

window.PageInvoiceDetail = function PageInvoiceDetail({ invoice, onBack, onMarkPaid, onSend, onEdit, onRecord, onPreviewPortal }) {
  const cust = D2.findCustomer(invoice.customerId);
  const sub = D2.invoiceSubtotal(invoice);
  const tax = D2.invoiceTax(invoice);
  const total = D2.invoiceTotal(invoice);
  return (
    <div className="page">
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18}}>
        <Btn variant="ghost" size="sm" icon={<Icons.ChevronLeft size={14} />} onClick={onBack}>Back to invoices</Btn>
      </div>

      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap'}}>
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6}}>
            <h1 style={{margin: 0, fontSize: 28, letterSpacing: '-0.025em', fontWeight: 600}}>{invoice.id}</h1>
            <Badge status={invoice.status} />
          </div>
          <div style={{color: 'var(--text-3)', fontSize: 14}}>
            Issued {D2.formatDate(invoice.issueDate)} · Due {D2.formatDate(invoice.dueDate)}
          </div>
        </div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Btn variant="ghost" icon={<Icons.ExternalLink size={15} />} onClick={onPreviewPortal}>Preview portal</Btn>
          <Btn variant="ghost" icon={<Icons.Download size={15} />}>PDF</Btn>
          <Btn variant="ghost" icon={<Icons.Copy size={15} />}>Duplicate</Btn>
          {invoice.status !== 'paid' && (
            <Btn variant="secondary" icon={<Icons.Send size={15} />} onClick={onSend}>Send</Btn>
          )}
          {invoice.status !== 'paid' && (
            <Btn variant="primary" icon={<Icons.Wallet size={15} />} onClick={onRecord}>Record payment</Btn>
          )}
          {invoice.status === 'paid' && (
            <Btn variant="secondary" icon={<Icons.Receipt size={15} />}>Receipt</Btn>
          )}
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20}}>
        <InvoicePaper invoice={invoice} customer={cust} />

        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <Card title="Summary">
            <div className="kpi-row">
              <span className="kpi-label">Subtotal</span>
              <span className="kpi-value num">{D2.formatAED(sub)}</span>
            </div>
            <div className="kpi-row">
              <span className="kpi-label">VAT ({invoice.taxRate}%)</span>
              <span className="kpi-value num">{D2.formatAED(tax)}</span>
            </div>
            <div className="kpi-row" style={{borderTop: '1px solid var(--border-2)', marginTop: 6, paddingTop: 14}}>
              <span className="kpi-label" style={{color: 'var(--text-1)', fontWeight: 500}}>Total due</span>
              <span style={{fontSize: 20, fontWeight: 600, color: 'var(--mint-300)'}} className="num">{D2.formatAED(total)}</span>
            </div>
          </Card>

          <Card title="Customer">
            <CustomerCell customer={cust} />
            <div className="divider"></div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-2)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}><Icons.Mail size={13} /><span>{cust.email}</span></div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}><Icons.Phone size={13} /><span>{cust.phone}</span></div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}><Icons.Building size={13} /><span>{cust.city}, {cust.country}</span></div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', fontSize: 12}}><span>TRN</span><span>{cust.trn}</span></div>
            </div>
          </Card>

          <Card title="Activity">
            <div className="activity">
              {invoice.status === 'paid' && (
                <ActivityRowMini icon={<Icons.Check size={13} />} mint text={<>Marked as paid · {D2.formatDate(invoice.paidDate)}</>} />
              )}
              <ActivityRowMini icon={<Icons.Eye size={13} />} text="Customer viewed · 3 days ago" />
              <ActivityRowMini icon={<Icons.Send size={13} />} text={<>Sent via email · {D2.formatDate(invoice.issueDate)}</>} />
              <ActivityRowMini icon={<Icons.Plus size={13} />} text={<>Created · {D2.formatDate(invoice.issueDate)}</>} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

function ActivityRowMini({ icon, mint, text }) {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-1)', fontSize: 13}}>
      <div className={`activity-dot ${mint ? 'mint' : ''}`} style={{width: 24, height: 24}}>{icon}</div>
      <div style={{color: 'var(--text-2)', flex: 1}}>{text}</div>
    </div>
  );
}

window.InvoicePaper = function InvoicePaper({ invoice, customer }) {
  const sub = D2.invoiceSubtotal(invoice);
  const tax = D2.invoiceTax(invoice);
  const total = D2.invoiceTotal(invoice);
  return (
    <div className="doc-paper">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40}}>
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18}}>
            <div className="brand-mark" style={{width: 28, height: 28}}><Icons.Logo size={18} /></div>
            <div style={{fontSize: 16, fontWeight: 600, color: 'var(--mint-300)', letterSpacing: '-0.02em'}}>Eloquent Studio</div>
          </div>
          <div style={{color: 'var(--text-3)', fontSize: 12, lineHeight: 1.65}}>
            Office 1402, Sidra Tower<br />
            Sheikh Zayed Road, Dubai<br />
            United Arab Emirates<br />
            <span className="mono" style={{color: 'var(--text-4)'}}>TRN 100123450000001</span>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: 4}}>Invoice</div>
          <div className="mono" style={{fontSize: 24, fontWeight: 500, color: 'var(--text-1)', letterSpacing: '-0.02em'}}>{invoice.id}</div>
          <div style={{marginTop: 14}}><Badge status={invoice.status} /></div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 36}}>
        <div>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Billed to</div>
          <div style={{fontWeight: 500, color: 'var(--text-1)', marginBottom: 4}}>{customer.name}</div>
          <div style={{color: 'var(--text-3)', fontSize: 12.5, lineHeight: 1.6}}>
            {customer.contact}<br />
            {customer.email}<br />
            {customer.city}, {customer.country}<br />
            <span className="mono" style={{color: 'var(--text-4)'}}>TRN {customer.trn}</span>
          </div>
        </div>
        <div>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Issued</div>
          <div style={{color: 'var(--text-1)', fontSize: 13.5}}>{D2.formatDate(invoice.issueDate)}</div>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginTop: 14, marginBottom: 8}}>Due</div>
          <div style={{color: 'var(--text-1)', fontSize: 13.5}}>{D2.formatDate(invoice.dueDate)}</div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Amount due</div>
          <div style={{fontSize: 30, fontWeight: 600, color: 'var(--mint-300)', letterSpacing: '-0.025em'}} className="num">
            <span style={{fontSize: 14, color: 'var(--text-3)', fontWeight: 500, marginRight: 4}}>AED</span>
            {Number(total).toLocaleString('en-AE', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: 24}}>
        <thead>
          <tr style={{borderBottom: '1px solid var(--border-2)'}}>
            <th style={{textAlign: 'left', padding: '10px 0', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', fontWeight: 500}}>Description</th>
            <th style={{textAlign: 'right', padding: '10px 0', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', fontWeight: 500, width: 70}}>Qty</th>
            <th style={{textAlign: 'right', padding: '10px 0', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', fontWeight: 500, width: 130}}>Unit price</th>
            <th style={{textAlign: 'right', padding: '10px 0', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', fontWeight: 500, width: 130}}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((it, i) => (
            <tr key={i} style={{borderBottom: '1px solid var(--border-1)'}}>
              <td style={{padding: '14px 0', color: 'var(--text-1)', fontSize: 14}}>{it.description}</td>
              <td style={{padding: '14px 0', textAlign: 'right', color: 'var(--text-2)'}} className="num">{it.qty}</td>
              <td style={{padding: '14px 0', textAlign: 'right', color: 'var(--text-2)'}} className="num">{D2.formatAED(it.price)}</td>
              <td style={{padding: '14px 0', textAlign: 'right', color: 'var(--text-1)'}} className="num">{D2.formatAED(it.qty * it.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <div style={{width: 280}}>
          <div className="totals-row"><span>Subtotal</span><span className="num">{D2.formatAED(sub)}</span></div>
          <div className="totals-row"><span>VAT ({invoice.taxRate}%)</span><span className="num">{D2.formatAED(tax)}</span></div>
          <div className="totals-row grand"><span>Total</span><span className="num">{D2.formatAED(total)}</span></div>
        </div>
      </div>

      {invoice.notes && (
        <div style={{marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-1)'}}>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Notes</div>
          <div style={{color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6}}>{invoice.notes}</div>
        </div>
      )}

      <div style={{marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, fontSize: 12}}>
        <div>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Pay by bank transfer</div>
          <div style={{color: 'var(--text-2)', lineHeight: 1.65}} className="mono">
            Emirates NBD<br />
            IBAN AE07 0260 0010 0987 6543 210<br />
            Swift EBILAEAD
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Pay online</div>
          <div style={{color: 'var(--text-2)', lineHeight: 1.65}}>
            <a href="#" style={{color: 'var(--mint-300)'}}>billing.eloquent.studio/pay/{invoice.id.toLowerCase()}</a>
          </div>
        </div>
      </div>
    </div>
  );
};
