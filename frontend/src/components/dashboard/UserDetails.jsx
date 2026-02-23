import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Download, Search, MapPin, Phone, Mail, User as UserIcon, ShoppingCart, Package, ChevronDown, ChevronUp, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const UserDetails = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedUser, setExpandedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleExport = async (type) => {
        try {
            toast.info(`Preparing ${type} Download...`);
            let blob;
            let filename = `${type}_report.csv`;

            if (type === 'users') {
                blob = await adminService.exportUsers();
            } else if (type === 'sellers') {
                blob = await adminService.exportSellers();
            } else {
                toast.success('Orders CSV feature coming soon!');
                return;
            }

            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success(`${type} Exported Successfully`);
        } catch (error) {
            console.error('Export Failed', error);
            toast.error(`Failed to Export ${type}`);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleExpand = (userId) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-indigo-600 font-medium animate-pulse">
            Loading Users...
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">User & CSV Management</h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage and view all registered users with their purchase & sale history</p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <button onClick={() => handleExport('users')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white dark:text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-xs font-bold uppercase tracking-wider">
                        <Download className="w-4 h-4" /> Users CSV
                    </button>
                    <button onClick={() => handleExport('orders')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white dark:text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-xs font-bold uppercase tracking-wider">
                        <Download className="w-4 h-4" /> Orders CSV
                    </button>
                    <button onClick={() => handleExport('sellers')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white dark:text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-xs font-bold uppercase tracking-wider">
                        <Download className="w-4 h-4" /> Sellers CSV
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex items-center gap-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name, email or ID..."
                        className="bg-transparent border-none focus:outline-none w-full text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="px-6 py-10 text-center text-gray-400 italic">No users found.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => {
                            const isExpanded = expandedUser === user._id;
                            const hasPurchased = user.purchased?.length > 0;
                            const hasSold = user.sold?.length > 0;

                            return (
                                <div key={user._id}>
                                    {/* Main User Row */}
                                    <div className="px-6 py-4 hover:bg-gray-50 dark:bg-gray-950 transition-colors grid grid-cols-1 lg:grid-cols-12 gap-4 items-center text-center lg:text-left">
                                        {/* Avatar + Name */}
                                        <div className="lg:col-span-3 flex items-center justify-center lg:justify-start gap-3">
                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                {user.name?.charAt(0)?.toUpperCase() || <UserIcon className="w-5 h-5" />}
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name || 'N/A'}</div>
                                                <div className="text-xs text-gray-400">ID: {user._id?.slice(-8)}</div>
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div className="lg:col-span-3 flex flex-col items-center lg:items-start gap-1">
                                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 gap-1">
                                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 gap-1">
                                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                    {user.phone}
                                                </div>
                                            )}
                                        </div>

                                        {/* Location */}
                                        <div className="lg:col-span-2 flex items-center justify-center lg:justify-start text-xs text-gray-600 dark:text-gray-400 gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="truncate">{user.city ? `${user.city}${user.state ? ', ' + user.state : ''}` : <span className="italic text-gray-400">No location</span>}</span>
                                        </div>

                                        {/* Role Badge */}
                                        <div className="lg:col-span-1 flex flex-col items-center gap-1">
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                            <div className="text-[10px] text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</div>
                                        </div>

                                        {/* Purchase/Sale Summary */}
                                        <div className="lg:col-span-2 flex flex-col items-center lg:items-start justify-center gap-1 text-xs">
                                            <div className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-1 rounded w-max">
                                                <ShoppingCart className="w-3.5 h-3.5" />
                                                <span>Bought: ₹{(user.totalSpent || 0).toLocaleString()}</span>
                                            </div>
                                            {(hasSold || user.role === 'seller') && (
                                                <div className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded w-max">
                                                    <Package className="w-3.5 h-3.5" />
                                                    <span>Sold: ₹{(user.totalEarned || 0).toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Expand button */}
                                        <div className="lg:col-span-1 flex justify-center lg:justify-end">
                                            {(hasPurchased || hasSold) && (
                                                <button
                                                    onClick={() => toggleExpand(user._id)}
                                                    className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-full transition-colors flex items-center justify-center"
                                                    title="View history"
                                                >
                                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded: Purchase & Sale History */}
                                    {isExpanded && (
                                        <div className="px-6 pb-4 bg-gray-50 dark:bg-gray-950 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Purchased */}
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase text-blue-700 mb-2 flex items-center gap-1">
                                                    <ShoppingCart className="w-4 h-4" /> Products Purchased
                                                </h4>
                                                {hasPurchased ? (
                                                    <table className="w-full text-xs text-left">
                                                        <thead>
                                                            <tr className="text-gray-500 dark:text-gray-400">
                                                                <th className="py-1 pr-2">Product</th>
                                                                <th className="py-1 pr-2 text-center">Qty</th>
                                                                <th className="py-1 text-right">Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {user.purchased.map((item, i) => (
                                                                <tr key={i} className="text-gray-700">
                                                                    <td className="py-1 pr-2 font-medium">{item.productName}</td>
                                                                    <td className="py-1 pr-2 text-center">{item.qty}</td>
                                                                    <td className="py-1 text-right text-blue-700 font-semibold">₹{item.total.toLocaleString()}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td colSpan="2" className="pt-2 text-right font-bold text-gray-600 dark:text-gray-400">Total Spent:</td>
                                                                <td className="pt-2 text-right font-bold text-blue-700">₹{user.totalSpent.toLocaleString()}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                ) : (
                                                    <p className="text-gray-400 italic text-xs">No purchases yet.</p>
                                                )}
                                            </div>

                                            {/* Sold */}
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase text-green-700 mb-2 flex items-center gap-1">
                                                    <Package className="w-4 h-4" /> Products Sold
                                                </h4>
                                                {hasSold ? (
                                                    <table className="w-full text-xs text-left">
                                                        <thead>
                                                            <tr className="text-gray-500 dark:text-gray-400">
                                                                <th className="py-1 pr-2">Product</th>
                                                                <th className="py-1 pr-2 text-center">Qty</th>
                                                                <th className="py-1 text-right">Earned</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {user.sold.map((item, i) => (
                                                                <tr key={i} className="text-gray-700">
                                                                    <td className="py-1 pr-2 font-medium">{item.productName}</td>
                                                                    <td className="py-1 pr-2 text-center">{item.qty}</td>
                                                                    <td className="py-1 text-right text-green-700 font-semibold">₹{item.total.toLocaleString()}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td colSpan="2" className="pt-2 text-right font-bold text-gray-600 dark:text-gray-400">Total Earned:</td>
                                                                <td className="pt-2 text-right font-bold text-green-700">₹{user.totalEarned.toLocaleString()}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                ) : (
                                                    <p className="text-gray-400 italic text-xs">No sales yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetails;
