"use client";

import React, { useEffect, useState } from "react";
import { usePOSStore } from "@/lib/store/usePOSStore";
import { useLanguageStore } from "@/lib/store/useLanguageStore";
import { MessageSquare, X, CheckCircle, BellRing, Smartphone, ShieldCheck } from "lucide-react";
import { formatCurrencyBDT, formatTimeBD } from "@/lib/utils";

export const SMSNotificationSimulator: React.FC = () => {
  const { lastConfirmedBooking, isThermalModalOpen } = usePOSStore();
  const { language, formatDigits } = useLanguageStore();
  const [isVisible, setIsVisible] = useState(false);
  const [smsText, setSmsText] = useState("");

  useEffect(() => {
    if (lastConfirmedBooking && isThermalModalOpen) {
      const b = lastConfirmedBooking;
      const seats = b.seat_numbers.join(", ");
      const timeStr = b.departure_time ? formatTimeBD(b.departure_time) : "04:30 PM";

      let msg = "";
      if (language === "bn") {
        msg = `[${b.operator_name || "সহজ যাত্রা"}] প্রিয় ${b.passenger_name}, আপনার যাত্রা নিশ্চিত হয়েছে! PNR: ${b.pnr_number} | আসন: ${formatDigits(seats)} | বাসের ধরন: ${b.bus_type} | বোর্ডিং: ${b.boarding_counter_name} (${timeStr}) | মোট পরিশোধ: ${formatDigits(formatCurrencyBDT(b.net_fare))} (${b.payment_method.toUpperCase()})। কাউন্টারে এই SMS দেখিয়ে আসন গ্রহণ করুন।`;
      } else {
        msg = `[${b.operator_name || "Sohoj Jatra"}] Dear ${b.passenger_name}, your journey is CONFIRMED! PNR: ${b.pnr_number} | Seats: ${seats} | Coach: ${b.coach_number} | Boarding: ${b.boarding_counter_name} at ${timeStr} | Paid: ${formatCurrencyBDT(b.net_fare)} (${b.payment_method.toUpperCase()}). Please present this SMS at boarding counter.`;
      }

      setSmsText(msg);
      setIsVisible(true);

      // Auto dismiss after 15 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [lastConfirmedBooking, isThermalModalOpen, language, formatDigits]);

  if (!isVisible || !lastConfirmedBooking) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 ring-1 ring-white/10 space-y-2.5">
        
        {/* SMS Header */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-extrabold text-[11px] text-emerald-400 block leading-tight">
                MESSAGES • {lastConfirmedBooking.operator_name || "SOHOJ_JATRA"}
              </span>
              <span className="text-[10px] text-slate-400">
                To: +88{lastConfirmedBooking.passenger_phone} • Just now
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SMS Body */}
        <div className="p-3 bg-slate-800/80 rounded-xl text-xs leading-relaxed text-slate-200 font-sans border border-slate-700/50">
          <p>{smsText}</p>
        </div>

        {/* SMS Footer Tag */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <CheckCircle className="w-3 h-3" />
            SMS Gateway Dispatched
          </span>
          <span className="font-mono text-slate-500">
            Carrier: BD BulkSMS
          </span>
        </div>

      </div>
    </div>
  );
};
