import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import {
    Search,
    MoreVertical,
    CheckCircle,
    AlertTriangle,
    XCircle,
    TrendingUp,
    TrendingDown,
    Minus,
    Activity
} from 'lucide-react';
import { toast } from 'sonner';

const ProductControl = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        try {
            const data = await adminService.getAdminProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAction = async (id, action) => {
        // Placeholder for actions like Flag, Disable, Delete
        toast.message(`Action ${action} initiated for product ${id}`);
        // Implement actual API calls here if backend supports them using adminService
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDemandBadge = (demand) => {
        if (demand === 'high') return <span className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-xs">🔥 High</span>;
        if (demand === 'medium') return <span className="flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-2 py-1 rounded text-xs">⚡ Medium</span>;
        return <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-bold bg-gray-50 dark:bg-gray-950 px-2 py-1 rounded text-xs">⬇ Low</span>;
    };

    const getPriceStatus = (base, current) => {
        if (current > base) return { color: 'text-green-600', icon: <TrendingUp className="w-3 h-3" /> };
        if (current < base) return { color: 'text-red-500', icon: <TrendingDown className="w-3 h-3" /> };
        return { color: 'text-blue-600', icon: <Minus className="w-3 h-3" /> };
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return <span className="text-red-500 font-semibold text-xs border border-red-200 bg-red-50 px-2 py-1 rounded-full">Out of Stock</span>;
        if (stock < 10) return <span className="text-yellow-600 font-semibold text-xs border border-yellow-200 bg-yellow-50 px-2 py-1 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Low Stock</span>;
        return <span className="text-green-600 font-semibold text-xs border border-green-200 bg-green-50 px-2 py-1 rounded-full">In Stock</span>;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Product Control</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monitor live pricing, stock levels, and demand signals.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search product or seller..."
                        className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-950">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Seller</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Live Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Demand</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No products found.</td></tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const priceStatus = getPriceStatus(product.basePrice, product.currentPrice);
                                    return (
                                        <tr key={product._id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                                            {/* 1. Product Name + Image */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-md object-cover border border-gray-200 dark:border-gray-700" src={product.image || 'https://via.placeholder.com/40'} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{product.category}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 2. Seller Name */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-indigo-600 hover:text-indigo-900 cursor-pointer">{product.seller.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Trust: {product.seller.trustScore}%</div>
                                            </td>

                                            {/* 3. Base Price */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                ₹{product.basePrice}
                                            </td>

                                            {/* 4. Live Dynamic Price */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex items-center gap-1 font-bold ${priceStatus.color}`}>
                                                    {priceStatus.icon}
                                                    ₹{product.currentPrice}
                                                </div>
                                            </td>

                                            {/* 5. Stock Level */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStockStatus(product.stock)}
                                            </td>

                                            {/* 6. Demand Indicator */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getDemandBadge(product.demand)}
                                            </td>

                                            {/* 7. Product Status & Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {product.isApproved ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button onClick={() => handleAction(product._id, 'flag')} className="text-gray-400 hover:text-yellow-600 transition-colors tooltip-trigger" title="Flag Product">
                                                        <AlertTriangle className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleAction(product._id, 'disable')} className="text-gray-400 hover:text-red-600 transition-colors tooltip-trigger" title="Disable Product">
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleAction(product._id, 'delete')} className="text-gray-400 hover:text-red-900 transition-colors tooltip-trigger" title="Remove Product">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductControl;
