import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  User,
  Radio,
  Video,
  History,
} from "lucide-react";
import { getYouTubeID } from "../utils/helpers";

const Sermons = () => {
  const [viewTab, setViewTab] = useState("live"); // 'live' or 'past'
  const [filterTab, setFilterTab] = useState("All");
  const [sermons, setSermons] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  const congregations = ["All", "Main", "Youth", "Children", "French", "Deaf"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sermonRes, streamRes] = await Promise.all([
          fetch("http://localhost:5000/api/sermons"),
          fetch("http://localhost:5000/api/livestreams"),
        ]);
        const sermonJson = await sermonRes.json();
        const streamJson = await streamRes.json();

        if (sermonJson.success) setSermons(sermonJson.data);
        if (streamJson.success) setStreams(streamJson.data);
      } catch (error) {
        console.error("Error loading media:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSermons = sermons.filter((s) =>
    filterTab === "All" ? true : s.congregation === filterTab,
  );

  const activeStreams = streams.filter((s) => s.isActive);

  if (loading)
    return (
      <div className="pt-40 text-center font-black uppercase tracking-widest text-blue-600 animate-pulse">
        Opening the archives...
      </div>
    );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
          Media Center
        </p>
        <h1 className="text-5xl font-black dark:text-white uppercase tracking-tighter">
          Sermons & Services
        </h1>
      </div>

      {/* PRIMARY TABS: LIVE VS PAST */}
      <div className="flex gap-4 mb-16 bg-slate-100 dark:bg-slate-900 p-2 rounded-[2rem] w-fit">
        <button
          onClick={() => setViewTab("live")}
          className={`flex items-center gap-2 px-8 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all ${viewTab === "live" ? "bg-white dark:bg-red-600 text-red-600 dark:text-white shadow-xl" : "text-slate-500"}`}
        >
          <Radio
            size={18}
            className={activeStreams.length > 0 ? "animate-pulse" : ""}
          />
          Live Broadcasts{" "}
          {activeStreams.length > 0 && (
            <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded text-[8px]">
              {activeStreams.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setViewTab("past")}
          className={`flex items-center gap-2 px-8 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all ${viewTab === "past" ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xl" : "text-slate-500"}`}
        >
          <History size={18} /> Past Sermons
        </button>
      </div>

      {/* VIEW: LIVE TAB */}
      {viewTab === "live" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeStreams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeStreams.map((stream) => (
                <div
                  key={stream._id}
                  className="bg-white dark:bg-[#161B22] border-2 border-red-600/20 rounded-[3rem] overflow-hidden p-10 shadow-2xl relative"
                >
                  <div className="absolute top-10 right-10 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-[8px] font-black animate-pulse">
                    LIVE
                  </div>
                  <h3 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-2">
                    {stream.congregation} Service
                  </h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-8">
                    Started at {stream.startTime}
                  </p>
                  <Link
                    to="/live"
                    className="inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:scale-105 transition-all"
                  >
                    Watch Live Now <Play size={16} fill="currentColor" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Video size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">
                No active livestreams available
              </h3>
              <p className="text-slate-500 text-xs mt-2 uppercase font-bold">
                Check back during scheduled service times
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW: PAST SERMONS TAB */}
      {viewTab === "past" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Sub-Filters */}
          <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
            {congregations.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${filterTab === tab ? "bg-blue-700 text-white shadow-xl" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredSermons.map((sermon) => (
              <div
                key={sermon._id}
                className="group relative overflow-hidden rounded-[2.5rem] aspect-[4/5] shadow-2xl border dark:border-gray-800 bg-slate-900"
              >
                <img
                  src={
                    sermon.thumbnail ||
                    `https://img.youtube.com/vi/${getYouTubeID(sermon.videoUrl)}/maxresdefault.jpg`
                  }
                  alt={sermon.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
                  <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter leading-none">
                    {sermon.title}
                  </h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-blue-400 text-[11px] font-black uppercase tracking-widest">
                      <User size={14} /> <span>{sermon.preacher}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-[11px] font-bold uppercase tracking-widest">
                      <History size={14} />{" "}
                      <span>{new Date(sermon.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link
                    to={`/sermons/${sermon._id}`}
                    className="w-full bg-white text-blue-900 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Watch Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sermons;
