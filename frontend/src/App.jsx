import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';

// Pages
import HomePage from './pages/HomePage'; // ✅ New Home Page
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <div className="p-8 text-center text-red-500 font-bold">Access Denied: Please Login first.</div>;

  return children;
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <CartProvider>
        {/* ✅ Add Toaster here (top-center aligns with your request) */}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            actionButtonStyle: {
              background: '#fdc600',
              color: 'black',
              fontWeight: 'bold',
            }
          }}
        />

        <Navbar />
        <Routes>
          {/* ✅ New Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* ✅ Full Shop Page */}
          <Route path="/shop" element={<ShopPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/product/:id" element={
            <ProtectedRoute>
              <ProductDetailsPage />
            </ProtectedRoute>
          } />

          <Route path="/seller/dashboard" element={
            <ProtectedRoute>
              <SellerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/payment" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />

          <Route path="/order-success" element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          } />

          <Route path="/order-tracking/:id" element={
            <ProtectedRoute>
              <OrderTrackingPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

        </Routes>
      </CartProvider>
    </div>
  );
};

export default App;