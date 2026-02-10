import React, { useState, useEffect } from "react";
import { Clock, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const [isLive, setIsLive] = useState(false);
  const [liveLink, setLiveLink] = useState("");

  // Physical Schedule Data from your reference image
  const physicalSchedule = [
    { name: "08:30AM Service", time: "08:30AM - 10:30AM", venue: "Youth Hall" },
    {
      name: "Main Service",
      time: "09:00AM - 10:30AM",
      venue: "Main Sanctuary",
    },
    {
      name: "11:30AM Service",
      time: "11:30AM - 01:30PM",
      venue: "Main Sanctuary",
    },
    { name: "Ignite Service", time: "11:30AM - 01:00PM", venue: "Youth Hall" },
    { name: "Fishers (Teens)", time: "09:00AM - 10:30AM", venue: "Old Church" },
    { name: "Deaf Service", time: "11:30AM - 01:00PM", venue: "Youth Annex" },
    { name: "French Service", time: "11:00AM - 12:30PM", venue: "Old Church" },
    {
      name: "Church School",
      time: "09:30AM - 12:30PM",
      venue: "Church Hall 1",
    },
    { name: "Crossroads", time: "09:30AM - 10:30AM", venue: "Church Hall 1" },
  ];

  useEffect(() => {
    // Check for active livestream
    fetch("http://localhost:5000/api/livestreams")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          const activeStream = json.data.find((stream) => stream.isActive);
          if (activeStream) {
            setIsLive(true);
            setLiveLink(activeStream.url);
          }
        }
      });
  }, []);

  return (
    <section className="py-32 bg-white dark:bg-[#000411] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADER */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 px-4 py-2 rounded-full mb-6">
            <ShieldCheck size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
              Established Schedule
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black dark:text-white uppercase tracking-tighter leading-none mb-4">
            Physical <span className="text-blue-600 italic">Presence</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Join us physically at our various halls
          </p>
        </div>

        {/* STATIC PHYSICAL SCHEDULE TABLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 shadow-2xl rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-[#161B22] border-4 border-slate-100 dark:border-[#161B22]">
          {physicalSchedule.map((service, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#000411] p-10 hover:bg-blue-600 group transition-all duration-500"
            >
              <p className="text-[10px] font-black uppercase text-blue-600 group-hover:text-white/60 mb-2 tracking-widest">
                {service.venue}
              </p>
              <h3 className="text-2xl font-black dark:text-white group-hover:text-white uppercase tracking-tighter mb-4 leading-none">
                {service.name}
              </h3>
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-white/80 font-bold text-sm italic">
                <Clock size={16} /> {service.time}
              </div>
            </div>
          ))}
        </div>

        {/* DYNAMIC LIVESTREAM SECTION */}
        {isLive && (
          <div className="mt-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="bg-red-600 rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-red-600/30">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <div className="w-4 h-4 bg-white rounded-full animate-ping" />
                  <span className="text-xs font-black uppercase tracking-[0.4em]">
                    Broadcast Live Now
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                  Experience it{" "}
                  <span className="italic opacity-70">Digitally</span>
                </h2>
                <p className="text-white/80 font-bold max-w-md">
                  Our service is currently being broadcasted live for our global
                  community.
                </p>
              </div>

              <Link
                to={`/sermons?tab=livestream&url=${encodeURIComponent(liveLink)}`} // Passing a query parameter to tell the sermons page which tab to open
                className="bg-white text-red-600 px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 hover:scale-110 transition-transform shadow-2xl"
              >
                Watch Stream <ExternalLink size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
