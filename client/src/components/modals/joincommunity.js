import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Send, Loader2, CheckCircle } from "lucide-react";

const JoinCommunityModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const payload = {
      formType: "Community Join", // Matches Admin filter
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("group"), // Storing the specific group/ministry interest here
    };

    try {
      const res = await fetch("http://localhost:5000/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-[#161B22] w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl border dark:border-slate-800"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-slate-400 hover:text-red-500"
            >
              <X size={24} />
            </button>

            {!success ? (
              <>
                <div className="mb-8">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                    <Users size={24} />
                  </div>
                  <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
                    Join a Community
                  </h2>
                  <p className="text-slate-500 text-sm font-bold">
                    Find your place in our church family.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    name="name"
                    required
                    placeholder="Full Name"
                    className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold"
                  />
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
                  <select
                    name="group"
                    required
                    className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold appearance-none"
                  >
                    <option value="">Select a Group/Ministry</option>
                    <option value="Youth Fellowship">Youth Fellowship</option>
                    <option value="Woman's Guild">Woman's Guild</option>
                    <option value="Men's Fellowship">Men's Fellowship</option>
                    <option value="Church Choir">Church Choir</option>
                    <option value="Praise & Worship">Praise & Worship</option>
                    <option value="Sunday School Teacher">
                      Sunday School Teacher
                    </option>
                  </select>
                  <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Send size={18} /> Submit Request
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <CheckCircle
                  size={64}
                  className="text-green-500 mx-auto mb-4"
                />
                <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">
                  Application Sent!
                </h3>
                <p className="text-slate-500 font-bold text-sm mt-2">
                  The ministry leader will contact you shortly.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 text-blue-600 font-black uppercase text-[10px] tracking-widest underline"
                >
                  Close Window
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JoinCommunityModal;
