"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

const PULL = 0.35;
const MAX_OFFSET = 14;

export default function MagneticButton({
  href,
  download,
  className,
  children,
}: {
  href: string;
  download?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    const x = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetX * PULL));
    const y = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetY * PULL));
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }

  return (
    <a
      ref={ref}
      href={href}
      download={download}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-300 ease-out ${className ?? ""}`}
    >
      {children}
    </a>
  );
}
