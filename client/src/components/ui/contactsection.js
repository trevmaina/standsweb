import React from "react";
import { UserPlus, Users, HeartHandshake } from "lucide-react";

const ContactSection = ({ onOpenVisitor, onOpenCommunity }) => (
  <section className="py-40 relative overflow-hidden bg-[#1e3a8a] transition-all duration-500">
    {/* VIBRANT COLORFUL BACKGROUND */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1d4ed8]" />

    {/* Animated Decorative Blobs for Color Depth */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />

    {/* Subtle Grid Pattern Overlay */}
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v2h-2v-2h2zm0 8v2h-2v-2h2zM6 34v2H4v-2h2zm0 8v2H4v-2h2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />

    <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
      {/* Subtle Floating Badge */}
      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full mb-8 backdrop-blur-md">
        <HeartHandshake size={14} className="text-white/80" />
        <span className="text-white/90 font-medium uppercase tracking-[0.4em] text-[9px]">
          Steps to Belonging
        </span>
      </div>

      {/* Subtle White Text with Bold Weight */}
      <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-none">
        There's a Place for <span className="opacity-70 italic">You</span> here.
      </h1>

      <p className="text-white/70 font-medium max-w-2xl mx-auto mb-14 text-xl italic leading-relaxed">
        "Whether you're visiting for the first time or looking for a home, we
        want to walk this journey of faith together."
      </p>

      {/* Buttons: High Contrast vs Glass Effect */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        <button
          onClick={onOpenVisitor}
          className="group flex items-center justify-center gap-4 bg-white text-[#1e3a8a] px-12 py-6 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <UserPlus
            size={20}
            className="group-hover:rotate-12 transition-transform"
          />
          I'm New Here
        </button>

        <button
          onClick={onOpenCommunity}
          className="group flex items-center justify-center gap-4 bg-white/10 backdrop-blur-md border border-white/30 text-white px-12 py-6 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-white/20 transition-all active:scale-95"
        >
          <Users
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          Join a Community
        </button>
      </div>
    </div>
  </section>
);

export default ContactSection;
