-- ============================================================================
-- SOHOJ JATRA (সহজ যাত্রা) - Row Level Security (RLS) Policies
-- Strict Multi-Tenant Isolation & Role-Based Access Control
-- ============================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_broadcasts ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- HELPER FUNCTIONS FOR SECURITY CONTEXT
-- ----------------------------------------------------------------------------

-- Check if current user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Get current user's operator_id (Tenant ID)
CREATE OR REPLACE FUNCTION public.current_operator_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT operator_id FROM public.profiles
    WHERE id = auth.uid() LIMIT 1;
$$;

-- Get current user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles
    WHERE id = auth.uid() LIMIT 1;
$$;

-- ----------------------------------------------------------------------------
-- 1. OPERATORS POLICIES
-- ----------------------------------------------------------------------------
-- Super Admin can manage all operators
CREATE POLICY "super_admin_all_operators"
    ON public.operators
    FOR ALL
    TO authenticated
    USING (public.is_super_admin());

-- Operator staff can view their own operator profile
CREATE POLICY "operators_view_own"
    ON public.operators
    FOR SELECT
    TO authenticated
    USING (id = public.current_operator_id());

-- Operator Admin can update their own operator details (slug/license restricted)
CREATE POLICY "operators_update_own"
    ON public.operators
    FOR UPDATE
    TO authenticated
    USING (id = public.current_operator_id() AND public.current_user_role() = 'operator_admin')
    WITH CHECK (id = public.current_operator_id());

-- Public can view active, approved operators (for booking dropdowns & landing pages)
CREATE POLICY "public_view_approved_operators"
    ON public.operators
    FOR SELECT
    TO anon
    USING (is_approved = TRUE);

-- ----------------------------------------------------------------------------
-- 2. COUNTERS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "super_admin_all_counters"
    ON public.counters
    FOR ALL
    TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "operator_manage_counters"
    ON public.counters
    FOR ALL
    TO authenticated
    USING (operator_id = public.current_operator_id())
    WITH CHECK (operator_id = public.current_operator_id());

CREATE POLICY "public_view_active_counters"
    ON public.counters
    FOR SELECT
    TO anon
    USING (is_active = TRUE);

-- ----------------------------------------------------------------------------
-- 3. PROFILES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "super_admin_all_profiles"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "users_view_edit_own_profile"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "operator_view_tenant_staff"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (operator_id = public.current_operator_id());

-- ----------------------------------------------------------------------------
-- 4. FLEET & BUSES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "super_admin_all_buses"
    ON public.buses
    FOR ALL
    TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "operator_manage_buses"
    ON public.buses
    FOR ALL
    TO authenticated
    USING (operator_id = public.current_operator_id())
    WITH CHECK (operator_id = public.current_operator_id());

-- ----------------------------------------------------------------------------
-- 5. ROUTES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "super_admin_all_routes"
    ON public.routes
    FOR ALL
    TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "operator_manage_routes"
    ON public.routes
    FOR ALL
    TO authenticated
    USING (operator_id = public.current_operator_id())
    WITH CHECK (operator_id = public.current_operator_id());

CREATE POLICY "public_view_active_routes"
    ON public.routes
    FOR SELECT
    TO anon
    USING (is_active = TRUE);

-- ----------------------------------------------------------------------------
-- 6. TRIPS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "super_admin_all_trips"
    ON public.trips
    FOR ALL
    TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "operator_manage_trips"
    ON public.trips
    FOR ALL
    TO authenticated
    USING (operator_id = public.current_operator_id())
    WITH CHECK (operator_id = public.current_operator_id());

CREATE POLICY "public_view_scheduled_trips"
    ON public.trips
    FOR SELECT
    TO anon
    USING (status IN ('scheduled', 'boarding'));

-- ----------------------------------------------------------------------------
-- 7. TRIP SEATS POLICIES (Realtime Seat Matrix)
-- ----------------------------------------------------------------------------
CREATE POLICY "super_admin_all_trip_seats"
    ON public.trip_seats
    FOR ALL
    TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "operator_staff_manage_trip_seats"
    ON public.trip_seats
    FOR ALL
    TO authenticated
    USING (
        trip_id IN (
            SELECT id FROM public.trips WHERE operator_id = public.current_operator_id()
        )
    );

CREATE POLICY "public_view_trip_seats"
    ON public.trip_seats
    FOR SELECT
    TO anon
    USING (TRUE);

-- ----------------------------------------------------------------------------
-- 8. BOOKINGS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "super_admin_all_bookings"
    ON public.bookings
    FOR ALL
    TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "operator_manage_bookings"
    ON public.bookings
    FOR ALL
    TO authenticated
    USING (operator_id = public.current_operator_id())
    WITH CHECK (operator_id = public.current_operator_id());

-- Passengers can view their own booking if authenticated
CREATE POLICY "passenger_view_own_bookings"
    ON public.bookings
    FOR SELECT
    TO authenticated
    USING (booked_by_user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 9. AUDIT LOGS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "super_admin_all_audit_logs"
    ON public.audit_logs
    FOR ALL
    TO authenticated
    USING (public.is_super_admin());

CREATE POLICY "operator_view_own_audit_logs"
    ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (operator_id = public.current_operator_id());

-- ----------------------------------------------------------------------------
-- 10. REALTIME PUBLICATION CONFIGURATION
-- ----------------------------------------------------------------------------
-- Add tables to the Supabase Realtime publication so clients can subscribe to live seat locks
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_seats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_broadcasts;
