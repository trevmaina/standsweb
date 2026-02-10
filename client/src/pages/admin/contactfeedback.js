import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Trash2,
  Mail,
  Phone,
  Loader2,
  Calendar,
} from "lucide-react";

const ContactFeedbackManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/forms?formType=Contact Message")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setMessages(json.data);
        setLoading(false);
      });
  }, []);

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    await fetch(`http://localhost:5000/api/forms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setMessages(
      messages.map((m) => (m._id === id ? { ...m, status: newStatus } : m)),
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await fetch(`http://localhost:5000/api/forms/${id}`, { method: "DELETE" });
    setMessages(messages.filter((m) => m._id !== id));
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
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl text-blue-600">
          <MessageSquare size={32} />
        </div>
        <div>
          <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">
            Public Inquiries
          </h2>
          <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter leading-none">
            Contact Feedback
          </h1>
        </div>
      </header>

      <div className="grid gap-6">
        {messages.length > 0 ? (
          messages.map((m) => (
            <div
              key={m._id}
              className={`bg-white dark:bg-[#161B22] p-8 rounded-[2.5rem] border transition-all ${m.status === "read" ? "opacity-50 border-transparent" : "border-slate-100 dark:border-slate-800 shadow-xl"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">
                    {m.name}
                  </h3>
                  <div className="flex gap-4 mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {m.email}
                    </span>
                    {m.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {m.phone}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                  <Calendar size={12} />{" "}
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl italic leading-relaxed">
                "{m.message}"
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(m._id, m.status)}
                  className={`flex-grow py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${m.status === "read" ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20"}`}
                >
                  {m.status === "read" ? "Marked as Handled" : "Mark as Read"}
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="p-3 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
              No messages yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactFeedbackManager;
