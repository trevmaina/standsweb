import React, { useState, useEffect } from "react";
import {
  Image,
  Film,
  Layers,
  Save,
  Loader2,
  Plus,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

const HeroManager = () => {
  const [config, setConfig] = useState({
    heroType: "single",
    heroTitle: "",
    heroSubtitle: "",
    textPosition: "center",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const [singleFile, setSingleFile] = useState(null);
  const [carouselFiles, setCarouselFiles] = useState([]);
  const [previews, setPreviews] = useState({ single: null, carousel: [] });

  useEffect(() => {
    fetch("http://localhost:5000/api/hero")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setConfig(json.data);
          setPreviews({
            single: json.data.singleImage,
            carousel: json.data.carouselImages || [],
          });
          if (json.data.carouselImages) {
            setCarouselFiles(json.data.carouselImages.map(() => null));
          }
        }
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (index !== null) {
        const newFiles = [...carouselFiles];
        newFiles[index] = file;
        setCarouselFiles(newFiles);

        const newPreviews = [...previews.carousel];
        newPreviews[index] = reader.result;
        setPreviews({ ...previews, carousel: newPreviews });
      } else {
        setSingleFile(file);
        setPreviews({ ...previews, single: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg({ type: "", text: "" });

    const formData = new FormData();
    formData.append("heroType", config.heroType);
    formData.append("heroTitle", config.heroTitle);
    formData.append("heroSubtitle", config.heroSubtitle);
    formData.append("textPosition", config.textPosition);

    if (singleFile) formData.append("singleImage", singleFile);
    carouselFiles.forEach((file) => {
      if (file) formData.append("carouselImages", file);
    });

    try {
      const res = await fetch("http://localhost:5000/api/hero", {
        method: "PUT",
        body: formData, // Browser sets multipart/form-data boundary automatically
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", text: "Hero updated successfully!" });
        setConfig(data.data);
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "Update failed. Check server." });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
            Command Center
          </p>
          <h1 className="text-5xl font-black dark:text-white uppercase tracking-tighter leading-none">
            Hero Manager
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          Save Changes
        </button>
      </header>

      {statusMsg.text && (
        <div
          className={`mb-8 p-4 rounded-2xl font-bold text-sm ${statusMsg.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
        >
          {statusMsg.text}
        </div>
      )}

      <div className="space-y-12">
        {/* SECTION 1: CONTENT & PLACEMENT */}
        <section className="bg-white dark:bg-[#002034] p-6 md:p-10 rounded-[3rem] shadow-xl border dark:border-[#001D30]">
          <h3 className="text-sm font-black dark:text-white uppercase tracking-widest mb-8 border-b dark:border-slate-800 pb-4">
            1. Content & Placement
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4">
                  Main Heading
                </label>
                <textarea
                  rows="2"
                  className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-2xl dark:text-white font-bold text-xl outline-none border dark:border-slate-800"
                  value={config.heroTitle}
                  onChange={(e) =>
                    setConfig({ ...config, heroTitle: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4">
                  Subheading
                </label>
                <textarea
                  rows="3"
                  className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-2xl dark:text-white outline-none border dark:border-slate-800"
                  value={config.heroSubtitle}
                  onChange={(e) =>
                    setConfig({ ...config, heroSubtitle: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#000411] p-6 rounded-3xl border dark:border-slate-800">
              <p className="text-[10px] font-black uppercase text-slate-500 mb-6 text-center tracking-widest">
                Text Alignment
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "top-left", icon: AlignLeft },
                  { id: "center", icon: AlignCenter },
                  { id: "top-right", icon: AlignRight },
                  { id: "bottom-left", icon: AlignJustify },
                  { id: "bottom-center", icon: AlignCenter },
                  { id: "bottom-right", icon: AlignRight },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() =>
                      setConfig({ ...config, textPosition: pos.id })
                    }
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${config.textPosition === pos.id ? "border-blue-600 bg-blue-600/10 text-blue-600 scale-110" : "border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-[#002034]"}`}
                  >
                    <pos.icon size={24} />
                    <span className="text-[9px] font-black mt-2 uppercase">
                      {pos.id.replace("-", " ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: HERO STYLE */}
        <section className="bg-white dark:bg-[#002034] p-6 md:p-10 rounded-[3rem] shadow-xl border dark:border-[#001D30]">
          <h3 className="text-sm font-black dark:text-white uppercase tracking-widest mb-8 border-b dark:border-slate-800 pb-4">
            2. Hero Style
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: "single", label: "Single Image", icon: Image },
              { id: "carousel", label: "Carousel", icon: Layers },
              { id: "video", label: "Video", icon: Film },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setConfig({ ...config, heroType: style.id })}
                className={`flex items-center justify-center gap-4 p-6 rounded-2xl font-bold transition-all ${config.heroType === style.id ? "bg-blue-600 text-white shadow-xl" : "bg-slate-50 dark:bg-[#000411] text-slate-500"}`}
              >
                <style.icon size={20} /> {style.label}
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 3: MEDIA ASSETS */}
        <section className="bg-white dark:bg-[#002034] p-6 md:p-10 rounded-[3rem] shadow-xl border dark:border-[#001D30]">
          <h3 className="text-sm font-black dark:text-white uppercase tracking-widest mb-8 border-b dark:border-slate-800 pb-4">
            3. Media Assets
          </h3>

          {/*{config.heroType === "single" && (
            <label className="block aspect-video rounded-3xl overflow-hidden border-4 border-dashed border-slate-200 dark:border-slate-800 cursor-pointer relative group">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {previews.single ? (
                <img
                  src={previews.single}
                  className="w-full h-full object-cover"
                  alt="Hero Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Plus size={40} />{" "}
                  <span className="font-bold mt-2">Upload Hero Image</span>
                </div>
              )}
            </label>
          )} */}

          {config.heroType === "single" && (
            <div className="relative aspect-video rounded-3xl border-4 border-dashed border-slate-200 dark:border-slate-800 overflow-hidden group">
              {previews.single ? (
                <>
                  <img
                    src={
                      previews.single.startsWith("data")
                        ? previews.single
                        : `http://localhost:5000${previews.single}`
                    }
                    className="w-full h-full object-cover"
                    alt="Hero"
                  />
                  <button
                    onClick={() => {
                      setSingleFile(null);
                      setPreviews({ ...previews, single: null });
                    }}
                    className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Plus size={48} className="text-blue-500 mb-2" />
                  <span className="text-xs font-black uppercase text-slate-500 tracking-widest">
                    Click to Upload
                  </span>
                </label>
              )}
            </div>
          )}

          {config.heroType === "carousel" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previews.carousel.map((p, i) => (
                <div
                  key={i}
                  className="aspect-video bg-slate-100 dark:bg-[#000411] rounded-2xl overflow-hidden relative group border-2 border-slate-200 dark:border-slate-800"
                >
                  <img
                    src={p}
                    className="w-full h-full object-cover"
                    alt={`Slide ${i + 1}`}
                  />
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, i)}
                    />
                    <span className="text-white text-xs font-black uppercase">
                      Replace Image
                    </span>
                  </label>
                </div>
              ))}
              {previews.carousel.length < 6 && (
                <button
                  onClick={() =>
                    setPreviews({
                      ...previews,
                      carousel: [...previews.carousel, ""],
                    })
                  }
                  className="aspect-video border-4 border-dashed border-blue-600/30 rounded-2xl flex flex-col items-center justify-center text-blue-600 hover:bg-blue-600/5 transition-all"
                >
                  <Plus size={32} />{" "}
                  <span className="font-bold text-[10px] mt-2">ADD SLOT</span>
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HeroManager;
