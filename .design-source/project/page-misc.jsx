// Payments + Reports + Settings
const D5 = window.AppData;

window.PagePayments = function PagePayments({ payments }) {
  const total = payments.reduce((s, p) => s + p.amount, 0);
  const fmt = (n) => Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });

  return (
    <div className="page">
      <PageHeader
        title="Payments"
        subtitle={`${payments.length} payments received · AED ${fmt(total)} total`}
        actions={
          <>
            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
            <Btn variant="primary" icon={<Icons.Plus size={15} />}>Record payment</Btn>
          </>
        }
      />

      <div className="grid-stats" style={{marginBottom: 24}}>
        <StatTile label="Received this month" currency="AED" value={fmt(total)} delta="+18%" deltaDir="up" sub="vs Apr" />
        <StatTile label="Avg. payment time" value="11 days" delta="2 days faster" deltaDir="up" />
        <StatTile label="Payment methods" value="3 active" sub="Bank, Card, Cheque" />
        <StatTile label="Failed / disputed" value="0" delta="All clear" deltaDir="up" />
      </div>

      <Card padding={false} title="Recent payments" action={<Btn variant="ghost" size="sm" icon={<Icons.Filter size={14} />}>Filter</Btn>}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Payment</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Invoice</th>
                <th>Method</th>
                <th>Reference</th>
                <th className="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const cust = D5.findCustomer(p.customerId);
                return (
                  <tr key={p.id}>
                    <td><span className="doc-id">{p.id}</span></td>
                    <td className="muted">{D5.formatDate(p.date)}</td>
                    <td><CustomerCell customer={cust} /></td>
                    <td><span className="doc-id" style={{fontSize: 12.5}}>{p.invoiceId}</span></td>
                    <td>
                      <span className="badge badge-paid" style={{background: 'rgba(255,255,255,0.04)', color: 'var(--text-2)', borderColor: 'var(--border-2)'}}>
                        {p.method === 'Bank transfer' && <Icons.Building size={11} />}
                        {p.method === 'Card' && <Icons.Card size={11} />}
                        {p.method === 'Cheque' && <Icons.Receipt size={11} />}
                        <span>{p.method}</span>
                      </span>
                    </td>
                    <td className="mono muted" style={{fontSize: 12.5}}>{p.ref}</td>
                    <td className="right num" style={{color: 'var(--mint-300)'}}>{D5.formatAED(p.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

window.PageReports = function PageReports() {
  const monthly = D5.revenueMonthly;
  const totalYear = monthly.reduce((s, m) => s + m.v, 0);
  const lastQuarter = monthly.slice(-3).reduce((s, m) => s + m.v, 0);

  const topCustomers = [
    { name: 'Crescent Media Group', amount: 142800, share: 21 },
    { name: 'Orion Capital Partners', amount: 96400, share: 14 },
    { name: 'Atlas Architecture LLC', amount: 84200, share: 12 },
    { name: 'Lumen Hospitality Group', amount: 68000, share: 10 },
    { name: 'Helix Software DMCC', amount: 54000, share: 8 },
  ];

  const aging = [
    { bucket: 'Current', amount: 38400, color: '#00ffcc' },
    { bucket: '1–30 days', amount: 24200, color: '#60a5fa' },
    { bucket: '31–60 days', amount: 9800, color: '#f4b860' },
    { bucket: '60+ days', amount: 5200, color: '#f87171' },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Reports"
        subtitle="Revenue, receivables and customer insights."
        actions={
          <>
            <Btn variant="secondary" icon={<Icons.Calendar size={15} />}>FY 2026</Btn>
            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export PDF</Btn>
          </>
        }
      />

      <div className="grid-stats" style={{marginBottom: 24}}>
        <StatTile label="Revenue YTD" currency="AED" value={(totalYear * 1000).toLocaleString('en-AE')} delta="+34%" deltaDir="up" sub="vs FY 2025" />
        <StatTile label="Last quarter" currency="AED" value={(lastQuarter * 1000).toLocaleString('en-AE')} delta="+12%" deltaDir="up" />
        <StatTile label="Avg. invoice" currency="AED" value="14,250" delta="+8%" deltaDir="up" />
        <StatTile label="Collection rate" value="94%" delta="+3 pp" deltaDir="up" />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20}}>
        <Card title="Monthly revenue · last 12 months">
          <RevenueBars data={monthly} />
        </Card>
        <Card title="Receivables aging">
          <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4}}>
            {aging.map((a, i) => {
              const max = Math.max(...aging.map(x => x.amount));
              return (
                <div key={i}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13}}>
                    <span style={{color: 'var(--text-2)'}}>{a.bucket}</span>
                    <span className="num" style={{color: 'var(--text-1)'}}>{D5.formatAEDShort(a.amount)}</span>
                  </div>
                  <div style={{height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden'}}>
                    <div style={{height: '100%', width: `${(a.amount / max) * 100}%`, background: a.color, borderRadius: 4}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
        <Card title="Top customers · this year" padding={false}>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Customer</th><th>Share</th><th className="right">Revenue</th></tr></thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={i}>
                    <td style={{color: 'var(--text-1)', fontWeight: 500}}>{c.name}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: 10, maxWidth: 180}}>
                        <div style={{flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden'}}>
                          <div style={{height: '100%', width: `${c.share * 4}%`, background: 'var(--mint-500)', borderRadius: 3}}></div>
                        </div>
                        <span className="num muted" style={{fontSize: 12, minWidth: 32}}>{c.share}%</span>
                      </div>
                    </td>
                    <td className="right num">{D5.formatAED(c.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Tax summary · Q2 2026">
          <div style={{display: 'flex', flexDirection: 'column', gap: 0}}>
            <div className="kpi-row"><span className="kpi-label">Taxable sales</span><span className="kpi-value num">{D5.formatAED(284600)}</span></div>
            <div className="kpi-row"><span className="kpi-label">VAT collected (5%)</span><span className="kpi-value num">{D5.formatAED(14230)}</span></div>
            <div className="kpi-row"><span className="kpi-label">Input VAT</span><span className="kpi-value num">{D5.formatAED(3120)}</span></div>
            <div className="kpi-row" style={{borderTop: '1px solid var(--border-2)', marginTop: 4, paddingTop: 14}}>
              <span className="kpi-label" style={{color: 'var(--text-1)'}}>Net VAT payable</span>
              <span className="num" style={{color: 'var(--mint-300)', fontSize: 18, fontWeight: 600}}>{D5.formatAED(11110)}</span>
            </div>
          </div>
          <div style={{marginTop: 16, padding: '12px 14px', background: 'var(--mint-soft)', border: '1px solid var(--border-mint)', borderRadius: 10, fontSize: 12.5, color: 'var(--mint-200)', display: 'flex', alignItems: 'center', gap: 10}}>
            <Icons.Calendar size={14} />
            <span>FTA return due <strong style={{color: 'var(--mint-100)'}}>28 July 2026</strong></span>
          </div>
        </Card>
      </div>
    </div>
  );
};

function RevenueBars({ data }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 12, height: 220, padding: '14px 4px 0'}}>
      {data.map((d, i) => (
        <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
          <div style={{fontSize: 10.5, color: 'var(--text-4)', fontFamily: 'var(--font-mono)'}}>{d.v}k</div>
          <div style={{
            width: '100%',
            height: `${(d.v / max) * 168}px`,
            background: i === data.length - 1
              ? 'linear-gradient(180deg, var(--mint-300), var(--mint-600))'
              : 'linear-gradient(180deg, rgba(0,255,204,0.4), rgba(0,255,204,0.12))',
            borderRadius: 6,
            border: i === data.length - 1 ? '1px solid var(--mint-300)' : '1px solid var(--border-mint)',
            boxShadow: i === data.length - 1 ? '0 6px 22px -6px rgba(0,255,204,0.45)' : 'none',
          }}></div>
          <div style={{fontSize: 11, color: 'var(--text-3)'}}>{d.m}</div>
        </div>
      ))}
    </div>
  );
}

window.PageSettings = function PageSettings() {
  const [tab, setTab] = useState('company');
  const [emailNotif, setEmailNotif] = useState(true);
  const [overdueAlert, setOverdueAlert] = useState(true);
  const [autoReminder, setAutoReminder] = useState(false);

  return (
    <div className="page">
      <PageHeader title="Settings" subtitle="Manage your company profile, billing, and team." />

      <div style={{display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'flex-start'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 88}}>
          {[
            { id: 'company', label: 'Company profile', icon: Icons.Building },
            { id: 'invoicing', label: 'Invoicing defaults', icon: Icons.Invoice },
            { id: 'templates', label: 'Email templates', icon: Icons.Mail },
            { id: 'tax', label: 'Tax & currency', icon: Icons.Receipt },
            { id: 'notifications', label: 'Notifications', icon: Icons.Bell },
            { id: 'team', label: 'Team', icon: Icons.Users },
            { id: 'billing', label: 'Plan & billing', icon: Icons.Card },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                <span className="nav-icon"><Icon size={16} /></span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 740}}>
          {tab === 'company' && (
            <>
              <Card title="Company">
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                  <Field label="Company name"><Input defaultValue="Eloquent Studio FZE" /></Field>
                  <Field label="Trade license"><Input defaultValue="DMCC-892341" /></Field>
                  <Field label="TRN"><Input defaultValue="100123450000001" /></Field>
                  <Field label="Email"><Input defaultValue="hello@eloquent.studio" /></Field>
                  <div style={{gridColumn: '1 / -1'}}>
                    <Field label="Address"><Textarea defaultValue={'Office 1402, Sidra Tower\nSheikh Zayed Road, Dubai\nUnited Arab Emirates'} /></Field>
                  </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16}}>
                  <Btn variant="ghost">Cancel</Btn>
                  <Btn variant="primary">Save changes</Btn>
                </div>
              </Card>
              <Card title="Brand">
                <div style={{display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16}}>
                  <div style={{width: 72, height: 72, background: 'linear-gradient(160deg, var(--mint-400), var(--mint-700))', borderRadius: 14, display: 'grid', placeItems: 'center', boxShadow: '0 8px 24px -8px rgba(0,255,204,0.55)'}}>
                    <Icons.Logo size={36} />
                  </div>
                  <div>
                    <div style={{color: 'var(--text-1)', fontWeight: 500, marginBottom: 6}}>Logo</div>
                    <div style={{display: 'flex', gap: 8}}>
                      <Btn variant="secondary" size="sm">Upload new</Btn>
                      <Btn variant="ghost" size="sm">Remove</Btn>
                    </div>
                  </div>
                </div>
                <Field label="Accent color">
                  <div style={{display: 'flex', gap: 10}}>
                    {['#00ffcc', '#60a5fa', '#a78bfa', '#f4b860', '#f87171'].map(c => (
                      <div key={c} style={{width: 32, height: 32, background: c, borderRadius: 8, cursor: 'pointer', border: c === '#00ffcc' ? '2px solid var(--text-1)' : '2px solid transparent', boxShadow: c === '#00ffcc' ? '0 0 0 2px var(--bg-1)' : 'none'}}></div>
                    ))}
                  </div>
                </Field>
              </Card>
            </>
          )}

          {tab === 'invoicing' && (
            <Card title="Invoicing defaults">
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                <Field label="Invoice prefix"><Input defaultValue="INV-2026-" /></Field>
                <Field label="Next number"><Input defaultValue="0149" /></Field>
                <Field label="Payment terms"><Select defaultValue="14"><option value="0">Due on receipt</option><option value="7">Net 7</option><option value="14">Net 14</option><option value="30">Net 30</option></Select></Field>
                <Field label="Late fee"><Input defaultValue="2% per month" /></Field>
                <div style={{gridColumn: '1 / -1'}}>
                  <Field label="Default footer note">
                    <Textarea defaultValue="Thank you for your business. Payment within 14 days. Late payments accrue 2% monthly interest." />
                  </Field>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16}}>
                <Btn variant="ghost">Cancel</Btn>
                <Btn variant="primary">Save changes</Btn>
              </div>
            </Card>
          )}

          {tab === 'tax' && (
            <Card title="Tax & currency">
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                <Field label="Default currency"><Select defaultValue="AED"><option>AED</option><option>USD</option><option>EUR</option><option>GBP</option></Select></Field>
                <Field label="VAT rate (%)"><Input type="number" defaultValue="5" /></Field>
                <Field label="Tax registration number"><Input defaultValue="100123450000001" /></Field>
                <Field label="VAT return period"><Select defaultValue="quarterly"><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option></Select></Field>
              </div>
            </Card>
          )}

          {tab === 'templates' && <TemplatesPanel />}

          {tab === 'notifications' && (
            <Card title="Notifications">
              <SettingRow
                title="Email me when invoices are paid"
                desc="You'll receive a confirmation as soon as a payment lands."
                value={emailNotif} onChange={setEmailNotif}
              />
              <SettingRow
                title="Alert me about overdue invoices"
                desc="Daily summary of unpaid invoices past their due date."
                value={overdueAlert} onChange={setOverdueAlert}
              />
              <SettingRow
                title="Auto-send payment reminders"
                desc="Politely nudge customers 3 days before and after due date."
                value={autoReminder} onChange={setAutoReminder}
              />
            </Card>
          )}

          {tab === 'team' && (
            <Card title="Team members" action={<Btn variant="primary" size="sm" icon={<Icons.Plus size={13} />}>Invite</Btn>}>
              <div className="kpi-row" style={{paddingTop: 0}}>
                <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                  <div className="cust-avatar">LH</div>
                  <div>
                    <div style={{color: 'var(--text-1)', fontSize: 14}}>Layla Haddad</div>
                    <div style={{color: 'var(--text-4)', fontSize: 12}}>layla@eloquent.studio</div>
                  </div>
                </div>
                <span className="badge badge-accepted"><span className="dot"></span>Owner</span>
              </div>
              <div className="kpi-row">
                <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                  <div className="cust-avatar">MR</div>
                  <div>
                    <div style={{color: 'var(--text-1)', fontSize: 14}}>Mark Renton</div>
                    <div style={{color: 'var(--text-4)', fontSize: 12}}>mark@eloquent.studio</div>
                  </div>
                </div>
                <span className="badge badge-draft"><span className="dot"></span>Admin</span>
              </div>
              <div className="kpi-row">
                <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                  <div className="cust-avatar">SK</div>
                  <div>
                    <div style={{color: 'var(--text-1)', fontSize: 14}}>Sara Khouri</div>
                    <div style={{color: 'var(--text-4)', fontSize: 12}}>sara@eloquent.studio</div>
                  </div>
                </div>
                <span className="badge badge-draft"><span className="dot"></span>Accountant</span>
              </div>
            </Card>
          )}

          {tab === 'billing' && (
            <Card title="Plan & billing">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0 16px', borderBottom: '1px solid var(--border-1)', marginBottom: 16}}>
                <div>
                  <div style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--mint-300)', marginBottom: 4}}>Current plan</div>
                  <div style={{fontSize: 20, fontWeight: 600, color: 'var(--text-1)'}}>Pro · AED 149/month</div>
                  <div style={{fontSize: 13, color: 'var(--text-3)', marginTop: 4}}>Unlimited invoices, 5 team members, priority support.</div>
                </div>
                <Btn variant="secondary">Change plan</Btn>
              </div>
              <div className="kpi-row"><span className="kpi-label">Next renewal</span><span className="kpi-value">15 June 2026</span></div>
              <div className="kpi-row"><span className="kpi-label">Payment method</span><span className="kpi-value">Visa ·· 4242</span></div>
              <div className="kpi-row"><span className="kpi-label">Billing email</span><span className="kpi-value">accounts@eloquent.studio</span></div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

function SettingRow({ title, desc, value, onChange }) {
  return (
    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-1)', gap: 16}}>
      <div>
        <div style={{color: 'var(--text-1)', fontSize: 14, fontWeight: 500}}>{title}</div>
        <div style={{color: 'var(--text-3)', fontSize: 13, marginTop: 4}}>{desc}</div>
      </div>
      <div className={`switch ${value ? 'on' : ''}`} onClick={() => onChange(!value)}></div>
    </div>
  );
}

function TemplatesPanel() {
  const [kind, setKind] = useState('invoice');
  return (
    <Card title="Email templates" action={
      <div style={{display: 'flex', gap: 4, background: 'var(--surface-1)', padding: 4, borderRadius: 9, border: '1px solid var(--border-1)'}}>
        {[
          { id: 'invoice',  label: 'Sent' },
          { id: 'reminder', label: 'Reminder' },
          { id: 'receipt',  label: 'Receipt' },
        ].map(t => (
          <button key={t.id} onClick={() => setKind(t.id)} style={{
            border: 0, background: kind === t.id ? 'var(--surface-3)' : 'transparent',
            color: kind === t.id ? 'var(--text-1)' : 'var(--text-3)',
            padding: '5px 11px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
          }}>{t.label}</button>
        ))}
      </div>
    }>
      <div style={{color: 'var(--text-3)', fontSize: 13, marginBottom: 16}}>
        {kind === 'invoice'  && 'Sent when you issue a new invoice to a customer.'}
        {kind === 'reminder' && 'Sent automatically 3 days before due, on due date, and 7 days after.'}
        {kind === 'receipt'  && 'Sent to confirm a payment has been recorded.'}
      </div>
      <window.EmailTemplatePreview kind={kind} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-1)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-3)'}}>
          <Icons.Sparkle size={13} style={{color: 'var(--mint-400)'}} />
          <span>Variables like <span className="mono">{'{{customer.name}}'}</span> and <span className="mono">{'{{invoice.total}}'}</span> are auto-filled.</span>
        </div>
        <Btn variant="secondary" size="sm" icon={<Icons.Edit size={13} />}>Edit copy</Btn>
      </div>
    </Card>
  );
}
