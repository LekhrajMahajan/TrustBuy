import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, itemsPrice, taxPrice, shippingPrice, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/payment'); // Payment Page par bhejo
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-20">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="block w-full py-3 bg-[#fdc600] text-black rounded-xl font-bold hover:bg-[#e5b300] transition">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          Shopping Cart <span className="text-sm font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{cartItems.length} items</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- LEFT: Cart Items List --- */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <p className="text-lg font-bold text-indigo-600">₹{item.currentPrice.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                      <button onClick={() => updateQty(item._id, item.qty - 1)} className="p-1 hover:bg-white rounded-md shadow-sm disabled:opacity-50" disabled={item.qty <= 1}>
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)} className="p-1 hover:bg-white rounded-md shadow-sm" disabled={item.qty >= item.stock}>
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/" className="inline-flex items-center text-[#fdc600] font-bold hover:underline mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
            </Link>
          </div>

          {/* --- RIGHT: Order Summary --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm text-gray-600 pb-6 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST)</span>
                  <span>₹{taxPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingPrice === 0 ? 'text-green-600 font-bold' : ''}>
                    {shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-[#fdc600]">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-[#fdc600] text-black rounded-xl font-bold hover:bg-[#ffdb4d] transition-all shadow-lg transform active:scale-95 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" /> Proceed to Checkout
              </button>

              <div className="mt-4 flex justify-center gap-2 text-xs text-gray-400">
                <span>Secure Payment by Stripe/Razorpay</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;