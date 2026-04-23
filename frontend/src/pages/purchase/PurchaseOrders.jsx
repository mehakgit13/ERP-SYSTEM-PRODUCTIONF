// PurchaseOrders.jsx
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { purchaseOrdersAPI } from '../../api/services';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';

export const PurchaseOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await purchaseOrdersAPI.getAll({ page, limit:10 });
      setOrders(data.data); setPagination(data.pagination);
    } catch { toast.error('Failed to load purchase orders'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Purchase Orders</h2>
        <button className="btn btn-primary">+ New PO</button>
      </div>
      <div className="card">
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><span className="spinner" /></div> : (
          <>
            <div className="table-container">
              <table>
                <thead><tr>{['PO #','Supplier','Items','Amount','Status','Expected','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td className="mono" style={{ color:'#8B5CF6', fontWeight:600 }}>{o.orderNumber}</td>
                      <td style={{ color:'#F1F5F9' }}>{o.supplier?.name || '—'}</td>
                      <td>{o.items?.length || 0} items</td>
                      <td style={{ fontWeight:700, color:'#F1F5F9' }}>${o.totalAmount?.toLocaleString()}</td>
                      <td><StatusBadge status={o.status} /></td>
                      <td style={{ color:'#475569', fontSize:12 }}>{o.expectedDate ? new Date(o.expectedDate).toLocaleDateString() : '—'}</td>
                      <td><button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize:12 }}>View</button></td>
                    </tr>
                  ))}
                  {orders.length===0 && <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color:'#475569' }}>No purchase orders</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};
