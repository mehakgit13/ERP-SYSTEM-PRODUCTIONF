import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import store from './store';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/products/Products';
import Customers from './pages/customers/Customers';
import Suppliers from './pages/suppliers/Suppliers';
import SalesOrders from './pages/sales/SalesOrders';
import { PurchaseOrders } from './pages/purchase/PurchaseOrders';
import GRN from './pages/grn/GRN';
import Invoices from './pages/invoices/Invoices';
import UserManagement from './pages/users/UserManagement';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected — all roles */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard"       element={<Dashboard />} />
              <Route path="/products"        element={<Products />} />
              <Route path="/customers"       element={<Customers />} />
              <Route path="/suppliers"       element={<Suppliers />} />
              <Route path="/sales-orders"    element={<SalesOrders />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/grn"             element={<GRN />} />
              <Route path="/invoices"        element={<Invoices />} />
            </Route>
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<MainLayout />}>
              <Route path="/users" element={<UserManagement />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
