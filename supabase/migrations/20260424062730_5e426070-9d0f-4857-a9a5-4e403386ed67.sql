DROP POLICY IF EXISTS "Team images are publicly visible" ON storage.objects;

CREATE POLICY "Team images are publicly visible by path"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'team-images' AND name IS NOT NULL);