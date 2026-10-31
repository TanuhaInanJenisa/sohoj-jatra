import { create } from "zustand";
import { Trip, TripSeat, Booking, PaymentMethod, CounterLocation, Operator } from "@/types";
import { MOCK_TRIPS, generateMockSeatsForTrip, MOCK_COUNTERS, MOCK_OPERATORS, MOCK_ROUTES } from "@/lib/supabase/mock-data";
import { realtimeSeatSync } from "@/lib/supabase/client";

// Enhanced seat generator with Upper and Lower deck support for Sleeper & Double Deckers
export function generateDeckSeatsForTrip(tripId: string, layout: string = "2x2", baseFare: number = 1600): TripSeat[] {
  const seats: TripSeat[] = [];

  if (layout === "sleeper") {
    // Sleeper coach: Lower Deck (L1 to L14) and Upper Deck (U1 to U14)
    ["lower", "upper"].forEach((deck) => {
      const prefix = deck === "lower" ? "L" : "U";
      const rows = ["A", "B", "C", "D", "E", "F", "G"];
      rows.forEach((r, rIdx) => {
        [1, 2].forEach((c, cIdx) => {
          const seatNum = `${prefix}-${r}${c}`;
          const isBooked = (deck === "lower" && r === "A" && c === 1) || (deck === "upper" && r === "B" && c === 2);
          const isLocked = deck === "lower" && r === "C" && c === 1;

          seats.push({
            id: `seat-${tripId}-${seatNum}`,
            trip_id: tripId,
            seat_number: seatNum,
            status: isBooked ? "booked" : isLocked ? "locked" : "available",
            deck: deck as "lower" | "upper",
            row_index: rIdx,
            col_index: cIdx,
            fare: deck === "upper" ? baseFare + 200 : baseFare, // Upper deck luxury premium
            passenger_gender: isBooked ? "Male" : undefined,
            locked_by_counter_name: isLocked ? "Sayedabad Counter #04" : undefined,
            locked_until: isLocked ? new Date(Date.now() + 4 * 60 * 1000).toISOString() : undefined,
          });
        });
      });
    });
  } else {
    // Standard single decker 2x2 or 2x3 coach
    const singleDeckSeats = generateMockSeatsForTrip(tripId, layout as any, baseFare);
    singleDeckSeats.forEach((s) => seats.push({ ...s, deck: "lower" }));
  }

  return seats;
}

interface POSState {
  currentOperator: Operator;
  currentCounter: CounterLocation;
  currentTrip: Trip;
  seats: TripSeat[];
  selectedSeatNumbers: string[];
  lockSecondsRemaining: number;
  timerActive: boolean;

  // Deck selector (for Sleeper / Double decker)
  activeDeck: "lower" | "upper";
  setActiveDeck: (deck: "lower" | "upper") => void;

  // Passenger & Payment info
  passengerName: string;
  passengerPhone: string;
  passengerGender: "Male" | "Female";
  passengerNid: string;
  boardingPoint: string;
  droppingPoint: string;
  droppingFareOffset: number; // Stoppage offset (e.g. -300 if dropping earlier)
  promoCode: string;
  discountAmount: number;
  serviceFee: number;
  paymentMethod: PaymentMethod;
  cashReceived: number;

  // Offline PWA Mode & Local Storage Cache
  isOfflineMode: boolean;
  offlineQueuedBookings: Booking[];
  toggleOfflineMode: () => void;
  syncOfflineBookings: () => void;

  // Thermal modal & last confirmed booking
  isThermalModalOpen: boolean;
  lastConfirmedBooking: Booking | null;

  // Actions
  setOperator: (op: Operator) => void;
  setCounter: (counter: CounterLocation) => void;
  setTrip: (trip: Trip) => void;
  setDroppingPointWithOffset: (stoppageName: string, fareOffset: number) => void;
  toggleSeat: (seatNumber: string) => boolean;
  clearSelection: () => void;
  tickTimer: () => void;
  setPassengerDetails: (details: Partial<{
    passengerName: string;
    passengerPhone: string;
    passengerGender: "Male" | "Female";
    passengerNid: string;
    boardingPoint: string;
    droppingPoint: string;
    paymentMethod: PaymentMethod;
    cashReceived: number;
  }>) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  confirmBooking: () => Booking | null;
  closeThermalModal: () => void;
  simulateIncomingCounterLock: (seatNumbers: string[], counterName: string) => void;
  simulateIncomingBooking: (seatNumbers: string[], gender: "Male" | "Female") => void;
}

