import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';

// Pages
import HomePage from './pages/HomePage'; // New Home Page
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
import Phones from './pages/Shop/Phones';
import Laptops from './pages/Shop/Laptops';
import Audio from './pages/Shop/Audio';
import MensWear from './pages/Shop/MensWear';
import WomensWear from './pages/Shop/WomensWear';
import Accessories from './pages/Shop/Accessories';
import NewArrivals from './pages/Shop/NewArrivals';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <div className="p-8 text-center text-red-500 font-bold">Access Denied: Please Login first.</div>;

  return children;
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f11] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <CartProvider>
        {/* Add Toaster here (top-center aligns with your request) */}
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
          {/* New Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Full Shop Page */}
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/phones" element={<Phones />} />
          <Route path="/shop/laptops" element={<Laptops />} />
          <Route path="/shop/audio" element={<Audio />} />
          <Route path="/shop/mens-wear" element={<MensWear />} />
          <Route path="/shop/womens-wear" element={<WomensWear />} />
          <Route path="/shop/accessories" element={<Accessories />} />
          <Route path="/shop/new-arrivals" element={<NewArrivals />} />

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