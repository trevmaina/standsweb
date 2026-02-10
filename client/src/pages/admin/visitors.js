import React, { useState, useEffect } from "react";
import { UserPlus, Trash2, Mail, Phone, Loader2, Calendar } from "lucide-react";

const VisitorManager = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/forms?formType=New Visitor",
      );
      const json = await res.json();
      if (json.success) setVisitors(json.data);
    } catch (err) {
      console.error("Failed to fetch visitors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logic to Mark as Contacted (Update Status)
  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    try {
      const res = await fetch(`http://localhost:5000/api/forms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        // Update local state so the UI changes immediately
        setVisitors(
          visitors.map((v) => (v._id === id ? { ...v, status: newStatus } : v)),
        );
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Logic to Delete Entry
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this visitor record permanently?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/forms/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setVisitors(visitors.filter((v) => v._id !== id));
      }
    } catch (err) {
      alert("Failed to delete entry");
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
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-2xl text-green-600">
          <UserPlus size={32} />
        </div>
        <div>
          <h2 className="text-sm font-black text-green-600 uppercase tracking-widest mb-1">
            Hospitality
          </h2>
          <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter leading-none">
            New Visitors
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visitors.map((visitor) => (
          <div
            key={visitor._id}
            className="bg-white dark:bg-[#161B22] p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-xl group hover:border-green-500/50 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 group-hover:text-green-500 transition-colors">
                <UserPlus size={24} />
              </div>
              <span className="text-[9px] font-black text-slate-400 flex items-center gap-1">
                <Calendar size={10} />{" "}
                {new Date(visitor.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-4">
              {visitor.name}
            </h3>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                <Mail size={14} /> {visitor.email}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                <Phone size={14} /> {visitor.phone}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate(visitor._id, visitor.status)}
                className={`flex-grow py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                  visitor.status === "read"
                    ? "bg-slate-100 text-slate-400"
                    : "bg-green-600 text-white shadow-lg shadow-green-600/20"
                }`}
              >
                {visitor.status === "read" ? "Contacted" : "Mark Contacted"}
              </button>
              <button
                onClick={() => handleDelete(visitor._id)}
                className="p-3 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitorManager;
