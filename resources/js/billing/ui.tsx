import * as React from 'react';
import { Icons } from './icons';

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type BtnSize = 'sm' | 'md' | 'lg';

export function Btn({
    variant = 'secondary',
    size = 'md',
    icon,
    children,
    onClick,
    type = 'button',
    disabled,
    as,
    href,
    ...rest
}: {
    variant?: BtnVariant;
    size?: BtnSize;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    as?: 'button' | 'a';
    href?: string;
    title?: string;
} & React.HTMLAttributes<HTMLElement>) {
    const cls = [
        'btn',
        `btn-${variant}`,
        size === 'sm' && 'btn-sm',
        size === 'lg' && 'btn-lg',
        !children && 'btn-icon',
    ]
        .filter(Boolean)
        .join(' ');
    if (as === 'a' || href) {
        return (
            <a className={cls} href={href} {...(rest as React.HTMLAttributes<HTMLAnchorElement>)}>
                {icon}
                {children}
            </a>
        );
    }
    return (
        <button type={type} className={cls} onClick={onClick} disabled={disabled} {...rest}>
            {icon}
            {children}
        </button>
    );
}

export function Badge({ status, children }: { status: string; children?: React.ReactNode }) {
    return (
        <span className={`badge badge-${status}`}>
            <span className="dot"></span>
            {children ?? status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export function Field({
    label,
    children,
    hint,
}: {
    label?: string;
    children: React.ReactNode;
    hint?: React.ReactNode;
}) {
    return (
        <div className="field">
            {label && <label className="field-label">{label}</label>}
            {children}
            {hint && <div style={{ fontSize: 12, color: 'var(--text-4)' }}>{hint}</div>}
        </div>
    );
}

export function Input({
    prefix,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { prefix?: React.ReactNode }) {
    if (prefix) {
        return (
            <div className="input-prefix">
                <span className="input-prefix-slot">{prefix}</span>
                <input className="input" {...props} />
            </div>
        );
    }
    return <input className="input" {...props} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select className="select" {...props}>
            {children}
        </select>
    );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea className="textarea" {...props} />;
}

export function Card({
    title,
    action,
    children,
    padding = true,
    style,
}: {
    title?: React.ReactNode;
    action?: React.ReactNode;
    children: React.ReactNode;
    padding?: boolean;
    style?: React.CSSProperties;
}) {
    return (
        <div className="card" style={style}>
            {(title || action) && (
                <div className="card-header">
                    {title && <h3>{title}</h3>}
                    {action}
                </div>
            )}
            <div className={padding ? 'card-body' : ''}>{children}</div>
        </div>
    );
}

export function Drawer({
    open,
    onClose,
    title,
    footer,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
}) {
    React.useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);
    if (!open) return null;
    return (
        <>
            <div className="drawer-overlay" onClick={onClose}></div>
            <div className="drawer">
                <div className="drawer-header">
                    <h2>{title}</h2>
                    <Btn variant="ghost" size="sm" icon={<Icons.X size={16} />} onClick={onClose} />
                </div>
                <div className="drawer-body">{children}</div>
                {footer && <div className="drawer-footer">{footer}</div>}
            </div>
        </>
    );
}

export function Toolbar({ children }: { children: React.ReactNode }) {
    return <div className="toolbar">{children}</div>;
}

export function Tabs<T extends string>({
    tabs,
    value,
    onChange,
}: {
    tabs: { id: T; label: string; count?: number }[];
    value: T;
    onChange: (id: T) => void;
}) {
    return (
        <div className="tabs">
            {tabs.map((t) => (
                <button
                    key={t.id}
                    className={`tab ${t.id === value ? 'active' : ''}`}
                    onClick={() => onChange(t.id)}
                    type="button"
                >
                    {t.label}
                    {t.count != null && <span className="tab-count">{t.count}</span>}
                </button>
            ))}
        </div>
    );
}

export function CustomerCell({
    customer,
    sub,
}: {
    customer?: { name: string; initials?: string | null } | null;
    sub?: React.ReactNode;
}) {
    if (!customer) return null;
    const initials =
        customer.initials ||
        customer.name
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase() ?? '')
            .join('');
    return (
        <div className="cust-row">
            <div className="cust-avatar">{initials}</div>
            <div>
                <div className="cust-name">{customer.name}</div>
                {sub && <div className="cust-sub">{sub}</div>}
            </div>
        </div>
    );
}

export function StatTile({
    label,
    value,
    currency,
    delta,
    deltaDir = 'up',
    sub,
}: {
    label: React.ReactNode;
    value: React.ReactNode;
    currency?: string;
    delta?: React.ReactNode;
    deltaDir?: 'up' | 'down' | 'flat';
    sub?: React.ReactNode;
}) {
    const Arrow = deltaDir === 'up' ? Icons.ArrowUp : deltaDir === 'down' ? Icons.ArrowDown : null;
    return (
        <div className="stat">
            <div className="stat-label">{label}</div>
            <div className="stat-value">
                {currency && <span className="currency">{currency}</span>}
                {value}
            </div>
            {delta && (
                <div className={`stat-delta ${deltaDir}`}>
                    {Arrow && <Arrow size={13} />}
                    <span>{delta}</span>
                    {sub && (
                        <span style={{ color: 'var(--text-4)', marginLeft: 4 }}>{sub}</span>
                    )}
                </div>
            )}
        </div>
    );
}

export function PageHeader({
    title,
    subtitle,
    actions,
}: {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
}) {
    return (
        <div className="page-header">
            <div>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            {actions && <div className="page-header-actions">{actions}</div>}
        </div>
    );
}

export function FlashToast({ message }: { message: string | null }) {
    if (!message) return null;
    return (
        <div className="toast">
            <Icons.Check size={16} />
            <span>{message}</span>
        </div>
    );
}
