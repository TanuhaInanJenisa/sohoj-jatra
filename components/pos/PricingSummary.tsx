"use client";

import React, { useEffect } from "react";
import { usePOSStore } from "@/lib/store/usePOSStore";
import { useLanguageStore } from "@/lib/store/useLanguageStore";
import { formatCurrencyBDT } from "@/lib/utils";
import { Clock, Printer, RotateCcw, CloudOff, Cloud } from "lucide-react";

export const PricingSummary: React.FC = () => {
  const {
    selectedSeatNumbers,
    currentTrip,
    serviceFee,
    discountAmount,
    promoCode,
    droppingFareOffset,
    lockSecondsRemaining,
    timerActive,
    isOfflineMode,
    offlineQueuedBookings,
    tickTimer,
    clearSelection,
    confirmBooking,
  } = usePOSStore();

  const { t, formatDigits, language } = useLanguageStore();

  // Run timer countdown every second when active
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, tickTimer]);

  // Global Keyboard shortcuts: F2 (Clear), F4 (Focus Name), F8 (Confirm), Esc (Clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F8") {
        e.preventDefault();
        confirmBooking();
      } else if (e.key === "Escape" || e.key === "F2") {
        e.preventDefault();
        clearSelection();
      } else if (e.key === "F4") {
        e.preventDefault();
        const input = document.getElementById("passenger-name-input");
        if (input) input.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmBooking, clearSelection]);

  const seatCount = selectedSeatNumbers.length;
  const effectivePerSeatFare = Math.max(200, currentTrip.base_fare + droppingFareOffset);
  const subtotal = seatCount * effectivePerSeatFare;
  const totalDue = Math.max(0, subtotal - discountAmount + (seatCount > 0 ? serviceFee : 0));

  const minutes = Math.floor(lockSecondsRemaining / 60);
  const seconds = lockSecondsRemaining % 60;
  const formattedTime = `${formatDigits(minutes)}:${seconds < 10 ? "0" : ""}${formatDigits(seconds)}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
      {/* Realtime Lock Expiry Warning Bar */}
      {timerActive && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 animate-pulse">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold">
              {t("liveLockHold")}: {formatDigits(selectedSeatNumbers.join(", "))}
            </span>
          </div>
          <div className="font-mono font-black text-sm bg-amber-200/60 dark:bg-amber-900 px-2 py-0.5 rounded">
            {formattedTime}
          </div>
        </div>
      )}

      {/* Offline PWA warning badge if offline */}
      {isOfflineMode && (
        <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{t("terminalOffline")} (LocalStorage Active)</span>
          </div>
          <span className="text-[10px] font-mono">
            {offlineQueuedBookings.length} queued
          </span>
        </div>
      )}

      {/* Selected Seats Overview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{t("selectedSeats")} ({formatDigits(seatCount)}/৪ সর্বোচ্চ):</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {seatCount > 0 ? formatDigits(selectedSeatNumbers.join(", ")) : (language === "bn" ? "কোনটি নয়" : "None")}
          </span>
        </div>

        {/* Fare line items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="flex items-center justify-between py-2 text-slate-600 dark:text-slate-400">
            <span>{t("baseFare")} ({formatDigits(seatCount)} × ৳{formatDigits(effectivePerSeatFare)}):</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatDigits(formatCurrencyBDT(subtotal))}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 text-slate-600 dark:text-slate-400">
            <span>{t("serviceFee")}:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {seatCount > 0 ? formatDigits(formatCurrencyBDT(serviceFee)) : "৳০"}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between py-2 text-brand-600 dark:text-brand-400 font-medium">
              <span>{t("discount")} ({promoCode}):</span>
              <span>- {formatDigits(formatCurrencyBDT(discountAmount))}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 pb-1">
            <span className="text-sm font-bold text-slate-900 dark:text-white">{t("totalPayable")}:</span>
            <span className="text-xl font-extrabold text-brand-700 dark:text-brand-400">
              {formatDigits(formatCurrencyBDT(totalDue))}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          disabled={seatCount === 0}
          onClick={confirmBooking}
          className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
        >
          <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>{t("confirmPrint")}</span>
        </button>

        <button
          type="button"
          onClick={clearSelection}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>{t("clearSelection")}</span>
        </button>
      </div>

      {/* Keyboard Shortcut Hints Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>{language === "bn" ? "কীবোর্ড শর্টকাট:" : "Quick keys:"}</span>
        <div className="flex items-center gap-2 font-mono">
          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">F4 নাম</span>
          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">F8 বুকিং</span>
          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Esc বাতিল</span>
        </div>
      </div>
    </div>
  );
};
