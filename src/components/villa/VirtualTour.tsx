import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, Maximize, MessageCircle, Minimize, Play, RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dict, Lang } from "./i18n";
import { img } from "./images";
import { trackVirtualTourOpen, VIRTUAL_TOUR_URL, VIRTUAL_TOUR_SHARE_URL } from "./virtual-tour";

type Props = { t: Dict; lang: Lang; visitUrl: string };
type State = "preview" | "loading" | "loaded" | "unavailable";

export function VirtualTour({ t, lang, visitUrl }: Props) {
  const copy = t.virtualTour;
  const [state, setState] = useState<State>("preview");
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const viewer = useRef<HTMLDivElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    setFullscreenAvailable(Boolean(document.fullscreenEnabled));
    const update = () => setFullscreen(document.fullscreenElement === viewer.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  useEffect(() => {
    if (state !== "loading") return;
    const timeout = window.setTimeout(() => setState("unavailable"), 20000);
    return () => window.clearTimeout(timeout);
  }, [state]);

  const start = () => {
    if (!tracked.current) {
      tracked.current = true;
      try { trackVirtualTourOpen(window, lang); } catch { /* Analytics must never block the tour. */ }
    }
    setState("loading");
    window.requestAnimationFrame(() => closeButton.current?.focus({ preventScroll: true }));
  };

  const close = async () => {
    if (document.fullscreenElement === viewer.current) await document.exitFullscreen().catch(() => undefined);
    setState("preview");
    window.requestAnimationFrame(() => startButton.current?.focus({ preventScroll: true }));
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === viewer.current) await document.exitFullscreen();
      else await viewer.current?.requestFullscreen();
    } catch { setFullscreenAvailable(false); }
  };

  return (
    <section id="visite-virtuelle" aria-labelledby="virtual-tour-title" className="scroll-mt-6 bg-ivory px-5 pb-24 pt-12 md:px-12 md:pb-40 md:pt-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 border-t pt-10 md:mb-14 md:pt-14">
          <p data-fade className="eyebrow mb-6 text-swiss-red">{copy.label}</p>
          <h2 id="virtual-tour-title" className="max-w-4xl font-serif text-4xl font-light leading-[1.08] sm:text-5xl md:text-7xl">
            <span data-lines className="line-mask"><span>{copy.title}</span></span>
          </h2>
          <p data-fade className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/80">{copy.description}</p>
        </div>

        <div ref={viewer} className="flex flex-col bg-stone text-charcoal [&:fullscreen]:h-full [&:fullscreen]:w-full" onKeyDown={(event) => { if (event.key === "Escape" && !fullscreen && state !== "preview") void close(); }}>
          {state !== "preview" && (
            <div className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b px-3 py-2 md:px-5">
              <span className="text-base">360° · GoThru</span>
              <div className="flex items-center gap-1">
                {fullscreenAvailable && <Button variant="ghost" size="icon" className="size-11" onClick={toggleFullscreen} aria-label={fullscreen ? copy.exitFullscreen : copy.fullscreen} title={fullscreen ? copy.exitFullscreen : copy.fullscreen}>{fullscreen ? <Minimize /> : <Maximize />}</Button>}
                <Button asChild variant="ghost" size="icon" className="size-11"><a href={VIRTUAL_TOUR_SHARE_URL} target="_blank" rel="noopener noreferrer" aria-label={copy.external} title={copy.external}><ArrowUpRight /></a></Button>
                <Button ref={closeButton} variant="ghost" size="icon" className="size-11" onClick={() => void close()} aria-label={copy.close} title={copy.close}><X /></Button>
              </div>
            </div>
          )}
          <div className={`relative min-h-0 w-full ${fullscreen ? "flex-1" : "h-[clamp(420px,65svh,500px)] md:h-[600px]"}`}>
            {state === "preview" ? (
              <>
                <img {...photo(img.living)} alt={t.galleryAlts[0]} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center px-5">
                  <div className="flex max-w-full flex-col items-center gap-5 bg-ivory/95 px-5 py-7 text-center md:px-10">
                    <span aria-hidden="true" className="flex items-center gap-2 font-serif text-3xl text-swiss-red"><RotateCw className="size-6" />360°</span>
                    <Button ref={startButton} onClick={start} className="h-auto min-h-14 max-w-full gap-3 whitespace-normal bg-swiss-red px-5 py-4 text-base text-ivory hover:bg-swiss-red/90"><Play aria-hidden="true" />{copy.start}</Button>
                  </div>
                </div>
              </>
            ) : state === "unavailable" ? (
              <div role="alert" className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
                <p className="max-w-lg text-lg leading-relaxed">{copy.unavailable}</p>
                <Button variant="outline" onClick={() => setState("loading")} className="h-auto min-h-12 whitespace-normal py-3 text-base"><RotateCw />{copy.retry}</Button>
                <Button asChild variant="link" className="h-auto min-h-12 whitespace-normal text-base"><a href={VIRTUAL_TOUR_SHARE_URL} target="_blank" rel="noopener noreferrer">{copy.external}<ArrowUpRight /></a></Button>
              </div>
            ) : (
              <>
                <iframe src={VIRTUAL_TOUR_URL} title={copy.frameTitle} allow="fullscreen; gyroscope; accelerometer" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" data-lenis-prevent className="h-full w-full border-0" onLoad={() => setState((current) => current === "loading" ? "loaded" : current)} onError={() => setState("unavailable")} />
                {state === "loading" && <div role="status" className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 bg-stone text-base"><LoaderCircle aria-hidden="true" className="size-5 animate-spin motion-reduce:animate-none" />{copy.loading}</div>}
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 border-b pb-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-base leading-relaxed text-charcoal/75">{copy.privacy}</p>
            <Button asChild variant="link" className="mt-2 h-auto min-h-11 justify-start whitespace-normal px-0 text-left text-base text-swiss-red"><a href={VIRTUAL_TOUR_SHARE_URL} target="_blank" rel="noopener noreferrer">{copy.external}<ArrowUpRight /></a></Button>
          </div>
          <Button asChild className="h-auto min-h-14 shrink-0 gap-3 whitespace-normal bg-swiss-red px-6 py-4 text-base text-ivory hover:bg-swiss-red/90"><a href={visitUrl} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />{copy.viewing}</a></Button>
        </div>
      </div>
    </section>
  );
}