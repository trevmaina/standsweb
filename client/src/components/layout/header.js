import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ darkMode, setDarkMode, openPrayerModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:5000/api/livestreams")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          const activeStream = json.data.find((stream) => stream.isActive);
          setIsLive(!!activeStream);
        }
      });
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Sermons", href: "/sermons" },
    { name: "Ministries", href: "/ministries" },
    { name: "Events", href: "/events" },
    { name: "Intimations", href: "/intimations" },
    { name: "Give", href: "/give" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed w-full z-[100]">
      {/* TOPBAR */}
      <div className="hidden md:flex bg-[#000411] text-slate-400 py-3 px-10 justify-between text-[13px] font-bold tracking-wide border-b border-white/5">
        <div className="flex gap-8">
          <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
            <Mail size={14} className="text-blue-700" /> info@pceastandrews.org
          </span>
          <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
            <MapPin size={14} className="text-blue-700" /> Nyerere rd, Nairobi
          </span>
        </div>
        <div className="flex gap-8 items-center">
          <span className="text-white/40 italic">
            Mon - Fri 8:00am - 5:00pm
          </span>
          <span className="flex items-center gap-2 text-white">
            <Phone size={14} className="text-blue-700" /> +254 707 257 000
          </span>
          {isLive && (
            <Link
              to="/sermons?tab=livestream"
              className="flex items-center gap-2 text-red-500 animate-pulse font-black uppercase text-[10px] tracking-widest"
            >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              Live Now
            </Link>
          )}
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="bg-white/80 dark:bg-[#000411]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-all duration-500 px-6 md:px-10 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 relative overflow-hidden rounded-xl bg-[#ffffff] flex items-center justify-center">
            <img
              src="/logos/logo-1.png"
              alt="STACN Logo"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
          e.target.style.display = "none"; // Hide broken image icon
          e.target.nextSibling.style.display = "block"; // Show STAC text
        }}
            />
            <span style={{ display: "none" }} className="text-white font-black text-xs absolute">STAC</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl md:text-2xl tracking-tighter dark:text-white uppercase leading-none">
              St. Andrew's
            </span>
            <span className="text-[9px] font-black text-blue-700 uppercase tracking-[0.3em] mt-1">
              PCEA Church
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-[11px] font-black uppercase tracking-widest transition-all hover:text-blue-700 ${
                location.pathname === link.href
                  ? "text-blue-700"
                  : "dark:text-slate-300 text-slate-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-yellow-400 hover:scale-110 transition-all"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={openPrayerModal}
            className="hidden md:flex items-center gap-2 bg-[#1e3a8a] hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20"
          >
            Prayer Request <ChevronRight size={14} />
          </button>

          <button
            className="lg:hidden p-3 rounded-xl bg-[#1e3a8a] text-white relative z-[100]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-white dark:bg-[#000411] p-10 flex flex-col z-50 shadow-2xl"
            >
              <div className="mb-12">
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                  Navigation
                </span>
                <h2 className="text-4xl font-black dark:text-white uppercase tracking-tighter mt-2">
                  Menu
                </h2>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-2xl font-black dark:text-white uppercase tracking-tighter hover:text-blue-700 transition-colors py-2 border-b border-slate-100 dark:border-white/5"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-10">
                {/* Updated Mobile Button: Prayer Request (Dark Blue) */}
                <button
                  onClick={openPrayerModal}
                  className="w-full bg-[#1e3a8a] text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-colors"
                >
                  Prayer Request
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
