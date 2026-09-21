const LINKS = [
  { label: "Email", href: "mailto:satvikranjan1@gmail.com", display: "satvikranjan1@gmail.com" },
  { label: "GitHub", href: "https://github.com/ranjansatvik", display: "github.com/ranjansatvik" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/satvik-ranjan",
    display: "linkedin.com/in/satvik-ranjan",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">Get in touch</p>
      <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Let&apos;s build something.
      </h2>

      <a
        href="/resume.pdf"
        download
        className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition hover:brightness-110"
      >
        Download Resume
      </a>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-sm text-zinc-400">
        {LINKS.map((link) => (
          <a key={link.label} href={link.href} className="transition hover:text-accent">
            {link.display}
          </a>
        ))}
      </div>
    </section>
  );
}
