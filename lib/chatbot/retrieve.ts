import "server-only";
import { supabase } from "@/lib/supabase/client";
import type { RetrievedChunk } from "./types";

const DEFAULT_MATCH_COUNT = 4;

export async function retrieveTopK(
  queryEmbedding: number[],
  k: number = DEFAULT_MATCH_COUNT
): Promise<RetrievedChunk[]> {
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: k,
  });

  if (error) throw error;

  return (data ?? []) as RetrievedChunk[];
}
