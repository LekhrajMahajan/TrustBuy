import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, ShieldCheck, Lock, ArrowLeft, QrCode, Wallet, Check } from 'lucide-react';
import { orderService, userService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const PaymentPage = () => {
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const safeTotalPrice = Number(totalPrice) || 0;

  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [taxCode, setTaxCode] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) navigate('/');
  }, [cartItems, navigate]);

  // Guard: redirect to profile if delivery address is incomplete
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const profile = await userService.getProfile();
        const missing = [];
        if (!profile.address?.trim()) missing.push('Address');
        if (!profile.city?.trim()) missing.push('City');
        if (!profile.pincode?.trim()) missing.push('Pincode');
        if (missing.length > 0) {
          toast.error('Complete your profile to checkout', {
            description: `Missing: ${missing.join(', ')}`,
            duration: 5000,
          });
          navigate('/profile');
        }
      } catch (_) { /* allow if fetch fails */ }
    };
    if (user) checkProfile();
  }, [user, navigate]);

  if (cartItems.length === 0) return null;

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'number') formattedValue = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})/g, '$1 ').trim();
    else if (name === 'expiry') formattedValue = value.replace(/\D/g, '').substring(0, 4).replace(/(\d{2})(\d{1,2})/, '$1/$2');
    else if (name === 'cvv') formattedValue = value.replace(/\D/g, '').substring(0, 3);
    setCardDetails({ ...cardDetails, [name]: formattedValue });
  };

  const isFormValid = () => {
    if (method === 'cod') return true;
    if (method === 'card') return cardDetails.number.length >= 19 && cardDetails.name.length > 0 && cardDetails.expiry.length === 5 && cardDetails.cvv.length === 3;
    if (method === 'upi') return (taxCode.length > 5 && !taxCode.includes('@')) || (upiId.includes('@') && upiId.length > 3);
    return false;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!isFormValid()) { toast.error("Incomplete Details"); return; }

    setLoading(true);
    try {
      let paymentResult = {
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address: user?.email || "guest@trustbuy.com",
      };

      if (method === 'card') {
        paymentResult.id = `TXN-CARD-${Date.now()}`;
        paymentResult.card_last4 = cardDetails.number.slice(-4);
      } else if (method === 'upi') {
        paymentResult.id = taxCode;
        paymentResult.upi_id = upiId;
        paymentResult.taxCode = taxCode;
      } else if (method === 'cod') {
        paymentResult.id = `COD-${Date.now()}`;
        paymentResult.status = "PENDING";
      }

      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id, name: item.name, image: item.image, price: item.currentPrice, qty: item.qty
        })),
        shippingAddress: {
          address: user?.address || "123 Main St",
          city: user?.city || "Mumbai",
          postalCode: user?.pincode || "400001",
          country: "India"
        },
        paymentMethod: method,
        paymentResult: paymentResult,
        totalPrice: safeTotalPrice,
        isPaid: method !== 'cod'
      };

      await orderService.createOrder(orderData);
      toast.success("Order Placed Successfully");
      setTimeout(() => { setLoading(false); clearCart(); navigate('/orders'); }, 1000);

    } catch (error) {
      console.error("Payment Error:", error);
      setLoading(false);
      const errorMessage = error.response?.data?.message || "Payment Failed. Please try again.";
      toast.error(errorMessage);

      if (error.response && error.response.status === 401) {
        toast.error("Session Expired. Redirecting to Login...");
        setTimeout(() => {
          // Clear local storage and redirect
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 1500);
      }
    }
  };

  const inputClass = "w-full border-b border-gray-200 dark:border-white py-3 text-sm text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none bg-transparent dark:bg-black placeholder:text-gray-300 transition-colors font-medium";
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12 border-b border-black dark:border-white pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <button onClick={() => navigate('/cart')} className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2" /> Return to Cart
            </button>
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter text-black dark:text-white">
              Secure Checkout
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-600">
            <Lock className="w-3 h-3" /> Encrypted Transaction
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-8">
            <div className="flex border-b border-gray-100 dark:border-gray-800 mb-8">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'cod', label: 'Cash on Delivery', icon: Truck },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMethod(opt.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${method === opt.id
                    ? 'text-black dark:text-white'
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'
                    }`}
                >
                  <opt.icon className="w-4 h-4" />
                  {opt.label}
                  {method === opt.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-gray-800"></div>}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              {method === 'card' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="order-2 md:order-1">
                      <div className="bg-black dark:bg-black border border-transparent dark:border-white text-white dark:text-white aspect-[1.58/1] rounded-xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-gray-900/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-6 border border-white/30 rounded flex items-center justify-center text-[8px] font-bold tracking-widest">CHIP</div>
                          <span className="font-mono text-xs opacity-50">DEBIT / CREDIT</span>
                        </div>
                        <div className="space-y-4 relative z-10">
                          <div className="font-mono text-xl tracking-widest">
                            {cardDetails.number || '0000 0000 0000 0000'}
                          </div>
                          <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-70">
                            <span>{cardDetails.name || 'Card Holder'}</span>
                            <span>{cardDetails.expiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                      <div>
                        <label className={labelClass}>Card Number</label>
                        <input type="text" name="number" placeholder="0000 0000 0000 0000" maxLength="19" className={`${inputClass} font-mono`} value={cardDetails.number} onChange={handleCardChange} />
                      </div>
                      <div>
                        <label className={labelClass}>Card Holder</label>
                        <input type="text" name="name" placeholder="NAME ON CARD" className={inputClass} value={cardDetails.name} onChange={handleCardChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={labelClass}>Expiry</label>
                          <input type="text" name="expiry" placeholder="MM/YY" maxLength="5" className={`${inputClass} font-mono`} value={cardDetails.expiry} onChange={handleCardChange} />
                        </div>
                        <div>
                          <label className={labelClass}>CVC</label>
                          <input type="password" name="cvv" placeholder="123" maxLength="3" className={`${inputClass} font-mono`} value={cardDetails.cvv} onChange={handleCardChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {method === 'upi' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-lg">
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-6">Scan to Pay</h3>
                  <div className="flex gap-8 items-start">
                    <div className="p-2 border border-black dark:border-white inline-block">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay" alt="QR" className="w-32 h-32 mix-blend-multiply" />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div>
                        <label className={labelClass}>UPI ID</label>
                        <input type="text" placeholder="user@bank" className={inputClass} value={upiId} onChange={(e) => setUpiId(e.target.value.trim())} />
                      </div>
                      <div>
                        <label className={labelClass}>Transaction Ref (UTR)</label>
                        <input type="text" placeholder="12 Digit UTR Number" className={inputClass} value={taxCode} onChange={(e) => setTaxCode(e.target.value)} />
                        <p className="text-[10px] text-gray-400 mt-1">Enter the reference number from your payment app.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {method === 'cod' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 py-12 border border-dashed border-gray-300 text-center">
                  <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-bold uppercase tracking-tight">Cash on Delivery</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mt-2">
                    Pay exactly <span className="text-black dark:text-white font-bold">₹{safeTotalPrice.toLocaleString('en-IN')}</span> upon delivery within 2-3 days.
                    Please ensure someone is available at the address.
                  </p>
                </div>
              )}

            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-gray-50 dark:bg-gray-950 p-8 sticky top-24 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">Order Summary</h3>
                <Wallet className="w-4 h-4 text-gray-400" />
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="font-mono font-bold">₹{safeTotalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                  <span className="font-mono font-bold text-black dark:text-white">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Taxes</span>
                  <span className="font-mono font-bold text-gray-400">INCLUDED</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-black dark:border-white mb-8">
                <span className="text-sm font-bold uppercase tracking-widest">Total Due</span>
                <span className="text-3xl font-extrabold tracking-tight">₹{safeTotalPrice.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !isFormValid()}
                className="w-full py-4 bg-black dark:bg-black border border-transparent dark:border-white text-white dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-[#fdc600] hover:text-black dark:hover:text-yellow transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : (method === 'cod' ? 'Place Order' : 'Pay Now')}
                {!loading && <Check className="w-4 h-4" />}
              </button>

              <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Secure SSL Encrypted</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;