import "server-only";

const VOYAGE_MODEL = "voyage-3-lite";
const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";

type VoyageInputType = "document" | "query";

async function embedBatch(texts: string[], inputType: VoyageInputType): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) throw new Error("Missing VOYAGE_API_KEY env var");

  const res = await fetch(VOYAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model: VOYAGE_MODEL,
      input_type: inputType,
    }),
  });

  if (!res.ok) {
    throw new Error(`Voyage embed request failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { data: { embedding: number[] }[] };
  return data.data.map((d) => d.embedding);
}

// Ingest path: embeds knowledge-base chunks as documents.
export function embedDocuments(texts: string[]): Promise<number[][]> {
  return embedBatch(texts, "document");
}

// Chat path: embeds a single incoming user query.
export async function embedQuery(text: string): Promise<number[]> {
  const [embedding] = await embedBatch([text], "query");
  return embedding;
}
