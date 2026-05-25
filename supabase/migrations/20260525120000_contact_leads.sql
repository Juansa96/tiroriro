-- Tabla para guardar leads del formulario de contacto de la web
-- Estos registros son la fuente de datos del CRM
CREATE TABLE public.contact_leads (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT        NOT NULL,
  apellidos   TEXT,
  email       TEXT        NOT NULL,
  telefono    TEXT,
  productos   TEXT        NOT NULL,
  detalles    TEXT,
  config_resumen TEXT,
  origen      TEXT        NOT NULL DEFAULT 'web-contacto',
  estado      TEXT        NOT NULL DEFAULT 'nuevo',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

-- La web puede insertar con la clave anon (formulario público)
CREATE POLICY "Anon puede insertar leads"
  ON public.contact_leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Solo el service role (CRM) puede leer los leads
CREATE POLICY "Service role puede leer leads"
  ON public.contact_leads FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role puede actualizar leads"
  ON public.contact_leads FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Índices para el CRM
CREATE INDEX idx_contact_leads_created ON public.contact_leads (created_at DESC);
CREATE INDEX idx_contact_leads_estado  ON public.contact_leads (estado);
CREATE INDEX idx_contact_leads_email   ON public.contact_leads (email);
