"use client";

import React from "react";
import { formatCurrencyBDT } from "@/lib/utils";
import { TrendingUp, Users, Building2, Ticket, DollarSign, ArrowUpRight } from "lucide-react";

export const MRRChart: React.FC = () => {
  const stats = [
    {
      title: "Monthly Recurring Revenue (MRR)",
      value: "৳ 428,500",
      change: "+18.4% vs last month",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200",
    },
    {
      title: "Active Operator Companies",
      value: "18 Operators",
      change: "+3 new this week",
      icon: Building2,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200",
    },
    {
      title: "Platform Tickets Sold (MTD)",
      value: "142,890 Tickets",
      change: "+24.1% traffic surge",
      icon: Ticket,
      color: "text-brand-600 bg-brand-50 dark:bg-brand-950/60 dark:text-brand-400 border-brand-200",
    },
    {
      title: "Active Counter Cashiers Online",
      value: "94 Terminals",
      change: "Sub-second sync active",
      icon: Users,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200",
    },
  ];

  // Simulated 6-month MRR growth bars
  const months = [
    { label: "Jun", mrr: 180000, height: "45%" },
    { label: "Jul", mrr: 220000, height: "55%" },
    { label: "Aug", mrr: 290000, height: "68%" },
    { label: "Sep", mrr: 330000, height: "76%" },
    { label: "Oct", mrr: 385000, height: "88%" },
    { label: "Nov (Proj)", mrr: 428500, height: "100%" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {stat.title}
                </span>
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual MRR Growth Bar Visualizer */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              SaaS Subscription MRR & Platform Commission Trajectory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Net platform recurring revenue in BDT across Starter, Professional & Enterprise tenants.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-brand-600" />
              <span className="text-slate-600 dark:text-slate-400">Subscription Fee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-400" />
              <span className="text-slate-600 dark:text-slate-400">3.5% Booking Take Rate</span>
            </div>
          </div>
        </div>

        {/* Bars Container */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-slate-800 pb-2">
          {months.map((m, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="text-[10px] font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
                ৳{(m.mrr / 1000).toFixed(0)}k
              </div>
              <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full flex flex-col justify-end overflow-hidden p-1">
                <div
                  style={{ height: m.height }}
                  className="w-full rounded bg-gradient-to-t from-brand-700 to-emerald-400 group-hover:brightness-110 transition-all shadow-xs"
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
