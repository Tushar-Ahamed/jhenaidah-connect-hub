-- Enforce max 2 upazila admins per upazila
CREATE OR REPLACE FUNCTION public.enforce_upazila_admin_limit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'upazila_admin' AND NEW.upazila IS NOT NULL THEN
    IF (
      SELECT count(*) FROM public.user_roles
      WHERE role = 'upazila_admin' AND upazila = NEW.upazila
        AND (TG_OP = 'INSERT' OR id <> NEW.id)
    ) >= 2 THEN
      RAISE EXCEPTION 'এই উপজেলায় ইতিমধ্যে সর্বোচ্চ ২ জন উপজেলা অ্যাডমিন আছেন';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_upazila_admin_limit ON public.user_roles;
CREATE TRIGGER trg_enforce_upazila_admin_limit
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.enforce_upazila_admin_limit();