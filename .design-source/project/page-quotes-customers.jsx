// Quotations + Customers + Customer detail
const D4 = window.AppData;

window.PageQuotations = function PageQuotations({ quotations, onOpen, onNew, onConvertToInvoice }) {
  const [tab, setTab] = useState('all');
  const filtered = quotations.filter(q => tab === 'all' || q.status === tab);
  const counts = {
    all: quotations.length,
    pending: quotations.filter(q => q.status === 'pending').length,
    accepted: quotations.filter(q => q.status === 'accepted').length,
    declined: quotations.filter(q => q.status === 'declined').length,
  };
  const pipeline = quotations.filter(q => q.status === 'pending').reduce((s, q) => s + D4.invoiceTotal(q), 0);

  return (
    <div className="page">
      <PageHeader
        title="Quotations"
        subtitle={`${counts.pending} pending · AED ${pipeline.toLocaleString('en-AE', { maximumFractionDigits: 0 })} in pipeline`}
        actions={
          <>
            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
            <Btn variant="primary" icon={<Icons.Plus size={15} />} onClick={onNew}>New quotation</Btn>
          </>
        }
      />

      <Tabs
        tabs={[
          { id: 'all',      label: 'All',      count: counts.all },
          { id: 'pending',  label: 'Pending',  count: counts.pending },
          { id: 'accepted', label: 'Accepted', count: counts.accepted },
          { id: 'declined', label: 'Declined', count: counts.declined },
        ]}
        value={tab}
        onChange={setTab}
      />

      <Card padding={false}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Quotation</th>
                <th>Customer</th>
                <th>Issued</th>
                <th>Valid until</th>
                <th>Status</th>
                <th className="right">Amount</th>
                <th style={{width: 130}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => {
                const cust = D4.findCustomer(q.customerId);
                return (
                  <tr key={q.id} style={{cursor: 'pointer'}} onClick={() => onOpen(q.id)}>
                    <td><span className="doc-id">{q.id}</span></td>
                    <td><CustomerCell customer={cust} /></td>
                    <td className="muted">{D4.formatDate(q.issueDate)}</td>
                    <td className="muted">{D4.formatDate(q.validUntil)}</td>
                    <td><Badge status={q.status} /></td>
                    <td className="right num">{D4.formatAED(D4.invoiceTotal(q))}</td>
                    <td>
                      {q.status === 'accepted' ? (
                        <Btn variant="secondary" size="sm" icon={<Icons.ChevronRight size={13} />}
                             onClick={(e) => { e.stopPropagation(); onConvertToInvoice(q); }}>
                          Convert
                        </Btn>
                      ) : (
                        <Btn variant="ghost" size="sm" icon={<Icons.More size={16} />} onClick={(e) => e.stopPropagation()} />
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="7" className="empty">No quotations here yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

window.PageQuotationDetail = function PageQuotationDetail({ quote, onBack, onAccept, onDecline, onConvert }) {
  const cust = D4.findCustomer(quote.customerId);
  const sub = D4.invoiceSubtotal(quote);
  const tax = D4.invoiceTax(quote);
  const total = D4.invoiceTotal(quote);

  // Reuse InvoicePaper but with "Quotation" label — pass through with overrides
  const fakeInvoice = { ...quote, dueDate: quote.validUntil };

  return (
    <div className="page">
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18}}>
        <Btn variant="ghost" size="sm" icon={<Icons.ChevronLeft size={14} />} onClick={onBack}>Back to quotations</Btn>
      </div>
      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap'}}>
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6}}>
            <h1 style={{margin: 0, fontSize: 28, letterSpacing: '-0.025em', fontWeight: 600}}>{quote.id}</h1>
            <Badge status={quote.status} />
          </div>
          <div style={{color: 'var(--text-3)', fontSize: 14}}>
            Issued {D4.formatDate(quote.issueDate)} · Valid until {D4.formatDate(quote.validUntil)}
          </div>
        </div>
        <div style={{display: 'flex', gap: 10}}>
          <Btn variant="ghost" icon={<Icons.Download size={15} />}>PDF</Btn>
          {quote.status === 'pending' && (
            <>
              <Btn variant="danger" icon={<Icons.X size={15} />} onClick={onDecline}>Mark declined</Btn>
              <Btn variant="primary" icon={<Icons.Check size={15} />} onClick={onAccept}>Mark accepted</Btn>
            </>
          )}
          {quote.status === 'accepted' && (
            <Btn variant="primary" icon={<Icons.Invoice size={15} />} onClick={onConvert}>Convert to invoice</Btn>
          )}
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20}}>
        <QuotePaper quote={quote} customer={cust} />

        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <Card title="Summary">
            <div className="kpi-row"><span className="kpi-label">Subtotal</span><span className="kpi-value num">{D4.formatAED(sub)}</span></div>
            <div className="kpi-row"><span className="kpi-label">VAT ({quote.taxRate}%)</span><span className="kpi-value num">{D4.formatAED(tax)}</span></div>
            <div className="kpi-row" style={{borderTop: '1px solid var(--border-2)', marginTop: 6, paddingTop: 14}}>
              <span className="kpi-label" style={{color: 'var(--text-1)', fontWeight: 500}}>Total</span>
              <span style={{fontSize: 20, fontWeight: 600, color: 'var(--mint-300)'}} className="num">{D4.formatAED(total)}</span>
            </div>
          </Card>
          <Card title="Customer">
            <CustomerCell customer={cust} />
            <div className="divider"></div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-2)'}}>
              <div style={{display: 'flex', gap: 8}}><Icons.Mail size={13} /><span>{cust.email}</span></div>
              <div style={{display: 'flex', gap: 8}}><Icons.Phone size={13} /><span>{cust.phone}</span></div>
              <div style={{display: 'flex', gap: 8}}><Icons.Building size={13} /><span>{cust.city}, {cust.country}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

function QuotePaper({ quote, customer }) {
  const sub = D4.invoiceSubtotal(quote);
  const tax = D4.invoiceTax(quote);
  const total = D4.invoiceTotal(quote);
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
            Sheikh Zayed Road, Dubai · UAE<br />
            <span className="mono" style={{color: 'var(--text-4)'}}>TRN 100123450000001</span>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: 4}}>Quotation</div>
          <div className="mono" style={{fontSize: 24, fontWeight: 500, color: 'var(--text-1)', letterSpacing: '-0.02em'}}>{quote.id}</div>
          <div style={{marginTop: 14}}><Badge status={quote.status} /></div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 36}}>
        <div>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Prepared for</div>
          <div style={{fontWeight: 500, color: 'var(--text-1)', marginBottom: 4}}>{customer.name}</div>
          <div style={{color: 'var(--text-3)', fontSize: 12.5, lineHeight: 1.6}}>
            {customer.contact}<br />{customer.email}<br />{customer.city}, {customer.country}
          </div>
        </div>
        <div>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Issued</div>
          <div style={{color: 'var(--text-1)', fontSize: 13.5}}>{D4.formatDate(quote.issueDate)}</div>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginTop: 14, marginBottom: 8}}>Valid until</div>
          <div style={{color: 'var(--text-1)', fontSize: 13.5}}>{D4.formatDate(quote.validUntil)}</div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Total estimate</div>
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
          {quote.items.map((it, i) => (
            <tr key={i} style={{borderBottom: '1px solid var(--border-1)'}}>
              <td style={{padding: '14px 0', color: 'var(--text-1)', fontSize: 14}}>{it.description}</td>
              <td style={{padding: '14px 0', textAlign: 'right', color: 'var(--text-2)'}} className="num">{it.qty}</td>
              <td style={{padding: '14px 0', textAlign: 'right', color: 'var(--text-2)'}} className="num">{D4.formatAED(it.price)}</td>
              <td style={{padding: '14px 0', textAlign: 'right', color: 'var(--text-1)'}} className="num">{D4.formatAED(it.qty * it.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <div style={{width: 280}}>
          <div className="totals-row"><span>Subtotal</span><span className="num">{D4.formatAED(sub)}</span></div>
          <div className="totals-row"><span>VAT ({quote.taxRate}%)</span><span className="num">{D4.formatAED(tax)}</span></div>
          <div className="totals-row grand"><span>Total</span><span className="num">{D4.formatAED(total)}</span></div>
        </div>
      </div>

      {quote.notes && (
        <div style={{marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-1)'}}>
          <div style={{fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Notes</div>
          <div style={{color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6}}>{quote.notes}</div>
        </div>
      )}
    </div>
  );
}

window.PageCustomers = function PageCustomers({ customers, invoices, onOpen, onNew }) {
  const [query, setQuery] = useState('');
  const enriched = customers.map(c => {
    const cust_invs = invoices.filter(i => i.customerId === c.id);
    const total = cust_invs.reduce((s, i) => s + D4.invoiceTotal(i), 0);
    const outstanding = cust_invs.filter(i => i.status !== 'paid' && i.status !== 'draft').reduce((s, i) => s + D4.invoiceTotal(i), 0);
    return { ...c, invoiceCount: cust_invs.length, total, outstanding };
  });
  const filtered = enriched.filter(c => !query || c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="page">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers · AED ${enriched.reduce((s, c) => s + c.outstanding, 0).toLocaleString('en-AE', { maximumFractionDigits: 0 })} outstanding`}
        actions={
          <>
            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
            <Btn variant="primary" icon={<Icons.Plus size={15} />} onClick={onNew}>Add customer</Btn>
          </>
        }
      />

      <Toolbar>
        <div className="search" style={{width: 320}}>
          <Icons.Search size={14} />
          <input placeholder="Search customers…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Btn variant="secondary" size="sm" icon={<Icons.Filter size={14} />}>Filter</Btn>
        <div className="toolbar-spacer"></div>
      </Toolbar>

      <Card padding={false}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th className="right">Invoices</th>
                <th className="right">Outstanding</th>
                <th className="right">Lifetime</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{cursor: 'pointer'}} onClick={() => onOpen(c.id)}>
                  <td>
                    <div className="cust-row">
                      <div className="cust-avatar">{c.initials}</div>
                      <div>
                        <div className="cust-name">{c.name}</div>
                        <div className="cust-sub">Since {D4.formatDate(c.since)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{color: 'var(--text-1)'}}>{c.contact}</div>
                    <div style={{color: 'var(--text-4)', fontSize: 12}}>{c.email}</div>
                  </td>
                  <td className="muted">{c.city}, {c.country}</td>
                  <td className="right num">{c.invoiceCount}</td>
                  <td className="right num" style={{color: c.outstanding > 0 ? '#fca5a5' : 'var(--text-3)'}}>{c.outstanding > 0 ? D4.formatAED(c.outstanding) : '—'}</td>
                  <td className="right num" style={{color: 'var(--text-1)'}}>{D4.formatAED(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

window.PageCustomerDetail = function PageCustomerDetail({ customer, invoices, quotations, payments, onBack, onOpenInvoice, onOpenQuote, onNewInvoice }) {
  const cust_invs = invoices.filter(i => i.customerId === customer.id);
  const cust_quotes = quotations.filter(q => q.customerId === customer.id);
  const cust_pays = payments.filter(p => p.customerId === customer.id);
  const total = cust_invs.reduce((s, i) => s + D4.invoiceTotal(i), 0);
  const outstanding = cust_invs.filter(i => i.status !== 'paid' && i.status !== 'draft').reduce((s, i) => s + D4.invoiceTotal(i), 0);
  const paid = cust_invs.filter(i => i.status === 'paid').reduce((s, i) => s + D4.invoiceTotal(i), 0);

  const [tab, setTab] = useState('invoices');

  return (
    <div className="page">
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18}}>
        <Btn variant="ghost" size="sm" icon={<Icons.ChevronLeft size={14} />} onClick={onBack}>Back to customers</Btn>
      </div>

      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 20, flexWrap: 'wrap'}}>
        <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
          <div className="cust-avatar" style={{width: 56, height: 56, fontSize: 18, borderRadius: 12}}>{customer.initials}</div>
          <div>
            <h1 style={{margin: 0, fontSize: 26, letterSpacing: '-0.025em', fontWeight: 600}}>{customer.name}</h1>
            <div style={{color: 'var(--text-3)', fontSize: 14, marginTop: 4, display: 'flex', gap: 14}}>
              <span>{customer.contact}</span>
              <span style={{color: 'var(--text-5)'}}>·</span>
              <span>{customer.email}</span>
              <span style={{color: 'var(--text-5)'}}>·</span>
              <span>{customer.city}, {customer.country}</span>
            </div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 10}}>
          <Btn variant="secondary" icon={<Icons.Mail size={15} />}>Email</Btn>
          <Btn variant="secondary" icon={<Icons.Edit size={15} />}>Edit</Btn>
          <Btn variant="primary" icon={<Icons.Plus size={15} />} onClick={() => onNewInvoice(customer.id)}>New invoice</Btn>
        </div>
      </div>

      <div className="grid-stats" style={{marginBottom: 24, gridTemplateColumns: 'repeat(4, 1fr)'}}>
        <StatTile label="Lifetime value" currency="AED" value={total.toLocaleString('en-AE', { maximumFractionDigits: 0 })} />
        <StatTile label="Paid" currency="AED" value={paid.toLocaleString('en-AE', { maximumFractionDigits: 0 })} delta={`${cust_invs.filter(i => i.status === 'paid').length} invoices`} deltaDir="flat" />
        <StatTile label="Outstanding" currency="AED" value={outstanding.toLocaleString('en-AE', { maximumFractionDigits: 0 })} delta={outstanding > 0 ? 'Action required' : 'All clear'} deltaDir={outstanding > 0 ? 'down' : 'up'} />
        <StatTile label="Avg. days to pay" value="11" delta="2 days faster" deltaDir="up" />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20}}>
        <div>
          <Tabs
            tabs={[
              { id: 'invoices',   label: 'Invoices',   count: cust_invs.length },
              { id: 'quotations', label: 'Quotations', count: cust_quotes.length },
              { id: 'payments',   label: 'Payments',   count: cust_pays.length },
            ]}
            value={tab}
            onChange={setTab}
          />
          <Card padding={false}>
            <div className="table-wrap">
              {tab === 'invoices' && (
                <table className="table">
                  <thead><tr><th>Invoice</th><th>Issued</th><th>Due</th><th>Status</th><th className="right">Amount</th></tr></thead>
                  <tbody>
                    {cust_invs.map(i => (
                      <tr key={i.id} onClick={() => onOpenInvoice(i.id)} style={{cursor: 'pointer'}}>
                        <td><span className="doc-id">{i.id}</span></td>
                        <td className="muted">{D4.formatDate(i.issueDate)}</td>
                        <td className="muted">{D4.formatDate(i.dueDate)}</td>
                        <td><Badge status={i.status} /></td>
                        <td className="right num">{D4.formatAED(D4.invoiceTotal(i))}</td>
                      </tr>
                    ))}
                    {cust_invs.length === 0 && <tr><td colSpan="5" className="empty">No invoices yet.</td></tr>}
                  </tbody>
                </table>
              )}
              {tab === 'quotations' && (
                <table className="table">
                  <thead><tr><th>Quotation</th><th>Issued</th><th>Valid until</th><th>Status</th><th className="right">Amount</th></tr></thead>
                  <tbody>
                    {cust_quotes.map(q => (
                      <tr key={q.id} onClick={() => onOpenQuote(q.id)} style={{cursor: 'pointer'}}>
                        <td><span className="doc-id">{q.id}</span></td>
                        <td className="muted">{D4.formatDate(q.issueDate)}</td>
                        <td className="muted">{D4.formatDate(q.validUntil)}</td>
                        <td><Badge status={q.status} /></td>
                        <td className="right num">{D4.formatAED(D4.invoiceTotal(q))}</td>
                      </tr>
                    ))}
                    {cust_quotes.length === 0 && <tr><td colSpan="5" className="empty">No quotations yet.</td></tr>}
                  </tbody>
                </table>
              )}
              {tab === 'payments' && (
                <table className="table">
                  <thead><tr><th>Payment</th><th>Date</th><th>Method</th><th>Reference</th><th className="right">Amount</th></tr></thead>
                  <tbody>
                    {cust_pays.map(p => (
                      <tr key={p.id}>
                        <td><span className="doc-id">{p.id}</span></td>
                        <td className="muted">{D4.formatDate(p.date)}</td>
                        <td className="muted">{p.method}</td>
                        <td className="mono muted" style={{fontSize: 12}}>{p.ref}</td>
                        <td className="right num">{D4.formatAED(p.amount)}</td>
                      </tr>
                    ))}
                    {cust_pays.length === 0 && <tr><td colSpan="5" className="empty">No payments yet.</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <Card title="Details">
            <div style={{display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13}}>
              <DetailRow label="Primary contact" value={customer.contact} />
              <DetailRow label="Email" value={customer.email} />
              <DetailRow label="Phone" value={customer.phone} />
              <DetailRow label="TRN" value={<span className="mono">{customer.trn}</span>} />
              <DetailRow label="Address" value={<>{customer.city}, {customer.country}</>} />
              <DetailRow label="Customer since" value={D4.formatDate(customer.since)} />
            </div>
          </Card>
          <Card title="Notes">
            <div style={{color: 'var(--text-3)', fontSize: 13, lineHeight: 1.65}}>
              Strategic partner since 2022. Prefers invoices on the 1st and 15th. Net-14 payment terms agreed in master services agreement.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

function DetailRow({ label, value }) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-1)'}}>
      <span style={{color: 'var(--text-4)', fontSize: 12}}>{label}</span>
      <span style={{color: 'var(--text-1)', textAlign: 'right'}}>{value}</span>
    </div>
  );
}
