import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Define categories to match your Backend Enum
  const categories = ["all", "apparel", "books", "media", "other"];

  useEffect(() => {
    fetch("http://localhost:5000/api/product")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProducts(json.data);
      });
  }, []);

  // Add to Cart Logic
  const addToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsDrawerOpen(true);
  };

  const removeFromCart = (id) =>
    setCart(cart.filter((item) => item._id !== id));

  const updateQty = (id, delta) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item,
      ),
    );
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Combined Filter Logic: Tabs + Search
  const filteredProducts = products.filter((p) => {
    const matchesTab = activeTab === "all" || p.category === activeTab;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen relative">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl text-blue-600">
            <ShoppingBag size={32} />
          </div>
          <div>
            <h2 className="text-blue-600 font-black uppercase tracking-widest text-[10px] mb-1">
              Church Merch
            </h2>
            <h1 className="text-5xl font-black dark:text-white uppercase tracking-tighter leading-none">
              The Shop
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full bg-slate-50 dark:bg-[#161B22] border dark:border-slate-800 p-4 pl-12 rounded-2xl outline-none focus:border-blue-600 dark:text-white font-bold"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="p-4 bg-slate-50 dark:bg-[#161B22] border dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors">
            <Filter size={20} />
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-5 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-white dark:border-[#0D1117]">
                {cart.reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide border-b dark:border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
              activeTab === cat
                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                : "bg-white dark:bg-[#161B22] text-slate-400 border-slate-100 dark:border-slate-800 hover:border-blue-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div
              key={item._id}
              className="group bg-white dark:bg-[#161B22] rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 transition-all hover:shadow-2xl"
            >
              <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                <img
                  src={`http://localhost:5000${item.images[0]}`}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase text-blue-600">
                  {item.category}
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-black uppercase text-lg dark:text-white mb-1 tracking-tight">
                  {item.name}
                </h3>
                <p className="text-blue-600 font-black text-xl mb-6 tracking-tighter">
                  KES {item.price.toLocaleString()}
                </p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
              No products found in this category
            </p>
          </div>
        )}
      </div>

      {/* CART DRAWER */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${isDrawerOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsDrawerOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#0D1117] shadow-2xl transition-transform duration-500 ease-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">
                Your Cart
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors dark:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingCart
                    size={48}
                    className="mx-auto text-slate-200 mb-4"
                  />
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 items-center animate-in slide-in-from-right-4"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                      <img
                        src={`http://localhost:5000${item.images[0]}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black dark:text-white uppercase text-[10px] tracking-widest mb-1">
                        {item.name}
                      </h4>
                      <p className="text-blue-600 font-black">
                        KES {item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQty(item._id, -1)}
                          className="p-1 border dark:border-slate-800 rounded-md dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-black dark:text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item._id, 1)}
                          className="p-1 border dark:border-slate-800 rounded-md dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t dark:border-slate-800 bg-slate-50 dark:bg-[#161B22]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase text-slate-400">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-blue-600 tracking-tighter">
                    KES {cartTotal.toLocaleString()}
                  </span>
                </div>
                <button onClick={() => navigate("/checkout", { state: { cart } })} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
