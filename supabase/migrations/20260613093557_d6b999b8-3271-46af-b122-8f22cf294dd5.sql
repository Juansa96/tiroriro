-- Add explicit RLS policies for team_poll_votes (only service role has access via edge function)
CREATE POLICY "Service role can read poll votes"
  ON public.team_poll_votes FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can insert poll votes"
  ON public.team_poll_votes FOR INSERT
  WITH CHECK (auth.role() = 'service_role');