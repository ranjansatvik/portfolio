export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type DocumentMetadata = {
  source: string;
  section: string;
};

export type RetrievedChunk = {
  id: number;
  content: string;
  metadata: DocumentMetadata;
  similarity: number;
};

export type GuardrailCheckResult =
  | { allowed: true }
  | { allowed: false; reason: string };

export type ChatRequestBody = {
  messages: ChatMessage[];
};
