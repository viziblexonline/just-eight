-- Seed categories + starter products (marked is_demo = true).
-- Replace or deactivate demos once live inventory is added via admin.

insert into public.categories (id, name, description, image_url, sort_order) values
  ('t-shirts', 'T-Shirts', 'Essential tees cut for everyday clarity.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 1),
  ('hoodies', 'Hoodies & Sweatshirts', 'Layered comfort with a refined silhouette.', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 2),
  ('jackets', 'Jackets & Outerwear', 'Structured outer layers for cooler days.', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', 3),
  ('tracksuits', 'Tracksuits', 'Coordinated sets built for movement.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 4),
  ('sportswear', 'Sportswear', 'Performance pieces with a clean aesthetic.', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80', 5),
  ('gloves', 'Gloves', 'Finishing details for cooler climates.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80', 6),
  ('accessories', 'Accessories', 'Small pieces that complete the look.', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 7)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;

-- Seed a few starter products if catalog is empty
do $$
declare
  pid uuid;
begin
  if exists (select 1 from public.products limit 1) then
    return;
  end if;

  insert into public.products (
    slug, name, description, details, care, price, sale_price, category_id,
    stock, featured, new_arrival, best_seller, popularity, is_demo
  ) values (
    'essential-crew-tee',
    'Essential Crew Tee',
    'A clean crewneck tee in heavyweight cotton. Soft hand-feel, structured drape, and a silhouette made for everyday wear.',
    '["240gsm cotton jersey","Relaxed fit with set-in sleeves","Ribbed crew neckline","JUST EIGHT woven label"]'::jsonb,
    '["Machine wash cold","Do not bleach","Tumble dry low","Iron on low"]'::jsonb,
    48, null, 't-shirts', 42, true, true, false, 92, true
  ) returning id into pid;

  insert into public.product_images (product_id, url, sort_order, alt) values
    (pid, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80', 0, 'Essential Crew Tee'),
    (pid, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80', 1, 'Essential Crew Tee alternate');

  insert into public.product_variants (product_id, size, color_name, color_hex, stock) values
    (pid, 'S', 'Black', '#0a0a0a', 10),
    (pid, 'M', 'Black', '#0a0a0a', 12),
    (pid, 'L', 'Black', '#0a0a0a', 10),
    (pid, 'M', 'White', '#ffffff', 10);

  insert into public.products (
    slug, name, description, details, care, price, sale_price, category_id,
    stock, featured, new_arrival, best_seller, popularity, is_demo
  ) values (
    'atelier-hoodie',
    'Atelier Hoodie',
    'A refined fleece hoodie with a quiet presence. Brushed interior, clean seams, and a fit that layers without bulk.',
    '["French terry fleece","Kangaroo pocket","Adjustable drawcord hood","Ribbed cuffs and hem"]'::jsonb,
    '["Machine wash cold","Wash inside out","Do not tumble dry","Reshape while damp"]'::jsonb,
    118, 98, 'hoodies', 28, true, false, true, 98, true
  ) returning id into pid;

  insert into public.product_images (product_id, url, sort_order, alt) values
    (pid, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80', 0, 'Atelier Hoodie');

  insert into public.product_variants (product_id, size, color_name, color_hex, stock) values
    (pid, 'S', 'Black', '#0a0a0a', 8),
    (pid, 'M', 'Black', '#0a0a0a', 10),
    (pid, 'L', 'Charcoal', '#3a3a3a', 10);

  insert into public.products (
    slug, name, description, details, care, price, sale_price, category_id,
    stock, featured, new_arrival, best_seller, popularity, is_demo
  ) values (
    'city-shell-jacket',
    'City Shell Jacket',
    'A lightweight outer layer for transitional weather. Matte finish, minimal hardware, and a tailored but easy cut.',
    '["Water-resistant shell","Two-way front zip","Storm flap collar","Internal pocket"]'::jsonb,
    '["Wipe clean","Do not dry clean","Hang to dry"]'::jsonb,
    186, null, 'jackets', 16, true, true, false, 88, true
  ) returning id into pid;

  insert into public.product_images (product_id, url, sort_order, alt) values
    (pid, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80', 0, 'City Shell Jacket');

  insert into public.product_variants (product_id, size, color_name, color_hex, stock) values
    (pid, 'S', 'Black', '#0a0a0a', 4),
    (pid, 'M', 'Black', '#0a0a0a', 6),
    (pid, 'L', 'Olive', '#4a5240', 6);
end $$;
