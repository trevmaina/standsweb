import React, { useEffect, useState } from "react";
import {
  Award,
  Mail,
  Phone,
  Clock,
  Trash2,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICTVolunteers = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ictform/volunteers");
      const json = await res.json();
      if (json.success) setApps(json.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/ictform/volunteer/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (res.ok) fetchApps();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const deleteApp = async (id) => {
    if (!window.confirm("Are you sure you want to remove this entry?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/ictmedia/volunteer/${id}`,
        { method: "DELETE" },
      );
      if (res.ok) fetchApps();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Filter data into two lists
  const pendingApps = apps.filter((app) => app.status !== "Approved");
  const approvedSquad = apps.filter((app) => app.status === "Approved");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#000411] min-h-screen">
        {/* High-tech spinner to match the Command Center vibe */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin"></div>
          <Cpu
            className="absolute inset-0 m-auto text-blue-600 animate-pulse"
            size={24}
          />
        </div>
        <p className="mt-6 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
          Accessing Database...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#000411] text-white">
      {/* SECTION 1: NEW APPLICANTS (TOP) */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-yellow-500" size={24} />
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            New <span className="text-yellow-500">Applications</span>
          </h2>
        </div>

        <div className="grid gap-4">
          <AnimatePresence>
            {pendingApps.map((app) => (
              <motion.div
                key={app._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden"
              >
                <div className="flex items-center gap-6 w-full lg:w-1/3">
                  <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-600/20">
                    {app.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase leading-none mb-2">
                      {app.fullName}
                    </h3>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">
                        {app.squadChoice}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white/10 px-2 py-1 rounded">
                        {app.experienceLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DIRECT CONTACT INFO */}
                <div className="flex flex-col gap-2 w-full lg:w-1/3">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                    <Phone size={14} className="text-blue-500" /> {app.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                    <Mail size={14} className="text-blue-500" /> {app.email}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
                  <button
                    onClick={() => updateStatus(app._id, "Approved")}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600/10 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all"
                  >
                    <CheckCircle2 size={14} /> Approve & List
                  </button>
                  <button
                    onClick={() => deleteApp(app._id)}
                    className="p-4 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 2: APPROVED SQUAD ROSTER (BOTTOM) */}
      <div className="mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Award className="text-blue-500" size={24} />
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Active <span className="text-blue-500">Squad Roster</span>
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="px-8 py-6">Member Name</th>
                <th className="px-8 py-6">Assigned Squad</th>
                <th className="px-8 py-6">Contact Info</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedSquad.map((member) => (
                <tr
                  key={member._id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-8 py-6 font-black uppercase text-sm">
                    {member.fullName}
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {member.squadChoice}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-400 font-bold">
                    <div>{member.email}</div>
                    <div className="mt-1">{member.phone}</div>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button
                      onClick={() => updateStatus(member._id, "Pending")}
                      className="p-3 bg-slate-100/5 text-slate-400 rounded-lg hover:text-blue-500 transition-all"
                      title="Demote to Pending"
                    >
                      <Clock size={14} />
                    </button>
                    <button
                      onClick={() => deleteApp(member._id)}
                      className="p-3 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ICTVolunteers;
