import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { MapPin, CreditCard, ShoppingCart, CheckCircle, ArrowRight, ArrowLeft, RotateCw, AlertCircle } from 'lucide-react';

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const {
    userInfo,
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    saveShippingAddress,
    savePaymentMethod,
    clearCart,
  } = useContext(ShopContext);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Success
  const [addressVal, setAddressVal] = useState(shippingAddress.address || '');
  const [cityVal, setCityVal] = useState(shippingAddress.city || '');
  const [postalVal, setPostalVal] = useState(shippingAddress.postalCode || '');
  const [countryVal, setCountryVal] = useState(shippingAddress.country || '');
  const [paymentVal, setPaymentVal] = useState(paymentMethod || 'PayPal');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Redirect if not logged in or cart is empty (unless we are at the success stage)
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else if (cartItems.length === 0 && step < 4) {
      navigate('/cart');
    }
  }, [userInfo, cartItems, navigate, step]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!addressVal || !cityVal || !postalVal || !countryVal) {
      setError('Please fill in all address fields');
      return;
    }
    saveShippingAddress({ address: addressVal, city: cityVal, postalCode: postalVal, country: countryVal });
    setError(null);
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentVal);
    setError(null);
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setError(null);
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const { data } = await axios.post('/api/orders', orderPayload, config);
      setCreatedOrder(data);
      clearCart();
      setStep(4);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div class="max-w-4xl mx-auto space-y-8">
      {/* Wizard Progress Header */}
      {step < 4 && (
        <div class="flex items-center justify-between border-b border-white/5 pb-4">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Checkout</h1>
            <span class="text-xs text-gray-500 font-medium">Wizard Mode</span>
          </div>

          <div class="flex items-center gap-2 sm:gap-4 text-xs font-bold">
            <span class={`pb-1 border-b-2 transition-all duration-300 ${step === 1 ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-500'}`}>
              1. Shipping
            </span>
            <span class="text-gray-600">/</span>
            <span class={`pb-1 border-b-2 transition-all duration-300 ${step === 2 ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-500'}`}>
              2. Payment
            </span>
            <span class="text-gray-600">/</span>
            <span class={`pb-1 border-b-2 transition-all duration-300 ${step === 3 ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-500'}`}>
              3. Review
            </span>
          </div>
        </div>
      )}

      {error && (
        <div class="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-start gap-2">
          <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Shipping Form */}
      {step === 1 && (
        <div class="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
          <div class="flex items-center gap-2 text-white">
            <MapPin class="w-5 h-5 text-brand-400" />
            <h2 class="text-lg font-bold">Shipping Details</h2>
          </div>

          <form onSubmit={handleShippingSubmit} class="space-y-4">
            <div class="space-y-1">
              <label htmlFor="address" class="text-xs font-bold text-gray-400 uppercase tracking-wide">Address</label>
              <input
                id="address"
                type="text"
                placeholder="123 Cyber St"
                value={addressVal}
                onChange={(e) => setAddressVal(e.target.value)}
                class="w-full bg-[#12131a]/80 border border-white/10 focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-gray-200 placeholder-gray-600 outline-none"
                required
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label htmlFor="city" class="text-xs font-bold text-gray-400 uppercase tracking-wide">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="Neo City"
                  value={cityVal}
                  onChange={(e) => setCityVal(e.target.value)}
                  class="w-full bg-[#12131a]/80 border border-white/10 focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-gray-200 placeholder-gray-600 outline-none"
                  required
                />
              </div>

              <div class="space-y-1">
                <label htmlFor="postalCode" class="text-xs font-bold text-gray-400 uppercase tracking-wide">Postal Code</label>
                <input
                  id="postalCode"
                  type="text"
                  placeholder="10001"
                  value={postalVal}
                  onChange={(e) => setPostalVal(e.target.value)}
                  class="w-full bg-[#12131a]/80 border border-white/10 focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-gray-200 placeholder-gray-600 outline-none"
                  required
                />
              </div>

              <div class="space-y-1">
                <label htmlFor="country" class="text-xs font-bold text-gray-400 uppercase tracking-wide">Country</label>
                <input
                  id="country"
                  type="text"
                  placeholder="Aetheria"
                  value={countryVal}
                  onChange={(e) => setCountryVal(e.target.value)}
                  class="w-full bg-[#12131a]/80 border border-white/10 focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-gray-200 placeholder-gray-600 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              class="w-full flex items-center justify-center gap-2 py-3 px-5 font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-lg transition-all duration-200"
            >
              <span>Save & Continue</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: Payment selection */}
      {step === 2 && (
        <div class="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
          <div class="flex items-center gap-2 text-white">
            <CreditCard class="w-5 h-5 text-brand-400" />
            <h2 class="text-lg font-bold">Select Payment Method</h2>
          </div>

          <form onSubmit={handlePaymentSubmit} class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${paymentVal === 'PayPal' ? 'bg-brand-500/10 border-brand-500 text-white' : 'bg-[#12131a]/40 border-white/5 text-gray-400 hover:border-white/10'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentVal === 'PayPal'}
                  onChange={(e) => setPaymentVal(e.target.value)}
                  class="accent-brand-500"
                />
                <span class="font-semibold text-sm">PayPal / Digital Wallets</span>
              </label>

              <label class={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${paymentVal === 'CreditCard' ? 'bg-brand-500/10 border-brand-500 text-white' : 'bg-[#12131a]/40 border-white/5 text-gray-400 hover:border-white/10'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CreditCard"
                  checked={paymentVal === 'CreditCard'}
                  onChange={(e) => setPaymentVal(e.target.value)}
                  class="accent-brand-500"
                />
                <span class="font-semibold text-sm">Credit / Debit Card</span>
              </label>
            </div>

            <div class="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                class="flex-1 flex items-center justify-center gap-2 py-3 px-5 font-bold text-gray-400 bg-white/5 border border-white/10 hover:text-white rounded-xl transition-all"
              >
                <ArrowLeft class="w-4 h-4" />
                <span>Go Back</span>
              </button>

              <button
                type="submit"
                class="flex-1 flex items-center justify-center gap-2 py-3 px-5 font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-lg transition-all"
              >
                <span>Continue</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: Order Review */}
      {step === 3 && (
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed list of order parameters */}
          <div class="lg:col-span-2 space-y-6">
            {/* Shipping Review */}
            <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-brand-400">Shipping Details</h3>
              <p class="text-sm text-gray-200 font-semibold">{userInfo.name}</p>
              <p class="text-xs text-gray-400">
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>

            {/* Payment Review */}
            <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-brand-400">Payment Gateway</h3>
              <p class="text-xs text-gray-400">
                Selected method: <span class="text-white font-semibold text-sm capitalize">{paymentMethod}</span>
              </p>
            </div>

            {/* Cart Items Review */}
            <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <div class="flex items-center gap-1.5 text-white">
                <ShoppingCart class="w-4.5 h-4.5" />
                <h3 class="text-sm font-bold uppercase tracking-wider">Itemized Lineup</h3>
              </div>

              <div class="divide-y divide-white/5 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product} class="flex items-center justify-between pt-3 first:pt-0 gap-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded bg-zinc-950 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
                      </div>
                      <span class="text-xs font-medium text-gray-300 line-clamp-1">{item.name}</span>
                    </div>
                    <span class="text-xs font-bold text-white flex-shrink-0">
                      {item.qty} x ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Ledger & Action Button */}
          <div class="glass-panel p-6 rounded-2xl border border-white/5 h-fit space-y-5">
            <h3 class="text-sm font-bold uppercase tracking-wider text-white">Checkout Total</h3>

            <div class="space-y-2.5 text-xs text-gray-400">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span class="text-gray-200 font-semibold">${itemsPrice.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping Fee</span>
                <span class="text-gray-200 font-semibold">
                  {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div class="flex justify-between">
                <span>Tax (15% VAT)</span>
                <span class="text-gray-200 font-semibold">${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <hr class="border-white/5" />

            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-white">Grand Total</span>
              <span class="text-lg font-extrabold text-white">${totalPrice.toFixed(2)}</span>
            </div>

            <div class="space-y-3 pt-2">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                class="w-full flex items-center justify-center gap-2 py-3 px-5 font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-95 transition-all duration-200"
              >
                {loading ? (
                  <RotateCw class="w-4 h-4 animate-spin" />
                ) : (
                  <span>Submit Order</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                class="w-full py-2.5 px-4 text-xs font-bold text-gray-500 hover:text-gray-300 bg-transparent text-center rounded-xl transition-colors"
              >
                Modify Payment Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Success confirmation screen */}
      {step === 4 && createdOrder && (
        <div class="glass-panel p-12 rounded-3xl border border-emerald-500/15 max-w-xl mx-auto flex flex-col items-center justify-center gap-6 text-center">
          <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full animate-bounce">
            <CheckCircle class="w-10 h-10" />
          </div>

          <div class="space-y-2">
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Order Placed Successfully!</h1>
            <p class="text-xs text-gray-400 max-w-xs mx-auto">
              Your transaction has been securely processed. We've sent you a confirmation email receipt.
            </p>
          </div>

          {/* Details tag box */}
          <div class="p-4 rounded-xl bg-[#12131a]/80 border border-white/5 w-full text-left space-y-2">
            <div class="flex justify-between items-center text-xs">
              <span class="text-gray-500">Order ID:</span>
              <span class="font-mono text-brand-300 font-bold">{createdOrder._id}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-gray-500">Payment Gateway:</span>
              <span class="text-gray-300 font-semibold uppercase">{createdOrder.paymentMethod}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-gray-500">Amount Charged:</span>
              <span class="text-emerald-400 font-bold">${createdOrder.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            class="px-8 py-3 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-lg transition-all"
          >
            Go Back Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutScreen;
