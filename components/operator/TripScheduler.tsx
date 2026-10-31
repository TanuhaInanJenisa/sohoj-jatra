"use client";

import React, { useState } from "react";
import { Trip, TripStatus } from "@/types";
import { MOCK_TRIPS, MOCK_ROUTES, MOCK_BUSES, MOCK_COUNTERS } from "@/lib/supabase/mock-data";
import { formatCurrencyBDT, formatTimeBD, formatDateBD } from "@/lib/utils";
import { Calendar, Plus, Clock, MapPin, Bus, AlertCircle } from "lucide-react";

export const TripScheduler: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [routeId, setRouteId] = useState("rt-1");
  const [busId, setBusId] = useState("bus-1");
  const [baseFare, setBaseFare] = useState(1600);
  const [departureTime, setDepartureTime] = useState("");

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const selRoute = MOCK_ROUTES.find((r) => r.id === routeId) || MOCK_ROUTES[0];
    const selBus = MOCK_BUSES.find((b) => b.id === busId) || MOCK_BUSES[0];

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      operator_id: "op-1",
      operator_name: "Green Line Paribahan",
      bus_id: selBus.id,
      bus_model: selBus.model,
      bus_type: selBus.bus_type,
      layout_type: selBus.layout_type,
      coach_number: selBus.coach_number,
      route_id: selRoute.id,
      origin_city: selRoute.origin_city,
      destination_city: selRoute.destination_city,
      departure_counter_id: "cnt-1",
      departure_counter_name: "Rajarbagh Central Terminal",
      arrival_counter_name: "Dampara Main Counter",
      departure_time: departureTime ? new Date(departureTime).toISOString() : new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      arrival_time: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
      base_fare: Number(baseFare),
      available_seats_count: selBus.total_seats,
      total_seats_count: selBus.total_seats,
      status: "scheduled",
    };

    setTrips([newTrip, ...trips]);
    setIsModalOpen(false);
  };

  const updateTripStatus = (tripId: string, status: TripStatus) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status } : t))
    );
  };

  return (
    <div className="space-y-4">
      {/* Header & CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            Route Departure Schedule & Realtime Dispatch
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure departure times, assign coaches, and control counter ticket sales windows.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Departure</span>
        </button>
      </div>

      {/* Trips Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px] bg-slate-50 dark:bg-slate-800/50">
                <th className="py-3 px-4">Trip ID / Coach</th>
                <th className="py-3 px-4">Route (Origin ➔ Dest)</th>
                <th className="py-3 px-4">Departure Time</th>
                <th className="py-3 px-4">Fare (BDT)</th>
                <th className="py-3 px-4">Seat Availability</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {trips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Coach / Model */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {t.coach_number}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {t.bus_model} ({t.layout_type.toUpperCase()})
                    </div>
                  </td>

                  {/* Route */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {t.origin_city} ➔ {t.destination_city}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Dep: {t.departure_counter_name}
                    </div>
                  </td>

                  {/* Departure */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {formatTimeBD(t.departure_time)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {formatDateBD(t.departure_time)}
                    </div>
                  </td>

                  {/* Fare */}
                  <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                    {formatCurrencyBDT(t.base_fare)}
                  </td>

                  {/* Available Seats */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-emerald-600">
                      {t.available_seats_count} Seats Left
                    </div>
                    <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{
                          width: `${(t.available_seats_count / t.total_seats_count) * 100}%`,
                        }}
                      />
                    </div>
                  </td>

                  {/* Status badge */}
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      t.status === "boarding"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse border border-amber-300"
                        : t.status === "in_transit"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200"
                    }`}>
                      {t.status}
                    </span>
                  </td>

                  {/* Quick Status Toggles */}
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={t.status}
                      onChange={(e) => updateTripStatus(t.id, e.target.value as TripStatus)}
                      className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="boarding">Boarding</option>
                      <option value="in_transit">In Transit</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              Schedule New Bus Departure
            </h3>

            <form onSubmit={handleCreateTrip} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Assigned Route</label>
                <select
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
                >
                  {MOCK_ROUTES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.route_name} ({r.distance_km} km)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Coach</label>
                <select
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
                >
                  {MOCK_BUSES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.coach_number} - {b.model} ({b.layout_type.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Base Seat Fare (৳)</label>
                  <input
                    type="number"
                    value={baseFare}
                    onChange={(e) => setBaseFare(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Departure Date & Time</label>
                  <input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  />
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
                  Publish Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
