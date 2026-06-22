-- Hierarchical product categories and Solar Street Lights subcategories.
-- Safe to run more than once.

alter table public.categories
  add column if not exists parent_id bigint references public.categories(id) on delete restrict;

alter table public.categories
  add column if not exists href text,
  add column if not exists sort_order integer;

create index if not exists categories_parent_id_idx
  on public.categories(parent_id);

create unique index if not exists categories_root_slug_unique
  on public.categories(slug)
  where parent_id is null;

create unique index if not exists categories_parent_slug_unique
  on public.categories(parent_id, slug)
  where parent_id is not null;

do $$
declare
  street_lights_id bigint;
begin
  select id into street_lights_id
  from public.categories
  where lower(name) = 'solar street lights'
     or slug in ('street-lights', 'solar-street-lights')
  order by case when lower(name) = 'solar street lights' then 0 else 1 end
  limit 1;

  if street_lights_id is null then
    raise exception 'Solar Street Lights category was not found';
  end if;

  update public.categories
  set name = 'Solar Street Lights',
      slug = 'solar-street-lights',
      href = '/solar-street-lights'
  where id = street_lights_id;

  -- Adopt matching categories that may already have been created as top-level rows.
  update public.categories
  set parent_id = street_lights_id,
      name = 'All In One Street Lights',
      slug = 'all-in-one',
      href = '/solar-street-lights/all-in-one',
      sort_order = 1
  where id <> street_lights_id
    and parent_id is null
    and (lower(name) = 'all in one street lights' or slug in ('all-in-one', 'all-in-one-street-lights'));

  update public.categories
  set parent_id = street_lights_id,
      name = 'Semi Integrated',
      slug = 'semi-integrated',
      href = '/solar-street-lights/semi-integrated',
      sort_order = 2
  where id <> street_lights_id
    and parent_id is null
    and (lower(name) = 'semi integrated' or slug = 'semi-integrated');

  update public.categories
  set parent_id = street_lights_id,
      name = 'Standalone',
      slug = 'standalone',
      href = '/solar-street-lights/standalone',
      sort_order = 3
  where id <> street_lights_id
    and parent_id is null
    and (lower(name) = 'standalone' or slug = 'standalone');

  update public.categories
  set parent_id = street_lights_id,
      name = 'Luminaire',
      slug = 'luminaire',
      href = '/solar-street-lights/luminaire',
      sort_order = 4
  where id <> street_lights_id
    and parent_id is null
    and (lower(name) = 'luminaire' or slug = 'luminaire');

  insert into public.categories (name, slug, parent_id, href, sort_order, image_url)
  values
    ('All In One Street Lights', 'all-in-one', street_lights_id, '/solar-street-lights/all-in-one', 1, (select image_url from public.categories where id = street_lights_id)),
    ('Semi Integrated', 'semi-integrated', street_lights_id, '/solar-street-lights/semi-integrated', 2, (select image_url from public.categories where id = street_lights_id)),
    ('Standalone', 'standalone', street_lights_id, '/solar-street-lights/standalone', 3, (select image_url from public.categories where id = street_lights_id)),
    ('Luminaire', 'luminaire', street_lights_id, '/solar-street-lights/luminaire', 4, (select image_url from public.categories where id = street_lights_id))
  on conflict (parent_id, slug) where parent_id is not null
  do update set
    name = excluded.name,
    href = excluded.href,
    sort_order = excluded.sort_order;

  update public.products p
  set category_id = c.id
  from public.categories c
  where c.parent_id = street_lights_id
    and c.slug = 'all-in-one'
    and p.category_id in (select id from public.categories where id = street_lights_id or parent_id = street_lights_id)
    and p.name ilike '%All In One%';

  update public.products p
  set category_id = c.id
  from public.categories c
  where c.parent_id = street_lights_id
    and c.slug = 'semi-integrated'
    and p.category_id in (select id from public.categories where id = street_lights_id or parent_id = street_lights_id)
    and p.name ilike '%Semi Integrated%';

  update public.products p
  set category_id = c.id
  from public.categories c
  where c.parent_id = street_lights_id
    and c.slug = 'standalone'
    and p.category_id in (select id from public.categories where id = street_lights_id or parent_id = street_lights_id)
    and p.name ilike '%Standalone%';

  update public.products p
  set category_id = c.id
  from public.categories c
  where c.parent_id = street_lights_id
    and c.slug = 'luminaire'
    and p.category_id in (select id from public.categories where id = street_lights_id or parent_id = street_lights_id)
    and p.name ilike '%Luminaire%';

  -- Pole is intentionally excluded. Preserve any unmatched products at the parent level.
  update public.products p
  set category_id = street_lights_id
  from public.categories c
  where p.category_id = c.id
    and c.parent_id = street_lights_id
    and (lower(c.name) = 'pole' or c.slug = 'pole');

  delete from public.categories
  where parent_id = street_lights_id
    and (lower(name) = 'pole' or slug = 'pole');
end $$;
