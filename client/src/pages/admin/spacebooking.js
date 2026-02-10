import React, { useState, useEffect } from "react";
import {
  Calendar,
  Trash2,
  CheckCircle,
  Loader2,
  MessageSquare,
} from "lucide-react";

const SpaceBookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch specifically for the Space Booking formType
    fetch("http://localhost:5000/api/forms?formType=Space Booking")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setBookings(json.data);
        setLoading(false);
      });
  }, []);

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    try {
      const res = await fetch(`http://localhost:5000/api/forms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        // Update state locally for immediate feedback
        setBookings(
          bookings.map((b) => (b._id === id ? { ...b, status: newStatus } : b)),
        );
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this inquiry?")) return;
    await fetch(`http://localhost:5000/api/forms/${id}`, { method: "DELETE" });
    setBookings(bookings.filter((b) => b._id !== id));
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-10">
      <header className="flex items-center gap-4">
        <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-2xl text-amber-600">
          <Calendar size={32} />
        </div>
        <div>
          <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest mb-1">
            Inquiries
          </h2>
          <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
            Space Reservations
          </h1>
        </div>
      </header>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white dark:bg-[#161B22] p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {booking.roomName || "Unspecified Space"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">
                {booking.name}
              </h3>
              <p className="text-slate-500 font-bold text-xs">
                {booking.email} • {booking.eventDate}
              </p>
              <div className="mt-4 flex items-start gap-2 text-sm text-slate-400 italic">
                <MessageSquare
                  size={16}
                  className="mt-1 flex-shrink-0 text-slate-300"
                />
                "{booking.message || "No description provided."}"
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate(booking._id, booking.status)}
                className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all"
              >
                <CheckCircle size={24} />
              </button>
              <button
                onClick={() => handleDelete(booking._id)}
                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpaceBookingManager;
