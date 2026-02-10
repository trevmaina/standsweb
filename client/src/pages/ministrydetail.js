import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  User,
  Calendar,
  BookOpen,
  Target,
  Loader2,
  Clock,
} from "lucide-react";

const MinistryDetail = () => {
  const { id } = useParams(); // Using the slug/id from the URL
  const navigate = useNavigate();
  const [ministry, setMinistry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMinistry = async () => {
      try {
        // Fetching by slug/id from the backend
        const res = await fetch(`http://localhost:5000/api/ministries/${id}`);
        const json = await res.json();
        if (json.success) {
          setMinistry(json.data);
        }
      } catch (err) {
        console.error("Error fetching ministry:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMinistry();
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="font-black uppercase tracking-widest text-xs text-slate-400">
          Loading Ministry Details...
        </p>
      </div>
    );

  if (!ministry)
    return (
      <div className="pt-40 text-center min-h-screen">
        <h2 className="text-2xl font-black uppercase text-slate-400">
          Ministry Not Found
        </h2>
        <button
          onClick={() => navigate("/ministries")}
          className="mt-4 text-blue-600 font-bold uppercase text-xs"
        >
          Return to Ministries
        </button>
      </div>
    );

  return (
    <div className="min-h-screen pb-20 bg-white dark:bg-[#000411]">
      {/* Header Banner */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <img
          src={
            ministry.coverImage
              ? `http://localhost:5000${ministry.coverImage}`
              : "/placeholder-church.jpg"
          }
          alt={ministry.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter text-center px-6">
            {ministry.name}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white dark:bg-slate-900 shadow-2xl px-8 py-4 rounded-2xl text-slate-500 hover:text-blue-700 mb-12 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={16} /> Back to Ministries
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-blue-700">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">
                  Our Mission & Purpose
                </h2>
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {ministry.description}
              </p>

              {ministry.vision && (
                <div className="p-10 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-l-[12px] border-blue-600 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-blue-600 mb-4 tracking-widest">
                    Ministry Vision
                  </p>
                  <p className="text-2xl dark:text-slate-200 italic font-serif leading-snug">
                    "{ministry.vision}"
                  </p>
                </div>
              )}
            </section>

            <section className="bg-slate-50 dark:bg-[#161B22] p-10 rounded-[3rem] border dark:border-slate-800 shadow-inner">
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="text-blue-600" />
                <h3 className="font-black uppercase tracking-widest text-xs dark:text-white">
                  Gathering Times
                </h3>
              </div>
              <div className="flex items-center gap-5 p-8 bg-white dark:bg-[#0D1117] rounded-3xl shadow-sm border dark:border-slate-800">
                <div className="p-4 bg-blue-600 text-white rounded-2xl">
                  <Clock size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Weekly Schedule
                  </p>
                  <p className="font-black text-2xl dark:text-white uppercase tracking-tight">
                    {ministry.meetingTime || "Regularly Scheduled"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-blue-900 text-white p-10 rounded-[3.5rem] shadow-2xl shadow-blue-900/30">
              <div className="flex items-center gap-3 mb-6 opacity-80">
                <Target size={24} />
                <h4 className="font-black uppercase text-[10px] tracking-widest">
                  Target Group
                </h4>
              </div>
              <p className="text-3xl font-black uppercase leading-tight tracking-tighter">
                {ministry.targetGroup || "All Congregation"}
              </p>
            </div>

            <div className="bg-white dark:bg-[#161B22] p-10 rounded-[3.5rem] border dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-3 mb-10 text-blue-600">
                <Users size={26} />
                <h4 className="font-black uppercase text-[10px] tracking-widest dark:text-white">
                  Leadership Roster
                </h4>
              </div>

              {/* Primary Leader */}
              <div className="mb-10 border-b dark:border-slate-800 pb-8">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
                  Presiding Leader
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <User size={20} />
                  </div>
                  <p className="text-2xl font-black dark:text-white uppercase tracking-tighter">
                    {ministry.primaryLeaderName || "Parish Elder"}
                  </p>
                </div>
              </div>

              {/* Additional Leaders List */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Leadership Team
                </p>
                <div className="whitespace-pre-line text-[13px] font-bold dark:text-slate-300 leading-relaxed text-slate-600">
                  {ministry.leadersList || "Records being updated..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinistryDetail;
