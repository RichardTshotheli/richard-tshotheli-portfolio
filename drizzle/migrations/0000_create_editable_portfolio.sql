CREATE TABLE public.portfolio_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE DEFAULT 'main',
  owner_id UUID,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_content TO authenticated;
GRANT ALL ON public.portfolio_content TO service_role;
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio is publicly readable"
ON public.portfolio_content FOR SELECT
TO anon, authenticated
USING (true);
CREATE POLICY "Signed-in owner can create portfolio"
ON public.portfolio_content FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());
CREATE POLICY "First editor can claim or owner can update portfolio"
ON public.portfolio_content FOR UPDATE
TO authenticated
USING (owner_id IS NULL OR owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner can delete portfolio"
ON public.portfolio_content FOR DELETE
TO authenticated
USING (owner_id = auth.uid());