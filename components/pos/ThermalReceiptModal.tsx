"use client";

import React from "react";
import { usePOSStore } from "@/lib/store/usePOSStore";
import { formatCurrencyBDT, formatDateBD, formatTimeBD } from "@/lib/utils";
import { generateTicketPDF } from "@/lib/pdf/ticket-generator";
import { Printer, Download, CheckCircle, X, Sparkles } from "lucide-react";

export const ThermalReceiptModal: React.FC = () => {
  const { isThermalModalOpen, lastConfirmedBooking, closeThermalModal } = usePOSStore();

  if (!isThermalModalOpen || !lastConfirmedBooking) return null;

  const b = lastConfirmedBooking;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    await generateTicketPDF(b);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Top Success Bar */}
        <div className="bg-brand-600 px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-brand-200" />
            <span className="font-bold text-sm">Ticket Confirmed!</span>
          </div>
          <button
            type="button"
            onClick={closeThermalModal}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Thermal Slip
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>

        {/* Authentic 80mm Thermal Paper Section */}
        <div className="p-6 font-mono text-slate-800 dark:text-slate-200 text-xs leading-relaxed space-y-4 print:p-0 print:m-0">
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-400">
            <h2 className="text-base font-black tracking-tight uppercase">
              {b.operator_name || "Green Line Paribahan"}
            </h2>
            <p className="text-[10px] text-slate-500">
              Sohoj Jatra Cloud SaaS Platform
            </p>
            <p className="text-[10px] font-bold text-slate-600">
              Counter: {b.counter_name || "Rajarbagh Terminal"}
            </p>
          </div>

          {/* PNR & Barcode Simulation */}
          <div className="text-center py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block uppercase">
              PNR / Booking Number
            </span>
            <span className="text-base font-black tracking-widest text-brand-700 dark:text-brand-400">
              {b.pnr_number}
            </span>
            <div className="mt-1 font-mono tracking-widest text-slate-400 text-[10px] select-none">
              ||| | |||| | ||||| |||| | ||
            </div>
          </div>

          {/* Journey Specs */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Route:</span>
              <span className="font-bold">{b.origin_city} ➔ {b.destination_city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Coach No:</span>
              <span className="font-bold">{b.coach_number} ({b.bus_type})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Departure:</span>
              <span className="font-bold">
                {b.departure_time ? `${formatDateBD(b.departure_time)} @ ${formatTimeBD(b.departure_time)}` : "Today 04:30 PM"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Boarding:</span>
              <span className="font-bold">{b.boarding_counter_name}</span>
            </div>
          </div>

          {/* Passenger & Seats */}
          <div className="py-2 border-y border-dashed border-slate-400 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Passenger:</span>
              <span className="font-bold">{b.passenger_name} ({b.passenger_gender?.charAt(0)})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mobile:</span>
              <span className="font-bold">{b.passenger_phone}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Reserved Seats:</span>
              <span className="font-black text-sm bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                {b.seat_numbers.join(", ")} ({b.total_seats} Seats)
              </span>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Fare:</span>
              <span>{formatCurrencyBDT(b.total_fare)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service Fee:</span>
              <span>{formatCurrencyBDT(b.service_charge)}</span>
            </div>
            {b.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span>- {formatCurrencyBDT(b.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-300 dark:border-slate-700">
              <span>TOTAL PAID:</span>
              <span>{formatCurrencyBDT(b.net_fare)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Payment Mode:</span>
              <span className="uppercase font-bold">{b.payment_method}</span>
            </div>
          </div>

          {/* Signatures & Footer */}
          <div className="pt-4 border-t border-dashed border-slate-400 text-center space-y-3">
            <div className="flex justify-between items-end pt-4 px-2 text-[10px] text-slate-400">
              <div className="border-t border-slate-400 w-20 text-center pt-1">
                Cashier Seal
              </div>
              <div className="border-t border-slate-400 w-24 text-center pt-1">
                Passenger Sign
              </div>
            </div>
            <p className="text-[9px] text-slate-400">
              * Non-refundable after departure time *
              <br />
              Thank you for traveling with {b.operator_name || "us"}!
            </p>
          </div>
        </div>

        {/* Bottom Next Passenger Button */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-center print:hidden">
          <button
            type="button"
            onClick={closeThermalModal}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors"
          >
            Ready for Next Passenger
          </button>
        </div>
      </div>
    </div>
  );
};
