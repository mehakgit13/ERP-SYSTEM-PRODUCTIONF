import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const NAV = [
  { section: 'OVERVIEW',   items: [{ to: '/dashboard', icon: '⊞', label: 'Dashboard' }] },
  { section: 'INVENTORY',  items: [
    { to: '/products',  icon: '📦', label: 'Products' },
    { to: '/grn',       icon: '📥', label: 'GRN' },
  ]},
  { section: 'CRM',        items: [
    { to: '/customers', icon: '👥', label: 'Customers' },
    { to: '/suppliers', icon: '🏭', label: 'Suppliers' },
  ]},
  { section: 'OPERATIONS', items: [
    { to: '/sales-orders',    icon: '🛒', label: 'Sales Orders' },
    { to: '/purchase-orders', icon: '📋', label: 'Purchase Orders' },
  ]},
  { section: 'FINANCE',    items: [
    { to: '/invoices', icon: '🧾', label: 'Invoices' },
  ]},
  { section: 'ADMIN',      items: [
    { to: '/users', icon: '🔐', label: 'User Management', roles: ['admin'] },
  ]},
];

const Sidebar = () => {
  const { user, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { signOut(); navigate('/login'); };

  return (
    <aside style={{
      width: 240, background: '#111827', borderRight: '1px solid #1E2A40',
      display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px', borderBottom: '1px solid #1E2A40', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
        }}>⊞</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px' }}>NexusERP</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>Enterprise Suite</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {NAV.map(group => (
          <div key={group.section}>
            <div style={{
              padding: '10px 16px 4px', fontSize: 10, fontWeight: 600,
              letterSpacing: '0.1em', color: '#475569', textTransform: 'uppercase',
            }}>{group.section}</div>
            {group.items.map(item => {
              if (item.roles && !hasRole(...item.roles)) return null;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 16px', margin: '1px 8px', borderRadius: 8,
                    textDecoration: 'none', fontSize: 14, transition: 'all 0.15s',
                    background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: isActive ? '#3B82F6' : '#94A3B8',
                    fontWeight: isActive ? 600 : 400,
                    border: isActive ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                  })}
                >
                  <span style={{ width: 18, textAlign: 'center', fontSize: 15 }}>{item.icon}</span>
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User block */}
      <div style={{ padding: 16, borderTop: '1px solid #1E2A40', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, flexShrink: 0,
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: '#475569', textTransform: 'capitalize' }}>{user?.role}</div>
        </div>
        <button onClick={handleLogout} title="Logout" style={{
          background: 'none', border: 'none', color: '#475569',
          cursor: 'pointer', fontSize: 16, padding: 4, borderRadius: 6,
          transition: 'color 0.15s',
        }}>⏻</button>
      </div>
    </aside>
  );
};

export default Sidebar;
