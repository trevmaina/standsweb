import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Send, Loader2 } from "lucide-react";
import { useState } from "react";

const VisitorModal = ({ isOpen, onClose, mode }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    try {
      await fetch("http://localhost:5000/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          formType: mode,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-[#161B22] w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl border dark:border-slate-800"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 dark:text-white"
            >
              <X />
            </button>

            {!submitted ? (
              <>
                <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl text-blue-600 w-fit mb-6">
                  <UserPlus size={28} />
                </div>
                <h2 className="text-3xl font-black mb-2 dark:text-white uppercase tracking-tighter">
                  {mode === "New Visitor" ? "Welcome!" : "Join Us"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm font-bold">
                  {mode === "New Visitor"
                    ? "We'd love to get to know you better."
                    : "Fill in your details to join a community group."}
                </p>
                <form onSubmit={handleVisitorSubmit} className="space-y-4">
                  <input
                    name="name"
                    required
                    placeholder="Full Name"
                    className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-gray-800 dark:text-white font-bold"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email Address"
                    className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-gray-800 dark:text-white font-bold"
                  />
                  <input
                    name="phone"
                    required
                    placeholder="Phone Number"
                    className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-gray-800 dark:text-white font-bold"
                  />
                  <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2">
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Send size={18} /> Submit
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  ✓
                </div>
                <h2 className="text-2xl font-black dark:text-white uppercase mb-2">
                  Thank You!
                </h2>
                <p className="text-slate-500 font-bold">
                  Someone from our hospitality team will reach out to you soon.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VisitorModal;
