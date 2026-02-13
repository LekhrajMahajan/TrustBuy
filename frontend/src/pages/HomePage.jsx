import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { ArrowRight, Sparkles, TrendingUp, Zap, Radio, Laptop, Smartphone, Watch, Shirt, ShoppingBag } from 'lucide-react';

// --- Components ---

// 1. Hero Section (Clean with Scroll Scale)
const HeroSection = ({ featuredProduct }) => {
    const { scrollYProgress } = useScroll();
    const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.2]); // Scale from 1 to 1.2 as user scrolls

    return (
        <div className="relative w-full h-[600px] bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden flex items-center justify-center px-4">
            {/* Background Effect */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10 relative">

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-white space-y-6 md:pr-12"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full border border-[#fdc600] text-[#fdc600] font-bold text-xs uppercase tracking-widest bg-[#fdc600]/10 backdrop-blur-sm">
                        #1 Best Seller
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                        Discover the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fdc600] to-yellow-200">Future.</span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-md">
                        The all-new {featuredProduct?.name || "Premium Collection"} represents the pinnacle of modern design and performance.
                    </p>
                    <div className="flex gap-4">
                        <Link to={featuredProduct ? `/product/${featuredProduct._id}` : "/shop"} className="inline-flex items-center gap-2 px-8 py-4 bg-[#fdc600] text-black font-bold rounded-full hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(253,198,0,0.4)] hover:shadow-[0_0_40px_rgba(253,198,0,0.6)] hover:scale-105 active:scale-95">
                            Buy Now <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20">
                            View All
                        </Link>
                    </div>
                </motion.div>

                {/* Card with Scroll-Driven Scale */}
                <div className="relative h-full flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative w-80 h-[450px] bg-[#1e293b] rounded-[2rem] shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col"
                    >
                        {/* 1. Best Seller Tag (Inside Top Left) */}
                        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-2 text-[#fdc600] text-xs font-bold shadow-sm z-20">
                            <Zap className="w-3 h-3 fill-current" /> Best Seller
                        </div>

                        {/* 2. Product Image */}
                        <div className="w-full h-1/2 flex items-center justify-center p-6 bg-gradient-to-b from-white/5 to-transparent">
                            <motion.img
                                src="https://pngimg.com/d/headphones_PNG101984.png"
                                alt="Sonic Pro X Headphones"
                                style={{ scale: scaleImage }}
                                className="w-full h-full object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        {/* 3. Card Content (Bottom Half) */}
                        <div className="flex-1 p-6 flex flex-col justify-end bg-gradient-to-t from-[#0f172a] to-transparent">
                            <h3 className="text-2xl font-bold text-white mb-2 leading-tight line-clamp-2">
                                {featuredProduct?.name || "Sonic Pro X Headphones"}
                            </h3>

                            <p className="text-[#fdc600] text-3xl font-bold mb-4">
                                ₹{featuredProduct?.price?.toLocaleString('en-IN') || "12,499"}
                            </p>

                            <div className="flex gap-2 mt-auto">
                                <span className="text-[10px] uppercase font-bold text-gray-400 bg-slate-900/50 px-2 py-1 rounded border border-slate-700">
                                    3D Audio
                                </span>
                                <span className="text-[10px] uppercase font-bold text-gray-400 bg-slate-900/50 px-2 py-1 rounded border border-slate-700">
                                    Wireless
                                </span>
                                <span className="text-[10px] uppercase font-bold text-gray-400 bg-slate-900/50 px-2 py-1 rounded border border-slate-700">
                                    Noise Cancellation
                                </span>
                            </div>
                        </div>

                    </motion.div>
                </div>

            </div>
        </div>
    );
};

