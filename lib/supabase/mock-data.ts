import { Operator, CounterLocation, Bus, RouteItem, Trip, TripSeat, Booking, AuditLog, PlatformBroadcast, SeatingLayout } from "@/types";

export const MOCK_OPERATORS: Operator[] = [
  {
    id: "op-1",
    name: "Green Line Paribahan",
    slug: "greenline",
    trade_license: "TRAD/DSCC/019284/2018",
    logo_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80",
    contact_email: "support@greenlinebd.com",
    contact_phone: "01711540987",
    address: "9/2 Outer Circular Road, Rajarbagh, Dhaka",
    commission_rate: 3.5,
    subscription_tier: "enterprise",
    subscription_status: "active",
    is_approved: true,
    created_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "op-2",
    name: "Shohagh Elite Travels",
    slug: "shohagh",
    trade_license: "TRAD/DNCC/082711/2019",
    logo_url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=120&auto=format&fit=crop&q=80",
    contact_email: "info@shohagh.com",
    contact_phone: "01711654321",
    address: "63 DIT Road, Malibagh, Dhaka",
    commission_rate: 3.5,
    subscription_tier: "professional",
    subscription_status: "active",
    is_approved: true,
    created_at: "2024-02-10T10:00:00Z",
  },
  {
    id: "op-3",
    name: "Desh Travels Sleeper",
    slug: "deshtravels",
    trade_license: "TRAD/DNCC/110293/2021",
    logo_url: "https://images.unsplash.com/photo-1596443686812-2f45229eebc3?w=120&auto=format&fit=crop&q=80",
    contact_email: "help@deshtravels.com",
    contact_phone: "01711998877",
    address: "Gabtoli Bus Terminal, Mirpur, Dhaka",
    commission_rate: 4.0,
    subscription_tier: "starter",
    subscription_status: "trial",
    is_approved: true,
    created_at: "2024-03-01T12:00:00Z",
  },
];

export const MOCK_COUNTERS: CounterLocation[] = [
  {
    id: "cnt-1",
    operator_id: "op-1",
    name: "Rajarbagh Central Terminal",
    code: "DH-RJB",
    city: "Dhaka",
    address: "9/2 Outer Circular Road, Rajarbagh, Dhaka-1217",
    contact_phone: "01711540981",
    is_active: true,
    created_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "cnt-2",
    operator_id: "op-1",
    name: "Sayedabad Counter #04",
    code: "DH-SYD",
    city: "Dhaka",
    address: "Janapath Mor, Sayedabad Inter-district Terminal, Dhaka",
    contact_phone: "01711540982",
    is_active: true,
    created_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "cnt-3",
    operator_id: "op-1",
    name: "Dampara Main Counter",
    code: "CTG-DMP",
    city: "Chittagong",
    address: "Dampara Bus Stand, CDA Avenue, Chattogram",
    contact_phone: "01711540983",
    is_active: true,
    created_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "cnt-4",
    operator_id: "op-1",
    name: "Kolatoli Beach Counter",
    code: "CXB-KLT",
    city: "Cox's Bazar",
    address: "Hotel Motel Zone, Kolatoli Point, Cox's Bazar",
    contact_phone: "01711540984",
    is_active: true,
    created_at: "2024-01-15T08:00:00Z",
  },
];

export const MOCK_BUSES: Bus[] = [
  {
    id: "bus-1",
    operator_id: "op-1",
    coach_number: "GL-701 Scania",
    reg_no: "Dhaka Metro-BA-11-8921",
    model: "Scania K410 Multi-Axle",
    bus_type: "ac_business",
    layout_type: "2x2",
    total_seats: 36,
    has_wifi: true,
    has_charging_port: true,
    has_water: true,
    is_active: true,
  },
  {
    id: "bus-2",
    operator_id: "op-1",
    coach_number: "GL-902 Sleeper",
    reg_no: "Dhaka Metro-BA-15-4429",
    model: "Volvo 9600 Luxury Sleeper",
    bus_type: "sleeper_coach",
    layout_type: "sleeper",
    total_seats: 28,
    has_wifi: true,
    has_charging_port: true,
    has_water: true,
    is_active: true,
  },
  {
    id: "bus-3",
    operator_id: "op-2",
    coach_number: "SH-305 Hyundai",
    reg_no: "Dhaka Metro-BA-14-1102",
    model: "Hyundai Universe Prime",
    bus_type: "ac_economy",
    layout_type: "2x3",
    total_seats: 44,
    has_wifi: true,
    has_charging_port: false,
    has_water: true,
    is_active: true,
  },
];

