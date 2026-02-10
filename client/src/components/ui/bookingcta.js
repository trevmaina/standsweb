import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

const BookingCTA = () => (
  <section className="py-24 px-6 bg-slate-50 dark:bg-[#000411] transition-colors duration-500">
    <div className="max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[3.5rem] bg-white dark:bg-[#002034] border border-slate-200 dark:border-slate-800 shadow-2xl transition-all hover:shadow-blue-500/5">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-400/5 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-12 md:p-20 gap-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-[#161B22] px-4 py-2 rounded-full mb-6">
              <MapPin size={14} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Venues & Spaces
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black dark:text-white uppercase tracking-tighter leading-none mb-4">
              Reserve Your <span className="text-blue-600 italic">Space</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold max-w-lg leading-relaxed uppercase text-[11px] tracking-widest">
              From seminars to community gatherings, our sanctuary and halls are
              available for your special events.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              to="/book-a-space"
              className="bg-slate-900 dark:bg-blue-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-600 dark:hover:bg-white dark:hover:text-blue-600 transition-all flex items-center justify-center gap-3"
            >
              Book a Room <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BookingCTA;
