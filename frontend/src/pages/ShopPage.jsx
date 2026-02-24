import React, { useEffect, useState } from 'react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { X, ChevronDown, SlidersHorizontal, Check } from 'lucide-react';

const ShopPage = ({ initialCategory, initialSort }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const searchCategory = initialCategory || searchParams.get('category') || 'all';

  const searchSort = initialSort || searchParams.get('sort') || 'trending';
  const [sortOption, setSortOption] = useState(searchSort);

  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    trustScore: 'all',
    rating: 0,
    availability: 'all',
    category: searchCategory,
  });

  // Infinite Scroll
  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [displayedProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
        if (displayedProducts.length > page * ITEMS_PER_PAGE) setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, displayedProducts]);

  const categories = ['all', 'Fashion', ...new Set(allProducts.map(p => p.category))];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setAllProducts(data);

        let result = data;

        // 1. Filter by Search Query
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          result = result.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
          );
        }

        // 2. Filter by Category (Case Insensitive)
        if (searchCategory && searchCategory !== 'all') {
          if (searchCategory.toLowerCase() === 'fashion') {
            result = result.filter(p => ['jackets', 'denim', "women's wear", 'shoes', 'bags'].includes(p.category.toLowerCase()));
          } else {
            result = result.filter(p => p.category.toLowerCase() === searchCategory.toLowerCase());
          }
          setFilters(prev => ({ ...prev, category: searchCategory }));
        }

        // 3. Apply Sorting
        const sortKey = searchSort;
        setSortOption(sortKey); // Sync state with URL

        if (sortKey === 'price-low-high') result.sort((a, b) => (a.currentPrice || 0) - (b.currentPrice || 0));
        else if (sortKey === 'price-high-low') result.sort((a, b) => (a.currentPrice || 0) - (b.currentPrice || 0)); // Fixed sorting logic (descending)
        else if (sortKey === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        else result.sort((a, b) => (b.sales || 0) - (a.sales || 0)); // Trending

        setDisplayedProducts(result);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    loadProducts();
  }, [searchQuery, searchCategory, searchSort]);

  const applyFilters = (latestSortOption = sortOption) => {
    let result = [...allProducts];

    // Case Insensitive Category Match
    if (filters.category !== 'all') {
      if (filters.category.toLowerCase() === 'fashion') {
        result = result.filter(p => ['jackets', 'denim', "women's wear", 'shoes', 'bags'].includes(p.category.toLowerCase()));
      } else {
        result = result.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
      }
    }

    result = result.filter(p => (p.currentPrice || p.basePrice) >= filters.priceRange[0] && (p.currentPrice || p.basePrice) <= filters.priceRange[1]);

    const sortKey = latestSortOption;
    if (sortKey === 'price-low-high') result.sort((a, b) => (a.currentPrice || 0) - (b.currentPrice || 0));
    else if (sortKey === 'price-high-low') result.sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0)); // Fixed sorting (descending)
    else if (sortKey === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else result.sort((a, b) => (b.sales || 0) - (a.sales || 0)); // Trending

    setDisplayedProducts(result);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. Header (Minimalist) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-black dark:border-white">
          <div>
            <h1 className="text-5xl font-extrabold uppercase tracking-tighter text-black dark:text-white">
              {searchCategory !== 'all' ? searchCategory : 'Collection'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
              {searchQuery ? `Results for "${searchQuery}"` : `Showing ${displayedProducts.length} curated items.`}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Text-Based Sort Trigger */}
            <div className="relative z-20">
              <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-1 text-sm font-bold uppercase tracking-widest hover:text-[#fdc600] transition-colors">
                Sort: <span className="border-b border-black dark:border-white pb-0.5">{sortOption.replace(/-/g, ' ')}</span> <ChevronDown className="w-3 h-3" />
              </button>

              {isSortOpen && (
                <div className="absolute left-0 md:left-auto md:right-0 mt-4 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  {['trending', 'price-low-high', 'price-high-low', 'newest'].map((opt) => (
                    <button key={opt} onClick={() => { setSortOption(opt); applyFilters(opt); setIsSortOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:bg-gray-950">
                      {opt.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-gray-800 text-white dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
              <SlidersHorizontal className="w-3 h-3" /> Filter
            </button>
          </div>
        </div>

        {/* 2. Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-sm flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 dark:bg-gray-950">
            <h3 className="text-2xl font-bold uppercase text-gray-400">No Matches Found</h3>
            <button onClick={() => { setFilters({ priceRange: [0, 100000], trustScore: 'all', rating: 0, availability: 'all', category: 'all' }); setSortOption('trending'); setDisplayedProducts(allProducts); }} className="mt-4 text-sm font-bold border-b border-black dark:border-white pb-1 hover:text-[#fdc600] hover:border-[#fdc600]">Reset Catalog</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {displayedProducts.slice(0, page * ITEMS_PER_PAGE).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {displayedProducts.length > page * ITEMS_PER_PAGE && <div className="py-12 flex justify-center text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">Loading More...</div>}
          </>
        )}
      </div>

      {/* 3. Filter Sidebar (Clean & Sharp) */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-500 ease-custom-ease ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-black dark:bg-gray-800/20 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
        <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl flex flex-col">

          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold uppercase tracking-tight">Refine</h2>
            <button onClick={() => setIsFilterOpen(false)}><X className="w-6 h-6 hover:rotate-90 transition-transform" /></button>
          </div>

          <div className="p-8 space-y-10 flex-1 overflow-y-auto">
            <section>
              <div className="flex justify-between mb-4"><h3 className="text-xs font-bold uppercase tracking-widest">Price Limit</h3><span className="text-xs font-mono">₹{filters.priceRange[1].toLocaleString()}</span></div>
              <input type="range" min={0} max={200000} step={1000} value={filters.priceRange[1]} onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })} className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black" />
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setFilters({ ...filters, category: cat })} className={`px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all ${filters.category?.toLowerCase() === cat?.toLowerCase() ? 'bg-black dark:bg-gray-800 text-white dark:text-white border-black dark:border-white' : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-black dark:border-white'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            <button onClick={applyFilters} className="w-full py-4 bg-black dark:bg-gray-800 text-white dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-[#fdc600] hover:text-black dark:hover:text-black transition-all">Apply Filters</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;