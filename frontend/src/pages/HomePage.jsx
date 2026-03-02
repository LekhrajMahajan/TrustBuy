import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

const BASE = import.meta.env.BASE_URL; // '/' locally, '/TrustBuy/' on GitHub Pages

const categoryImages = {
    'Bags': "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    'Shoes': "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    'Electronics': "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    'Watches': "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    'Denim': "https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    'Jackets': "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
};

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        // Stop showing the spinner after 5 s even if the API is still pending
        const timeout = setTimeout(() => {
            if (!cancelled) setLoading(false);
        }, 5000);

        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                if (!cancelled) setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
                clearTimeout(timeout);
            }
        };

        fetchProducts();

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, []);

    const trending = products.slice(0, 4);
    const newArrivals = products.slice(4, 8);


    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">

            {/* 1. New Hero Section (GroVest Inspired) */}
            <section className="relative w-full overflow-hidden bg-white dark:bg-gray-900 pt-14 pb-12 md:pt-16 md:pb-20">
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-[100%] md:w-[60%] lg:w-[50%] h-[120%] bg-gradient-to-bl from-[#fff4cc] to-[#ffea99] dark:from-[#fdc600]/20 dark:to-yellow-700/20 opacity-50 md:rounded-l-[150px] z-0 transform translate-x-1/4 -translate-y-10"></div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Left Content */}
                    <div className="max-w-2xl pt-4">
                        <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] text-[#141312] dark:text-white leading-[1.05] tracking-tight mb-6 mt-4 font-sans font-black">
                            Best deal for <br className="hidden md:block" /> your shopping
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300 text-lg md:text-[1.1rem] mb-10 max-w-[400px] leading-relaxed font-medium">
                            Get promos and special offers just by shopping here.<br />
                            Available for delivery 24 hours!
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mb-12">
                            <Link to="/shop" className="bg-[#fdc600] hover:bg-[#eab300] text-gray-900 px-10 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg text-lg tracking-wide">
                                Shop Now
                            </Link>
                            <Link to="/about" className="text-gray-900 dark:text-gray-300 font-bold text-lg hover:text-[#fdc600] dark:hover:text-[#fdc600] transition-colors tracking-wide">
                                Learn More
                            </Link>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-4 max-w-lg">
                            <div className="flex items-center gap-2.5 bg-white/80 hover:bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-full shadow-sm transition-colors cursor-pointer text-sm font-bold text-gray-800 dark:text-gray-200">
                                👜 <span>Premium Bags</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-white/80 hover:bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-full shadow-sm transition-colors cursor-pointer text-sm font-bold text-gray-800 dark:text-gray-200">
                                👕 <span>Fashion Apparel</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-white/80 hover:bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-full shadow-sm transition-colors cursor-pointer text-sm font-bold text-gray-800 dark:text-gray-200">
                                📱 <span>Smart Electronics</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-white/80 hover:bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-full shadow-sm transition-colors cursor-pointer text-sm font-bold text-gray-800 dark:text-gray-200">
                                ⌚ <span>Watches & Shoes</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Hero Image with Floating Elements */}
                    <div className="relative flex justify-center mt-6 lg:mt-0 lg:ml-auto w-full lg:w-[95%] xl:w-[90%]">
                        {/* The underlying organic blobs */}
                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                            <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-[#fef08a] dark:bg-[#fdc600]/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[60px] opacity-70 mt-10"></div>
                            <div className="absolute w-[250px] h-[250px] md:w-[320px] md:h-[320px] bg-[#fde047] dark:bg-yellow-600/20 rounded-[100px] mix-blend-multiply dark:mix-blend-lighten filter blur-[50px] opacity-60 bottom-10 -right-4"></div>
                        </div>

                        {/* Main Image */}
                        <div className="relative z-10 w-full max-w-[420px] lg:max-w-full lg:h-[600px] flex items-end justify-center rounded-[3rem] overflow-visible">
                            <img
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800&h=1000"
                                alt="Shopping Happy"
                                className="w-[90%] h-auto md:w-full md:h-full object-cover object-top rounded-[2rem] drop-shadow-2xl"
                            />

                            {/* Floating Review Card */}
                            <div className="absolute -bottom-6 md:bottom-10 lg:bottom-12 -right-4 md:-right-8 bg-white dark:bg-gray-800/95 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 flex items-center gap-3 md:gap-4 md:min-w-[220px]">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm" />
                                <div>
                                    <h4 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white line-clamp-1">Sarah Jenkins</h4>
                                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Happy Shopper</p>
                                    <div className="flex text-[#fdc600] text-[10px] md:text-sm mt-0.5 tracking-tighter">
                                        ★★★★★
                                    </div>
                                </div>
                            </div>

                            {/* Floating Cart Badge */}
                            <div className="absolute top-12 md:top-20 -right-2 md:-right-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 z-20">
                                <div className="w-8 h-8 md:w-10 md:h-10 text-[#fdc600] flex items-center justify-center">
                                    <ShoppingCart size={32} strokeWidth={2.5} />
                                </div>
                            </div>

                            {/* Floating Faces Badge */}
                            <div className="absolute top-1/2 -translate-y-4 md:-translate-y-12 -left-6 md:-left-16 bg-white dark:bg-gray-800/95 p-1.5 md:p-2 pr-3 md:pr-4 rounded-full shadow-xl border border-white/50 dark:border-gray-700 z-20 flex items-center gap-2 md:gap-3">
                                <div className="flex -space-x-2.5 md:-space-x-3">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop" className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white dark:border-gray-800" alt="User" />
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop" className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white dark:border-gray-800" alt="User" />
                                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop" className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white dark:border-gray-800" alt="User" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Marquee / Categories */}
            <div className="border-b border-gray-100 dark:border-gray-800 py-8 md:py-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-8 md:gap-12 overflow-x-auto pb-4 no-scrollbar items-center justify-start md:justify-center">
                        {['Bags', 'Shoes', 'Electronics', 'Watches', 'Denim', 'Jackets'].map((cat) => (
                            <Link to={`/shop?category=${cat.toLowerCase()}`} key={cat} className="shrink-0 group flex flex-col items-center gap-2 md:gap-3">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden border-2 border-transparent group-hover:border-[#fdc600] transition-all relative">
                                    <img
                                        src={categoryImages[cat] || `https://source.unsplash.com/random/200x200/?${cat}`}
                                        alt={cat}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                                    />
                                </div>
                                <span className="text-xs md:text-sm font-bold uppercase tracking-wide group-hover:text-[#fdc600] transition-colors">{cat}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Trending Grid */}
            <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="flex justify-between items-end mb-8 md:mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Trending Now</h2>
                    <Link to="/shop?sort=trending" className="text-xs md:text-sm font-bold border-b border-black dark:border-white pb-0.5 hover:text-[#fdc600] hover:border-[#fdc600] transition-colors">View All</Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-sm flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ))
                    ) : (
                        trending.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </div>
            </section>

            {/* 4. Large Banner */}
            <section className="py-12 md:py-20 bg-gray-900 text-white dark:text-white">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-4 md:space-y-6 order-2 md:order-1 text-center md:text-left">
                        <span className="text-[#fdc600] font-bold tracking-widest uppercase text-xs">Limited Edition</span>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight">Obsessive Attention. <br />Intelligent Effort.</h2>
                        <p className="text-gray-400 max-w-md mx-auto md:mx-0 text-sm md:text-base">
                            Functional handbags and electronics made of luxurious materials to improve people's lives in small but mighty ways.
                        </p>
                        <Link to="/shop" className="inline-flex items-center gap-2 text-white dark:text-white font-bold underline underline-offset-8 hover:text-[#fdc600] transition-colors mt-4">
                            Shop The Drop <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden order-1 md:order-2">
                        <img
                            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=60&fm=webp&auto=compress&fit=crop"
                            alt="Banner"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            {/* 5. New Arrivals */}
            <section className="max-w-7xl mx-auto px-4 py-12 md:py-20 pb-24 md:pb-32">
                <div className="flex justify-between items-end mb-8 md:mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">New Arrivals</h2>
                    <Link to="/shop?sort=newest" className="text-xs md:text-sm font-bold border-b border-black dark:border-white pb-0.5 hover:text-[#fdc600] hover:border-[#fdc600] transition-colors">View All</Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-sm flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ))
                    ) : (
                        newArrivals.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};
export default HomePage;
