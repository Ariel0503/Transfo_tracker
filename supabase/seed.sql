-- Seed data — multi-region, multi-country, multi-team sample programme.
-- Run after 0001_init.sql.

with r as (
  insert into regions (name) values ('EMEA'), ('APAC'), ('Americas')
  returning id, name
),
c as (
  insert into countries (region_id, name, iso_code)
  select r.id, v.name, v.iso from r
  join (values
    ('EMEA','United Kingdom','GB'),
    ('EMEA','Germany','DE'),
    ('APAC','Singapore','SG'),
    ('Americas','United States','US')
  ) as v(region, name, iso) on v.region = r.name
  returning id, name
),
t as (
  insert into teams (country_id, name)
  select c.id, v.name from c
  join (values
    ('United Kingdom','Order to Cash'),
    ('United Kingdom','Procure to Pay'),
    ('Germany','Record to Report'),
    ('Singapore','Hire to Retire'),
    ('United States','Order to Cash')
  ) as v(country, name) on v.country = c.name
  returning id, name
)
insert into processes (team_id, name, status, progress_pct)
select t.id, v.pname, v.status::health_status, v.pct from t
join (values
  ('Order to Cash','Customer credit check','on_track',82),
  ('Procure to Pay','Supplier onboarding','at_risk',47),
  ('Record to Report','Month-end close','at_risk',38),
  ('Hire to Retire','New-joiner provisioning','on_track',74)
) as v(tname, pname, status, pct) on v.tname = t.name;
