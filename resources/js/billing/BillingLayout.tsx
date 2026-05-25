import { Link, router, usePage } from '@inertiajs/react';
import * as React from 'react';
import { Icons, Logo } from './icons';
import { FlashToast } from './ui';

type SharedProps = {
    auth: { user: { name: string; email: string } | null };
    flash?: string | null;
};

function Sidebar({ active }: { active: string }) {
    const items = [
        { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard, href: '/dashboard' },
        { id: 'invoices', label: 'Invoices', icon: Icons.Invoice, href: '/invoices' },
        { id: 'recurring', label: 'Recurring', icon: Icons.Repeat, href: '/recurring' },
        { id: 'quotations', label: 'Quotations', icon: Icons.Quote, href: '/quotations' },
        { id: 'customers', label: 'Customers', icon: Icons.Users, href: '/customers' },
        { id: 'payments', label: 'Payments', icon: Icons.Card, href: '/payments' },
        { id: 'reports', label: 'Reports', icon: Icons.Chart, href: '/reports' },
    ];
    const account = [{ id: 'settings', label: 'Settings', icon: Icons.Settings, href: '/billing-settings' }];

    const page = usePage<SharedProps>();
    const user = page.props.auth?.user;
    const initials = user ? user.name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') : 'EQ';

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-mark">
                    <Logo size={20} />
                </div>
                <div className="brand-name">Billing</div>
            </div>

            <div className="nav-section-title">Workspace</div>
            <div className="nav-items">
                {items.map((it) => {
                    const Icon = it.icon;
                    return (
                        <Link
                            key={it.id}
                            href={it.href}
                            className={`nav-item ${active === it.id ? 'active' : ''}`}
                        >
                            <span className="nav-icon">
                                <Icon size={18} />
                            </span>
                            <span className="nav-label">{it.label}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="nav-section-title">Account</div>
            <div className="nav-items">
                {account.map((it) => {
                    const Icon = it.icon;
                    return (
                        <Link
                            key={it.id}
                            href={it.href}
                            className={`nav-item ${active === it.id ? 'active' : ''}`}
                        >
                            <span className="nav-icon">
                                <Icon size={18} />
                            </span>
                            <span className="nav-label">{it.label}</span>
                        </Link>
                    );
                })}
                <button
                    type="button"
                    onClick={() => router.post('/logout')}
                    className="nav-item"
                >
                    <span className="nav-icon">
                        <Icons.LogOut size={18} />
                    </span>
                    <span className="nav-label">Sign out</span>
                </button>
            </div>

            <div className="sidebar-footer">
                <div className="avatar">{initials}</div>
                <div className="sidebar-footer-text" style={{ minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: 'var(--text-1)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {user?.name ?? 'Eloquent Studio'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-4)', whiteSpace: 'nowrap' }}>
                        Pro plan · AED
                    </div>
                </div>
            </div>
        </aside>
    );
}

function Topbar({ title, crumb }: { title: React.ReactNode; crumb?: React.ReactNode }) {
    return (
        <header className="topbar">
            <div className="topbar-title">
                {crumb && <span className="crumb">{crumb}</span>}
                {crumb && <Icons.ChevronRight size={14} style={{ color: 'var(--text-4)' }} />}
                <h1>{title}</h1>
            </div>
            <div className="topbar-actions">
                <div className="search">
                    <Icons.Search size={14} />
                    <input placeholder="Search invoices, customers…" />
                    <kbd>⌘K</kbd>
                </div>
            </div>
        </header>
    );
}

export default function BillingLayout({
    active,
    title,
    crumb,
    children,
}: {
    active: string;
    title: React.ReactNode;
    crumb?: React.ReactNode;
    children: React.ReactNode;
}) {
    const page = usePage<SharedProps>();
    const flash = page.props.flash ?? null;
    const [toast, setToast] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (flash) {
            setToast(flash);
            const id = setTimeout(() => setToast(null), 2400);
            return () => clearTimeout(id);
        }
    }, [flash]);

    return (
        <div className="billing-root">
            <div className="app">
                <Sidebar active={active} />
                <main className="main">
                    <Topbar title={title} crumb={crumb} />
                    {children}
                </main>
            </div>
            <FlashToast message={toast} />
        </div>
    );
}
