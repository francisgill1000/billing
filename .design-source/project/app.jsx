// Main App — routing + state
const { useState: uS, useEffect: uE, useMemo: uM } = React;

function App() {
  const tweakDefaults = /*EDITMODE-BEGIN*/{
    "sidebarStyle": "labels",
    "accent": "#00ffcc",
    "invoiceLayout": "modern",
    "showQuickStats": true
  }/*EDITMODE-END*/;
  const [tweaks, setTweak] = window.useTweaks(tweakDefaults);

  // Apply accent live
  uE(() => {
    document.documentElement.style.setProperty('--mint-500', tweaks.accent);
    // Derive 400/300 by simple lightening — keep mint feel
    const presets = {
      '#00ffcc': { _300: '#00d4aa', _400: '#00e6b8', _600: '#00b894', _700: '#00876d', glow: 'rgba(0,255,204,0.22)' },
      '#60a5fa': { _300: '#93c5fd', _400: '#60a5fa', _600: '#3b82f6', _700: '#2563eb', glow: 'rgba(96,165,250,0.22)' },
      '#a78bfa': { _300: '#c4b5fd', _400: '#a78bfa', _600: '#8b5cf6', _700: '#7c3aed', glow: 'rgba(167,139,250,0.22)' },
      '#f4b860': { _300: '#fbd38d', _400: '#f4b860', _600: '#dd6b20', _700: '#c05621', glow: 'rgba(244,184,96,0.22)' },
    };
    const p = presets[tweaks.accent] || presets['#00ffcc'];
    document.documentElement.style.setProperty('--mint-300', p._300);
    document.documentElement.style.setProperty('--mint-400', p._400);
    document.documentElement.style.setProperty('--mint-600', p._600);
    document.documentElement.style.setProperty('--mint-700', p._700);
    document.documentElement.style.setProperty('--mint-glow', p.glow);
    document.documentElement.style.setProperty('--mint-soft', p.glow.replace('0.22', '0.08'));
    document.documentElement.style.setProperty('--border-mint', p.glow.replace('0.22', '0.24'));
  }, [tweaks.accent]);

  // State — invoices, quotations, customers
  const [invoices, setInvoices] = uS(window.AppData.invoices);
  const [quotations, setQuotations] = uS(window.AppData.quotations);
  const [payments, setPayments] = uS(window.AppData.payments);
  const [recurring, setRecurring] = uS(window.AppData.recurring);
  const [recordingFor, setRecordingFor] = uS(null);
  const [portalFor, setPortalFor] = uS(null);

  // Routing
  const [route, setRoute] = uS('dashboard');
  const [openInvoiceId, setOpenInvoiceId] = uS(null);
  const [openQuoteId, setOpenQuoteId] = uS(null);
  const [openCustomerId, setOpenCustomerId] = uS(null);
  const [editorMode, setEditorMode] = uS(null); // null, 'invoice', 'quote'
  const [editorInitial, setEditorInitial] = uS(null);

  const navigate = (r) => {
    if (r === 'invoices/new') { setEditorMode('invoice'); setEditorInitial(null); return; }
    if (r === 'quotations/new') { setEditorMode('quote'); setEditorInitial(null); return; }
    setRoute(r);
    setOpenInvoiceId(null);
    setOpenQuoteId(null);
    setOpenCustomerId(null);
    setEditorMode(null);
  };

  const openInvoice = (id) => { setOpenInvoiceId(id); setRoute('invoices'); };
  const openQuote = (id) => { setOpenQuoteId(id); setRoute('quotations'); };
  const openCustomer = (id) => { setOpenCustomerId(id); setRoute('customers'); };

  // Mutations
  const markPaid = (id) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'paid', paidDate: window.AppData.today } : i));
    window.flashToast(`${id} marked as paid`);
  };
  const recordPayment = (payload) => {
    const newPay = {
      id: `PAY-${1043 + payments.length}`,
      invoiceId: payload.invoiceId,
      customerId: payload.customerId,
      date: payload.date,
      amount: payload.amount,
      method: payload.method,
      ref: payload.ref,
    };
    setPayments([newPay, ...payments]);
    setInvoices(invoices.map(i => i.id === payload.invoiceId
      ? { ...i, status: payload.isFull ? 'paid' : 'partial', paidDate: payload.isFull ? payload.date : i.paidDate }
      : i));
    setRecordingFor(null);
    window.flashToast(payload.isFull ? `Payment recorded · ${payload.invoiceId} marked paid` : `Partial payment recorded against ${payload.invoiceId}`);
  };
  const sendInvoice = (id) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'sent' } : i));
    window.flashToast(`${id} sent to customer`);
  };
  const acceptQuote = (id) => {
    setQuotations(quotations.map(q => q.id === id ? { ...q, status: 'accepted' } : q));
    window.flashToast(`${id} marked as accepted`);
  };
  const declineQuote = (id) => {
    setQuotations(quotations.map(q => q.id === id ? { ...q, status: 'declined' } : q));
    window.flashToast(`${id} marked as declined`);
  };
  const saveDoc = (doc, mode) => {
    if (mode === 'invoice') {
      if (editorInitial) setInvoices(invoices.map(i => i.id === doc.id ? doc : i));
      else setInvoices([doc, ...invoices]);
      window.flashToast(`Invoice ${doc.id} ${doc.status === 'draft' ? 'saved as draft' : 'sent'}`);
      setEditorMode(null);
      setRoute('invoices');
      setOpenInvoiceId(doc.status === 'draft' ? null : doc.id);
    } else {
      if (editorInitial) setQuotations(quotations.map(q => q.id === doc.id ? doc : q));
      else setQuotations([doc, ...quotations]);
      window.flashToast(`Quotation ${doc.id} ${doc.status === 'draft' ? 'saved as draft' : 'sent'}`);
      setEditorMode(null);
      setRoute('quotations');
      setOpenQuoteId(doc.status === 'draft' ? null : doc.id);
    }
  };
  const convertQuoteToInvoice = (q) => {
    setEditorMode('invoice');
    setEditorInitial({
      customerId: q.customerId, items: q.items, taxRate: q.taxRate, notes: q.notes,
      issueDate: window.AppData.today, dueDate: '2026-06-22',
    });
    window.flashToast(`Converting ${q.id} to invoice`);
  };

  // Topbar title resolution
  const titles = {
    dashboard: 'Dashboard',
    invoices: 'Invoices',
    recurring: 'Recurring',
    quotations: 'Quotations',
    customers: 'Customers',
    payments: 'Payments',
    reports: 'Reports',
    settings: 'Settings',
  };

  let pageNode;
  if (editorMode) {
    pageNode = <PageInvoiceEditor mode={editorMode} initial={editorInitial} onCancel={() => setEditorMode(null)} onSave={(doc) => saveDoc(doc, editorMode)} />;
  } else if (route === 'dashboard') {
    pageNode = <PageDashboard onNav={navigate} onOpenInvoice={openInvoice} />;
  } else if (route === 'recurring') {
    pageNode = <PageRecurring schedules={recurring}
      onToggle={(id) => {
        setRecurring(recurring.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r));
        window.flashToast('Schedule updated');
      }}
      onIssueNow={(r) => {
        const cust = window.AppData.findCustomer(r.customerId);
        const newId = `INV-2026-${String(149 + Math.floor(Math.random()*9)).padStart(4,'0')}`;
        const doc = { id: newId, customerId: r.customerId, issueDate: window.AppData.today, dueDate: '2026-06-22', taxRate: r.taxRate, items: r.items, notes: `Generated from recurring schedule ${r.id}.`, status: 'sent' };
        setInvoices([doc, ...invoices]);
        window.flashToast(`${newId} issued to ${cust.name}`);
      }}
      onNew={() => window.flashToast('New schedule editor — coming soon')} />;
  } else if (route === 'invoices') {
    if (openInvoiceId) {
      const inv = invoices.find(i => i.id === openInvoiceId);
      pageNode = <PageInvoiceDetail invoice={inv} onBack={() => setOpenInvoiceId(null)}
        onMarkPaid={() => markPaid(inv.id)} onSend={() => sendInvoice(inv.id)}
        onRecord={() => setRecordingFor(inv.id)}
        onPreviewPortal={() => setPortalFor(inv.id)}
        onEdit={() => { setEditorMode('invoice'); setEditorInitial(inv); }} />;
    } else {
      pageNode = <PageInvoices invoices={invoices} onOpen={openInvoice} onNew={() => { setEditorMode('invoice'); setEditorInitial(null); }} />;
    }
  } else if (route === 'quotations') {
    if (openQuoteId) {
      const q = quotations.find(x => x.id === openQuoteId);
      pageNode = <PageQuotationDetail quote={q} onBack={() => setOpenQuoteId(null)}
        onAccept={() => acceptQuote(q.id)} onDecline={() => declineQuote(q.id)}
        onConvert={() => convertQuoteToInvoice(q)} />;
    } else {
      pageNode = <PageQuotations quotations={quotations} onOpen={openQuote}
        onNew={() => { setEditorMode('quote'); setEditorInitial(null); }}
        onConvertToInvoice={convertQuoteToInvoice} />;
    }
  } else if (route === 'customers') {
    if (openCustomerId) {
      const cust = window.AppData.customers.find(c => c.id === openCustomerId);
      pageNode = <PageCustomerDetail customer={cust} invoices={invoices} quotations={quotations} payments={payments}
        onBack={() => setOpenCustomerId(null)} onOpenInvoice={openInvoice} onOpenQuote={openQuote}
        onNewInvoice={(cid) => { setEditorMode('invoice'); setEditorInitial({ customerId: cid }); }} />;
    } else {
      pageNode = <PageCustomers customers={window.AppData.customers} invoices={invoices} onOpen={openCustomer} onNew={() => {}} />;
    }
  } else if (route === 'payments') {
    pageNode = <PagePayments payments={payments} />;
  } else if (route === 'reports') {
    pageNode = <PageReports />;
  } else if (route === 'settings') {
    pageNode = <PageSettings />;
  }

  const collapsed = tweaks.sidebarStyle === 'icons';

  // Topbar actions vary
  let topbarTitle = titles[route];
  let topbarCrumb = null;
  if (editorMode) {
    topbarTitle = editorInitial ? `Edit ${editorMode === 'quote' ? 'quotation' : 'invoice'}` : `New ${editorMode === 'quote' ? 'quotation' : 'invoice'}`;
    topbarCrumb = editorMode === 'quote' ? 'Quotations' : 'Invoices';
  } else if (openInvoiceId) {
    topbarTitle = openInvoiceId; topbarCrumb = 'Invoices';
  } else if (openQuoteId) {
    topbarTitle = openQuoteId; topbarCrumb = 'Quotations';
  } else if (openCustomerId) {
    const c = window.AppData.customers.find(x => x.id === openCustomerId);
    topbarTitle = c ? c.name : 'Customer'; topbarCrumb = 'Customers';
  }

  // Portal preview is full-screen
  if (portalFor) {
    const inv = invoices.find(i => i.id === portalFor);
    if (inv) return <><PageCustomerPortal invoice={inv} onClose={() => setPortalFor(null)} onPay={() => { setRecordingFor(inv.id); setPortalFor(null); }} /><ToastHost /></>;
  }

  return (
    <div className={`app ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar route={route} onNav={navigate} collapsed={collapsed} />
      <main className="main">
        <Topbar title={topbarTitle} crumb={topbarCrumb} />
        {pageNode}
      </main>
      <RecordPaymentDrawer open={!!recordingFor} invoice={invoices.find(i => i.id === recordingFor)} onClose={() => setRecordingFor(null)} onSave={recordPayment} />
      <ToastHost />
      <TweaksUI tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

function TweaksUI({ tweaks, setTweak }) {
  return (
    <window.TweaksPanel>
      <window.TweakSection title="Appearance">
        <window.TweakColor
          label="Accent color"
          options={['#00ffcc', '#60a5fa', '#a78bfa', '#f4b860']}
          value={tweaks.accent}
          onChange={(v) => setTweak('accent', v)}
        />
        <window.TweakRadio
          label="Sidebar"
          options={[
            { value: 'labels', label: 'With labels' },
            { value: 'icons',  label: 'Icons only' },
          ]}
          value={tweaks.sidebarStyle}
          onChange={(v) => setTweak('sidebarStyle', v)}
        />
      </window.TweakSection>
    </window.TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
