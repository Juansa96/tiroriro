-- Remove public read access to team_poll_votes to avoid exposing voter_cookie and ip_hash.
-- The team-poll-vote edge function uses the service role key and bypasses RLS,
-- so vote counts continue to work via the function.
DROP POLICY IF EXISTS "Anyone can read poll votes" ON public.team_poll_votes;