export const MOCK_ROUTES: RouteItem[] = [
  {
    id: "rt-1",
    operator_id: "op-1",
    route_name: "Dhaka - Cox's Bazar Express",
    origin_city: "Dhaka",
    destination_city: "Cox's Bazar",
    distance_km: 395,
    estimated_hours: 8.5,
    stoppages: [
      { name: "Sayedabad", fare_offset: 0 },
      { name: "Comilla Cantonment", fare_offset: -300 },
      { name: "Chittagong Bypass", fare_offset: -400 },
      { name: "Kolatoli Beach", fare_offset: 0 },
    ],
    is_active: true,
  },
  {
    id: "rt-2",
    operator_id: "op-1",
    route_name: "Dhaka - Chittagong Highway Super",
    origin_city: "Dhaka",
    destination_city: "Chittagong",
    distance_km: 245,
    estimated_hours: 5.0,
    stoppages: [
      { name: "Sayedabad", fare_offset: 0 },
      { name: "Feni Bypass", fare_offset: -150 },
      { name: "Dampara", fare_offset: 0 },
    ],
    is_active: true,
  },
  {
    id: "rt-3",
    operator_id: "op-1",
    route_name: "Dhaka - Sylhet Luxury Highway",
    origin_city: "Dhaka",
    destination_city: "Sylhet",
    distance_km: 240,
    estimated_hours: 5.5,
    stoppages: [
      { name: "Kanchpur", fare_offset: 0 },
      { name: "Bhairab", fare_offset: -200 },
      { name: "Shayestaganj", fare_offset: -100 },
      { name: "Kadamtali", fare_offset: 0 },
    ],
    is_active: true,
  },
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: "trip-101",
    operator_id: "op-1",
    operator_name: "Green Line Paribahan",
    bus_id: "bus-1",
    bus_model: "Scania K410 Multi-Axle (Business)",
    bus_type: "ac_business",
    layout_type: "2x2",
    coach_number: "GL-701",
    route_id: "rt-1",
    origin_city: "Dhaka",
    destination_city: "Cox's Bazar",
    departure_counter_id: "cnt-1",
    departure_counter_name: "Rajarbagh Central Terminal",
    arrival_counter_name: "Kolatoli Beach Counter",
    departure_time: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    arrival_time: new Date(Date.now() + 11.5 * 3600 * 1000).toISOString(),
    base_fare: 1600,
    available_seats_count: 22,
    total_seats_count: 36,
    status: "scheduled",
  },
  {
    id: "trip-102",
    operator_id: "op-1",
    operator_name: "Green Line Paribahan",
    bus_id: "bus-2",
    bus_model: "Volvo 9600 Luxury Sleeper",
    bus_type: "sleeper_coach",
    layout_type: "sleeper",
    coach_number: "GL-902",
    route_id: "rt-1",
    origin_city: "Dhaka",
    destination_city: "Cox's Bazar",
    departure_counter_id: "cnt-2",
    departure_counter_name: "Sayedabad Counter #04",
    arrival_counter_name: "Kolatoli Beach Counter",
    departure_time: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    arrival_time: new Date(Date.now() + 16.5 * 3600 * 1000).toISOString(),
    base_fare: 2200,
    available_seats_count: 14,
    total_seats_count: 28,
    status: "scheduled",
  },
  {
    id: "trip-103",
    operator_id: "op-1",
    operator_name: "Green Line Paribahan",
    bus_id: "bus-1",
    bus_model: "Scania K410 Executive",
    bus_type: "ac_business",
    layout_type: "2x2",
    coach_number: "GL-703",
    route_id: "rt-2",
    origin_city: "Dhaka",
    destination_city: "Chittagong",
    departure_counter_id: "cnt-1",
    departure_counter_name: "Rajarbagh Central Terminal",
    arrival_counter_name: "Dampara Main Counter",
    departure_time: new Date(Date.now() + 1.5 * 3600 * 1000).toISOString(),
    arrival_time: new Date(Date.now() + 6.5 * 3600 * 1000).toISOString(),
    base_fare: 1100,
    available_seats_count: 18,
    total_seats_count: 36,
    status: "boarding",
  },
];

