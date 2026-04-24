INSERT INTO storage.buckets (id, name, public)
VALUES ('team-images', 'team-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Team images are publicly visible" ON storage.objects;
CREATE POLICY "Team images are publicly visible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'team-images');