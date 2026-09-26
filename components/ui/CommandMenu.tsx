"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Command = {
  label: string;
  group: string;
  action: () => void;
};

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function go(hash: string) {
    router.push(window.location.pathname === "/" ? hash : `/${hash}`);
    setOpen(false);
  }

  const commands: Command[] = [
    { label: "Work", group: "Sections", action: () => go("#selected-work") },
    { label: "About", group: "Sections", action: () => go("#experience") },
    { label: "Toolbox", group: "Sections", action: () => go("#toolbox") },
    { label: "Devlog", group: "Sections", action: () => go("#devlog") },
    { label: "Ask My AI", group: "Sections", action: () => go("#ask-my-ai") },
    { label: "Contact", group: "Sections", action: () => go("#contact") },
    {
      label: "CryptoCast",
      group: "Case Studies",
      action: () => {
        router.push("/projects/cryptocast");
        setOpen(false);
      },
    },
    {
      label: "AI Chatbot",
      group: "Case Studies",
      action: () => {
        router.push("/projects/ai-chatbot");
        setOpen(false);
      },
    },
    {
      label: "GitHub",
      group: "Links",
      action: () => {
        window.open("https://github.com/ranjansatvik", "_blank", "noopener,noreferrer");
        setOpen(false);
      },
    },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  function toggleOpen() {
    setQuery("");
    setActiveIndex(0);
    setOpen((prev) => !prev);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleOpen();
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.action();
    }
  }

  if (!open) return null;

  let renderedIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-[#121214] shadow-xl"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Jump to..."
          className="w-full border-b border-border bg-transparent px-4 py-3 font-mono text-sm text-foreground outline-none placeholder:text-zinc-600"
        />
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-3 text-sm text-zinc-500">No matches.</p>
          )}
          {["Sections", "Case Studies", "Links"].map((group) => {
            const items = filtered.filter((c) => c.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <p className="px-4 pt-2 pb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                  {group}
                </p>
                {items.map((c) => {
                  renderedIndex += 1;
                  const isActive = renderedIndex === activeIndex;
                  return (
                    <button
                      key={c.label}
                      onClick={c.action}
                      onMouseEnter={() => setActiveIndex(renderedIndex)}
                      className={`block w-full px-4 py-2 text-left text-sm transition ${
                        isActive ? "bg-accent/10 text-accent" : "text-zinc-300"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
