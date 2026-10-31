import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SMSNotificationSimulator } from "@/components/common/SMSNotificationSimulator";

export const metadata: Metadata = {
  title: "Sohoj Jatra (সহজ যাত্রা) - Enterprise Bus SaaS & Cloud Counter POS",
  description: "Next-generation multi-tenant SaaS platform for bus operators, live counter terminal synchronization, Supabase Realtime seat locking, and automated ticketing.",
  keywords: ["Bus ticketing", "Counter POS", "Bangladesh bus booking", "Green Line", "Shohagh", "Supabase Realtime", "SaaS multi-tenant"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <SMSNotificationSimulator />
        <Footer />
      </body>
    </html>
  );
}
