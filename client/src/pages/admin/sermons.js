import React, { useState, useEffect } from "react";
import {
  Video,
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  FileText,
  X,
} from "lucide-react"; // Removed 'Radio' to clear warning
import { getYouTubeID } from "../../utils/helpers";

const SermonsManager = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    preacher: "",
    videoUrl: "",
    congregation: "Main",
    bibleReadings: "",
    description: "",
  });

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/sermons");
      const json = await response.json();
      if (json.success) setSermons(json.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const url = isEditing
      ? `http://localhost:5000/api/sermons/${currentId}`
      : "http://localhost:5000/api/sermons";
    const method = isEditing ? "PUT" : "POST";

    const payload = {
      ...formData,
      date: new Date().toISOString(),
      thumbnail: `https://img.youtube.com/vi/${getYouTubeID(formData.videoUrl)}/maxresdefault.jpg`,
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (json.success) {
        setSermons(
          isEditing
            ? sermons.map((s) => (s._id === currentId ? json.data : s))
            : [json.data, ...sermons],
        );
        notify(isEditing ? "Sermon Updated!" : "Sermon Added!");
        closeModal();
      }
    } catch (err) {
      console.error("Error saving sermon:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (sermon) => {
    setFormData({ ...sermon });
    setCurrentId(sermon._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this sermon?")) {
      const res = await fetch(`http://localhost:5000/api/sermons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSermons(sermons.filter((s) => s._id !== id));
        notify("Sermon Deleted!");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      title: "",
      preacher: "",
      videoUrl: "",
      congregation: "Main",
      bibleReadings: "",
      description: "",
    });
  };

  const filteredSermons = sermons.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.preacher.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-[#001D30] rounded-2xl text-blue-600">
            <Video size={32} />
          </div>
          <div>
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">
              Media Center
            </h2>
            <h1 className="text-5xl font-black dark:text-white uppercase tracking-tighter leading-none">
              Sermons
            </h1>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-xl hover:bg-blue-700 transition-all"
        >
          <Plus size={20} /> Add New Sermon
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 p-3 bg-white dark:bg-[#002034] rounded-[2rem] border border-slate-200 dark:border-[#001D30]">
        <div className="flex-grow flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-[#000411] rounded-xl border border-transparent focus-within:border-blue-500">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or preacher..."
            className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full text-sm font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#002034] border border-slate-200 dark:border-[#001D30] rounded-[2rem] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center font-black uppercase text-blue-500 animate-pulse">
            Loading Archives...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-[#001D30]/50 border-b border-slate-200 dark:border-[#001D30]">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">
                  Service Title
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">
                  Congregation
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#001D30]">
              {filteredSermons.map((sermon) => (
                <tr
                  key={sermon._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-[#001D30]/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-12 rounded-lg overflow-hidden bg-slate-900 border dark:border-[#001D30]">
                        <img
                          src={`https://img.youtube.com/vi/${getYouTubeID(sermon.videoUrl)}/mqdefault.jpg`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold dark:text-white leading-tight">
                          {sermon.title}
                        </p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                          {new Date(sermon.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-black uppercase tracking-widest">
                      {sermon.congregation}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEditClick(sermon)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(sermon._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#002034] w-full max-w-2xl rounded-[3rem] p-12 overflow-y-auto max-h-[90vh] relative shadow-2xl border dark:border-slate-800">
            <button
              onClick={closeModal}
              className="absolute top-8 right-8 text-slate-400 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <h2 className="text-4xl font-black dark:text-white uppercase tracking-tighter mb-10">
              {isEditing ? "Edit Archive" : "Archive New Sermon"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                    Title
                  </label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-slate-100 dark:bg-[#000411] p-5 rounded-2xl dark:text-white font-bold outline-none border-2 border-transparent focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                    Preacher
                  </label>
                  <input
                    required
                    value={formData.preacher}
                    onChange={(e) =>
                      setFormData({ ...formData, preacher: e.target.value })
                    }
                    className="w-full bg-slate-100 dark:bg-[#000411] p-5 rounded-2xl dark:text-white font-bold outline-none border-2 border-transparent focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Congregation Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                  Congregation
                </label>
                <select
                  value={formData.congregation}
                  onChange={(e) =>
                    setFormData({ ...formData, congregation: e.target.value })
                  }
                  className="w-full bg-slate-100 dark:bg-[#000411] p-5 rounded-2xl dark:text-white font-bold outline-none border-2 border-transparent focus:border-blue-600 transition-all appearance-none"
                >
                  <option value="Main">Main Church</option>
                  <option value="Youth">Youth Church</option>
                  <option value="Children">Children Ministry</option>
                  <option value="French">French Church</option>
                  <option value="Deaf">Deaf Ministry</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                  Bible Readings
                </label>
                <div className="flex gap-4 items-center bg-slate-100 dark:bg-[#000411] p-5 rounded-2xl border-2 border-transparent focus-within:border-blue-600 transition-all">
                  <BookOpen size={18} className="text-blue-600" />
                  <input
                    value={formData.bibleReadings}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bibleReadings: e.target.value,
                      })
                    }
                    className="bg-transparent w-full dark:text-white font-bold outline-none"
                    placeholder="e.g. John 3:16"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                  Description
                </label>
                <div className="flex gap-4 items-start bg-slate-100 dark:bg-[#000411] p-5 rounded-2xl border-2 border-transparent focus-within:border-blue-600 transition-all">
                  <FileText size={18} className="text-blue-600 mt-1" />
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-transparent w-full dark:text-white font-bold outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                  YouTube URL
                </label>
                <input
                  required
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="w-full bg-slate-100 dark:bg-[#000411] p-5 rounded-2xl dark:text-white font-bold outline-none border-2 border-transparent focus:border-blue-600 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full p-5 rounded-2xl font-black uppercase text-xs bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save to Archives"}
              </button>
            </form>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] shadow-2xl animate-in slide-in-from-top duration-300">
          {notification}
        </div>
      )}
    </div>
  );
};

export default SermonsManager;
