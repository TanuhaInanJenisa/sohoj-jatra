"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { usePOSStore } from "@/lib/store/usePOSStore";
import { useLanguageStore } from "@/lib/store/useLanguageStore";
import { Bus, ShieldCheck, Building2, MonitorSmartphone, Search, UserCheck, Languages, Wifi, WifiOff } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, setRole } = useAuthStore();
  const { isOfflineMode, toggleOfflineMode } = usePOSStore();
  const { language, toggleLanguage, t } = useLanguageStore();

  const navLinks = [
    { href: "/", label: t("navHome"), icon: Bus },
    { href: "/pos", label: t("navPOS"), icon: MonitorSmartphone, badge: "Live Sync" },
    { href: "/operator", label: t("navOperator"), icon: Building2 },
    { href: "/admin", label: t("navAdmin"), icon: ShieldCheck },
    { href: "/passenger", label: t("navPassenger"), icon: Search },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                {language === "bn" ? "সহজ যাত্রা" : "Sohoj Jatra"}
                <span className="text-brand-600 dark:text-brand-400 font-bold text-xs bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                  {language === "bn" ? "ক্লাউড পিওএস" : "Cloud POS"}
                </span>
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight font-medium">
                {t("tagline")}
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800 shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher, Offline PWA Toggle & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Bilingual Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              title="বাংলা ও ইংরেজির মধ্যে পরিবর্তন করুন"
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-extrabold flex items-center gap-1.5 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
            >
              <Languages className="w-3.5 h-3.5 text-brand-600" />
              <span>{language === "bn" ? "ENG" : "বাংলা"}</span>
            </button>

            {/* Offline Resilience Toggle Simulator */}
            <button
              type="button"
              onClick={toggleOfflineMode}
              title={isOfflineMode ? "Click to switch to Online Cloud Sync" : "Click to simulate Offline Counter Cache mode"}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors ${
                isOfflineMode
                  ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === "bn" ? "অফলাইন ক্যাশ" : "Offline"}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>{language === "bn" ? "অনলাইন সিঙ্ক" : "Online"}</span>
                </>
              )}
            </button>

            {/* Role Switcher */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 px-2 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-brand-600" />
                {t("roleLabel")}:
              </span>
              <select
                value={currentRole}
                onChange={(e) => setRole(e.target.value as any)}
                className="text-xs font-bold bg-white dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-slate-800 dark:text-slate-100 shadow-xs cursor-pointer focus:outline-none"
              >
                <option value="counter_staff">Counter Cashier (POS)</option>
                <option value="operator_admin">Operator Admin (Fleet)</option>
                <option value="super_admin">Super Admin (SaaS)</option>
                <option value="passenger">Passenger</option>
              </select>
            </div>

            {/* Quick POS Terminal Button */}
            <Link
              href="/pos"
              className="py-2 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              <MonitorSmartphone className="w-4 h-4" />
              <span className="hidden sm:inline">{t("navPOS")}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
