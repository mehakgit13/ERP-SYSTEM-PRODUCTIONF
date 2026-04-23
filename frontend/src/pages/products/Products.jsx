import { useEffect, useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { productsAPI } from '../../api/services';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import useAuth from '../../hooks/useAuth';

const EMPTY = { title: '', sku: '', category: '', price: '', costPrice: '', stock: '', reorderLevel: 10, unit: 'pcs', description: '' };

const ProductForm = ({ initial, onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: initial || EMPTY,
    enableReinitialize: true,
    validationSchema: Yup.object({
      title:    Yup.string().required('Required'),
      sku:      Yup.string().required('Required'),
      category: Yup.string().required('Required'),
      price:    Yup.number().min(0).required('Required'),
      stock:    Yup.number().min(0).required('Required'),
    }),
    onSubmit,
  });
  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label>{label}</label>
      <input name={name} type={type} placeholder={placeholder}
        value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} />
      {formik.touched[name] && formik.errors[name] && <div className="form-error">{formik.errors[name]}</div>}
    </div>
  );
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-row">{field('title','Product Title','text','e.g. Industrial Pump A1')}{field('sku','SKU','text','e.g. PMP-A1')}</div>
      <div className="form-row">{field('category','Category','text','e.g. Pumps')}{field('unit','Unit','text','e.g. pcs, kg')}</div>
      <div className="form-row">{field('price','Selling Price ($)','number','0.00')}{field('costPrice','Cost Price ($)','number','0.00')}</div>
      <div className="form-row">{field('stock','Current Stock','number','0')}{field('reorderLevel','Reorder Level','number','10')}</div>
      <div className="form-group">
        <label>Description</label>
        <textarea name="description" rows={3} value={formik.values.description} onChange={formik.handleChange}
          placeholder="Optional product description" style={{ resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : (initial?._id ? 'Update Product' : 'Add Product')}
        </button>
      </div>
    </form>
  );
};

const Products = () => {
  const { hasRole } = useAuth();
  const canEdit = hasRole('admin', 'inventory');
  const [products, setProducts]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [modal, setModal]         = useState({ open: false, product: null });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productsAPI.getAll({ page, search, limit: 10 });
      setProducts(data.data);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (modal.product?._id) {
        await productsAPI.update(modal.product._id, values);
        toast.success('Product updated');
      } else {
        await productsAPI.create(values);
        toast.success('Product created');
      }
      setModal({ open: false, product: null });
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try { await productsAPI.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Products <span style={{ fontSize: 14, color: '#475569', fontWeight: 400 }}>({pagination?.total || 0} total)</span></h2>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setModal({ open: true, product: null })}>
            + Add Product
          </button>
        )}
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input placeholder="🔍  Search by name or SKU..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ maxWidth: 340 }} />
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" /></div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead><tr>
                  {['SKU','Product','Category','Price','Cost','Stock','Reorder','Status','Actions'].map(h => <th key={h}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td className="mono" style={{ color: '#3B82F6' }}>{p.sku}</td>
                      <td style={{ color: '#F1F5F9', fontWeight: 500 }}>{p.title}</td>
                      <td>{p.category}</td>
                      <td style={{ fontWeight: 600, color: '#F1F5F9' }}>${p.price}</td>
                      <td style={{ color: '#475569' }}>${p.costPrice || 0}</td>
                      <td style={{ fontWeight: 700, color: p.stock === 0 ? '#EF4444' : p.stock <= p.reorderLevel ? '#F59E0B' : '#10B981' }}>
                        {p.stock} {p.unit}
                      </td>
                      <td style={{ color: '#475569' }}>{p.reorderLevel}</td>
                      <td><StatusBadge status={p.stockStatus} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {canEdit && <>
                            <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12 }}
                              onClick={() => setModal({ open: true, product: p })}>Edit</button>
                            <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 12 }}
                              onClick={() => handleDelete(p._id, p.title)}>Del</button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#475569' }}>No products found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, product: null })}
        title={modal.product ? 'Edit Product' : 'Add New Product'} width={600}>
        <ProductForm initial={modal.product} onSubmit={handleSubmit} loading={saving} />
      </Modal>
    </div>
  );
};

export default Products;
