"use client";

import React, { useState } from "react";
import { Check, Zap, Sparkles } from "lucide-react";

interface PricingTiersProps {
  onSelectTier: (tier: "starter" | "professional" | "enterprise") => void;
}

export const PricingTiers: React.FC<PricingTiersProps> = ({ onSelectTier }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers = [
    {
      id: "starter" as const,
      name: "Starter Fleet",
      badge: "Emerging Operators",
      monthlyPrice: 4999,
      description: "Ideal for regional bus lines operating 1 to 5 buses across local counter terminals.",
      features: [
        "Up to 5 Registered Buses",
        "3 Physical Counter Terminals",
        "Supabase Realtime Seat Locking",
        "Thermal 80mm POS Printing",
        "Standard Email & Phone Support",
        "SSLCommerz & Cash Integration",
      ],
      popular: false,
    },
    {
      id: "professional" as const,
      name: "Professional Fleet",
      badge: "Most Popular",
      monthlyPrice: 12999,
      description: "Designed for expanding inter-district operators requiring multi-counter synchronization.",
      features: [
        "Up to 25 Registered Buses",
        "15 Physical Counter Terminals",
        "Multi-Cashier Restricted Access",
        "Automated Twilio/BD SMS Alerts",
        "bKash & Nagad Tokenized Gateway",
        "Daily Financial Collection Reports",
        "24/7 Priority Hotline Support",
      ],
      popular: true,
    },
    {
      id: "enterprise" as const,
      name: "Enterprise Multi-Axle",
      badge: "High Concurrency",
      monthlyPrice: 29999,
      description: "For premier transport enterprises with nationwide routes and heavy peak-holiday traffic.",
      features: [
        "Unlimited Bus Fleet & Sleeper Decks",
        "Unlimited Physical Counters Nationwide",
        "Dedicated Sub-second Realtime Cluster",
        "Dynamic Promo & Surge Pricing Engine",
        "Custom Domain & White-label Branding",
        "Automated Accounting & Tax Exports",
        "Dedicated Account Architect & SLA",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-xs font-bold border border-brand-200">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Bus Operator SaaS Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Flexible Subscription Tiers for Every Fleet Size
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Scale your ticketing operations with zero server maintenance. Choose a plan tailored to your active routes.
          </p>

          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-bold ${!isAnnual ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 bg-brand-600 rounded-full p-1 transition-colors relative"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${isAnnual ? "text-slate-900 dark:text-white" : "text-slate-500"} flex items-center gap-1`}>
              Annual Billing
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => {
            const price = isAnnual
              ? Math.round(tier.monthlyPrice * 0.8)
              : tier.monthlyPrice;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                  tier.popular
                    ? "bg-white dark:bg-slate-900 border-2 border-brand-500 shadow-xl shadow-brand-500/10 scale-105 z-10"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-600 text-white font-extrabold text-[11px] tracking-wide shadow-xs uppercase">
                    {tier.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {tier.name}
                    </h3>
                    {!tier.popular && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="pt-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">
                        ৳{price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">/ month</span>
                    </div>
                    {isAnnual && (
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                        Billed annually (৳{(price * 12).toLocaleString()}/year)
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 pt-2 text-xs">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center shrink-0 mt-0.5 text-brand-600">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    onClick={() => onSelectTier(tier.id)}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      tier.popular
                        ? "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Select {tier.name}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
