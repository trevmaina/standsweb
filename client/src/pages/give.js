import React, { useState } from "react";
import {
  Smartphone,
  CreditCard,
  DollarSign,
  Heart,
  ShieldCheck,
  Calendar,
  Lock,
} from "lucide-react";

const Give = () => {
  const [activeTab, setActiveTab] = useState("mpesa");

  const paymentMethods = [
    { id: "mpesa", label: "M-Pesa", icon: <Smartphone size={18} /> },
    { id: "airtel", label: "Airtel Money", icon: <Smartphone size={18} /> },
    { id: "card", label: "Visa/Mastercard", icon: <CreditCard size={18} /> },
    { id: "paypal", label: "PayPal", icon: <DollarSign size={18} /> },
  ];

  const handleGive = (e) => {
    e.preventDefault();

    /* --- API INTEGRATION POINT (IntaSend / Daraja) ---
      1. MPESA/AIRTEL (STK Push): 
         Endpoint: https://api.intasend.com/api/v1/payment/mpesa-stk-push/
         Required: phone_number, amount, label
         
      2. CARD (Direct Charge): 
         Endpoint: https://api.intasend.com/api/v1/checkout/
         Required: card_number, cvv, expiry_month, expiry_year, amount, first_name
         
      3. PAYPAL: Standard Client ID integration.
    */

    alert(`Processing ${activeTab.toUpperCase()} payment...`);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
          Support Our Mission
        </h2>
        <h1 className="text-5xl md:text-6xl font-black dark:text-white mb-4 tracking-tighter uppercase">
          Givings and Donations
        </h1>
      </div>

      {/* Payment Method Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setActiveTab(method.id)}
            className={`flex items-center justify-center gap-3 p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border-2 ${
              activeTab === method.id
                ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/20"
                : "bg-transparent text-gray-400 border-gray-100 dark:border-gray-800 hover:border-blue-300"
            }`}
          >
            {method.icon} {method.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div className="lg:col-span-2 bg-white dark:bg-[#161B22] p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
              <Heart size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">
              Secure {activeTab} Transfer
            </h3>
          </div>

          <form onSubmit={handleGive} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field - Dynamic Requirement */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required={activeTab === "card"}
                  placeholder={
                    activeTab === "mpesa" || activeTab === "airtel"
                      ? "Enter Full Name (optional)"
                      : "Enter Full Name"
                  }
                  className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-100 dark:border-gray-800 p-4 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-600 transition-all font-bold"
                />
              </div>

              {/* Dynamic Contact Field */}
              {activeTab === "mpesa" || activeTab === "airtel" ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Phone Number (STK Push)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="2547XXXXXXXX"
                    className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-100 dark:border-gray-800 p-4 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-600 transition-all font-bold"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-100 dark:border-gray-800 p-4 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-600 transition-all font-bold"
                  />
                </div>
              )}
            </div>

            {/* Direct Card Entry Fields */}
            {activeTab === "card" && (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-100 dark:border-gray-800 p-4 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-600 transition-all font-bold"
                    />
                    <CreditCard
                      className="absolute right-4 top-4 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Expiry Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-100 dark:border-gray-800 p-4 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-600 transition-all font-bold"
                      />
                      <Calendar
                        className="absolute right-4 top-4 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      CVC / CVV
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="123"
                        className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-100 dark:border-gray-800 p-4 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-600 transition-all font-bold"
                      />
                      <Lock
                        className="absolute right-4 top-4 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Giving Purpose
                </label>
                <select className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-100 dark:border-gray-800 p-4 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-600 transition-all font-bold appearance-none">
                  <option value="tithe">Tithes</option>
                  <option value="offering">Offerings</option>
                  <option value="building">Building Fund</option>
                  <option value="missions">Missions & Outreach</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Amount ({activeTab === "paypal" ? "USD" : "KES"})
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-100 dark:border-gray-800 p-4 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-600 transition-all font-black text-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-600/20"
            >
              Process {activeTab} Payment
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-400">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                PCI-DSS Compliant Encryption
              </span>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#161B22] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
            <h4 className="font-black uppercase text-[10px] tracking-widest text-blue-600 mb-4">
              Bank Transfer
            </h4>
            <div className="text-sm space-y-4 font-bold dark:text-white">
              <p>
                <span className="text-[9px] block text-gray-400 uppercase mb-1">
                  Payable to:
                </span>
                PCEA St Andrew's Church
              </p>
              <p>
                <span className="text-[9px] block text-gray-400 uppercase mb-1">
                  Bank Name:
                </span>
                Standard Chartered Bank
              </p>
              <p>
                <span className="text-[9px] block text-gray-400 uppercase mb-1">
                  Account No:
                </span>
                01020304050600
              </p>
            </div>
          </div>
          <div className="bg-blue-600 p-8 rounded-3xl text-center text-white shadow-xl shadow-blue-600/20">
            <Heart className="mx-auto mb-4" size={32} />
            <h4 className="font-black uppercase tracking-tighter text-xl mb-2">
              Thank You
            </h4>
            <p className="text-xs font-bold leading-relaxed opacity-80 uppercase tracking-tight">
              Your generous giving helps us reach more people with God's love.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Give;
