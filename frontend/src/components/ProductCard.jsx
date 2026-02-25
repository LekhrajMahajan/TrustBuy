import React, { useState } from 'react';
import { Star, ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getImageUrl, getBlurUrl } from '../utils/helpers';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  // Hooks must be called before any early returns (React Rules of Hooks)
  const [imgLoaded, setImgLoaded] = useState(false);

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

  const blurUrl = getBlurUrl(product.image);
  const fullUrl = getImageUrl(product.image);

  return (
    <div className="group relative flex flex-col w-full bg-transparent">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-sm mb-4">
        <Link to={`/product/${product._id}`} className="block h-full w-full">
          {/* Blur placeholder — shows instantly while full image loads */}
          {blurUrl && !imgLoaded && (
            <img
              src={blurUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
            />
          )}
          <img
            src={fullUrl}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${imgLoaded ? 'opacity-100 blur-0' : 'opacity-0'
              }`}
            loading="lazy"
            decoding="async"
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

        {/* Floating Action Buttons — ALWAYS VISIBLE on every device */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-3 sm:left-3 sm:right-3 md:bottom-3 md:left-3 md:right-3 lg:bottom-4 lg:left-4 lg:right-4 flex gap-1 sm:gap-1.5 md:gap-2">
          {!onEdit && !onDelete ? (
            <>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur text-black dark:text-white
                  h-7 text-[7px] gap-0.5
                  sm:h-8 sm:text-[9px] sm:gap-1
                  md:h-10 md:text-[10px] md:gap-1.5
                  lg:h-10 lg:text-[10px]
                  xl:h-11 xl:text-xs xl:gap-2
                  uppercase font-bold tracking-wide
                  hover:bg-black hover:dark:bg-gray-800 hover:text-white
                  transition-colors shadow-md flex items-center justify-center rounded-sm
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3 md:h-3 xl:w-3.5 xl:h-3.5 flex-shrink-0" />
                <span className="truncate">{product.stock === 0 ? 'Sold Out' : 'Add to Cart'}</span>
              </button>
              {product.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-black dark:bg-gray-900 border border-transparent dark:border-white/30 backdrop-blur text-white
                    h-7 text-[7px] gap-0.5
                    sm:h-8 sm:text-[9px] sm:gap-1
                    md:h-10 md:text-[10px] md:gap-1.5
                    lg:h-10 lg:text-[10px]
                    xl:h-11 xl:text-xs xl:gap-2
                    uppercase font-bold tracking-wide
                    hover:bg-[#fdc600] hover:text-black
                    transition-colors shadow-md flex items-center justify-center rounded-sm"
                >
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3 md:h-3 xl:w-3.5 xl:h-3.5 flex-shrink-0" />
                  <span className="truncate">Buy Now</span>
                </button>
              )}
            </>
          ) : (
            // Seller Edit/Delete Buttons
            <div className="flex w-full gap-1 sm:gap-1.5 md:gap-2">
              {onEdit && <button onClick={() => onEdit(product)} className="flex-1 bg-white/95 dark:bg-gray-900/95 text-black dark:text-white h-7 sm:h-8 md:h-10 xl:h-11 text-[8px] sm:text-[10px] md:text-xs font-bold hover:bg-black hover:dark:bg-gray-800 hover:text-white shadow-md backdrop-blur rounded-sm">Edit</button>}
              {onDelete && <button onClick={() => onDelete(product._id)} className="flex-1 bg-red-600 text-white h-7 sm:h-8 md:h-10 xl:h-11 text-[8px] sm:text-[10px] md:text-xs font-bold hover:bg-red-700 shadow-md backdrop-blur rounded-sm">Delete</button>}
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