-- Link product images to a color so the storefront can swap galleries.

alter table public.product_images
  add column if not exists color_name text;

create index if not exists product_images_product_color_idx
  on public.product_images (product_id, color_name);
