-- drop function match_page_sections;

create or replace function match_page_sections(embedding vector(1536), match_threshold float, match_count int, min_content_length int)
returns table (id int, title text, text_url text, text_date text, content text, similarity float)
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select
    "Embeddings".id,
    "Embeddings"."title" ,
    "Embeddings"."text_url" ,
    "Embeddings"."text_date" ,
    "Embeddings"."content" ,
    ("Embeddings".embedding <#> embedding) * -1 as similarity
  from "Embeddings"

  -- We only care about sections that have a useful amount of content
 -- where length(page_section.content) >= min_content_length

  -- The dot product is negative because of a Postgres limitation, so we negate it
  where ("Embeddings".embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by "Embeddings".embedding <#> embedding
  
  limit match_count;
end;
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