export const usePOSStore = create<POSState>((set, get) => {
  const initialTrip = MOCK_TRIPS[0];
  const initialSeats = generateDeckSeatsForTrip(initialTrip.id, initialTrip.layout_type, initialTrip.base_fare);

  // Load offline bookings from localStorage if present
  let storedOffline: Booking[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("sohoj_jatra_offline_bookings");
      if (raw) storedOffline = JSON.parse(raw);
    } catch (e) {
      // Ignore
    }
  }

  return {
    currentOperator: MOCK_OPERATORS[0],
    currentCounter: MOCK_COUNTERS[0],
    currentTrip: initialTrip,
    seats: initialSeats,
    selectedSeatNumbers: [],
    lockSecondsRemaining: 300,
    timerActive: false,

    activeDeck: "lower",
    setActiveDeck: (deck) => set({ activeDeck: deck }),

    passengerName: "",
    passengerPhone: "",
    passengerGender: "Male",
    passengerNid: "",
    boardingPoint: initialTrip.departure_counter_name || "Rajarbagh Central Terminal",
    droppingPoint: initialTrip.destination_city || "Cox's Bazar",
    droppingFareOffset: 0,
    promoCode: "",
    discountAmount: 0,
    serviceFee: 50,
    paymentMethod: "cash",
    cashReceived: 0,

    isOfflineMode: false,
    offlineQueuedBookings: storedOffline,

    toggleOfflineMode: () => {
      const nextMode = !get().isOfflineMode;
      set({ isOfflineMode: nextMode });
      if (!nextMode) {
        get().syncOfflineBookings();
      }
    },

    syncOfflineBookings: () => {
      const state = get();
      if (state.offlineQueuedBookings.length > 0) {
        alert(`Synced ${state.offlineQueuedBookings.length} offline bookings with cloud server!`);
        if (typeof window !== "undefined") {
          localStorage.removeItem("sohoj_jatra_offline_bookings");
        }
        set({ offlineQueuedBookings: [] });
      }
    },

    isThermalModalOpen: false,
    lastConfirmedBooking: null,

    setOperator: (op) => set({ currentOperator: op }),
    
    setCounter: (counter) => set({ currentCounter: counter, boardingPoint: counter.name }),

    setTrip: (trip) => {
      const freshSeats = generateDeckSeatsForTrip(trip.id, trip.layout_type, trip.base_fare);
      set({
        currentTrip: trip,
        seats: freshSeats,
        selectedSeatNumbers: [],
        timerActive: false,
        lockSecondsRemaining: 300,
        activeDeck: "lower",
        boardingPoint: trip.departure_counter_name || get().currentCounter.name,
        droppingPoint: trip.destination_city,
        droppingFareOffset: 0,
        discountAmount: 0,
        promoCode: "",
      });
    },

    setDroppingPointWithOffset: (stoppageName, fareOffset) => {
      set({ droppingPoint: stoppageName, droppingFareOffset: fareOffset });
    },

    toggleSeat: (seatNumber) => {
      const state = get();
      const seat = state.seats.find((s) => s.seat_number === seatNumber);
      if (!seat) return false;

      if (seat.status === "booked") return false;
      if (seat.status === "locked" && !state.selectedSeatNumbers.includes(seatNumber)) {
        return false;
      }

      if (state.selectedSeatNumbers.includes(seatNumber)) {
        const nextSelected = state.selectedSeatNumbers.filter((s) => s !== seatNumber);
        const updatedSeats = state.seats.map((s) => {
          if (s.seat_number === seatNumber) {
            return {
              ...s,
              status: "available" as const,
              locked_by_counter_name: undefined,
              locked_until: undefined,
            };
          }
          return s;
        });

        if (!state.isOfflineMode) {
          realtimeSeatSync.broadcast({
            type: "UNLOCK",
            tripId: state.currentTrip.id,
            seatNumbers: [seatNumber],
            counterName: state.currentCounter.name,
            lockedUntil: "",
          });
        }

        set({
          selectedSeatNumbers: nextSelected,
          seats: updatedSeats,
          timerActive: nextSelected.length > 0,
        });
        return true;
      }

      if (state.selectedSeatNumbers.length >= 4) {
        alert("Maximum 4 seats can be selected per booking session.");
        return false;
      }

      const expiry = new Date(Date.now() + 300 * 1000).toISOString();
      const nextSelected = [...state.selectedSeatNumbers, seatNumber];
      const updatedSeats = state.seats.map((s) => {
        if (s.seat_number === seatNumber) {
          return {
            ...s,
            status: "locked" as const,
            locked_by_counter_name: state.currentCounter.name,
            locked_until: expiry,
          };
        }
        return s;
      });

      if (!state.isOfflineMode) {
        realtimeSeatSync.broadcast({
          type: "LOCK",
          tripId: state.currentTrip.id,
          seatNumbers: [seatNumber],
          counterName: state.currentCounter.name,
          lockedUntil: expiry,
        });
      }

      set({
        selectedSeatNumbers: nextSelected,
        seats: updatedSeats,
        timerActive: true,
        lockSecondsRemaining: 300,
      });
      return true;
    },

    clearSelection: () => {
      const state = get();
      if (state.selectedSeatNumbers.length === 0) return;

      const updatedSeats = state.seats.map((s) => {
        if (state.selectedSeatNumbers.includes(s.seat_number)) {
          return {
            ...s,
            status: "available" as const,
            locked_by_counter_name: undefined,
            locked_until: undefined,
          };
        }
        return s;
      });

      if (!state.isOfflineMode) {
        realtimeSeatSync.broadcast({
          type: "UNLOCK",
          tripId: state.currentTrip.id,
          seatNumbers: state.selectedSeatNumbers,
          counterName: state.currentCounter.name,
          lockedUntil: "",
        });
      }

      set({
        selectedSeatNumbers: [],
        seats: updatedSeats,
        timerActive: false,
        lockSecondsRemaining: 300,
      });
    },

    tickTimer: () => {
      const { timerActive, lockSecondsRemaining } = get();
      if (!timerActive) return;

      if (lockSecondsRemaining <= 1) {
        get().clearSelection();
        alert("Seat reservation lock has expired and seats have been released.");
      } else {
        set({ lockSecondsRemaining: lockSecondsRemaining - 1 });
      }
    },

    setPassengerDetails: (details) => {
      set((state) => ({ ...state, ...details }));
    },

    applyPromoCode: (code) => {
      const clean = code.trim().toUpperCase();
      const state = get();
      const seatCount = state.selectedSeatNumbers.length;

      if (seatCount === 0) {
        return { success: false, message: "Please select seats first" };
      }

      const effectivePerSeatFare = Math.max(200, state.currentTrip.base_fare + state.droppingFareOffset);

      if (clean === "EID2026") {
        const disc = Math.round(seatCount * effectivePerSeatFare * 0.15);
        set({ promoCode: clean, discountAmount: disc });
        return { success: true, message: `Promo EID2026 applied! ৳${disc} discount` };
      }

      if (clean === "SOHOJ50") {
        const disc = seatCount * 50;
        set({ promoCode: clean, discountAmount: disc });
        return { success: true, message: `Promo SOHOJ50 applied! ৳${disc} discount` };
      }

      return { success: false, message: "Invalid promo code. Try 'EID2026' or 'SOHOJ50'" };
    },

    confirmBooking: () => {
      const state = get();
      if (state.selectedSeatNumbers.length === 0) return null;
      if (!state.passengerName.trim() || !state.passengerPhone.trim()) {
        alert("Please provide Passenger Name and Contact Mobile Number.");
        return null;
      }

      const effectivePerSeat = Math.max(200, state.currentTrip.base_fare + state.droppingFareOffset);
      const totalFare = state.selectedSeatNumbers.length * effectivePerSeat;
      const netFare = Math.max(0, totalFare - state.discountAmount + state.serviceFee);
      const pnr = `SJ-${state.currentOperator.slug.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        operator_id: state.currentOperator.id,
        operator_name: state.currentOperator.name,
        trip_id: state.currentTrip.id,
        counter_id: state.currentCounter.id,
        counter_name: state.currentCounter.name,
        pnr_number: pnr,
        passenger_name: state.passengerName,
        passenger_phone: state.passengerPhone,
        passenger_gender: state.passengerGender,
        passenger_nid: state.passengerNid || undefined,
        boarding_counter_name: state.boardingPoint,
        dropping_point: state.droppingPoint,
        seat_numbers: [...state.selectedSeatNumbers],
        total_seats: state.selectedSeatNumbers.length,
        total_fare: totalFare,
        discount_amount: state.discountAmount,
        service_charge: state.serviceFee,
        net_fare: netFare,
        payment_method: state.paymentMethod,
        payment_status: "paid",
        ticket_status: "confirmed",
        departure_time: state.currentTrip.departure_time,
        origin_city: state.currentTrip.origin_city,
        destination_city: state.currentTrip.destination_city,
        coach_number: state.currentTrip.coach_number,
        bus_type: state.currentTrip.bus_type,
        created_at: new Date().toISOString(),
      };

      // Save to localStorage if offline mode is active
      if (state.isOfflineMode) {
        const updatedOffline = [...state.offlineQueuedBookings, newBooking];
        if (typeof window !== "undefined") {
          localStorage.setItem("sohoj_jatra_offline_bookings", JSON.stringify(updatedOffline));
        }
        set({ offlineQueuedBookings: updatedOffline });
      }

      // Mark seats as booked
      const updatedSeats = state.seats.map((s) => {
        if (state.selectedSeatNumbers.includes(s.seat_number)) {
          return {
            ...s,
            status: "booked" as const,
            passenger_gender: state.passengerGender,
            locked_by_counter_name: undefined,
            locked_until: undefined,
          };
        }
        return s;
      });

      if (!state.isOfflineMode) {
        realtimeSeatSync.broadcast({
          type: "BOOKED",
          tripId: state.currentTrip.id,
          seatNumbers: state.selectedSeatNumbers,
          counterName: state.currentCounter.name,
          lockedUntil: "",
          gender: state.passengerGender,
        });
      }

      set({
        seats: updatedSeats,
        selectedSeatNumbers: [],
        timerActive: false,
        lockSecondsRemaining: 300,
        lastConfirmedBooking: newBooking,
        isThermalModalOpen: true,
      });

      return newBooking;
    },

    closeThermalModal: () => {
      set({
        isThermalModalOpen: false,
        passengerName: "",
        passengerPhone: "",
        passengerNid: "",
        discountAmount: 0,
        promoCode: "",
        cashReceived: 0,
      });
    },

    simulateIncomingCounterLock: (seatNumbers, counterName) => {
      const state = get();
      const updatedSeats = state.seats.map((s) => {
        if (seatNumbers.includes(s.seat_number) && !state.selectedSeatNumbers.includes(s.seat_number)) {
          return {
            ...s,
            status: "locked" as const,
            locked_by_counter_name: counterName,
            locked_until: new Date(Date.now() + 300 * 1000).toISOString(),
          };
        }
        return s;
      });
      set({ seats: updatedSeats });
    },

    simulateIncomingBooking: (seatNumbers, gender) => {
      const state = get();
      const updatedSeats = state.seats.map((s) => {
        if (seatNumbers.includes(s.seat_number)) {
          return {
            ...s,
            status: "booked" as const,
            passenger_gender: gender,
            locked_by_counter_name: undefined,
            locked_until: undefined,
          };
        }
        return s;
      });
      set({
        seats: updatedSeats,
        selectedSeatNumbers: state.selectedSeatNumbers.filter((n) => !seatNumbers.includes(n)),
      });
    },
  };
});
