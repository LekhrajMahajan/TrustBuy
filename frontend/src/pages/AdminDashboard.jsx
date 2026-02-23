import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import {
  LayoutDashboard,
  Users,
  Package,
  TrendingUp,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import AnalyticsOverview from '../components/dashboard/AnalyticsOverview';
import SellerTable from '../components/dashboard/SellerTable';
import ProductControl from '../components/dashboard/ProductControl';
import DynamicPricing from '../components/dashboard/DynamicPricing';
import UserDetails from '../components/dashboard/UserDetails';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null; // Prevent flash

  // Sync state with URL: ?tab=overview
  const activeTab = searchParams.get('tab') || 'overview';

  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };



  const navItems = [
    { id: 'overview', label: 'Top Overview', icon: LayoutDashboard },
    { id: 'pricing', label: 'Sales & Dynamic Pricing', icon: TrendingUp },
    { id: 'products', label: 'Product Control Panel', icon: Package },
    { id: 'sellers', label: 'Seller Trust Monitoring', icon: Users },
    { id: 'users', label: 'User & CSV Management', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black dark:bg-gray-800 bg-opacity-50 md:hidden w-full h-full cursor-default"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 text-white dark:text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="flex items-center justify-between p-6 border-b border-indigo-800">
          <span className="text-2xl font-bold">AdminPanel</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white dark:text-white hover:text-indigo-200"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === item.id
                ? 'bg-indigo-700 text-white dark:text-white'
                : 'text-indigo-200 hover:bg-indigo-800'
                }`}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-800">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center space-x-3 text-indigo-200 hover:text-white dark:text-white transition-colors duration-200 w-full px-4 py-2"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-900 shadow-sm h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-600 dark:text-gray-400 focus:outline-none hover:text-gray-900 dark:text-gray-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Welcome, Admin</span>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {activeTab === 'overview' && <AnalyticsOverview />}
          {activeTab === 'users' && <UserDetails />}
          {activeTab === 'sellers' && <SellerTable />}
          {activeTab === 'products' && <ProductControl />}
          {activeTab === 'pricing' && <DynamicPricing />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;