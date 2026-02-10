import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CheckCircle,
  Loader2,
  MapPin,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const SpaceBooking = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [status, setStatus] = useState({ loading: false, success: false });

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setRooms(json.data);
        setLoading(false);
      });
  }, []);

  const handleInquiry = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false });
    const formData = new FormData(e.target);

    const payload = {
      formType: "Space Booking",
      roomName: selectedRoom.name,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      eventDate: formData.get("date"),
      message: formData.get("purpose"),
    };

    console.log("Sending Payload:", payload);

    try {
      const res = await fetch("http://localhost:5000/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus({ loading: false, success: true });
        setIsModalOpen(false);
      }
      else {
      const errorData = await res.json();
      console.error("Server Validation Error:", errorData);
      setStatus({ loading: false, success: false });
    }
    } catch (err) {
      console.error("Submission Error:", err);
      setStatus({ loading: false, success: false });
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="mb-16">
        <h1 className="text-6xl font-black dark:text-white uppercase tracking-tighter leading-none mb-4">
          Venues & Spaces
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium">
          Select a space to view full details and book.
        </p>
      </div>

      <div className="space-y-6">
        {rooms.map((room) => {
          const isExpanded = selectedRoom?._id === room._id;
          return (
            <motion.div
              key={room._id}
              layout
              onClick={() => {
                if (!isExpanded) {
                  setSelectedRoom(room);
                  setCurrentImgIndex(0);
                }
              }}
              className={`relative overflow-hidden rounded-[2.5rem] border-2 transition-all cursor-pointer ${
                isExpanded
                  ? "border-blue-600 bg-white dark:bg-[#161B22] shadow-2xl"
                  : "border-transparent bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <div className="flex flex-col md:flex-row p-6 gap-8">
                {/* Image Section */}
                <motion.div
                  layout
                  className={`relative rounded-[2rem] overflow-hidden flex-shrink-0 ${isExpanded ? "w-full md:w-1/2 h-80" : "w-full md:w-48 h-48"}`}
                >
                  <img
                    src={`http://localhost:5000${isExpanded ? room.images[currentImgIndex] : room.images[0]}`}
                    className="w-full h-full object-cover"
                    alt={room.name}
                  />

                  {isExpanded && room.images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImgIndex((prev) =>
                            prev === 0 ? room.images.length - 1 : prev - 1,
                          );
                        }}
                        className="p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-blue-600"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImgIndex((prev) =>
                            prev === room.images.length - 1 ? 0 : prev + 1,
                          );
                        }}
                        className="p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-blue-600"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </motion.div>

                {/* Info Section */}
                <div className="flex-grow flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`font-black dark:text-white uppercase tracking-tighter leading-tight ${isExpanded ? "text-4xl" : "text-2xl"}`}
                      >
                        {room.name}
                      </h3>
                      <div className="flex gap-4 mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {room.capacity} Pax
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> St. Andrews
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="text-right">
                        <p className="text-[10px] font-black text-blue-600 uppercase">
                          Rate
                        </p>
                        <p className="text-2xl font-black dark:text-white">
                          KES {room.pricePerHour}
                          <span className="text-sm">/hr</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t dark:border-slate-800"
                      >
                        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                          {room.description}
                        </p>
                        <div className="flex gap-4">
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-600/20"
                          >
                            Book This Space
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoom(null);
                            }}
                            className="px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] text-slate-400 hover:text-red-500"
                          >
                            Close
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#161B22] w-full max-w-xl rounded-[3rem] p-12 relative shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-10 right-10 text-slate-400 hover:text-red-500"
              >
                <X size={24} />
              </button>
              <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-2">
                Reservation Inquiry
              </h2>
              <p className="text-slate-400 font-bold text-sm mb-8 uppercase tracking-widest">
                Venue: {selectedRoom?.name}
              </p>

              <form onSubmit={handleInquiry} className="space-y-4">
                <input
                  name="name"
                  required
                  placeholder="Full Name"
                  className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email Address"
                    className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold"
                  />
                  <input
                    name="phone"
                    required
                    placeholder="Phone Number"
                    className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold"
                  />
                </div>
                <input
                  name="date"
                  type="date"
                  required
                  className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold"
                />
                <textarea
                  name="purpose"
                  required
                  placeholder="Event description/requirements..."
                  rows="3"
                  className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold resize-none"
                />
                <button
                  disabled={status.loading}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest"
                >
                  {status.loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Submit Reservation"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success View */}
      <AnimatePresence>
        {status.success && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-blue-600 text-white text-center">
            <div>
              <CheckCircle size={100} className="mx-auto mb-8 animate-bounce" />
              <h2 className="text-6xl font-black uppercase tracking-tighter mb-4">
                Request Sent!
              </h2>
              <p className="text-xl font-bold opacity-80 max-w-md mx-auto mb-10">
                We've received your inquiry for {selectedRoom?.name}. Our
                facility manager will contact you shortly.
              </p>
              <button
                onClick={() => setStatus({ ...status, success: false })}
                className="bg-white text-blue-600 px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpaceBooking;
