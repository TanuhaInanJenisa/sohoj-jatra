"use client";

import React from "react";
import { usePOSStore } from "@/lib/store/usePOSStore";
import { MOCK_COUNTERS, MOCK_TRIPS, MOCK_OPERATORS } from "@/lib/supabase/mock-data";
import { SeatMatrix } from "@/components/pos/SeatMatrix";
import { PassengerForm } from "@/components/pos/PassengerForm";
import { PricingSummary } from "@/components/pos/PricingSummary";
import { ThermalReceiptModal } from "@/components/pos/ThermalReceiptModal";
import { MonitorSmartphone, Building2, MapPin, Bus, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { formatTimeBD } from "@/lib/utils";

export default function CounterPOSPage() {
  const {
    currentOperator,
    currentCounter,
    currentTrip,
    setCounter,
    setTrip,
    setOperator,
  } = usePOSStore();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-3 sm:p-5 flex flex-col space-y-4">
      
      {/* POS Terminal Master Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Terminal Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs">
            <MonitorSmartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-slate-900 dark:text-white">
                Counter POS Terminal #01
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync (42ms)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Operator: <span className="font-bold text-slate-700 dark:text-slate-300">{currentOperator.name}</span>
            </p>
          </div>
        </div>

        {/* Counter and Trip Selectors */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Active Counter Location Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-[11px] font-bold text-slate-500">Counter:</span>
            <select
              value={currentCounter.id}
              onChange={(e) => {
                const found = MOCK_COUNTERS.find((c) => c.id === e.target.value);
                if (found) setCounter(found);
              }}
              className="text-xs font-bold bg-transparent border-none text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              {MOCK_COUNTERS.map((c) => (
                <option key={c.id} value={c.id} className="dark:bg-slate-900">
                  {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          {/* Active Trip Schedule Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Bus className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-[11px] font-bold text-slate-500">Departure:</span>
            <select
              value={currentTrip.id}
              onChange={(e) => {
                const found = MOCK_TRIPS.find((t) => t.id === e.target.value);
                if (found) setTrip(found);
              }}
              className="text-xs font-bold bg-transparent border-none text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              {MOCK_TRIPS.map((t) => (
                <option key={t.id} value={t.id} className="dark:bg-slate-900">
                  {t.coach_number} • {t.origin_city} ➔ {t.destination_city} ({formatTimeBD(t.departure_time)})
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* POS Workspace: Left is Seat Matrix, Right is Passenger Form & Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        
        {/* Left: Interactive Coach Seat Matrix (7 Cols on desktop) */}
        <div className="lg:col-span-7 h-full">
          <SeatMatrix />
        </div>

        {/* Right: Passenger Form & Financial Checkout Summary (5 Cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <PassengerForm />
          <PricingSummary />
        </div>

      </div>

      {/* Thermal Slip & Official Ticket Modal */}
      <ThermalReceiptModal />
    </div>
  );
}
