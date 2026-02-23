import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { Star, ShoppingCart, Truck, ShieldCheck, User, ChevronDown, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await productService.createReview(id, { rating, comment });
      toast.success('Review Submitted Successfully!');
      setComment('');
      setRating(5);
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast(`${product.name} added to cart!`, {
      description: "Item has been successfully added.",
      action: {
        label: "View Cart",
        onClick: () => navigate('/cart'),
      },
    });
  };

  const handleBuyNow = () => {
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

  // --- REUSABLE STYLES (Shadcn Lookalike) ---
  const cardClass = "bg-white dark:bg-gray-900 rounded-xl border border-slate-200 shadow-sm overflow-hidden";
  const labelClass = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 mb-2 block";
  const inputClass = "flex h-10 w-full rounded-md border border-slate-200 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all";
  const buttonClass = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 w-full";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
    </div>
  );

  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Top Section: Product Details --- */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${cardClass} p-8 mb-12`}>

          {/* Left: Image */}
          <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-950 rounded-lg p-6 h-[300px] md:h-[400px] border border-slate-100">
            <img
              src={product.image || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-sm"
            />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-slate-500 text-sm font-medium">({product.numReviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-4xl font-bold text-slate-900">
                  ₹{product.currentPrice?.toLocaleString('en-IN')}
                </div>
                {product.basePrice > product.currentPrice && (
                  <div className="text-sm text-slate-500 line-through">
                    M.R.P: ₹{product.basePrice?.toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              <div className="prose prose-sm text-slate-600 leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                  <Truck className="w-5 h-5 text-slate-900" /> Delivery in 2-3 Days
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-slate-900" /> 1 Year Warranty
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 mt-4 border-t border-slate-100 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-md font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] ${product.stock > 0
                  ? 'bg-slate-900 text-white dark:text-white hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {product.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 rounded-md font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] bg-[#fdc600] text-black dark:text-black hover:bg-yellow-400"
                >
                  <Zap className="w-5 h-5 fill-black" />
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- Bottom Section: Reviews --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Reviews List */}
          <div className={`lg:col-span-2 ${cardClass} p-8 h-fit`}>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Customer Reviews</h2>

            {product.reviews.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <p>No reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold border border-slate-200">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block leading-tight">{review.name}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed ml-[52px]">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write Review Form (Updated Design) */}
          <div className="lg:col-span-1">
            <div className={`${cardClass} p-8 sticky top-24`}>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Write a Review</h3>
              <p className="text-sm text-slate-500 mb-6">Share your experience with this product.</p>

              {user ? (
                <form onSubmit={submitReviewHandler} className="space-y-5">

                  {/* Rating Select */}
                  <div>
                    <label className={labelClass}>Rating</label>
                    <div className="relative">
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Comment Textarea */}
                  <div>
                    <label className={labelClass}>Comment</label>
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like or dislike?"
                      className={`${inputClass} h-auto min-h-[100px]`}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" disabled={submitting} className={buttonClass}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 text-sm mb-4 font-medium">Please login to write a review.</p>
                  <Link to="/login" className={buttonClass}>
                    Login Now
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;