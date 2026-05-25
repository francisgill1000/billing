// Dashboard page
const D = window.AppData;

window.PageDashboard = function PageDashboard({ onNav, onOpenInvoice }) {
  const inv = D.invoices;
  const outstanding = inv.filter(i => i.status === 'sent' || i.status === 'overdue' || i.status === 'partial')
    .reduce((s, i) => s + D.invoiceTotal(i), 0);
  const overdueCount = inv.filter(i => i.status === 'overdue').length;
  const paidThisMonth = inv.filter(i => i.status === 'paid' && new Date(i.paidDate || i.issueDate) >= new Date('2026-05-01'))
    .reduce((s, i) => s + D.invoiceTotal(i), 0);
  const activeQuotes = D.quotations.filter(q => q.status === 'pending').length;
  const pipelineValue = D.quotations.filter(q => q.status === 'pending')
    .reduce((s, q) => s + D.invoiceTotal(q), 0);

  const fmt = (n) => Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });

  // Recent (last 5)
  const recent = [...inv].sort((a, b) => b.issueDate.localeCompare(a.issueDate)).slice(0, 5);

  return (
    <div className="page">
      <PageHeader
        title="Good morning, Layla"
        subtitle="Tuesday, May 25, 2026 · here's where things stand."
        actions={
          <>
            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
            <Btn variant="primary" icon={<Icons.Plus size={15} />} onClick={() => onNav('invoices/new')}>New invoice</Btn>
          </>
        }
      />

      <div className="grid-stats" style={{marginBottom: 28}}>
        <StatTile label="Outstanding" currency="AED" value={fmt(outstanding)} delta="+12.4%" deltaDir="up" sub="vs last month" />
        <StatTile label="Paid this month" currency="AED" value={fmt(paidThisMonth)} delta="+18%" deltaDir="up" sub="vs Apr" />
        <StatTile label="Overdue" value={`${overdueCount} invoices`} delta="2 over 30 days" deltaDir="down" />
        <StatTile label="Active quotes" value={activeQuotes} delta={`AED ${fmt(pipelineValue)} pipeline`} deltaDir="flat" />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20, marginBottom: 28}}>
        <Card title="Revenue · last 12 months" action={
          <div style={{display: 'flex', gap: 6}}>
            <Btn variant="ghost" size="sm">12M</Btn>
            <Btn variant="ghost" size="sm">3M</Btn>
            <Btn variant="ghost" size="sm">YTD</Btn>
          </div>
        }>
          <RevenueChart data={D.revenueMonthly} />
        </Card>

        <Card title="Cash collection" action={<Btn variant="ghost" size="sm">May 2026</Btn>}>
          <CollectionDonut />
        </Card>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20}}>
        <Card title="Recent invoices" action={<Btn variant="ghost" size="sm" onClick={() => onNav('invoices')}>View all <Icons.ChevronRight size={14} /></Btn>} padding={false}>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Issued</th>
                  <th>Status</th>
                  <th className="right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(i => {
                  const cust = D.findCustomer(i.customerId);
                  return (
                    <tr key={i.id} style={{cursor: 'pointer'}} onClick={() => onOpenInvoice(i.id)}>
                      <td><span className="doc-id">{i.id}</span></td>
                      <td><CustomerCell customer={cust} /></td>
                      <td className="muted">{D.formatDate(i.issueDate)}</td>
                      <td><Badge status={i.status} /></td>
                      <td className="right num">{D.formatAED(D.invoiceTotal(i))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Activity">
          <div className="activity">
            <ActivityRow icon={<Icons.Check size={14} />} mint
              text={<><strong>Crescent Media</strong> paid INV-2026-0148</>} time="2h ago" />
            <ActivityRow icon={<Icons.Send size={14} />}
              text={<>Sent <strong>INV-2026-0147</strong> to Atlas Architecture</>} time="6h ago" />
            <ActivityRow icon={<Icons.Bell size={14} />}
              text={<><strong>INV-2026-0146</strong> is overdue by 15 days</>} time="yesterday" />
            <ActivityRow icon={<Icons.Quote size={14} />} mint
              text={<>Lumen accepted <strong>QUO-2026-0041</strong></>} time="2d ago" />
            <ActivityRow icon={<Icons.Plus size={14} />}
              text={<>Added customer <strong>Lumen Hospitality</strong></>} time="3d ago" />
            <ActivityRow icon={<Icons.Card size={14} />} mint
              text={<>Received AED 8,000 toward INV-2026-0144</>} time="last week" />
          </div>
        </Card>
      </div>
    </div>
  );
};

