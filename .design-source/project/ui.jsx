// UI primitives — buttons, badges, fields, drawer, toast
const { useState, useEffect, useRef, useMemo, useCallback } = React;

window.Btn = function Btn({ variant = 'secondary', size = 'md', icon, children, onClick, type = 'button', disabled, ...rest }) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' && 'btn-sm', size === 'lg' && 'btn-lg', !children && 'btn-icon'].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} {...rest}>
      {icon}
      {children}
    </button>
  );
};

window.Badge = function Badge({ status, children }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="dot"></span>
      {children || (status.charAt(0).toUpperCase() + status.slice(1))}
    </span>
  );
};

window.Field = function Field({ label, children, hint }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
      {hint && <div style={{fontSize: 12, color: 'var(--text-4)'}}>{hint}</div>}
    </div>
  );
};

window.Input = function Input({ prefix, ...props }) {
  if (prefix) {
    return (
      <div className="input-prefix">
        <span className="input-prefix-slot">{prefix}</span>
        <input className="input" {...props} />
      </div>
    );
  }
  return <input className="input" {...props} />;
};

window.Select = function Select({ children, ...props }) {
  return <select className="select" {...props}>{children}</select>;
};

window.Textarea = function Textarea(props) {
  return <textarea className="textarea" {...props} />;
};

window.Card = function Card({ title, action, children, padding = true, style }) {
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
};

window.Drawer = function Drawer({ open, onClose, title, footer, width, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className="drawer" style={width ? { width } : null}>
        <div className="drawer-header">
          <h2>{title}</h2>
          <Btn variant="ghost" size="sm" icon={<Icons.X size={16} />} onClick={onClose} />
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-footer">{footer}</div>}
      </div>
    </>
  );
};

window.Toast = function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast">
      <Icons.Check size={16} />
      <span>{message}</span>
    </div>
  );
};

window.Toolbar = function Toolbar({ children }) {
  return <div className="toolbar">{children}</div>;
};

window.Tabs = function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs">
      {tabs.map(t => (
        <button key={t.id} className={`tab ${t.id === value ? 'active' : ''}`} onClick={() => onChange(t.id)}>
          {t.label}
          {t.count != null && <span className="tab-count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
};

window.CustomerCell = function CustomerCell({ customer, sub }) {
  if (!customer) return null;
  return (
    <div className="cust-row">
      <div className="cust-avatar">{customer.initials}</div>
      <div>
        <div className="cust-name">{customer.name}</div>
        {sub && <div className="cust-sub">{sub}</div>}
      </div>
    </div>
  );
};

window.StatTile = function StatTile({ label, value, currency, delta, deltaDir = 'up', sub }) {
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
          {sub && <span style={{color: 'var(--text-4)', marginLeft: 4}}>{sub}</span>}
        </div>
      )}
    </div>
  );
};

window.PageHeader = function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
};

// Toast manager via window.flashToast
(function initToast() {
  let listeners = [];
  let timeoutId = null;
  window.__flashSubscribe = (fn) => { listeners.push(fn); return () => { listeners = listeners.filter(l => l !== fn); }; };
  window.flashToast = (msg) => {
    listeners.forEach(fn => fn(msg));
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => listeners.forEach(fn => fn(null)), 2400);
  };
})();

window.ToastHost = function ToastHost() {
  const [msg, setMsg] = useState(null);
  useEffect(() => window.__flashSubscribe(setMsg), []);
  return <Toast message={msg} />;
};
