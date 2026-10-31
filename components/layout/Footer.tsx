import React from "react";
import Link from "next/link";
import { Bus, Shield, Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Bus className="w-5 h-5" />
            </div>
            <span className="text-base font-black text-white">Sohoj Jatra</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The next-generation cloud operating system for Bangladesh&apos;s inter-district bus operators, physical counter networks, and smart ticketing terminals.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-brand-400 border border-slate-800">
              PostgreSQL 15 + RLS
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-brand-400 border border-slate-800">
              Supabase Realtime
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            SaaS Platform Modules
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/pos" className="hover:text-white transition-colors">
                Counter POS Terminal (Live Lock)
              </Link>
            </li>
            <li>
              <Link href="/operator" className="hover:text-white transition-colors">
                Bus Operator Fleet & Route Portal
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white transition-colors">
                Super Admin Multi-Tenant Governance
              </Link>
            </li>
            <li>
              <Link href="/passenger" className="hover:text-white transition-colors">
                Passenger Digital Boarding Pass
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment Integrations */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Payment & Notifications
          </h4>
          <div className="space-y-2 text-xs">
            <p className="text-slate-400">
              Integrated with Bangladesh Payment Gateways:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-bold px-2 py-1 bg-pink-950/80 text-pink-300 rounded border border-pink-800">
                bKash Tokenized
              </span>
              <span className="text-[10px] font-bold px-2 py-1 bg-orange-950/80 text-orange-300 rounded border border-orange-800">
                Nagad Direct
              </span>
              <span className="text-[10px] font-bold px-2 py-1 bg-blue-950/80 text-blue-300 rounded border border-blue-800">
                SSLCommerz
              </span>
              <span className="text-[10px] font-bold px-2 py-1 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-800">
                Twilio SMS
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Dhaka SaaS Headquarters
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span>Level 12, Gulshan South Tower, Gulshan-1, Dhaka</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-500" />
              <span>+880 9612-SOHOJ (76465)</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-500" />
              <span>support@sohojjatra.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} Sohoj Jatra SaaS Technologies Ltd. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-500">
          <span>GDPR & ISO 27001 Certified Architecture</span>
          <span>•</span>
          <span>Row Level Security Enforced</span>
        </div>
      </div>
    </footer>
  );
};
