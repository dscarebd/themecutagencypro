DROP POLICY IF EXISTS "Team images are publicly visible by path" ON storage.objects;

CREATE POLICY "Team profile images are publicly visible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'team-images' AND (storage.foldername(name))[1] = 'team');