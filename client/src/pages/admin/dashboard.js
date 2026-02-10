import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Activity,
  DollarSign,
  FileText,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stats");
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Loading Intelligence...
        </p>
      </div>
    );

  const cardData = [
    {
      label: "Sermons",
      value: stats?.totalSermons,
      change: `+${stats?.monthlySermons} this month`,
      icon: <Activity />,
      color: "text-blue-500",
    },
    {
      label: "Shop Orders",
      value: stats?.orders,
      change: `${stats?.products} Products`,
      icon: <ShoppingBag />,
      color: "text-purple-500",
    },
    {
      label: "Events",
      value: stats?.totalEvents,
      change: `${stats?.upcomingEvents} upcoming`,
      icon: <Calendar />,
      color: "text-orange-500",
    },
    {
      label: "Intimations",
      value: stats?.intimations,
      change: "Active Notices",
      icon: <FileText />,
      color: "text-blue-400",
    },
    {
      label: "Total Revenue",
      value: `KES ${stats?.revenue?.toLocaleString()}`,
      change: "Paid Orders",
      icon: <DollarSign />,
      color: "text-green-500",
    },
    {
      label: "System",
      value: "Active",
      change: "DB Healthy",
      icon: <ShieldCheck />,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-blue-100 dark:bg-[#001D30] rounded-2xl text-blue-600">
          <LayoutDashboard size={32} />
        </div>
        <div>
          <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">
            Central Hub
          </h2>
          <h1 className="text-4xl md:text-6xl font-black dark:text-white uppercase tracking-tighter">
            Dashboard
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((stat, i) => (
          <div
            key={i}
            className="p-8 bg-white dark:bg-[#002034] border border-slate-100 dark:border-[#001D30] rounded-[2.5rem] relative group hover:border-blue-500/50 transition-all shadow-sm"
          >
            <div
              className={`absolute top-8 right-8 opacity-20 group-hover:opacity-100 transition-opacity ${stat.color}`}
            >
              {React.cloneElement(stat.icon, { size: 24 })}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              {stat.label}
            </p>
            <p className="text-4xl font-black dark:text-white mb-2 tracking-tighter">
              {stat.value}
            </p>
            <p
              className={`text-[10px] font-black uppercase tracking-tight ${stat.color}`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#002034] border border-slate-100 dark:border-[#001D30] rounded-[2.5rem] p-10">
          <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-8">
            Recent Activity
          </h3>
          <div className="space-y-6">
            {stats?.recentActivity?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b dark:border-white/5 pb-4 last:border-0"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <div>
                    <p className="text-sm font-black dark:text-white uppercase tracking-tight leading-none mb-1">
                      {item.title}
                    </p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                      {item.category}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-600 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center text-white shadow-xl shadow-blue-600/20">
          <ShieldCheck size={48} className="mb-4 opacity-50" />
          <h4 className="text-xl font-black uppercase tracking-tighter mb-2">
            System Integrity
          </h4>
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest">
            All database clusters are operational and synchronized.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
