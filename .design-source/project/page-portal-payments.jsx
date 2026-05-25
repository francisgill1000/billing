// Record payment drawer + Customer portal preview
const DP = window.AppData;

window.RecordPaymentDrawer = function RecordPaymentDrawer({ open, invoice, onClose, onSave }) {
  const total = invoice ? DP.invoiceTotal(invoice) : 0;
  const [amount, setAmount]   = useState(total);
  const [method, setMethod]   = useState('Bank transfer');
  const [date, setDate]       = useState(DP.today);
  const [reference, setReference] = useState('');
  const [note, setNote]       = useState('');

  useEffect(() => { if (invoice) { setAmount(DP.invoiceTotal(invoice)); setReference(''); setNote(''); } }, [invoice]);
  if (!invoice) return null;

  const cust = DP.findCustomer(invoice.customerId);
  const isFull = Number(amount) >= total - 0.001;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      invoiceId: invoice.id,
      customerId: invoice.customerId,
      amount: Number(amount),
      method,
      date,
      ref: reference || `${method.toUpperCase().split(' ')[0]}-${Math.floor(Math.random() * 90000 + 10000)}`,
      note,
      isFull,
    });
  };

  return (
    <Drawer open={open} onClose={onClose}
      title="Record payment"
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" icon={<Icons.Check size={15} />} onClick={handleSubmit}>
            {isFull ? 'Record full payment' : 'Record partial payment'}
          </Btn>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{padding: 16, background: 'var(--surface-1)', borderRadius: 12, border: '1px solid var(--border-2)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12}}>
            <div>
              <div style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-4)', marginBottom: 4}}>Against invoice</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8}}>
                <span className="doc-id" style={{fontSize: 15}}>{invoice.id}</span>
                <Badge status={invoice.status} />
              </div>
              <CustomerCell customer={cust} />
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-4)'}}>Total due</div>
              <div className="num" style={{fontSize: 22, fontWeight: 600, color: 'var(--mint-300)', marginTop: 4}}>{DP.formatAED(total)}</div>
            </div>
          </div>
        </div>

        <Field label="Amount received">
          <Input prefix="AED" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
        </Field>

        {!isFull && Number(amount) > 0 && (
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--warn-soft)', border: '1px solid rgba(244,184,96,0.22)', borderRadius: 10, fontSize: 13, color: 'var(--warn)'}}>
            <Icons.Sparkle size={14} />
            <span>Partial payment · AED {Math.max(0, total - Number(amount)).toLocaleString('en-AE', { minimumFractionDigits: 2 })} will remain outstanding.</span>
          </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          <Field label="Payment date">
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </Field>
          <Field label="Method">
            <Select value={method} onChange={e => setMethod(e.target.value)}>
              <option>Bank transfer</option>
              <option>Card</option>
              <option>Cheque</option>
              <option>Cash</option>
              <option>Other</option>
            </Select>
          </Field>
        </div>

        <Field label="Reference" hint="Bank transaction ID, cheque number, etc.">
          <Input placeholder="e.g. ENBD-99821" value={reference} onChange={e => setReference(e.target.value)} />
        </Field>

        <Field label="Internal note (optional)">
          <Textarea placeholder="Anything else to remember about this payment…" value={note} onChange={e => setNote(e.target.value)} />
        </Field>

        <div style={{padding: 14, background: 'rgba(0,255,204,0.05)', border: '1px solid var(--border-mint)', borderRadius: 10, fontSize: 12.5, color: 'var(--mint-200)', display: 'flex', gap: 10}}>
          <Icons.Check size={14} style={{flexShrink: 0, marginTop: 2}} />
          <span>The customer will receive a receipt automatically once you save this payment.</span>
        </div>
      </form>
    </Drawer>
  );
};

