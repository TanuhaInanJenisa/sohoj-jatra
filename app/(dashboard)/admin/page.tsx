"use client";

import React, { useState } from "react";
import { MRRChart } from "@/components/admin/MRRChart";
import { TenantTable } from "@/components/admin/TenantTable";
import { MOCK_AUDIT_LOGS, MOCK_BROADCASTS } from "@/lib/supabase/mock-data";
import { formatDateBD, formatTimeBD } from "@/lib/utils";
import { ShieldCheck, Radio, AlertTriangle, Info, Bell, Activity } from "lucide-react";

export default function SuperAdminPage() {
  const [broadcasts, setBroadcasts] = useState(MOCK_BROADCASTS);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newSeverity, setNewSeverity] = useState<"info" | "warning" | "critical">("info");

  const handlePostBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const b = {
      id: `bc-${Date.now()}`,
      title: newTitle,
      message: newMessage,
      severity: newSeverity,
      is_global: true,
      created_at: new Date().toISOString(),
    };

    setBroadcasts([b, ...broadcasts]);
    setNewTitle("");
    setNewMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Super Admin SaaS Operations Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global multi-tenant governance, revenue telemetry, tenant licensing, and platform broadcast network.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            PostgreSQL Multi-Tenant Engine Active
          </span>
        </div>
      </div>

      {/* 1. Global MRR & Metrics */}
      <MRRChart />

      {/* 2. Tenant Operators Management Table */}
      <TenantTable />

      {/* 3. Global Broadcast Notification & Audit Logs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Broadcast Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-600" />
              Global Operator Broadcast Feed
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Pushes to all counters</span>
          </div>

          {/* Create Broadcast Form */}
          <form onSubmit={handlePostBroadcast} className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <input
                type="text"
                placeholder="Broadcast Alert Headline (e.g. Eid Advance Booking Window)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg font-semibold"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Full announcement text to show on Counter POS terminals..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={2}
                className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as any)}
                className="p-1.5 bg-white dark:bg-slate-900 border rounded-lg font-semibold text-xs"
              >
                <option value="info">Info Notice</option>
                <option value="warning">High Priority Warning</option>
                <option value="critical">Critical Urgent</option>
              </select>
              <button
                type="submit"
                className="py-1.5 px-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
              >
                Publish Broadcast
              </button>
            </div>
          </form>

          {/* Broadcasts List */}
          <div className="space-y-3">
            {broadcasts.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {b.severity === "warning" ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-brand-600" />
                    )}
                    {b.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatDateBD(b.created_at)}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {b.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-600" />
              Platform Security & Transaction Audit Trail
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Immutable audit log</span>
          </div>

          <div className="space-y-3">
            {MOCK_AUDIT_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-700 dark:text-brand-400 text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatTimeBD(log.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span>Actor: {log.actor_email}</span>
                  <span className="font-mono text-[10px] text-slate-400">IP: {log.ip_address}</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800 font-mono text-[10px] text-slate-500 overflow-x-auto">
                  {JSON.stringify(log.details)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
