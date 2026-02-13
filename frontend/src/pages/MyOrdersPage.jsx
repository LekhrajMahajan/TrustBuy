import React, { useEffect, useState } from 'react';
import { orderService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Truck, ChevronRight, ShoppingBag, Clock, CheckCircle } from 'lucide-react';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        // Sort orders by date (newest first)
        const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-indigo-600" /> My Orders
            </h1>
            <p className="text-slate-500 text-sm mt-1">Track and manage your recent purchases</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">Total Orders</p>
            <p className="text-2xl font-bold text-indigo-600">{orders.length}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven't bought anything yet. Discover our latest collection!</p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 transition-all duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="bg-slate-50/50 px-6 py-4 flex flex-wrap gap-y-4 justify-between items-center border-b border-slate-100">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="text-sm font-semibold text-slate-700">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
                      <p className="text-sm font-bold text-slate-900">₹{(order.totalPrice || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                      <Truck className="w-3 h-3" />
                      Arriving {getDeliveryDate(order.createdAt)}
                    </div>
                    <span className="text-xs font-mono text-slate-400">#{order._id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  {(order.orderItems || []).map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6 last:mb-0 group">

                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-white rounded-xl border border-slate-100 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name || "Product"}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-lg truncate mb-1">{item.name}</h4>
                        <p className="text-sm text-slate-500 font-medium mb-3">
                          Qty: {item.qty} • <span className="text-slate-700">₹{item.price.toLocaleString()}</span>
                        </p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => navigate(`/order-tracking/${order._id}`)}
                            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                          >
                            Track Order <ChevronRight className="w-4 h-4 ml-0.5" />
                          </button>
                          <span className="text-slate-300">|</span>
                          <Link to={`/product/${item.product}`} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                            View Product
                          </Link>
                        </div>
                      </div>

                      {/* Status Indicator (Mobile view mostly) */}
                      <div className="sm:text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                          <Clock className="w-3.5 h-3.5" /> Processing
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;