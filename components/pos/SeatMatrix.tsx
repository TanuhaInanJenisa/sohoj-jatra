"use client";

import React, { useEffect } from "react";
import { usePOSStore } from "@/lib/store/usePOSStore";
import { useLanguageStore } from "@/lib/store/useLanguageStore";
import { realtimeSeatSync } from "@/lib/supabase/client";
import { Armchair, Lock, UserCheck, Sparkles, Layers, BedDouble, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const SeatMatrix: React.FC = () => {
  const {
    seats,
    selectedSeatNumbers,
    currentTrip,
    activeDeck,
    setActiveDeck,
    toggleSeat,
    simulateIncomingCounterLock,
    simulateIncomingBooking,
  } = usePOSStore();

  const { t, formatDigits, language } = useLanguageStore();

  // Listen to realtime seat sync events across tabs
  useEffect(() => {
    const unsubscribe = realtimeSeatSync.subscribe((event) => {
      if (event.tripId !== currentTrip.id) return;

      if (event.type === "LOCK") {
        simulateIncomingCounterLock(event.seatNumbers, event.counterName);
      } else if (event.type === "BOOKED") {
        simulateIncomingBooking(event.seatNumbers, event.gender || "Male");
      }
    });

    return () => unsubscribe();
  }, [currentTrip.id, simulateIncomingCounterLock, simulateIncomingBooking]);

  const isSleeperCoach = currentTrip.layout_type === "sleeper" || currentTrip.bus_type === "sleeper_coach";

  // Filter seats by active deck if multi-deck
  const visibleSeats = seats.filter((s) => !s.deck || s.deck === activeDeck);

  // Group seats by row
  const rowLabels = Array.from(new Set(visibleSeats.map((s) => s.seat_number.replace(/^[LU]-/, "").charAt(0)))).sort();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col h-full">
      
      {/* Header & Status Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Armchair className="w-5 h-5 text-brand-600" />
            <span>{t("deckTitle")}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200">
              {currentTrip.layout_type.toUpperCase()} • {currentTrip.coach_number}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === "bn"
              ? "সিটে ক্লিক করে নির্বাচন করুন। সুপারবেস রিয়েল-টাইম কনকারেন্সি সক্রিয়।"
              : "Click seats to reserve. Supabase Realtime synchronization active."}
          </p>
        </div>

        {/* Sleeper / Double Decker Switcher */}
        {isSleeperCoach && (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveDeck("lower")}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDeck === "lower"
                  ? "bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <BedDouble className="w-3.5 h-3.5" />
              <span>{t("deckLower")}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveDeck("upper")}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDeck === "upper"
                  ? "bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t("deckUpper")}</span>
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-white border-2 border-slate-300" />
            <span className="text-slate-600 dark:text-slate-400">{t("available")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-brand-500 border border-brand-600 shadow-xs" />
            <span className="font-semibold text-brand-700 dark:text-brand-400">{t("selectedYou")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500 animate-pulse" />
            <span className="text-amber-700 dark:text-amber-400">{t("lockedOther")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-slate-300 dark:bg-slate-700 border border-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">{t("booked")}</span>
          </div>
        </div>
      </div>

      {/* Bus Layout Canvas */}
      <div className="flex-1 flex flex-col justify-center items-center py-6 overflow-y-auto">
        <div className="w-full max-w-md bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-300 dark:border-slate-700 rounded-3xl p-5 relative shadow-inner">
          
          {/* Driver Cabin Front */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-dashed border-slate-300 dark:border-slate-700">
            {/* Passenger Entry Door */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {t("doorEntry")}
              </span>
              <div className="w-10 h-3 bg-emerald-500/20 border border-emerald-500 rounded text-[9px] text-emerald-700 dark:text-emerald-300 font-medium text-center leading-3">
                GATE
              </div>
            </div>

            {/* Deck & Windshield Indicator */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-1 bg-slate-400 dark:bg-slate-600 rounded-full mb-1" />
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                {isSleeperCoach ? `${t("deckTitle")} (${activeDeck.toUpperCase()})` : "WINDSHIELD"}
              </span>
            </div>

            {/* Driver Steering Wheel */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {t("driverCockpit")}
              </span>
              <div className="w-8 h-8 rounded-full border-2 border-slate-600 dark:border-slate-400 flex items-center justify-center bg-slate-200 dark:bg-slate-800">
                <div className="w-3 h-3 rounded-full bg-slate-700 dark:bg-slate-300" />
              </div>
            </div>
          </div>

          {/* Seat Grid Rows */}
          <div className="space-y-3">
            {rowLabels.map((rowLetter) => {
              const rowSeats = visibleSeats.filter((s) => s.seat_number.replace(/^[LU]-/, "").startsWith(rowLetter));
              const leftSeats = isSleeperCoach ? rowSeats.slice(0, 1) : rowSeats.slice(0, 2);
              const rightSeats = isSleeperCoach ? rowSeats.slice(1) : rowSeats.slice(2);

              return (
                <div key={rowLetter} className="flex items-center justify-between gap-3">
                  {/* Left Column */}
                  <div className="flex items-center gap-2">
                    {leftSeats.map((seat) => renderSeatButton(seat))}
                  </div>

                  {/* Aisle Space with Row Label */}
                  <div className="w-8 flex items-center justify-center text-xs font-bold text-slate-300 dark:text-slate-600 select-none">
                    {rowLetter}
                  </div>

                  {/* Right Column */}
                  <div className="flex items-center gap-2">
                    {rightSeats.map((seat) => renderSeatButton(seat))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bus Rear */}
          <div className="mt-5 pt-3 border-t-2 border-dashed border-slate-300 dark:border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              REAR / BACK CABIN
            </span>
          </div>
        </div>
      </div>

      {/* Concurrent Counter Simulation Toolbar */}
      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-semibold">
            {language === "bn" ? "মাল্টি-কাউন্টার সিট রেস সিমুলেটর:" : "Simulate Multi-Counter Race Conditions:"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => simulateIncomingCounterLock(["E1", "E2"], "Sayedabad Counter #04")}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 transition-colors font-medium flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            {language === "bn" ? "সায়েদাবাদ থেকে E1, E2 লক করুন" : "Lock E1, E2 from Sayedabad"}
          </button>
          <button
            type="button"
            onClick={() => simulateIncomingBooking(["G3", "G4"], "Female")}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 transition-colors font-medium flex items-center gap-1"
          >
            <UserCheck className="w-3 h-3" />
            {language === "bn" ? "গাবতলী থেকে G3, G4 বিক্রি করুন" : "Book G3, G4 from Gabtoli"}
          </button>
        </div>
      </div>
    </div>
  );

  function renderSeatButton(seat: typeof seats[0]) {
    const isSelected = selectedSeatNumbers.includes(seat.seat_number);
    const isLockedByOther = seat.status === "locked" && !isSelected;
    const isBooked = seat.status === "booked";

    let stateClasses = "bg-white hover:bg-brand-50 border-slate-300 text-slate-700 hover:border-brand-500 shadow-xs cursor-pointer";

    if (isSelected) {
      stateClasses = "bg-brand-600 border-brand-700 text-white shadow-md ring-2 ring-brand-400 scale-105 cursor-pointer font-bold";
    } else if (isLockedByOther) {
      stateClasses = "bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-950 dark:text-amber-200 cursor-not-allowed opacity-90 animate-pulse";
    } else if (isBooked) {
      stateClasses = "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 cursor-not-allowed";
    }

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isLockedByOther || isBooked}
        onClick={() => toggleSeat(seat.seat_number)}
        title={
          isLockedByOther
            ? `Locked by ${seat.locked_by_counter_name || "Another Counter"}`
            : isBooked
            ? `Booked (${seat.passenger_gender || "Reserved"})`
            : `Click to select seat ${seat.seat_number} (৳${seat.fare})`
        }
        className={cn(
          "w-11 h-12 rounded-lg border flex flex-col items-center justify-between p-1 transition-all duration-150 relative group",
          stateClasses
        )}
      >
        <div className={cn(
          "w-6 h-1.5 rounded-t-sm",
          isSelected ? "bg-white/40" : isBooked ? "bg-slate-300 dark:bg-slate-700" : isLockedByOther ? "bg-amber-300" : "bg-slate-200 dark:bg-slate-700"
        )} />

        <span className="text-xs font-bold leading-none tracking-tight">
          {formatDigits(seat.seat_number)}
        </span>

        <div className="text-[9px] leading-none">
          {isSelected && <span className="text-[8px] font-black uppercase text-brand-100">YOU</span>}
          {isLockedByOther && <Lock className="w-2.5 h-2.5 text-amber-600" />}
          {isBooked && (
            <span className="text-[8px] font-medium text-slate-500">
              {seat.passenger_gender === "Female" ? "F" : "M"}
            </span>
          )}
          {!isSelected && !isLockedByOther && !isBooked && (
            <span className="text-[8px] text-slate-400 group-hover:text-brand-600 font-semibold">
              ৳{formatDigits(seat.fare)}
            </span>
          )}
        </div>

        {isLockedByOther && (
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap z-30">
            Locked by {seat.locked_by_counter_name}
          </span>
        )}
      </button>
    );
  }
};
