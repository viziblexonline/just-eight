-- Confirm admin email + promote to admin
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, timezone('utc', now()))
where email = 'adminviziblex123@online.com';

update public.profiles
set is_admin = true,
    full_name = 'ADMIN'
where id = '0ef95cd8-7ea3-41d4-b6b2-fdf8e2781f24'
   or id = (select id from auth.users where email = 'adminviziblex123@online.com');

select u.email, u.email_confirmed_at, p.full_name, p.is_admin
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'adminviziblex123@online.com';