import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ShoppingCart, User, LogOut, ShieldAlert } from 'lucide-react';
import SearchBox from './SearchBox';

const Navbar = () => {
  const { userInfo, cartItems, logout } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav class="sticky top-0 z-50 glass-nav shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          {/* Logo */}
          <div class="flex-shrink-0">
            <Link to="/" class="flex items-center gap-2 group">
              <span class="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-brand-400 via-brand-500 to-indigo-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
                AURA
              </span>
              <span class="text-[10px] tracking-widest text-brand-300 font-semibold uppercase px-1.5 py-0.5 border border-brand-500/20 rounded bg-brand-950/50">
                GEAR
              </span>
            </Link>
          </div>

          {/* Search Box */}
          <div class="hidden md:flex flex-1 justify-center max-w-md mx-6">
            <SearchBox />
          </div>

          {/* Right Menu */}
          <div class="flex items-center gap-4">
            {/* Cart Link */}
            <Link
              to="/cart"
              class="relative p-2 text-gray-400 hover:text-brand-400 hover:bg-white/5 rounded-full transition-all duration-200"
            >
              <ShoppingCart class="w-5 h-5" />
              {totalItems > 0 && (
                <span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white ring-2 ring-[#0b0c10] animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Admin Dashboard Quick Link */}
            {userInfo && userInfo.isAdmin && (
              <Link
                to="/admin"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/25 transition-all duration-200"
              >
                <ShieldAlert class="w-3.5 h-3.5" />
                <span>Console</span>
              </Link>
            )}

            {/* User Session Handler */}
            {userInfo ? (
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-300 font-medium hidden sm:inline">
                  Hi, {userInfo.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  class="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 hover:border-brand-500/40 hover:text-white rounded-full transition-all duration-200"
                >
                  <LogOut class="w-3.5 h-3.5" />
                  <span class="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                class="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 rounded-full transition-all duration-200"
              >
                <User class="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
