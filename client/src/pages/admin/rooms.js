import React, { useState, useEffect } from "react";
import {
  Plus,
  Image as ImageIcon,
  Trash2,
  MapPin,
  Users,
  X,
  Loader2,
} from "lucide-react";

const RoomsManager = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    pricePerHour: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rooms");
      const json = await res.json();
      if (json.success) setRooms(json.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  // 2. Add function to open modal in Edit mode
  const openEditModal = (room) => {
    setEditingId(room._id);
    setFormData({
      name: room.name,
      capacity: room.capacity,
      pricePerHour: room.pricePerHour,
      description: room.description,
    });
    setShowModal(true);
  };

  // 3. Update handleSave to handle PUT requests
  const handleSave = async (e) => {
    e.preventDefault();

    // Validation: Only require images if we are NOT editing
    if (!editingId && files.length === 0) {
      alert("Please upload at least one image of the room.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("capacity", formData.capacity);
    data.append("pricePerHour", formData.pricePerHour);
    data.append("description", formData.description);

    files.forEach((file) => {
      data.append("images", file);
    });

    const url = editingId
      ? `http://localhost:5000/api/rooms/${editingId}`
      : "http://localhost:5000/api/rooms";

    try {
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST", //
        body: data,
      });

      const json = await res.json();

      if (json.success) {
        fetchRooms();
        closeModal(); // Reset everything
      } else {
        alert("Error: " + json.message);
      }
    } catch (err) {
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFiles([]);
    setFormData({ name: "", capacity: "", pricePerHour: "", description: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this space?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) fetchRooms();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl text-blue-600">
            <MapPin size={32} />
          </div>
          <div>
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">
              Facility Management
            </h2>
            <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
              Church Spaces
            </h1>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl shadow-blue-600/20"
        >
          <Plus size={18} /> Add New Space
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white dark:bg-[#161B22] rounded-[2.5rem] border dark:border-slate-800 overflow-hidden shadow-xl group"
          >
            <div className="h-56 relative overflow-hidden">
              <img
                src={`http://localhost:5000${room.images[0]}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={room.name}
              />
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase">
                KES {room.pricePerHour}/hr
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-2">
                {room.name}
              </h3>
              <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">
                <span className="flex items-center gap-1">
                  <Users size={14} /> {room.capacity} Pax
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 font-medium">
                {room.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(room)}
                  className="flex-1 border dark:border-slate-800 text-blue-500 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <ImageIcon size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="flex-1 border dark:border-slate-800 text-red-500 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-[#002034] w-full max-w-xl rounded-[3rem] p-12 relative shadow-2xl border dark:border-slate-800">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-10 right-10 text-slate-400 hover:text-red-500"
            >
              <X size={28} />
            </button>
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-8">
              Register New Space
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <input
                required
                value={formData.name}
                placeholder="Space Name (e.g. Main Sanctuary)"
                className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold outline-none focus:border-blue-600"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Capacity
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.capacity}
                    placeholder="e.g, 500"
                    className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold"
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Price per Hour
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.pricePerHour}
                    placeholder="e.g, 5000"
                    className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold"
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerHour: e.target.value })
                    }
                  />
                </div>
              </div>
              <textarea
                required
                rows="3"
                value={formData.description}
                placeholder="Description of the space..."
                className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold resize-none"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="room-images"
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                />
                <label
                  htmlFor="room-images"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <ImageIcon size={32} className="text-blue-600" />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {files.length > 0
                      ? `${files.length} Images Selected`
                      : "Click to Upload Photos"}
                  </span>
                </label>
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Create Space Listing"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsManager;
