import React from "react";
import {
  ShieldCheck,
  Eye,
  UserCheck,
  Baby,
  CameraOff,
  Mail,
  Phone,
} from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#000411] transition-colors duration-500">
      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 bg-white dark:bg-[#000411] border-b dark:border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 px-5 py-2 rounded-full mb-8">
            <ShieldCheck size={14} className="text-blue-600" />
            <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[9px]">
              Compliance & Safety
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black dark:text-white uppercase tracking-tighter leading-none mb-6">
            Data Protection & <br />{" "}
            <span className="text-blue-600 italic">Media Policy</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto text-lg italic leading-relaxed">
            "Ensuring a safe, respectful environment for worship while sharing
            the Gospel with the world." [cite: 19]
          </p>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* LEFT: POLICY CONTENT */}
          <div className="lg:col-span-8 space-y-20">
            {/* 1. The Legal Context */}
            <div className="space-y-6">
              <h2 className="text-3xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="text-blue-600">01.</span> The Legal Context
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-loose">
                <p>
                  In accordance with the{" "}
                  <strong>Kenya Data Protection Act (2019)</strong>, PCEA St.
                  Andrews Church operates as a "Data Controller." We treat your
                  personal image as sensitive personal data[cite: 7, 8, 11].
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border dark:border-white/10">
                    <h4 className="font-black text-blue-600 uppercase text-xs tracking-widest mb-2">
                      Data Subject
                    </h4>
                    <p className="text-sm">
                      The congregant or visitor whose data is processed[cite:
                      10].
                    </p>
                  </div>
                  <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border dark:border-white/10">
                    <h4 className="font-black text-blue-600 uppercase text-xs tracking-widest mb-2">
                      Consent
                    </h4>
                    <p className="text-sm">
                      Must be express, unequivocal, free, specific, and
                      informed[cite: 12, 13].
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder Image 1 */}
            <div className="rounded-[3rem] overflow-hidden h-96 bg-slate-200 dark:bg-white/5">
              <img
                src="/placeholder-privacy-1.jpg"
                alt="Congregation Worship"
                className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* 2. Sunday Services & Livestreaming */}
            <div className="space-y-6">
              <h2 className="text-3xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="text-blue-600">02.</span> Sunday Services
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Our services are broadcast live. By entering the main sanctuary,
                you acknowledge you may be visible in wide shots[cite: 43, 129].
              </p>
              <ul className="space-y-4">
                {[
                  {
                    title: "Wide Shots",
                    desc: "Focus on the altar and platform; crowd shots are for church reporting[cite: 45, 46].",
                  },
                  {
                    title: "Prayer Time",
                    desc: "Cameras avoid zooming in during personal prayer or altar calls without consent[cite: 47].",
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 p-6 bg-white dark:bg-white/5 rounded-3xl border dark:border-white/10"
                  >
                    <Eye className="text-blue-600 shrink-0" />
                    <div>
                      <h4 className="font-black dark:text-white uppercase text-xs tracking-widest">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Protecting Children */}
            <div className="space-y-6">
              <h2 className="text-3xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="text-blue-600">03.</span> Protecting Children
              </h2>
              <div className="p-8 bg-blue-600/5 border border-blue-600/20 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-3 text-blue-600">
                  <Baby size={24} />
                  <span className="font-black uppercase tracking-widest text-sm">
                    Strict Parental Consent Required
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  No child (Under 18) will be featured in Sunday School
                  presentations or choir photography without a signed consent
                  form. We never publish children's full names alongside
                  photographs[cite: 57, 58, 59].
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: STICKY SIDEBAR FOR QUICK INFO */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-8">
              {/* Media-Free Zone Card [cite: 73, 76] */}
              <div className="p-8 bg-[#1e3a8a] rounded-[2.5rem] text-white shadow-2xl shadow-blue-900/40">
                <CameraOff size={32} className="mb-6 opacity-80" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-none">
                  Media-Free <br /> Zones
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Designated "Blind Spots" are available in the sanctuary where
                  filming is strictly prohibited[cite: 73, 76].
                </p>
                <div className="pt-6 border-t border-white/10 text-xs font-black uppercase tracking-[0.2em]">
                  Ask an usher for guidance [cite: 79]
                </div>
              </div>

              {/* Rights Checklist [cite: 137, 138, 140] */}
              <div className="p-8 bg-white dark:bg-[#161B22] rounded-[2.5rem] border dark:border-white/5 shadow-xl">
                <h4 className="font-black text-blue-600 uppercase text-[10px] tracking-[0.4em] mb-6">
                  Your Rights
                </h4>
                <ul className="space-y-4">
                  {[
                    "Right to be informed [cite: 106]",
                    "Right to object [cite: 110]",
                    "Right to access photos [cite: 139]",
                    "Right to request deletion [cite: 115]",
                  ].map((right, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm font-bold dark:text-white"
                    >
                      <UserCheck size={16} className="text-blue-600" /> {right}
                    </li>
                  ))}
                </ul>
              </div>

              {/* DPO Contact [cite: 123, 124, 125] */}
              <div className="p-8 bg-white dark:bg-[#161B22] rounded-[2.5rem] border dark:border-white/5 shadow-xl">
                <h4 className="font-black text-blue-600 uppercase text-[10px] tracking-[0.4em] mb-6">
                  Contact DPO
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-bold dark:text-white">
                    <Mail size={16} className="text-blue-600" />{" "}
                    ict.team@pceastandrews.org
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold dark:text-white">
                    <Phone size={16} className="text-blue-600" /> +254 707 257
                    000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
