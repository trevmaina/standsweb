import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Eye,
  X,
  Loader2,
  User,
  Store,
  Banknote,
  Smartphone,
  Phone,
  Mail,
} from "lucide-react";

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      const json = await res.json();
      if (json.success) setOrders(json.data);
    } catch (err) {
      console.error("Order load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      alert("Status update failed");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (
      !window.confirm(
        "Permanently delete this order record? This cannot be undone.",
      )
    )
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders(orders.filter((o) => o._id !== id));
        setSelectedOrder(null);
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl text-blue-600">
            <ShoppingBag size={32} />
          </div>
          <div>
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">
              Sales Hub
            </h2>
            <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
              Orders
            </h1>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-[#161B22] border dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Date
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Customer
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Payment
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            {orders.map((o) => (
              <tr
                key={o._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-8 py-6 text-xs font-bold dark:text-white">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6">
                  <p className="font-black dark:text-white uppercase text-sm">
                    {o.customer.name}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1.5 rounded-md ${o.paymentMethod === "cash" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}
                    >
                      {o.paymentMethod === "cash" ? (
                        <Banknote size={12} />
                      ) : (
                        <Smartphone size={12} />
                      )}
                    </span>
                    <span className="text-[10px] font-black dark:text-white uppercase">
                      {o.paymentMethod}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                      o.status === "paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {o.status === "paid" ? (
                      <CheckCircle size={10} />
                    ) : (
                      <Clock size={10} />
                    )}{" "}
                    {o.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#002034] w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-10 right-10 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={28} />
            </button>
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-2">
              Order Review
            </h2>
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-8">
              Ref: #{selectedOrder._id.slice(-6)}
            </p>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-widest">
                    <User size={14} /> Contact Details
                  </div>
                  <p className="text-sm font-bold dark:text-white flex items-center gap-2">
                    <Phone size={12} className="text-slate-400" />{" "}
                    {selectedOrder.customer.phone}
                  </p>
                  <p className="text-sm font-bold dark:text-white flex items-center gap-2">
                    <Mail size={12} className="text-slate-400" />{" "}
                    {selectedOrder.customer.email}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-widest">
                    <Store size={14} /> Pickup Method
                  </div>
                  <p className="text-sm font-bold dark:text-white">
                    {selectedOrder.customer.address}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border dark:border-slate-800">
                <table className="w-full text-left">
                  <thead className="text-[9px] font-black uppercase text-slate-400 border-b dark:border-slate-800">
                    <tr>
                      <th className="pb-4">Product Name</th>
                      <th className="pb-4">Qty</th>
                      <th className="pb-4 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td className="py-4 text-xs font-bold dark:text-white">
                          {item.name}
                        </td>
                        <td className="py-4 text-xs font-bold dark:text-white">
                          {item.qty}
                        </td>
                        <td className="py-4 text-xs font-black text-right dark:text-white">
                          KES {item.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan="2"
                        className="pt-4 text-xs font-black uppercase text-slate-400"
                      >
                        Total Amount
                      </td>
                      <td className="pt-4 text-lg font-black text-right text-blue-600">
                        KES {selectedOrder.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => updateStatus(selectedOrder._id, "paid")}
                  className="flex-grow bg-green-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-green-600/20"
                >
                  Mark as Paid / Collected
                </button>
                <button
                  onClick={() => updateStatus(selectedOrder._id, "cancelled")}
                  className="px-8 border dark:border-slate-800 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                >
                  Cancel
                </button>
              </div>
              {/* Permanent Delete Option */}
              <button
                onClick={() => handleDeleteOrder(selectedOrder._id)}
                className="w-full py-3 text-slate-400 hover:text-red-600 text-[9px] font-black uppercase tracking-widest transition-colors"
              >
                Delete Order Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
