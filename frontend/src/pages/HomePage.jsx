import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const heroImages = [
    {
        url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        title: "Define Your Style.",
        subtitle: "Shop The Collection"
    },
    {
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
        title: "Future Tech.",
        subtitle: "Upgrade Your Workflow"
    },
    {
        url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop",
        title: "Urban Living.",
        subtitle: "Essentials For You"
    },
    {
        url: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?q=80&w=2070&auto=format&fit=crop",
        title: "Refined Classics.",
        subtitle: "Discover Men's Wear"
    }
];

const categoryImages = {
    'Bags': "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    'Shoes': "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    'Electronics': "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80",
    'Watches': "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80",
    'Denim': "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&q=80",
    'Jackets': "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80"
};

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

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

    // Automatic Slider
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

    const trending = products.slice(0, 4);
    const newArrivals = products.slice(4, 8);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">

            {/* 1. Hero Section (Slider) */}
            <section className="relative h-[70vh] md:h-[85vh] w-full bg-[#f3f3f3] overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={heroImages[currentSlide].url}
                            alt="Hero"
                            className="w-full h-full object-cover opacity-90"
                            fetchPriority="high"
                        />
                        <div className="absolute inset-0 bg-black dark:bg-gray-800/20"></div>
                    </motion.div>
                </AnimatePresence>

                {/* Slider Controls */}
                <button onClick={prevSlide} className="absolute left-2 md:left-4 z-20 p-2 text-white dark:text-white hover:bg-white dark:bg-gray-900/20 rounded-full transition"><ChevronLeft className="w-6 h-6 md:w-8 md:h-8" /></button>
                <button onClick={nextSlide} className="absolute right-2 md:right-4 z-20 p-2 text-white dark:text-white hover:bg-white dark:bg-gray-900/20 rounded-full transition"><ChevronRight className="w-6 h-6 md:w-8 md:h-8" /></button>

                <div className="relative z-10 text-center text-white dark:text-white px-4 max-w-4xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6 text-shadow-lg leading-tight">
                                {heroImages[currentSlide].title}
                            </h1>
                            <Link to="/shop" className="inline-block bg-white dark:bg-gray-900 text-black dark:text-white px-6 py-3 md:px-10 md:py-4 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-[#fdc600] transition-colors shadow-xl">
                                {heroImages[currentSlide].subtitle}
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dots */}
                <div className="absolute bottom-6 md:bottom-8 flex gap-2 z-20">
                    {heroImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-[#fdc600] w-6' : 'bg-white dark:bg-gray-900/50 hover:bg-white dark:bg-gray-900'}`}
                        />
                    ))}
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
                            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop"
                            alt="Banner"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
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