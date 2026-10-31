"use client";

import React, { useState } from "react";
import { Operator } from "@/types";
import { MOCK_OPERATORS } from "@/lib/supabase/mock-data";
import { Building2, Shield, CheckCircle, Ban, Sliders, ExternalLink, Mail, Phone } from "lucide-react";

export const TenantTable: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>(MOCK_OPERATORS);
  const [editingOperatorId, setEditingOperatorId] = useState<string | null>(null);

  const toggleApproval = (id: string) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, is_approved: !op.is_approved } : op))
    );
  };

  const updateCommission = (id: string, newRate: number) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, commission_rate: newRate } : op))
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            Registered Bus Operator Tenants & RLS Subscriptions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage multi-tenant company statuses, tier upgrades, and platform take-rate commissions.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">Operator Name</th>
              <th className="py-3 px-3">Trade License / Contact</th>
              <th className="py-3 px-3">Subscription Tier</th>
              <th className="py-3 px-3">Commission %</th>
              <th className="py-3 px-3">Tenant Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {operators.map((op) => (
              <tr key={op.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                
                {/* Operator Name & Slug */}
                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {op.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    slug: /{op.slug}
                  </div>
                </td>

                {/* Trade license and contact */}
                <td className="py-3.5 px-3 space-y-0.5">
                  <div className="font-mono text-[10px] text-slate-600 dark:text-slate-300">
                    {op.trade_license}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5" />
                    <span>{op.contact_phone}</span>
                  </div>
                </td>

                {/* Plan Tier */}
                <td className="py-3.5 px-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    op.subscription_tier === "enterprise"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200"
                      : op.subscription_tier === "professional"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200"
                      : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  }`}>
                    {op.subscription_tier}
                  </span>
                </td>

                {/* Platform Commission Rate */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <span>{op.commission_rate.toFixed(1)}%</span>
                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.5"
                      value={op.commission_rate}
                      onChange={(e) => updateCommission(op.id, parseFloat(e.target.value))}
                      className="w-16 accent-brand-600 cursor-pointer"
                      title="Adjust platform fee %"
                    />
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-3">
                  {op.is_approved ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold border border-amber-200">
                      <Ban className="w-3 h-3" />
                      Suspended
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleApproval(op.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      op.is_approved
                        ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                    }`}
                  >
                    {op.is_approved ? "Suspend" : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
