import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Filter,
  Loader2,
} from "lucide-react";

const RegistrationsManager = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch only events that require registration
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("http://localhost:5000/api/events");
      const json = await res.json();
      if (json.success) {
        setEvents(json.data.filter((e) => e.requiresRegistration));
      }
    };
    fetchEvents();
  }, []);

  // Fetch registrations when an event is selected
  useEffect(() => {
    if (!selectedEvent) return;
    const fetchRegs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/registrations/event/${selectedEvent}`,
        );
        const json = await res.json();
        if (json.success) setRegistrations(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegs();
  }, [selectedEvent]);

  const toggleStatus = async (id, currentStatus) => {
    setUpdatingId(id);
    const newStatus = currentStatus === "Pending" ? "Confirmed" : "Pending";
    try {
      const res = await fetch(`http://localhost:5000/api/registrations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRegistrations(
          registrations.map((r) =>
            r._id === id ? { ...r, status: newStatus } : r,
          ),
        );
      }
    } catch (err) {
      alert("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl text-blue-600">
            <ClipboardList size={32} />
          </div>
          <div>
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">
              Submissions
            </h2>
            <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
              Event Forms
            </h1>
          </div>
        </div>

        {/* Replace the select container block with this updated version */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#161B22] p-3 rounded-2xl border dark:border-slate-800 shadow-sm transition-all hover:border-blue-500/50">
          <Filter size={20} className="text-slate-400 ml-2" />
          <select
            className="bg-transparent dark:text-white font-bold text-sm outline-none pr-8 cursor-pointer min-w-[180px]"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            {/* Explicitly styling options ensures they are readable in dark/light mode */}
            <option
              value=""
              className="bg-white dark:bg-[#161B22] text-slate-900 dark:text-white"
            >
              Select an Event
            </option>
            {events.map((e) => (
              <option
                key={e._id}
                value={e._id}
                className="bg-white dark:bg-[#161B22] text-slate-900 dark:text-white py-2"
              >
                {e.title}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="bg-white dark:bg-[#161B22] border dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-600" size={40} />
          </div>
        ) : registrations.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Attendee
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Contact
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Payment Code
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {registrations.map((reg) => (
                <tr
                  key={reg._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-8 py-6 font-bold dark:text-white uppercase text-sm">
                    {reg.fullName}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {reg.phone}
                      </span>
                      {reg.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} /> {reg.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {reg.transactionCode ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                          M-Pesa Code
                        </span>
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg font-mono font-bold text-xs uppercase border border-blue-100 dark:border-blue-800">
                          {reg.transactionCode}
                        </span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg font-black text-[9px] uppercase tracking-widest">
                        Free Entry
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`flex items-center gap-1.5 text-[9px] font-black uppercase ${reg.status === "Confirmed" ? "text-green-500" : "text-amber-500"}`}
                    >
                      {reg.status === "Confirmed" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Clock size={14} />
                      )}{" "}
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      disabled={updatingId === reg._id}
                      onClick={() => toggleStatus(reg._id, reg.status)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        reg.status === "Confirmed"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          : "bg-green-600 text-white shadow-lg shadow-green-600/20"
                      }`}
                    >
                      {updatingId === reg._id
                        ? "..."
                        : reg.status === "Confirmed"
                          ? "Unverify"
                          : "Verify"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs italic">
            {selectedEvent
              ? "No sign-ups recorded for this event yet."
              : "Select an event above to view registrations."}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationsManager;
