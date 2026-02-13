import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api'; 
import { DollarSign, ShoppingBag, Users, Activity, AlertCircle } from 'lucide-react';

const AnalyticsOverview = () => {
  // 1. State for Data, Loading, AND Error
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeSellers: 0,
    avgTrustScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New Error State

  // 2. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await adminService.getAnalytics();
        
        // Safety check: Ensure result exists before setting state
        if (result) {
          setData({
            totalRevenue: result.totalRevenue || 0,
            totalOrders: result.totalOrders || 0,
            activeSellers: result.activeSellers || 0,
            avgTrustScore: result.avgTrustScore || 0
          });
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 3. Loading & Error UI States
  if (loading) return (
    <div className="flex justify-center items-center h-64 text-indigo-600 font-medium">
      Loading Analytics...
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
      <AlertCircle className="w-5 h-5" />
      <span>{error}</span>
    </div>
  );

  // 4. Construct Stats Array
  const stats = [
    { 
      label: 'Total Revenue', 
      value: `$${data.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-green-600', 
      bg: 'bg-green-100' 
    },
    { 
      label: 'Total Orders', 
      value: data.totalOrders, 
      icon: ShoppingBag, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      label: 'Active Sellers', 
      value: data.activeSellers, 
      icon: Users, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100' 
    },
    { 
      label: 'Avg Trust Score', 
      value: `${data.avgTrustScore}/100`, 
      icon: Activity, 
      color: 'text-orange-600', 
      bg: 'bg-orange-100' 
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Platform Analytics</h2>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col justify-center items-center">
          <p className="text-gray-400 font-medium">Revenue Trends Chart (Coming Soon)</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col justify-center items-center">
          <p className="text-gray-400 font-medium">Order Volume Chart (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;