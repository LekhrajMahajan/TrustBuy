import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Truck, Package, MapPin, ArrowLeft, Clock } from 'lucide-react';
import { orderService } from '../services/api';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [order, setOrder] = useState(null);

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
              EST: <span className="text-black dark:text-white font-bold">{addDays(order.createdAt, 3)}</span>
            </p>
          </div>
        </div>

        {/* Timeline */}
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

      </div>
    </div>
  );
};

export default OrderTrackingPage;