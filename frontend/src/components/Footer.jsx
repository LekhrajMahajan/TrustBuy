import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* 1. Brand & About */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Logo" className="w-8 h-8 brightness-0 invert" />
                            <span className="text-2xl font-bold tracking-tight">Trust<span className="text-[#fdc600]">Buy</span></span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your trusted destination for premium products. We ensure quality, authenticity, and the best prices with our smart dynamic pricing engine.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#fdc600] hover:text-black transition-all"><Facebook className="w-4 h-4" /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#fdc600] hover:text-black transition-all"><Twitter className="w-4 h-4" /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#fdc600] hover:text-black transition-all"><Instagram className="w-4 h-4" /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#fdc600] hover:text-black transition-all"><Linkedin className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-[#fdc600]">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
                            <li><Link to="/cart" className="hover:text-white transition-colors">My Cart</Link></li>
                            <li><Link to="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
                            <li><Link to="/seller/dashboard" className="hover:text-white transition-colors">Become a Seller</Link></li>
                        </ul>
                    </div>

                    {/* 3. Customer Care */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-[#fdc600]">Customer Care</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* 4. Contact Us */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-[#fdc600]">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#fdc600] shrink-0" />
                                <span>123 Commerce Tower, Tech Park,<br />Bangalore, Karnataka 560001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[#fdc600] shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[#fdc600] shrink-0" />
                                <span>support@trustbuy.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} TrustBuy Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6 opacity-50 hover:opacity-100 transition" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-50 hover:opacity-100 transition" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
