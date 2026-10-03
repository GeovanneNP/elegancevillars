CREATE TABLE public.dossier_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  language text NOT NULL CHECK (language IN ('fr', 'en')),
  property_reference text NOT NULL DEFAULT '044598',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.dossier_requests TO service_role;
ALTER TABLE public.dossier_requests ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.dossier_requests IS 'Private direct-sale dossier enquiries; no browser access, submitted through validated server function.';