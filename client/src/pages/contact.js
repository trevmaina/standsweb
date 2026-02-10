import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";

const Contact = () => {
  const [churchInfo, setChurchInfo] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        const json = await res.json();
        if (json.success) setChurchInfo(json.data);
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    fetchContactData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      const res = await fetch("http://localhost:5000/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, formType: "Contact Message" }),
      });

      const json = await res.json();
      if (json.success) {
        setStatus({ loading: false, success: true, error: "" });
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        throw new Error(json.message || "Failed to send message");
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase mb-4 tracking-tighter">
          Get in Touch
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
          Have a question or want to visit us? We'd love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 mb-20">
        {/* INFO CARDS COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 bg-gray-50 dark:bg-[#161B22] rounded-[2rem] border dark:border-gray-800">
            <Phone className="text-blue-700 mb-4" size={28} />
            <h4 className="font-black dark:text-white uppercase text-xs tracking-widest mb-3">
              Call Us
            </h4>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-bold">
              <p>
                <span className="text-blue-700">Main Office:</span>{" "}
                {churchInfo?.mainPhone || "+254 707 257 000"}
              </p>
              <p>
                <span className="text-blue-700">Youth Office:</span>{" "}
                {churchInfo?.youthPhone || "+254 757 022 022"}
              </p>
            </div>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-[#161B22] rounded-[2rem] border dark:border-gray-800">
            <Mail className="text-blue-700 mb-4" size={28} />
            <h4 className="font-black dark:text-white uppercase text-xs tracking-widest mb-2">
              Email Us
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">
              {churchInfo?.contactEmail || "info@pceastandrews.org"}
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-[#161B22] rounded-[2rem] border dark:border-gray-800">
            <Clock className="text-blue-700 mb-4" size={28} />
            <h4 className="font-black dark:text-white uppercase text-xs tracking-widest mb-2">
              Office Hours
            </h4>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-bold space-y-1">
              <p>Mon - Fri: 8:00 AM - 5:00 PM</p>
              <p>Sun: 7:00 AM - 1:00 PM</p>
            </div>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-[#161B22] rounded-[2rem] border dark:border-gray-800">
            <MapPin className="text-blue-700 mb-4" size={28} />
            <h4 className="font-black dark:text-white uppercase text-xs tracking-widest mb-2">
              Our Location
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
              {churchInfo?.physicalLocation ||
                "State House Rd / Nyerere Rd Junction, Nairobi"}
            </p>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161B22] p-8 md:p-12 rounded-[3rem] border dark:border-gray-800 shadow-xl">
          {status.success ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-500">
              <CheckCircle size={80} className="text-green-500 mb-6" />
              <h2 className="text-3xl font-black dark:text-white uppercase mb-2">
                Message Sent!
              </h2>
              <p className="text-slate-500 font-bold">
                We will get back to you shortly.
              </p>
              <button
                onClick={() => setStatus({ ...status, success: false })}
                className="mt-8 text-blue-700 font-black uppercase text-xs tracking-widest hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-[#0D1117] border dark:border-gray-800 p-5 rounded-2xl dark:text-white outline-none focus:border-blue-700 font-bold"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-[#0D1117] border dark:border-gray-800 p-5 rounded-2xl dark:text-white outline-none focus:border-blue-700 font-bold"
                  placeholder="john@example.com"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-[#0D1117] border dark:border-gray-800 p-5 rounded-2xl dark:text-white outline-none focus:border-blue-700 font-bold"
                  placeholder="+254..."
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                  Message
                </label>
                <textarea
                  required
                  rows="5"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-[#0D1117] border dark:border-gray-800 p-5 rounded-2xl dark:text-white outline-none focus:border-blue-700 font-bold"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              {status.error && (
                <p className="md:col-span-2 text-red-500 text-xs font-bold uppercase">
                  {status.error}
                </p>
              )}
              <button
                disabled={status.loading}
                className="md:col-span-2 bg-blue-700 hover:bg-blue-800 text-white py-5 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {status.loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                {status.loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
