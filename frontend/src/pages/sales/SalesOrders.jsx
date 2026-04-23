import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { salesOrdersAPI, customersAPI, productsAPI } from '../../api/services';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';

const STATUSES = ['draft','confirmed','shipped','delivered','cancelled'];

const SalesOrders = () => {
  const [orders, setOrders]     = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading]   = useState(true);
  const [viewModal, setViewModal] = useState({ open: false, order: null });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await salesOrdersAPI.getAll(params);
      setOrders(data.data); setPagination(data.pagination);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id, status) => {
    try {
      await salesOrdersAPI.updateStatus(id, status);
      toast.success(`Order status updated to ${status}`);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Sales Orders</h2>
        <button className="btn btn-primary">+ New Order</button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['', ...STATUSES].map(s => (
          <button key={s} className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 14px', fontSize: 12 }}
            onClick={() => { setStatusFilter(s); setPage(1); }}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><span className="spinner" /></div> : (
          <>
            <div className="table-container">
              <table>
                <thead><tr>{['Order #','Customer','Items','Total','Status','Date','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td className="mono" style={{ color:'#3B82F6', fontWeight:600 }}>{o.orderNumber}</td>
                      <td style={{ color:'#F1F5F9' }}>{o.customer?.name || '—'}</td>
                      <td style={{ color:'#475569' }}>{o.items?.length || 0} items</td>
                      <td style={{ fontWeight:700, color:'#F1F5F9' }}>${o.grandTotal?.toLocaleString()}</td>
                      <td><StatusBadge status={o.status} /></td>
                      <td style={{ color:'#475569', fontSize:12 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          <button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize:12 }}
                            onClick={() => setViewModal({ open:true, order:o })}>View</button>
                          {o.status === 'draft' && (
                            <button className="btn btn-primary" style={{ padding:'4px 10px', fontSize:12 }}
                              onClick={() => handleStatusChange(o._id, 'confirmed')}>Confirm</button>
                          )}
                          {o.status === 'confirmed' && (
                            <button className="btn" style={{ padding:'4px 10px', fontSize:12, background:'rgba(139,92,246,0.15)', color:'#8B5CF6', border:'1px solid rgba(139,92,246,0.3)' }}
                              onClick={() => handleStatusChange(o._id, 'shipped')}>Ship</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length===0 && <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color:'#475569' }}>No orders found</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* View Order Modal */}
      <Modal isOpen={viewModal.open} onClose={() => setViewModal({ open:false, order:null })} title={`Order ${viewModal.order?.orderNumber}`} width={560}>
        {viewModal.order && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              {[
                ['Customer', viewModal.order.customer?.name],
                ['Status', viewModal.order.status],
                ['Grand Total', `$${viewModal.order.grandTotal?.toLocaleString()}`],
                ['Created', new Date(viewModal.order.createdAt).toLocaleDateString()],
              ].map(([k,v]) => (
                <div key={k} style={{ background:'#111827', borderRadius:8, padding:'10px 14px', border:'1px solid #1E2A40' }}>
                  <div style={{ fontSize:11, color:'#475569', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>{k}</div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
            {viewModal.order.notes && <p style={{ color:'#94A3B8', fontSize:13 }}>{viewModal.order.notes}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SalesOrders;
