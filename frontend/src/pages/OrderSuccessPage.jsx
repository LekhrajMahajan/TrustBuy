import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  const [orderId] = useState(() => Math.floor(100000 + Math.random() * 900000));

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white dark:bg-gray-900">

      {/* 1. Left: Editorial Image */}
      <div className="hidden md:block relative bg-gray-100 dark:bg-gray-800 order-2">
        <img
          src="https://images.unsplash.com/photo-1549890696-6db9f5835957?q=80&w=1974&auto=format&fit=crop"
          alt="Package"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
        />
        <div className="absolute inset-0 bg-black dark:bg-gray-800/10"></div>
        <div className="absolute bottom-12 left-12 text-white dark:text-white">
          <h2 className="text-5xl font-extrabold tracking-tighter mb-2">It's Yours.</h2>
          <p className="text-sm font-bold uppercase tracking-widest opacity-80">Get ready to unbox excellence.</p>
        </div>
      </div>

      {/* 2. Right: Confirmation Details */}
      <div className="flex items-center justify-center p-8 md:p-24 order-1">
        <div className="w-full max-w-sm text-center md:text-left">

          <div className="w-12 h-12 bg-[#fdc600] rounded-full flex items-center justify-center mb-8 mx-auto md:mx-0">
            <Check className="w-6 h-6 text-black dark:text-white" />
          </div>

          <h1 className="text-3xl font-extrabold text-black dark:text-white uppercase tracking-tight mb-2">Order Confirmed</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
            Thank you for shopping with TrustBuy. Your order has been placed and is being processed.
          </p>

          <div className="bg-gray-50 dark:bg-gray-950 p-6 mb-8 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Order ID</span>
              <span className="text-sm font-mono font-bold">#{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Est. Delivery</span>
              <span className="text-sm font-bold">2-3 Days</span>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/orders"
              className="block w-full py-4 bg-black dark:bg-gray-800 text-white dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all text-center"
            >
              Track Order
            </Link>

            <Link
              to="/"
              className="block w-full py-4 bg-transparent border border-gray-200 dark:border-gray-700 text-black dark:text-white text-xs font-bold uppercase tracking-widest hover:border-black dark:border-white transition-all text-center"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="mt-8 text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <ArrowRight className="w-3 h-3 rotate-180" /> Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;