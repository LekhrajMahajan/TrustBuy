import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User, LogOut, Package, ChevronDown, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-2' : 'bg-white dark:bg-gray-950 border-b border-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-1">
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center gap-2">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="TrustBuy Logo"
                className="h-14 md:h-20 lg:h-24 w-auto object-contain transform scale-[1.3] md:scale-150 origin-left"
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-[#fdc600] transition-colors">Home</Link>

            {/* The Mega Menu / Dropdown */}
            <div className="group relative">
              <Link to="/shop" className="flex items-center gap-1 text-sm font-medium hover:text-[#fdc600] transition-colors py-4">
                Shop <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-6 grid grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Electronics</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li><Link to="/shop/phones" className="hover:text-black dark:text-white hover:underline">Phones</Link></li>
                    <li><Link to="/shop/laptops" className="hover:text-black dark:text-white hover:underline">Laptops</Link></li>
                    <li><Link to="/shop/audio" className="hover:text-black dark:text-white hover:underline">Audio</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Fashion</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li><Link to="/shop/mens-wear" className="hover:text-black dark:text-white hover:underline">Men's Wear</Link></li>
                    <li><Link to="/shop/womens-wear" className="hover:text-black dark:text-white hover:underline">Women's Wear</Link></li>
                    <li><Link to="/shop/accessories" className="hover:text-black dark:text-white hover:underline">Accessories</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Featured</h4>
                  <Link to="/shop/new-arrivals" className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition text-center">
                    <span className="font-bold text-sm dark:text-white">New Arrivals</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check out the latest drops</p>
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/shop?sort=trending" className="text-sm font-medium hover:text-[#fdc600] transition-colors">Trending</Link>
            {user && <Link to="/seller/dashboard" className="text-sm font-medium hover:text-[#fdc600] transition-colors">Sell</Link>}
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1 bg-white dark:bg-gray-800 shadow-sm absolute left-0 right-0 top-14 mx-4 md:static md:mx-0 md:w-auto h-10 md:h-auto z-50 animate-in fade-in slide-in-from-top-2 md:slide-in-from-right-4 duration-200">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm w-full md:w-48 placeholder:text-gray-400 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="ml-1 p-1">
                  <Search className="w-4 h-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors" />
                </button>
                <button type="button" onClick={() => setShowSearch(false)} className="ml-2 p-1">
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </form>
            ) : (
              <button onClick={() => setShowSearch(true)} className="text-black dark:text-white hover:text-[#fdc600] transition-colors p-1">
                <Search className="w-5 h-5" />
              </button>
            )}
            <button onClick={toggleTheme} className="text-black dark:text-white hover:text-[#fdc600] transition-colors p-1" title="Toggle Theme">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/cart" className="relative text-black dark:text-white hover:text-[#fdc600] transition-colors p-1">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fdc600] text-black dark:text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <Menubar className="border-none bg-transparent p-0">
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer p-0 bg-transparent data-[state=open]:bg-transparent focus:bg-transparent">
                    <div className="w-8 h-8 rounded-full bg-black dark:bg-black border border-transparent dark:border-white text-white flex items-center justify-center text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 dark:hover:text-black transition">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </MenubarTrigger>
                  <MenubarContent align="end" className="w-56 bg-white dark:bg-gray-900 shadow-xl border-gray-100 dark:border-gray-800 rounded-lg mt-2 p-2">
                    <MenubarItem asChild><Link to="/profile" className="cursor-pointer flex items-center gap-2 p-2 text-black dark:text-white"><User className="w-4 h-4" /> Profile</Link></MenubarItem>
                    {user.role === 'admin' && (
                      <MenubarItem asChild><Link to="/dashboard" className="cursor-pointer flex items-center gap-2 p-2 text-black dark:text-white"><LayoutDashboard className="w-4 h-4" /> Admin Dashboard</Link></MenubarItem>
                    )}
                    <MenubarItem asChild><Link to="/orders" className="cursor-pointer flex items-center gap-2 p-2 text-black dark:text-white"><Package className="w-4 h-4" /> Orders</Link></MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={handleLogout} className="cursor-pointer text-red-600 flex items-center gap-2 p-2"><LogOut className="w-4 h-4" /> Logout</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            ) : (
              <Link to="/login" className="text-sm font-bold hover:underline">Login</Link>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-xl p-4 flex flex-col gap-4 md:hidden">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium">Home</Link>
          <Link to="/shop" onClick={() => setIsOpen(false)} className="text-lg font-medium">Shop All</Link>
          <Link to="/shop?category=electronics" onClick={() => setIsOpen(false)} className="text-lg font-medium pl-4 text-gray-500">Electronics</Link>
          <Link to="/shop?category=fashion" onClick={() => setIsOpen(false)} className="text-lg font-medium pl-4 text-gray-500">Fashion</Link>
          {user && (
            <Link to="/seller/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium">Sell Dashboard</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-left text-red-600 font-medium">Logout</button>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Link to="/login" className="text-center py-2 border border-gray-200 dark:border-white rounded dark:text-white">Login</Link>
              <Link to="/register" className="text-center py-2 bg-black dark:bg-black border border-transparent dark:border-white text-white dark:text-white rounded">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;