window.PageCustomerPortal = function PageCustomerPortal({ invoice, onClose, onPay }) {
  const cust = DP.findCustomer(invoice.customerId);
  const total = DP.invoiceTotal(invoice);
  const sub = DP.invoiceSubtotal(invoice);
  const tax = DP.invoiceTax(invoice);
  const isPaid = invoice.status === 'paid';

  return (
    <div className="portal-shell">
      <div style={{position: 'fixed', top: 16, left: 16, zIndex: 10}}>
        <Btn variant="ghost" size="sm" icon={<Icons.ChevronLeft size={14} />} onClick={onClose}>Exit preview</Btn>
      </div>
      <div style={{position: 'fixed', top: 16, right: 16, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: 'rgba(15,20,17,0.7)', border: '1px solid var(--border-2)', borderRadius: 999, fontSize: 12, color: 'var(--text-3)', backdropFilter: 'blur(10px)'}}>
        <Icons.Eye size={12} />
        <span>Customer view · what {cust.name.split(' ')[0]} sees</span>
      </div>

      <div className="portal-card">
        <div className="portal-banner">
          <Icons.Shield size={14} />
          <span>Secure invoice portal · <strong style={{color: 'var(--mint-100)'}}>billing.eloquent.studio/pay/{invoice.id.toLowerCase()}</strong></span>
        </div>

        <div style={{padding: '36px 44px 28px', borderBottom: '1px solid var(--border-1)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20}}>
            <div className="brand-mark" style={{width: 30, height: 30}}><Icons.Logo size={20} /></div>
            <div style={{fontSize: 17, fontWeight: 600, color: 'var(--mint-300)', letterSpacing: '-0.02em'}}>Eloquent Studio</div>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap'}}>
            <div>
              <div style={{fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 6}}>Invoice {invoice.id}</div>
              <h1 style={{margin: 0, fontSize: 38, fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--text-1)'}}>
                <span style={{fontSize: 18, color: 'var(--text-3)', fontWeight: 500, marginRight: 6}}>AED</span>
                <span className="num">{Number(total).toLocaleString('en-AE', { minimumFractionDigits: 2 })}</span>
              </h1>
              <div style={{color: 'var(--text-3)', fontSize: 14, marginTop: 8}}>
                {isPaid ? `Paid in full on ${DP.formatDate(invoice.paidDate)}` : `Due by ${DP.formatDate(invoice.dueDate)}`}
              </div>
            </div>
            <Badge status={invoice.status} />
          </div>
        </div>

        {!isPaid && (
          <div style={{padding: '24px 44px', borderBottom: '1px solid var(--border-1)'}}>
            <div style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 14}}>Pay this invoice</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              <button className="portal-pay" onClick={onPay}>
                <div className="icon-box"><Icons.Card size={18} /></div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 500}}>Pay with card</div>
                  <div className="sub">Visa, Mastercard, Amex · instant confirmation</div>
                </div>
                <Icons.ChevronRight size={16} style={{color: 'var(--text-4)'}} />
              </button>
              <button className="portal-pay">
                <div className="icon-box"><Icons.Building size={18} /></div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 500}}>Bank transfer</div>
                  <div className="sub">IBAN AE07 0260 0010 0987 6543 210 · 1–2 business days</div>
                </div>
                <Icons.ChevronRight size={16} style={{color: 'var(--text-4)'}} />
              </button>
              <button className="portal-pay">
                <div className="icon-box"><Icons.Wallet size={18} /></div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 500}}>Apple Pay · Google Pay</div>
                  <div className="sub">Pay from your device in seconds</div>
                </div>
                <Icons.ChevronRight size={16} style={{color: 'var(--text-4)'}} />
              </button>
            </div>
          </div>
        )}

        {isPaid && (
          <div style={{padding: '24px 44px', borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{width: 44, height: 44, borderRadius: 12, background: 'var(--mint-soft)', border: '1px solid var(--border-mint)', display: 'grid', placeItems: 'center', color: 'var(--mint-300)'}}>
              <Icons.Check size={20} />
            </div>
            <div>
              <div style={{color: 'var(--text-1)', fontWeight: 500, fontSize: 15}}>Payment received — thank you.</div>
              <div style={{color: 'var(--text-3)', fontSize: 13, marginTop: 2}}>A receipt has been emailed to {cust.email}.</div>
            </div>
            <Btn variant="secondary" size="sm" icon={<Icons.Download size={13} />} style={{marginLeft: 'auto'}}>Receipt</Btn>
          </div>
        )}

        <div style={{padding: '28px 44px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18}}>
            <div style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)'}}>What you're paying for</div>
            <Btn variant="ghost" size="sm" icon={<Icons.Download size={13} />}>Download PDF</Btn>
          </div>

          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <tbody>
              {invoice.items.map((it, i) => (
                <tr key={i} style={{borderBottom: '1px solid var(--border-1)'}}>
                  <td style={{padding: '12px 0', color: 'var(--text-1)', fontSize: 14}}>
                    {it.description}
                    {it.qty > 1 && <span style={{color: 'var(--text-4)', marginLeft: 8, fontSize: 12.5}}>× {it.qty}</span>}
                  </td>
                  <td className="num" style={{padding: '12px 0', textAlign: 'right', color: 'var(--text-1)', fontSize: 14}}>{DP.formatAED(it.qty * it.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 18}}>
            <div style={{width: 260}}>
              <div className="totals-row"><span>Subtotal</span><span className="num">{DP.formatAED(sub)}</span></div>
              <div className="totals-row"><span>VAT ({invoice.taxRate}%)</span><span className="num">{DP.formatAED(tax)}</span></div>
              <div className="totals-row grand"><span>Total</span><span className="num">{DP.formatAED(total)}</span></div>
            </div>
          </div>
        </div>

        <div style={{padding: '20px 44px', borderTop: '1px solid var(--border-1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, fontSize: 12.5}}>
          <div>
            <div style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>Billed to</div>
            <div style={{color: 'var(--text-1)', fontWeight: 500}}>{cust.name}</div>
            <div style={{color: 'var(--text-3)', lineHeight: 1.6}}>
              {cust.contact}<br />
              {cust.email}<br />
              {cust.city}, {cust.country}
            </div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', marginBottom: 8}}>From</div>
            <div style={{color: 'var(--text-1)', fontWeight: 500}}>Eloquent Studio FZE</div>
            <div style={{color: 'var(--text-3)', lineHeight: 1.6}}>
              hello@eloquent.studio<br />
              +971 4 558 9900<br />
              Dubai, UAE
            </div>
          </div>
        </div>

        <div style={{padding: '16px 44px', background: 'rgba(0,0,0,0.25)', textAlign: 'center', fontSize: 12, color: 'var(--text-4)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
          <Icons.Lock size={11} />
          <span>Secured by Eloquent Billing · questions? <a href="#" style={{color: 'var(--mint-300)'}}>hello@eloquent.studio</a></span>
        </div>
      </div>
    </div>
  );
};

window.EmailTemplatePreview = function EmailTemplatePreview({ kind = 'invoice', invoice }) {
  if (!invoice) invoice = DP.invoices[1];
  const cust = DP.findCustomer(invoice.customerId);
  const total = DP.invoiceTotal(invoice);

  const subject = kind === 'invoice'
    ? `Invoice ${invoice.id} from Eloquent Studio · AED ${total.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`
    : kind === 'reminder'
      ? `Friendly reminder: ${invoice.id} is due ${DP.formatDate(invoice.dueDate)}`
      : `Receipt for your payment · ${invoice.id}`;

  return (
    <div className="email-mockup">
      <div className="email-mockup-header">
        <div className="brand-mark" style={{width: 26, height: 26}}><Icons.Logo size={16} /></div>
        <div>
          <div style={{fontSize: 14, fontWeight: 600, color: 'var(--mint-300)'}}>Eloquent Studio</div>
          <div style={{fontSize: 11.5, color: 'var(--text-4)'}}>hello@eloquent.studio</div>
        </div>
      </div>

      <div className="email-mockup-body">
        <div style={{color: '#6b736e', fontSize: 12, marginBottom: 6}}>To: {cust.email}</div>
        <h2 style={{margin: '0 0 18px', fontSize: 19, fontWeight: 600, color: '#1a1f1d', letterSpacing: '-0.015em'}}>{subject}</h2>

        {kind === 'invoice' && (
          <>
            <p>Hi {cust.contact.split(' ')[0]},</p>
            <p>Thanks again for your business. Your invoice <strong>{invoice.id}</strong> is ready and attached as a PDF. You can also pay online in a single tap below.</p>
          </>
        )}
        {kind === 'reminder' && (
          <>
            <p>Hi {cust.contact.split(' ')[0]},</p>
            <p>Just a gentle reminder that invoice <strong>{invoice.id}</strong> is due on <strong>{DP.formatDate(invoice.dueDate)}</strong>. If you've already paid, please ignore this — and thank you.</p>
          </>
        )}
        {kind === 'receipt' && (
          <>
            <p>Hi {cust.contact.split(' ')[0]},</p>
            <p>We've received your payment for invoice <strong>{invoice.id}</strong> — thank you. Your receipt is below for your records.</p>
          </>
        )}

        <dl className="email-mockup-meta">
          <div><dt>Amount</dt><dd>AED {total.toLocaleString('en-AE', { minimumFractionDigits: 2 })}</dd></div>
          <div><dt>Due</dt><dd>{DP.formatDate(invoice.dueDate)}</dd></div>
          <div><dt>Invoice number</dt><dd style={{fontFamily: 'var(--font-mono)'}}>{invoice.id}</dd></div>
          <div><dt>Reference</dt><dd>Project work · May 2026</dd></div>
        </dl>

        <a href="#" className="email-mockup-cta">
          {kind === 'invoice' ? 'View & pay invoice' : kind === 'reminder' ? 'Pay now' : 'View receipt'}
          <span style={{marginLeft: 8}}>→</span>
        </a>

        <p style={{marginTop: 18, color: '#6b736e', fontSize: 12.5}}>
          Questions? Just reply to this email or call us on +971 4 558 9900.
        </p>
        <p style={{marginTop: 18}}>Warmly,<br/><strong>Layla, Eloquent Studio</strong></p>
      </div>

      <div className="email-mockup-footer">
        Eloquent Studio FZE · Office 1402, Sidra Tower · Sheikh Zayed Road, Dubai, UAE<br />
        TRN 100123450000001 · <a href="#" style={{color: '#6b736e'}}>Unsubscribe</a>
      </div>
    </div>
  );
};
