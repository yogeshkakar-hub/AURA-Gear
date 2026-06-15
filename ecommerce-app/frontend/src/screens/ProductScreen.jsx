import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { ArrowLeft, ShoppingBag, CheckCircle2, XCircle, RotateCw } from 'lucide-react';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <div class="space-y-6">
      {/* Back Button */}
      <Link
        to="/"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Back to catalog</span>
      </Link>

      {loading ? (
        <div class="flex flex-col items-center justify-center py-20 gap-4">
          <RotateCw class="w-8 h-8 text-brand-500 animate-spin" />
          <p class="text-gray-400 text-sm">Loading details...</p>
        </div>
      ) : error ? (
        <div class="glass-panel border-red-500/10 p-6 rounded-2xl flex flex-col items-center gap-3">
          <XCircle class="w-8 h-8 text-red-400" />
          <p class="text-red-400 text-sm font-semibold">{error}</p>
        </div>
      ) : !product ? (
        <p class="text-gray-500 text-center py-12">Product not found.</p>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Image */}
          <div class="glass-panel p-4 rounded-3xl border border-white/5 flex items-center justify-center aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              class="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right Column: Info & Action Panel */}
          <div class="flex flex-col justify-between space-y-6">
            {/* Headers */}
            <div class="space-y-4">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2.5 py-1 text-[10px] tracking-wide font-bold uppercase rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {product.brand}
                </span>
                <span class="px-2.5 py-1 text-[10px] tracking-wide font-bold uppercase rounded bg-white/5 text-gray-400 border border-white/5">
                  {product.category}
                </span>
              </div>
              
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              <p class="text-2xl font-extrabold text-white">
                ${product.price.toFixed(2)}
              </p>

              <hr class="border-white/5" />

              <div class="space-y-1.5">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Product Details
                </h3>
                <p class="text-gray-400 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Action Box */}
            <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-400 font-medium">Availability</span>
                {product.countInStock > 0 ? (
                  <span class="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                    <CheckCircle2 class="w-4 h-4" />
                    <span>In Stock ({product.countInStock})</span>
                  </span>
                ) : (
                  <span class="inline-flex items-center gap-1 text-red-400 text-xs font-bold uppercase tracking-wide">
                    <XCircle class="w-4 h-4" />
                    <span>Out Of Stock</span>
                  </span>
                )}
              </div>

              {product.countInStock > 0 && (
                <div class="flex items-center justify-between">
                  <label htmlFor="qty-select" class="text-sm text-gray-400 font-medium">Quantity</label>
                  <select
                    id="qty-select"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    class="bg-[#12131a] text-gray-300 text-sm font-semibold border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-brand-500 transition-colors"
                  >
                    {[...Array(Math.min(10, product.countInStock)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                class="w-full flex items-center justify-center gap-2 py-3.5 px-6 font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-gray-500 rounded-xl shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-95 transition-all duration-200"
              >
                <ShoppingBag class="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
