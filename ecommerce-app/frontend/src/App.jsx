import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';

const App = () => {
  return (
    <ShopProvider>
      <Router>
        <div class="min-h-screen bg-[#0b0c10] flex flex-col justify-between">
          <div>
            <Navbar />
            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/product/:id" element={<ProductScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/checkout" element={<CheckoutScreen />} />
                <Route path="/admin" element={<AdminDashboardScreen />} />
              </Routes>
            </main>
          </div>
          
          {/* Footer */}
          <footer class="border-t border-white/5 py-6 bg-[#08090d]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} AURA Gear Inc. All rights reserved.</p>
              <div class="flex gap-4">
                <a href="#" class="hover:text-gray-300">Privacy Policy</a>
                <a href="#" class="hover:text-gray-300">Terms of Service</a>
                <a href="#" class="hover:text-gray-300">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ShopProvider>
  );
};

export default App;
