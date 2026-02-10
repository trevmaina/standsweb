import React, { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Upload, X, Loader2, Save } from "lucide-react";

const IntimationsManager = () => {
  const [intimations, setIntimations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "Main",
  });

  useEffect(() => {
    fetchIntimations();
  }, []);

  const fetchIntimations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/intimations");
      const json = await res.json();

      console.log("Admin Fetch Check:", json);

      if (json.success && Array.isArray(json.data)) {
        setIntimations(json.data);
      } else {
        // If it's a 400 error, it won't reach here correctly
        console.error("Server error or empty data:", json.message);
      }
    } catch (err) {
      console.error("Network Error - is the server running?", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date);

    // Logic to ensure we send the short enum key
    const categoryKey = formData.category.toLowerCase().includes("youth")
      ? "youth"
      : "main";
    data.append("category", categoryKey);

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      data.append("file", fileInput.files[0]);
    } else {
      alert("Please select a PDF file.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/intimations", {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (result.success) {
        fetchIntimations();
        setShowModal(false);
        setFormData({ title: "", date: "", category: "Main Service" });
      } else {
        alert("Upload failed: " + result.message);
      }
    } catch (err) {
      alert("Network failure during upload.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this intimation?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/intimations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setIntimations(intimations.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl text-blue-600">
            <FileText size={32} />
          </div>
          <div>
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">
              Documents
            </h2>
            <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
              Intimations
            </h1>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-xl shadow-blue-600/20"
        >
          <Plus size={18} /> New Intimation
        </button>
      </header>

      <div className="bg-white dark:bg-[#161B22] border dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Date
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Title & Category
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            {intimations.length > 0 ? (
              intimations.map((i) => (
                <tr
                  key={i._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6 text-sm font-bold dark:text-white">
                    {new Date(i.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black dark:text-white uppercase text-sm tracking-tight">
                      {i.title}
                    </p>
                    <span className="text-[9px] font-black text-blue-600 uppercase">
                      {i.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleDelete(i._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-8 py-20 text-center text-slate-400 uppercase font-black text-[10px] tracking-widest italic"
                >
                  No records found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#002034] w-full max-w-xl rounded-[3rem] p-12 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-10 right-10 text-slate-400"
            >
              <X size={28} />
            </button>
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-8">
              Upload Intimation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Notice Title
                </label>
                <input
                  required
                  className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Category
                  </label>
                  <select
                    className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="main">Main Church</option>
                    <option value="youth">Youth Church</option>
                  </select>
                </div>
              </div>
              <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center">
                <Upload className="mx-auto text-blue-600 mb-2" size={32} />
                <input
                  type="file"
                  required
                  accept="application/pdf"
                  className="text-[10px] text-slate-500"
                />
              </div>
              <button
                disabled={saving}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Publish Notice
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntimationsManager;
