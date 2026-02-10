import React, { useState, useEffect } from "react";
import {
  Settings2,
  Save,
  Cpu,
  UserPlus,
  Trash2,
  ShieldCheck,
  Briefcase,
  PlusCircle,
  UploadCloud,
} from "lucide-react";

const DEFAULT_SQUADS = [
  { name: "Camera Squad", lead: "", images: [] },
  { name: "Sound Squad", lead: "", images: [] },
  { name: "Projections Squad", lead: "", images: [] },
  { name: "Photography Squad", lead: "", images: [] },
];

const ICTManager = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Configuration for smart filters
  const availableLeaderRoles = [
    "Elder",
    "Chairperson",
    "Vice Chairperson",
    "Media Ministry Co-ordinator",
    "Vice Media Ministry Co-ordinator",
    "Secretary",
    "Treasurer",
  ];

  const availableICTRoles = [
    "AV Employee (Audio Visual)",
    "ICT Employee",
    "ICT Intern",
    "ICT Attachee",
  ];

  const [content, setContent] = useState({
    leaders: [],
    ictStaff: [],
    squads: DEFAULT_SQUADS,
  });

  const [newLeader, setNewLeader] = useState({ role: "", name: "" });
  const [newStaff, setNewStaff] = useState({ role: "", name: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/ictmedia/content")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const mergedSquads = DEFAULT_SQUADS.map((def) => {
            const found = json.data.squads.find((s) => s.name === def.name);
            return found ? found : def;
          });
          setContent({ ...json.data, squads: mergedSquads });
        }
        setLoading(false);
      });
  }, []);

  // --- Utility Functions ---
  const filteredLeaderRoles = availableLeaderRoles.filter(
    (role) => !content.leaders.some((l) => l.role === role),
  );
  const filteredICTRoles = availableICTRoles.filter(
    (role) => !content.ictStaff.some((s) => s.role === role),
  );

  // Inside ICTManager component

  const handleImageUpload = async (sIdx, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("squadImages", file));

    try {
      const res = await fetch("http://localhost:5000/api/upload/ict-squad", {
        method: "POST",
        body: formData, // Sending files as FormData
      });
      const data = await res.json();

      if (data.success) {
        const ns = [...content.squads];
        // Combine existing images with newly uploaded server paths
        ns[sIdx].images = [...ns[sIdx].images, ...data.paths].slice(0, 5);
        setContent({ ...content, squads: ns });
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // This sends the entire content object (leaders, staff, and squads with new image paths)
      const res = await fetch("http://localhost:5000/api/ictmedia/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content), //
      });

      const data = await res.json();
      if (data.success) {
        alert("Command Center Synced Successfully!"); //
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Sync error:", err);
      alert("Server connection failed.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center bg-[#000411] min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 animate-spin rounded-full mb-4"></div>
        <span className="text-blue-600 font-black uppercase tracking-widest text-xs animate-pulse">
          Accessing Engine Room...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#000411] min-h-screen text-white pb-32">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6 sticky top-0 z-50 bg-[#000411]/90 backdrop-blur-md py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
            <Settings2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">
              ICT <span className="text-blue-600">Manager</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">
              PCEA St. Andrews Engine Room
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full lg:w-auto bg-blue-600 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
        >
          <Save size={18} /> {isSaving ? "Syncing..." : "Save All Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* SECTION 1: MINISTRY LEADERSHIP */}
        <section className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2.5rem] h-fit">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
            <ShieldCheck className="text-blue-500" size={24} />
            <h2 className="text-xl font-black uppercase tracking-tight">
              Ministry <span className="text-blue-600">Leadership</span>
            </h2>
          </div>
          {filteredLeaderRoles.length > 0 && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-3 bg-blue-600/5 p-4 rounded-3xl border border-blue-600/20">
              <select
                className="md:col-span-5 bg-[#000411] border border-white/10 p-4 rounded-xl text-xs font-bold outline-none"
                value={newLeader.role}
                onChange={(e) =>
                  setNewLeader({ ...newLeader, role: e.target.value })
                }
              >
                <option value="">Select Position</option>
                {filteredLeaderRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <input
                className="md:col-span-5 bg-[#000411] border border-white/10 p-4 rounded-xl text-xs font-bold outline-none"
                placeholder="Name"
                value={newLeader.name}
                onChange={(e) =>
                  setNewLeader({ ...newLeader, name: e.target.value })
                }
              />
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    leaders: [...content.leaders, newLeader],
                  });
                  setNewLeader({ role: "", name: "" });
                }}
                className="md:col-span-2 bg-blue-600 rounded-xl flex items-center justify-center p-4"
              >
                <PlusCircle size={20} />
              </button>
            </div>
          )}
          <div className="space-y-3">
            {content.leaders.map((l, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl border border-white/5 group"
              >
                <div>
                  <div className="text-[9px] font-black uppercase text-blue-500 tracking-[0.2em] mb-1">
                    {l.role}
                  </div>
                  <div className="text-sm font-bold uppercase">{l.name}</div>
                </div>
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      leaders: content.leaders.filter((_, idx) => idx !== i),
                    })
                  }
                  className="p-3 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: TECHNICAL ROSTER (EMPLOYEES) */}
        <section className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2.5rem] h-fit">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
            <Briefcase className="text-blue-500" size={24} />
            <h2 className="text-xl font-black uppercase tracking-tight">
              Technical <span className="text-blue-600">Roster</span>
            </h2>
          </div>
          {filteredICTRoles.length > 0 && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-3 bg-blue-600/5 p-4 rounded-3xl border border-blue-600/20">
              <select
                className="md:col-span-5 bg-[#000411] border border-white/10 p-4 rounded-xl text-xs font-bold outline-none"
                value={newStaff.role}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, role: e.target.value })
                }
              >
                <option value="">Select ICT Role</option>
                {filteredICTRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <input
                className="md:col-span-5 bg-[#000411] border border-white/10 p-4 rounded-xl text-xs font-bold outline-none"
                placeholder="Staff Name"
                value={newStaff.name}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, name: e.target.value })
                }
              />
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    ictStaff: [...content.ictStaff, newStaff],
                  });
                  setNewStaff({ role: "", name: "" });
                }}
                className="md:col-span-2 bg-blue-600 rounded-xl flex items-center justify-center p-4"
              >
                <UserPlus size={20} />
              </button>
            </div>
          )}
          <div className="space-y-3">
            {content.ictStaff.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl border border-white/5 group"
              >
                <div>
                  <div className="text-[9px] font-black uppercase text-blue-500 tracking-[0.2em] mb-1">
                    {s.role}
                  </div>
                  <div className="text-sm font-bold uppercase">{s.name}</div>
                </div>
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      ictStaff: content.ictStaff.filter((_, idx) => idx !== i),
                    })
                  }
                  className="p-3 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: SQUAD PRODUCTION (UPLOADS) */}
        <section className="space-y-8 xl:col-span-2 mt-8">
          <div className="flex items-center gap-3 mb-4 ml-4">
            <Cpu className="text-blue-500" size={28} />
            <h2 className="text-2xl font-black uppercase tracking-tight italic text-blue-500">
              Squad Production Centers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.squads.map((squad, sIdx) => (
              <div
                key={sIdx}
                className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[3rem]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black uppercase tracking-widest text-blue-500 text-sm flex items-center gap-2">
                    {squad.name}
                  </h3>
                  <input
                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black w-48"
                    placeholder="Squad Lead"
                    value={squad.lead}
                    onChange={(e) => {
                      const ns = [...content.squads];
                      ns[sIdx].lead = e.target.value;
                      setContent({ ...content, squads: ns });
                    }}
                  />
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {squad.images.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square relative rounded-xl overflow-hidden border border-white/10 group/img"
                    >
                      <img
                        src={img}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          const ns = [...content.squads];
                          ns[sIdx].images = ns[sIdx].images.filter(
                            (_, idx) => idx !== i,
                          );
                          setContent({ ...content, squads: ns });
                        }}
                        className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {squad.images.length < 5 && (
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl hover:border-blue-600 cursor-pointer bg-white/5">
                      <UploadCloud size={18} className="text-slate-600" />
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageUpload(sIdx, e)}
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ICTManager;
