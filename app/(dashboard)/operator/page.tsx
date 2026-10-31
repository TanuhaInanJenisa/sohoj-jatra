"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { FleetManager } from "@/components/operator/FleetManager";
import { TripScheduler } from "@/components/operator/TripScheduler";
import { FinancialSummary } from "@/components/operator/FinancialSummary";
import { MOCK_COUNTERS } from "@/lib/supabase/mock-data";
import { Building2, BusFront, Calendar, BarChart3, MapPin, Plus, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function OperatorDashboardPage() {
  const { currentOperator } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"fleet" | "trips" | "counters" | "finance">("fleet");

  const [counters, setCounters] = useState(MOCK_COUNTERS);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [newCounterName, setNewCounterName] = useState("");
  const [newCity, setNewCity] = useState("Dhaka");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleAddCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounterName || !newAddress) return;

    const newCounter = {
      id: `cnt-${Date.now()}`,
      operator_id: currentOperator.id,
      name: newCounterName,
      code: `CNT-${Math.floor(100 + Math.random() * 900)}`,
      city: newCity,
      address: newAddress,
      contact_phone: newPhone || "01711000000",
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setCounters([...counters, newCounter]);
    setIsCounterModalOpen(false);
    setNewCounterName("");
    setNewAddress("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Operator Banner Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                {currentOperator.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 uppercase">
                {currentOperator.subscription_tier} Tier
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tenant ID: <span className="font-mono text-slate-700 dark:text-slate-300">{currentOperator.id}</span> • Slug: <span className="font-mono text-brand-600">/{currentOperator.slug}</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab("fleet")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "fleet"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <BusFront className="w-3.5 h-3.5 text-brand-600" />
            <span>Fleet & Seating</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("trips")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "trips"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-brand-600" />
            <span>Routes & Trips</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("counters")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "counters"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>Counters & Staff</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("finance")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "finance"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-brand-600" />
            <span>Financial Reports</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Fleet Management */}
      {activeTab === "fleet" && <FleetManager />}

      {/* Tab 2: Route & Trip Scheduler */}
      {activeTab === "trips" && <TripScheduler />}

      {/* Tab 3: Counter Locations & Cashiers */}
      {activeTab === "counters" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                Physical Booking Counters & Cashier Terminals
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Register counter stations across Bangladesh and restrict counter staff ticket issuance rights.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCounterModalOpen(true)}
              className="py-2.5 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Counter Terminal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {counters.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {c.code}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Online
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {c.name}
                </h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {c.address} ({c.city})
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  Hotline: {c.contact_phone}
                </div>
              </div>
            ))}
          </div>

          {/* Add Counter Modal */}
          {isCounterModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-600" />
                  Add Physical Counter Terminal
                </h3>
                <form onSubmit={handleAddCounter} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Counter Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Mohakhali Terminal Counter"
                      value={newCounterName}
                      onChange={(e) => setNewCounterName(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Street Address</label>
                    <input
                      type="text"
                      placeholder="Mohakhali Bus Stand, Dhaka"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="01711223344"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCounterModalOpen(false)}
                      className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold"
                    >
                      Save Counter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Financial Reports */}
      {activeTab === "finance" && <FinancialSummary />}

    </div>
  );
}
