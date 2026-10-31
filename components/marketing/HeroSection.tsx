"use client";

import React from "react";
import Link from "next/link";
import { Bus, ShieldCheck, Zap, Printer, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  onOpenOnboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenOnboard }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-900 via-slate-950 to-navy-950 text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Next-Gen Bus Counter Cloud Operating System</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            The Enterprise SaaS for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-brand-300 to-teal-200">
              Bus Counter & Ticket
            </span>{" "}
            Management
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Empower your bus fleet with ultra-fast counter POS terminals, Supabase Realtime seat collision locking, multi-tenant financial reporting, and instant thermal receipt printing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={onOpenOnboard}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Onboard Your Bus Company</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="/pos"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 font-bold text-sm backdrop-blur-xs transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-brand-400" />
              <span>Launch Live Counter POS</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-brand-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>Realtime Lock</span>
              </div>
              <p className="text-xs text-slate-400">Pessimistic concurrency prevents double booking</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-brand-400 font-bold text-sm">
                <Printer className="w-4 h-4" />
                <span>Thermal 80mm</span>
              </div>
              <p className="text-xs text-slate-400">Instant printer layout & PDF generation</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-brand-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Strict Tenant RLS</span>
              </div>
              <p className="text-xs text-slate-400">PostgreSQL row-level security isolation</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-brand-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>MFS Integrated</span>
              </div>
              <p className="text-xs text-slate-400">bKash, Nagad & SSLCommerz ready</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
