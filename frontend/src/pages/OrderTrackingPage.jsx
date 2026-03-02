import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Truck, Package, MapPin, ArrowLeft, Clock, XCircle, AlertCircle } from 'lucide-react';
import { orderService } from '../services/api';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [order, setOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
        if (data.isDelivered) setCurrentStep(4);
        else if (data.isPaid) setCurrentStep(1);
        else setCurrentStep(0);
      } catch (error) {
        console.error("Failed to fetch order", error);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setCancelling(true);
        const updatedOrder = await orderService.cancelOrder(id);
        setOrder(updatedOrder);
      } catch (error) {
        console.error("Failed to cancel order", error);
        alert(error.response?.data?.message || "Failed to cancel order");
      } finally {
        setCancelling(false);
      }
    }
  };

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const steps = [
    { title: 'Order Placed', date: order ? addDays(order.createdAt, 0) : '...', icon: Package },
    { title: 'Processing', date: order ? addDays(order.createdAt, 1) : 'Pending', icon: MapPin },
    { title: 'In Transit', date: order ? addDays(order.createdAt, 1) : 'Pending', icon: Truck },
    { title: 'Out for Delivery', date: order ? addDays(order.createdAt, 2) : 'Expected Soon', icon: Truck },
    { title: 'Delivered', date: order?.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : order ? addDays(order.createdAt, 3) : 'Pending', icon: Check }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 border-b border-black dark:border-white pb-6">
          <button onClick={() => navigate('/orders')} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white mb-4 flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Orders
          </button>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tighter text-black dark:text-white mb-2">
            Tracking
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
              ID: <span className="text-black dark:text-white font-bold">#{id.toUpperCase()}</span>
            </p>
            <div className="h-px w-10 bg-gray-300 hidden md:block"></div>
            <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
              EST: <span className="text-black dark:text-white font-bold">{order.isCancelled ? 'Cancelled' : addDays(order.createdAt, 3)}</span>
            </p>
          </div>
        </div>

        {/* Cancellation Message */}
        {order.isCancelled && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-800 dark:text-red-300 text-lg">Order Cancelled</h3>
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">This order was cancelled on {new Date(order.cancelledAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
              <div className="mt-3 flex items-start gap-2 text-sm text-red-800 dark:text-red-300 font-medium">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>The refund process has been initiated. If any money was deducted, it will be refunded to your original payment method within 7 working days.</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!order.isCancelled && !order.isDelivered && (
          <div className="mb-10 flex justify-end border-b border-gray-100 dark:border-gray-800 pb-6">
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-6 py-2.5 bg-white dark:bg-gray-900 text-red-600 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-xs uppercase tracking-widest rounded transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}

        {/* Timeline */}
        {!order.isCancelled && (
          <div className="relative pl-4 md:pl-0">
            <div className="space-y-0">
              {steps.map((step, index) => {
                const isActive = index <= currentStep;
                const isLast = index === steps.length - 1;

                return (
                  <div key={index} className="flex gap-8 relative pb-12 last:pb-0 group">
                    {/* Line */}
                    {!isLast && (
                      <div className="absolute left-[19px] top-10 w-px h-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:bg-gray-700 transition-colors">
                        {index < currentStep && <div className="w-full h-full bg-black dark:bg-gray-800"></div>}
                      </div>
                    )}

                    {/* Icon Marker */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border transition-all duration-500 ${isActive
                      ? 'bg-black dark:bg-gray-800 border-black dark:border-white text-white dark:text-white'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-300'
                      }`}>
                      <step.icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className={`pt-2 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                      <h3 className="text-xl font-bold uppercase tracking-tight leading-none mb-1">
                        {step.title}
                      </h3>
                      <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{step.date}</p>

                      {index === currentStep && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-[#fdc600] text-black dark:text-black text-[10px] font-bold uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> Current Status
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderTrackingPage;