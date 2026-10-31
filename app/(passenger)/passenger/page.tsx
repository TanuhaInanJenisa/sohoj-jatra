"use client";

import React from "react";
import { DigitalTicketView } from "@/components/passenger/DigitalTicketView";

export default function PassengerPortalPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <DigitalTicketView />
    </div>
  );
}
