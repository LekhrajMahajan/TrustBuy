import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Zap, Lock, RotateCcw, DollarSign } from 'lucide-react';

const DynamicPricing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([
        { time: '10:00', price: 2000 },
        { time: '11:00', price: 2100 },
        { time: '12:00', price: 2050 },
        { time: '13:00', price: 2250 }
    ]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await adminService.getAdminProducts();
                // Initialize with some variation for demo if flat
                const variedData = data.map(p => ({
                    ...p,
                    currentPrice: p.currentPrice === p.basePrice ? p.basePrice + (Math.random() > 0.5 ? Math.floor(Math.random() * 50) : -Math.floor(Math.random() * 50)) : p.currentPrice
                }));
                setProducts(variedData);
            } catch (err) {
                console.error("Failed to load pricing data", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Live Simulation Effect
    useEffect(() => {
        const interval = setInterval(() => {
            // 1. Update Product Prices
            setProducts(prevProducts => prevProducts.map(p => {
                if (Math.random() > 0.7) { // 30% chance to update a product
                    const volatility = Math.floor(Math.random() * 20) - 10; // -10 to +10 change
                    const newPrice = Math.max(p.basePrice * 0.5, p.currentPrice + volatility);
                    return { ...p, currentPrice: newPrice };
                }
                return p;
            }));

            // 2. Update Chart Info (Mock 'Market Index' or a specific product)
            setChartData(prev => {
                const lastPrice = prev[prev.length - 1].price;
                const newPrice = lastPrice + (Math.floor(Math.random() * 40) - 20);
                const newTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
                const newData = [...prev, { time: newTime, price: newPrice }];
                if (newData.length > 10) newData.shift(); // Keep last 10 points
                return newData;
            });

        }, 2000); // 2 seconds tick

        return () => clearInterval(interval);
    }, []);

    // Calculate Gainers & Losers
    const priceChanges = products.map(p => {
        const change = ((p.currentPrice - p.basePrice) / p.basePrice) * 100;
        return { ...p, change: change };
    });

    const gainers = priceChanges.filter(p => p.change > 0).sort((a, b) => b.change - a.change).slice(0, 3);
    const losers = priceChanges.filter(p => p.change < 0).sort((a, b) => a.change - b.change).slice(0, 3);

    // Demand vs Stock Data
    const demandStockData = products.slice(0, 5).map(p => ({
        name: p.name.length > 10 ? p.name.substring(0, 10) + '...' : p.name,
        Stock: p.stock,
        Demand: p.sales
    }));

    if (loading) return <div className="p-10 text-center">Loading Pricing Engine...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                        <Zap className="text-yellow-500 fill-yellow-500" /> Dynamic Pricing Engine
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Real-time algorithmic pricing adjustments based on supply & demand.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div> Live System Active
                </div>
            </div>

            {/* 🔹 LIVE PRICING MONITOR PANEL */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Gainers */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-green-100 transition-all duration-300 hover:shadow-md">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                        <TrendingUp className="text-green-500" /> Price Surge (High Demand)
                    </h3>
                    <div className="space-y-4">
                        {gainers.length > 0 ? gainers.map(p => (
                            <div key={p._id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg transition-all duration-500">
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-gray-100">{p.name}</div>
                                    <div className="text-xs text-green-700">Base: ₹{p.basePrice} → <span className="font-bold">₹{p.currentPrice.toFixed(0)}</span></div>
                                </div>
                                <div className="text-lg font-bold text-green-600">+{p.change.toFixed(1)}%</div>
                            </div>
                        )) : <div className="text-sm text-gray-400 italic">No price surges detected.</div>}
                    </div>
                </div>

                {/* Losers */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-red-100 transition-all duration-300 hover:shadow-md">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                        <TrendingDown className="text-red-500" /> Price Drop (Low Demand)
                    </h3>
                    <div className="space-y-4">
                        {losers.length > 0 ? losers.map(p => (
                            <div key={p._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg transition-all duration-500">
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-gray-100">{p.name}</div>
                                    <div className="text-xs text-red-700">Base: ₹{p.basePrice} → <span className="font-bold">₹{p.currentPrice.toFixed(0)}</span></div>
                                </div>
                                <div className="text-lg font-bold text-red-500">{p.change.toFixed(1)}%</div>
                            </div>
                        )) : <div className="text-sm text-gray-400 italic">No price drops detected.</div>}
                    </div>
                </div>
            </div>

            {/* 🔹 PRICING FORMULA */}
            <div className="bg-gray-900 text-white dark:text-white p-8 rounded-xl shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white dark:bg-gray-900 opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-1000"></div>
                <h3 className="text-lg font-bold mb-6 font-mono border-b border-gray-700 pb-2 inline-block">Algorithm V1.0</h3>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xl md:text-3xl font-light font-mono">
                    <div className="bg-gray-800 px-6 py-4 rounded-lg border border-gray-700">Base Price</div>
                    <span className="text-yellow-500 font-bold">×</span>
                    <div className="bg-gray-800 px-6 py-4 rounded-lg border border-gray-700 relative">
                        Demand Factor
                        <span className="absolute -top-3 -right-3 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                        </span>
                    </div>
                    <span className="text-yellow-500 font-bold">×</span>
                    <div className="bg-gray-800 px-6 py-4 rounded-lg border border-gray-700">Stock Factor</div>
                    <span className="text-yellow-500 font-bold">=</span>
                    <div className="bg-yellow-500 text-black dark:text-white font-bold px-6 py-4 rounded-lg shadow-[0_0_20px_rgba(253,198,0,0.4)] transform hover:scale-105 transition-transform cursor-default">
                        Final Price
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* 🔹 PRICE CHANGE HISTORY CHART */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-6">Live Market Index</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#2563EB"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                    isAnimationActive={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 🔹 DEMAND vs STOCK CHART */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-6">Top Products: Demand vs Stock</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demandStockData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#4B5563', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Legend iconType="circle" />
                                <Bar dataKey="Demand" fill="#FCD34D" radius={[0, 4, 4, 0]} barSize={10} />
                                <Bar dataKey="Stock" fill="#1F2937" radius={[0, 4, 4, 0]} barSize={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 🔹 ADMIN OVERRIDE CONTROLS */}
            <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Safety Overrides
                </h3>
                <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:bg-gray-800 transition-colors hover:shadow-md">
                        <Lock className="w-4 h-4" /> Freeze All Prices
                    </button>
                    <button className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:bg-gray-800 transition-colors hover:shadow-md">
                        <RotateCcw className="w-4 h-4" /> Reset Baseline
                    </button>
                    <button className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:bg-gray-800 transition-colors hover:shadow-md">
                        <DollarSign className="w-4 h-4" /> Set Ceilings
                    </button>
                </div>
            </div>

        </div>
    );
};

export default DynamicPricing;
