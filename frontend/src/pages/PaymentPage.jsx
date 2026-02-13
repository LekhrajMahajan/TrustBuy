import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, ShieldCheck, Lock, ArrowLeft, QrCode, Wallet } from 'lucide-react';
import { orderService } from '../services/api';
import { useAuth } from '../hooks/useAuth'; // ✅ Import Auth

const PaymentPage = () => {
  const { user } = useAuth(); // ✅ Get User
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  // Safe check for totalPrice
  const safeTotalPrice = Number(totalPrice) || 0;

  // Card State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // UPI State
  const [upiId, setUpiId] = useState('');
  const [taxCode, setTaxCode] = useState('');

  // Check if user is allowed to access
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  if (cartItems.length === 0) return null;

  // Handle Input Changes for Card
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4).replace(/(\d{2})(\d{1,2})/, '$1/$2');
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setCardDetails({ ...cardDetails, [name]: formattedValue });
  };

  const isFormValid = () => {
    if (method === 'cod') return true;

    if (method === 'card') {
      return (
        cardDetails.number.length >= 19 &&
        cardDetails.name.length > 0 &&
        cardDetails.expiry.length === 5 &&
        cardDetails.cvv.length === 3
      );
    }

    if (method === 'upi') {
      const isEmail = taxCode.includes('@') || taxCode.includes('.com') || taxCode.includes('.in');
      const isTaxCodeValid = taxCode.length > 5 && !isEmail;
      const isUpiValid = upiId.includes('@') && upiId.length > 3;
      return isTaxCodeValid || isUpiValid;
    }

    return false;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (method === 'upi') {
      if (taxCode.includes('@') || taxCode.includes('.com')) {
        toast.error("Invalid Transaction ID", {
          description: "Please enter a valid Bank Transaction ID, not an email address."
        });
        return;
      }
    }

    if (!isFormValid()) {
      toast.error("Incomplete Details", {
        description: "Please fill in all payment details properly."
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ Construct Detailed Payment Result
      let paymentResult = {
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address: user?.email || "guest@trustbuy.com",
      };

      if (method === 'card') {
        paymentResult.id = `TXN-CARD-${Date.now()}`; // Mock Transaction ID
        paymentResult.card_last4 = cardDetails.number.slice(-4);
      } else if (method === 'upi') {
        paymentResult.id = taxCode; // Use UTR as ID
        paymentResult.upi_id = upiId;
        paymentResult.taxCode = taxCode; // Legacy support
      } else if (method === 'cod') {
        paymentResult.id = `COD-${Date.now()}`;
        paymentResult.status = "PENDING"; // COD is not paid yet
      }

      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.currentPrice,
          qty: item.qty
        })),
        shippingAddress: {
          address: user?.address || "123 Main St", // Use Profile Address if available
          city: user?.city || "Mumbai",
          postalCode: user?.pincode || "400001",
          country: "India"
        },
        paymentMethod: method,
        paymentResult: paymentResult, // ✅ Send Detailed Result
        totalPrice: totalPrice,
        // Send isPaid flag based on method
        isPaid: method !== 'cod'
      };

      const createdOrder = await orderService.createOrder(orderData);

      toast.success(method === 'cod' ? "Order Placed!" : "Payment Successful!", {
        description: method === 'cod' ? "Pay via Cash/UPI on delivery." : "Your order has been placed successfully."
      });

      setTimeout(() => {
        setLoading(false);
        clearCart();
        navigate('/orders');
      }, 2000);

    } catch (error) {
      console.error("Payment Failed:", error);
      setLoading(false);
      toast.error("Payment Failed", {
        description: "Please check your details and try again."
      });
    }
  };

  const inputStyle = "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all";
  const labelStyle = "text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={() => navigate('/cart')} className="flex items-center text-gray-500 hover:text-slate-900 mb-2 transition font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 text-sm font-bold">
            <Lock className="w-4 h-4" /> 100% Secure Payment
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Payment Methods */}
          <div className="lg:col-span-2 space-y-6">

            {/* Method Selection Tabs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'cod', label: 'COD', icon: Truck },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMethod(opt.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${method === opt.id
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <opt.icon className={`w-6 h-6 mb-2 ${method === opt.id ? 'text-white' : 'text-gray-500'}`} />
                  <span className="text-sm font-bold">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Content Based on Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">

              {/* --- 1. CARD DESIGN --- */}
              {method === 'card' && (
                <div className="p-8 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Enter Card Details</h2>
                    <div className="flex gap-2">
                      <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">VISA</div>
                      <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">MC</div>
                    </div>
                  </div>

                  {/* Visual Card Preview */}
                  <div className="mb-8 w-full max-w-sm mx-auto h-48 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-8 bg-yellow-500/80 rounded-md"></div>
                      <span className="font-mono text-lg italic font-bold tracking-wider opacity-80">VISA</span>
                    </div>
                    <div className="space-y-4 relative z-10">
                      <div className="font-mono text-2xl tracking-widest drop-shadow-md">
                        {cardDetails.number || '0000 0000 0000 0000'}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-gray-300 uppercase tracking-widest mb-1">Card Holder</p>
                          <p className="font-medium tracking-wide uppercase text-sm truncate max-w-[150px]">
                            {cardDetails.name || 'YOUR NAME'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-300 uppercase tracking-widest mb-1 text-right">Expires</p>
                          <p className="font-mono font-medium tracking-wide text-sm">
                            {cardDetails.expiry || 'MM/YY'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
                    <div className="col-span-2">
                      <label className={labelStyle}>Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text" name="number"
                          placeholder="0000 0000 0000 0000"
                          maxLength="19"
                          className={`${inputStyle} pl-10 font-mono`}
                          value={cardDetails.number} onChange={handleCardChange}
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className={labelStyle}>Card Holder Name</label>
                      <input
                        type="text" name="name"
                        placeholder="John Doe"
                        className={inputStyle}
                        value={cardDetails.name} onChange={handleCardChange}
                      />
                    </div>

                    <div>
                      <label className={labelStyle}>Expiry Date</label>
                      <input
                        type="text" name="expiry"
                        placeholder="MM/YY"
                        maxLength="5"
                        className={`${inputStyle} text-center font-mono`}
                        value={cardDetails.expiry} onChange={handleCardChange}
                      />
                    </div>

                    <div>
                      <label className={labelStyle}>CVV / CVC</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="password" name="cvv"
                          placeholder="123"
                          maxLength="3"
                          className={`${inputStyle} pl-9 text-center font-mono`}
                          value={cardDetails.cvv} onChange={handleCardChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 2. UPI QR CODE DESIGN --- */}
              {method === 'upi' && (
                <div className="p-8 flex flex-col items-center justify-center text-center animate-fade-in h-full">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Scan & Pay via UPI</h2>
                  <p className="text-gray-500 text-sm mb-6">Use Google Pay, PhonePe, Paytm or any UPI app</p>

                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-300 mb-6 relative group">
                    {/* Placeholder QR */}
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=shop@upi&pn=TrustBuy&am=100.00&cu=INR"
                      alt="Payment QR Code"
                      className="w-48 h-48 object-contain mix-blend-multiply opacity-90"
                    />
                  </div>

                  <div className="w-full max-w-xs text-left">
                    <div className="mb-4">
                      <label className={labelStyle}>Your UPI ID</label>
                      <input
                        type="text"
                        placeholder="username@oksbi"
                        className={inputStyle}
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value.trim())} // Trim spaces
                      />
                      {!upiId.includes('@') && upiId.length > 0 && (
                        <p className="text-[10px] text-red-500 mt-1">* Must be a valid UPI ID (e.g. name@bank)</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className={labelStyle}>Bank Transaction ID (UTR)</label>
                      <input
                        type="text"
                        placeholder="e.g. 354820194821 (12 Digits)"
                        className={inputStyle}
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                      />
                      <p className="text-[10px] text-red-500 mt-1 font-medium bg-red-50 p-1 rounded border border-red-100 inline-block">
                        * Do NOT enter email address. Enter the Bank Reference/UTR Number usually found in your UPI app after payment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 3. COD DESIGN --- */}
              {method === 'cod' && (
                <div className="p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <Truck className="w-10 h-10 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Cash on Delivery</h2>
                  <p className="text-gray-500 max-w-sm mx-auto mb-8">
                    Pay via Cash or UPI when the package arrives at your doorstep. Please ensure you are available at the delivery address.
                  </p>
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-left max-w-sm w-full">
                    <p className="text-orange-800 text-sm font-bold mb-1">Note:</p>
                    <p className="text-orange-700 text-xs leading-relaxed">Due to high demand, we might call you to confirm this order before shipping.</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-gray-400" /> Order Summary
              </h3>

              <div className="space-y-4 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">₹{safeTotalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Payable</p>
                  <h2 className="text-3xl font-extrabold text-slate-900">₹{safeTotalPrice.toLocaleString('en-IN')}</h2>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !isFormValid()}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transform active:scale-[0.98] transition-all
                  ${loading || !isFormValid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                  }`}
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    {method === 'cod' ? 'Confirm Order' : (method === 'upi' ? 'Verify & Pay' : 'Pay Securely')}
                    <ShieldCheck className="w-5 h-5" />
                  </>
                )}
              </button>

              {method !== 'cod' && (
                <p className="text-xs text-center text-gray-400 mt-4">
                  Complete details to enable payment.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;