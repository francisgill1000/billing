import { Head, Link } from '@inertiajs/react';
import BillingLayout from '@/billing/BillingLayout';
import { Icons } from '@/billing/icons';
import { Badge, Btn, Card, CustomerCell, PageHeader, StatTile } from '@/billing/ui';
import { formatAED, formatDate } from '@/billing/format';
import type { Invoice } from '@/billing/types';
import * as React from 'react';

type Props = {
    stats: { outstanding: number; paid_this_month: number; overdue_count: number; active_quotes: number; pipeline_value: number };
    segments: { label: string; value: number; color: string }[];
    revenue_monthly: { m: string; v: number }[];
    recent_invoices: Invoice[];
    greeting_name: string;
};

function ActivityRow({ icon, mint, text, time }: { icon: React.ReactNode; mint?: boolean; text: React.ReactNode; time: string }) {
    return (
        <div className="activity-row">
            <div className={`activity-dot ${mint ? 'mint' : ''}`}>{icon}</div>
            <div className="activity-text">{text}</div>
            <div className="activity-time">{time}</div>
        </div>
    );
}

function RevenueChart({ data }: { data: { m: string; v: number }[] }) {
    const W = 720, H = 220, pad = { l: 40, r: 12, t: 18, b: 28 };
    const max = Math.max(...data.map((d) => d.v), 1) * 1.15;
    const innerW = W - pad.l - pad.r;
    const innerH = H - pad.t - pad.b;
    const x = (i: number) => pad.l + (i / Math.max(1, data.length - 1)) * innerW;
    const y = (v: number) => pad.t + (1 - v / max) * innerH;
    const linePts = data.map((d, i) => `${x(i)},${y(d.v)}`).join(' ');
    const areaPts = `${pad.l},${pad.t + innerH} ${linePts} ${pad.l + innerW},${pad.t + innerH}`;
    const gridY = [0, 0.25, 0.5, 0.75, 1].map((t) => pad.t + t * innerH);

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
                    return (
                        <text key={i} x={pad.l - 8} y={pad.t + t * innerH + 4} fontSize="10" fill="#5d6661" textAnchor="end" fontFamily="Geist Mono">
                            {v}k
                        </text>
                    );
                })}
                <polygon points={areaPts} fill="url(#rev-area)" />
                <polyline points={linePts} fill="none" stroke="#00ffcc" strokeWidth="2" strokeLinejoin="round" />
                {data.map((d, i) => (
                    <g key={i}>
                        <circle cx={x(i)} cy={y(d.v)} r="3" fill="#00ffcc" />
                        <text x={x(i)} y={H - 10} fontSize="10.5" fill="#5d6661" textAnchor="middle" fontFamily="Geist">
                            {d.m}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

function CollectionDonut({ segments }: { segments: { label: string; value: number; color: string }[] }) {
    const total = Math.max(1, segments.reduce((s, x) => s + x.value, 0));
    const R = 56;
    const C = 2 * Math.PI * R;
    let offset = 0;
    const paidPct = segments.find((s) => s.label === 'Paid')?.value ?? 0;
    return (
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
                {segments.map((s, i) => {
                    const len = (s.value / total) * C;
                    const dasharray = `${len} ${C - len}`;
                    const dashoffset = -offset;
                    offset += len;
                    return (
                        <circle
                            key={i}
                            cx="80"
                            cy="80"
                            r={R}
                            fill="none"
                            stroke={s.color}
                            strokeWidth="16"
                            strokeDasharray={dasharray}
                            strokeDashoffset={dashoffset}
                            transform="rotate(-90 80 80)"
                        />
                    );
                })}
                <text x="80" y="76" textAnchor="middle" fill="#f3f5f4" fontSize="22" fontWeight="600" fontFamily="Geist" letterSpacing="-0.025em">
                    {paidPct}%
                </text>
                <text x="80" y="94" textAnchor="middle" fill="#8a938f" fontSize="11" fontFamily="Geist">
                    collected
                </text>
            </svg>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {segments.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }}></span>
                        <span style={{ color: 'var(--text-2)', flex: 1 }}>{s.label}</span>
                        <span className="num" style={{ color: 'var(--text-1)' }}>{s.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Dashboard({ stats, segments, revenue_monthly, recent_invoices, greeting_name }: Props) {
    const fmt = (n: number) => Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });
    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <BillingLayout active="dashboard" title="Dashboard">
            <Head title="Dashboard" />
            <div className="page">
                <PageHeader
                    title={`Good morning, ${greeting_name}`}
                    subtitle={`${today} · here's where things stand.`}
                    actions={
                        <>
                            <Btn variant="secondary" icon={<Icons.Download size={15} />}>Export</Btn>
                            <Btn variant="primary" icon={<Icons.Plus size={15} />} as="a" href="/invoices/create">New invoice</Btn>
                        </>
                    }
                />

                <div className="grid-stats" style={{ marginBottom: 28 }}>
                    <StatTile label="Outstanding" currency="AED" value={fmt(stats.outstanding)} delta="+12.4%" deltaDir="up" sub="vs last month" />
                    <StatTile label="Paid this month" currency="AED" value={fmt(stats.paid_this_month)} delta="+18%" deltaDir="up" sub="vs last month" />
                    <StatTile label="Overdue" value={`${stats.overdue_count} invoices`} delta={stats.overdue_count > 0 ? 'Action required' : 'All clear'} deltaDir={stats.overdue_count > 0 ? 'down' : 'up'} />
                    <StatTile label="Active quotes" value={stats.active_quotes} delta={`AED ${fmt(stats.pipeline_value)} pipeline`} deltaDir="flat" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20, marginBottom: 28 }}>
                    <Card
                        title="Revenue · last 12 months"
                        action={
                            <div style={{ display: 'flex', gap: 6 }}>
                                <Btn variant="ghost" size="sm">12M</Btn>
                                <Btn variant="ghost" size="sm">3M</Btn>
                                <Btn variant="ghost" size="sm">YTD</Btn>
                            </div>
                        }
                    >
                        <RevenueChart data={revenue_monthly} />
                    </Card>

                    <Card title="Cash collection" action={<Btn variant="ghost" size="sm">This month</Btn>}>
                        <CollectionDonut segments={segments} />
                    </Card>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20 }}>
                    <Card
                        title="Recent invoices"
                        action={<Btn variant="ghost" size="sm" as="a" href="/invoices">View all <Icons.ChevronRight size={14} /></Btn>}
                        padding={false}
                    >
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
                                    {recent_invoices.map((i) => (
                                        <tr key={i.id} style={{ cursor: 'pointer' }}>
                                            <td>
                                                <Link href={`/invoices/${i.id}`} className="doc-id">{i.number}</Link>
                                            </td>
                                            <td><CustomerCell customer={i.customer} /></td>
                                            <td className="muted">{formatDate(i.issue_date)}</td>
                                            <td><Badge status={i.status} /></td>
                                            <td className="right num">{formatAED(i.total)}</td>
                                        </tr>
                                    ))}
                                    {recent_invoices.length === 0 && (
                                        <tr><td colSpan={5} className="empty">No invoices yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card title="Activity">
                        <div className="activity">
                            <ActivityRow icon={<Icons.Check size={14} />} mint text={<>A customer paid an invoice.</>} time="2h ago" />
                            <ActivityRow icon={<Icons.Send size={14} />} text={<>Sent a new invoice.</>} time="6h ago" />
                            <ActivityRow icon={<Icons.Bell size={14} />} text={<>An invoice is overdue.</>} time="yesterday" />
                            <ActivityRow icon={<Icons.Quote size={14} />} mint text={<>A quote was accepted.</>} time="2d ago" />
                            <ActivityRow icon={<Icons.Plus size={14} />} text={<>Added a new customer.</>} time="3d ago" />
                            <ActivityRow icon={<Icons.Card size={14} />} mint text={<>Received a payment toward an invoice.</>} time="last week" />
                        </div>
                    </Card>
                </div>
            </div>
        </BillingLayout>
    );
}
