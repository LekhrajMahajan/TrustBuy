import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import ErrorBoundary from '../components/ErrorBoundary';
import { Plus, X, Package, Loader2 } from 'lucide-react';

const SellerDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInputType, setImageInputType] = useState('url');

  const [editingId, setEditingId] = useState(null);
  const [productData, setProductData] = useState({
    name: '', category: 'Electronics', basePrice: '', description: '', stock: '', image: ''
  });

  const fetchMyProducts = async () => {
    try {
      const data = await productService.getMyProducts();
      console.log("Seller Products Fetched:", data);
      if (Array.isArray(data)) {
        setMyProducts(data);
        if (data.length === 0) setShowForm(true);
      } else {
        console.error("Seller API returned invalid data:", data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyProducts(); }, []);

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
        toast.success("Product Updated Successfully!");
      } else {
        await productService.createProduct(payload);
        toast.success("Product Listed Successfully!");
      }

      setProductData({ name: '', category: 'Electronics', basePrice: '', description: '', stock: '', image: '' });
      setEditingId(null);
      setShowForm(false);
      fetchMyProducts();
    } catch (error) {
      console.error(error);
      toast.error(editingId ? "Failed to update product." : "Failed to list product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = (id) => {
    toast("Delete Product?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await productService.deleteProduct(id);
            toast.success("Product Deleted Successfully");
            fetchMyProducts();
          } catch (error) {
            console.error(error);
            toast.error("Failed to delete product");
          }
        }
      },
      cancel: {
        label: "Cancel",
        onClick: () => { }
      }
    });
  };

  const handleEditProduct = (product) => {
    setProductData({
      name: product.name,
      category: product.category,
      basePrice: product.basePrice,
      description: product.description,
      stock: product.stock,
      image: product.image
    });
    setEditingId(product._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputStyle = "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 transition-all";
  const labelStyle = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div><h1 className="text-3xl font-bold text-slate-900">Seller Dashboard</h1><p className="text-gray-500 mt-2">Manage your inventory and list new items.</p></div>
          <button onClick={() => {
            if (showForm) {
              setProductData({ name: '', category: 'Electronics', basePrice: '', description: '', stock: '', image: '' });
              setEditingId(null);
            }
            setShowForm(!showForm);
          }} className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium text-white transition-all shadow-sm ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}>{showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> List Product</>}</button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 w-full rounded-lg border border-gray-200 bg-white shadow-sm mb-12 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{editingId ? 'Edit Product' : 'Product Details'}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div><label className={labelStyle}>Product Name *</label><input type="text" required className={inputStyle} value={productData.name} onChange={e => setProductData({ ...productData, name: e.target.value })} /></div>
                <div><label className={labelStyle}>Category *</label><select className={inputStyle} value={productData.category} onChange={e => setProductData({ ...productData, category: e.target.value })}><option>Electronics</option><option>Fashion</option><option>Home</option><option>Beauty</option><option>Sports</option></select></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelStyle}>Price (₹) *</label><input type="number" required className={inputStyle} value={productData.basePrice} onChange={e => setProductData({ ...productData, basePrice: e.target.value })} /></div>
                  <div><label className={labelStyle}>Stock *</label><input type="number" required className={inputStyle} value={productData.stock} onChange={e => setProductData({ ...productData, stock: e.target.value })} /></div>
                </div>
              </div>
              <div className="space-y-4">
                <div><label className={labelStyle}>Image Source</label><div className="flex gap-4 mb-2"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={imageInputType === 'url'} onChange={() => setImageInputType('url')} /><span className="text-sm">URL</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={imageInputType === 'file'} onChange={() => setImageInputType('file')} /><span className="text-sm">Upload</span></label></div>
                  {imageInputType === 'url' ? <input type="url" className={inputStyle} placeholder="Image URL..." value={productData.image} onChange={e => setProductData({ ...productData, image: e.target.value })} /> : <input type="file" className={inputStyle} accept="image/*" onChange={handleImageUpload} />}</div>
                <div><label className={labelStyle}>Description</label><textarea rows="3" required className={inputStyle} value={productData.description} onChange={e => setProductData({ ...productData, description: e.target.value })}></textarea></div>
              </div>
            </div>
            <div className="flex justify-end mt-6"><button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-white px-8 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50">{isSubmitting ? (editingId ? "Updating..." : "Publishing...") : (editingId ? "Update Product" : "Publish Product")}</button></div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-slate-300 animate-spin" /></div>
        ) : myProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-lg border border-gray-200 border-dashed">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Package className="w-8 h-8 text-gray-400" /></div>
            <h3 className="text-lg font-bold text-gray-900">No products listed yet</h3>
            <p className="text-gray-500 mt-1 text-sm">Use the form above to add your first product.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;