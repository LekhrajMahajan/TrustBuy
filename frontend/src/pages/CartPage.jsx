import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/api';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MapPin } from 'lucide-react';
import { getImageUrl } from '../utils/helpers';
import { toast } from 'sonner';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, itemsPrice, taxPrice, shippingPrice, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingProfile, setCheckingProfile] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to proceed.");
      navigate('/login');
      return;
    }

    setCheckingProfile(true);
    try {
      // Fetch fresh profile to check address fields
      const profile = await userService.getProfile();
      const missingFields = [];
      if (!profile.address?.trim()) missingFields.push('Address');
      if (!profile.city?.trim()) missingFields.push('City');
      if (!profile.pincode?.trim()) missingFields.push('Pincode');

      if (missingFields.length > 0) {
        toast.error(`Please complete your profile before checkout.`, {
          description: `Missing: ${missingFields.join(', ')}. Go to Profile → Edit to add these.`,
          duration: 5000,
          action: {
            label: 'Go to Profile',
            onClick: () => navigate('/profile'),
          },
        });
        return;
      }

      navigate('/payment');
    } catch (err) {
      // If profile fetch fails (network etc.), allow checkout anyway
      navigate('/payment');
    } finally {
      setCheckingProfile(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="text-center max-w-md px-6">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold uppercase tracking-tight text-black dark:text-white mb-2">Your Bag is Empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Looks like you haven't made your choice yet.</p>
          <Link to="/shop" className="inline-block px-8 py-3 bg-black dark:bg-black border border-transparent dark:border-white text-white dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tighter mb-8 sm:mb-12">Shopping Bag <span className="text-base sm:text-lg text-gray-400 font-medium ml-2">({cartItems.length})</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          <div className="lg:col-span-2">
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 sm:gap-6 py-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="w-24 sm:w-32 h-32 sm:h-40 bg-gray-50 dark:bg-gray-800 flex-shrink-0 overflow-hidden relative">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                        <h3 className="text-base sm:text-lg font-bold text-black dark:text-white uppercase tracking-wide leading-tight sm:pr-4">{item.name}</h3>
                        <p className="text-base sm:text-lg font-bold text-black dark:text-white">₹{item.currentPrice.toLocaleString('en-IN')}</p>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{item.category}</p>
                    </div>
                    <div className="flex justify-between items-center sm:items-end mt-4 sm:mt-0">
                      <div className="flex items-center gap-2 sm:gap-4 border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-1 rounded-sm">
                        <button onClick={() => updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-30">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item._id, item.qty + 1)} disabled={item.qty >= item.stock} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-30">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(item._id)} className="text-[10px] sm:text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider border-b border-transparent hover:border-red-700 transition-all">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-950 p-8 sticky top-24">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Order Summary</h2>

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-black dark:text-white">₹{itemsPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingPrice === 0 ? 'text-black dark:text-white font-medium' : ''}>
                    {shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (Estimated)</span>
                  <span>₹{taxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-200 dark:border-gray-700 mb-6">
                <span className="text-base font-bold text-black dark:text-white uppercase">Total</span>
                <span className="text-xl font-bold text-black dark:text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              {/* Address reminder banner */}
              <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded px-3 py-2 mb-4 text-xs text-amber-800 dark:text-amber-400">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>Delivery address is required. Make sure your <Link to="/profile" className="underline font-bold">profile</Link> has address, city &amp; pincode.</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingProfile}
                className="w-full py-4 bg-black dark:bg-yellow border border-transparent dark:border-white text-white dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-[#fdc600] hover:text-black dark:hover:text-black transition-all shadow-xl disabled:opacity-70"
              >
                {checkingProfile ? 'Verifying...' : 'Checkout'}
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-wide">
                Secure Checkout by Stripe
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;