import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { galleryImages } from "./images";
import type { Dict } from "./i18n";
import { Button } from "@/components/ui/button";

const layout = [
  "col-span-12 aspect-[16/9]",
  "col-span-12 md:col-span-5 aspect-[4/5]",
  "col-span-12 md:col-span-6 md:col-start-7 md:mt-40 aspect-[4/3]",
  "col-span-6 md:col-span-4 md:col-start-2 aspect-[3/4]",
  "col-span-6 md:col-span-6 md:col-start-6 aspect-[3/4] md:aspect-[4/3]",
  "col-span-12 md:col-span-8 md:col-start-5 aspect-[16/10]",
  "col-span-12 aspect-[21/9]",
];

export function Gallery({ t }: { t: Dict }) {
  const [open, setOpen] = useState<number | null>(null);
  const cursor = useRef<HTMLDivElement>(null);

  const move = (e: React.MouseEvent) => {
    gsap.to(cursor.current, { x: e.clientX, y: e.clientY, duration: 0.35, ease: "power3.out" });
  };
  const showCursor = (v: boolean) => gsap.to(cursor.current, { scale: v ? 1 : 0, duration: 0.35, ease: "power3.out" });

  useEffect(() => { gsap.set(cursor.current, { xPercent: -50, yPercent: -50, scale: 0 }); }, []);
  const n = galleryImages.length;
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.documentElement.style.overflow = "";
    };
  }, [open, go]);

  return (
    <section id="gallery" className="bg-ivory px-5 py-32 md:px-12 md:py-48" onMouseMove={move}>
      <div className="mb-20 flex items-end justify-between border-b pb-6">
        <h2 className="font-serif text-6xl font-light md:text-9xl">{t.galleryTitle}</h2>
         <span className="eyebrow text-muted-foreground">0{n} — {t.galleryCount}</span>
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-8">
        {galleryImages.map((g, i) => (
          <Button
            variant="ghost"
            key={g.src}
            data-gal
            onClick={() => setOpen(i)}
            onMouseEnter={() => showCursor(true)}
            onMouseLeave={() => showCursor(false)}
            className={`group relative h-auto w-full overflow-hidden rounded-none p-0 md:cursor-none ${layout[i]}`}
             aria-label={t.galleryAlts[i] ?? g.alt}
          >
             <img src={g.src} alt={t.galleryAlts[i] ?? g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]" />
          </Button>
        ))}
      </div>

      <div
        ref={cursor}
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-24 w-24 items-center justify-center rounded-full bg-ivory/90 text-charcoal md:flex"
      >
        <span className="eyebrow">{t.view}</span>
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-[90] flex animate-fade-in flex-col bg-ink text-ivory" role="dialog" aria-modal>
          <div className="flex items-center justify-between px-6 py-5 md:px-12">
            <span className="eyebrow text-ivory/60">{String(open + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
             <Button variant="ghost" onClick={() => setOpen(null)} className="eyebrow text-ivory hover:text-gold">ESC — {t.galleryClose}</Button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 md:px-24">
             <img key={open} src={galleryImages[open]?.src} alt={t.galleryAlts[open]} className="max-h-[78vh] w-auto max-w-full animate-scale-in object-contain" />
             <Button variant="ghost" onClick={() => go(-1)} aria-label={t.galleryPrevious} className="absolute left-2 p-4 font-serif text-4xl text-ivory/70 hover:text-ivory md:left-8">←</Button>
             <Button variant="ghost" onClick={() => go(1)} aria-label={t.galleryNext} className="absolute right-2 p-4 font-serif text-4xl text-ivory/70 hover:text-ivory md:right-8">→</Button>
          </div>
           <p className="px-6 pb-8 text-center font-serif text-lg italic text-ivory/70">{t.galleryAlts[open]}</p>
        </div>
      )}
    </section>
  );
}
