import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { toast } from 'sonner';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Download,
  MoreVertical,
  Check,
  Ban,
  Mail
} from 'lucide-react';

const SellerTable = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // ID of seller being processed

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSellers();
      setSellers(data);
    } catch (err) {
      console.error("Error fetching sellers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setActionLoading(id);
    try {
      await adminService.verifySeller(id);
      toast.success("Seller Verified Successfully");
      setSellers(sellers.map(s => s._id === id ? { ...s, status: 'active', trustScore: 80 } : s));
    } catch (err) {
      toast.error("Failed to verify seller", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (id) => {
    setActionLoading(id);
    try {
      await adminService.suspendSeller(id);
      toast.success("Seller Suspended");
      setSellers(sellers.map(s => s._id === id ? { ...s, status: 'suspended' } : s));
    } catch (err) {
      toast.error("Failed to suspend seller", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      toast.info('Preparing sellers export...');
      const blob = await adminService.exportSellers();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sellers_report.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Sellers CSV exported!');
    } catch (err) {
      console.error('Export failed', err);
      toast.error('Failed to export sellers', err);
    }
  };

  const deriveStatus = (statusInfo) => {
    if (statusInfo === 'active') return { label: 'Active', color: 'bg-green-50 text-green-700 ring-green-600/20', icon: ShieldCheck };
    if (statusInfo === 'suspended') return { label: 'Suspended', color: 'bg-red-50 text-red-700 ring-red-600/10', icon: Ban };
    return { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20', icon: AlertTriangle };
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-indigo-600">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-100 border-t-indigo-600 mb-4"></div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-950/50">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Seller Monitoring</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage seller approvals and suspensions</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Seller Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Trust Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Orders / Rating</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Returns</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Delivery</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sellers.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No sellers found.</td></tr>
            ) : sellers.map((seller) => {
              const statusMeta = deriveStatus(seller.status);
              const isProcessing = actionLoading === seller._id;

              return (
                <tr key={seller._id} className="hover:bg-gray-50 dark:bg-gray-950/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{seller.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{seller.email}</div>
                    {/* Show Business Info if available */}
                    {(seller.businessName || seller.gstin) && (
                      <div className="mt-1 text-[10px] text-indigo-600 bg-indigo-50 inline-block px-1 rounded border border-indigo-100 uppercase font-bold tracking-wider">
                        {seller.businessName || 'Business Info'} {seller.gstin ? `(GST: ${seller.gstin})` : ''}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${seller.trustScore > 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${seller.trustScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{seller.trustScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="font-medium text-gray-900 dark:text-gray-100">124 Orders</div>
                    <div className="text-xs text-yellow-600 flex items-center gap-1">
                      {seller.rating} ★ Rating
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-red-500">
                    {Math.floor(Math.random() * 5)}%
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    {(95 + Math.random() * 4).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${statusMeta.color}`}>
                      <statusMeta.icon className="w-3.5 h-3.5" />
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {seller.status !== 'active' && (
                        <button
                          onClick={() => handleVerify(seller._id)}
                          disabled={isProcessing}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors tooltip-trigger"
                          title="Verify Seller"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {seller.status !== 'suspended' && (
                        <button
                          onClick={() => handleSuspend(seller._id)}
                          disabled={isProcessing}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip-trigger"
                          title="Suspend Seller"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors tooltip-trigger" title="Warn Seller">
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerTable;