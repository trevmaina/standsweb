import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  Trash2,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";

const JoinCommunityManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/forms?formType=Community Join")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setRequests(json.data);
        setLoading(false);
      });
  }, []);

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    const res = await fetch(`http://localhost:5000/api/forms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setRequests(
        requests.map((r) => (r._id === id ? { ...r, status: newStatus } : r)),
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    await fetch(`http://localhost:5000/api/forms/${id}`, { method: "DELETE" });
    setRequests(requests.filter((r) => r._id !== id));
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-10">
      <header className="flex items-center gap-4">
        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl text-indigo-600">
          <Users size={32} />
        </div>
        <div>
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1">
            Growth & Fellowship
          </h2>
          <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
            Community Requests
          </h1>
        </div>
      </header>

      <div className="grid gap-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className={`bg-white dark:bg-[#161B22] p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row justify-between items-center gap-6 ${req.status === "read" ? "opacity-60 border-transparent" : "border-slate-100 dark:border-slate-800 shadow-xl"}`}
          >
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Interested in: {req.message}
                </span>
              </div>
              <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">
                {req.name}
              </h3>
              <div className="flex gap-4 mt-2 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail size={14} /> {req.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={14} /> {req.phone}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate(req._id, req.status)}
                className={`p-4 rounded-2xl transition-all ${req.status === "read" ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"}`}
              >
                <CheckCircle size={24} />
              </button>
              <button
                onClick={() => handleDelete(req._id)}
                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinCommunityManager;
