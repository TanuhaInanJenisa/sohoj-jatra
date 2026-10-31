-- ============================================================================
-- SOHOJ JATRA (সহজ যাত্রা) - SaaS Multi-Tenant Database Schema
-- Enterprise Bus Counter & Ticket Booking Management Platform
-- PostgreSQL 15+ / Supabase Engine
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing types if redefining
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'super_admin',
        'operator_admin',
        'counter_manager',
        'counter_staff',
        'passenger'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE bus_type AS ENUM (
        'ac_business',
        'ac_economy',
        'non_ac',
        'sleeper_coach'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE seating_layout AS ENUM (
        '2x2',
        '2x3',
        'sleeper'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE trip_status AS ENUM (
        'scheduled',
        'boarding',
        'in_transit',
        'completed',
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE seat_status AS ENUM (
        'available',
        'locked',
        'booked',
        'blocked'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
        'cash',
        'bkash',
        'nagad',
        'sslcommerz',
        'card'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'pending',
        'paid',
        'failed',
        'refunded'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM (
        'starter',
        'professional',
        'enterprise'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM (
        'trial',
        'active',
        'overdue',
        'suspended'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 1. OPERATORS (Tenants Table)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    trade_license VARCHAR(100),
    logo_url TEXT,
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    address TEXT,
    commission_rate NUMERIC(5, 2) DEFAULT 3.50, -- SaaS platform fee %
    subscription_tier subscription_tier DEFAULT 'starter',
    subscription_status subscription_status DEFAULT 'trial',
    is_approved BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{"allow_online_booking": true, "sms_notifications_enabled": true, "lock_timeout_minutes": 5}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Index for fast lookup by slug
CREATE INDEX IF NOT EXISTS idx_operators_slug ON public.operators(slug);

-- ----------------------------------------------------------------------------
-- 2. SUBSCRIPTIONS (Platform Monetization & MRR)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL DEFAULT 'starter',
    mrr_bdt NUMERIC(10, 2) NOT NULL DEFAULT 4999.00,
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly' or 'yearly'
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    current_period_end TIMESTAMPTZ DEFAULT (TIMEZONE('utc', NOW()) + INTERVAL '30 days'),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ----------------------------------------------------------------------------
-- 3. COUNTERS (Physical booking points e.g., Mohakhali, Sayedabad, Gabtoli)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.counters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_counters_operator ON public.counters(operator_id);

-- ----------------------------------------------------------------------------
-- 4. USER PROFILES (Auth profiles linked to Supabase auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    role user_role NOT NULL DEFAULT 'counter_staff',
    operator_id UUID REFERENCES public.operators(id) ON DELETE SET NULL,
    counter_id UUID REFERENCES public.counters(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_profiles_operator ON public.profiles(operator_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ----------------------------------------------------------------------------
-- 5. FLEET / BUSES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
    coach_number VARCHAR(50) NOT NULL,
    reg_no VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    bus_type bus_type NOT NULL DEFAULT 'ac_business',
    layout_type seating_layout NOT NULL DEFAULT '2x2',
    total_seats INT NOT NULL DEFAULT 40,
    has_wifi BOOLEAN DEFAULT TRUE,
    has_charging_port BOOLEAN DEFAULT TRUE,
    has_water BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_buses_operator ON public.buses(operator_id);

-- ----------------------------------------------------------------------------
-- 6. BUS SEAT BLUEPRINTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    row_index INT NOT NULL,
    col_index INT NOT NULL,
    deck VARCHAR(10) DEFAULT 'lower',
    is_special BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_seats_bus_num ON public.seats(bus_id, seat_number);

-- ----------------------------------------------------------------------------
-- 7. ROUTES & STOPPAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
    route_name VARCHAR(200) NOT NULL,
    origin_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    distance_km INT NOT NULL DEFAULT 250,
    estimated_hours NUMERIC(4, 1) NOT NULL DEFAULT 5.5,
    stoppages JSONB DEFAULT '[]'::jsonb, -- Array of stoppage objects with stop_name and distance
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_routes_operator ON public.routes(operator_id);

-- ----------------------------------------------------------------------------
-- 8. TRIPS (Specific scheduled departures)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
    bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE RESTRICT,
    route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE RESTRICT,
    departure_counter_id UUID REFERENCES public.counters(id),
    arrival_counter_id UUID REFERENCES public.counters(id),
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    base_fare NUMERIC(10, 2) NOT NULL DEFAULT 950.00,
    status trip_status NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_trips_operator_dept ON public.trips(operator_id, departure_time);
CREATE INDEX IF NOT EXISTS idx_trips_route ON public.trips(route_id);

-- ----------------------------------------------------------------------------
-- 9. TRIP SEATS (Realtime seat state matrix for each scheduled departure)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trip_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    seat_id UUID NOT NULL REFERENCES public.seats(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    status seat_status NOT NULL DEFAULT 'available',
    locked_by_counter_id UUID REFERENCES public.counters(id) ON DELETE SET NULL,
    locked_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    locked_at TIMESTAMPTZ,
    locked_until TIMESTAMPTZ,
    passenger_gender VARCHAR(10),
    fare NUMERIC(10, 2) NOT NULL,
    booking_id UUID,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trip_seats_trip_seat ON public.trip_seats(trip_id, seat_number);
CREATE INDEX IF NOT EXISTS idx_trip_seats_status ON public.trip_seats(trip_id, status);

-- ----------------------------------------------------------------------------
-- 10. BOOKINGS (Confirmed ticket orders)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE RESTRICT,
    counter_id UUID REFERENCES public.counters(id) ON DELETE SET NULL,
    booked_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    pnr_number VARCHAR(30) NOT NULL UNIQUE,
    passenger_name VARCHAR(150) NOT NULL,
    passenger_phone VARCHAR(30) NOT NULL,
    passenger_gender VARCHAR(10) NOT NULL DEFAULT 'Male',
    passenger_nid VARCHAR(50),
    boarding_counter_id UUID REFERENCES public.counters(id),
    dropping_point VARCHAR(150),
    total_seats INT NOT NULL DEFAULT 1,
    total_fare NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    service_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    net_fare NUMERIC(10, 2) NOT NULL,
    payment_method payment_method NOT NULL DEFAULT 'cash',
    payment_status payment_status NOT NULL DEFAULT 'paid',
    payment_trx_id VARCHAR(100),
    ticket_status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON public.bookings(pnr_number);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(passenger_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_operator ON public.bookings(operator_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip ON public.bookings(trip_id);

-- ----------------------------------------------------------------------------
-- 11. AUDIT LOGS (Platform-wide and Tenant Security audit trails)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID REFERENCES public.operators(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(50) NOT NULL,
    record_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_audit_operator ON public.audit_logs(operator_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 12. PLATFORM BROADCASTS (Super Admin global & tenant announcements)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_broadcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'critical'
    is_global BOOLEAN DEFAULT TRUE,
    target_operator_id UUID REFERENCES public.operators(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- HIGH-CONCURRENCY TRANSACTIONAL FUNCTIONS (ANTI-RACE CONDITION LOCKS)
-- ============================================================================

-- Function 1: Atomic Seat Lock (Prevents double booking across multiple counters)
CREATE OR REPLACE FUNCTION public.lock_seats_atomic(
    p_trip_id UUID,
    p_seat_numbers TEXT[],
    p_counter_id UUID,
    p_user_id UUID,
    p_duration_seconds INT DEFAULT 300
)
RETURNS TABLE (
    success BOOLEAN,
    locked_seats TEXT[],
    message TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_locked_count INT;
    v_target_count INT := array_length(p_seat_numbers, 1);
    v_now TIMESTAMPTZ := TIMEZONE('utc', NOW());
    v_expiry TIMESTAMPTZ := v_now + (p_duration_seconds || ' seconds')::INTERVAL;
BEGIN
    -- Automatically unlock any stale seats that expired
    UPDATE public.trip_seats
    SET status = 'available',
        locked_by_counter_id = NULL,
        locked_by_user_id = NULL,
        locked_at = NULL,
        locked_until = NULL
    WHERE trip_id = p_trip_id
      AND status = 'locked'
      AND locked_until < v_now;

    -- Lock candidate seats with pessimistic row lock
    WITH locked_rows AS (
        UPDATE public.trip_seats
        SET status = 'locked',
            locked_by_counter_id = p_counter_id,
            locked_by_user_id = p_user_id,
            locked_at = v_now,
            locked_until = v_expiry,
            updated_at = v_now
        WHERE trip_id = p_trip_id
          AND seat_number = ANY(p_seat_numbers)
          AND (
              status = 'available' 
              OR (status = 'locked' AND locked_until < v_now)
              OR (status = 'locked' AND locked_by_user_id = p_user_id)
          )
        RETURNING seat_number
    )
    SELECT array_agg(seat_number) INTO locked_seats FROM locked_rows;

    v_locked_count := coalesce(array_length(locked_seats, 1), 0);

    IF v_locked_count = v_target_count THEN
        RETURN QUERY SELECT TRUE, locked_seats, 'Seats successfully reserved for counter session'::TEXT;
    ELSE
        -- If some seats could not be locked, release any seats we touched to maintain atomicity
        UPDATE public.trip_seats
        SET status = 'available',
            locked_by_counter_id = NULL,
            locked_by_user_id = NULL,
            locked_at = NULL,
            locked_until = NULL
        WHERE trip_id = p_trip_id
          AND seat_number = ANY(locked_seats)
          AND locked_by_user_id = p_user_id;

        RETURN QUERY SELECT FALSE, ARRAY[]::TEXT[], 'One or more requested seats were just taken by another counter'::TEXT;
    END IF;
END;
$$;

-- Function 2: Release Seat Lock
CREATE OR REPLACE FUNCTION public.release_seats_atomic(
    p_trip_id UUID,
    p_seat_numbers TEXT[],
    p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.trip_seats
    SET status = 'available',
        locked_by_counter_id = NULL,
        locked_by_user_id = NULL,
        locked_at = NULL,
        locked_until = NULL,
        updated_at = TIMEZONE('utc', NOW())
    WHERE trip_id = p_trip_id
      AND seat_number = ANY(p_seat_numbers)
      AND (locked_by_user_id = p_user_id OR p_user_id IS NULL);

    RETURN TRUE;
END;
$$;

-- Function 3: Background Seat Lock Expiry Sweeper
CREATE OR REPLACE FUNCTION public.cleanup_expired_seat_locks()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INT;
BEGIN
    WITH released AS (
        UPDATE public.trip_seats
        SET status = 'available',
            locked_by_counter_id = NULL,
            locked_by_user_id = NULL,
            locked_at = NULL,
            locked_until = NULL,
            updated_at = TIMEZONE('utc', NOW())
        WHERE status = 'locked'
          AND locked_until < TIMEZONE('utc', NOW())
        RETURNING id
    )
    SELECT count(*) INTO v_count FROM released;
    RETURN v_count;
END;
$$;
