import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo-sohoj-jatra.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_sohoj_jatra_saas_platform";

export const isLiveSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo-sohoj-jatra")
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Realtime Simulation Bridge:
 * Allows multiple browser tabs or mock cashier bots to broadcast seat locks and releases
 * via BroadcastChannel API (when offline) or Supabase Realtime Channels (when online).
 */
type SeatLockEvent = {
  type: "LOCK" | "UNLOCK" | "BOOKED";
  tripId: string;
  seatNumbers: string[];
  counterName: string;
  lockedUntil: string;
  gender?: "Male" | "Female";
};

class RealtimeSeatSyncManager {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Array<(event: SeatLockEvent) => void> = [];

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.broadcastChannel = new BroadcastChannel("sohoj_jatra_realtime_seats");
      this.broadcastChannel.onmessage = (msg) => {
        this.listeners.forEach((cb) => cb(msg.data));
      };
    }
  }

  public subscribe(callback: (event: SeatLockEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public broadcast(event: SeatLockEvent) {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(event);
    }
    // Also notify current tab listeners
    this.listeners.forEach((cb) => cb(event));
  }
}

export const realtimeSeatSync = new RealtimeSeatSyncManager();
