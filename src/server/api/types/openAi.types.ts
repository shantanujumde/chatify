import type { Database } from "./supabase.types";

export type Text = {
  title: string;
  url: string;
  date: string;
  content: string;
  length: number;
  tokens: number;
  chunks: TextChunks[];
};

export type TextChunks = {
  title: string;
  text_url: string;
  text_date: string;
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};

export type Embeddings = Database["public"]["Tables"]["Embeddings"]["Insert"];
