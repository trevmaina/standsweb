import React from "react";
import { FileText, Scale, Globe, MessageSquare, ShieldAlert, Copyright } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#000411] transition-colors duration-500">
      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 bg-white dark:bg-[#000411] border-b dark:border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 px-5 py-2 rounded-full mb-8">
            <FileText size={14} className="text-blue-600" />
            <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[9px]">
              Legal Framework
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black dark:text-white uppercase tracking-tighter leading-none mb-6">
            Terms of <br /> <span className="text-blue-600 italic">Service</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto text-lg italic leading-relaxed">
            "By using this platform, you agree to walk with us in accordance with our community guidelines and values."
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT SIDE: MAIN TERMS */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* 1. Acceptance of Terms */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Scale className="text-blue-600" size={24} /> 01. Acceptance
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-loose">
                Welcome to the PCEA St. Andrews Church digital platform. By accessing our website, livestream, or mobile services, 
                you agree to be bound by these Terms of Service and all applicable laws in Kenya. If you do not agree, please 
                refrain from using our digital services.
              </p>
            </div>

            {/* 2. Intellectual Property */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Copyright className="text-blue-600" size={24} /> 02. Content Ownership
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-loose">
                All sermons, audio-visual recordings, graphics, and written intimations are the property of PCEA St. Andrews Church. 
                You are encouraged to share content for spiritual edification, but commercial redistribution or modification 
                without written consent is strictly prohibited.
              </p>
            </div>

            {/* Placeholder Image */}
            <div className="rounded-[3rem] overflow-hidden h-64 bg-slate-200 dark:bg-white/5 border dark:border-white/5">
               <img src="/placeholder-terms.jpg" alt="Church Sanctuary" className="w-full h-full object-cover opacity-40 grayscale" />
            </div>

            {/* 3. Community Conduct */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <MessageSquare className="text-blue-600" size={24} /> 03. Digital Conduct
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-loose">
                When using our Prayer Request forms or community chats, you agree to:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {["No hate speech or harassment", "Respect the privacy of others", "No commercial spamming", "Honest and truthful engagement"].map((item, i) => (
                  <li key={i} className="p-4 bg-white dark:bg-white/5 rounded-2xl border dark:border-white/10 text-sm font-bold dark:text-white flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* RIGHT SIDE: SUMMARY CARDS */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-6">
              
              <div className="p-8 bg-white dark:bg-[#161B22] rounded-[2.5rem] border dark:border-white/5 shadow-xl">
                <Globe className="text-blue-600 mb-4" size={28} />
                <h3 className="font-black text-xs uppercase tracking-widest dark:text-white mb-2">Governing Law</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  These terms are governed by the Laws of the Republic of Kenya. Any disputes shall be settled through 
                  ecclesiastical mediation before legal arbitration.
                </p>
              </div>

              <div className="p-8 bg-blue-700 rounded-[2.5rem] text-white shadow-2xl shadow-blue-900/40">
                <ShieldAlert className="mb-4 opacity-80" size={28} />
                <h3 className="font-black text-xs uppercase tracking-widest mb-2">Disclaimer</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  While we strive for 100% uptime, PCEA St. Andrews is not liable for technical interruptions during 
                  livestreams or online giving transactions.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Terms;