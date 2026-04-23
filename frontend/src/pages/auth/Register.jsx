import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser, clearError } from '../../store/slices/authSlice';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useAuth();

  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '', role: 'sales' },
    validationSchema: Yup.object({
      name:            Yup.string().required('Name is required'),
      email:           Yup.string().email('Invalid email').required('Required'),
      password:        Yup.string().min(6, 'Min 6 characters').required('Required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
      role:            Yup.string().required('Select a role'),
    }),
    onSubmit: ({ confirmPassword, ...values }) => dispatch(registerUser(values)),
  });

  return (
    <div style={{
      minHeight: '100vh', background: '#0B0F1A',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div className="fade-in" style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 12px',
          }}>⊞</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>Create Account</h1>
          <p style={{ color: '#475569', fontSize: 13, marginTop: 5 }}>Join NexusERP today</p>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1E2A40', borderRadius: 16, padding: 28 }}>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" placeholder="John Smith" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.name && formik.errors.name && <div className="form-error">{formik.errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="you@company.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.email && formik.errors.email && <div className="form-error">{formik.errors.email}</div>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="••••••••" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.password && formik.errors.password && <div className="form-error">{formik.errors.password}</div>}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="••••••••" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className="form-error">{formik.errors.confirmPassword}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formik.values.role} onChange={formik.handleChange}>
                <option value="sales">Sales</option>
                <option value="purchase">Purchase</option>
                <option value="inventory">Inventory</option>
                <option value="finance">Finance</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '11px 0', marginTop: 4, fontSize: 14 }}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#475569' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
