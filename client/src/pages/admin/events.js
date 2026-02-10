import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  X,
  Loader2,
  Save,
  Image as ImageIcon,
} from "lucide-react";

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);

  // --- UPDATED STATE WITH REGISTRATION FIELDS ---
  const initialForm = {
    title: "",
    date: "",
    time: "",
    location: "",
    category: "Special",
    priority: false,
    description: "",
    requiresRegistration: false,
    registrationDeadline: "",
    isPaid: false,
    amount: 0,
    paymentDetails: "",
    image: "",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const json = await response.json();
      if (json.success) setEvents(json.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleEditClick = (event) => {
    setFormData({ ...event });
    setCurrentId(event._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    // Append all text fields
    Object.keys(formData).forEach((key) => {
      if (key !== "image") data.append(key, formData[key]);
    });

    // Handle File upload
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      data.append("image", fileInput.files[0]);
    }

    const url = isEditing
      ? `http://localhost:5000/api/events/${currentId}`
      : "http://localhost:5000/api/events";

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, { method, body: data });
      const json = await response.json();

      if (json.success) {
        fetchEvents();
        closeModal();
      } else {
        alert("Error: " + json.message);
      }
    } catch (err) {
      alert("Submission failed. Check your server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event from the calendar?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-[#001D30] rounded-2xl text-blue-600">
            <Calendar size={32} />
          </div>
          <div>
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">
              Schedule
            </h2>
            <h1 className="text-4xl md:text-6xl font-black dark:text-white uppercase tracking-tighter">
              Events
            </h1>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-sm flex items-center gap-2 shadow-xl shadow-blue-600/20"
        >
          <Plus size={20} /> Create Event
        </button>
      </header>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-[#002034] border dark:border-[#001D30] rounded-[2.5rem] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-[#001D30]/50 border-b dark:border-[#001D30]">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Poster
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Event Details
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Registration
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-[#001D30]">
            {events.map((event) => (
              <tr
                key={event._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-8 py-6">
                  <img
                    src={`http://localhost:5000${event.image}`}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                  />
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold dark:text-white uppercase text-sm">
                    {event.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {event.date} • {event.time}
                  </p>
                </td>
                <td className="px-8 py-6">
                  {event.requiresRegistration ? (
                    <span className="flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-widest">
                      <ShieldCheck size={14} /> Required
                    </span>
                  ) : (
                    <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest">
                      Optional
                    </span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(event)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
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
      </div>

      {/* MODAL SECTION - REARRANGED FOR CLARITY */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#002034] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-12 shadow-2xl relative custom-scrollbar">
            <button
              onClick={closeModal}
              className="absolute top-10 right-10 text-slate-400 hover:text-red-500"
            >
              <X size={28} />
            </button>

            <h2 className="text-4xl font-black dark:text-white uppercase tracking-tighter mb-10">
              {isEditing ? "Modify Event" : "Setup New Event"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* COLUMN 1: BASICS */}
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                      Event Title
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
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                        Time
                      </label>
                      <input
                        placeholder="e.g. 4:00 PM"
                        className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                      Venue / Location
                    </label>
                    <input
                      className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* COLUMN 2: REGISTRATION & PAYMENT LOGIC */}
                <div className="bg-slate-50 dark:bg-[#000411] p-8 rounded-[2rem] border dark:border-[#001D30] space-y-6">
                  <div className="flex items-center justify-between border-b dark:border-slate-800 pb-4">
                    <label className="text-sm font-black dark:text-white uppercase tracking-tighter">
                      Requires Registration?
                    </label>
                    <input
                      type="checkbox"
                      checked={formData.requiresRegistration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requiresRegistration: e.target.checked,
                        })
                      }
                      className="w-6 h-6 rounded-lg border-2 border-blue-600"
                    />
                  </div>

                  {formData.requiresRegistration && (
                    <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                      {/* Registration Deadline */}
                      <div>
                        <label className="text-[9px] font-black uppercase text-blue-600 ml-1">
                          Reg. Deadline
                        </label>
                        <input
                          type="date"
                          className="w-full bg-white dark:bg-[#161B22] p-3 rounded-xl dark:text-white border dark:border-slate-800"
                          value={formData.registrationDeadline}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              registrationDeadline: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* PAID vs FREE TOGGLE */}
                      <div className="flex items-center justify-between bg-white dark:bg-[#161B22] p-4 rounded-xl border dark:border-slate-800">
                        <label className="text-xs font-black dark:text-white uppercase">
                          Is this a Paid Event?
                        </label>
                        <input
                          type="checkbox"
                          checked={formData.isPaid}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isPaid: e.target.checked,
                            })
                          }
                          className="w-5 h-5 accent-blue-600"
                        />
                      </div>

                      {/* CONDITIONAL PAYMENT FIELDS */}
                      {formData.isPaid && (
                        <div className="space-y-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 animate-in zoom-in-95 duration-200">
                          <div>
                            <label className="text-[9px] font-black uppercase text-blue-600 ml-1">
                              Amount (KES)
                            </label>
                            <input
                              type="number"
                              placeholder="e.g. 1000"
                              className="w-full bg-white dark:bg-[#161B22] p-3 rounded-xl dark:text-white font-bold border dark:border-slate-800"
                              value={formData.amount}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  amount: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-blue-600 ml-1">
                              Payment Instructions
                            </label>
                            <textarea
                              rows="2"
                              placeholder="e.g. Pay via Paybill 123456, Acc: Your Name"
                              className="w-full bg-white dark:bg-[#161B22] p-3 rounded-xl dark:text-white text-xs border dark:border-slate-800"
                              value={formData.paymentDetails}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  paymentDetails: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* DESCRIPTION & IMAGE */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Event Description
                  </label>
                  <textarea
                    rows="4"
                    className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white border dark:border-[#001D30]"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Poster Upload
                  </label>
                  <div className="h-40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                    <ImageIcon size={24} className="text-slate-400 mb-2" />
                    <input
                      type="file"
                      className="text-[10px] text-slate-500 w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={saving}
                className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} />{" "}
                    {isEditing ? "Update Calendar" : "Broadcast Event"}
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

export default EventsManager;
