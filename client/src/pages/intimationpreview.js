import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Calendar,
  Loader2,
  Share2,
} from "lucide-react";

const IntimationPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/intimations`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const item = json.data.find((i) => i._id === id);
          setData(item);
        }
      } catch (err) {
        console.error("Preview load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000411]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  if (!data)
    return (
      <div className="pt-40 text-center uppercase font-black dark:text-white">
        Notice not found
      </div>
    );

  return (
    <div className="pt-28 md:pt-36 pb-10 px-4 md:px-8 max-w-6xl mx-auto min-h-screen flex flex-col animate-in fade-in duration-700">
      {/* TOP NAVIGATION TOOLS */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all"
        >
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ArrowLeft size={14} />
          </div>
          Back to Library
        </button>

        <div className="flex gap-2">
          <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
            <Share2 size={18} />
          </button>
          <a
            href={`http://localhost:5000${data.fileUrl}`}
            download
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Download size={16} /> Save PDF
          </a>
        </div>
      </div>

      {/* DOCUMENT HEADER */}
      <div className="text-center mb-10">
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 ${
            data.category === "youth"
              ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
              : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          }`}
        >
          {data.category === "main" ? "Main Service" : "Youth Service"}
        </span>
        <h1 className="text-4xl md:text-6xl font-black dark:text-white uppercase tracking-tighter leading-none mb-4">
          {data.title}
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <Calendar size={14} className="text-blue-600" />{" "}
          {new Date(data.date).toDateString()}
        </div>
      </div>

      {/* RESPONSIVE VIEWER CONTAINER */}
      <div className="relative flex-grow w-full bg-slate-200 dark:bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 min-h-[600px] md:min-h-[850px] mb-10">
        <iframe
          src={`http://localhost:5000${data.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          width="100%"
          height="100%"
          className="absolute inset-0 border-none"
          title={data.title}
        />
      </div>

      {/* FOOTER NOTE */}
      <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 pb-10">
        PCEA ST. ANDREWS MEDIA REPOSITORY
      </p>
    </div>
  );
};

export default IntimationPreview;
