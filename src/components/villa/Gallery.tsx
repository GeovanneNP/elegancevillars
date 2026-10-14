import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { galleryImages } from "./images";
import type { Dict } from "./i18n";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const layout = [
  "col-span-12 aspect-[16/9]",
  "col-span-12 aspect-[4/3] md:col-span-10 md:col-start-1 md:aspect-[16/9]",
  "col-span-12 aspect-[4/3] md:col-span-10 md:col-start-3 md:aspect-[16/9]",
  "col-span-12 aspect-[4/3] md:col-span-10 md:col-start-1 md:aspect-[16/9]",
  "col-span-12 aspect-[4/3] md:col-span-10 md:col-start-3 md:aspect-[16/9]",
  "col-span-12 aspect-[16/10]",
  "col-span-12 aspect-[4/3] md:aspect-[21/9]",
];

export function Gallery({ t, visitUrl, onOpenChange }: { t: Dict; visitUrl: string; onOpenChange: (open: boolean) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const reduceMotion = useRef(false);

  useEffect(() => { onOpenChange(open !== null); }, [open, onOpenChange]);

  const move = (e: React.MouseEvent) => {
    if (reduceMotion.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    gsap.to(cursor.current, { x: e.clientX, y: e.clientY, duration: 0.35, ease: "power3.out" });
  };
  const showCursor = (v: boolean) => {
    if (reduceMotion.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    gsap.to(cursor.current, { scale: v ? 1 : 0, duration: 0.35, ease: "power3.out" });
  };

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(cursor.current, { xPercent: -50, yPercent: -50, scale: 0 });
  }, []);
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
    <section id="gallery" className="bg-ivory px-5 py-24 md:px-12 md:py-48" onMouseMove={move}>
      <div className="mb-16 grid grid-cols-1 items-end gap-4 border-b pb-6 sm:grid-cols-[minmax(0,1fr)_auto] md:mb-20">
        <h2 className="min-w-0 break-words font-serif text-5xl font-light sm:text-6xl md:text-9xl">{t.galleryTitle}</h2>
         <span className="eyebrow shrink-0 text-muted-foreground sm:text-right">0{n} — {t.galleryCount}</span>
      </div>
      <div className="grid grid-cols-12 gap-y-8 md:gap-y-20">
        {galleryImages.map((g, i) => (
          <Button
            variant="ghost"
            key={g.src}
            data-gal
            onClick={() => setOpen(i)}
            onMouseEnter={() => showCursor(true)}
            onMouseLeave={() => showCursor(false)}
            className={`group relative h-auto w-full overflow-hidden rounded-none p-0 [@media(hover:hover)_and_(pointer:fine)]:md:cursor-none ${layout[i]}`}
             aria-label={t.galleryAlts[i] ?? g.alt}
          >
             <img src={g.src} alt={t.galleryAlts[i] ?? g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.035]" />
          </Button>
        ))}
      </div>

      <div
        ref={cursor}
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-24 w-24 items-center justify-center rounded-full bg-swiss-red/70 text-ivory shadow-lg shadow-swiss-red/20 backdrop-blur-md md:flex"
      >
        <span className="eyebrow">{t.view}</span>
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-[90] flex animate-fade-in flex-col bg-swiss-red text-ivory" role="dialog" aria-modal>
          <div className="flex items-center justify-between px-6 py-5 md:px-12">
            <span className="eyebrow text-ivory/60">{String(open + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
             <Button variant="ghost" onClick={() => setOpen(null)} className="eyebrow text-ivory hover:text-gold">ESC — {t.galleryClose}</Button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24">
             <img key={open} src={galleryImages[open]?.src} alt={t.galleryAlts[open]} className="max-h-[78vh] w-auto max-w-full animate-scale-in object-contain" />
             <Button variant="ghost" onClick={() => go(-1)} aria-label={t.galleryPrevious} className="absolute left-0 p-3 font-serif text-4xl text-ivory/70 hover:text-ivory md:left-8 md:p-4">←</Button>
             <Button variant="ghost" onClick={() => go(1)} aria-label={t.galleryNext} className="absolute right-0 p-3 font-serif text-4xl text-ivory/70 hover:text-ivory md:right-8 md:p-4">→</Button>
          </div>
           <p className="px-6 pb-4 text-center font-serif text-lg italic text-ivory/70">{t.galleryAlts[open]}</p>
           <Button asChild variant="ghost" className="eyebrow mx-6 mb-[calc(1rem+env(safe-area-inset-bottom))] h-auto min-h-12 gap-3 whitespace-normal text-ivory hover:bg-transparent hover:text-gold"><a href={visitUrl} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" className="size-5 shrink-0" />{t.visitCta}</a></Button>
        </div>
      )}
    </section>
  );
}
