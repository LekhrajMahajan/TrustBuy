import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, Package, MapPin, ArrowLeft } from 'lucide-react';

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

        // Determine Step
        if (data.isDelivered) setCurrentStep(4);
        else if (data.isPaid) setCurrentStep(1); // Processing
        else setCurrentStep(0); // Placed
      } catch (error) {
        console.error("Failed to fetch order", error);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const steps = [
    { title: 'Order Placed', date: order ? addDays(order.createdAt, 0) : '...', icon: Package },
    { title: 'Processing', date: order ? addDays(order.createdAt, 1) : 'Pending', icon: MapPin },
    { title: 'Shipped', date: order ? addDays(order.createdAt, 2) : 'Pending', icon: Truck },
    { title: 'Out for Delivery', date: order ? addDays(order.createdAt, 5) : 'Expected Soon', icon: Truck },
    { title: 'Delivered', date: order?.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : (order ? `Expected by ${addDays(order.createdAt, 6)}` : 'Pending'), icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button onClick={() => navigate('/orders')} className="flex items-center text-gray-500 hover:text-[#fdc600] mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Orders
        </button>

        {/* Order ID Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Track Order</h1>
          <p className="text-gray-500">Order ID: <span className="font-mono font-bold text-[#fdc600]">#{id}</span></p>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#fdc600]"></div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 relative">
                {/* Vertical Line */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-[19px] top-10 w-0.5 h-full bg-gray-200">
                    <div className={`w-full h-full ${index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                  </div>
                )}

                {/* Icon Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 ${index <= currentStep
                  ? 'bg-[#fdc600] border-[#fdc600] text-black shadow-lg shadow-yellow-200'
                  : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                  <step.icon className="w-5 h-5" />
                </div>

                {/* Text Details */}
                <div className={`${index <= currentStep ? 'opacity-100' : 'opacity-50'}`}>
                  <h3 className={`text-lg font-bold ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500">{step.date}</p>

                  {/* Status Label */}
                  {index === currentStep && (
                    <span className="inline-block mt-1 px-3 py-1 bg-[#f7f4f3] text-[#fdc600] text-xs font-bold rounded-full animate-pulse border border-[#fdc600]">
                      Current Status
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;