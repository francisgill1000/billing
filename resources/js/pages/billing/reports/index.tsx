import { Head } from '@inertiajs/react';
import BillingLayout from '@/billing/BillingLayout';
import { Icons } from '@/billing/icons';
import { Btn, Card, PageHeader, StatTile } from '@/billing/ui';
import { formatAED, formatAEDShort } from '@/billing/format';

type Props = {
    stats: { revenue_ytd: number; last_quarter: number; avg_invoice: number; collection_rate: number };
    revenue_monthly: { m: string; v: number }[];
    aging: { bucket: string; amount: number; color: string }[];
    top_customers: { name: string; amount: number; share: number }[];
    tax: { taxable_sales: number; vat_collected: number; input_vat: number; net_payable: number };
};

function RevenueBars({ data }: { data: { m: string; v: number }[] }) {
    const max = Math.max(...data.map((d) => d.v), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 220, padding: '14px 4px 0' }}>
            {data.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 10.5, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{d.v}k</div>
                    <div
                        style={{
                            width: '100%',
                            height: `${(d.v / max) * 168}px`,
                            background:
                                i === data.length - 1
                                    ? 'linear-gradient(180deg, var(--mint-300), var(--mint-600))'
                                    : 'linear-gradient(180deg, rgba(0,255,204,0.4), rgba(0,255,204,0.12))',
                            borderRadius: 6,
                            border: i === data.length - 1 ? '1px solid var(--mint-300)' : '1px solid var(--border-mint)',
                            boxShadow: i === data.length - 1 ? '0 6px 22px -6px rgba(0,255,204,0.45)' : 'none',
                        }}
                    ></div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{d.m}</div>
                </div>
            ))}
        </div>
    );
}

export default function Reports({ stats, revenue_monthly, aging, top_customers, tax }: Props) {
    const maxAging = Math.max(...aging.map((a) => a.amount), 1);
    return (
        <BillingLayout active="reports" title="Reports">
            <Head title="Reports" />
            <div className="page">
                <PageHeader
                    title="Reports"
                    subtitle="Revenue, receivables and customer insights."
                    actions={
                        <>
                            <Btn variant="secondary" icon={<Icons.Calendar size={15} />}>FY {new Date().getFullYear()}</Btn>
                            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export PDF</Btn>
                        </>
                    }
                />

                <div className="grid-stats" style={{ marginBottom: 24 }}>
                    <StatTile label="Revenue YTD" currency="AED" value={Number(stats.revenue_ytd).toLocaleString('en-AE')} delta="+34%" deltaDir="up" sub="vs prior year" />
                    <StatTile label="Last quarter" currency="AED" value={Number(stats.last_quarter).toLocaleString('en-AE')} delta="+12%" deltaDir="up" />
                    <StatTile label="Avg. invoice" currency="AED" value={Number(stats.avg_invoice).toLocaleString('en-AE')} delta="+8%" deltaDir="up" />
                    <StatTile label="Collection rate" value={`${stats.collection_rate}%`} delta="+3 pp" deltaDir="up" />
                </div>

                <div className="bil-stack-mobile" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
                    <Card title="Monthly revenue · last 12 months">
                        <RevenueBars data={revenue_monthly} />
                    </Card>
                    <Card title="Receivables aging">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                            {aging.map((a, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                                        <span style={{ color: 'var(--text-2)' }}>{a.bucket}</span>
                                        <span className="num" style={{ color: 'var(--text-1)' }}>{formatAEDShort(a.amount)}</span>
                                    </div>
                                    <div style={{ height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(a.amount / maxAging) * 100}%`, background: a.color, borderRadius: 4 }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="bil-stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <Card title="Top customers · this year" padding={false}>
                        <div className="table-wrap">
                            <table className="table">
                                <thead><tr><th>Customer</th><th>Share</th><th className="right">Revenue</th></tr></thead>
                                <tbody>
                                    {top_customers.map((c, i) => (
                                        <tr key={i}>
                                            <td style={{ color: 'var(--text-1)', fontWeight: 500 }}>{c.name}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 180 }}>
                                                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${Math.min(100, c.share * 4)}%`, background: 'var(--mint-500)', borderRadius: 3 }}></div>
                                                    </div>
                                                    <span className="num muted" style={{ fontSize: 12, minWidth: 32 }}>{c.share}%</span>
                                                </div>
                                            </td>
                                            <td className="right num">{formatAED(c.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card title="Tax summary">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <div className="kpi-row"><span className="kpi-label">Taxable sales</span><span className="kpi-value num">{formatAED(tax.taxable_sales)}</span></div>
                            <div className="kpi-row"><span className="kpi-label">VAT collected</span><span className="kpi-value num">{formatAED(tax.vat_collected)}</span></div>
                            <div className="kpi-row"><span className="kpi-label">Input VAT</span><span className="kpi-value num">{formatAED(tax.input_vat)}</span></div>
                            <div className="kpi-row" style={{ borderTop: '1px solid var(--border-2)', marginTop: 4, paddingTop: 14 }}>
                                <span className="kpi-label" style={{ color: 'var(--text-1)' }}>Net VAT payable</span>
                                <span className="num" style={{ color: 'var(--mint-300)', fontSize: 18, fontWeight: 600 }}>{formatAED(tax.net_payable)}</span>
                            </div>
                        </div>
                        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--mint-soft)', border: '1px solid var(--border-mint)', borderRadius: 10, fontSize: 12.5, color: 'var(--mint-200)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icons.Calendar size={14} />
                            <span>FTA return due quarterly — check the Tax & currency settings.</span>
                        </div>
                    </Card>
                </div>
            </div>
        </BillingLayout>
    );
}
