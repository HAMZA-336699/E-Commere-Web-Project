import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import PublicLayout from '../layouts/PublicLayout';
import AdminsPage from '../pages/admin/AdminsPage';
import CustomersPage from '../pages/admin/CustomersPage';
import DashboardPage from '../pages/admin/DashboardPage';
import LoginPage from '../pages/admin/LoginPage';
import OrderItemsPage from '../pages/admin/OrderItemsPage';
import OrdersPage from '../pages/admin/OrdersPage';
import AdminProductsPage from '../pages/admin/ProductsPage';
import ResetPasswordPage from '../pages/admin/ResetPasswordPage';
import CheckoutPage from '../pages/public/CheckoutPage';
import ContactPage from '../pages/public/ContactPage';
import HomePage from '../pages/public/HomePage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import ProductsPage from '../pages/public/ProductsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="order-items" element={<OrderItemsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="admins" element={<AdminsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
