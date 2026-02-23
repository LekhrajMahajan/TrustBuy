import React, { useEffect, useState } from 'react';
import { orderService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ArrowRight, Loader2 } from 'lucide-react';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-black dark:border-white pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold uppercase tracking-tighter">Order History</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Archive of your acquisitions.</p>
          </div>
          <p className="text-sm font-bold uppercase tracking-widest hidden sm:block">{orders.length} Orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <Link to="/shop" className="text-sm font-bold uppercase tracking-widest border-b border-black dark:border-white pb-1 hover:text-[#fdc600] hover:border-[#fdc600] transition-colors">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-0">
            {orders.map((order) => (
              <div key={order._id} className="group py-8 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:bg-gray-950 transition-colors -mx-4 px-4 rounded-lg">

                {/* Order Meta */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                      <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #</span>
                      <span className="font-mono text-gray-600 dark:text-gray-400">{(order._id).slice(-6).toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                      <span className="font-bold uppercase text-[10px] bg-black dark:bg-black border border-transparent dark:border-white text-white dark:text-white px-2 py-0.5 rounded-sm">Processing</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</span>
                    <span className="font-bold text-lg">₹{(order.totalPrice || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(order.orderItems || []).map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-black dark:text-white line-clamp-1">{item.name}</h4>
                        <Link to={`/product/${item.product}`} className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline mt-1 block">
                          View Product
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button onClick={() => navigate(`/order-tracking/${order._id}`)} className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                    Track Order <ArrowRight className="w-3 h-3" />
                  </button>
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