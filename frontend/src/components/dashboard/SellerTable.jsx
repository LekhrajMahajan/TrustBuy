// src/components/dashboard/SellerTable.jsx
import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Download } from 'lucide-react';
import { adminService } from '../../services/api';

const SellerTable = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Real Seller Data from Backend
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const data = await adminService.getSellers();
        setSellers(data);
      } catch (err) {
        console.error("Error fetching sellers:", err);
        setError("Failed to load seller list.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  // 2. Helper to determine Status based on Trust Score
  const deriveStatus = (score) => {
    if (score >= 90) return 'Verified';
    if (score < 50) return 'Flagged';
    return 'Active';
  };

  // 3. Loading & Error States
  if (loading) return (
    <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-100 border-t-indigo-600 mb-4"></div>
      <p className="font-medium">Loading Seller Data...</p>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-50 text-red-700 flex items-center gap-3 rounded-2xl border border-red-100 shadow-sm" role="alert">
      <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      <span className="font-medium">{error}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Seller Monitoring</h3>
          <p className="text-sm text-gray-500 mt-1">Real-time performance tracking</p>
        </div>
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
          aria-label="Export seller report"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Export Report
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller Name</th>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Rate</th>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trust Score</th>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sellers.length === 0 ? (
               <tr>
                 <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">
                   No active sellers found.
                 </td>
               </tr>
            ) : (
              sellers.map((seller) => {
                const status = deriveStatus(seller.trustScore);
                
                return (
                  <tr key={seller.id} className="group hover:bg-gray-50/80 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{seller.name}</div>
                      <div className="text-xs text-gray-500">{seller.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-md border border-yellow-100">
                        {seller.rating || 0} ★
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {seller.deliveryRate || 'N/A'}
                    </td>
                    
                    {/* Visualizing Trust Score */}
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2.5 bg-gray-100 rounded-full overflow-hidden ring-1 ring-gray-200">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                              seller.trustScore >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                              seller.trustScore >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                              'bg-gradient-to-r from-red-500 to-red-600'
                            }`} 
                            style={{ width: `${seller.trustScore}%` }}
                            role="progressbar"
                            aria-valuenow={seller.trustScore}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-label={`Trust score: ${seller.trustScore}%`}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 w-8">{seller.trustScore}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${
                        status === 'Verified' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                        status === 'Flagged' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                        'bg-blue-50 text-blue-700 ring-blue-700/10'
                      }`}>
                        {status === 'Verified' && <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />}
                        {status === 'Flagged' && <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />}
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerTable;