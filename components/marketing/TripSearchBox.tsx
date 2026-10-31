"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePOSStore } from "@/lib/store/usePOSStore";
import { MOCK_TRIPS } from "@/lib/supabase/mock-data";
import { Trip } from "@/types";
import { formatCurrencyBDT, formatTimeBD } from "@/lib/utils";
import { Search, MapPin, Calendar, Bus, ArrowRight, ShieldCheck, Sparkles, Armchair } from "lucide-react";

export const TripSearchBox: React.FC = () => {
  const router = useRouter();
  const { setTrip } = usePOSStore();

  const [origin, setOrigin] = useState("Dhaka");
  const [destination, setDestination] = useState("Cox's Bazar");
  const [date, setDate] = useState("2026-11-01");
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>(MOCK_TRIPS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = MOCK_TRIPS.filter((t) => {
      const matchOrigin = !origin || t.origin_city.toLowerCase().includes(origin.toLowerCase());
      const matchDest = !destination || t.destination_city.toLowerCase().includes(destination.toLowerCase());
      return matchOrigin && matchDest;
    });
    setFilteredTrips(results);
  };

  const handleSelectTrip = (trip: Trip) => {
    setTrip(trip);
    router.push("/pos");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
      {/* Search Input Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Origin */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              From (Origin City)
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Dhaka">Dhaka (All Terminals)</option>
              <option value="Chittagong">Chittagong (Dampara / GEC)</option>
              <option value="Sylhet">Sylhet (Kadamtali)</option>
              <option value="Cox's Bazar">Cox's Bazar (Kolatoli)</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              To (Destination City)
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Cox's Bazar">Cox's Bazar</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Dhaka">Dhaka</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              Departure Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Available Trips</span>
            </button>
          </div>
        </form>
      </div>

      {/* Search Results Trips List */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Bus className="w-4 h-4 text-brand-600" />
            Scheduled Departures Found ({filteredTrips.length})
          </h2>
          <span className="text-xs text-slate-500">
            Realtime Counter Availability
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Operator & Coach Badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {trip.operator_name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {trip.bus_model}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                    {trip.coach_number}
                  </span>
                </div>

                {/* Route specs */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Origin / Boarding:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{trip.departure_counter_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Departure Time:</span>
                    <span className="font-black text-brand-700 dark:text-brand-400">
                      {formatTimeBD(trip.departure_time)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Seating Deck:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{trip.layout_type.toUpperCase()} Coach</span>
                  </div>
                </div>

                {/* Available seats */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Armchair className="w-3.5 h-3.5 text-brand-500" />
                    Seats Available:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {trip.available_seats_count} of {trip.total_seats_count}
                  </span>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Base Fare</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {formatCurrencyBDT(trip.base_fare)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTrip(trip)}
                  className="py-2 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Select & Book Seats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
