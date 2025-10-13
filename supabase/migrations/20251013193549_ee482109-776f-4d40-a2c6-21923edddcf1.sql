-- Create storage bucket for program images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('program-images', 'program-images', true);

-- Create policies for program image uploads
CREATE POLICY "Program images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'program-images');

CREATE POLICY "Admins can upload program images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'program-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update program images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'program-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete program images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'program-images' AND is_admin(auth.uid()));