import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { usersAPI } from '../../api/services';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import useAuth from '../../hooks/useAuth';

const ROLES = ['admin','sales','purchase','inventory','finance'];

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers]     = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ open:false, user:null });
  const [saving, setSaving]   = useState(false);
  const [editRole, setEditRole] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await usersAPI.getAll({ page, search, limit:10 });
      setUsers(data.data); setPagination(data.pagination);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const openEdit = (u) => { setEditRole(u.role); setEditModal({ open:true, user:u }); };

  const handleRoleUpdate = async () => {
    setSaving(true);
    try {
      await usersAPI.update(editModal.user._id, { role: editRole });
      toast.success('Role updated');
      setEditModal({ open:false, user:null });
      load();
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handleToggleActive = async (u) => {
    try {
      await usersAPI.update(u._id, { isActive: !u.isActive });
      toast.success(`User ${u.isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try { await usersAPI.delete(id); toast.success('User deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>User Management <span style={{ fontSize:14, color:'#475569', fontWeight:400 }}>({pagination?.total || 0} users)</span></h2>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <input placeholder="🔍  Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:300 }} />
      </div>

      <div className="card">
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><span className="spinner" /></div> : (
          <>
            <div className="table-container">
              <table>
                <thead><tr>{['Name','Email','Role','Status','Joined','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{
                            width:30, height:30, borderRadius:'50%',
                            background:'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:12, fontWeight:700, flexShrink:0,
                          }}>{u.name?.charAt(0).toUpperCase()}</div>
                          <span style={{ color:'#F1F5F9', fontWeight:500 }}>{u.name}</span>
                          {u._id === currentUser?.id && <span style={{ fontSize:10, color:'#475569', background:'#1E2A40', padding:'2px 6px', borderRadius:4 }}>You</span>}
                        </div>
                      </td>
                      <td style={{ color:'#3B82F6' }}>{u.email}</td>
                      <td><StatusBadge status={u.role} /></td>
                      <td>
                        <span style={{
                          display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:20,
                          fontSize:11, fontWeight:600,
                          background: u.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color: u.isActive ? '#10B981' : '#EF4444',
                          border: `1px solid ${u.isActive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        }}>
                          <span style={{ width:5, height:5, borderRadius:'50%', background: u.isActive ? '#10B981' : '#EF4444' }} />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ fontSize:12, color:'#475569' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u._id !== currentUser?.id && (
                          <div style={{ display:'flex', gap:6 }}>
                            <button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize:12 }} onClick={() => openEdit(u)}>Edit Role</button>
                            <button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize:12, color: u.isActive ? '#F59E0B' : '#10B981' }}
                              onClick={() => handleToggleActive(u)}>
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="btn btn-danger" style={{ padding:'4px 10px', fontSize:12 }} onClick={() => handleDelete(u._id, u.name)}>Del</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length===0 && <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:'#475569' }}>No users found</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={editModal.open} onClose={() => setEditModal({ open:false, user:null })} title={`Edit Role — ${editModal.user?.name}`} width={400}>
        <div>
          <div className="form-group">
            <label>Assign Role</label>
            <select value={editRole} onChange={e => setEditRole(e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
            <button className="btn btn-ghost" onClick={() => setEditModal({ open:false, user:null })}>Cancel</button>
            <button className="btn btn-primary" onClick={handleRoleUpdate} disabled={saving}>
              {saving ? <span className="spinner" /> : 'Save Role'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
