"use client";

import React, { useState } from "react";
import { Bus, BusType, SeatingLayout } from "@/types";
import { MOCK_BUSES } from "@/lib/supabase/mock-data";
import { BusFront, Plus, Wifi, BatteryCharging, Droplet, Armchair, CheckCircle } from "lucide-react";

export const FleetManager: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>(MOCK_BUSES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [coachNumber, setCoachNumber] = useState("");
  const [regNo, setRegNo] = useState("");
  const [model, setModel] = useState("Scania K410 Multi-Axle");
  const [busType, setBusType] = useState<BusType>("ac_business");
  const [layoutType, setLayoutType] = useState<SeatingLayout>("2x2");
  const [totalSeats, setTotalSeats] = useState(36);
  const [hasWifi, setHasWifi] = useState(true);
  const [hasChargingPort, setHasChargingPort] = useState(true);
  const [hasWater, setHasWater] = useState(true);

  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachNumber || !regNo) return;

    const newBus: Bus = {
      id: `bus-${Date.now()}`,
      operator_id: "op-1",
      coach_number: coachNumber,
      reg_no: regNo,
      model,
      bus_type: busType,
      layout_type: layoutType,
      total_seats: totalSeats,
      has_wifi: hasWifi,
      has_charging_port: hasChargingPort,
      has_water: hasWater,
      is_active: true,
    };

    setBuses([newBus, ...buses]);
    setIsModalOpen(false);
    setCoachNumber("");
    setRegNo("");
  };

  return (
    <div className="space-y-5">
      {/* Top Header & CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BusFront className="w-5 h-5 text-brand-600" />
            Fleet & Seating Layout Blueprints
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure coach seating architectures (2x2 Executive, 2x3 Local, Sleeper Coach Deck).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Coach</span>
        </button>
      </div>

      {/* Bus Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-shadow space-y-4"
          >
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200">
                  {bus.bus_type.replace("_", " ").toUpperCase()}
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-1">
                  {bus.coach_number}
                </h3>
                <p className="text-xs text-slate-500">{bus.model}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 block">
                  {bus.reg_no}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Active In Fleet</span>
              </div>
            </div>

            {/* Layout blueprint tag */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Seating Deck:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{bus.layout_type.toUpperCase()} Architecture</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Capacity:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{bus.total_seats} Passenger Seats</span>
              </div>
            </div>

            {/* Amenities icons */}
            <div className="flex items-center gap-3 text-slate-500 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
              {bus.has_wifi && (
                <div className="flex items-center gap-1 text-[11px]" title="Free High-Speed Wi-Fi">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Wi-Fi</span>
                </div>
              )}
              {bus.has_charging_port && (
                <div className="flex items-center gap-1 text-[11px]" title="USB Fast Charging Ports">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Charging</span>
                </div>
              )}
              {bus.has_water && (
                <div className="flex items-center gap-1 text-[11px]" title="Complimentary Mineral Water">
                  <Droplet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Water</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Bus Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BusFront className="w-5 h-5 text-brand-600" />
              Register New Fleet Bus
            </h3>

            <form onSubmit={handleAddBus} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Coach Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. GL-805"
                    value={coachNumber}
                    onChange={(e) => setCoachNumber(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">BRTA Registration *</label>
                  <input
                    type="text"
                    placeholder="Dhaka Metro-BA-12-3456"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Bus Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Bus Type</label>
                  <select
                    value={busType}
                    onChange={(e) => setBusType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
                  >
                    <option value="ac_business">AC Business Class</option>
                    <option value="ac_economy">AC Economy</option>
                    <option value="non_ac">Non-AC Deluxe</option>
                    <option value="sleeper_coach">Luxury Sleeper</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Seating Layout</label>
                  <select
                    value={layoutType}
                    onChange={(e) => {
                      const l = e.target.value as SeatingLayout;
                      setLayoutType(l);
                      setTotalSeats(l === "sleeper" ? 28 : l === "2x3" ? 44 : 36);
                    }}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
                  >
                    <option value="2x2">2x2 (4 seats/row)</option>
                    <option value="2x3">2x3 (5 seats/row)</option>
                    <option value="sleeper">Sleeper Deck</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold"
                >
                  Save Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
