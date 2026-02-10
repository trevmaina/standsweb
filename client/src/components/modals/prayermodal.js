import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Send, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";

const PrayerModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePrayerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const payload = {
      name: formData.get("name") || "Anonymous",
      email: formData.get("contact"), // This collects the phone/email field
      message: formData.get("request"),
      formType: "Prayer Request", // This tag is what the Admin looks for
    };

    try {
      // ENSURE THIS URL MATCHES YOUR BACKEND ROUTE EXACTLY
      const res = await fetch("http://localhost:5000/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        setSubmitted(true);
      } else {
        alert("Server error: " + json.message);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Network Error: Is the backend server running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-[#161B22] w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl border dark:border-slate-800"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            {!submitted ? (
              <form onSubmit={handlePrayerSubmit} className="space-y-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-2xl text-purple-600 w-fit mb-4">
                  <Heart size={28} />
                </div>
                <h2 className="text-3xl font-black mb-2 dark:text-white uppercase tracking-tighter">
                  Prayer Request
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm font-medium">
                  Our pastoral team will stand in faith with you.
                </p>

                {/* NOTICE: The 'name' attributes here must match the formData.get() calls above */}
                <input
                  name="name"
                  placeholder="Full Name (Optional)"
                  className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-gray-800 dark:text-white font-bold outline-none focus:border-purple-500"
                />
                <input
                  name="contact"
                  placeholder="Email or Phone Number (Optional)"
                  className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-gray-800 dark:text-white font-bold outline-none focus:border-purple-500"
                />
                <textarea
                  name="request"
                  required
                  rows="4"
                  placeholder="How can we pray for you?"
                  className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-gray-800 dark:text-white font-bold outline-none focus:border-purple-500 resize-none"
                />

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-600/20 active:scale-95 transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Send size={18} /> Send Request
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-10 animate-in zoom-in duration-300">
                <CheckCircle
                  size={64}
                  className="text-green-500 mx-auto mb-6"
                />
                <h2 className="text-2xl font-black dark:text-white uppercase mb-2">
                  Received
                </h2>
                <p className="text-slate-500 font-bold italic text-sm">
                  "Amen. Your request has been sent to our team."
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 text-purple-600 font-black uppercase text-[10px] tracking-widest underline"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrayerModal;
