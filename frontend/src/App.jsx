import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';
import useServerWakeup from './hooks/useServerWakeup';

// Lazy Loaded Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CartPage = lazy(() => import('./pages/CartPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Phones = lazy(() => import('./pages/Shop/Phones'));
const Laptops = lazy(() => import('./pages/Shop/Laptops'));
const Audio = lazy(() => import('./pages/Shop/Audio'));
const MensWear = lazy(() => import('./pages/Shop/MensWear'));
const WomensWear = lazy(() => import('./pages/Shop/WomensWear'));
const Accessories = lazy(() => import('./pages/Shop/Accessories'));
const NewArrivals = lazy(() => import('./pages/Shop/NewArrivals'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <div className="p-8 text-center text-red-500 font-bold">Access Denied: Please Login first.</div>;

  return children;
};

const App = () => {
  useServerWakeup();

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
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
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
        </Suspense>
      </CartProvider>
    </div>
  );
};

export default App;