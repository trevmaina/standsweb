import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Users } from "lucide-react";

const Ministries = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ministries");
        const json = await res.json();
        if (json.success) {
          setMinistries(json.data);
        }
      } catch (err) {
        console.error("Error fetching ministries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMinistries();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">
          Loading Departments...
        </p>
      </div>
    );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-6xl font-black dark:text-white mb-4 uppercase tracking-tighter">
            Our Ministries
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl font-medium">
            Discover the various fellowships and departments at PCEA St.
            Andrews. Find where your heart belongs and serve the community.
          </p>
        </div>
        <div className="hidden md:block">
          <span className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            {ministries.length} Departments Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ministries.map((m) => (
          <div
            key={m._id}
            onClick={() => navigate(`/ministries/${m.slug}`)} // Using slug for dynamic routing
            className="group relative h-[450px] rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-[#161B22] cursor-pointer transition-all duration-500 hover:-translate-y-2 shadow-xl"
          >
            {/* Background Image */}
            <img
              src={`http://localhost:5000${m.coverImage}`}
              alt={m.name}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Content Container */}
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <span className="mb-4 inline-block w-fit px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                {m.category}
              </span>

              <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter leading-none">
                {m.name}
              </h3>

              <p className="text-gray-300 text-sm mb-8 line-clamp-2 font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                {m.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                  View Ministry{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </div>
                <Users
                  size={20}
                  className="text-white/20 group-hover:text-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ministries;
