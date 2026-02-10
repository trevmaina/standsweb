import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  User,
  MapPin,
  Share2,
  ArrowLeft,
  Youtube,
  BookOpen,
  Heart,
  Play,
} from "lucide-react";
import { getYouTubeID } from "../utils/helpers";

const WatchSermon = () => {
  const { id } = useParams();
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        // Ensure the URL matches your server route: /api/sermons/:id
        const res = await fetch(`http://localhost:5000/api/sermons/${id}`);
        const json = await res.json();
        if (json.success) {
          setSermon(json.data);
        } else {
          console.error("Server returned success:false", json.message);
        }
      } catch (err) {
        console.error("Network error fetching sermon:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSermon();
  }, [id]);

  useEffect(() => {
    if (sermon) {
      const fetchRelated = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/sermons");
          const json = await res.json();
          if (json.success) {
            const filtered = json.data
              .filter(
                (s) =>
                  s.congregation === sermon.congregation &&
                  s._id !== sermon._id,
              )
              .slice(0, 3);
            setRelated(filtered);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchRelated();
    }
  }, [sermon]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:text-white font-black uppercase tracking-widest animate-pulse">
        Loading...
      </div>
    );
  if (!sermon)
    return (
      <div className="min-h-screen flex items-center justify-center dark:text-white">
        Sermon not found.
      </div>
    );

  const videoId = getYouTubeID(sermon.videoUrl);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <Link
        to="/sermons"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all mb-8 font-black text-[10px] uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={16} /> Return to Media Center
      </Link>

      {/*Sermon Details Grid*/}
      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-10">
          <div className="aspect-video w-full rounded-[3rem] overflow-hidden bg-black shadow-2xl border-8 border-white dark:border-slate-800">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={sermon.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-black dark:text-white leading-[0.9] uppercase tracking-tighter">
              {sermon.title}
            </h1>
            <div className="flex flex-wrap gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <User size={16} className="text-blue-600" /> {sermon.preacher}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />{" "}
                {new Date(sermon.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />{" "}
                {sermon.congregation}
              </span>
            </div>

            <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border-l-8 border-blue-600 mt-10">
              <h4 className="flex items-center gap-2 font-black uppercase text-xs text-blue-700 mb-4">
                <BookOpen size={16} /> Bible Readings
              </h4>
              <p className="text-xl font-bold dark:text-white italic">
                {sermon.bibleReadings ||
                  "Check back soon for the scripture references."}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar*/}
        <div className="space-y-8">
          <div className="bg-slate-50 dark:bg-[#002034] p-10 rounded-[3rem] border dark:border-[#001D30] space-y-6">
            <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">
              Sermon Notes
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              {sermon.description ||
                "No description provided for this message."}
            </p>
            <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all hover:bg-green-700">
              <Share2 size={18} /> WhatsApp Share
            </button>
            <a
              href={sermon.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full border-2 border-slate-200 dark:border-slate-700 dark:text-white py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-white transition-all"
            >
              <Youtube size={18} /> YouTube Link
            </a>
          </div>

          <div className="bg-blue-600 p-10 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-blue-900/30">
            <Heart size={40} fill="white" className="opacity-20" />
            <h4 className="font-black uppercase tracking-tighter text-3xl leading-none">
              Generosity
            </h4>
            <p className="text-blue-100 text-sm font-bold opacity-80 leading-snug">
              Supported this message? Your giving helps us reach more souls with
              the gospel.
            </p>
            <Link
              to="/give"
              className="block w-full bg-white text-blue-900 py-4 rounded-2xl font-black text-center uppercase text-xs hover:scale-105 transition-all"
            >
              Support this Ministry
            </Link>
          </div>
        </div>

        {/* --- PLACE THE RELATED SECTION HERE --- */}
        {related.length > 0 && (
          <div className="mt-20 border-t dark:border-slate-800 pt-12">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
                More from {sermon.congregation} Church
              </h3>
              <Link
                to="/sermons"
                className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((item) => (
                <Link
                  key={item._id}
                  to={`/sermons/${item._id}`}
                  className="group block space-y-4"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="aspect-video rounded-[2rem] overflow-hidden bg-slate-900 border dark:border-slate-800 relative">
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeID(item.videoUrl)}/mqdefault.jpg`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-100"
                      alt={item.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play
                        size={24}
                        className="text-white"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-black dark:text-white group-hover:text-blue-600 transition-colors leading-tight uppercase text-sm">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* --- END OF RELATED SECTION --- */}
      </div>
    </div>
  );
};

export default WatchSermon;
