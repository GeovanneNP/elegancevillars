import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Dict } from "./i18n";
import { img } from "./images";

type Props = {
  t: Dict;
  activeSeason: number;
  onSeasonChange: (index: number) => void;
};

const mapPoints = [
  [48, 56], [54, 34], [65, 25], [76, 18], [36, 42],
  [43, 63], [27, 73], [84, 10], [15, 84], [4, 92],
] as const;

const seasonImages = [img.seasons, img.villarsSpring, img.lacChavonnes, img.villarsAutumn];

function AtmosphereCaption({ children }: { children: string }) {
  return <figcaption className="eyebrow mt-3 text-[0.6rem] text-muted-foreground">{children}</figcaption>;
}

export function VillarsLifestyle({ t, activeSeason, onSeasonChange }: Props) {
  const [activeMapPoint, setActiveMapPoint] = useState(0);
  const activeCoordinates = mapPoints[activeMapPoint] ?? [48, 56];

  return (
    <div data-lifestyle>
      <section id="location" className="bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="grid grid-cols-12 gap-6">
          <p data-fade className="eyebrow col-span-12 text-wood md:col-span-3">{t.locationLabel}</p>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <h2 className="font-serif text-6xl font-light leading-[0.9] md:text-8xl lg:text-9xl">
              <span data-lines>{t.locationTitle.map((line) => <span key={line} className="line-mask"><span>{line}</span></span>)}</span>
            </h2>
            <p data-fade className="mt-10 max-w-md text-lg leading-relaxed text-charcoal/80">{t.locationText}</p>
          </div>
        </div>

        <div className="mt-28 border-t md:mt-40">
          <p data-fade className="eyebrow py-6 text-wood">{t.distancesTitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-3">
            {t.distances.map(([place, distance], index) => (
              <div key={place} data-fade className={`border-t py-9 ${index % 2 === 0 ? "pr-5" : "border-l pl-5"} md:border-l md:px-8 ${index % 3 === 0 ? "md:border-l-0 md:pl-0" : ""}`}>
                <p className="font-serif text-4xl font-light tabular-nums md:text-6xl">{distance}</p>
                <p className="eyebrow mt-3 text-muted-foreground">{place}</p>
              </div>
            ))}
          </div>
        </div>

        <div data-mobility className="mt-28 grid grid-cols-12 gap-6 border-t pt-16 md:mt-40 md:pt-24">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow text-wood">{t.distancesTitle}</p>
            <p className="mt-6 font-serif text-4xl italic md:text-5xl">{t.timelineOrigin}</p>
          </div>
          <div className="relative col-span-12 mt-10 md:col-span-6 md:col-start-7 md:mt-0">
            <svg aria-hidden="true" className="absolute left-[5px] top-3 h-[calc(100%-1.5rem)] w-px overflow-visible" viewBox="0 0 1 600" preserveAspectRatio="none">
              <path d="M.5 0 V600" stroke="currentColor" strokeWidth="1" className="text-border" />
              <path data-timeline-path d="M.5 0 V600" stroke="currentColor" strokeWidth="1.5" className="text-wood" />
            </svg>
            <ol className="space-y-0">
              {t.distances.map(([place, distance]) => (
                <li key={place} data-timeline-point className="relative flex min-h-24 items-center justify-between gap-4 border-b pl-10">
                  <span className="absolute left-0 top-1/2 h-[11px] w-[11px] -translate-y-1/2 rounded-full border border-wood bg-ivory transition-transform duration-500" />
                  <span className="font-serif text-2xl md:text-3xl">{place}</span>
                  <span className="eyebrow shrink-0 text-wood">{distance}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-stone px-5 py-32 md:px-12 md:py-48">
        <p data-fade className="eyebrow text-wood">{t.mountainLabel}</p>
        <h2 className="mt-8 max-w-5xl font-serif text-6xl font-light leading-[0.9] md:text-8xl lg:text-9xl">
          <span data-lines>{t.mountainTitle.map((line) => <span key={line} className="line-mask"><span>{line}</span></span>)}</span>
        </h2>
        <div className="mt-24 grid grid-cols-12 gap-6 md:mt-36">
          <figure data-clip className="col-span-12 overflow-hidden md:col-span-8">
            <img src={img.villarsSki} alt={t.imageAlts.ski} loading="lazy" width={1600} height={1072} className="aspect-[3/2] w-full object-cover" />
            <AtmosphereCaption>{t.atmosphereCaption}</AtmosphereCaption>
          </figure>
          <div className="col-span-12 self-end md:col-span-3 md:col-start-10">
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-b pb-6">
              {t.skiPlaces.map((place) => <span key={place} className="eyebrow text-muted-foreground">{place}</span>)}
            </div>
            <p className="mt-8 font-serif text-8xl font-light tabular-nums md:text-9xl">{t.skiStat}</p>
            <p className="eyebrow mt-2 text-wood">{t.skiUnit}</p>
            <p data-fade className="mt-8 max-w-xs text-lg leading-relaxed text-charcoal/80">{t.skiText}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6 bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-5">
          <p data-fade className="eyebrow text-wood">{t.rocLabel}</p>
          <h2 className="mt-8 font-serif text-6xl font-light leading-[0.9] md:text-7xl lg:text-8xl">
            <span data-lines>{t.rocTitle.map((line) => <span key={line} className="line-mask"><span>{line}</span></span>)}</span>
          </h2>
          <p data-fade className="mt-10 max-w-sm text-lg leading-relaxed text-charcoal/80">{t.rocText}</p>
        </div>
        <figure data-clip className="col-span-12 mt-12 overflow-hidden md:col-span-6 md:col-start-7 md:mt-0">
          <img src={img.rocOrsay} alt={t.imageAlts.roc} loading="lazy" width={1600} height={1200} className="aspect-[4/5] w-full object-cover" />
          <AtmosphereCaption>{t.atmosphereCaption}</AtmosphereCaption>
        </figure>
      </section>

      <section data-bretaye className="bg-swiss-red px-5 py-28 text-ivory md:px-12 md:py-40">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center justify-between gap-5">
              <span className="font-serif text-4xl md:text-6xl">{t.bretayeFrom}</span>
              <span className="font-serif text-4xl md:text-6xl">{t.bretayeTo}</span>
            </div>
            <div className="relative mt-8 h-px bg-ivory/30">
              <span data-bretaye-line className="absolute inset-y-0 left-0 w-full origin-left bg-ivory" />
              <span data-bretaye-dot className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-ivory" />
            </div>
          </div>
          <p className="eyebrow col-span-12 text-ivory/70 md:col-span-3 md:col-start-10">{t.bretayeTime}</p>
          <p data-fade className="col-span-12 mt-10 max-w-md text-lg leading-relaxed text-ivory/85 md:col-span-4 md:col-start-7">{t.bretayeText}</p>
        </div>
      </section>

      <section className="bg-ivory px-5 py-32 md:px-12 md:py-52">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <h2 className="font-serif text-6xl font-light leading-none md:text-8xl">{t.lakeTitle}</h2>
            <p className="mt-12 font-serif text-7xl font-light tabular-nums md:text-9xl">{t.lakeStat}</p>
            <p className="mt-5 font-serif text-3xl italic md:text-4xl">{t.lakeText}</p>
            <p data-fade className="eyebrow mt-10 max-w-xs leading-relaxed text-muted-foreground">{t.lakeWalk}</p>
          </div>
          <figure data-clip className="col-span-12 mt-12 overflow-hidden md:col-span-7 md:mt-20">
            <img src={img.lacChavonnes} alt={t.imageAlts.lake} loading="lazy" width={1600} height={1072} className="aspect-[3/2] w-full object-cover" />
            <AtmosphereCaption>{t.atmosphereCaption}</AtmosphereCaption>
          </figure>
        </div>
      </section>

      <section className="relative min-h-[80svh] overflow-hidden bg-swiss-red text-ivory">
        <img src={img.villarsGolf} alt={t.imageAlts.golf} loading="lazy" width={1600} height={1072} className="absolute inset-0 h-full w-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-swiss-red/35" />
        <div className="relative flex min-h-[80svh] flex-col justify-between px-5 py-20 md:px-12 md:py-24">
          <p className="eyebrow text-ivory/80">{t.golfLabel}</p>
          <h2 className="max-w-5xl font-serif text-6xl font-light uppercase leading-[0.88] md:text-8xl lg:text-9xl">
            <span data-lines>{t.golfTitle.map((line) => <span key={line} className="line-mask"><span>{line}</span></span>)}</span>
          </h2>
          <div className="flex flex-col gap-4 border-t border-ivory/30 pt-6 md:flex-row md:items-end md:justify-between">
            <div>{t.golfStats.map((stat) => <p key={stat} className="eyebrow mt-2 text-ivory/80">{stat}</p>)}</div>
            <p className="max-w-sm font-serif text-2xl italic md:text-3xl">{t.golfText}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6 bg-stone px-5 py-32 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-5">
          <h2 className="font-serif text-6xl font-light leading-[0.9] md:text-8xl">
            <span data-lines>{t.wellnessTitle.map((line) => <span key={line} className="line-mask"><span>{line}</span></span>)}</span>
          </h2>
          <div className="mt-16 border-t">
            {t.wellnessItems.map(([name, items]) => (
              <div data-fade key={name} className="border-b py-7">
                <h3 className="font-serif text-3xl">{name}</h3>
                <p className="eyebrow mt-3 leading-relaxed text-muted-foreground">{items}</p>
              </div>
            ))}
          </div>
        </div>
        <figure data-clip className="col-span-12 mt-12 overflow-hidden md:col-span-6 md:col-start-7 md:mt-20">
          <img src={img.villarsWellness} alt={t.imageAlts.wellness} loading="lazy" width={1600} height={1072} className="aspect-[4/5] w-full object-cover" />
          <AtmosphereCaption>{t.atmosphereCaption}</AtmosphereCaption>
        </figure>
      </section>

      <section className="relative min-h-[85svh] overflow-hidden bg-swiss-red text-ivory">
        <img src={img.glacier3000} alt={t.imageAlts.glacier} loading="lazy" width={1600} height={1072} className="absolute inset-0 h-full w-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-swiss-red/30" />
        <div className="relative flex min-h-[85svh] flex-col justify-between px-5 py-20 md:px-12 md:py-24">
          <p className="eyebrow text-ivory/80">{t.beyondLabel}</p>
          <div>
            <h2 className="font-serif text-7xl font-light md:text-9xl">{t.glacierTitle}</h2>
            <p className="mt-6 max-w-3xl font-serif text-4xl font-light leading-none md:text-6xl">{t.glacierHeadline[0]}<br /><span className="italic">{t.glacierHeadline[1]}</span></p>
          </div>
          <div className="grid grid-cols-12 gap-6 border-t border-ivory/30 pt-6">
            <div className="col-span-7 md:col-span-3"><p className="eyebrow text-ivory/70">{t.glacierFeature}</p><p className="mt-3 font-serif text-5xl">{t.glacierStat}</p></div>
            <p className="col-span-12 max-w-sm self-end font-serif text-2xl italic md:col-span-4 md:col-start-8 md:text-3xl">{t.glacierText}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6 bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-6">
          <h2 className="font-serif text-6xl font-light leading-[0.9] md:text-8xl">
            <span data-lines>{t.internationalTitle.map((line) => <span key={line} className="line-mask"><span>{line}</span></span>)}</span>
          </h2>
        </div>
        <div className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:mt-0">
          <p className="font-serif text-9xl font-light tabular-nums">{t.internationalStat}</p>
          <p className="eyebrow mt-2 text-wood">{t.internationalLabel}</p>
          <ol className="mt-12 border-t">
            {t.schools.map((school, index) => <li data-fade key={school} className="flex items-center gap-6 border-b py-5"><span className="eyebrow text-muted-foreground">0{index + 1}</span><span className="font-serif text-2xl">{school}</span></li>)}
          </ol>
        </div>
      </section>

      <section data-seasons className="bg-swiss-red text-ivory md:grid md:grid-cols-12">
        <div className="relative hidden min-h-svh overflow-hidden md:sticky md:top-0 md:col-span-7 md:block md:h-svh">
          {seasonImages.map((src, index) => (
            <img key={src} src={src} alt={[t.imageAlts.seasons, t.imageAlts.spring, t.imageAlts.lake, t.imageAlts.autumn][index]} loading="lazy" width={1920} height={1088} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${activeSeason === index ? "opacity-80" : "opacity-0"}`} />
          ))}
          <div className="absolute inset-0 bg-swiss-red/25" />
          <h2 className="absolute bottom-16 left-12 font-serif text-7xl font-light uppercase leading-[0.88] lg:text-9xl">{t.seasonsTitle[0]}<br />{t.seasonsTitle[1]}</h2>
        </div>
        <div className="md:col-span-5">
          <div className="px-5 py-24 md:hidden">
            <h2 className="font-serif text-6xl font-light uppercase leading-[0.88]">{t.seasonsTitle[0]}<br />{t.seasonsTitle[1]}</h2>
            <p className="mt-8 text-ivory/80">{t.seasonsText}</p>
          </div>
          {t.seasonStates.map(([number, name, activities, copy], index) => (
            <article key={name} data-season-step className="flex min-h-0 flex-col justify-center border-t border-ivory/20 px-5 py-16 md:min-h-[70svh] md:px-12">
              <figure className="mb-8 md:hidden">
                <img src={seasonImages[index]} alt={[t.imageAlts.seasons, t.imageAlts.spring, t.imageAlts.lake, t.imageAlts.autumn][index]} loading="lazy" width={1600} height={1072} className="aspect-[4/3] w-full object-cover" />
                <AtmosphereCaption>{t.atmosphereCaption}</AtmosphereCaption>
              </figure>
              <Button variant="ghost" onClick={() => onSeasonChange(index)} className="h-auto justify-start p-0 text-left text-ivory hover:bg-transparent hover:text-ivory">
                <span className="eyebrow mr-6 text-ivory/50">{number}</span><span className="font-serif text-5xl font-light md:text-6xl">{name}</span>
              </Button>
              <p className="eyebrow mt-8 leading-relaxed text-ivory/65">{activities}</p>
              <p className="mt-5 max-w-sm font-serif text-2xl italic text-ivory/90">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-stone px-5 py-32 md:px-12 md:py-48">
        <div className="grid grid-cols-12 gap-6">
          <h2 className="col-span-12 font-serif text-6xl font-light leading-[0.9] md:col-span-6 md:text-8xl">
            <span data-lines>{t.nearbyTitle.map((line) => <span key={line} className="line-mask"><span>{line}</span></span>)}</span>
          </h2>
          <div className="col-span-12 mt-12 border-t md:col-span-5 md:col-start-8 md:mt-0">
            {t.nearby.map(([place, items]) => <div data-fade key={place} className="border-b py-7"><h3 className="font-serif text-3xl">{place}</h3><p className="eyebrow mt-3 leading-relaxed text-muted-foreground">{items}</p></div>)}
          </div>
        </div>
      </section>

      <section data-editorial-map className="bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <h2 className="font-serif text-6xl font-light leading-none md:text-7xl">{t.mapTitle}</h2>
            <p className="eyebrow mt-8 text-muted-foreground">{t.mapNote}</p>
            <p aria-live="polite" className="mt-14 font-serif text-3xl italic">{t.mapPlaces[activeMapPoint]}</p>
          </div>
          <div data-map className="relative col-span-12 mt-10 aspect-[4/5] md:col-span-7 md:col-start-6 md:mt-0 md:aspect-[16/9]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-charcoal" fill="none" aria-label={t.imageAlts.map}>
              <path data-draw d="M2 89 C18 80 22 70 46 57 S72 28 88 8" stroke="currentColor" strokeWidth=".22" opacity=".25" />
              <path data-draw d="M12 92 C30 77 39 71 48 56 S66 42 82 13" stroke="currentColor" strokeWidth=".18" opacity=".4" />
              <path d={`M48 56 L${activeCoordinates[0]} ${activeCoordinates[1]}`} stroke="currentColor" strokeWidth=".3" strokeDasharray="1 1.5" opacity=".7" />
            </svg>
            {mapPoints.map(([x, y], index) => (
              <Button key={t.mapPlaces[index]} variant="ghost" onMouseEnter={() => setActiveMapPoint(index)} onFocus={() => setActiveMapPoint(index)} onClick={() => setActiveMapPoint(index)} aria-pressed={activeMapPoint === index} className={`absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 hover:bg-transparent ${activeMapPoint === index ? "scale-125 text-swiss-red" : "text-wood"}`} style={{ left: `${x}%`, top: `${y}%` }}>
                <span className="h-2 w-2 rounded-full bg-current" />
                <span className="sr-only">{t.mapPlaces[index]}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}