import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { productService, userService } from '../services/api';
import ProductCard from '../components/ProductCard';
import ErrorBoundary from '../components/ErrorBoundary';
import { Plus, X, Package, Loader2, Image as ImageIcon, AlertTriangle, Ban, Building2, Ticket, MapPin, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SellerDashboard = () => {
  const { user } = useAuth();

  // Safe access to data
  const sellerStatus = user?.sellerStats?.status || 'pending';
  const hasApplied = user?.sellerStats?.businessName; // If businessName exists, they have applied

  // State
  const [showForm, setShowForm] = useState(false); // Controls "Add Product" form
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInputType, setImageInputType] = useState('url');

  const [editingId, setEditingId] = useState(null);
  const [productData, setProductData] = useState({
    name: '', category: 'Mobile', basePrice: '', description: '', stock: '', image: ''
  });

  // Seller Application State
  const [applicationData, setApplicationData] = useState({
    businessName: '', gstin: '', pickupAddress: ''
  });

  const fetchMyProducts = async () => {
    try {
      const data = await productService.getMyProducts();
      if (Array.isArray(data)) {
        setMyProducts(data);
        if (data.length === 0) setShowForm(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerStatus === 'active') {
      fetchMyProducts();
    } else {
      setLoading(false);
    }
  }, [sellerStatus]);

  // New Effect: Poll/Check status on mount if pending
  const { checkUserStatus } = useAuth();
  useEffect(() => {
    if (sellerStatus === 'pending' && hasApplied) {
      checkUserStatus();
    }
  }, [sellerStatus, hasApplied, checkUserStatus]);

  const handleApply = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await userService.registerSeller(applicationData);

      // Update Local Storage immediately so reload picks it up
      const currentUser = JSON.parse(localStorage.getItem('userInfo'));
      if (currentUser) {
        currentUser.sellerStats = data.sellerStats;
        localStorage.setItem('userInfo', JSON.stringify(currentUser));
      }

      toast.success("Application Submitted successfully!");
      // Force reload to update user context
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error(error);
      toast.error("Application Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProductData({ ...productData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...productData, image: productData.image || 'https://via.placeholder.com/300', currentPrice: productData.basePrice };
      if (editingId) {
        await productService.updateProduct(editingId, payload);
        toast.success("Product Updated");
      } else {
        await productService.createProduct(payload);
        toast.success("Product Listed");
      }
      setProductData({ name: '', category: 'Mobile', basePrice: '', description: '', stock: '', image: '' });
      setEditingId(null);
      setShowForm(false);
      fetchMyProducts();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = (id) => {
    toast("Delete Product?", {
      action: {
        label: "Delete",
        onClick: async () => {
          await productService.deleteProduct(id);
          toast.success("Deleted");
          fetchMyProducts();
        }
      }
    });
  };

  const handleEditProduct = (product) => {
    setProductData({ ...product, image: product.image });
    setEditingId(product._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Minimalist Input Style
  const inputClass = "w-full border-b border-gray-200 dark:border-gray-700 py-3 text-sm focus:border-black dark:border-white focus:outline-none bg-transparent placeholder:text-gray-400";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-black dark:text-white tracking-tight uppercase">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your collection and inventory.</p>
          </div>

          {sellerStatus === 'active' ? (
            <button
              onClick={() => {
                if (showForm) { setProductData({ name: '', category: 'Mobile', basePrice: '', description: '', stock: '', image: '' }); setEditingId(null); }
                setShowForm(!showForm);
              }}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${showForm ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300' : 'bg-black dark:bg-gray-800 text-white dark:text-white hover:bg-gray-800'}`}
            >
              {showForm ? 'Cancel' : '+ Add Product'}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed">
              {sellerStatus === 'suspended' ? <Ban className="w-4 h-4" /> : <Loader2 className="w-4 h-4" />}
              {sellerStatus === 'suspended' ? 'Account Suspended' : 'Approval Pending'}
            </div>
          )}
        </div>

        {/* 1. SELLER APPLICATION FORM (If Pending & Not Applied) */}
        {sellerStatus === 'pending' && !hasApplied && (
          <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-950 p-8 rounded-xl border border-gray-100 dark:border-gray-800 mb-12 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Become a Seller</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">Complete your business profile to start selling on TrustBuy. Our team reviews all applications within 24 hours.</p>

            <form onSubmit={handleApply} className="text-left space-y-6">
              <div>
                <label className={labelClass}>Business Name</label>
                <input type="text" required className={inputClass} placeholder="e.g. Urban Threads Inc." value={applicationData.businessName} onChange={e => setApplicationData({ ...applicationData, businessName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>GSTIN / Tax ID</label>
                <input type="text" required className={inputClass} placeholder="e.g. 29ABCDE1234F1Z5" value={applicationData.gstin} onChange={e => setApplicationData({ ...applicationData, gstin: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Pickup Address</label>
                <textarea rows="3" required className={inputClass} placeholder="Warehouse address..." value={applicationData.pickupAddress} onChange={e => setApplicationData({ ...applicationData, pickupAddress: e.target.value })}></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-black dark:bg-gray-800 text-white dark:text-white py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors">
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {/* 2. PENDING REVIEW BANNER (If Pending & Applied) */}
        {sellerStatus === 'pending' && hasApplied && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 mb-12 rounded-r-lg text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-bold text-yellow-800 mb-2">Application Under Review</h3>
            <p className="text-yellow-700 max-w-xl mx-auto">
              We received your seller application. An administrator will verify your details ({user.sellerStats.businessName}) shortly. Once approved, you can start listing products immediately.
            </p>
          </div>
        )}

        {/* 3. SUSPENDED BANNER */}
        {sellerStatus === 'suspended' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Ban className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Account Suspended.</strong> Please contact support to resolve this issue.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. ACTIVE SELLER: Add Product FORM */}
        {sellerStatus === 'active' && (
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[1000px] opacity-100 mb-16' : 'max-h-0 opacity-0'}`}>
            <div className="bg-gray-50 dark:bg-gray-950 p-8 md:p-12 rounded-xl">
              <h2 className="text-2xl font-bold mb-8">{editingId ? 'Edit Item' : 'New Listing'}</h2>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div><label className={labelClass}>Product Name</label><input type="text" required className={inputClass} value={productData.name} onChange={e => setProductData({ ...productData, name: e.target.value })} placeholder="e.g. Leather Crossbody Bag" /></div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <select className={inputClass} value={productData.category} onChange={e => setProductData({ ...productData, category: e.target.value })}>
                      <option>Mobile</option>
                      <option>Laptops</option>
                      <option>Audio</option>
                      <option>Bags</option>
                      <option>Shoes</option>
                      <option>Watches</option>
                      <option>Denim</option>
                      <option>Jackets</option>
                      <option>Men's Wear</option>
                      <option>Women's Wear</option>
                      <option>Accessories</option>
                      <option>Electronics</option>
                      <option>Fashion</option>
                      <option>Home</option>
                      <option>Beauty</option>
                      <option>Sports</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className={labelClass}>Price (₹)</label><input type="number" required className={inputClass} value={productData.basePrice} onChange={e => setProductData({ ...productData, basePrice: e.target.value })} /></div>
                    <div><label className={labelClass}>Stock Qty</label><input type="number" required className={inputClass} value={productData.stock} onChange={e => setProductData({ ...productData, stock: e.target.value })} /></div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Image</label>
                    <div className="flex gap-2 mt-2 mb-2">
                      <button type="button" onClick={() => setImageInputType('url')} className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded transition-colors ${imageInputType === 'url' ? 'bg-black dark:bg-gray-800 text-white dark:text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300'}`}>URL</button>
                      <button type="button" onClick={() => setImageInputType('file')} className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded transition-colors ${imageInputType === 'file' ? 'bg-black dark:bg-gray-800 text-white dark:text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300'}`}>Upload</button>
                    </div>
                    {imageInputType === 'url' ? (
                      <input type="url" className={inputClass} placeholder="https://..." value={productData.image} onChange={e => setProductData({ ...productData, image: e.target.value })} />
                    ) : (
                      <input type="file" className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:bg-black dark:bg-gray-800 file:text-white dark:text-white hover:file:bg-[#fdc600] hover:file:text-black transition-all cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                    )}
                  </div>
                  <div><label className={labelClass}>Description</label><textarea rows="3" required className={inputClass} value={productData.description} onChange={e => setProductData({ ...productData, description: e.target.value })} placeholder="Product details..."></textarea></div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="bg-[#fdc600] text-black dark:text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-yellow-500 transition-colors shadow-lg">
                      {isSubmitting ? 'Processing...' : (editingId ? 'Save Changes' : 'Publish Listing')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : (sellerStatus === 'active' && myProducts.length === 0) ? (
          <div className="text-center py-32 bg-gray-50 dark:bg-gray-950 rounded-lg">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your collection is empty.</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Start selling by adding your first product.</p>
          </div>
        ) : (sellerStatus === 'active' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {myProducts.map(product => (
              <ErrorBoundary key={product._id}>
                <ProductCard
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </ErrorBoundary>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;