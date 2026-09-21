"use client";

// Minimal, unstyled proof that the RAG pipeline works end-to-end.
// Full visual polish happens later in the build sequence (architecture.md Section 6, step 7).
import { useState } from "react";
import type { ChatMessage } from "@/lib/chatbot/types";

export default function AiChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage() {
    const trimmed = input.trim();
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
      let assistantText = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: assistantText }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h2>Ask about Satvik</h2>
      <div>
        {messages.map((message, i) => (
          <p key={i}>
            <strong>{message.role}:</strong> {message.content}
          </p>
        ))}
      </div>
      {error && <p role="alert">{error}</p>}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        placeholder="Ask a question about Satvik's background"
        disabled={isLoading}
      />
      <button onClick={sendMessage} disabled={isLoading}>
        {isLoading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}
