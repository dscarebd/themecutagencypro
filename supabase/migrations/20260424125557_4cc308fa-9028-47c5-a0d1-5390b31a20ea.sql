ALTER TABLE public.team_members
ADD COLUMN address TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.team_members.address IS 'Editable public address/location text for a team member.';