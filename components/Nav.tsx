import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-sm font-semibold tracking-tight">
          Satvik Ranjan
        </Link>
        <ul className="flex items-center gap-6 font-sans text-sm text-zinc-400">
          <li>
            <a href="#selected-work" className="hover:text-foreground">
              Work
            </a>
          </li>
          <li>
            <a href="#experience" className="hover:text-foreground">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-foreground">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
