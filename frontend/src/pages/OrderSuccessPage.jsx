import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderSuccessPage = () => {

  // ✅ FIX: Use useMemo to generate ID only once
  const orderId = useMemo(() => Math.floor(100000 + Math.random() * 900000), []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 pb-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50">
          <Check className="w-8 h-8 text-green-600 stroke-[3]" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Thank you for your purchase. We've received your order and will begin processing it right away.
        </p>

        <div className="bg-slate-50 p-4 rounded-lg mb-8 border border-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Order ID</span>
            <span className="font-mono font-medium text-slate-900">#{orderId}</span>
          </div>
          <div className="h-px bg-slate-200 w-full"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Est. Delivery</span>
            <span className="font-medium text-slate-900">3-5 Business Days</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/orders"
            className="flex items-center justify-center w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98] text-sm"
          >
            <Package className="w-4 h-4 mr-2" /> Track Order
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center w-full py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-all text-sm"
          >
            <ShoppingBag className="w-4 h-4 mr-2" /> Continue Shopping
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <Link to="/" className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Back to Home <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;