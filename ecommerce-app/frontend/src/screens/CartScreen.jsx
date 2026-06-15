import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

const CartScreen = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useContext(ShopContext);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleQtyChange = (item, qty) => {
    addToCart({ _id: item.product, ...item }, qty);
  };

  const handleCheckout = () => {
    navigate('/login?redirect=checkout');
  };

  return (
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Shopping Cart</h1>
        <p class="text-sm text-gray-500 mt-1">Review your items and proceed to secure checkout.</p>
      </div>

      {cartItems.length === 0 ? (
        <div class="glass-panel p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-5 text-center max-w-xl mx-auto">
          <div class="p-4 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-full">
            <ShoppingBag class="w-8 h-8" />
          </div>
          <div class="space-y-1">
            <h2 class="text-lg font-bold text-white">Your cart is currently empty</h2>
            <p class="text-xs text-gray-400 max-w-xs">
              Before you can checkout, you must add some products to your shopping cart.
            </p>
          </div>
          <Link
            to="/"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow transition-all duration-200"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>Go Back Shopping</span>
          </Link>
        </div>
      ) : (
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div class="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product}
                class="glass-panel p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                {/* Image & Title */}
                <div class="flex items-center gap-4 w-full sm:w-auto">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="space-y-1">
                    <Link
                      to={`/product/${item.product}`}
                      class="text-sm sm:text-base font-bold text-white hover:text-brand-400 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p class="text-xs text-brand-400 font-semibold">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                {/* Dropdown, Price, and Remove */}
                <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 border-white/5 pt-3 sm:pt-0">
                  <div class="flex items-center gap-2">
                    <label htmlFor={`qty-select-${item.product}`} class="text-xs text-gray-500">Qty</label>
                    <select
                      id={`qty-select-${item.product}`}
                      value={item.qty}
                      onChange={(e) => handleQtyChange(item, Number(e.target.value))}
                      class="bg-[#12131a] text-gray-300 text-xs font-semibold border border-white/10 rounded-lg px-2.5 py-1 outline-none focus:border-brand-500 transition-colors"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span class="text-sm sm:text-base font-bold text-white w-20 text-right">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product)}
                    class="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary Card */}
          <div class="glass-panel p-6 rounded-2xl border border-white/5 h-fit space-y-6">
            <h2 class="text-lg font-bold text-white">Order Summary</h2>

            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-400">Subtotal ({totalItems} items)</span>
                <span class="font-bold text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <hr class="border-white/5" />

            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-white">Subtotal</span>
              <span class="text-lg font-extrabold text-white">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              class="w-full flex items-center justify-center gap-2 py-3 px-5 font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-95 transition-all duration-200"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
