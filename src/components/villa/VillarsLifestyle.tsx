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

const mapTiers = ["origin", "local", "local", "accessible", "accessible", "local", "regional", "regional", "beyond", "beyond"] as const;
const seasonImages = [img.rocOrsay, img.lacChavonnesReflection, img.lacChavonnes, img.villarsPanorama] as const;

const photoCredits = {
  villars: { author: "Wouter Hagens", license: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Villars-sur-Ollon_mountains.jpg" },
  roc: { author: "Alexey Filatov", license: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:T%C3%A9l%C3%A9cabine_Roc_d%27Orsay_2000_in_Villars-sur-Ollon.jpg" },
  bretaye: { author: "flybyeigenheer", license: "CC BY-SA 2.0", href: "https://commons.wikimedia.org/wiki/File:BVB_BDeh_2-4_25_zwischen_B%C3%A9vieux-Villars_(29360738720).jpg" },
  lake: { author: "Calimo", license: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Lac_des_Chavonnes.jpg" },
  lakeReflection: { author: "André Mouraux", license: "CC BY 2.0", href: "https://commons.wikimedia.org/wiki/File:Lac_des_Chavonnes_(23730784).jpg" },
  peakWalk: { author: "Zacharie Grossen", license: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Easy_Summit.jpg" },
  aigle: { author: "Falk2", license: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:L03_498_Schloss_Aigle.jpg" },
  chillon: { author: "Christian David", license: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Chillon_viewed_from_south_2021.jpg" },
} as const;

function PhotoCredit({ label, credit }: { label: string; credit: (typeof photoCredits)[keyof typeof photoCredits] }) {
  return <figcaption className="eyebrow mt-3 text-[0.6rem] text-muted-foreground">{label}: <a href={credit.href} target="_blank" rel="noreferrer" className="underline decoration-current/40 underline-offset-4">{credit.author} · {credit.license}</a></figcaption>;
}

export function VillarsLifestyle({ t, activeSeason, onSeasonChange }: Props) {
  const [activeMapPoint, setActiveMapPoint] = useState(1);
  const activeCoordinates = mapPoints[activeMapPoint] ?? [48, 56];

  return (
    <div data-lifestyle>
      <section id="location" className="bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="grid grid-cols-12 gap-6">
          <p data-fade className="eyebrow col-span-12 text-wood md:col-span-3">{t.locationLabel}</p>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <h2 className="font-serif text-6xl font-light leading-[0.9] md:text-8xl lg:text-9xl">
              <span data-lines>{t.locationTitle.map((line, index) => <span key={index} className="line-mask"><span>{line}</span></span>)}</span>
            </h2>
            <p data-fade className="mt-10 max-w-md text-lg leading-relaxed text-charcoal/80">{t.locationText}</p>
          </div>
          <figure data-clip className="col-span-12 mt-16 overflow-hidden md:col-span-10 md:col-start-3 md:mt-24">
            <img src={img.villarsPanorama} alt={t.imageAlts.villars} width={2400} height={854} className="aspect-[16/7] w-full object-cover" />
            <PhotoCredit label={t.photoCredit} credit={photoCredits.villars} />
          </figure>
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
        <p data-fade className="eyebrow text-wood">{t.locationLevel} · {t.mountainLabel}</p>
        <h2 className="mt-8 max-w-5xl font-serif text-6xl font-light leading-[0.9] md:text-8xl lg:text-9xl">
          <span data-lines>{t.mountainTitle.map((line, index) => <span key={index} className="line-mask"><span>{line}</span></span>)}</span>
        </h2>
        <div className="mt-24 grid grid-cols-12 gap-6 md:mt-36">
          <figure data-clip className="col-span-12 overflow-hidden md:col-span-8">
            <img src={img.villarsPanorama} alt={t.imageAlts.villars} loading="lazy" width={2400} height={854} className="aspect-[3/2] w-full object-cover" />
            <PhotoCredit label={t.photoCredit} credit={photoCredits.villars} />
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
          <p data-fade className="eyebrow text-wood">{t.locationLevel} · {t.rocLabel}</p>
          <h2 className="mt-8 font-serif text-6xl font-light leading-[0.9] md:text-7xl lg:text-8xl">
            <span data-lines>{t.rocTitle.map((line, index) => <span key={index} className="line-mask"><span>{line}</span></span>)}</span>
          </h2>
          <p data-fade className="mt-10 max-w-sm text-lg leading-relaxed text-charcoal/80">{t.rocText}</p>
        </div>
        <figure data-clip className="col-span-12 mt-12 overflow-hidden md:col-span-6 md:col-start-7 md:mt-0">
          <img src={img.rocOrsay} alt={t.imageAlts.roc} loading="lazy" width={1600} height={1200} className="aspect-[4/5] w-full object-cover" />
          <PhotoCredit label={t.photoCredit} credit={photoCredits.roc} />
        </figure>
      </section>

      <section data-bretaye className="bg-swiss-red px-5 py-28 text-ivory md:px-12 md:py-40">
        <p className="eyebrow mb-16 text-ivory/65">{t.accessLevel}</p>
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center justify-between gap-5">
              <span className="font-serif text-4xl md:text-6xl">{t.bretayeFrom}</span>
              <span className="font-serif text-4xl md:text-6xl">{t.bretayeTo}</span>
            </div>
            <div data-bretaye-track className="relative mt-8 h-px bg-ivory/30">
              <span data-bretaye-line className="absolute inset-y-0 left-0 w-full origin-left bg-ivory" />
              <span data-bretaye-dot className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory" />
            </div>
          </div>
          <p className="eyebrow col-span-12 text-ivory/70 md:col-span-3 md:col-start-10">{t.bretayeTime}</p>
          <p data-fade className="col-span-12 mt-10 max-w-md text-lg leading-relaxed text-ivory/85 md:col-span-4 md:col-start-7">{t.bretayeText}</p>
          <figure data-clip className="col-span-12 mt-12 md:col-span-8 md:col-start-3">
            <img src={img.bretayeTrain} alt={t.imageAlts.bretaye} loading="lazy" width={2400} height={1600} className="aspect-[3/2] w-full object-cover" />
            <PhotoCredit label={t.photoCredit} credit={photoCredits.bretaye} />
          </figure>
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
            <PhotoCredit label={t.photoCredit} credit={photoCredits.lake} />
          </figure>
          <figure data-clip className="col-span-9 mt-8 overflow-hidden md:col-span-4 md:col-start-2 md:-mt-16">
            <img src={img.lacChavonnesReflection} alt={t.imageAlts.lake} loading="lazy" width={2272} height={1514} className="aspect-[3/2] w-full object-cover" />
            <PhotoCredit label={t.photoCredit} credit={photoCredits.lakeReflection} />
          </figure>
        </div>
      </section>

      <section className="relative min-h-[80svh] overflow-hidden bg-swiss-red text-ivory">
        <div className="relative flex min-h-[80svh] flex-col justify-between px-5 py-20 md:px-12 md:py-24">
          <p className="eyebrow text-ivory/80">{t.accessLevel} · {t.golfLabel}</p>
          <h2 className="max-w-5xl font-serif text-6xl font-light uppercase leading-[0.88] md:text-8xl lg:text-9xl">
            <span data-lines>{t.golfTitle.map((line, index) => <span key={index} className="line-mask"><span>{line}</span></span>)}</span>
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
            <span data-lines>{t.wellnessTitle.map((line, index) => <span key={index} className="line-mask"><span>{line}</span></span>)}</span>
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
        <p className="eyebrow col-span-12 mt-16 border-t pt-6 text-muted-foreground md:col-span-5 md:col-start-8">{t.locationLevel}</p>
      </section>

      <section className="relative min-h-[85svh] overflow-hidden bg-swiss-red text-ivory">
        <img src={img.glacier3000} alt={t.imageAlts.glacier} loading="lazy" width={2400} height={1600} className="absolute inset-0 h-full w-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-swiss-red/30" />
        <div className="relative flex min-h-[85svh] flex-col justify-between px-5 py-20 md:px-12 md:py-24">
          <p className="eyebrow text-ivory/80">{t.regionalLevel}</p>
          <div>
            <h2 className="font-serif text-7xl font-light md:text-9xl">{t.glacierTitle}</h2>
            <p className="mt-6 max-w-3xl font-serif text-4xl font-light leading-none md:text-6xl">{t.glacierHeadline[0]}<br /><span className="italic">{t.glacierHeadline[1]}</span></p>
          </div>
          <div className="grid grid-cols-12 gap-6 border-t border-ivory/30 pt-6">
            <div className="col-span-7 md:col-span-3"><p className="eyebrow text-ivory/70">{t.glacierFeature}</p><p className="mt-3 font-serif text-5xl">{t.glacierStat}</p></div>
            <p className="col-span-12 max-w-sm self-end font-serif text-2xl italic md:col-span-4 md:col-start-8 md:text-3xl">{t.glacierText}</p>
          </div>
          <figure className="mt-8 w-36 md:absolute md:bottom-40 md:right-12 md:w-64">
            <img src={img.peakWalk} alt={t.imageAlts.peakWalk} loading="lazy" width={2400} height={1799} className="aspect-[4/3] w-full object-cover" />
            <PhotoCredit label={t.photoCredit} credit={photoCredits.peakWalk} />
          </figure>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6 bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-6">
          <h2 className="font-serif text-6xl font-light leading-[0.9] md:text-8xl">
            <span data-lines>{t.internationalTitle.map((line, index) => <span key={index} className="line-mask"><span>{line}</span></span>)}</span>
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
          {seasonImages.map((source, index) => (
            <img
              key={source}
              src={source}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${activeSeason === index ? "scale-100 opacity-55" : "scale-[1.025] opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-swiss-red/45" />
          <div className="absolute inset-0 flex items-center justify-center font-serif text-[40vw] font-light text-ivory/10" aria-hidden="true">{String(activeSeason + 1).padStart(2, "0")}</div>
          <div className="absolute inset-x-12 bottom-14">
            <p className="eyebrow mb-5 text-ivory/70">{t.seasonStates[activeSeason]?.[1]}</p>
            <h2 className="font-serif text-7xl font-light uppercase leading-[0.88] lg:text-9xl">{t.seasonsTitle[0]}<br />{t.seasonsTitle[1]}</h2>
            <p className="mt-7 max-w-md font-serif text-2xl italic text-ivory/85">{t.seasonStates[activeSeason]?.[3]}</p>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="px-5 py-24 md:hidden">
            <h2 className="font-serif text-6xl font-light uppercase leading-[0.88]">{t.seasonsTitle[0]}<br />{t.seasonsTitle[1]}</h2>
            <p className="mt-8 text-ivory/80">{t.seasonsText}</p>
          </div>
          {t.seasonStates.map(([number, name, activities, copy], index) => (
            <article key={name} data-season-step className="flex min-h-0 flex-col justify-center border-t border-ivory/20 px-5 py-16 md:min-h-[68svh] md:px-12">
              <img src={seasonImages[index]} alt="" aria-hidden="true" loading="lazy" className="mb-10 aspect-[16/9] w-full object-cover opacity-70 md:hidden" />
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
            <span data-lines>{t.nearbyTitle.map((line, index) => <span key={index} className="line-mask"><span>{line}</span></span>)}</span>
          </h2>
          <div className="col-span-12 mt-12 border-t md:col-span-5 md:col-start-8 md:mt-0">
            {t.nearby.map(([place, items], index) => <div data-fade key={place} className="border-b py-7"><p className="eyebrow mb-4 text-wood">{index < 2 ? t.regionalLevel : t.beyondLevel}</p><h3 className="font-serif text-3xl">{place}</h3><p className="eyebrow mt-3 leading-relaxed text-muted-foreground">{items}</p>{index !== 1 && <figure className="mt-8"><img src={index === 0 ? img.chateauAigle : img.chillonLeman} alt={index === 0 ? t.imageAlts.aigle : t.imageAlts.chillon} loading="lazy" width={2400} height={index === 0 ? 1600 : 1800} className="aspect-[3/2] w-full object-cover" /><PhotoCredit label={t.photoCredit} credit={index === 0 ? photoCredits.aigle : photoCredits.chillon} /></figure>}</div>)}
          </div>
        </div>
      </section>

      <section data-editorial-map className="bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <h2 className="font-serif text-6xl font-light leading-none md:text-7xl">{t.mapTitle}</h2>
            <p className="eyebrow mt-8 text-muted-foreground">{t.mapNote}</p>
            <div className="mt-12 border-t">
              {t.mapPlaces.map((place, index) => (
                <Button
                  key={place}
                  variant="ghost"
                  onMouseEnter={() => setActiveMapPoint(index)}
                  onFocus={() => setActiveMapPoint(index)}
                  onClick={() => setActiveMapPoint(index)}
                  aria-pressed={activeMapPoint === index}
                  className={`flex h-auto w-full justify-between rounded-none border-b px-0 py-3 text-left hover:bg-transparent ${activeMapPoint === index ? "text-swiss-red" : "text-charcoal/65 hover:text-charcoal"}`}
                >
                  <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-xl">{place}</span>
                </Button>
              ))}
            </div>
            <p aria-live="polite" className="mt-8 font-serif text-3xl italic text-swiss-red">{t.mapPlaces[activeMapPoint]}</p>
          </div>
          <div data-map className="relative col-span-12 mt-12 aspect-[4/5] overflow-hidden border-y md:col-span-7 md:col-start-6 md:mt-0 md:aspect-[16/10]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-charcoal" fill="none" role="img" aria-label={t.imageAlts.map}>
              <path d="M3 91 C16 84 22 85 30 91 C37 96 44 97 51 93 C59 88 66 87 74 91 C83 96 91 94 97 88" stroke="currentColor" strokeWidth=".45" opacity=".16" />
              <path d="M-4 79 C13 69 25 72 36 81 C46 89 56 87 65 78 C75 68 87 68 104 76" stroke="currentColor" strokeWidth=".28" opacity=".14" />
              <path d="M-5 67 C12 57 24 58 37 68 C49 77 62 74 71 63 C80 52 92 52 105 59" stroke="currentColor" strokeWidth=".22" opacity=".12" />
              <path d="M-4 54 C10 45 23 44 35 52 C47 60 60 57 70 45 C79 35 92 32 104 37" stroke="currentColor" strokeWidth=".18" opacity=".1" />
              <path d="M-2 42 C13 33 28 31 41 38 C54 45 67 39 78 28 C86 19 94 17 103 18" stroke="currentColor" strokeWidth=".16" opacity=".09" />
              <path d="M0 100 L0 82 C9 79 16 82 23 88 C29 93 29 98 26 100 Z" fill="currentColor" opacity=".055" />
              <path d="M7 94 C24 84 36 77 48 66 S65 39 89 9" stroke="currentColor" strokeWidth=".35" strokeDasharray=".7 1.3" opacity=".28" />
              <path data-draw d="M5 88 C21 79 31 70 47 58 S70 28 91 8" stroke="currentColor" strokeWidth=".28" opacity=".34" />
              <path data-draw d="M13 94 C31 78 40 70 48 56 S67 39 84 12" stroke="currentColor" strokeWidth=".2" opacity=".55" />
              <path d={`M48 56 L${activeCoordinates[0]} ${activeCoordinates[1]}`} stroke="currentColor" strokeWidth=".42" strokeDasharray="1 1.4" opacity=".72" />
              <circle cx="48" cy="56" r="2.4" stroke="currentColor" strokeWidth=".35" opacity=".9" />
              <circle cx="48" cy="56" r=".75" fill="currentColor" />
            </svg>
            {mapPoints.map(([x, y], index) => (
              <Button key={t.mapPlaces[index]} variant="ghost" onMouseEnter={() => setActiveMapPoint(index)} onFocus={() => setActiveMapPoint(index)} onClick={() => setActiveMapPoint(index)} aria-pressed={activeMapPoint === index} className={`group absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 transition-transform hover:bg-transparent focus-visible:ring-2 focus-visible:ring-swiss-red ${activeMapPoint === index ? "z-10 scale-125 text-swiss-red" : "text-charcoal/60"}`} style={{ left: `${x}%`, top: `${y}%` }}>
                <span className={`${mapTiers[index] === "local" || mapTiers[index] === "origin" ? "h-2 w-2 bg-current" : "h-3 w-3 border border-current"} rounded-full`} />
                <span className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-ivory px-1 font-serif text-sm transition-opacity ${index === 0 ? "top-full mt-1" : "bottom-full mb-1"} ${activeMapPoint === index || index === 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>{t.mapPlaces[index]}</span>
                <span className="sr-only">{t.mapPlaces[index]}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}