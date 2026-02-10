import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  ChevronLeft,
  Lock,
  Banknote,
  Store,
} from "lucide-react";

const Checkout = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "Tuck Shop Collection", // Defaulting to the collection point
    paymentMethod: "mpesa",
  });

  const cart = state?.cart || [];
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      },
      totalAmount: total,
      paymentMethod: formData.paymentMethod,
      // Status is "pending" by default in the backend
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const json = await res.json();

      if (json.success) {
        const successMsg = formData.paymentMethod === "cash" 
          ? "Order placed! Please visit the Tuck Shop to complete payment and collect your items."
          : "Order Placed Successfully!";
        alert(successMsg);
        navigate("/shop");
      }
    } catch (err) {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-8 tracking-widest"
      >
        <ChevronLeft size={16} /> Back to Cart
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-[#161B22] p-10 rounded-[2.5rem] border dark:border-slate-800 shadow-2xl">
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-8">
            Checkout Details
          </h2>
          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
              <input
                required
                className="w-full bg-slate-50 dark:bg-[#0D1117] p-4 rounded-xl dark:text-white font-bold border dark:border-slate-800"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 dark:bg-[#0D1117] p-4 rounded-xl dark:text-white font-bold border dark:border-slate-800"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Phone</label>
                <input
                  required
                  className="w-full bg-slate-50 dark:bg-[#0D1117] p-4 rounded-xl dark:text-white font-bold border dark:border-slate-800"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Collection Note instead of Address Field */}
            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-start gap-4">
              <Store className="text-blue-600 shrink-0" size={24} />
              <div>
                <p className="text-[10px] font-black uppercase text-blue-600 mb-1">Collection Point</p>
                <p className="text-sm font-bold dark:text-white leading-tight">
                  Items can be collected at the Tuck Shop (in church).
                </p>
              </div>
            </div>

            <div className="pt-6 border-t dark:border-slate-800">
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-4">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-4">
                {["mpesa", "card", "cash"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method })}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 font-black uppercase text-[9px] tracking-widest transition-all ${
                      formData.paymentMethod === method
                        ? "border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/10"
                        : "border-slate-100 dark:border-slate-800 text-slate-400"
                    }`}
                  >
                    {method === "mpesa" && <Smartphone size={18} />}
                    {method === "card" && <CreditCard size={18} />}
                    {method === "cash" && <Banknote size={18} />}
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {formData.paymentMethod === "cash" && (
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase text-center bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl">
                Note: Your order will be "Pending" until cash payment is made at the Tuck Shop.
              </p>
            )}

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all"
            >
              {loading ? "Processing..." : `Complete Order (KES ${total.toLocaleString()})`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-[#161B22] p-8 rounded-[2.5rem] border dark:border-slate-800">
            <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm font-bold dark:text-slate-300">{item.qty}x {item.name}</span>
                  <span className="text-sm font-black dark:text-white">KES {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t dark:border-slate-800 pt-6 flex justify-between items-center">
              <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Total Amount</span>
              <span className="text-3xl font-black text-blue-600 tracking-tighter">KES {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl flex items-center gap-4 border border-blue-100 dark:border-blue-900/30">
            <Lock className="text-blue-600" size={24} />
            <p className="text-[10px] font-bold text-blue-900 dark:text-blue-400 uppercase tracking-tight leading-relaxed">
              Orders are securely logged. Visit the Tuck Shop for collection and validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;