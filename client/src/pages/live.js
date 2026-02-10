import React, { useState, useEffect } from "react";
import { Radio, Clock, Share2, User, BookOpen } from "lucide-react";
import { getYouTubeID } from "../utils/helpers";

const LivePage = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/livestreams")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setStreams(json.data.filter((s) => s.isActive));
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="pt-40 text-center animate-pulse font-black uppercase text-blue-600">
        Connecting to stream...
      </div>
    );

  if (streams.length === 0)
    return (
      <div className="pt-40 text-center min-h-screen">
        <Radio size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-black uppercase text-slate-400">
          No active broadcasts
        </h2>
        <p className="text-slate-500 text-xs mt-2 uppercase font-bold tracking-widest">
          Tune in during service hours
        </p>
      </div>
    );

  const currentStream = streams[0];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-[10px] tracking-widest animate-pulse flex items-center gap-2">
          <Radio size={14} /> LIVE NOW
        </div>
        <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
          {currentStream.congregation} Live Broadcast
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl border dark:border-slate-800">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${getYouTubeID(currentStream.videoUrl)}?autoplay=1`}
              title="Live Service"
              frameBorder="0"
              allowFullScreen
            />
          </div>
          <div className="p-10 bg-white dark:bg-[#161B22] rounded-[3rem] border dark:border-slate-800 shadow-xl">
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-4">
              {currentStream.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Preacher
                  </p>
                  <p className="font-bold dark:text-white uppercase">
                    {currentStream.preacher || "Parish Minister"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Bible Readings
                  </p>
                  <p className="font-bold dark:text-white uppercase">
                    {currentStream.bibleReadings || "Check Bulletin"}
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t dark:border-slate-800 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                <Clock size={14} /> Started: {currentStream.startTime}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-blue-600 text-white rounded-[2.5rem] shadow-xl">
            <h4 className="font-black uppercase text-[10px] tracking-[0.2em] mb-4 opacity-70">
              Welcome to Service
            </h4>
            <p className="text-lg font-bold leading-tight">
              Join us in the chat on YouTube or follow along here with our
              shared resources.
            </p>
          </div>
          <button
            onClick={() => window.open(currentStream.videoUrl)}
            className="w-full p-6 bg-slate-100 dark:bg-slate-900 rounded-[2rem] font-black uppercase text-xs dark:text-white flex items-center justify-center gap-3 border dark:border-slate-800"
          >
            <Share2 size={18} /> Open on YouTube
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivePage;
