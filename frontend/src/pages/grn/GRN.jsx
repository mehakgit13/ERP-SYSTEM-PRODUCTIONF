import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { grnAPI } from '../../api/services';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';

const GRN = () => {
  const [grns, setGrns]         = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await grnAPI.getAll({ page, limit:10 });
      setGrns(data.data); setPagination(data.pagination);
    } catch { toast.error('Failed to load GRNs'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Goods Receipt Notes</h2>
        <button className="btn btn-primary">+ Create GRN</button>
      </div>

      {/* Info banner */}
      <div style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:20, display:'flex', gap:10, alignItems:'center' }}>
        <span style={{ fontSize:18 }}>ℹ️</span>
        <span style={{ fontSize:13, color:'#94A3B8' }}>GRNs are created against Purchase Orders. When a GRN is submitted, stock levels are automatically updated.</span>
      </div>

      <div className="card">
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><span className="spinner" /></div> : (
          <>
            <div className="table-container">
              <table>
                <thead><tr>{['GRN #','Purchase Order','Supplier','Received By','Date','Status','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {grns.map(g => (
                    <tr key={g._id}>
                      <td className="mono" style={{ color:'#10B981', fontWeight:600 }}>{g.grnNumber}</td>
                      <td className="mono" style={{ color:'#8B5CF6' }}>{g.purchaseOrder?.orderNumber || '—'}</td>
                      <td style={{ color:'#F1F5F9' }}>{g.supplier?.name || '—'}</td>
                      <td>{g.receivedBy?.name || '—'}</td>
                      <td style={{ fontSize:12, color:'#475569' }}>{new Date(g.receivedDate).toLocaleDateString()}</td>
                      <td><StatusBadge status={g.status} /></td>
                      <td><button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize:12 }}>View</button></td>
                    </tr>
                  ))}
                  {grns.length===0 && (
                    <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color:'#475569' }}>
                      No GRNs found. Create one against a Purchase Order.
                    </td></tr>
                  )}
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

export default GRN;
