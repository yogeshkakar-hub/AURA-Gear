import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { Package, Receipt, DollarSign, ShieldAlert, Plus, Trash2, CheckCircle2, AlertTriangle, RotateCw } from 'lucide-react';

const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(ShopContext);

  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Loading & error states
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [productError, setProductError] = useState(null);
  const [orderError, setOrderError] = useState(null);

  // Form states for creating a new product
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Security Check: Access Denied if not admin
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      // Allow react router redirection, or just show block screen below
    } else {
      fetchProducts();
      fetchOrders();
    }
  }, [userInfo, navigate]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setLoadingProducts(false);
    } catch (err) {
      setProductError(err.response?.data?.message || err.message);
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
      setLoadingOrders(false);
    } catch (err) {
      setOrderError(err.response?.data?.message || err.message);
      setLoadingOrders(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setProductError(null);
    setFormLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const productPayload = {
        name: newProductName,
        price: Number(newProductPrice),
        image: newProductImage || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
        brand: newProductBrand,
        category: newProductCategory,
        countInStock: Number(newProductStock),
        description: newProductDesc,
      };

      await axios.post('/api/products', productPayload, config);
      
      // Reset form fields
      setNewProductName('');
      setNewProductPrice('');
      setNewProductImage('');
      setNewProductBrand('');
      setNewProductCategory('');
      setNewProductStock('');
      setNewProductDesc('');

      fetchProducts();
      setFormLoading(false);
    } catch (err) {
      setProductError(err.response?.data?.message || err.message);
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setProductError(null);

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.delete(`/api/products/${id}`, config);
      fetchProducts();
    } catch (err) {
      setProductError(err.response?.data?.message || err.message);
    }
  };

  const handleDeliverOrder = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      fetchOrders();
    } catch (err) {
      setOrderError(err.response?.data?.message || err.message);
    }
  };

  if (!userInfo || !userInfo.isAdmin) {
    return (
      <div class="max-w-md mx-auto my-16 text-center space-y-6">
        <div class="glass-panel p-8 rounded-3xl border border-red-500/10 flex flex-col items-center gap-4">
          <ShieldAlert class="w-12 h-12 text-red-400" />
          <h1 class="text-xl font-bold text-white">Access Level Denied</h1>
          <p class="text-xs text-gray-500 leading-relaxed">
            This workspace console is restricted to administrators. If you hold credentials, please log in with your admin account.
          </p>
          <button
            onClick={() => navigate('/login')}
            class="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-full transition-all"
          >
            Go Sign In
          </button>
        </div>
      </div>
    );
  }

  // Stat computations
  const totalSales = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

  return (
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Admin Console</h1>
        <p class="text-sm text-gray-500 mt-1">Catalog inventories and checkout order tracking ledger.</p>
      </div>

      {/* Dashboard Stats Panel */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Sales Card */}
        <div class="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">Revenue</span>
            <h3 class="text-2xl font-extrabold text-white">${totalSales.toFixed(2)}</h3>
          </div>
          <div class="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
            <DollarSign class="w-5 h-5" />
          </div>
        </div>

        {/* Orders Card */}
        <div class="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">Orders</span>
            <h3 class="text-2xl font-extrabold text-white">{orders.length}</h3>
          </div>
          <div class="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Receipt class="w-5 h-5" />
          </div>
        </div>

        {/* Products Card */}
        <div class="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">Inventory</span>
            <h3 class="text-2xl font-extrabold text-white">{products.length} Items</h3>
          </div>
          <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Package class="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div class="flex border-b border-white/5 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('products')}
          class={`pb-3 transition-colors ${activeTab === 'products' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Manage Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          class={`pb-3 transition-colors ${activeTab === 'orders' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Orders Ledger
        </button>
      </div>

      {/* TAB 1: Product controls */}
      {activeTab === 'products' && (
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Table */}
          <div class="lg:col-span-2 space-y-4">
            <h2 class="text-lg font-bold text-white">Products Catalog</h2>
            {productError && (
              <div class="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs">{productError}</div>
            )}

            {loadingProducts ? (
              <div class="flex items-center justify-center py-10"><RotateCw class="w-6 h-6 text-brand-500 animate-spin" /></div>
            ) : products.length === 0 ? (
              <p class="text-gray-500 text-sm py-10">No items available.</p>
            ) : (
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="border-b border-white/5 text-gray-500 font-semibold">
                      <th class="pb-3 pr-2">Item</th>
                      <th class="pb-3 pr-2">Category</th>
                      <th class="pb-3 pr-2">Price</th>
                      <th class="pb-3 pr-2">Stock</th>
                      <th class="pb-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    {products.map((p) => (
                      <tr key={p._id} class="hover:bg-white/5 transition-colors">
                        <td class="py-3 pr-2 flex items-center gap-3">
                          <img src={p.image} alt={p.name} class="w-8 h-8 rounded bg-zinc-950 object-cover" />
                          <span class="font-bold text-white line-clamp-1">{p.name}</span>
                        </td>
                        <td class="py-3 pr-2 text-gray-400">{p.category}</td>
                        <td class="py-3 pr-2 font-semibold text-white">${p.price.toFixed(2)}</td>
                        <td class="py-3 pr-2">
                          <span class={`font-bold ${p.countInStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {p.countInStock} units
                          </span>
                        </td>
                        <td class="py-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            class="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 class="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add Product Form */}
          <div class="glass-panel p-6 rounded-2xl border border-white/5 h-fit space-y-4">
            <h2 class="text-base font-bold text-white flex items-center gap-1.5">
              <Plus class="w-4 h-4 text-brand-400" />
              <span>Create Product</span>
            </h2>

            <form onSubmit={handleCreateProduct} class="space-y-3.5">
              <div class="space-y-1">
                <label htmlFor="pname" class="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Product Name</label>
                <input
                  id="pname"
                  type="text"
                  placeholder="e.g. Ergonomic Desk Mat"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  class="w-full bg-[#12131a] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label htmlFor="pprice" class="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Price ($)</label>
                  <input
                    id="pprice"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 49.99"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    class="w-full bg-[#12131a] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div class="space-y-1">
                  <label htmlFor="pstock" class="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Stock Count</label>
                  <input
                    id="pstock"
                    type="number"
                    placeholder="e.g. 10"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    class="w-full bg-[#12131a] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label htmlFor="pbrand" class="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Brand</label>
                  <input
                    id="pbrand"
                    type="text"
                    placeholder="e.g. AURA Tech"
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                    class="w-full bg-[#12131a] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div class="space-y-1">
                  <label htmlFor="pcat" class="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Category</label>
                  <input
                    id="pcat"
                    type="text"
                    placeholder="e.g. Gear"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    class="w-full bg-[#12131a] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label htmlFor="pimage" class="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Image URL</label>
                <input
                  id="pimage"
                  type="text"
                  placeholder="https://..."
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  class="w-full bg-[#12131a] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-brand-500"
                />
              </div>

              <div class="space-y-1">
                <label htmlFor="pdesc" class="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Description</label>
                <textarea
                  id="pdesc"
                  rows="3"
                  placeholder="Tell clients about the gear..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  class="w-full bg-[#12131a] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-brand-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                class="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-lg text-xs"
              >
                {formLoading ? <RotateCw class="w-3.5 h-3.5 animate-spin" /> : 'Create Catalog Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Orders control ledger */}
      {activeTab === 'orders' && (
        <div class="space-y-4">
          <h2 class="text-lg font-bold text-white font-sans">Checkout Orders Queue</h2>
          {orderError && (
            <div class="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs">{orderError}</div>
          )}

          {loadingOrders ? (
            <div class="flex items-center justify-center py-10"><RotateCw class="w-6 h-6 text-brand-500 animate-spin" /></div>
          ) : orders.length === 0 ? (
            <p class="text-gray-500 text-sm py-10">No orders tracked in DB.</p>
          ) : (
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-white/5 text-gray-500 font-semibold">
                    <th class="pb-3 pr-2">Order ID</th>
                    <th class="pb-3 pr-2">Customer</th>
                    <th class="pb-3 pr-2">Date</th>
                    <th class="pb-3 pr-2">Total</th>
                    <th class="pb-3 pr-2">Paid</th>
                    <th class="pb-3 pr-2">Delivered</th>
                    <th class="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  {orders.map((o) => (
                    <tr key={o._id} class="hover:bg-white/5 transition-colors">
                      <td class="py-3 pr-2 font-mono text-brand-300 font-bold">{o._id}</td>
                      <td class="py-3 pr-2 text-white font-medium">{o.user?.name || 'Unknown'}</td>
                      <td class="py-3 pr-2 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td class="py-3 pr-2 text-white font-bold">${o.totalPrice.toFixed(2)}</td>
                      <td class="py-3 pr-2">
                        {o.isPaid ? (
                          <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase">Paid</span>
                        ) : (
                          <span class="px-2 py-0.5 rounded text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold uppercase">Pending</span>
                        )}
                      </td>
                      <td class="py-3 pr-2">
                        {o.isDelivered ? (
                          <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase">Delivered</span>
                        ) : (
                          <span class="px-2 py-0.5 rounded text-[10px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold uppercase">In Transit</span>
                        )}
                      </td>
                      <td class="py-3 text-right">
                        {!o.isDelivered ? (
                          <button
                            onClick={() => handleDeliverOrder(o._id)}
                            class="px-2.5 py-1.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 rounded hover:bg-emerald-500/25 transition-all"
                          >
                            Mark Delivered
                          </button>
                        ) : (
                          <span class="inline-flex items-center gap-1 text-[10px] text-gray-500 font-semibold">
                            <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" />
                            <span>Done</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardScreen;
