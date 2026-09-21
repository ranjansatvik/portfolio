"use client";

import { useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chatbot/types";

const SUGGESTIONS = [
  "What did you build CryptoCast with?",
  "What's your backend experience?",
  "What guardrails does this chatbot have?",
];

export default function AiChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const assistantTextRef = useRef("");

  async function sendMessage(overrideText?: string) {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Request failed." }));
        throw new Error(data.error ?? "Request failed.");
      }
      if (!res.body) throw new Error("No response body.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      assistantTextRef.current = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantTextRef.current += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: assistantTextRef.current },
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="ask-my-ai" className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">Ask My AI</p>
      <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
        Ask about Satvik
      </h2>
      <p className="mt-2 max-w-lg text-sm text-zinc-400">
        A RAG pipeline over my resume and project history — Voyage embeddings, Supabase
        pgvector, Claude. Answers are grounded in that context only.
      </p>

      <div className="mt-8 flex flex-col overflow-hidden rounded-2xl border border-border bg-panel">
        <div className="flex max-h-96 min-h-64 flex-col gap-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col justify-end gap-2">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600">
                Try asking
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    disabled={isLoading}
                    className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-zinc-400 transition hover:border-accent/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-accent text-black"
                      : "border border-border bg-background text-zinc-200"
                  }`}
                >
                  {message.content || (isLoading && i === messages.length - 1 ? "…" : "")}
                </p>
              </div>
            ))
          )}
          {error && (
            <p role="alert" className="font-mono text-xs text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-border px-4 py-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask a question about Satvik's background"
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading}
            className="shrink-0 rounded-full bg-accent px-4 py-2 text-xs font-medium text-black transition hover:brightness-110 disabled:opacity-50"
          >
            {isLoading ? "Thinking…" : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
}
