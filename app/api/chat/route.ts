import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { embedQuery } from "@/lib/chatbot/embed";
import { retrieveTopK } from "@/lib/chatbot/retrieve";
import { guardrailPreCheck, buildPrompt, SYSTEM_PROMPT } from "@/lib/chatbot/guardrails";
import { isRateLimited } from "@/lib/chatbot/rateLimit";
import type { ChatRequestBody } from "@/lib/chatbot/types";

const CLAUDE_MODEL = "claude-haiku-4-5-20251001";

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  // 1. validate
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), { status: 400 });
  }

  const lastMessage = body.messages?.at(-1);
  if (!lastMessage || lastMessage.role !== "user" || typeof lastMessage.content !== "string") {
    return new Response(JSON.stringify({ error: "Missing user message." }), { status: 400 });
  }
  const query = lastMessage.content;

  // 2. rate-limit (per-IP)
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
      status: 429,
    });
  }

  // 3. guardrail pre-check — runs before any embed or LLM call is spent
  const precheck = guardrailPreCheck(query);
  if (!precheck.allowed) {
    return new Response(JSON.stringify({ error: precheck.reason }), { status: 400 });
  }

  // 4. embed(query)
  const queryEmbedding = await embedQuery(query);

  // 5. retrieveTopK(embedding, k=4)
  const retrievedChunks = await retrieveTopK(queryEmbedding, 4);

  // 6. buildPrompt(guardrailSystemPrompt, retrievedChunks, query)
  const userPrompt = buildPrompt(retrievedChunks, query);

  // 7. Claude Haiku call, streamed
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server is not configured for chat." }), { status: 500 });
  }
  const anthropic = new Anthropic({ apiKey });

  const priorMessages = body.messages.slice(0, -1).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const claudeStream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [...priorMessages, { role: "user" as const, content: userPrompt }],
  });

  // 8. stream response to client
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      claudeStream.on("text", (text) => {
        controller.enqueue(encoder.encode(text));
      });
      claudeStream.on("end", () => controller.close());
      claudeStream.on("error", (err) => controller.error(err));
    },
    cancel() {
      claudeStream.abort();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
