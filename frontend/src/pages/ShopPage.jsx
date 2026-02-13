import React, { useEffect, useState } from 'react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Zap, TrendingUp, ShieldCheck, ChevronDown, SlidersHorizontal, Check } from 'lucide-react';

// ✅ Shadcn-style Slider Component (Custom Implementation using Tailwind)
const ShadcnSlider = ({ value, min, max, onChange, step = 1 }) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="relative flex w-full touch-none select-none items-center h-6 cursor-pointer group">
      {/* Track */}
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100">
        <div
          className="absolute h-full bg-[#fdc600] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Visual Thumb */}
      <div
        className="absolute h-5 w-5 rounded-full border-2 border-[#fdc600] bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md group-hover:scale-110"
        style={{ left: `calc(${percentage}% - 10px)` }}
      />

      {/* Invisible Input for Interaction */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
    </div>
  );
};

const ShopPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false); // ✅ Added for Custom Dropdown
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const searchCategory = searchParams.get('category') || 'all'; // ✅ Support Category Param

  // Filter States
  const [sortOption, setSortOption] = useState('trending');
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    trustScore: 'all',
    rating: 0,
    availability: 'all',
    category: searchCategory, // ✅ Init with URL param
    trustBuyExtra: []
  });

  // Infinite Scroll States
  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);

  // Reset Page on Filter Change
  useEffect(() => {
    setPage(1);
  }, [displayedProducts]);

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
        if (displayedProducts.length > page * ITEMS_PER_PAGE) {
          setPage(prev => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, displayedProducts]);

  const categories = ['all', ...new Set(allProducts.map(p => p.category))];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setAllProducts(data);

        // ✅ Apply Initial Filters (Search + Category)
        let filtered = data;

        if (searchQuery) {
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (searchCategory && searchCategory !== 'all') {
          filtered = filtered.filter(p => p.category.toLowerCase() === searchCategory.toLowerCase());
          // Update local state too
          setFilters(prev => ({ ...prev, category: searchCategory }));
        }

        setDisplayedProducts(filtered);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchQuery, searchCategory]); // ✅ Re-run on URL change

  // Filter Logic
  // Filter Logic
  const applyFilters = (latestSortOption = sortOption) => {
    let result = [...allProducts];

    // 1. Filter by Category
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // 2. Filter by Price Range
    result = result.filter(p => {
      const price = p.currentPrice !== undefined ? p.currentPrice : (p.basePrice || 0);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // 3. Filter by Trust Score
    if (filters.trustScore !== 'all') {
      result = result.filter(p => {
        const score = p.user?.sellerStats?.trustScore || 50;
        if (filters.trustScore === '90-100') return score >= 90;
        if (filters.trustScore === '70-89') return score >= 70 && score < 90;
        if (filters.trustScore === 'below-70') return score < 70;
        return true;
      });
    }

    // 4. Other Filters
    if (filters.rating > 0) result = result.filter(p => (p.rating || 0) >= filters.rating);
    if (filters.availability === 'in-stock') result = result.filter(p => p.stock > 0);

    // 5. Sorting Logic
    const sortKey = latestSortOption;
    if (sortKey === 'price-low-high') {
      result.sort((a, b) => (a.currentPrice || 0) - (b.currentPrice || 0));
    } else if (sortKey === 'price-high-low') {
      result.sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0));
    } else if (sortKey === 'trust-score') {
      result.sort((a, b) => (b.user?.sellerStats?.trustScore || 0) - (a.user?.sellerStats?.trustScore || 0));
    } else if (sortKey === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Trending / Default
      result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }

    setDisplayedProducts(result);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
            <p className="text-gray-500 mt-2 text-sm">
              {searchQuery ? `Search results for "${searchQuery}"` : `Discover ${displayedProducts.length} premium products with dynamic pricing.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* ✅ Custom Dropdown for Full Customization */}
            <div className="relative hidden md:block z-20">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#fdc600] transition-colors focus:ring-2 focus:ring-[#fdc600]"
              >
                <span className="text-gray-400">Sort by:</span>
                <span className="font-semibold text-slate-900">
                  {sortOption === 'trending' && 'Trending'}
                  {sortOption === 'price-low-high' && 'Price: Low to High'}
                  {sortOption === 'price-high-low' && 'Price: High to Low'}
                  {sortOption === 'trust-score' && 'Seller Trust'}
                  {sortOption === 'newest' && 'Newest Arrivals'}
                </span>
                <ChevronDown className={`w-4 h-4 ml-1 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  {[
                    { val: 'trending', label: 'Trending' },
                    { val: 'price-low-high', label: 'Price: Low to High' },
                    { val: 'price-high-low', label: 'Price: High to Low' },
                    { val: 'trust-score', label: 'Seller Trust' },
                    { val: 'newest', label: 'Newest Arrivals' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setSortOption(opt.val);
                        applyFilters(opt.val); // Apply sort immediately
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between group ${sortOption === opt.val
                        ? 'bg-[#fdc600] text-black'
                        : 'text-gray-700 hover:bg-[#fdc600] hover:text-black'
                        }`}
                    >
                      {opt.label}
                      {sortOption === opt.val && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#fdc600] text-black rounded-lg shadow-sm font-semibold hover:bg-[#e5b300] transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading live prices...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No products found matching "${searchQuery}". Try a different term.`
                : 'Try adjusting your filters or price range to see more results.'}
            </p>
            <button onClick={() => {
              setFilters({ priceRange: [0, 100000], trustScore: 'all', rating: 0, availability: 'all', category: 'all', trustBuyExtra: [] });
              setSortOption('trending');
              setDisplayedProducts(allProducts);
            }} className="mt-6 text-[#fdc600] font-bold hover:underline">Clear all filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.slice(0, page * ITEMS_PER_PAGE).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Loading Indicator for Infinite Scroll */}
            {displayedProducts.length > page * ITEMS_PER_PAGE && (
              <div className="py-12 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-[#fdc600] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading More</span>
                </div>
              </div>
            )}

            {/* End of List Message */}
            {displayedProducts.length > 0 && displayedProducts.length <= page * ITEMS_PER_PAGE && (
              <div className="py-12 text-center">
                <p className="text-gray-400 text-sm">You've reached the end of the list.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Sidebar (Sheet Design) */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFilterOpen(false)}></div>

        <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto border-l border-gray-200">

          {/* Header */}
          <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center z-10">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <p className="text-xs text-gray-500">Refine your product search</p>
            </div>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-8">

            {/* Price Slider (Shadcn Style) */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Price Range</h3>
                <span className="text-xs font-mono font-bold text-black bg-[#fdc600]/20 px-2 py-1 rounded">
                  ₹0 - ₹{filters.priceRange[1].toLocaleString()}
                </span>
              </div>

              {/* ✅ USING CUSTOM SLIDER */}
              <div className="px-1">
                <ShadcnSlider
                  min={0}
                  max={200000}
                  step={1000}
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                />
              </div>

              <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
                <span>Min</span>
                <span>Max</span>
              </div>
            </section>

            {/* Separator */}
            <div className="h-px bg-gray-100 w-full"></div>

            {/* Trust Score */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Seller Trust</h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'All Sellers' },
                  { id: '90-100', label: 'Highly Trusted (90+)' },
                  { id: '70-89', label: 'Verified (70-89)' },
                  { id: 'below-70', label: 'New / Unverified' }
                ].map((opt) => (
                  <label key={opt.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${filters.trustScore === opt.id
                    ? 'border-[#fdc600] bg-[#fdc600]/10'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${filters.trustScore === opt.id ? 'border-[#fdc600] bg-[#fdc600]' : 'border-gray-300'
                      }`}>
                      {filters.trustScore === opt.id && <Check className="w-3 h-3 text-black" />}
                    </div>
                    <input type="radio" name="trust" className="hidden"
                      checked={filters.trustScore === opt.id}
                      onChange={() => setFilters({ ...filters, trustScore: opt.id })}
                    />
                  </label>
                ))}
              </div>
            </section>

            {/* Separator */}
            <div className="h-px bg-gray-100 w-full"></div>

            {/* Category */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize border transition-all ${filters.category === cat
                      ? 'bg-[#fdc600] text-black border-[#fdc600]'
                      : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 p-6 bg-white border-t border-gray-100 flex gap-4">
            <button
              onClick={() => {
                setFilters({ priceRange: [0, 100000], trustScore: 'all', rating: 0, availability: 'all', category: 'all', trustBuyExtra: [] });
                setSortOption('trending');
                setDisplayedProducts(allProducts);
              }}
              className="flex-1 py-3 text-slate-600 font-bold hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-sm"
            >
              Reset Filters
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 py-3 bg-[#fdc600] text-black rounded-lg font-bold hover:bg-[#e5b300] shadow-lg transition-all active:scale-95 text-sm"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;