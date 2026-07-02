
CREATE POLICY "gallery public read objects" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "gallery admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND (public.has_role(auth.uid(),'district_admin') OR public.has_role(auth.uid(),'upazila_admin')));
CREATE POLICY "gallery admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND (public.has_role(auth.uid(),'district_admin') OR public.has_role(auth.uid(),'upazila_admin')));
