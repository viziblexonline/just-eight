-- Allow larger product / category images (20MB per file).
-- Client also compresses photos before upload.

update storage.buckets
set file_size_limit = 20971520
where id = 'product-images';
