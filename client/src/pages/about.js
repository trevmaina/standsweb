import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, BookOpen } from "lucide-react"; // Removed Users, Calendar

const About = () => {
  const [activeTab, setActiveTab] = useState("church");
  const [data, setData] = useState({ church: {}, leaders: [], districts: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/about/all");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Error fetching about data:", err);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: "church", label: "Our Church" },
    { id: "leadership", label: "Leadership" },
    { id: "districts", label: "Districts" },
  ];

  const leadershipCategories = [
    "Pastoral Team",
    "Elders",
    "Deacons",
    "Ministry Leaders",
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-5xl font-black dark:text-white mb-4 uppercase tracking-tighter">
          About Our Parish
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-widest">
          History • Leadership • Community
        </p>
      </div>

      {/* TAB SELECTOR */}
      <div className="flex border-b dark:border-gray-800 mb-12 gap-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} // Used setActiveTab here
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id
                ? "text-blue-700"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-700 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* CHURCH TAB */}
      {activeTab === "church" && (
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
            <BookOpen className="text-blue-700" size={32} /> Our Legacy & Vision
          </h2>
          <div className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed space-y-8 text-lg">
            <p>
              {data.church?.history ||
                "The PCEA St. Andrews Church history details go here..."}
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="p-10 bg-blue-600 text-white rounded-[3rem] shadow-xl shadow-blue-900/20">
                <h4 className="font-black uppercase text-xs tracking-widest mb-4 opacity-70">
                  Our Mission
                </h4>
                <p className="text-xl font-bold leading-tight">
                  {data.church?.mission || "To fulfill the great commission..."}
                </p>
              </div>
              <div className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-xl">
                <h4 className="font-black uppercase text-xs tracking-widest mb-4 opacity-70">
                  Our Vision
                </h4>
                <p className="text-xl font-bold leading-tight">
                  {data.church?.vision || "A Christ-centered church..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEADERSHIP TAB */}
      {activeTab === "leadership" && (
        <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4">
          {leadershipCategories.map((cat) => (
            <div key={cat}>
              <h3 className="text-sm font-black text-blue-700 uppercase tracking-[0.3em] mb-10 border-b dark:border-slate-800 pb-4">
                {cat}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {data.leaders
                  .filter((l) => l.category === cat)
                  .map((leader, i) => (
                    <div key={i} className="text-center group">
                      <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] mb-6 overflow-hidden border-4 border-transparent group-hover:border-blue-600 transition-all">
                        <img
                          src={
                            leader.image
                              ? `http://localhost:5000${leader.image}`
                              : "/placeholder-leader.jpg"
                          }
                          alt={leader.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      <h4 className="font-black dark:text-white uppercase text-sm tracking-tight">
                        {leader.name}
                      </h4>
                      <p className="text-[10px] text-blue-600 font-black uppercase mt-1 tracking-widest">
                        {leader.role}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DISTRICTS TAB SECTION */}
      {activeTab === "districts" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
          {data.districts.map((district) => (
            <div
              key={district._id}
              className="p-10 rounded-[3rem] bg-white dark:bg-[#161B22] border dark:border-slate-800 shadow-xl group hover:-translate-y-2 transition-all"
            >
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl w-fit mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <MapPin size={32} />
              </div>
              <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-4">
                {district.name}
              </h3>

              {/* REPLACED ELDER WITH LOCATION PREVIEW */}
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 line-clamp-2">
                {district.locationDescription ||
                  "Community Fellowship & Prayer"}
              </p>

              <button
                onClick={() => navigate(`/about/district/${district._id}`)}
                className="flex items-center gap-2 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all"
              >
                Explore District <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default About;
