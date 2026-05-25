// Sidebar + Topbar
window.Sidebar = function Sidebar({ route, onNav, collapsed }) {
  const items = [
    { id: 'dashboard',  label: 'Dashboard',  icon: Icons.Dashboard },
    { id: 'invoices',   label: 'Invoices',   icon: Icons.Invoice },
    { id: 'recurring',  label: 'Recurring',  icon: Icons.Repeat },
    { id: 'quotations', label: 'Quotations', icon: Icons.Quote },
    { id: 'customers',  label: 'Customers',  icon: Icons.Users },
    { id: 'payments',   label: 'Payments',   icon: Icons.Card },
    { id: 'reports',    label: 'Reports',    icon: Icons.Chart },
  ];
  const second = [
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Icons.Logo size={20} /></div>
        <div className="brand-name">Billing</div>
      </div>

      <div className="nav-section-title">Workspace</div>
      <div className="nav-items">
        {items.map(it => {
          const Icon = it.icon;
          const active = route.startsWith(it.id);
          return (
            <button key={it.id} className={`nav-item ${active ? 'active' : ''}`} onClick={() => onNav(it.id)}>
              <span className="nav-icon"><Icon size={18} /></span>
              <span className="nav-label">{it.label}</span>
            </button>
          );
        })}
      </div>

      <div className="nav-section-title">Account</div>
      <div className="nav-items">
        {second.map(it => {
          const Icon = it.icon;
          const active = route.startsWith(it.id);
          return (
            <button key={it.id} className={`nav-item ${active ? 'active' : ''}`} onClick={() => onNav(it.id)}>
              <span className="nav-icon"><Icon size={18} /></span>
              <span className="nav-label">{it.label}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="avatar">EQ</div>
        <div className="sidebar-footer-text" style={{minWidth: 0}}>
          <div style={{fontSize: 13, fontWeight: 500, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Eloquent Studio</div>
          <div style={{fontSize: 11, color: 'var(--text-4)', whiteSpace: 'nowrap'}}>Pro plan · AED</div>
        </div>
      </div>
    </aside>
  );
};

window.Topbar = function Topbar({ title, crumb, actions }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        {crumb && <span className="crumb">{crumb}</span>}
        {crumb && <Icons.ChevronRight size={14} style={{color: 'var(--text-4)'}} />}
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <div className="search">
          <Icons.Search size={14} />
          <input placeholder="Search invoices, customers…" />
          <kbd>⌘K</kbd>
        </div>
        <Btn variant="ghost" icon={<Icons.Bell size={18} />} />
        {actions}
      </div>
    </header>
  );
};
