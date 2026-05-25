// Invoice / Quotation editor — used for both
const D3 = window.AppData;

window.PageInvoiceEditor = function PageInvoiceEditor({ initial, onCancel, onSave, mode = 'invoice' }) {
  const isQuote = mode === 'quote';
  const [customerId, setCustomerId] = useState(initial?.customerId || D3.customers[0].id);
  const [issueDate, setIssueDate] = useState(initial?.issueDate || D3.today);
  const [dueDate, setDueDate]     = useState(initial?.dueDate || initial?.validUntil || '2026-06-24');
  const [taxRate, setTaxRate]     = useState(initial?.taxRate ?? 5);
  const [notes, setNotes]         = useState(initial?.notes || '');
  const [items, setItems]         = useState(initial?.items || [
    { description: '', qty: 1, price: 0 },
  ]);

  const updateItem = (idx, patch) => {
    setItems(items.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };
  const addItem = () => setItems([...items, { description: '', qty: 1, price: 0 }]);
  const removeItem = (idx) => setItems(items.length > 1 ? items.filter((_, i) => i !== idx) : items);
  const addFromCatalog = (item) => {
    setItems([...items.filter(it => it.description), { description: item.name, qty: 1, price: item.price }]);
  };

  const sub = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
  const tax = Math.round(sub * (Number(taxRate) || 0)) / 100;
  const total = sub + sub * (Number(taxRate) || 0) / 100;

  const customer = D3.findCustomer(customerId);

  const handleSave = (status) => {
    const doc = {
      id: initial?.id || (isQuote ? `QUO-2026-${String(43 + Math.floor(Math.random()*9)).padStart(4,'0')}` : `INV-2026-${String(149 + Math.floor(Math.random()*9)).padStart(4,'0')}`),
      customerId, issueDate,
      [isQuote ? 'validUntil' : 'dueDate']: dueDate,
      taxRate: Number(taxRate),
      notes,
      items: items.filter(it => it.description),
      status,
    };
    onSave(doc);
  };

  const label = isQuote ? 'Quotation' : 'Invoice';

  return (
    <div className="page">
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18}}>
        <Btn variant="ghost" size="sm" icon={<Icons.ChevronLeft size={14} />} onClick={onCancel}>Cancel</Btn>
      </div>

      <PageHeader
        title={initial ? `Edit ${label}` : `New ${label}`}
        subtitle={isQuote ? 'Draft a quote for client approval.' : 'Bill a client for completed work.'}
        actions={
          <>
            <Btn variant="ghost" onClick={onCancel}>Discard</Btn>
            <Btn variant="secondary" icon={<Icons.Edit size={15} />} onClick={() => handleSave('draft')}>Save as draft</Btn>
            <Btn variant="primary" icon={<Icons.Send size={15} />} onClick={() => handleSave(isQuote ? 'pending' : 'sent')}>
              {isQuote ? 'Send quotation' : 'Send invoice'}
            </Btn>
          </>
        }
      />

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <Card title={`${label} details`}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16}}>
              <Field label="Customer">
                <Select value={customerId} onChange={e => setCustomerId(e.target.value)}>
                  {D3.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label={`${label} number`}>
                <Input value={initial?.id || (isQuote ? 'QUO-2026-0043' : 'INV-2026-0149')} readOnly />
              </Field>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16}}>
              <Field label="Issue date">
                <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
              </Field>
              <Field label={isQuote ? 'Valid until' : 'Due date'}>
                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </Field>
              <Field label="VAT rate (%)">
                <Input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title="Line items" action={
            <div style={{display: 'flex', gap: 6}}>
              <CatalogPicker onPick={addFromCatalog} />
              <Btn variant="secondary" size="sm" icon={<Icons.Plus size={14} />} onClick={addItem}>Add row</Btn>
            </div>
          } padding={false}>
            <div className="line-items" style={{border: 0, borderRadius: 0}}>
              <div className="line-items-header">
                <div>Description</div>
                <div style={{textAlign: 'right'}}>Qty</div>
                <div style={{textAlign: 'right'}}>Unit price</div>
                <div style={{textAlign: 'right'}}>Total</div>
                <div></div>
              </div>
              {items.map((it, i) => (
                <div key={i} className="line-item">
                  <Input placeholder="Service or product" value={it.description} onChange={e => updateItem(i, { description: e.target.value })} />
                  <Input type="number" style={{textAlign: 'right'}} value={it.qty} onChange={e => updateItem(i, { qty: e.target.value })} />
                  <Input prefix="AED" type="number" value={it.price} onChange={e => updateItem(i, { price: e.target.value })} />
                  <Input value={D3.formatAED((Number(it.qty) || 0) * (Number(it.price) || 0))} readOnly style={{textAlign: 'right', fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.015)'}} />
                  <button className="remove-btn" onClick={() => removeItem(i)} title="Remove"><Icons.Trash size={14} /></button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Notes & terms">
            <Textarea
              placeholder={isQuote
                ? "e.g. 50% deposit required to commence. Quote valid for 30 days."
                : "e.g. Payment due within 14 days. Late payments accrue 2% monthly interest."}
              value={notes} onChange={e => setNotes(e.target.value)}
            />
          </Card>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <Card title="Summary" action={<span className="muted" style={{fontSize: 12}}>Live preview</span>}>
            <div className="kpi-row">
              <span className="kpi-label">Items</span>
              <span className="kpi-value">{items.filter(it => it.description).length}</span>
            </div>
            <div className="kpi-row">
              <span className="kpi-label">Subtotal</span>
              <span className="kpi-value num">{D3.formatAED(sub)}</span>
            </div>
            <div className="kpi-row">
              <span className="kpi-label">VAT ({taxRate}%)</span>
              <span className="kpi-value num">{D3.formatAED(tax)}</span>
            </div>
            <div className="kpi-row" style={{borderTop: '1px solid var(--border-2)', marginTop: 6, paddingTop: 14}}>
              <span className="kpi-label" style={{color: 'var(--text-1)', fontWeight: 500}}>Total</span>
              <span style={{fontSize: 22, fontWeight: 600, color: 'var(--mint-300)'}} className="num">{D3.formatAED(total)}</span>
            </div>
          </Card>

          <Card title="Bill to">
            <CustomerCell customer={customer} />
            <div className="divider"></div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--text-3)'}}>
              <div>{customer.email}</div>
              <div>{customer.phone}</div>
              <div>{customer.city}, {customer.country}</div>
            </div>
          </Card>

          <Card title="Tips">
            <div style={{display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13, color: 'var(--text-3)'}}>
              <TipRow>Quick-add common services from the catalog button above.</TipRow>
              <TipRow>Tab through fields to move quickly. Press Enter on the last cell to add a row.</TipRow>
              <TipRow>Drafts are saved automatically every 10 seconds.</TipRow>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

function TipRow({ children }) {
  return (
    <div style={{display: 'flex', alignItems: 'flex-start', gap: 9}}>
      <Icons.Sparkle size={14} style={{color: 'var(--mint-400)', flexShrink: 0, marginTop: 1}} />
      <span>{children}</span>
    </div>
  );
}

function CatalogPicker({ onPick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div style={{position: 'relative'}} ref={ref}>
      <Btn variant="secondary" size="sm" icon={<Icons.Sparkle size={14} />} onClick={() => setOpen(o => !o)}>From catalog</Btn>
      {open && (
        <div style={{position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 320, background: 'var(--surface-1)', border: '1px solid var(--border-2)', borderRadius: 12, padding: 8, zIndex: 20, boxShadow: '0 18px 40px -10px rgba(0,0,0,0.6)'}}>
          <div style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-4)', padding: '8px 10px'}}>Catalog</div>
          <div style={{maxHeight: 280, overflowY: 'auto'}}>
            {D3.items.map((it, i) => (
              <button key={i} onClick={() => { onPick(it); setOpen(false); }} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                width: '100%', padding: '9px 10px', background: 'transparent', border: 0,
                color: 'var(--text-2)', fontSize: 13, cursor: 'pointer', borderRadius: 7, textAlign: 'left',
              }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span>{it.name}</span>
                <span className="num" style={{color: 'var(--text-3)', fontSize: 12}}>{D3.formatAEDShort(it.price)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
