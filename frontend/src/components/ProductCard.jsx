import React from 'react';
import { ShieldCheck, TrendingUp, Star, ShoppingCart, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProductCard = ({ product, onEdit, onDelete }) => {
  if (!product) return null; // Safety check

  const { addToCart } = useCart();
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate();

  // Safely access seller info
  // If population failed, product.user might be an ID string, so we handle that.
  const seller = (typeof product.user === 'object' && product.user !== null) ? product.user : {};

  // Default to 50 if stats are missing
  const trustScore = seller?.sellerStats?.trustScore ?? 50;

  // Trust Badge Logic
  const getTrustBadge = (score) => {
    if (score >= 90) return { color: 'text-emerald-600', text: 'Highly Trusted' };
    if (score >= 70) return { color: 'text-yellow-600', text: 'Verified' };
    return { color: 'text-orange-600', text: 'New Seller' };
  };

  const badge = getTrustBadge(trustScore);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product page

    // ✅ CHECK: If user is NOT logged in, show toast & block action
    if (!user) {
      toast.error("Login Required", {
        description: "You must be logged in to add items to your cart.",
        action: {
          label: "Login Now",
          onClick: () => navigate('/login'),
        },
      });
      return;
    }

    // Process Add to Cart if logged in
    addToCart(product);
    toast(`${product.name} added to cart!`, {
      description: "Item has been successfully added.",
      action: {
        label: "View Cart",
        onClick: () => navigate('/cart'),
      },
    });
  };

  // Safe Math
  const currentPrice = Number(product.currentPrice) || 0;
  const basePrice = Number(product.basePrice) || 0;
  const discount = basePrice > currentPrice
    ? Math.round(((basePrice - currentPrice) / basePrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

      {/* 1. Image Section */}
      <Link to={`/product/${product._id}`} className="relative h-56 overflow-hidden bg-gray-100 block">
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.name || "Product Image"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300?text=No+Image"; }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="inline-flex items-center gap-1 bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
              <TrendingDown className="w-3 h-3" />
              {discount}% OFF
            </span>
          )}
          {currentPrice > basePrice && (
            <span className="inline-flex items-center gap-1 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
              <TrendingUp className="w-3 h-3" /> High Demand
            </span>
          )}
        </div>

        {/* Stock Badge */}
        {product.stock > 0 && product.stock < 10 && (
          <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-red-600 text-[10px] font-bold px-2 py-1 rounded border border-red-100 shadow-sm">
            Only {product.stock} left
          </span>
        )}
      </Link>

      {/* 2. Content Section */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Title */}
        <div className="mb-2">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-yellow-600 transition-colors">
              {product.name || "Untitled Product"}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
            <span className="text-xs font-bold text-gray-700">{product.rating || 0}</span>
            <span className="text-xs text-gray-400">({product.numReviews || 0} reviews)</span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-slate-900">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {basePrice > currentPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{basePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Seller Trust */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className={`w-3.5 h-3.5 ${badge.color}`} />
              <span className={`text-xs font-bold ${badge.color}`}>{badge.text}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              {trustScore}% Trust
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!onEdit && !onDelete ? (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg'
                  }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            ) : (
              <>
                {onEdit && (
                  <button
                    onClick={(e) => { e.preventDefault(); onEdit(product); }}
                    className="flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white shadow-md transition-all active:scale-95"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => { e.preventDefault(); onDelete(product._id); }}
                    className="flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white shadow-md transition-all active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;