function ActivityRow({ icon, mint, text, time }) {
  return (
    <div className="activity-row">
      <div className={`activity-dot ${mint ? 'mint' : ''}`}>{icon}</div>
      <div className="activity-text">{text}</div>
      <div className="activity-time">{time}</div>
    </div>
  );
}

function RevenueChart({ data }) {
  const W = 720, H = 220, pad = { l: 40, r: 12, t: 18, b: 28 };
  const max = Math.max(...data.map(d => d.v)) * 1.15;
  const min = 0;
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const x = (i) => pad.l + (i / (data.length - 1)) * innerW;
  const y = (v) => pad.t + (1 - (v - min) / (max - min)) * innerH;

  const linePts = data.map((d, i) => `${x(i)},${y(d.v)}`).join(' ');
  const areaPts = `${pad.l},${pad.t + innerH} ${linePts} ${pad.l + innerW},${pad.t + innerH}`;
  const gridY = [0, 0.25, 0.5, 0.75, 1].map(t => pad.t + t * innerH);

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00ffcc" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridY.map((gy, i) => (
          <line key={i} x1={pad.l} x2={W - pad.r} y1={gy} y2={gy} stroke="rgba(255,255,255,0.04)" />
        ))}
        {[0, 0.5, 1].map((t, i) => {
          const v = Math.round(max * (1 - t));
          return <text key={i} x={pad.l - 8} y={pad.t + t * innerH + 4} fontSize="10" fill="#5d6661" textAnchor="end" fontFamily="Geist Mono">{v}k</text>;
        })}
        <polygon points={areaPts} fill="url(#rev-area)" />
        <polyline points={linePts} fill="none" stroke="#00ffcc" strokeWidth="2" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d.v)} r="3" fill="#00ffcc" />
            <text x={x(i)} y={H - 10} fontSize="10.5" fill="#5d6661" textAnchor="middle" fontFamily="Geist">{d.m}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function CollectionDonut() {
  const segments = [
    { label: 'Paid',     value: 68, color: '#00ffcc' },
    { label: 'Sent',     value: 22, color: '#60a5fa' },
    { label: 'Partial',  value: 6,  color: '#f4b860' },
    { label: 'Overdue',  value: 4,  color: '#f87171' },
  ];
  const total = segments.reduce((s, x) => s + x.value, 0);
  const R = 56, C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div style={{display: 'flex', gap: 24, alignItems: 'center'}}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
        {segments.map((s, i) => {
          const len = (s.value / total) * C;
          const dasharray = `${len} ${C - len}`;
          const dashoffset = -offset;
          offset += len;
          return (
            <circle key={i} cx="80" cy="80" r={R} fill="none"
              stroke={s.color} strokeWidth="16"
              strokeDasharray={dasharray} strokeDashoffset={dashoffset}
              transform="rotate(-90 80 80)" strokeLinecap="butt" />
          );
        })}
        <text x="80" y="76" textAnchor="middle" fill="#f3f5f4" fontSize="22" fontWeight="600" fontFamily="Geist" letterSpacing="-0.025em">68%</text>
        <text x="80" y="94" textAnchor="middle" fill="#8a938f" fontSize="11" fontFamily="Geist">collected</text>
      </svg>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
        {segments.map((s, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 13}}>
            <span style={{width: 10, height: 10, borderRadius: 3, background: s.color}}></span>
            <span style={{color: 'var(--text-2)', flex: 1}}>{s.label}</span>
            <span className="num" style={{color: 'var(--text-1)'}}>{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
