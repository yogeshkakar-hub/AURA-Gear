import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Eye, ArrowRight, ServerCrash, RotateCw, ArrowLeft } from 'lucide-react';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          keyword ? `/api/products?keyword=${encodeURIComponent(keyword)}` : '/api/products'
        );
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  return (
    <div class="space-y-12">
      {/* Hero Banner */}
      <div class="relative rounded-3xl overflow-hidden glass-panel border border-brand-500/10 py-16 px-8 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="absolute inset-0 bg-gradient-to-r from-brand-950/80 to-transparent z-0"></div>
        <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl"></div>
        <div class="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"></div>

        <div class="relative z-10 max-w-lg space-y-6 text-center md:text-left">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] tracking-wider font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-full uppercase">
            New Arrivals Available
          </span>
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen Gear For Your <span class="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">Creative Hub</span>
          </h1>
          <p class="text-gray-400 text-sm sm:text-base leading-relaxed">
            Elevate your lifestyle and productivity. Discover curated tech gadgets, dynamic lighting, and precision accessories built to redefine your routine.
          </p>
          <a
            href="#catalog"
            class="inline-flex items-center gap-2 px-6 py-3 font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-full shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:scale-105 transition-all duration-200"
          >
            <span>Explore Catalog</span>
            <ArrowRight class="w-4 h-4" />
          </a>
        </div>

        {/* Hero Asset Mock */}
        <div class="relative z-10 w-full max-w-sm md:max-w-md aspect-video md:aspect-auto h-52 md:h-72 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
            alt="Gaming Setup Banner"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Catalog Grid Section */}
      <div id="catalog" class="space-y-6 scroll-mt-20">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold tracking-tight text-white">
            {keyword ? `Search Results for "${keyword}"` : 'Featured Products'}
          </h2>
          <span class="text-xs text-gray-500 font-medium">{products.length} Items Listed</span>
        </div>

        {keyword && (
          <Link
            to="/"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>Clear search filter</span>
          </Link>
        )}

        {loading ? (
          <div class="flex flex-col items-center justify-center py-20 gap-4">
            <RotateCw class="w-8 h-8 text-brand-500 animate-spin" />
            <p class="text-gray-400 text-sm">Fetching catalogue items...</p>
          </div>
        ) : error ? (
          <div class="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl glass-panel border-red-500/10">
            <ServerCrash class="w-10 h-10 text-red-400" />
            <p class="text-red-400 text-sm font-semibold">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              class="mt-2 text-xs text-gray-300 border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div class="text-center py-20 text-gray-500">
            No products found. Please seed the database from your console.
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                class="glass-panel hover-glow rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Product Image Wrapper */}
                <div class="relative aspect-square overflow-hidden bg-zinc-950 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div class="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] tracking-wide font-bold uppercase rounded bg-[#0b0c10]/80 text-brand-300 border border-brand-500/10">
                    {product.brand}
                  </div>
                  {product.countInStock === 0 && (
                    <div class="absolute inset-0 bg-[#0b0c10]/70 flex items-center justify-center">
                      <span class="px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 font-bold text-xs uppercase tracking-widest">
                        Out of stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div class="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div class="space-y-1.5">
                    <span class="text-xs text-gray-500 font-medium tracking-wide uppercase">
                      {product.category}
                    </span>
                    <h3 class="text-base font-bold text-white tracking-tight leading-tight line-clamp-1">
                      {product.name}
                    </h3>
                    <p class="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div class="flex items-center justify-between pt-2">
                    <span class="text-lg font-extrabold text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <Link
                      to={`/product/${product._id}`}
                      class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:border-brand-500/40 rounded-lg transition-all duration-200"
                    >
                      <Eye class="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