// Helper to generate realistic 2x2 seat grid
export function generateMockSeatsForTrip(tripId: string, layout: SeatingLayout = "2x2", baseFare: number = 1600): TripSeat[] {
  const seats: TripSeat[] = [];
  const rows = layout === "sleeper" ? ["A", "B", "C", "D", "E", "F", "G"] : ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  // Pre-determined booked or locked seats for realism
  const bookedSeatsMap: Record<string, { gender: "Male" | "Female" }> = {
    "A1": { gender: "Male" },
    "A2": { gender: "Male" },
    "B3": { gender: "Female" },
    "B4": { gender: "Female" },
    "D1": { gender: "Male" },
    "D2": { gender: "Female" },
    "F3": { gender: "Male" },
  };

  const otherCounterLockedMap: Record<string, string> = {
    "C1": "Sayedabad Counter #04",
    "C2": "Sayedabad Counter #04",
  };

  rows.forEach((rowLetter, rIndex) => {
    const cols = layout === "2x3" ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];
    cols.forEach((colNum, cIndex) => {
      const seatNum = `${rowLetter}${colNum}`;
      let status: TripSeat["status"] = "available";
      let gender: "Male" | "Female" | undefined = undefined;
      let lockedByCounterName: string | undefined = undefined;
      let lockedUntil: string | undefined = undefined;

      if (bookedSeatsMap[seatNum]) {
        status = "booked";
        gender = bookedSeatsMap[seatNum].gender;
      } else if (otherCounterLockedMap[seatNum]) {
        status = "locked";
        lockedByCounterName = otherCounterLockedMap[seatNum];
        lockedUntil = new Date(Date.now() + 4 * 60 * 1000).toISOString();
      }

      seats.push({
        id: `seat-${tripId}-${seatNum}`,
        trip_id: tripId,
        seat_number: seatNum,
        status,
        row_index: rIndex,
        col_index: cIndex,
        fare: baseFare,
        passenger_gender: gender,
        locked_by_counter_name: lockedByCounterName,
        locked_until: lockedUntil,
      });
    });
  });

  return seats;
}

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "bk-9021",
    operator_id: "op-1",
    operator_name: "Green Line Paribahan",
    trip_id: "trip-101",
    counter_id: "cnt-1",
    counter_name: "Rajarbagh Central Terminal",
    pnr_number: "SJ-GL-89210",
    passenger_name: "Tanvir Ahmed Chowdhury",
    passenger_phone: "01712345678",
    passenger_gender: "Male",
    passenger_nid: "19942691029384",
    boarding_counter_name: "Rajarbagh Central Terminal",
    dropping_point: "Kolatoli Beach Point",
    seat_numbers: ["A1", "A2"],
    total_seats: 2,
    total_fare: 3200,
    discount_amount: 200,
    service_charge: 50,
    net_fare: 3050,
    payment_method: "bkash",
    payment_status: "paid",
    payment_trx_id: "BKX928173921",
    ticket_status: "confirmed",
    origin_city: "Dhaka",
    destination_city: "Cox's Bazar",
    coach_number: "GL-701",
    bus_type: "ac_business",
    departure_time: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: "bk-9022",
    operator_id: "op-1",
    operator_name: "Green Line Paribahan",
    trip_id: "trip-101",
    counter_id: "cnt-2",
    counter_name: "Sayedabad Counter #04",
    pnr_number: "SJ-GL-89211",
    passenger_name: "Farhana Yasmin",
    passenger_phone: "01819876543",
    passenger_gender: "Female",
    passenger_nid: "19982691044812",
    boarding_counter_name: "Sayedabad Counter #04",
    dropping_point: "Chittagong Bypass",
    seat_numbers: ["B3", "B4"],
    total_seats: 2,
    total_fare: 3200,
    discount_amount: 0,
    service_charge: 50,
    net_fare: 3250,
    payment_method: "cash",
    payment_status: "paid",
    ticket_status: "confirmed",
    origin_city: "Dhaka",
    destination_city: "Cox's Bazar",
    coach_number: "GL-701",
    bus_type: "ac_business",
    departure_time: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud-1",
    operator_id: "op-1",
    operator_name: "Green Line Paribahan",
    actor_email: "cashier.rajarbagh@greenlinebd.com",
    actor_role: "counter_staff",
    action: "BOOKING_ISSUED",
    target_table: "bookings",
    record_id: "bk-9021",
    details: { pnr: "SJ-GL-89210", seats: ["A1", "A2"], method: "bkash", net_fare: 3050 },
    ip_address: "103.114.98.12",
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: "aud-2",
    operator_id: "op-1",
    operator_name: "Green Line Paribahan",
    actor_email: "admin@greenlinebd.com",
    actor_role: "operator_admin",
    action: "TRIP_SCHEDULED",
    target_table: "trips",
    record_id: "trip-101",
    details: { route: "Dhaka - Cox's Bazar", coach: "GL-701", departure: "Today 16:00" },
    ip_address: "103.114.98.1",
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
  },
  {
    id: "aud-3",
    actor_email: "superadmin@sohojjatra.com",
    actor_role: "super_admin",
    action: "OPERATOR_APPROVED",
    target_table: "operators",
    record_id: "op-1",
    details: { operator: "Green Line Paribahan", plan: "enterprise", commission: 3.5 },
    ip_address: "182.160.101.44",
    created_at: "2024-01-15T08:30:00Z",
  },
];

export const MOCK_BROADCASTS: PlatformBroadcast[] = [
  {
    id: "bc-1",
    title: "Upcoming Eid-ul-Fitr 2026 Special Advance Ticketing Window",
    message: "Ministry of Road Transport & Bridges has announced coordinated advance ticketing schedules. Ensure your counter terminals have updated seat locks.",
    severity: "warning",
    is_global: true,
    created_at: "2026-03-20T09:00:00Z",
  },
  {
    id: "bc-2",
    title: "System Maintenance: Realtime WebSocket Gateway Upgraded",
    message: "Ultra-low latency sub-second lock synchronization is now active for all Dhaka terminals.",
    severity: "info",
    is_global: true,
    created_at: "2026-03-25T11:00:00Z",
  },
];
