-- Set every product price to £8 and clear sale prices
update public.products
set price = 8,
    sale_price = null;

select name, price, sale_price from public.products order by created_at desc;