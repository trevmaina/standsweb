import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  LayoutDashboard,
  Video,
  Calendar,
  LogOut,
  Menu,
  X,
  Cpu,
  MapPin,
  Sparkles,
  Settings,
  Radio,
  ChevronDown,
  ChevronRight,
  FileText,
  ClipboardList,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const AdminLayout = ({ children, darkMode, setDarkMode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false); // For Security Modal
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Live Streams",
      icon: <Radio size={20} />,
      path: "/admin/live-streams",
    },
    { name: "Sermons", icon: <Video size={20} />, path: "/admin/sermons" },
    { name: "Events", icon: <Calendar size={20} />, path: "/admin/events" },
    {
      name: "Pages",
      icon: <Sparkles size={20} />,
      isDropdown: true,
      subItems: [
        { name: "Hero Section", path: "/admin/hero-manager" },
        { name: "About Page", path: "/admin/about-manager" },
        { name: "Ministries", path: "/admin/ministries-manager" },
      ],
    },
    {
      name: "Intimations",
      icon: <FileText size={20} />,
      path: "/admin/intimations",
    },
    {
      name: "Forms",
      icon: <ClipboardList size={20} />,
      isDropdown: true,
      subItems: [
        { name: "Prayers", path: "/admin/prayers" },
        { name: "Visitors", path: "/admin/visitors" },
        { name: "Join Community", path: "/admin/join-community" },
        { name: "Space Booking", path: "/admin/space-bookings" },
        { name: "Events Registration", path: "/admin/registrations" },
      ],
    },
    {
      name: "Shop",
      icon: <ShoppingBag size={20} />,
      isDropdown: true,
      subItems: [
        { name: "Products", path: "/admin/products" },
        { name: "Orders", path: "/admin/orders" },
      ],
    },
    { name: "Rooms", icon: <MapPin size={20} />, path: "/admin/rooms" },
    {
      name: "Contact Feedback",
      icon: <MessageSquare size={20} />,
      path: "/admin/contact-feedback",
    },
    {
      name: "ICT & Media",
      icon: <Cpu size={20} />, // Lucide icon for tech/engine room
      isDropdown: true,
      subItems: [
        { name: "Volunteer Requests", path: "/admin/ict-volunteers" },
        { name: "ICT Page Manager", path: "/admin/ict-manager" },
      ],
    },
    { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    // UPDATED: Use sessionStorage to match your strict auth requirement
    sessionStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/update-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (data.success) {
        alert("Security Credentials Updated Successfully!");
        setShowProfileModal(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error. Could not update password.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#000411] transition-colors duration-300">
      {/* Sidebar logic remains same */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-[#002034] border-r border-slate-200 dark:border-[#001D30] transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1
            className={`font-black uppercase tracking-tighter dark:text-white ${!isSidebarOpen && "hidden"}`}
          >
            STACN<span className="text-blue-500 italic">ADMIN</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-slate-500 hover:text-blue-600"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-grow mt-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.isDropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center justify-between w-full p-3 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#001D30]"
                  >
                    <div className="flex items-center gap-4">
                      {item.icon}
                      {isSidebarOpen && <span>{item.name}</span>}
                    </div>
                    {isSidebarOpen &&
                      (openDropdowns[item.name] ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </button>
                  {openDropdowns[item.name] && isSidebarOpen && (
                    <div className="ml-9 mt-1 space-y-1 border-l-2 border-slate-100 dark:border-slate-800">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className={`block p-2 pl-4 text-xs font-bold rounded-r-lg transition-all ${
                            location.pathname === sub.path
                              ? "text-blue-600 bg-blue-50 dark:bg-blue-900/10 border-l-2 border-blue-600 -ml-[2px]"
                              : "text-slate-400 hover:text-blue-500"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 p-3 rounded-xl font-bold text-sm transition-all ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#001D30]"
                  }`}
                >
                  {item.icon}
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Exit Admin</span>}
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-[#002034] border-b border-slate-200 dark:border-[#001D30] flex items-center justify-between px-8">
          <span className="text-xs font-black dark:text-slate-500 uppercase tracking-widest">
            Command Center
          </span>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-[#001D30] text-slate-600 dark:text-yellow-400"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* PROFILE SECTION: Now Clickable for Security Modal */}
            <div
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 border-l dark:border-[#001D30] pl-6 cursor-pointer group hover:opacity-80 transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black dark:text-white uppercase leading-none group-hover:text-blue-500 transition-colors">
                  Admin User
                </p>
                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-tighter">
                  Superuser
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
                AD
              </div>
            </div>
          </div>
        </header>

        <section className="p-8 overflow-y-auto bg-slate-50 dark:bg-[#000411]">
          {children}
        </section>
      </main>

      {/* SECURITY / PASSWORD MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-[#002034] w-full max-w-sm rounded-[2.5rem] p-10 relative shadow-2xl border dark:border-slate-800 animate-in zoom-in duration-300">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-red-500"
            >
              <X size={24} />
            </button>

            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-blue-600/20">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">
                Security Key
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Manage Admin Access
              </p>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 ml-2">
                  Current Password
                </label>
                <input
                  name="currentPassword"
                  type="password"
                  required
                  className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold outline-none focus:border-blue-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 ml-2">
                  New Security Key
                </label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  className="w-full p-4 rounded-xl border dark:bg-[#0D1117] dark:border-slate-800 dark:text-white font-bold outline-none focus:border-blue-600"
                />
              </div>
              <button
                disabled={updating}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-all"
              >
                {updating ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Update Credentials"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
