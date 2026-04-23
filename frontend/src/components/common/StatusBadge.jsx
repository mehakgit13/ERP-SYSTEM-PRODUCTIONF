const STATUS_COLORS = {
  // Sales Orders
  draft:              '#94A3B8',
  confirmed:          '#3B82F6',
  shipped:            '#8B5CF6',
  delivered:          '#10B981',
  cancelled:          '#EF4444',
  // Purchase Orders
  sent:               '#F59E0B',
  partially_received: '#F59E0B',
  received:           '#10B981',
  // Invoices
  unpaid:             '#F59E0B',
  paid:               '#10B981',
  overdue:            '#EF4444',
  // GRN
  pending:            '#F59E0B',
  completed:          '#10B981',
  partial:            '#8B5CF6',
  // Stock
  in_stock:           '#10B981',
  low_stock:          '#F59E0B',
  out_of_stock:       '#EF4444',
  // Users
  admin:              '#8B5CF6',
  sales:              '#3B82F6',
  purchase:           '#F59E0B',
  inventory:          '#10B981',
  finance:            '#EC4899',
};

const StatusBadge = ({ status }) => {
  const color = STATUS_COLORS[status] || '#94A3B8';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: color + '22',
      color: color,
      border: `1px solid ${color}33`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
    </span>
  );
};

export default StatusBadge;
