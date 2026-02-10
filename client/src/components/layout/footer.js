import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ChevronUp,
  Info,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [churchInfo, setChurchInfo] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for 'i' icon toggle

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        const json = await res.json();
        if (json.success) setChurchInfo(json.data);
      } catch (err) {
        console.error("Footer fetch error:", err);
      }
    };
    fetchFooterData();

    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-slate-50 dark:bg-[#000411] pt-12 md:pt-24 pb-12 px-10 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
      {/* MOBILE INFO TOGGLE ICON: Only visible on small screens */}
      <div className="flex justify-center md:hidden mb-8">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-white dark:bg-white/5 rounded-full shadow-lg border border-slate-200 dark:border-white/10 text-blue-700 animate-pulse"
          aria-label="Toggle Footer Information"
        >
          {isMobileMenuOpen ? (
            <X size={28} strokeWidth={2.5} />
          ) : (
            <Info size={28} strokeWidth={2.5} />
          )}
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* UPPER SECTION: Hidden on mobile unless isMobileMenuOpen is true, always visible on md+ */}
        <div
          className={`
          ${isMobileMenuOpen ? "block" : "hidden"} 
          md:grid md:grid-cols-3 gap-16 mb-20 transition-all duration-500
        `}
        >
          {/* Section 1: Brand */}
          <div className="space-y-8 mb-12 md:mb-0">
            {/* Section 1: Brand - Rounded Square Logic */}
<Link to="/" className="flex items-center gap-4 group">
  {/* The Container: rounded-xl creates the rounded square effect */}
  <div className="w-12 h-12 relative overflow-hidden rounded-xl bg-[#ffffff] flex items-center justify-center shadow-lg shadow-blue-900/20">
    <img
      src="/logos/logo-2.png"
      alt="Logo"
      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
      onError={(e) => {
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "block";
      }}
    />
    {/* Fallback Text: Only visible if image fails */}
    <span
      style={{ display: "none" }}
      className="text-white font-black text-[10px] uppercase tracking-tighter"
    >
      STAC
    </span>
  </div>

  <div className="flex flex-col">
    <span className="font-bold text-2xl tracking-tight dark:text-white uppercase leading-none">
      {churchInfo?.churchName || "St. Andrew's"}
    </span>
    <span className="text-[10px] font-medium text-blue-700 uppercase tracking-widest mt-1">
      Church Nairobi
    </span>
  </div>
</Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Building bridges of faith, hope, and love in our community through
              the power of the Gospel.
            </p>
            <div className="flex gap-4 pt-2">
              {["facebook", "instagram", "youtube", "twitter"].map(
                (platform, i) => (
                  <a
                    key={i}
                    href={churchInfo?.socials?.[platform] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#1e3a8a] dark:text-slate-300 hover:bg-[#1e3a8a] hover:text-white transition-all"
                  >
                    <i
                      className={`fa-brands fa-${platform === "twitter" ? "x-twitter" : platform}`}
                    ></i>
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Section 2: Navigation Links */}
          <div className="mb-12 md:mb-0">
            <h4 className="font-bold text-xs uppercase tracking-widest text-blue-700 mb-8">
              Quick Navigation
            </h4>
            <ul className="space-y-4">
              {[
                { name: "About Us", path: "/about" },
                { name: "Sermons & Media", path: "/sermons" },
                { name: "Upcoming Events", path: "/events" },
                { name: "Give / Tithe", path: "/give" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-700 transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Contact Details */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-blue-700 mb-8">
              Get in Touch
            </h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin size={18} className="text-blue-700 shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                  {churchInfo?.physicalLocation ||
                    "Nyerere Rd. / State House Rd. Junction, Nairobi, Kenya"}
                </span>
              </li>
              <li className="flex gap-4">
                <Phone size={18} className="text-blue-700 shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {churchInfo?.mainPhone || "+254 707 257 000"}
                </span>
              </li>
              <li className="flex gap-4">
                <Mail size={18} className="text-blue-700 shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {churchInfo?.contactEmail || "info@pceastandrews.org"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* RESPONSIVE BOTTOM BAR: Always visible */}
        <div className="border-t border-slate-200 dark:border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex gap-6 order-1 md:order-none">
            <Link
              to="/privacy-policy"
              className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-700 transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          <p className="text-sm text-slate-400 order-2 md:order-none">
            © {new Date().getFullYear()}{" "}
            {churchInfo?.churchName || "PCEA St. Andrew's"}. All rights
            reserved.
          </p>

          <Link 
            to="/ictmedia" 
            className="inline-block border border-slate-200 dark:border-slate-800 px-6 py-2 order-3 md:order-none hover:bg-blue-600 hover:border-blue-600 group transition-all duration-300"
          >
            <span className="text-[10px] tracking-[0.2em] font-medium text-slate-500 dark:text-slate-400 uppercase group-hover:text-white transition-colors">
            Stands Media
            </span>
          </Link>
          
        </div>
      </div>

      <button
        onClick={scrollTop}
        aria-label="Back to Top"
        className={`fixed bottom-10 right-10 z-[60] p-4 rounded-full bg-[#1e3a8a] text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
          showScroll
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ChevronUp size={24} />
      </button>
    </footer>
  );
};

export default Footer;
