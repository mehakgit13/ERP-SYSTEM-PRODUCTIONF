import { useEffect, useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { suppliersAPI } from '../../api/services';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import useAuth from '../../hooks/useAuth';

const EMPTY = { name:'', email:'', phone:'', contactPerson:'', paymentTerms:'Net 30', taxId:'', address:{ street:'', city:'', state:'', country:'', zip:'' } };

const SupplierForm = ({ initial, onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: initial || EMPTY,
    enableReinitialize: true,
    validationSchema: Yup.object({ name: Yup.string().required('Supplier name is required') }),
    onSubmit,
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-row">
        <div className="form-group"><label>Company Name *</label>
          <input name="name" value={formik.values.name} onChange={formik.handleChange} placeholder="Supplier Co." />
          {formik.touched.name && formik.errors.name && <div className="form-error">{formik.errors.name}</div>}
        </div>
        <div className="form-group"><label>Contact Person</label>
          <input name="contactPerson" value={formik.values.contactPerson} onChange={formik.handleChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Email</label>
          <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} />
        </div>
        <div className="form-group"><label>Phone</label>
          <input name="phone" value={formik.values.phone} onChange={formik.handleChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>City</label>
          <input name="address.city" value={formik.values.address?.city} onChange={formik.handleChange} />
        </div>
        <div className="form-group"><label>Country</label>
          <input name="address.country" value={formik.values.address?.country} onChange={formik.handleChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Payment Terms</label>
          <select name="paymentTerms" value={formik.values.paymentTerms} onChange={formik.handleChange}>
            {['Net 15','Net 30','Net 45','Net 60','COD','Prepaid'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Tax ID</label>
          <input name="taxId" value={formik.values.taxId} onChange={formik.handleChange} />
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : (initial?._id ? 'Update Supplier' : 'Add Supplier')}
        </button>
      </div>
    </form>
  );
};

const Suppliers = () => {
  const { hasRole } = useAuth();
  const canEdit = hasRole('admin','purchase');
  const [suppliers, setSuppliers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [modal, setModal]     = useState({ open: false, supplier: null });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await suppliersAPI.getAll({ page, search, limit:10 });
      setSuppliers(data.data); setPagination(data.pagination);
    } catch { toast.error('Failed to load suppliers'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (modal.supplier?._id) { await suppliersAPI.update(modal.supplier._id, values); toast.success('Updated'); }
      else { await suppliersAPI.create(values); toast.success('Supplier added'); }
      setModal({ open:false, supplier:null }); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await suppliersAPI.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Suppliers <span style={{ fontSize:14, color:'#475569', fontWeight:400 }}>({pagination?.total || 0})</span></h2>
        {canEdit && <button className="btn btn-primary" onClick={() => setModal({ open:true, supplier:null })}>+ Add Supplier</button>}
      </div>
      <div style={{ marginBottom:16 }}>
        <input placeholder="🔍  Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:340 }} />
      </div>
      <div className="card">
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><span className="spinner" /></div> : (
          <>
            <div className="table-container">
              <table>
                <thead><tr>{['Company','Contact','Email','City','Country','Payment Terms','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s._id}>
                      <td style={{ color:'#F1F5F9', fontWeight:600 }}>{s.name}</td>
                      <td>{s.contactPerson}</td>
                      <td style={{ color:'#3B82F6' }}>{s.email}</td>
                      <td>{s.address?.city}</td>
                      <td>{s.address?.country}</td>
                      <td><span style={{ background:'rgba(139,92,246,0.15)', color:'#8B5CF6', border:'1px solid rgba(139,92,246,0.3)', borderRadius:20, padding:'3px 9px', fontSize:11, fontWeight:600 }}>{s.paymentTerms}</span></td>
                      <td>
                        {canEdit && <div style={{ display:'flex', gap:8 }}>
                          <button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize:12 }} onClick={() => setModal({ open:true, supplier:s })}>Edit</button>
                          <button className="btn btn-danger" style={{ padding:'4px 10px', fontSize:12 }} onClick={() => handleDelete(s._id, s.name)}>Del</button>
                        </div>}
                      </td>
                    </tr>
                  ))}
                  {suppliers.length===0 && <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color:'#475569' }}>No suppliers found</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
      <Modal isOpen={modal.open} onClose={() => setModal({ open:false, supplier:null })} title={modal.supplier ? 'Edit Supplier' : 'Add Supplier'} width={580}>
        <SupplierForm initial={modal.supplier} onSubmit={handleSubmit} loading={saving} />
      </Modal>
    </div>
  );
};

export default Suppliers;
