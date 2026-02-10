import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Loader2,
  Send,
} from "lucide-react";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegModal, setShowRegModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Registration Form State
  const [regData, setRegData] = useState({
    fullName: "",
    phone: "",
    email: "",
    district: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        const json = await res.json();
        if (json.success) setEvent(json.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...regData, eventId: id }),
      });
      const json = await res.json();
      if (json.success) {
        alert("Registration Successful! See you there.");
        setShowRegModal(false);
      }
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-blue-600 animate-pulse text-xs">
        Loading Event Details...
      </div>
    );

  if (!event)
    return (
      <div className="pt-40 text-center min-h-screen font-black text-slate-400">
        EVENT NOT FOUND
      </div>
    );

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-12 transition-all font-black text-[10px] uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Back to Calendar
      </button>

      <div className="grid lg:grid-cols-5 gap-16">
        {/* Left: Poster */}
        <div className="lg:col-span-2">
          <div className="sticky top-32 rounded-[3rem] overflow-hidden shadow-2xl border dark:border-slate-800">
            <img
              src={`http://localhost:5000${event.image}`}
              alt={event.title}
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-3 space-y-10">
          <div className="space-y-4">
            <span className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
              {event.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black dark:text-white uppercase tracking-tighter leading-none">
              {event.title}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-blue-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
                  Date
                </p>
                <p className="font-bold dark:text-white uppercase text-sm">
                  {event.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-blue-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
                  Time
                </p>
                <p className="font-bold dark:text-white uppercase text-sm">
                  {event.time}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border dark:border-slate-800">
            <MapPin size={24} className="text-red-500" />
            <p className="font-black dark:text-white uppercase text-lg tracking-tight">
              {event.location}
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              {event.description ||
                "Join us for this special occasion as we gather together in fellowship and service."}
            </p>
          </div>

          {/* Conditional Registration Section */}
          <div className="pt-10 border-t dark:border-slate-800">
            {event.requiresRegistration ? (
              <div className="space-y-6">
                <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/20">
                  <h4 className="flex items-center gap-2 font-black uppercase text-xs tracking-widest mb-4">
                    <ShieldCheck size={18} /> Registration Required
                  </h4>
                  <p className="text-sm font-bold opacity-90 leading-relaxed mb-6">
                    To attend this event, please secure your spot by filling out
                    the registration form.
                    {event.paymentDetails &&
                      ` Instructions: ${event.paymentDetails}`}
                  </p>
                  <button
                    onClick={() => setShowRegModal(true)}
                    className="w-full bg-white text-blue-600 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 text-center">
                <p className="text-sm font-black uppercase text-slate-400 tracking-widest">
                  Open Entry • No Registration Needed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#002034] w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative">
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-2">
              Event Signup
            </h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-8">
              {event.title}
            </p>

            <form onSubmit={handleRegistration} className="space-y-5">
              {/* Full Name */}
              <input
                required
                placeholder="Full Name"
                className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                value={regData.fullName}
                onChange={(e) =>
                  setRegData({ ...regData, fullName: e.target.value })
                }
              />

              {/* Phone Number */}
              <input
                required
                placeholder="Phone Number"
                className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                value={regData.phone}
                onChange={(e) =>
                  setRegData({ ...regData, phone: e.target.value })
                }
              />

              {/* Optional Email */}
              <input
                type="email"
                placeholder="Email Address (Optional)"
                className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                value={regData.email}
                onChange={(e) =>
                  setRegData({ ...regData, email: e.target.value })
                }
              />

              {/* CONDITIONAL PAYMENT SECTION */}
              {event.isPaid ? (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10px] font-black text-blue-600 uppercase">
                        Payment Instructions
                      </p>
                      <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded">
                        KES {event.amount}
                      </span>
                    </div>
                    <p className="text-xs font-bold dark:text-white leading-relaxed">
                      {event.paymentDetails ||
                        "Please pay via M-Pesa/Cash."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                      M-Pesa Transaction Code
                    </label>
                    <input
                      required
                      placeholder="Enter Transaction Code (e.g. RKJ9...)"
                      className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border-2 border-blue-600 outline-none"
                      value={regData.transactionCode}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          transactionCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl">
                  <p className="text-[10px] font-black text-green-600 uppercase text-center">
                    This event is free of charge.
                  </p>
                </div>
              )}

              <button
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Send size={16} />{" "}
                    {event.isPaid
                      ? "Submit & Register"
                      : "Confirm Registration"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowRegModal(false)}
                className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
