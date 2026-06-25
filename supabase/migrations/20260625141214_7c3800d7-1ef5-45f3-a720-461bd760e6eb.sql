
-- 1. Revoke broad EXECUTE on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role must remain executable by `authenticated` because RLS policies invoke it.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Trigger-only functions: not part of any client API. Revoke from everyone except owner/service_role.
REVOKE EXECUTE ON FUNCTION public.validate_quote_status() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_contact_status() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_admin_grant() FROM PUBLIC, anon, authenticated;

-- 2. Replace permissive WITH CHECK (true) INSERT policies with validated checks.
DROP POLICY IF EXISTS "Anyone can submit a quote request" ON public.quote_requests;
CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(name))  BETWEEN 1 AND 200
    AND length(btrim(email)) BETWEEN 3 AND 320
    AND email LIKE '%_@_%.__%'
    AND (details IS NULL OR length(details) <= 5000)
    AND (company IS NULL OR length(company) <= 200)
    AND (phone IS NULL OR length(phone) <= 50)
    AND (industry IS NULL OR length(industry) <= 200)
    AND (division IS NULL OR length(division) <= 200)
    AND (products IS NULL OR length(products) <= 2000)
    AND (budget IS NULL OR length(budget) <= 100)
    AND (country IS NULL OR length(country) <= 100)
    AND (product_slug IS NULL OR length(product_slug) <= 200)
    AND (product_name IS NULL OR length(product_name) <= 200)
    AND (product_category IS NULL OR length(product_category) <= 200)
    AND (product_url IS NULL OR length(product_url) <= 500)
    AND status = 'new'
    AND admin_notes IS NULL
  );

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(name))    BETWEEN 1 AND 200
    AND length(btrim(email)) BETWEEN 3 AND 320
    AND email LIKE '%_@_%.__%'
    AND length(btrim(message)) BETWEEN 1 AND 5000
    AND (phone IS NULL OR length(phone) <= 50)
    AND (subject IS NULL OR length(subject) <= 300)
    AND status = 'new'
    AND archived = false
  );
