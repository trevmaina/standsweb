import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Info, Eye, Calendar, Loader2 } from "lucide-react";

const Intimations = () => {
  const [intimations, setIntimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const navigate = useNavigate();

  useEffect(() => {
    const loadIntimations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/intimations");
        const json = await res.json();

        // CRITICAL FIX: Extract the array from the object
        if (json.success && Array.isArray(json.data)) {
          setIntimations(json.data);
        } else {
          console.error("Data is not in the expected array format", json);
        }
      } catch (err) {
        console.error("Connection error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadIntimations();
  }, []);

  // Filter Logic
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const current = intimations.slice(0, 2);
  const past = intimations
    .filter((i) => new Date(i.date) >= twoMonthsAgo)
    .slice(2, 18);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Loading Library...
        </p>
      </div>
    );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
          Notice Board
        </h2>
        <h1 className="text-5xl md:text-7xl font-black dark:text-white uppercase tracking-tighter">
          Intimations
        </h1>
      </div>

      {/* TAB SYSTEM */}
      <div className="flex gap-8 mb-12 border-b dark:border-slate-800 pb-4">
        {["current", "past"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab === "current" ? "Latest Notices" : "2-Month Archive"}
          </button>
        ))}
      </div>

      {/* GRID DISPLAY */}
      <div
        className={
          activeTab === "current"
            ? "grid md:grid-cols-2 gap-8"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        }
      >
        {(activeTab === "current" ? current : past).length > 0 ? (
          (activeTab === "current" ? current : past).map((i) => (
            <IntimationCard
              key={i._id}
              data={i}
              featured={activeTab === "current"}
              // Directs to the separate preview page
              onSelect={() => navigate(`/intimations/preview/${i._id}`)}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
              No records found for this section
            </p>
          </div>
        )}
      </div>

      {activeTab === "past" && (
        <div className="p-8 mt-16 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30 flex items-start gap-4 max-w-3xl">
          <Info className="text-blue-600 shrink-0" size={24} />
          <p className="text-sm text-blue-900 dark:text-blue-400 font-bold leading-relaxed uppercase tracking-tight">
            Notice: Records for the past 2 months are listed here. For older
            intimations, contact the Media Team.
          </p>
        </div>
      )}
    </div>
  );
};

const IntimationCard = ({ data, featured, onSelect }) => (
  <div
    className={`group p-10 rounded-[2.5rem] border transition-all duration-500 ${featured ? "bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-600/20" : "bg-white dark:bg-[#161B22] border-slate-100 dark:border-slate-800 hover:border-blue-600"}`}
  >
    <div className="flex justify-between items-start mb-8">
      <div
        className={`p-4 rounded-2xl ${featured ? "bg-white/10" : "bg-blue-50 dark:bg-blue-900/20"}`}
      >
        <FileText
          className={featured ? "text-white" : "text-blue-600"}
          size={28}
        />
      </div>
      <span
        className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${featured ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
      >
        {data.category === "main" ? "Main Service" : "Youth Service"}
      </span>
    </div>

    <h3 className="font-black uppercase text-2xl mb-2 tracking-tighter leading-none">
      {data.title}
    </h3>

    <div
      className={`flex items-center gap-2 text-[10px] font-bold uppercase mb-10 ${featured ? "text-white/60" : "text-slate-400"}`}
    >
      <Calendar size={12} /> {new Date(data.date).toDateString()}
    </div>

    <div className="flex flex-col gap-3">
      <button
        onClick={onSelect}
        className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${featured ? "bg-white text-blue-600 hover:scale-[1.02]" : "bg-blue-600 text-white"}`}
      >
        <Eye size={16} /> Open Preview
      </button>

      <a
        href={`http://localhost:5000${data.fileUrl}`}
        download
        className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border transition-all ${featured ? "border-white/20 text-white hover:bg-white/10" : "border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600"}`}
      >
        <Download size={16} /> Download
      </a>
    </div>
  </div>
);

export default Intimations;
