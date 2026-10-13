import { useRef, useState } from "react";
import { Play } from "lucide-react";
import type { dict } from "./i18n";
import film1080 from "@/assets/villars-film-1080.mp4.asset.json";
import film720 from "@/assets/villars-film-720.mp4.asset.json";
import poster from "@/assets/villars-film-poster.jpg.asset.json";

type T = (typeof dict)["fr"];

export function FilmSection({ t }: { t: T }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => ref.current?.play().catch(() => {}));
  };

  return (
    <section id="film" className="bg-swiss-red px-5 py-20 md:px-12 md:py-32">
      <div className="mb-8 md:mb-12">
        <p className="eyebrow text-ivory/90">{t.filmKicker}</p>
        <h2 className="mt-4 font-serif text-5xl leading-[1.05] text-ivory md:text-7xl">
          {t.filmTitle.map((l) => (
            <span key={l} className="block">{l}</span>
          ))}
        </h2>
      </div>
      <div className="relative aspect-video w-full overflow-hidden bg-charcoal">
        <video
          ref={ref}
          className="h-full w-full object-cover"
          poster={poster.url}
          controls={playing}
          playsInline
          preload="none"
          onEnded={() => setPlaying(false)}
        >
          <source src={film720.url} type="video/mp4" media="(max-width: 767px)" />
          <source src={film1080.url} type="video/mp4" />
        </video>
        {!playing && (
          <button
            type="button"
            onClick={play}
            aria-label={t.filmPlay}
            className="absolute inset-0 flex items-center justify-center gap-4 bg-charcoal/25 text-ivory transition-colors hover:bg-charcoal/10"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ivory/80 md:h-20 md:w-20">
              <Play className="ml-1 h-6 w-6 fill-current md:h-7 md:w-7" />
            </span>
            <span className="eyebrow hidden text-ivory sm:inline">{t.filmPlay}</span>
          </button>
        )}
      </div>
    </section>
  );
}
