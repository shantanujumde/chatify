import type { Database } from "./supabase.types";

export type File = {
  name: string;
  extension: string;
  date: string;
  content: string;
  length: number;
  tokens: number;
  chunks: FileChunks[];
};

export type FileChunks = {
  name: string;
  extension: string;
  textDate: string;
  content: string;
  contentLength: number;
  contentTokens: number;
  embedding: number[];
};

export type Embeddings = Database["public"]["Tables"]["Embeddings"]["Insert"];
