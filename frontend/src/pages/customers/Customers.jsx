import { useEffect, useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { customersAPI } from '../../api/services';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import useAuth from '../../hooks/useAuth';

const EMPTY = { name:'', email:'', phone:'', contactPerson:'', taxId:'', address:{ street:'', city:'', state:'', country:'', zip:'' } };

const CustomerForm = ({ initial, onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: initial || EMPTY,
    enableReinitialize: true,
    validationSchema: Yup.object({ name: Yup.string().required('Company name is required') }),
    onSubmit,
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-row">
        <div className="form-group"><label>Company Name *</label>
          <input name="name" value={formik.values.name} onChange={formik.handleChange} />
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
      <div className="form-group"><label>Tax ID</label>
        <input name="taxId" value={formik.values.taxId} onChange={formik.handleChange} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : (initial?._id ? 'Update' : 'Add Customer')}
        </button>
      </div>
    </form>
  );
};

const Customers = () => {
  const { hasRole } = useAuth();
  const canEdit = hasRole('admin', 'sales');
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ open: false, customer: null });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await customersAPI.getAll({ page, search, limit: 10 });
      setCustomers(data.data);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (modal.customer?._id) { await customersAPI.update(modal.customer._id, values); toast.success('Updated'); }
      else { await customersAPI.create(values); toast.success('Customer added'); }
      setModal({ open: false, customer: null }); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await customersAPI.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Customers <span style={{ fontSize: 14, color: '#475569', fontWeight: 400 }}>({pagination?.total || 0})</span></h2>
        {canEdit && <button className="btn btn-primary" onClick={() => setModal({ open: true, customer: null })}>+ Add Customer</button>}
      </div>
      <div style={{ marginBottom: 16 }}>
        <input placeholder="🔍  Search customers..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 340 }} />
      </div>
      <div className="card">
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><span className="spinner" /></div> : (
          <>
            <div className="table-container">
              <table>
                <thead><tr>{['Company','Contact','Email','City','Country','Tax ID','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c._id}>
                      <td style={{ color:'#F1F5F9', fontWeight:600 }}>{c.name}</td>
                      <td>{c.contactPerson}</td>
                      <td style={{ color:'#3B82F6' }}>{c.email}</td>
                      <td>{c.address?.city}</td>
                      <td>{c.address?.country}</td>
                      <td className="mono" style={{ color:'#475569' }}>{c.taxId || '—'}</td>
                      <td>
                        {canEdit && <div style={{ display:'flex', gap:8 }}>
                          <button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize:12 }} onClick={() => setModal({ open:true, customer:c })}>Edit</button>
                          <button className="btn btn-danger" style={{ padding:'4px 10px', fontSize:12 }} onClick={() => handleDelete(c._id, c.name)}>Del</button>
                        </div>}
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color:'#475569' }}>No customers found</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
      <Modal isOpen={modal.open} onClose={() => setModal({ open:false, customer:null })} title={modal.customer ? 'Edit Customer' : 'Add Customer'} width={580}>
        <CustomerForm initial={modal.customer} onSubmit={handleSubmit} loading={saving} />
      </Modal>
    </div>
  );
};

export default Customers;
