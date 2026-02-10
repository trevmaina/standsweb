import React, { useState, useEffect } from "react";
import { Calendar, User, ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SermonPreview = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/sermons/latest")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSermons(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !sermons || sermons.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
          <div>
            <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              Archives
            </p>
            <h2 className="text-5xl font-black dark:text-white uppercase tracking-tighter">
              Recent Messages
            </h2>
          </div>
          <Link
            to="/sermons"
            className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest hover:gap-4 transition-all group"
          >
            Browse All{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sermons.map((sermon) => {
            // SAFE CHECK FOR THUMBNAIL
            const thumb =
              sermon.thumbnail && sermon.thumbnail.startsWith("http")
                ? sermon.thumbnail
                : `http://localhost:5000${sermon.thumbnail || ""}`;

            return (
              <div
                key={sermon._id}
                className="group bg-slate-900 rounded-[3rem] overflow-hidden relative aspect-video shadow-2xl"
              >
                <img
                  src={thumb}
                  alt={sermon.title}
                  className="w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
                />
                <div className="absolute inset-0 p-10 flex flex-col justify-end z-20 text-left">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                    {sermon.title}
                  </h3>
                  <div className="flex gap-6 text-slate-300 font-bold text-[10px] uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-2">
                      <User size={14} className="text-blue-500" />{" "}
                      {sermon.preacher}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" />{" "}
                      {new Date(sermon.date).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    to={`/sermons/${sermon._id}`}
                    className="w-fit bg-white text-blue-900 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                  >
                    <PlayCircle size={16} /> Watch Message
                  </Link>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SermonPreview;
