import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Music,
  Monitor,
  Image as ImageIcon,
  Rocket,
  Target,
  X,
  Cpu,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MediaMinistry = () => {
  // --- STATE ---
  const [activeSquad, setActiveSquad] = useState(0);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic Content State
  const [content, setContent] = useState({
    leaders: [],
    ictStaff: [],
    squads: [],
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    squadChoice: "Select Squad",
    experienceLevel: "Level",
  });

  // --- FETCH CONTENT ---
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ictmedia/content");
        const json = await res.json();
        if (json.success && json.data) {
          setContent(json.data);
        }
      } catch (err) {
        console.error("Error fetching media content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // --- LOGIC ---
  const handleSquadTabChange = (index) => {
    setActiveSquad(index);
    setCurrentImgIdx(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/ictform/volunteer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();
      if (data.success) {
        alert("Application sent successfully!");
        setShowForm(false);
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          squadChoice: "Select Squad",
          experienceLevel: "Level",
        });
      }
    } catch (err) {
      alert("Failed to send application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#000411] flex items-center justify-center text-blue-600 font-black">
        LOADING COMMAND CENTER...
      </div>
    );

  // Map squad icons based on name if not provided by backend
  const getIcon = (name) => {
    if (name.includes("Camera")) return <Camera />;
    if (name.includes("Sound")) return <Music />;
    if (name.includes("Projection")) return <Monitor />;
    return <ImageIcon />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#000411] text-slate-900 dark:text-white pt-32 pb-20 overflow-hidden font-sans transition-colors duration-500">
      {/* HEADER SECTION */}
      <section className="px-6 md:px-20 mb-20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="/logos/standslogo.jpg"
            alt="Stands Media"
            className="w-24 md:w-32 h-auto animate-pulse rounded-2xl shadow-xl"
          />
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none dark:text-white">
              Stands <span className="text-blue-600 italic">Media</span>
            </h1>
            <p className="text-blue-600 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs mt-2">
              The Engine Room of PCEA St. Andrew's
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
        <div className="p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl relative overflow-hidden group shadow-sm transition-all">
          <Rocket className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-100 dark:text-white/5 group-hover:text-blue-600/10 transition-colors" />
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
              <Rocket size={20} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight dark:text-white">
              Our Mission
            </h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10">
            To amplify the Gospel through innovative technology, providing a
            seamless bridge between the physical sanctuary and the global
            digital congregation.
          </p>
        </div>
        <div className="p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl relative overflow-hidden group shadow-sm transition-all">
          <Target className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-100 dark:text-white/5 group-hover:text-blue-600/10 transition-colors" />
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
              <Target size={20} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight dark:text-white">
              Our Vision
            </h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10">
            To be a leading center of excellence in Christian Media and ICT,
            setting the standard for digital ministry in Africa and beyond.
          </p>
        </div>
      </section>

      {/* LEADERSHIP GRID */}
      <section className="px-6 md:px-20 mb-32">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
            Ministry <span className="text-blue-600">Leadership</span>
          </h2>
          <p className="text-slate-400 dark:text-slate-500 uppercase text-[10px] font-black tracking-widest mt-2">
            The Visionary Core
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.leaders.map((leader, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl hover:border-blue-600/50 hover:shadow-xl transition-all group"
            >
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">
                {leader.role}
              </span>
              <h4 className="text-lg font-black uppercase mt-1 tracking-tight dark:text-white group-hover:text-blue-600 transition-colors">
                {leader.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* SQUAD COMMAND CENTER */}
      <section className="mb-32">
        <div className="px-6 md:px-20 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
                Ministry <span className="text-blue-600">Squads</span>
              </h2>
              <p className="text-slate-400 dark:text-slate-500 uppercase text-[10px] font-black tracking-widest mt-2">
                Elite Production Teams
              </p>
            </div>
            <div className="flex bg-slate-200/50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar relative">
              {content.squads.map((squad, i) => (
                <button
                  key={i}
                  onClick={() => handleSquadTabChange(i)}
                  className="relative flex items-center gap-3 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap z-10"
                >
                  {activeSquad === i && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30 z-[-1]"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <div
                    className={`${activeSquad === i ? "text-white" : "text-blue-600"}`}
                  >
                    {getIcon(squad.name)}
                  </div>
                  <span
                    className={`${activeSquad === i ? "text-white" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {squad.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 md:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            key={`info-${activeSquad}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="text-blue-600 p-5 bg-blue-600/10 inline-block rounded-[1.5rem] shadow-inner">
              {getIcon(content.squads[activeSquad]?.name || "")}
            </div>
            <h3 className="text-5xl font-black uppercase leading-none dark:text-white">
              {content.squads[activeSquad]?.name}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold italic">
              {content.squads[activeSquad]?.desc}
            </p>
            <div className="pt-6 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                Squad Lead
              </span>
              <p className="text-xl font-black uppercase mt-1 dark:text-white">
                {content.squads[activeSquad]?.lead || "TBA"}
              </p>
            </div>
          </motion.div>

          {/* SQUAD MEDIA CAROUSEL */}
          <div className="lg:col-span-8 group relative h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSquad}-${currentImgIdx}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full h-full rounded-[3.5rem] overflow-hidden bg-slate-900 border border-white/5 relative shadow-2xl"
              >
                <img
                  src={`http://localhost:5000${content.squads[activeSquad]?.images[currentImgIdx]}`}
                  alt={`${content.squads[activeSquad]?.name} visual`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
                <div className="absolute inset-x-8 bottom-8 flex justify-between items-center z-20">
                  <div className="flex gap-2 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                    {content.squads[activeSquad]?.images.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 transition-all rounded-full ${currentImgIdx === i ? "w-8 bg-blue-600" : "w-2 bg-white/20"}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setCurrentImgIdx((prev) => (prev === 0 ? 4 : prev - 1))
                      }
                      className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl hover:bg-blue-600 text-white transition-all border border-white/10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImgIdx((prev) => (prev === 4 ? 0 : prev + 1))
                      }
                      className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl hover:bg-blue-600 text-white transition-all border border-white/10"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ICT STAFF */}
      <section className="px-6 md:px-20 mb-32">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">
            ICT <span className="text-blue-600">Engineers</span>
          </h2>
          <p className="text-slate-400 dark:text-slate-500 uppercase text-[10px] font-black tracking-widest mt-2">
            Technical Operations & Support
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.ictStaff.map((staff, idx) => (
            <div
              key={idx}
              className="group p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] hover:bg-blue-600 transition-all duration-500"
            >
              <Cpu
                className="text-blue-600 group-hover:text-white mb-6"
                size={28}
              />
              <h4 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-white dark:text-white">
                {staff.name}
              </h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-100">
                {staff.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* VOLUNTEER CTA */}
      <section className="px-6 md:px-20">
        <div className="bg-[#1e3a8a] rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-20 opacity-10 text-white">
            <Briefcase size={300} />
          </div>
          <div className="max-w-xl text-center lg:text-left relative z-10">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-6 text-white">
              Join the <br /> Squad
            </h2>
            <p className="text-blue-100 font-bold text-lg">
              Passionate about tech? Join the engine room. We train!
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="relative z-10 bg-white text-[#1e3a8a] px-16 py-8 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-2xl active:scale-95"
          >
            Open Application Form
          </button>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 dark:bg-black/95 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#000411] border border-slate-200 dark:border-white/10 w-full max-w-2xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative overflow-y-auto max-h-[90vh] shadow-2xl no-scrollbar"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-blue-600 transition-colors z-20"
              >
                <X size={24} />
              </button>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-black uppercase dark:text-white">
                  Volunteer <span className="text-blue-600">Application</span>
                </h2>
              </div>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest ml-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm outline-none dark:text-white"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest ml-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm outline-none dark:text-white"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest ml-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm outline-none dark:text-white"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest ml-2">
                    Squad Choice
                  </label>
                  <select
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm outline-none dark:text-white"
                    value={formData.squadChoice}
                    onChange={(e) =>
                      setFormData({ ...formData, squadChoice: e.target.value })
                    }
                  >
                    <option disabled>Select Squad</option>
                    {content.squads.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest ml-2">
                    Experience
                  </label>
                  <select
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm outline-none dark:text-white"
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experienceLevel: e.target.value,
                      })
                    }
                  >
                    <option disabled>Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="md:col-span-2 bg-blue-600 py-4 rounded-2xl font-black uppercase text-white hover:bg-blue-700 active:scale-95 transition-all"
                >
                  {isSubmitting ? "Sending..." : "Submit Application"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaMinistry;
