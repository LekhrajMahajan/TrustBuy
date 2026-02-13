import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogOut, Search, User, Package, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

const NavLink = ({ to, children }) => {
  return (
    <Link to={to} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors">
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    return '/seller/dashboard';
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white border-b border-gray-100 py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-8">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <img
              src={`${import.meta.env.BASE_URL}favicon.svg`}
              alt="TrustBuy Shield"
              className="w-10 h-10 group-hover:scale-110 transition-transform duration-200 drop-shadow-sm"
            />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Trust<span className="text-[#fdc600]">Buy</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={(e) => {
            e.preventDefault();
            const searchTerm = e.target.search.value;
            // Navigate to ShopPage with search query
            if (searchTerm.trim()) {
              navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
            }
          }} className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fdc600] transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <button type="submit" className="hidden" />
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link to="/shop">Shop</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {user && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link to="/seller/dashboard">Sell Products</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-4">

                {/* Cart Icon */}
                <Link to="/cart" className="relative p-2 text-gray-700 hover:bg-yellow-50 rounded-full transition-colors group">
                  <ShoppingCart className="w-5 h-5 group-hover:text-yellow-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Profile Dropdown */}
                <Menubar className="border-none bg-transparent shadow-none p-0">
                  <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-full px-3 py-1.5 flex items-center gap-2 data-[state=open]:bg-yellow-100">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-yellow-900 max-w-[80px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                    </MenubarTrigger>

                    <MenubarContent align="end" className="w-56 bg-white shadow-xl border-gray-100 rounded-xl mt-2">
                      <MenubarItem asChild>
                        <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" /> Profile
                        </Link>
                      </MenubarItem>
                      <MenubarItem asChild>
                        <Link to="/orders" className="cursor-pointer flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-500" /> My Orders
                        </Link>
                      </MenubarItem>

                      <MenubarSeparator />

                      <MenubarItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Logout
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-yellow-600">Log In</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-bold bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-sm">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-700">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0 overflow-hidden'}`}>
        <div className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const searchTerm = e.target.value;
                if (searchTerm.trim()) {
                  setIsOpen(false);
                  navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
                }
              }
            }}
          />
          <div className="space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Home</Link>
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Explore Shop</Link>
            {user ? (
              <>
                {/* ✅ Sell option visible for everyone */}
                <Link to="/seller/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Sell Products</Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">My Profile</Link>
                <Link to="/orders" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">My Orders</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex justify-center px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700">Log In</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="flex justify-center px-4 py-3 bg-slate-900 text-white rounded-lg font-semibold">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;