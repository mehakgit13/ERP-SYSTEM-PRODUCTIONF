import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { invoicesAPI } from '../../api/services';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import { exportInvoicePDF } from '../../utils/pdfExport';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading]   = useState(true);
  const [viewModal, setViewModal] = useState({ open: false, invoice: null });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await invoicesAPI.getAll(params);
      setInvoices(data.data); setPagination(data.pagination);
    } catch { toast.error('Failed to load invoices'); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleMarkPaid = async (id) => {
    try { await invoicesAPI.markPaid(id); toast.success('Marked as paid'); load(); }
    catch { toast.error('Failed to update'); }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Invoices</h2>
        <button className="btn btn-primary">+ Generate Invoice</button>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {['','unpaid','paid','overdue'].map(s => (
          <button key={s} className={`btn ${statusFilter===s ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding:'6px 14px', fontSize:12 }}
            onClick={() => { setStatusFilter(s); setPage(1); }}>
            {s ? s.charAt(0).toUpperCase()+s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><span className="spinner" /></div> : (
          <>
            <div className="table-container">
              <table>
                <thead><tr>{['Invoice #','Customer','Order','Amount','Issued','Due','Status','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv._id}>
                      <td className="mono" style={{ color:'#8B5CF6', fontWeight:600 }}>{inv.invoiceNumber}</td>
                      <td style={{ color:'#F1F5F9' }}>{inv.customer?.name || '—'}</td>
                      <td className="mono" style={{ color:'#3B82F6' }}>{inv.salesOrder?.orderNumber || '—'}</td>
                      <td style={{ fontWeight:700, color:'#F1F5F9' }}>${inv.grandTotal?.toLocaleString()}</td>
                      <td style={{ fontSize:12, color:'#475569' }}>{new Date(inv.issueDate).toLocaleDateString()}</td>
                      <td style={{ fontSize:12, color: inv.status==='overdue' ? '#EF4444' : '#475569' }}>{new Date(inv.dueDate).toLocaleDateString()}</td>
                      <td><StatusBadge status={inv.status} /></td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          <button className="btn btn-ghost" style={{ padding:'4px 8px', fontSize:12 }}
                            onClick={() => setViewModal({ open:true, invoice:inv })}>View</button>
                          <button className="btn btn-purple" style={{ padding:'4px 8px', fontSize:12 }}
                            onClick={() => exportInvoicePDF(inv)}>PDF</button>
                          {inv.status==='unpaid' && (
                            <button className="btn btn-primary" style={{ padding:'4px 8px', fontSize:12 }}
                              onClick={() => handleMarkPaid(inv._id)}>Mark Paid</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {invoices.length===0 && <tr><td colSpan={8} style={{ textAlign:'center', padding:40, color:'#475569' }}>No invoices found</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={viewModal.open} onClose={() => setViewModal({ open:false, invoice:null })} title={`Invoice ${viewModal.invoice?.invoiceNumber}`} width={520}>
        {viewModal.invoice && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              {[
                ['Customer', viewModal.invoice.customer?.name],
                ['Status', viewModal.invoice.status],
                ['Subtotal', `$${viewModal.invoice.subtotal?.toLocaleString()}`],
                ['Tax', `$${viewModal.invoice.tax || 0}`],
                ['Discount', `-$${viewModal.invoice.discount || 0}`],
                ['Total Due', `$${viewModal.invoice.grandTotal?.toLocaleString()}`],
              ].map(([k,v]) => (
                <div key={k} style={{ background:'#111827', borderRadius:8, padding:'10px 14px', border:'1px solid #1E2A40' }}>
                  <div style={{ fontSize:11, color:'#475569', textTransform:'uppercase', marginBottom:4 }}>{k}</div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{v}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-purple" style={{ width:'100%', justifyContent:'center' }}
              onClick={() => exportInvoicePDF(viewModal.invoice)}>
              📄 Download PDF
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Invoices;
