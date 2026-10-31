export type UserRole = 
  | 'super_admin' 
  | 'operator_admin' 
  | 'counter_manager' 
  | 'counter_staff' 
  | 'passenger';

export type BusType = 'ac_business' | 'ac_economy' | 'non_ac' | 'sleeper_coach';
export type SeatingLayout = '2x2' | '2x3' | 'sleeper';
export type TripStatus = 'scheduled' | 'boarding' | 'in_transit' | 'completed' | 'cancelled';
export type SeatStatus = 'available' | 'locked' | 'booked' | 'blocked';
export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'sslcommerz' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'trial' | 'active' | 'overdue' | 'suspended';

export interface Operator {
  id: string;
  name: string;
  slug: string;
  trade_license?: string;
  logo_url?: string;
  contact_email: string;
  contact_phone: string;
  address?: string;
  commission_rate: number;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  is_approved: boolean;
  settings?: {
    allow_online_booking: boolean;
    sms_notifications_enabled: boolean;
    lock_timeout_minutes: number;
  };
  created_at: string;
}

export interface CounterLocation {
  id: string;
  operator_id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  contact_phone: string;
  is_active: boolean;
  created_at: string;
}

export interface Bus {
  id: string;
  operator_id: string;
  coach_number: string;
  reg_no: string;
  model: string;
  bus_type: BusType;
  layout_type: SeatingLayout;
  total_seats: number;
  has_wifi: boolean;
  has_charging_port: boolean;
  has_water: boolean;
  is_active: boolean;
}

export interface RouteItem {
  id: string;
  operator_id: string;
  route_name: string;
  origin_city: string;
  destination_city: string;
  distance_km: number;
  estimated_hours: number;
  stoppages: Array<{ name: string; fare_offset: number }>;
  is_active: boolean;
}

export interface Trip {
  id: string;
  operator_id: string;
  operator_name?: string;
  bus_id: string;
  bus_model?: string;
  bus_type: BusType;
  layout_type: SeatingLayout;
  coach_number: string;
  route_id: string;
  origin_city: string;
  destination_city: string;
  departure_counter_id: string;
  departure_counter_name?: string;
  arrival_counter_name?: string;
  departure_time: string;
  arrival_time: string;
  base_fare: number;
  available_seats_count: number;
  total_seats_count: number;
  status: TripStatus;
}

export interface TripSeat {
  id: string;
  trip_id: string;
  seat_number: string;
  status: SeatStatus;
  deck?: 'lower' | 'upper';
  row_index: number;
  col_index: number;
  locked_by_counter_id?: string;
  locked_by_counter_name?: string;
  locked_by_user_id?: string;
  locked_until?: string;
  passenger_gender?: 'Male' | 'Female';
  fare: number;
  booking_id?: string;
}

export interface Booking {
  id: string;
  operator_id: string;
  operator_name?: string;
  trip_id: string;
  counter_id?: string;
  counter_name?: string;
  booked_by_user_id?: string;
  pnr_number: string;
  passenger_name: string;
  passenger_phone: string;
  passenger_gender: 'Male' | 'Female';
  passenger_nid?: string;
  boarding_counter_name?: string;
  dropping_point?: string;
  seat_numbers: string[];
  total_seats: number;
  total_fare: number;
  discount_amount: number;
  service_charge: number;
  net_fare: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_trx_id?: string;
  ticket_status: 'confirmed' | 'cancelled';
  notes?: string;
  departure_time?: string;
  origin_city?: string;
  destination_city?: string;
  coach_number?: string;
  bus_type?: BusType;
  created_at: string;
}

export interface AuditLog {
  id: string;
  operator_id?: string;
  operator_name?: string;
  actor_email: string;
  actor_role: UserRole;
  action: string;
  target_table: string;
  record_id?: string;
  details: Record<string, any>;
  ip_address: string;
  created_at: string;
}

export interface PlatformBroadcast {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  is_global: boolean;
  target_operator_id?: string;
  created_at: string;
}
