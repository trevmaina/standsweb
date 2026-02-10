import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, ArrowLeft, Loader2, Info } from "lucide-react";

const DistrictDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/about/district/${id}`,
        );
        const json = await res.json();
        if (json.success) setDistrict(json.data);
      } catch (err) {
        console.error("Error fetching district:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDistrict();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center p-20 min-h-screen items-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  if (!district)
    return (
      <div className="pt-32 text-center font-bold">District not found.</div>
    );

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-700 mb-12 transition-all font-black uppercase text-[10px] tracking-widest"
      >
        <ArrowLeft size={16} /> Back to Parish Community
      </button>

      <div className="bg-white dark:bg-[#161B22] rounded-[3.5rem] p-10 md:p-16 shadow-2xl border dark:border-slate-800">
        <div className="mb-12 border-b dark:border-slate-800 pb-8">
          <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
            District Profile
          </p>
          <h1 className="text-5xl md:text-6xl font-black dark:text-white uppercase tracking-tighter leading-none">
            {district.name}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-10">
            <div className="flex items-start gap-5">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-600">
                <Calendar size={28} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">
                  Fellowship Schedule
                </p>
                <p className="text-2xl font-black dark:text-white uppercase tracking-tight">
                  {district.fellowshipTime}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0d1117] p-10 rounded-[2.5rem] border dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-blue-600" size={24} />
              <h4 className="font-black uppercase tracking-widest text-xs dark:text-white">
                Location Coverage
              </h4>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
              {district.locationDescription ||
                "This district covers members residing in and around this local area."}
            </p>
            <div className="mt-8 flex items-center gap-2 bg-blue-600/5 p-4 rounded-xl border border-blue-600/10">
              <Info size={16} className="text-blue-600" />
              <p className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                Contact church office for exact meeting house
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictDetail;
