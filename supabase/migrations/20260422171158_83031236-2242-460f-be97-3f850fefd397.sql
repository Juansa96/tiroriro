-- Tabla de votos de la encuesta del equipo
CREATE TABLE public.team_poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  option_id TEXT NOT NULL CHECK (option_id IN ('inaki-rocio', 'juan-bea')),
  voter_cookie TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  vote_month TEXT NOT NULL, -- formato YYYY-MM
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Un votante (cookie) sólo puede votar una vez por mes
CREATE UNIQUE INDEX idx_team_poll_unique_cookie_month
  ON public.team_poll_votes (voter_cookie, vote_month);

-- Una IP sólo puede votar una vez por mes (refuerzo)
CREATE UNIQUE INDEX idx_team_poll_unique_ip_month
  ON public.team_poll_votes (ip_hash, vote_month);

-- Índice para conteos rápidos por mes
CREATE INDEX idx_team_poll_month_option
  ON public.team_poll_votes (vote_month, option_id);

ALTER TABLE public.team_poll_votes ENABLE ROW LEVEL SECURITY;

-- Lectura pública (todos pueden ver los votos para mostrar recuentos)
CREATE POLICY "Anyone can read poll votes"
  ON public.team_poll_votes
  FOR SELECT
  USING (true);

-- Inserción bloqueada desde cliente: sólo el service role (edge function) puede insertar
-- (No definimos policy de INSERT => por defecto nadie puede insertar con anon key)

-- Vista agregada para consultas rápidas del mes actual
CREATE OR REPLACE VIEW public.team_poll_current_month AS
SELECT
  option_id,
  COUNT(*)::int AS vote_count,
  vote_month
FROM public.team_poll_votes
WHERE vote_month = TO_CHAR(now(), 'YYYY-MM')
GROUP BY option_id, vote_month;

GRANT SELECT ON public.team_poll_current_month TO anon, authenticated;