"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/marketing/HeroSection";
import { TripSearchBox } from "@/components/marketing/TripSearchBox";
import { PricingTiers } from "@/components/marketing/PricingTiers";
import { OnboardingModal } from "@/components/marketing/OnboardingModal";
import { ShieldCheck, Zap, Printer, Users, Database, Smartphone, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"starter" | "professional" | "enterprise">("professional");

  const handleOpenOnboardWithTier = (tier: "starter" | "professional" | "enterprise") => {
    setSelectedTier(tier);
    setIsOnboardingOpen(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Marketing Banner */}
      <HeroSection onOpenOnboard={() => setIsOnboardingOpen(true)} />

      {/* 2. Public Passenger Search Engine & Trip Listing */}
      <TripSearchBox />

      {/* 3. Deep Architectural Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 dark:bg-brand-950 px-3 py-1 rounded-full border border-brand-200">
            Engineered for High-Concurrency Transit
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Built for Bangladesh&apos;s Peak Holiday Booking Traffic
          </h2>
          <p className="text-sm text-slate-500">
            Say goodbye to double-booked seats during Eid and Puja rush. Sohoj Jatra combines PostgreSQL pessimistic locking with Supabase Realtime channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Pessimistic Realtime Seat Locks
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When Mohakhali Counter clicks Seat B1, Sayedabad and Gabtoli terminals immediately see an amber pulsating lock with a 5-minute countdown. Double booking is mathematically prevented.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Strict Multi-Tenant RLS Security
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Each bus company operates in an isolated tenant schema guarded by PostgreSQL Row Level Security policies. Financial data, bookings, and customer databases remain 100% confidential.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              80mm Thermal & PDF Ticketing
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant 1-second printing on all standard POS ESC/POS thermal printers, plus automatic high-resolution PDF e-ticket generation and SMS dispatch with scannable QR codes.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Dynamic Pricing Tiers */}
      <PricingTiers onSelectTier={handleOpenOnboardWithTier} />

      {/* 5. Operator CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-800/40 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black">
              Ready to modernize your bus counter network?
            </h3>
            <p className="text-xs text-slate-300 max-w-lg">
              Test our live terminal simulator with full keyboard shortcuts (F2, F4, F8) and simulated concurrent counter locks right in your browser.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/pos"
              className="py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Test Counter POS Live</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Operator Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        defaultTier={selectedTier}
      />
    </div>
  );
}
