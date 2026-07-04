
-- 1. Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS member_type text NOT NULL DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS institution text,
  ADD COLUMN IF NOT EXISTS designation text;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_member_type_check
  CHECK (member_type IN ('student','alumni','teacher'));

-- 2. Update handle_new_user to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, real_email, roll_no, reg_no, department, session, hall, upazila, member_type, institution, designation, is_alumni)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'roll_no',
    NEW.raw_user_meta_data->>'reg_no',
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'session',
    NEW.raw_user_meta_data->>'hall',
    NEW.raw_user_meta_data->>'upazila',
    COALESCE(NEW.raw_user_meta_data->>'member_type', 'student'),
    NEW.raw_user_meta_data->>'institution',
    NEW.raw_user_meta_data->>'designation',
    COALESCE((NEW.raw_user_meta_data->>'is_alumni')::boolean, false)
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member')
  ON CONFLICT DO NOTHING;

  IF lower(NEW.email) IN ('rujhenaidah6@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'district_admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END; $function$;

-- 3. committee_positions
CREATE TABLE public.committee_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL CHECK (level IN ('district','upazila')),
  upazila text,
  position_title text NOT NULL,
  holder_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  holder_name text,
  term_start date,
  term_end date,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.committee_positions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.committee_positions TO authenticated;
GRANT ALL ON public.committee_positions TO service_role;

ALTER TABLE public.committee_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "committee public read" ON public.committee_positions FOR SELECT USING (true);
CREATE POLICY "district admin manage committee" ON public.committee_positions FOR ALL
  USING (public.has_role(auth.uid(), 'district_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'district_admin'));
CREATE POLICY "upazila admin manage own committee" ON public.committee_positions FOR ALL
  USING (level = 'upazila' AND upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila))
  WITH CHECK (level = 'upazila' AND upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila));

CREATE TRIGGER trg_committee_positions_updated_at BEFORE UPDATE ON public.committee_positions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. upazila_info
CREATE TABLE public.upazila_info (
  upazila text PRIMARY KEY,
  intro text,
  cover_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.upazila_info TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.upazila_info TO authenticated;
GRANT ALL ON public.upazila_info TO service_role;

ALTER TABLE public.upazila_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "upazila_info public read" ON public.upazila_info FOR SELECT USING (true);
CREATE POLICY "district admin manage upazila_info" ON public.upazila_info FOR ALL
  USING (public.has_role(auth.uid(), 'district_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'district_admin'));
CREATE POLICY "upazila admin manage own info" ON public.upazila_info FOR ALL
  USING (public.is_upazila_admin_for(auth.uid(), upazila))
  WITH CHECK (public.is_upazila_admin_for(auth.uid(), upazila));

CREATE TRIGGER trg_upazila_info_updated_at BEFORE UPDATE ON public.upazila_info
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. alumni_manual
CREATE TABLE public.alumni_manual (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  department text,
  session text,
  hall text,
  upazila text NOT NULL,
  current_position text,
  avatar_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.alumni_manual TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alumni_manual TO authenticated;
GRANT ALL ON public.alumni_manual TO service_role;

ALTER TABLE public.alumni_manual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alumni_manual public read" ON public.alumni_manual FOR SELECT USING (true);
CREATE POLICY "district admin manage alumni_manual" ON public.alumni_manual FOR ALL
  USING (public.has_role(auth.uid(), 'district_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'district_admin'));
CREATE POLICY "upazila admin manage own alumni_manual" ON public.alumni_manual FOR ALL
  USING (public.is_upazila_admin_for(auth.uid(), upazila))
  WITH CHECK (public.is_upazila_admin_for(auth.uid(), upazila));

CREATE TRIGGER trg_alumni_manual_updated_at BEFORE UPDATE ON public.alumni_manual
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. Make profiles publicly readable for member directory (safe columns only via app; RLS allows read)
DROP POLICY IF EXISTS "profiles public read" ON public.profiles;
CREATE POLICY "profiles public read" ON public.profiles FOR SELECT USING (true);
