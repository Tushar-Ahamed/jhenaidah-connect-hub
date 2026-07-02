
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('district_admin','upazila_admin','member');
CREATE TYPE public.content_level AS ENUM ('district','upazila');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  roll_no TEXT UNIQUE,
  reg_no TEXT,
  full_name TEXT NOT NULL DEFAULT '',
  real_email TEXT,
  phone TEXT,
  department TEXT,
  session TEXT,
  hall TEXT,
  upazila TEXT,
  avatar_url TEXT,
  is_alumni BOOLEAN NOT NULL DEFAULT false,
  current_position TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  upazila TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, upazila)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============ has_role() ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_upazila_admin_for(_user_id UUID, _upazila TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'upazila_admin' AND upazila = _upazila
  );
$$;

-- ============ TIMESTAMP TRIGGER ============
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ handle_new_user ============
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, real_email, roll_no, reg_no, department, session, hall, upazila)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'roll_no',
    NEW.raw_user_meta_data->>'reg_no',
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'session',
    NEW.raw_user_meta_data->>'hall',
    NEW.raw_user_meta_data->>'upazila'
  )
  ON CONFLICT (id) DO NOTHING;

  -- default member role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member')
  ON CONFLICT DO NOTHING;

  -- bootstrap district admin
  IF lower(NEW.email) IN ('rujhenaidah6@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'district_admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ PROFILES POLICIES ============
CREATE POLICY "profiles readable by all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "user updates own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "district admin updates any profile" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'district_admin'))
  WITH CHECK (public.has_role(auth.uid(),'district_admin'));
CREATE POLICY "district admin deletes profile" ON public.profiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'district_admin'));

-- ============ USER_ROLES POLICIES ============
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'district_admin'));
CREATE POLICY "district admin manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'district_admin'))
  WITH CHECK (public.has_role(auth.uid(),'district_admin'));

-- ============ NOTICES ============
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  event_date DATE,
  level public.content_level NOT NULL DEFAULT 'district',
  upazila TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notices TO authenticated;
GRANT ALL ON public.notices TO service_role;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_notices_updated BEFORE UPDATE ON public.notices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "notices public read" ON public.notices FOR SELECT USING (true);
CREATE POLICY "district admin manage notices" ON public.notices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'district_admin'))
  WITH CHECK (public.has_role(auth.uid(),'district_admin'));
CREATE POLICY "upazila admin insert notice" ON public.notices FOR INSERT TO authenticated
  WITH CHECK (level = 'upazila' AND upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila));
CREATE POLICY "upazila admin update notice" ON public.notices FOR UPDATE TO authenticated
  USING (level = 'upazila' AND upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila))
  WITH CHECK (level = 'upazila' AND upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila));
CREATE POLICY "upazila admin delete notice" ON public.notices FOR DELETE TO authenticated
  USING (level = 'upazila' AND upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila));

-- ============ EVENTS ============
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  event_date DATE,
  venue TEXT,
  level public.content_level NOT NULL DEFAULT 'district',
  upazila TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "events public read" ON public.events FOR SELECT USING (true);
CREATE POLICY "district admin manage events" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'district_admin'))
  WITH CHECK (public.has_role(auth.uid(),'district_admin'));
CREATE POLICY "upazila admin insert event" ON public.events FOR INSERT TO authenticated
  WITH CHECK (level = 'upazila' AND upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila));
CREATE POLICY "upazila admin update event" ON public.events FOR UPDATE TO authenticated
  USING (level = 'upazila' AND upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila))
  WITH CHECK (level = 'upazila' AND upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila));
CREATE POLICY "upazila admin delete event" ON public.events FOR DELETE TO authenticated
  USING (level = 'upazila' AND upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila));

-- ============ GALLERY ============
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  upazila TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery public read" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "district admin manage gallery" ON public.gallery FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'district_admin'))
  WITH CHECK (public.has_role(auth.uid(),'district_admin'));
CREATE POLICY "upazila admin insert gallery" ON public.gallery FOR INSERT TO authenticated
  WITH CHECK (upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila));
CREATE POLICY "upazila admin delete gallery" ON public.gallery FOR DELETE TO authenticated
  USING (upazila IS NOT NULL AND public.is_upazila_admin_for(auth.uid(), upazila));
