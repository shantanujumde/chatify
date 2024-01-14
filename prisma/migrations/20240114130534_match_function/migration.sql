-- drop function match_page_sections;

create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  "fileId" float,
  deleted boolean,
  name text,
  "fileContent" text,
  similarity float
)
language sql stable
as $$
  select
    "Embeddings".id,
    "Embeddings".content,
    "Embeddings"."fileId",
    "File".deleted,
    "File".name,
    "File".content as "fileContent",
    1 - ("Embeddings".embedding <=> query_embedding) as similarity
  from"Embeddings", "File" 
  where "Embeddings".embedding <=> query_embedding < 1 - match_threshold
  and "Embeddings"."fileId" = "File"."id" 

  order by "Embeddings".embedding <=> query_embedding
  limit match_count;
$$;


-- create or replace function get_page_parents(page_id bigint)
-- returns table (id bigint, parent_page_id bigint, path text, meta jsonb)
-- language sql
-- as $$
--   with recursive chain as (
--     select *
--     from page 
--     where id = page_id

--     union all

--     select child.*
--       from page as child
--       join chain on chain.parent_page_id = child.id 
--   )
--   select id, parent_page_id, path, meta
--   from chain;
-- $$;