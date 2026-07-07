
-- Drop all policies that reference the old app_role enum literal 'district_admin'
DROP POLICY IF EXISTS "district admin manage alumni_manual" ON public.alumni_manual;
DROP POLICY IF EXISTS "district admin manage committee" ON public.committee_positions;
DROP POLICY IF EXISTS "district admin manage events" ON public.events;
DROP POLICY IF EXISTS "district admin manage gallery" ON public.gallery;
DROP POLICY IF EXISTS "district admin manage notices" ON public.notices;
DROP POLICY IF EXISTS "district admin updates any profile" ON public.profiles;
DROP POLICY IF EXISTS "district admin deletes profile" ON public.profiles;
DROP POLICY IF EXISTS "district admin manage upazila_info" ON public.upazila_info;
DROP POLICY IF EXISTS "district admin manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "gallery admin insert" ON storage.objects;
DROP POLICY IF EXISTS "gallery admin delete" ON storage.objects;

-- Drop function that pins the old enum signature
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Swap enum
ALTER TYPE public.app_role RENAME TO app_role_old;
CREATE TYPE public.app_role AS ENUM ('super_admin','upazila_admin','committee_admin','member','visitor');
ALTER TABLE public.user_roles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.user_roles ALTER COLUMN role TYPE public.app_role
  USING (CASE role::text WHEN 'district_admin' THEN 'super_admin' ELSE role::text END)::public.app_role;
DROP TYPE public.app_role_old;

-- Recreate role helper functions on the new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role);
$$;

CREATE OR REPLACE FUNCTION public.is_any_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles
    WHERE user_id=_user_id AND role IN ('super_admin','upazila_admin','committee_admin'));
$$;

-- Restore admin policies with super_admin
CREATE POLICY "super admin manage alumni_manual" ON public.alumni_manual FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin manage committee" ON public.committee_positions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin manage events" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin manage gallery" ON public.gallery FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin manage notices" ON public.notices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin manage upazila_info" ON public.upazila_info FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin updates any profile" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin deletes profile" ON public.profiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "gallery admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id='gallery' AND public.is_any_admin(auth.uid()));
CREATE POLICY "gallery admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id='gallery' AND public.is_any_admin(auth.uid()));

-- profiles.status
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='status') THEN
    ALTER TABLE public.profiles ADD COLUMN status text NOT NULL DEFAULT 'active'
      CHECK (status IN ('pending','active','suspended','rejected'));
  END IF;
END $$;

-- Refresh handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, real_email, roll_no, reg_no, department, session, hall, upazila, member_type, institution, designation, is_alumni, status)
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
    COALESCE(NEW.raw_user_meta_data->>'member_type','student'),
    NEW.raw_user_meta_data->>'institution',
    NEW.raw_user_meta_data->>'designation',
    COALESCE((NEW.raw_user_meta_data->>'is_alumni')::boolean, false),
    CASE WHEN lower(NEW.email) = 'rujhenaidah6@gmail.com' THEN 'active' ELSE 'pending' END
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member') ON CONFLICT DO NOTHING;

  IF lower(NEW.email) = 'rujhenaidah6@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Promote existing seed admin
UPDATE public.profiles SET status='active'
  WHERE id IN (SELECT id FROM auth.users WHERE lower(email)='rujhenaidah6@gmail.com');
INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'super_admin'::app_role FROM auth.users WHERE lower(email)='rujhenaidah6@gmail.com'
  ON CONFLICT DO NOTHING;

-- Activity logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own activity readable" ON public.activity_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "insert own activity" ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email text,
  action text NOT NULL,
  target_type text,
  target_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "super_admin reads audit" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "admins insert audit" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid() AND public.is_any_admin(auth.uid()));

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  kind text NOT NULL DEFAULT 'info',
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own notifications" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "update own notifications" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "admins create notifications" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (public.is_any_admin(auth.uid()));
CREATE POLICY "delete own notifications" ON public.notifications FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT ON public.system_settings TO anon, authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings readable" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "super_admin manages settings" ON public.system_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- Storage policies for profile-images and documents
DROP POLICY IF EXISTS "profile-images read" ON storage.objects;
CREATE POLICY "profile-images read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id='profile-images');
DROP POLICY IF EXISTS "profile-images self write" ON storage.objects;
CREATE POLICY "profile-images self write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id='profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "profile-images self update" ON storage.objects;
CREATE POLICY "profile-images self update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id='profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "profile-images self delete" ON storage.objects;
CREATE POLICY "profile-images self delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id='profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "documents admin read" ON storage.objects;
CREATE POLICY "documents admin read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id='documents' AND public.is_any_admin(auth.uid()));
DROP POLICY IF EXISTS "documents admin write" ON storage.objects;
CREATE POLICY "documents admin write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id='documents' AND public.is_any_admin(auth.uid()));
DROP POLICY IF EXISTS "documents admin delete" ON storage.objects;
CREATE POLICY "documents admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id='documents' AND public.is_any_admin(auth.uid()));
