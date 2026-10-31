"use client";

import React, { useState } from "react";
import { Booking } from "@/types";
import { MOCK_BOOKINGS } from "@/lib/supabase/mock-data";
import { formatCurrencyBDT, formatDateBD, formatTimeBD } from "@/lib/utils";
import { generateTicketPDF } from "@/lib/pdf/ticket-generator";
import { Search, QrCode, Bus, Clock, MapPin, Download, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";

export const DigitalTicketView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("SJ-GL-89210");
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(MOCK_BOOKINGS[0]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    const found = MOCK_BOOKINGS.find(
      (b) => b.pnr_number.toUpperCase() === clean || b.passenger_phone.includes(searchQuery.trim())
    );
    if (found) {
      setCurrentBooking(found);
      setCancelSuccess(false);
    } else {
      alert("No booking found with this PNR or Phone number. Try 'SJ-GL-89210' or '01712345678'");
    }
  };

  const handleConfirmCancel = () => {
    if (!currentBooking) return;
    setCurrentBooking({
      ...currentBooking,
      ticket_status: "cancelled",
      payment_status: "refunded",
    });
    setCancelSuccess(true);
    setCancelModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <Search className="w-5 h-5 text-brand-600" />
          Passenger Digital Boarding Pass & PNR Verification
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Enter your 10-character PNR booking reference or registered Bangladeshi mobile number.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. SJ-GL-89210 or 01712345678"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-xs px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono uppercase font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="py-3 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Verify Ticket</span>
          </button>
        </form>
      </div>

      {/* Ticket Details Card */}
      {currentBooking && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-brand-400 block mb-1">
                Official Digital Boarding Pass
              </span>
              <h3 className="text-xl font-black">
                {currentBooking.operator_name || "Green Line Paribahan"}
              </h3>
              <p className="text-xs text-slate-400">
                Coach: {currentBooking.coach_number} ({currentBooking.bus_type})
              </p>
            </div>

            {/* PNR & Status */}
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Booking PNR</span>
              <span className="text-xl font-black font-mono text-emerald-400">
                {currentBooking.pnr_number}
              </span>
              <div className="mt-1">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  currentBooking.ticket_status === "confirmed"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                }`}>
                  {currentBooking.ticket_status}
                </span>
              </div>
            </div>
          </div>

          {/* Journey Status Tracker */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-3">
              <span>Trip Status Tracker:</span>
              <span className="text-brand-600 font-bold">Scheduled Departure Today</span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-300 dark:border-brand-800 text-brand-800 dark:text-brand-300 font-bold">
                1. Confirmed
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                2. Boarding Counter
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                3. In Highway Transit
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Origin & Destination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase text-slate-400">Departure Station</span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {currentBooking.origin_city || "Dhaka"}
                </h4>
                <p className="text-xs text-slate-500">{currentBooking.boarding_counter_name}</p>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-mono font-bold text-brand-600">
                  {currentBooking.departure_time ? formatTimeBD(currentBooking.departure_time) : "04:30 PM"}
                </span>
                <div className="w-24 h-0.5 bg-slate-300 dark:bg-slate-600 my-1 relative">
                  <div className="w-2 h-2 rounded-full bg-brand-600 absolute left-1/2 -top-0.75 -translate-x-1/2" />
                </div>
                <span className="text-[10px] text-slate-400">Non-Stop Express</span>
              </div>

              <div className="space-y-1 text-center sm:text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400">Arrival Destination</span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {currentBooking.destination_city || "Cox's Bazar"}
                </h4>
                <p className="text-xs text-slate-500">{currentBooking.dropping_point || "Kolatoli Beach Point"}</p>
              </div>
            </div>

            {/* Passenger & QR Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Passenger Name:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentBooking.passenger_name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Contact Mobile:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentBooking.passenger_phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Reserved Seats:</span>
                  <span className="font-black text-brand-600 dark:text-brand-400 text-sm">
                    {currentBooking.seat_numbers.join(", ")} ({currentBooking.total_seats} Seats)
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Total Net Fare Paid:</span>
                  <span className="font-black text-slate-900 dark:text-white text-sm">
                    {formatCurrencyBDT(currentBooking.net_fare)} ({currentBooking.payment_method.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-28 h-28 bg-white p-2 rounded-xl shadow-xs border flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-900" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-2">
                  Scan at Counter Scanner
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => generateTicketPDF(currentBooking)}
                className="py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-brand-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF E-Ticket</span>
              </button>

              {currentBooking.ticket_status === "confirmed" && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Ticket Cancellation / Refund</span>
                </button>
              )}
            </div>

            {cancelSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ticket has been cancelled. Refund of {formatCurrencyBDT(currentBooking.net_fare)} initiated to original {currentBooking.payment_method.toUpperCase()} account.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Confirm Ticket Cancellation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to cancel PNR <span className="font-mono font-bold text-slate-900 dark:text-white">{currentBooking?.pnr_number}</span>? Seats {currentBooking?.seat_numbers.join(", ")} will immediately be released back to the live counter pool.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Keep Ticket
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Confirm Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
