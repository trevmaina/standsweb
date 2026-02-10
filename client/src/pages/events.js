import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowUpRight,
  Loader2,
  Star,
} from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        const json = await response.json();
        if (json.success) {
          const sortedData = json.data.sort(
            (a, b) => new Date(a.date) - new Date(b.date),
          );
          setEvents(sortedData);
        }
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // Logic to separate upcoming and past for the filter
  const today = new Date().setHours(0, 0, 0, 0);
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date).getTime();
    return filter === "upcoming" ? eventDate >= today : eventDate < today;
  });

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">
          Syncing the Calendar...
        </p>
      </div>
    );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
            PCEA St. Andrews
          </h2>
          <h1 className="text-6xl font-black dark:text-white uppercase tracking-tighter">
            Events Calendar
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex gap-1">
          {["upcoming", "past"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              onClick={() => navigate(`/events/${event._id}`)}
              className="group relative h-[550px] rounded-[3rem] overflow-hidden bg-slate-200 dark:bg-slate-900 cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* MAIN POSTER IMAGE */}
              <img
                src={`http://localhost:5000${event.image}`}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* OVERLAYS */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              {/* TOP BADGES */}
              <div className="absolute top-8 left-8 flex flex-col gap-2">
                <span className="w-fit px-4 py-1.5 bg-white/90 backdrop-blur text-blue-900 text-[9px] font-black uppercase tracking-widest rounded-full">
                  {event.category}
                </span>
                {event.priority && (
                  <span className="flex items-center gap-1 w-fit px-4 py-1.5 bg-yellow-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    <Star size={10} className="fill-white" /> Featured
                  </span>
                )}
              </div>

              {/* HOVER DETAILS (SLIDE UP) */}
              <div className="absolute inset-x-0 bottom-0 p-10 transform translate-y-20 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white/70 text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-400" />{" "}
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-blue-400" />{" "}
                      {event.time || "TBA"}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                    {event.title}
                  </h3>

                  {/* ONLY VISIBLE ON HOVER */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    <div className="flex items-center gap-2 text-white/60 text-xs font-bold mb-8">
                      <MapPin size={16} className="text-red-500" />{" "}
                      {event.location || "Main Sanctuary"}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-blue-600 px-6 py-3 rounded-full flex items-center gap-2">
                        Event Details <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-40 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[4rem]">
            <Calendar
              className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
              size={64}
            />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
              No {filter} events found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
