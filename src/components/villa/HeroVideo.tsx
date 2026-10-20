import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import film1080 from "@/assets/villars-film-1080.mp4.asset.json";
import film720 from "@/assets/villars-film-720.mp4.asset.json";
import { HERO_POSTER_SRCSET } from "./seo";

/** Same frame as the original JPG poster, re-encoded as WebP (lighter, identical look). */
export const HERO_POSTER = "/hero-poster.webp";

type NetInfo = { saveData?: boolean; effectiveType?: string };

/** No film on data-saver or 2g connections: the poster stays. */
export function shouldLoadFilm(conn: NetInfo | undefined): boolean {
  if (!conn) return true;
  if (conn.saveData) return false;
  return !["slow-2g", "2g"].includes(conn.effectiveType ?? "");
}

export function HeroVideo({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const [muted, setMuted] = useState(true);

  // The poster <img> is the LCP. The film is attached only after the poster has painted,
  // the page has loaded and the browser is idle — and never on data-saver / 2g.
  useEffect(() => {
    const v = ref.current;
    const poster = posterRef.current;
    if (!v || !poster) return;
    if (!shouldLoadFilm((navigator as Navigator & { connection?: NetInfo }).connection)) return;
    let cancelled = false;
    const start = () => {
      if (cancelled || v.src) return;
      v.src = window.matchMedia("(max-width: 767px)").matches ? film720.url : film1080.url;
      v.preload = "auto";
      v.muted = true;
      v.play().catch(() => {});
    };
    const idle = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(start, { timeout: 1500 });
      else setTimeout(start, 200);
    };
    const afterLoad = () => {
      if (document.readyState === "complete") idle();
      else window.addEventListener("load", idle, { once: true });
    };
    // Two frames after the poster is decoded = it has been painted.
    const afterPaint = () => requestAnimationFrame(() => requestAnimationFrame(afterLoad));
    if (poster.complete && poster.naturalWidth) afterPaint();
    else {
      poster.addEventListener("load", afterPaint, { once: true });
      poster.addEventListener("error", afterPaint, { once: true });
    }
    return () => {
      cancelled = true;
      poster.removeEventListener("load", afterPaint);
      poster.removeEventListener("error", afterPaint);
      window.removeEventListener("load", idle);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <>
      <div data-hero-img className="relative h-full w-full">
        <img
          ref={posterRef}
          src={HERO_POSTER}
          srcSet={HERO_POSTER_SRCSET}
          sizes="100vw"
          width={1920}
          height={1080}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          ref={ref}
          width={1920}
          height={1080}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}
          className="relative h-full w-full object-cover"
        />
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Son / Sound" : "Muet / Mute"}
        aria-pressed={!muted}
        className="absolute bottom-2 right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/60 bg-charcoal/25 text-ivory backdrop-blur-md transition-colors hover:bg-charcoal/45 md:bottom-6 md:right-12 md:h-12 md:w-12"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </>
  );
}
