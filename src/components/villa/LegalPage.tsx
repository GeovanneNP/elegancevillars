import { Link } from "@tanstack/react-router";
import logo from "@/assets/brodard-logo.png.asset.json";

type Section = { title: string; paragraphs: string[] };

export function LegalPage({ eyebrow, title, intro, sections, back }: { eyebrow: string; title: string; intro: string; sections: Section[]; back: string }) {
  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-swiss-red px-5 py-4 text-ivory md:px-12">
        <Link to="/" aria-label="Brodard Property" className="w-36 min-w-0 md:w-52"><img src={logo.url} alt="Brodard Property" className="w-full object-contain" /></Link>
        <Link to="/" className="eyebrow border-b border-ivory/40 pb-1 text-ivory">{back}</Link>
      </header>
      <article className="mx-auto max-w-5xl px-5 py-20 md:px-12 md:py-32">
        <p className="eyebrow text-wood">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-[1.02] text-swiss-red sm:text-6xl md:text-8xl">{title}</h1>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-charcoal/75">{intro}</p>
        <div className="mt-16 border-t">
          {sections.map((section) => (
            <section key={section.title} className="grid gap-5 border-b py-10 md:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] md:gap-12">
              <h2 className="font-serif text-3xl text-swiss-red">{section.title}</h2>
              <div className="space-y-4 text-sm leading-relaxed text-charcoal/75">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}