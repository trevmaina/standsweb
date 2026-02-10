import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ArrowRight,
  MapPin,
  Loader2,
  ChevronRight,
} from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setEvents(json.data.slice(0, 3));
        setLoading(false);
      });
  }, []);

  return (
    /* TWEAKED: Using low-opacity black for a translucent feel */
    <section className="py-32 px-6 bg-black/[0.1] dark:bg-black/[0.9] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b dark:border-slate-800 pb-10">
          <div>
            <p className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
              Community Calendar
            </p>
            <h2 className="text-6xl font-black dark:text-white uppercase tracking-tighter leading-none">
              Upcoming <span className="text-blue-600 italic">Events</span>
            </h2>
          </div>
          <Link
            to="/events"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            View All Events <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {events.map((event) => (
              <div
                key={event._id}
                className="group relative bg-white dark:bg-[#161B22] rounded-[3rem] overflow-hidden border dark:border-slate-800 shadow-xl hover:-translate-y-4 transition-all duration-500"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={`http://localhost:5000${event.image}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={event.title}
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-blue-600">
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="p-10">
                  <div className="flex gap-4 mb-4 text-[10px] font-black uppercase text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {event.time || "All Day"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> Sanctuary
                    </span>
                  </div>
                  <h3 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-4 leading-none group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm line-clamp-2 mb-8 leading-relaxed">
                    {event.description}
                  </p>

                  <Link
                    to={`/events?id=${event._id}`}
                    className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-blue-600 dark:hover:bg-white dark:hover:text-blue-600 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <ChevronRight
                      size={16}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                    More Info
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
