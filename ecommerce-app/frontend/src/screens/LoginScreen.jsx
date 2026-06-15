import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { LogIn, Key, Mail, AlertCircle, RotateCw } from 'lucide-react';

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, login } = useContext(ShopContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Search redirection route query, default to '/'
  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  useEffect(() => {
    // If user is already logged in, redirect immediately
    if (userInfo) {
      navigate('/' + redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      setLoading(false);
      navigate('/' + redirect);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div class="max-w-md mx-auto my-8">
      <div class="glass-panel p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl relative">
        <div class="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-brand-500/10 blur-2xl -z-10"></div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/10 blur-2xl -z-10"></div>

        <div class="text-center space-y-1">
          <h1 class="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p class="text-xs text-gray-500">Sign in with your email to continue your shopping session</p>
        </div>

        {error && (
          <div class="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} class="space-y-4">
          {/* Email input */}
          <div class="space-y-1.5">
            <label htmlFor="email" class="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Email Address
            </label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                class="w-full bg-[#12131a]/80 border border-white/10 focus:border-brand-500 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div class="space-y-1.5">
            <label htmlFor="password" class="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Password
            </label>
            <div class="relative">
              <Key class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                class="w-full bg-[#12131a]/80 border border-white/10 focus:border-brand-500 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            class="w-full flex items-center justify-center gap-2 py-3 px-5 font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-[0.98] transition-all duration-200"
          >
            {loading ? (
              <RotateCw class="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn class="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <hr class="border-white/5" />

        <div class="text-center">
          <p class="text-xs text-gray-500">
            New to AURA?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              class="font-bold text-brand-400 hover:text-brand-300 hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
