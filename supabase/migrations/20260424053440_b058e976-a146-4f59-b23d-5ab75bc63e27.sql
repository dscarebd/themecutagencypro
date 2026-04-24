CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  image_url TEXT NOT NULL CHECK (char_length(image_url) <= 1000),
  role TEXT NOT NULL CHECK (char_length(role) BETWEEN 1 AND 120),
  skills TEXT[] NOT NULL DEFAULT '{}',
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 40),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  bio TEXT NOT NULL CHECK (char_length(bio) BETWEEN 1 AND 1200),
  review TEXT NOT NULL CHECK (char_length(review) BETWEEN 1 AND 600),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are public"
ON public.team_members
FOR SELECT
USING (true);

CREATE POLICY "No-login admin can create team members"
ON public.team_members
FOR INSERT
WITH CHECK (true);

CREATE POLICY "No-login admin can edit team members"
ON public.team_members
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "No-login admin can remove team members"
ON public.team_members
FOR DELETE
USING (true);

CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT CHECK (display_name IS NULL OR char_length(display_name) <= 120),
  avatar_url TEXT CHECK (avatar_url IS NULL OR char_length(avatar_url) <= 1000),
  bio TEXT CHECK (bio IS NULL OR char_length(bio) <= 800),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are visible to everyone"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_team_members_slug ON public.team_members(slug);
CREATE INDEX idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);