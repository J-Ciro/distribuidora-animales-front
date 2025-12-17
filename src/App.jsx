import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MainLayout } from './components/layout/main-layout';
import { AdminLayout } from './components/layout/admin-layout';
import { ProtectedRoute } from './components/layout/protected-route';
import { HomePage } from './pages/home';
import RecoverPasswordPage from './pages/recover-password';
import VerificationCodePage from './pages/verification-code';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { CartPage } from './pages/cart';
import MyOrders from './pages/mis-pedidos/MyOrders';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { PaymentSuccessPage } from './pages/checkout/PaymentSuccessPage';
import { PaymentFailedPage } from './pages/checkout/PaymentFailedPage';
import { AdminPedidosPage } from './pages/Admin/pedidos';
import { AdminUsuariosPage } from './pages/Admin/usuarios';
import { AdminUsuarioDetailPage } from './pages/Admin/usuarios/detail';
import { AdminProductosPage } from './pages/Admin/productos';
import NuevoProductoPage from './pages/Admin/productos/nuevo';
import EditarProductoPage from './pages/Admin/productos/editar';
import { AdminCategoriasPage } from './pages/Admin/categorias';
import AdminCarruselPage from './pages/Admin/carrusel';
import { AdminInventarioPage } from './pages/Admin/inventario';
import { AdminCalificacionesPage } from './pages/Admin/calificaciones';
import { NotFoundPage } from './pages/not-found';
import VerifyEmailPage from './pages/verify-email';
import { authService } from './services/auth-service';
import { loginSuccess } from './redux/actions/auth-actions';
import { cartUtils } from './utils/cart';
import Chatbot from './components/chatbot/Chatbot';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      // Only check auth if there's a token in localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        // Clear any stale user data
        localStorage.removeItem('user');
        return; // No token, skip auth check
      }

      try {
        // Try to get user from localStorage first for faster load
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          try {
            const user = JSON.parse(cachedUser);
            dispatch(loginSuccess(user));
          } catch (e) {
            // Invalid cached user, will fetch from server
          }
        }

        // Fetch current user from server to validate session
        const user = await authService.getCurrentUser();
        if (user) {
          // Save user to localStorage for persistence
          localStorage.setItem('user', JSON.stringify(user));
          dispatch(loginSuccess(user));
          // No auto-redirect for admins - let them navigate freely
        }
      } catch (error) {
        // Token expired or invalid, clear it
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        console.log('Session expired or invalid');
      }
    };

    checkAuth();
  }, [dispatch, navigate]);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = cartUtils.getCart();
    if (savedCart.length > 0) {
      dispatch({ type: 'CART_LOAD', payload: savedCart });
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminProductosPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos/editar/:id"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <EditarProductoPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos/nuevo"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <NuevoProductoPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recuperar-contrasena"
        element={
          <MainLayout>
            <RecoverPasswordPage />
          </MainLayout>
        }
      />
      {/* Public routes */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/home"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/login"
        element={
          <MainLayout>
            {isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
          </MainLayout>
        }
      />
      <Route
        path="/registro"
        element={
          <MainLayout>
            {isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
          </MainLayout>
        }
      />
      <Route
        path="/verification-code"
        element={
          <MainLayout>
            <VerificationCodePage />
          </MainLayout>
        }
      />
      <Route
        path="/verify-email"
        element={<VerifyEmailPage />}
      />
      <Route
        path="/carrito"
        element={
          <MainLayout>
            <CartPage />
          </MainLayout>
        }
      />
      <Route
        path="/mis-pedidos"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyOrders />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Checkout and Payment routes */}
      <Route
        path="/checkout/:pedidoId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CheckoutPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-success/:pedidoId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PaymentSuccessPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-failed/:pedidoId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PaymentFailedPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/pedidos"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminPedidosPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminUsuariosPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios/:id"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminUsuarioDetailPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminProductosPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminCategoriasPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/carrusel"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminCarruselPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/estadisticas"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminInventarioPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/calificaciones"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminCalificacionesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* Redirect old inventario route to estadisticas */}
      <Route
        path="/admin/inventario"
        element={<Navigate to="/admin/estadisticas" replace />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
    
    {/* Chatbot disponible en todas las páginas */}
    <Chatbot />
  </>
  );
}

export default App;
