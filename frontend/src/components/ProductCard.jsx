import React from 'react';
import { ShieldCheck, Star, ShoppingBag, Heart, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Login Required", {
        description: "You must be logged in to add items to your cart.",
        action: { label: "Login Now", onClick: () => navigate('/login') },
      });
      return;
    }
    addToCart(product);
    toast(`${product.name} added to cart!`, { description: "Item has been successfully added." });
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Login Required", {
        description: "You must be logged in to buy items.",
        action: { label: "Login Now", onClick: () => navigate('/login') },
      });
      return;
    }
    addToCart(product);
    navigate('/payment');
  };

  const currentPrice = Number(product.currentPrice) || 0;
  const basePrice = Number(product.basePrice) || 0;

  // Calculate discount percentage
  const discount = basePrice > currentPrice
    ? Math.round(((basePrice - currentPrice) / basePrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col w-full bg-transparent">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-sm mb-4">
        <Link to={`/product/${product._id}`} className="block h-full w-full">
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges (Minimalist) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-white dark:bg-gray-900/90 backdrop-blur px-2 py-1 text-[10px] uppercase font-bold tracking-widest text-red-600">
              -{discount}%
            </span>
          )}
          {product.stock > 0 && product.stock < 5 && (
            <span className="bg-white dark:bg-gray-900/90 backdrop-blur px-2 py-1 text-[10px] uppercase font-bold tracking-widest text-orange-600">
              Low Stock
            </span>
          )}

        </div>

        {/* Floating Action Buttons (Always visible on mobile, hover reveal on desktop) */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-4 sm:left-4 sm:right-4 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 ease-out flex gap-1 sm:gap-2">
          {!onEdit && !onDelete ? (
            <>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-white dark:bg-gray-900/95 sm:bg-white dark:bg-gray-900 backdrop-blur sm:backdrop-filter-none text-black dark:text-white h-8 sm:h-10 uppercase text-[8px] sm:text-[10px] font-bold tracking-tight sm:tracking-widest hover:bg-black dark:bg-gray-800 hover:text-white transition-colors shadow-sm sm:shadow-lg flex items-center justify-center gap-1 sm:gap-2"
              >
                <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="truncate">{product.stock === 0 ? 'Sold' : 'Add'}</span>
              </button>
              {product.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-black dark:bg-yellow border border-transparent dark:border-white backdrop-blur sm:backdrop-filter-none text-white dark:text-white h-8 sm:h-10 uppercase text-[8px] sm:text-[10px] font-bold tracking-tight sm:tracking-widest hover:bg-[#fdc600] hover:text-black dark:hover:text-black transition-colors shadow-sm sm:shadow-lg flex items-center justify-center gap-1 sm:gap-2"
                >
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="truncate">Buy Now</span>
                </button>
              )}
            </>
          ) : (
            // Seller Edit/Delete Buttons
            <div className="flex w-full gap-1 sm:gap-2">
              {onEdit && <button onClick={() => onEdit(product)} className="flex-1 bg-white dark:bg-gray-900/95 sm:bg-white dark:bg-gray-900 text-black dark:text-white h-8 sm:h-10 text-[9px] sm:text-xs font-bold hover:bg-black dark:bg-gray-800 hover:text-white shadow-sm sm:shadow-lg backdrop-blur">Edit</button>}
              {onDelete && <button onClick={() => onDelete(product._id)} className="flex-1 bg-red-600/95 sm:bg-red-600 text-white dark:text-white h-8 sm:h-10 text-[9px] sm:text-xs font-bold hover:bg-red-700 shadow-sm sm:shadow-lg backdrop-blur">Delete</button>}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:underline decoration-1 underline-offset-4 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {basePrice > currentPrice && (
              <span className="text-gray-400 line-through text-xs">
                ₹{basePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Rating Star */}
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-black text-black dark:text-white" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{product.rating || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;