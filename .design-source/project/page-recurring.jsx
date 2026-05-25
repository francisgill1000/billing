// Recurring invoices page
const DR = window.AppData;

window.PageRecurring = function PageRecurring({ schedules, onOpenCustomer, onToggle, onIssueNow, onNew }) {
  const active = schedules.filter(s => s.status === 'active');
  const monthlyValue = active.reduce((s, r) => {
    const sub = r.items.reduce((a, it) => a + it.qty * it.price, 0) * (1 + r.taxRate / 100);
    const monthFactor = r.frequency === 'monthly' ? 1 : r.frequency === 'quarterly' ? 1 / 3 : r.frequency === 'yearly' ? 1 / 12 : r.frequency === 'weekly' ? 4.33 : 1;
    return s + sub * monthFactor;
  }, 0);

  return (
    <div className="page">
      <PageHeader
        title="Recurring"
        subtitle={`${active.length} active schedules · AED ${Math.round(monthlyValue).toLocaleString('en-AE')} per month, automated`}
        actions={
          <>
            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
            <Btn variant="primary" icon={<Icons.Plus size={15} />} onClick={onNew}>New schedule</Btn>
          </>
        }
      />

      <div className="grid-stats" style={{marginBottom: 24}}>
        <StatTile label="Monthly run-rate" currency="AED" value={Math.round(monthlyValue).toLocaleString('en-AE')} delta={`${active.length} schedules`} deltaDir="up" />
        <StatTile label="Issued automatically (May)" value="4 invoices" delta="AED 51,500" deltaDir="up" />
        <StatTile label="Paused" value={schedules.filter(s => s.status === 'paused').length} />
        <StatTile label="Next run" value="01 Jun" delta="3 invoices queued" deltaDir="flat" />
      </div>

      <Card padding={false}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Schedule</th>
                <th>Customer</th>
                <th>Description</th>
                <th>Frequency</th>
                <th>Next issue</th>
                <th>Status</th>
                <th className="right">Amount</th>
                <th style={{width: 140}}></th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(r => {
                const cust = DR.findCustomer(r.customerId);
                const sub = r.items.reduce((a, it) => a + it.qty * it.price, 0);
                const total = sub * (1 + r.taxRate / 100);
                const desc = r.items.length === 1
                  ? r.items[0].description
                  : `${r.items[0].description} · +${r.items.length - 1} more`;
                return (
                  <tr key={r.id}>
                    <td><span className="doc-id">{r.id}</span></td>
                    <td><CustomerCell customer={cust} /></td>
                    <td style={{color: 'var(--text-2)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{desc}</td>
                    <td>
                      <span className="badge badge-draft" style={{textTransform: 'capitalize'}}>
                        <Icons.Repeat size={11} />
                        <span>{r.frequency}</span>
                      </span>
                    </td>
                    <td>
                      {r.nextDate ? (
                        <>
                          <div style={{color: 'var(--text-1)'}}>{DR.formatDate(r.nextDate)}</div>
                          <div style={{fontSize: 11, color: 'var(--text-4)'}}>in {DR.daysUntil(r.nextDate)} days</div>
                        </>
                      ) : <span className="muted">—</span>}
                    </td>
                    <td><Badge status={r.status === 'active' ? 'active' : 'paused'} /></td>
                    <td className="right num">{DR.formatAED(total)}</td>
                    <td>
                      <div style={{display: 'flex', gap: 6, justifyContent: 'flex-end'}}>
                        {r.status === 'active' && (
                          <Btn variant="ghost" size="sm" icon={<Icons.Send size={13} />} title="Issue now" onClick={() => onIssueNow(r)} />
                        )}
                        <Btn variant="ghost" size="sm"
                          icon={r.status === 'active' ? <Icons.Pause size={13} /> : <Icons.Play size={13} />}
                          title={r.status === 'active' ? 'Pause' : 'Resume'}
                          onClick={() => onToggle(r.id)} />
                        <Btn variant="ghost" size="sm" icon={<Icons.More size={14} />} />
                      </div>
                    </td>
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
