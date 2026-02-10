import React, { useState, useEffect } from "react";
import {
  Heart,
  Trash2,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
} from "lucide-react";

const PrayerManager = () => {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/forms?formType=Prayer Request",
      );
      const json = await res.json();
      if (json.success) setPrayers(json.data);
    } catch (err) {
      console.error("Prayer load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/forms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchPrayers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prayer request?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/forms/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (json.success) {
        // Remove the deleted item from the local state immediately
        setPrayers(prayers.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete: " + json.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting.");
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
      <header className="flex items-center gap-4">
        <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-2xl text-purple-600">
          <Heart size={32} />
        </div>
        <div>
          <h2 className="text-sm font-black text-purple-600 uppercase tracking-widest mb-1">
            Pastoral Care
          </h2>
          <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
            Prayer Requests
          </h1>
        </div>
      </header>

      <div className="grid gap-6">
        {prayers.length > 0 ? (
          prayers.map((prayer) => (
            <div
              key={prayer._id}
              className="bg-white dark:bg-[#161B22] p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-xl flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-4 flex-grow">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                      prayer.status === "read"
                        ? "bg-green-100 text-green-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {prayer.status === "read" ? (
                      <CheckCircle size={10} />
                    ) : (
                      <Clock size={10} />
                    )}{" "}
                    {prayer.status}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    {new Date(prayer.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">
                  {prayer.name || "Anonymous Request"}
                </h3>

                <div className="flex gap-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {prayer.email || "No Email"}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-[#0D1117] p-6 rounded-2xl border dark:border-slate-800 italic text-slate-600 dark:text-slate-300">
                  <MessageSquare
                    size={16}
                    className="mb-2 text-purple-500 opacity-50"
                  />
                  "{prayer.message}"
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-3">
                <button
                  onClick={() => updateStatus(prayer._id, "read")}
                  className="p-4 bg-purple-600 text-white rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-purple-600/20"
                  title="Mark as Prayed For"
                >
                  <CheckCircle size={24} />
                </button>
                <button
                  onClick={() => handleDelete(prayer._id)}
                  className="p-4 bg-slate-100 dark:bg-slate-800 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
              No active prayer requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerManager;
