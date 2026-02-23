import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/api';
import { DollarSign, ShoppingBag, Users, Activity, AlertCircle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsOverview = () => {
  const [, setSearchParams] = useSearchParams();
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeSellers: 0,
    totalUsers: 0,
    avgTrustScore: 0,
    chartData: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await adminService.getAnalytics();
        if (result) {
          setData({
            totalRevenue: result.totalRevenue || 0,
            totalOrders: result.totalOrders || 0,
            activeSellers: result.activeSellers || 0,
            totalUsers: result.totalUsers || 0,
            avgTrustScore: result.avgTrustScore || 85,
            chartData: result.chartData || [],
            topProducts: result.topProducts || []
          });
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-indigo-600 font-medium animate-pulse">
      Loading Analytics...
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <AlertCircle className="w-5 h-5" />
      <span>{error}</span>
    </div>
  );

  const stats = [
    { label: 'Total Users', value: data.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: 'Active' },
    { label: 'Total Sellers', value: data.activeSellers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+2 New' },
    { label: 'Total Orders', value: data.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+5.2%' },
    { label: 'Total Revenue', value: `₹${data.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100', trend: '+12.5%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.trend} <TrendingUp className="w-3 h-3 ml-1" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Sales Analytics</h3>
            <select className="text-sm border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 focus:ring-indigo-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dollar="₹" />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Insights (Top Products) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Top Products</h3>
          <div className="space-y-6">
            {data.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.sales} Sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{product.revenue.toLocaleString()}</p>
                  <span className="text-green-500 text-xs flex items-center justify-end gap-1">
                    <ArrowUpRight className="w-3 h-3" /> Note
                  </span>
                </div>
              </div>
            ))}
            {data.topProducts.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No product data available yet.
              </div>
            )}
          </div>
          <button
            onClick={() => setSearchParams({ tab: 'products' })}
            className="w-full mt-6 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
          >
            View Full Report
          </button>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsOverview;