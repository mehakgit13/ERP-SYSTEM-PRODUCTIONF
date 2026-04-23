import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const PAGE_TITLES = {
  '/dashboard':       'Dashboard',
  '/products':        'Product Management',
  '/customers':       'Customers',
  '/suppliers':       'Suppliers',
  '/sales-orders':    'Sales Orders',
  '/purchase-orders': 'Purchase Orders',
  '/grn':             'Goods Receipt Notes',
  '/invoices':        'Invoices',
  '/users':           'User Management',
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'ERP System';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: 60, background: '#111827', borderBottom: '1px solid #1E2A40',
          display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0,
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>{title}</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 12, color: '#475569' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style={{ width: 1, height: 24, background: '#1E2A40' }} />
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <span style={{
                position: 'absolute', top: -3, right: -3,
                width: 8, height: 8, borderRadius: '50%', background: '#EF4444',
              }} />
            </div>
          </div>
        </header>
        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }} className="fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
