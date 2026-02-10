import React, { useState, useEffect } from "react";
import { Settings, Save, Globe, Share2, Shield } from "lucide-react";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("gen");
  const [loading, setLoading] = useState(false);

  // 1. Unified State with your updated details
  const [formData, setFormData] = useState({
    churchName: "PCEA St Andrew's Church",
    contactEmail: "info@pceastandrews.org",
    physicalLocation: "Nyerere Rd. / State House Rd. Junction, Nairobi",
    poBox: "P.O. Box 41282 - 00100, Nairobi, Kenya",
    mainPhone: "+254 707 257 000",
    youthPhone: "+254 757 022 022",
    website: "pceastandrews.org",
    socials: {
      facebook: "pceastandrews",
      instagram: "pcea_st_andrews_church",
      twitter: "pceastandrews2",
      youtube: "youtube.com/@PCEAStAndrewsNairobi",
      youthYoutube: "youtube.com/@standsyouth",
    },
  });

  // 2. Load settings from DB on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        const json = await res.json();
        if (json.success && json.data) setFormData(json.data);
      } catch (err) {
        console.error("Failed to load settings");
      }
    };
    fetchSettings();
  }, []);

  // 3. Handle Save
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) alert("Settings synchronized successfully!");
    } catch (err) {
      alert("Update failed. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-[#001D30] rounded-2xl text-blue-600">
            <Settings size={32} />
          </div>
          <div>
            <h2 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">
              Configuration
            </h2>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
              Settings
            </h1>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
        >
          <Save size={20} /> {loading ? "Saving..." : "Save All Changes"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TAB NAVIGATION */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
          {[
            { id: "gen", label: "General", icon: <Globe size={18} /> },
            { id: "soc", label: "Socials", icon: <Share2 size={18} /> },
            { id: "sec", label: "Security", icon: <Shield size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 lg:w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all border ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                  : "bg-white dark:bg-[#002034] border-slate-200 dark:border-[#001D30] text-slate-500 hover:border-blue-500"
              }`}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-8">
          {activeTab === "gen" && (
            <div className="bg-white dark:bg-[#002034] p-10 rounded-[2rem] border dark:border-[#001D30] space-y-8 animate-in slide-in-from-bottom-4">
              <h3 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>{" "}
                General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Church Name
                  </label>
                  <input
                    type="text"
                    value={formData.churchName}
                    onChange={(e) =>
                      setFormData({ ...formData, churchName: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#000411] border dark:border-[#001D30] p-4 rounded-xl dark:text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#000411] border dark:border-[#001D30] p-4 rounded-xl dark:text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Main Phone
                  </label>
                  <input
                    type="text"
                    value={formData.mainPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, mainPhone: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#000411] border dark:border-[#001D30] p-4 rounded-xl dark:text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Youth Phone
                  </label>
                  <input
                    type="text"
                    value={formData.youthPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, youthPhone: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#000411] border dark:border-[#001D30] p-4 rounded-xl dark:text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    value={formData.physicalLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        physicalLocation: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-[#000411] border dark:border-[#001D30] p-4 rounded-xl dark:text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "soc" && (
            <div className="bg-white dark:bg-[#002034] p-10 rounded-[2rem] border dark:border-[#001D30] space-y-8 animate-in slide-in-from-bottom-4">
              <h3 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>{" "}
                Social Presence
              </h3>
              <div className="space-y-5">
                {Object.keys(formData.socials).map((platform) => (
                  <div
                    key={platform}
                    className="flex flex-col md:flex-row md:items-center gap-4 group"
                  >
                    <div className="w-32 text-[10px] font-black text-slate-400 uppercase group-hover:text-blue-500 transition-colors">
                      {platform}
                    </div>
                    <input
                      type="text"
                      value={formData.socials[platform]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: {
                            ...formData.socials,
                            [platform]: e.target.value,
                          },
                        })
                      }
                      className="flex-grow bg-slate-50 dark:bg-[#000411] border dark:border-[#001D30] p-4 rounded-xl dark:text-white text-sm font-bold outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
