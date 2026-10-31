"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { operatorOnboardingSchema, OperatorOnboardingFormValues } from "@/lib/validations/booking";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { X, Building2, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: "starter" | "professional" | "enterprise";
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  defaultTier = "professional",
}) => {
  const router = useRouter();
  const { setRole } = useAuthStore();

  const [companyName, setCompanyName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tradeLicense, setTradeLicense] = useState("");
  const [address, setAddress] = useState("");
  const [fleetSize, setFleetSize] = useState(8);
  const [tier, setTier] = useState<"starter" | "professional" | "enterprise">(defaultTier);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Auto-generate slug from company name
  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCompanyName(name);
    const cleanSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(cleanSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const values = {
      company_name: companyName,
      slug,
      contact_email: email,
      contact_phone: phone,
      trade_license: tradeLicense,
      address,
      subscription_tier: tier,
      total_fleet_size: Number(fleetSize),
    };

    const validation = operatorOnboardingSchema.safeParse(values);
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message || "Please fill all required fields correctly.");
      return;
    }

    // Success simulation: register tenant and switch role to operator admin
    setIsSuccess(true);
  };

  const handleLaunchOperatorPortal = () => {
    setRole("operator_admin");
    onClose();
    router.push("/operator");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-[11px] font-bold border border-brand-200 mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Multi-Tenant Operator Registration</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Join the Sohoj Jatra Cloud Network
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Register your bus company to unlock cloud counter synchronization and online ticketing.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Company Name & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bus Operator Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hanif Classic"
                  value={companyName}
                  onChange={handleCompanyNameChange}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Platform Slug *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="hanif-classic"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                  sohojjatra.com/{slug || "slug"}
                </span>
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  placeholder="operations@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hotline / Mobile (BD) *
                </label>
                <input
                  type="tel"
                  placeholder="01711000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            {/* Trade License and Fleet Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Trade License / BRTA Cert *
                </label>
                <input
                  type="text"
                  placeholder="TRAD/DNCC/129384"
                  value={tradeLicense}
                  onChange={(e) => setTradeLicense(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Active Bus Fleet Size *
                </label>
                <input
                  type="number"
                  min="1"
                  value={fleetSize}
                  onChange={(e) => setFleetSize(parseInt(e.target.value) || 1)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Central Head Office Address *
              </label>
              <input
                type="text"
                placeholder="e.g. Sayedabad Bus Terminal, Dhaka"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            {/* Tier Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subscription Plan Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["starter", "professional", "enterprise"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                      tier === t
                        ? "border-brand-600 bg-brand-50 text-brand-900 dark:bg-brand-950 dark:text-brand-300 ring-2 ring-brand-500/30"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Register Tenant & Activate Cloud Sandbox</span>
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Operator Tenant Provisioned!
              </h3>
              <p className="text-xs text-slate-500">
                Welcome, <span className="font-bold text-slate-800 dark:text-slate-200">{companyName}</span>. Your isolated PostgreSQL database schema and RLS policies are now initialized.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Tenant Slug:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">sohojjatra.com/{slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Subscription:</span>
                <span className="font-bold uppercase text-slate-800 dark:text-slate-200">{tier} (Trial Active)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security:</span>
                <span className="text-emerald-600 font-bold">RLS Isolation Verified</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLaunchOperatorPortal}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Access Bus Operator Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
