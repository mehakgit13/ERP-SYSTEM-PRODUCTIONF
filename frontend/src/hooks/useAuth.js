import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const useAuth = () => {
  const { user, token, loading, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const signOut = () => dispatch(logout());

  const hasRole = (...roles) => roles.includes(user?.role);
  const isAdmin = user?.role === 'admin';

  return { user, token, loading, error, signOut, hasRole, isAdmin, isAuthenticated: !!token };
};

export default useAuth;
