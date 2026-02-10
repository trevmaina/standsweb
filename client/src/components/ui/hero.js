import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  const [config, setConfig] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/hero")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setConfig(json.data);
      });
  }, []);

  useEffect(() => {
    if (config?.heroType === "carousel" && config.carouselImages?.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((s) => (s + 1) % config.carouselImages.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [config]);

  if (!config) return <div className="h-screen bg-[#000411]" />;

  const getAlignment = (pos) => {
    switch (pos) {
      case "top-left":
        return "items-start justify-start text-left p-12 md:p-24";
      case "top-right":
        return "items-start justify-end text-right p-12 md:p-24";
      case "bottom-left":
        return "items-end justify-start text-left p-12 md:p-24";
      case "bottom-right":
        return "items-end justify-end text-right p-12 md:p-24";
      case "bottom-center":
        return "items-end justify-center text-center pb-24 md:pb-32";
      case "center":
      default:
        return "items-center justify-center text-center p-6";
    }
  };

  const layoutClasses = getAlignment(config.textPosition);

  return (
    <section
      className={`
        relative w-full flex overflow-hidden group 
        ${layoutClasses}
        /* Mobile: Navbar only (68px) */
        mt-[68px] h-[calc(100vh-68px)] 
        /* Desktop: Topbar + Navbar (104px) */
        md:mt-[104px] md:h-[calc(100vh-104px)]
      `}
    >
      {/* BACKGROUNDS */}
      <div className="absolute inset-0 z-0">
        {config.heroType === "single" && (
          <img
            src={`http://localhost:5000${config.singleImage}`}
            className="w-full h-full object-cover"
            alt="Hero"
          />
        )}
        {config.heroType === "carousel" &&
          config.carouselImages?.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-1000 ${
                i === currentSlide
                  ? "opacity-100 scale-105"
                  : "opacity-0 scale-100"
              }`}
            >
              <img
                src={`http://localhost:5000${img}`}
                className="w-full h-full object-cover"
                alt="Slide"
              />
            </div>
          ))}

        {config.heroType === "video" && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={config.videoUrl} type="video/mp4" />
          </video>
        )}
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />
      </div>

      {/* TEXT CONTENT */}
      <div className="relative z-10 w-full max-w-5xl">
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {config.heroTitle}
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 font-medium max-w-2xl mx-auto md:mx-0 opacity-90 mb-12">
          {config.heroSubtitle}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-900/20">
            Plan Visit
          </button>
          <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all">
            Learn More
          </button>
        </div>
      </div>

      {/* CAROUSEL ARROWS */}
      {config.heroType === "carousel" && config.carouselImages?.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 z-20 pointer-events-none">
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev - 1 + config.carouselImages.length) %
                  config.carouselImages.length,
              )
            }
            className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-auto hover:bg-white/20"
          >
            <ChevronLeft size={30} />
          </button>
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev + 1) % config.carouselImages.length,
              )
            }
            className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-auto hover:bg-white/20"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}

      {/* Slide Indicators */}
      {config.heroType === "carousel" && config.carouselImages?.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {config.carouselImages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? "w-10 bg-blue-600" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
