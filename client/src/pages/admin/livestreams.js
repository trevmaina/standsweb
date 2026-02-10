import React, { useState, useEffect } from "react";
import { Radio, Save, Loader2, Link as LinkIcon, Clock, User, BookOpen } from "lucide-react";

const LivestreamManager = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/livestreams")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setStreams(json.data);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (id, updatedData) => {
    setSavingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/livestreams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (json.success) {
        setStreams(streams.map((s) => (s._id === id ? json.data : s)));
        alert(`${updatedData.congregation} details updated successfully!`);
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSavingId(null);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-black uppercase text-blue-500">
        Loading Switchboard...
      </div>
    );

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">
          Live Control
        </h2>
        <h1 className="text-5xl font-black dark:text-white uppercase tracking-tighter leading-none text-red-600 flex items-center gap-4">
          <Radio className="animate-pulse" size={40} /> Broadcast Switchboard
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {streams.map((stream) => (
          <div
            key={stream._id}
            className={`p-8 rounded-[2.5rem] border-2 transition-all ${stream.isActive ? "bg-red-50/50 dark:bg-red-900/10 border-red-500 shadow-xl shadow-red-500/10" : "bg-white dark:bg-[#002034] border-slate-200 dark:border-slate-800"}`}
          >
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-shrink-0 text-center lg:text-left min-w-[150px]">
                <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight">
                  {stream.congregation}
                </h3>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${stream.isActive ? "text-red-500" : "text-slate-400"}`}
                >
                  {stream.isActive ? "● Currently On Air" : "Offline"}
                </p>
              </div>

              {/* Youtube URL */}
              <div className="flex-grow grid md:grid-cols-2 gap-4 w-full">
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-[#000411] p-4 rounded-2xl">
                  <LinkIcon size={18} className="text-blue-600" />
                  <input
                    placeholder="YouTube Video URL"
                    className="bg-transparent border-none outline-none dark:text-white w-full font-bold text-sm"
                    value={stream.videoUrl}
                    onChange={(e) =>
                      setStreams(
                        streams.map((s) =>
                          s._id === stream._id
                            ? { ...s, videoUrl: e.target.value }
                            : s,
                        ),
                      )
                    }
                  />
                </div>
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-[#000411] p-4 rounded-2xl">
                  <Clock size={18} className="text-blue-600" />
                  <input
                    placeholder="Start Time (e.g. 10:30 AM)"
                    className="bg-transparent border-none outline-none dark:text-white w-full font-bold text-sm"
                    value={stream.startTime}
                    onChange={(e) =>
                      setStreams(
                        streams.map((s) =>
                          s._id === stream._id
                            ? { ...s, startTime: e.target.value }
                            : s,
                        ),
                      )
                    }
                  />
                </div>

                {/* NEW: Preacher Input */}
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-[#000411] p-4 rounded-2xl">
                  <User size={18} className="text-blue-600" />
                  <input
                    placeholder="Preacher Name"
                    className="bg-transparent border-none outline-none dark:text-white w-full font-bold text-sm"
                    value={stream.preacher || ""}
                    onChange={(e) =>
                      setStreams(
                        streams.map((s) =>
                          s._id === stream._id
                            ? { ...s, preacher: e.target.value }
                            : s,
                        ),
                      )
                    }
                  />
                </div>

                {/* NEW: Bible Readings Input */}
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-[#000411] p-4 rounded-2xl">
                  <BookOpen size={18} className="text-blue-600" />
                  <input
                    placeholder="Bible Readings (e.g. John 3:16)"
                    className="bg-transparent border-none outline-none dark:text-white w-full font-bold text-sm"
                    value={stream.bibleReadings || ""}
                    onChange={(e) =>
                      setStreams(
                        streams.map((s) =>
                          s._id === stream._id
                            ? { ...s, bibleReadings: e.target.value }
                            : s,
                        ),
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    handleUpdate(stream._id, {
                      ...stream,
                      isActive: !stream.isActive,
                    })
                  }
                  className={`px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${stream.isActive ? "bg-red-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}
                >
                  {stream.isActive ? "Go Offline" : "Go Live"}
                </button>
                <button
                  disabled={savingId === stream._id}
                  onClick={() => handleUpdate(stream._id, stream)}
                  className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingId === stream._id ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivestreamManager;
