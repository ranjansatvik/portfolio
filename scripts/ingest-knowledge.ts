// One-off script: chunk content/knowledge/*.md, embed via Voyage AI voyage-3-lite,
// insert into Supabase `documents`. Run with: npm run ingest
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import WebSocket from "ws";

config({ path: path.join(process.cwd(), ".env.local") });

const KNOWLEDGE_DIR = path.join(process.cwd(), "content", "knowledge");
const VOYAGE_MODEL = "voyage-3-lite";
const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";

type Chunk = {
  content: string;
  metadata: { source: string; section: string };
};

function chunkMarkdown(source: string, raw: string): Chunk[] {
  const lines = raw.split("\n");
  const chunks: Chunk[] = [];
  let currentSection = "intro";
  let buffer: string[] = [];

  const flush = () => {
    const content = buffer.join("\n").trim();
    if (content) {
      chunks.push({ content, metadata: { source, section: currentSection } });
    }
    buffer = [];
  };

  for (const line of lines) {
    const heading = /^##\s+(.*)/.exec(line);
    if (heading) {
      flush();
      currentSection = heading[1].trim();
    }
    buffer.push(line);
  }
  flush();

  return chunks;
}

async function embed(texts: string[]): Promise<number[][]> {
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
      input_type: "document",
    }),
  });

  if (!res.ok) {
    throw new Error(`Voyage embed request failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { data: { embedding: number[] }[] };
  return data.data.map((d) => d.embedding);
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  }
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    realtime: { transport: WebSocket as never },
  });

  const files = (await readdir(KNOWLEDGE_DIR)).filter((f) => f.endsWith(".md"));
  if (files.length === 0) {
    console.log(`No .md files found in ${KNOWLEDGE_DIR}`);
    return;
  }

  const allChunks: Chunk[] = [];
  for (const file of files) {
    const raw = await readFile(path.join(KNOWLEDGE_DIR, file), "utf-8");
    allChunks.push(...chunkMarkdown(file, raw));
  }

  console.log(`Chunked ${files.length} file(s) into ${allChunks.length} chunks.`);

  // Voyage's batch limit is generous; a knowledge base this size fits in one request.
  const embeddings = await embed(allChunks.map((c) => c.content));

  const rows = allChunks.map((chunk, i) => ({
    content: chunk.content,
    embedding: embeddings[i],
    metadata: chunk.metadata,
  }));

  const { error } = await supabase.from("documents").insert(rows);
  if (error) throw error;

  console.log(`Inserted ${rows.length} rows into documents.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
