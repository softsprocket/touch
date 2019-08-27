
create table Session (
        ID      text primary key,
        Created timestamptz,
        Updated timestamptz,
        Store   jsonb
)
