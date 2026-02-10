import React, { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  Users,
  MapPin,
  BookOpen,
  Loader2,
  Upload,
  Edit3,
  X,
} from "lucide-react";

const AboutManager = () => {
  const [activeSubTab, setActiveSubTab] = useState("church");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [churchInfo, setChurchInfo] = useState({
    history: "",
    mission: "",
    vision: "",
  });
  const [leaders, setLeaders] = useState([]);
  const [newLeader, setNewLeader] = useState({
    name: "",
    role: "",
    category: "Pastoral Team",
  });
  const [leaderFile, setLeaderFile] = useState(null);

  const [districts, setDistricts] = useState([]);
  const [newDistrict, setNewDistrict] = useState({
    name: "",
    elder: "Various",
    fellowshipTime: "",
    locationDescription: "",
  });
  const [editingDistrictId, setEditingDistrictId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/about/all");
      const json = await res.json();
      if (json.success) {
        setChurchInfo(
          json.data.church || { history: "", mission: "", vision: "" },
        );
        setLeaders(json.data.leaders || []);
        setDistricts(json.data.districts || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChurchInfo = async () => {
    setSaving(true);
    await fetch("http://localhost:5000/api/about/church", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(churchInfo),
    });
    setSaving(false);
    alert("Church info updated!");
  };

  const handleAddLeader = async () => {
    setSaving(true);
    const formData = new FormData();
    Object.keys(newLeader).forEach((key) =>
      formData.append(key, newLeader[key]),
    );
    if (leaderFile) formData.append("image", leaderFile);

    const res = await fetch("http://localhost:5000/api/about/leader", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (json.success) {
      setLeaders([...leaders, json.data]);
      setNewLeader({ name: "", role: "", category: "Pastoral Team" });
      setLeaderFile(null);
    }
    setSaving(false);
  };

  const handleDeleteLeader = async (id) => {
    if (!window.confirm("Remove this leader?")) return;
    const res = await fetch(`http://localhost:5000/api/about/leader/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setLeaders(leaders.filter((l) => l._id !== id));
  };

  const handleDistrictSubmit = async () => {
    setSaving(true);
    const url = editingDistrictId
      ? `http://localhost:5000/api/about/district/${editingDistrictId}`
      : "http://localhost:5000/api/about/district";
    const method = editingDistrictId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDistrict),
    });
    const json = await res.json();
    if (json.success) {
      fetchData(); // Refresh list
      setNewDistrict({
        name: "",
        elder: "Various",
        fellowshipTime: "",
        locationDescription: "",
      });
      setEditingDistrictId(null);
    }
    setSaving(false);
  };

  const handleDeleteDistrict = async (id) => {
    if (!window.confirm("Delete this district?")) return;
    const res = await fetch(`http://localhost:5000/api/about/district/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setDistricts(districts.filter((d) => d._id !== id));
  };

  const startEditDistrict = (d) => {
    setNewDistrict({
      name: d.name,
      elder: d.elder || "Various",
      fellowshipTime: d.fellowshipTime,
      locationDescription: d.locationDescription,
    });
    setEditingDistrictId(d._id);
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <header className="mb-12">
        <h1 className="text-5xl font-black dark:text-white uppercase tracking-tighter">
          About Manager
        </h1>
        <div className="flex gap-4 mt-6 bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl w-fit">
          {["church", "leadership", "districts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeSubTab === tab ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeSubTab === "church" && (
        <section className="bg-white dark:bg-[#161B22] p-10 rounded-[3rem] shadow-xl border dark:border-slate-800 space-y-8 animate-in fade-in">
          <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4">
            <h3 className="font-black uppercase text-blue-500 flex items-center gap-2 tracking-widest text-xs">
              <BookOpen size={18} /> History & Vision
            </h3>
            <button
              onClick={handleSaveChurchInfo}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-[10px] uppercase flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Save size={14} />
              )}{" "}
              Save Changes
            </button>
          </div>
          <div className="space-y-6">
            <textarea
              rows="6"
              className="w-full bg-slate-50 dark:bg-[#0d1117] p-5 rounded-2xl dark:text-white outline-none border dark:border-slate-800 font-medium"
              value={churchInfo.history}
              onChange={(e) =>
                setChurchInfo({ ...churchInfo, history: e.target.value })
              }
            />
            <div className="grid md:grid-cols-2 gap-6">
              <textarea
                placeholder="Mission"
                rows="4"
                className="w-full bg-slate-50 dark:bg-[#0d1117] p-5 rounded-2xl dark:text-white outline-none border dark:border-slate-800 font-medium"
                value={churchInfo.mission}
                onChange={(e) =>
                  setChurchInfo({ ...churchInfo, mission: e.target.value })
                }
              />
              <textarea
                placeholder="Vision"
                rows="4"
                className="w-full bg-slate-50 dark:bg-[#0d1117] p-5 rounded-2xl dark:text-white outline-none border dark:border-slate-800 font-medium"
                value={churchInfo.vision}
                onChange={(e) =>
                  setChurchInfo({ ...churchInfo, vision: e.target.value })
                }
              />
            </div>
          </div>
        </section>
      )}

      {activeSubTab === "leadership" && (
        <section className="space-y-8 animate-in fade-in">
          <div className="bg-white dark:bg-[#161B22] p-10 rounded-[3rem] shadow-xl border dark:border-slate-800">
            <h3 className="font-black uppercase text-blue-500 mb-8 flex items-center gap-2 tracking-widest text-xs">
              <Users size={18} /> Add Leader
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <input
                placeholder="Full Name"
                className="bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white outline-none font-bold"
                value={newLeader.name}
                onChange={(e) =>
                  setNewLeader({ ...newLeader, name: e.target.value })
                }
              />
              <input
                placeholder="Role"
                className="bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white outline-none font-bold"
                value={newLeader.role}
                onChange={(e) =>
                  setNewLeader({ ...newLeader, role: e.target.value })
                }
              />
              <select
                className="bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white outline-none font-bold"
                value={newLeader.category}
                onChange={(e) =>
                  setNewLeader({ ...newLeader, category: e.target.value })
                }
              >
                {["Pastoral Team", "Elders", "Deacons", "Ministry Leaders"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ),
                )}
              </select>
              <label className="md:col-span-2 flex items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setLeaderFile(e.target.files[0])}
                />
                <Upload size={18} className="mr-2 text-blue-500" />
                <span className="text-[10px] font-black uppercase text-slate-500">
                  {leaderFile ? leaderFile.name : "Upload Photo"}
                </span>
              </label>
              <button
                onClick={handleAddLeader}
                className="bg-blue-600 text-white rounded-xl font-black uppercase text-[10px]"
              >
                <Plus size={16} /> Register
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaders.map((leader) => (
              <div
                key={leader._id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-[#161B22] rounded-2xl border dark:border-slate-800"
              >
                <img
                  src={
                    leader.image
                      ? `http://localhost:5000${leader.image}`
                      : "/placeholder.jpg"
                  }
                  alt={leader.name || "Leader"}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-grow">
                  <p className="font-black dark:text-white text-xs uppercase">
                    {leader.name}
                  </p>
                  <p className="text-[9px] text-blue-500 font-black uppercase">
                    {leader.role}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteLeader(leader._id)}
                  className="text-red-500 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeSubTab === "districts" && (
        <section className="space-y-8 animate-in fade-in">
          <div className="bg-white dark:bg-[#161B22] p-10 rounded-[3rem] shadow-xl border dark:border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black uppercase text-blue-500 flex items-center gap-2 tracking-widest text-xs">
                <MapPin size={18} />{" "}
                {editingDistrictId ? "Edit District" : "Register District"}
              </h3>
              {editingDistrictId && (
                <button
                  onClick={() => {
                    setEditingDistrictId(null);
                    setNewDistrict({
                      name: "",
                      elder: "Various",
                      fellowshipTime: "",
                      locationDescription: "",
                    });
                  }}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <input
                placeholder="District Name"
                className="bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white outline-none font-bold"
                value={newDistrict.name}
                onChange={(e) =>
                  setNewDistrict({ ...newDistrict, name: e.target.value })
                }
              />
              <input
                placeholder="Fellowship Day & Time"
                className="bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white outline-none font-bold"
                value={newDistrict.fellowshipTime}
                onChange={(e) =>
                  setNewDistrict({
                    ...newDistrict,
                    fellowshipTime: e.target.value,
                  })
                }
              />
              <textarea
                rows="2"
                className="md:col-span-2 bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white outline-none border dark:border-slate-800 font-bold"
                placeholder="Location Description (e.g. Residents of Area X and Y)"
                value={newDistrict.locationDescription}
                onChange={(e) =>
                  setNewDistrict({
                    ...newDistrict,
                    locationDescription: e.target.value,
                  })
                }
              />
              <button
                onClick={handleDistrictSubmit}
                disabled={saving}
                className="md:col-span-2 bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest"
              >
                {saving ? (
                  <Loader2 className="animate-spin mx-auto" size={18} />
                ) : editingDistrictId ? (
                  "Update District"
                ) : (
                  "Save District"
                )}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161B22] rounded-[2.5rem] border dark:border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                    District
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                    Meeting
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                    Location Description
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {districts.map((d) => (
                  <tr
                    key={d._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-8 py-6 font-black dark:text-white text-xs uppercase">
                      {d.name}
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-bold text-[10px] uppercase">
                      {d.fellowshipTime}
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-bold text-[10px] uppercase truncate max-w-[200px]">
                      {d.locationDescription}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEditDistrict(d)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteDistrict(d._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutManager;
