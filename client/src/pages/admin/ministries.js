import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Save,
  X,
  Loader2,
} from "lucide-react";

const MinistriesManager = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: "",
    description: "",
    vision: "",
    targetGroup: "",
    meetingTime: "",
    leaderName: "",
    leaderRole: "",
    category: "Department",
  };

  const [formData, setFormData] = useState(initialForm);
  const [files, setFiles] = useState({ leaderImage: null, coverImage: null });

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ministries");
      const json = await res.json();
      if (json.success) setMinistries(json.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (files.leaderImage) data.append("leaderImage", files.leaderImage);
    if (files.coverImage) data.append("coverImage", files.coverImage);

    const url = isEditing
      ? `http://localhost:5000/api/ministries/${formData._id}`
      : "http://localhost:5000/api/ministries";

    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: data });
      const json = await res.json();
      if (json.success) {
        fetchMinistries();
        closeModal();
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this ministry?"))
      return;
    try {
      const res = await fetch(`http://localhost:5000/api/ministries/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setMinistries(ministries.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openEdit = (ministry) => {
    setFormData(ministry);
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData(initialForm);
    setFiles({ leaderImage: null, coverImage: null });
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-black text-blue-600">
        LOADING MINISTRIES...
      </div>
    );

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black dark:text-white uppercase tracking-tighter">
            Ministries
          </h1>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2">
            Group Management
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-xl shadow-blue-600/20"
        >
          <Plus size={20} /> Add Ministry
        </button>
      </header>

      {/* Table List */}
      <div className="bg-white dark:bg-[#161B22] rounded-[2.5rem] border dark:border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Ministry Name
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Category
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Leader
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            {ministries.map((m) => (
              <tr
                key={m._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={`http://localhost:5000${m.coverImage}`}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-slate-200"
                    />
                    <span className="font-black dark:text-white uppercase text-xs">
                      {m.name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-[9px] font-black uppercase">
                    {m.category}
                  </span>
                </td>
                <td className="px-8 py-6 text-slate-500 font-bold text-xs uppercase">
                  {m.leaderName}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(m)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#161B22] w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-[3rem] shadow-2xl p-10 relative custom-scrollbar">
            <button
              onClick={closeModal}
              className="absolute top-8 right-8 text-slate-400 hover:text-red-500"
            >
              <X size={24} />
            </button>

            <div className="mb-10">
              <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
                {isEditing ? "Edit Ministry" : "New Ministry"}
              </h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                Ministry Configuration
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ROW 1: BASIC INFO */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Ministry Name
                  </label>
                  <input
                    required
                    className="w-full bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white border dark:border-slate-800 focus:border-blue-500 outline-none"
                    value={formData.name}
                    placeholder="Ministry Name"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Category
                  </label>
                  <select
                    className="w-full bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white border dark:border-slate-800 outline-none"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    {["Fellowship", "Department", "Outreach", "Other"].map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* ROW 2: LOGISTICS */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Target Group
                  </label>
                  <input
                    className="w-full bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white border dark:border-slate-800 outline-none"
                    value={formData.targetGroup}
                    placeholder="Target Group e.g. All Men"
                    onChange={(e) =>
                      setFormData({ ...formData, targetGroup: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Meeting Time
                  </label>
                  <input
                    className="w-full bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white border dark:border-slate-800 outline-none"
                    value={formData.meetingTime}
                    placeholder="Sundays 11:30 AM"
                    onChange={(e) =>
                      setFormData({ ...formData, meetingTime: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* ROW 3: DESCRIPTION (FULL WIDTH) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Description
                </label>
                <textarea
                  rows="3"
                  className="w-full bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white border dark:border-slate-800 focus:border-blue-500 outline-none"
                  value={formData.description}
                  placeholder="Ministry description and purpose..."
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* ROW 4: LEADERSHIP (REARRANGED) */}
              <div className="grid md:grid-cols-3 gap-6 pt-6 border-t dark:border-slate-800">
                <div className="md:col-span-1 space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 text-blue-500">
                    Primary Leader
                  </label>
                  <input
                    className="w-full bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white border dark:border-slate-800 outline-none"
                    value={formData.primaryLeaderName}
                    placeholder="Elder John Kamau"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryLeaderName: e.target.value,
                      })
                    }
                  />
                  <p className="text-[9px] text-slate-500 ml-2 italic">
                    Official Presiding Elder/Deacon
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Additional Leaders List
                  </label>
                  <textarea
                    rows="4"
                    className="w-full bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl dark:text-white border dark:border-slate-800 font-medium outline-none"
                    value={formData.leadersList}
                    placeholder={
                      "Elder David Njoroge (Chairperson)\nDeacon Mary Ann (Secretary)\nMr John Kamau (Treasurer)"
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, leadersList: e.target.value })
                    }
                  />
                  <p className="text-[9px] text-slate-500 ml-2 italic">
                    Tip: Use "Enter" to start a new line for each leader.
                  </p>
                </div>
              </div>

              {/* ROW 5: COVER PHOTO */}
              <div className="pt-6 border-t dark:border-slate-800">
                <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-center bg-slate-50/50 dark:bg-slate-900/20 hover:bg-slate-100 dark:hover:bg-slate-900/40 transition-all cursor-pointer">
                  <ImageIcon className="mx-auto text-blue-500 mb-3" size={28} />
                  <h4 className="text-xs font-black uppercase dark:text-white mb-1">
                    Ministry Cover Photo
                  </h4>
                  <p className="text-[10px] text-slate-500 mb-4">
                    Landscape images work best (16:9)
                  </p>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFiles({ ...files, coverImage: e.target.files[0] })
                    }
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-600 file:text-white cursor-pointer"
                  />
                </div>
              </div>

              {/* SAVE BUTTON */}
              <button
                disabled={saving}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
              >
                {saving ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Save size={18} /> Save Ministry Details
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinistriesManager;
