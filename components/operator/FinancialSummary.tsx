"use client";

import React from "react";
import { formatCurrencyBDT } from "@/lib/utils";
import { BarChart3, Download, FileSpreadsheet, Wallet, Banknote, CreditCard, Landmark } from "lucide-react";

export const FinancialSummary: React.FC = () => {
  const counterCollections = [
    { name: "Rajarbagh Central Terminal", city: "Dhaka", tickets: 84, total: 134400, cash: 72000, digital: 62400 },
    { name: "Sayedabad Counter #04", city: "Dhaka", tickets: 62, total: 99200, cash: 54000, digital: 45200 },
    { name: "Dampara Main Counter", city: "Chittagong", tickets: 48, total: 52800, cash: 31000, digital: 21800 },
    { name: "Kolatoli Beach Counter", city: "Cox's Bazar", tickets: 35, total: 56000, cash: 24000, digital: 32000 },
  ];

  const totalRevenue = counterCollections.reduce((acc, c) => acc + c.total, 0);
  const totalTickets = counterCollections.reduce((acc, c) => acc + c.tickets, 0);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Counter Name,City,Tickets Sold,Total Revenue (BDT),Cash Collection,Digital Payment (bKash/Nagad)\n" +
      counterCollections
        .map((c) => `"${c.name}","${c.city}",${c.tickets},${c.total},${c.cash},${c.digital}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Daily_Collection_Statement_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            Daily Counter Financial Summaries & Revenue Splits
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit physical cash receipts, bKash/Nagad transactions, and platform commission deductions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV Statement</span>
          </button>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Daily Gross Bookings</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
            {formatCurrencyBDT(totalRevenue)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{totalTickets} tickets confirmed today</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 block">Physical Cash In Counter</span>
          <span className="text-xl font-black text-emerald-800 dark:text-emerald-200 mt-1 block">
            {formatCurrencyBDT(181000)}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">Ready for bank deposit</span>
        </div>

        <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800">
          <span className="text-[11px] font-semibold text-pink-700 dark:text-pink-300 block">MFS Digital Settlements (bKash/Nagad)</span>
          <span className="text-xl font-black text-pink-800 dark:text-pink-200 mt-1 block">
            {formatCurrencyBDT(161400)}
          </span>
          <span className="text-[10px] text-pink-600 dark:text-pink-400 mt-0.5 block">Direct bank settlement (T+1)</span>
        </div>
      </div>

      {/* Counter-by-counter Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">Physical Counter</th>
              <th className="py-3 px-3">Tickets Issued</th>
              <th className="py-3 px-3">Cash Handover</th>
              <th className="py-3 px-3">Digital Payments</th>
              <th className="py-3 px-3 text-right">Net Collection (BDT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {counterCollections.map((c, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                  <div className="text-[10px] text-slate-400">{c.city}</div>
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                  {c.tickets} Tickets
                </td>
                <td className="py-3.5 px-3 font-semibold text-emerald-600">
                  {formatCurrencyBDT(c.cash)}
                </td>
                <td className="py-3.5 px-3 font-semibold text-pink-600">
                  {formatCurrencyBDT(c.digital)}
                </td>
                <td className="py-3.5 px-3 font-black text-right text-slate-900 dark:text-white">
                  {formatCurrencyBDT(c.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