// 2. Categories Row (Links to Filtered Shop)
const Categories = () => {
    const categories = [
        { name: 'Mobile', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
        { name: 'Fashion', icon: Shirt, color: 'bg-rose-100 text-rose-600' },
        { name: 'Electronics', icon: Laptop, color: 'bg-purple-100 text-purple-600' },
        { name: 'Home', icon: Radio, color: 'bg-orange-100 text-orange-600' },
        { name: 'Accessories', icon: Watch, color: 'bg-emerald-100 text-emerald-600' },
        { name: 'All', icon: ShoppingBag, color: 'bg-gray-100 text-gray-900', link: '/shop' },
    ];

    return (
        <div className="bg-white border-b border-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Shop by Category</h3>
                <div className="flex justify-between md:justify-around overflow-x-auto gap-8 no-scrollbar pb-4 md:pb-0">
                    {categories.map((cat, idx) => (
                        <Link
                            to={cat.link || `/shop?category=${cat.name.toLowerCase()}`}
                            key={idx}
                            className="flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer"
                        >
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-md ${cat.color}`}>
                                <cat.icon className="w-8 h-8" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-[#fdc600] transition-colors">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 3. Horizontal Product Section with Selection Support
const ProductSection = ({ title, products, icon: Icon }) => {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#fdc600] rounded-lg text-black shadow-lg shadow-yellow-500/20">
                        <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900">{title}</h2>
                </div>
                <Link to="/shop" className="text-sm font-bold text-[#fdc600] hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.slice(0, 4).map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
};

// --- Main Page ---
const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredProduct, setFeaturedProduct] = useState(null);

    // Global Scroll Progress
    const { scrollYProgress } = useScroll();

    // Parallax logic for Banner
    const bannerRef = useRef(null);
    const { scrollYProgress: bannerScroll } = useScroll({
        target: bannerRef,
        offset: ["start end", "end start"]
    });
    const yBanner = useTransform(bannerScroll, [0, 1], [-100, 100]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                setProducts(data);

                // Find best featured product (highest price or specific logic)
                if (data.length > 0) {
                    // Provide a "Hero" product
                    const hero = data.find(p => p.price > 20000) || data[0];
                    setFeaturedProduct(hero);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter Categories
    const electronics = products.filter(p => p.category === 'electronics' || p.category === 'mobile');
    const fashion = products.filter(p => p.category === 'clothing' || p.category === 'fashion');
    const trending = products.filter(p => p.sales > 50 || p.rating > 4.0);

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#fdc600] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white pt-16 flex flex-col relative">

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-[#fdc600] z-[100] origin-left"
                style={{ scaleX: scrollYProgress }}
            />

            {/* 1. Dynamic Hero */}
            <HeroSection featuredProduct={featuredProduct} />

            {/* 2. Interactive Categories */}
            <Categories />

            {/* 3. Product Shelves */}
            <div className="bg-gray-50/50">
                <ProductSection title="Suggested For You" products={trending} icon={Sparkles} />

                <div className="bg-white py-4 border-y border-gray-100 my-8">
                    <ProductSection title="Best Gadgets & Appliances" products={electronics} icon={Zap} />
                </div>

                <ProductSection title="Trending Fashion" products={fashion} icon={TrendingUp} />

                {/* Banner Strip */}
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="w-full h-64 bg-slate-900 rounded-3xl flex items-center justify-between px-12 relative overflow-hidden shadow-2xl group cursor-pointer hover:scale-[1.01] transition-all duration-500">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fdc600] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 group-hover:opacity-30 transition-opacity"></div>

                        <div className="z-10 text-white max-w-lg">
                            <div className="inline-block px-3 py-1 bg-white/10 rounded text-xs font-bold mb-4 border border-white/10">LIMITED OFFER</div>
                            <h2 className="text-4xl font-extrabold mb-4">Summer Sale is Live!</h2>
                            <p className="text-gray-300 mb-8 text-lg">Get up to <span className="text-[#fdc600] font-bold">50% OFF</span> on premium international brands. Limited time only.</p>
                            <Link to="/shop" className="bg-[#fdc600] text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition shadow-[0_0_20px_rgba(253,198,0,0.3)]">Explore Sale</Link>
                        </div>

                        {/* 3D Effect Image */}
                        <motion.img
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            src="https://pngimg.com/d/running_shoes_PNG5816.png"
                            className="hidden lg:block w-96 h-auto -rotate-12 drop-shadow-2xl z-10 group-hover:-rotate-6 transition-transform duration-700"
                        />
                    </div>
                </div>
            </div>

            {/* 4. Footer */}
            <Footer />

        </div>
    );
};

export default HomePage;
