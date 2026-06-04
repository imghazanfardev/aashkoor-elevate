-- Drop permissive INSERT policies; inserts happen server-side via service role (bypasses RLS)
DROP POLICY IF EXISTS "Anyone can submit quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;

-- Explicitly deny all access to anon and authenticated roles.
-- Service role bypasses RLS and remains able to read/write from server functions.
CREATE POLICY "Deny all access to quote_requests for non-service roles"
  ON public.quote_requests
  AS RESTRICTIVE
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny all access to contact_submissions for non-service roles"
  ON public.contact_submissions
  AS RESTRICTIVE
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);