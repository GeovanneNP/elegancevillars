import { LocationExperience } from "./LocationExperience";
import { Button } from "@/components/ui/button";
import type { Dict } from "./i18n";
import { img } from "./images";

type Props = {
  t: Dict;
  activeSeason: number;
  onSeasonChange: (index: number) => void;
};

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
  bex: { author: "Sandro Senn", license: "CC BY 3.0", href: "https://commons.wikimedia.org/wiki/File:Bex.jpg" },
} as const;

function PhotoCredit({ label, credit }: { label: string; credit: (typeof photoCredits)[keyof typeof photoCredits] }) {
  return <figcaption className="eyebrow mt-3 text-[0.6rem] text-muted-foreground">{label}: <a href={credit.href} target="_blank" rel="noreferrer" className="underline decoration-current/40 underline-offset-4">{credit.author} · {credit.license}</a></figcaption>;
}

export function VillarsLifestyle({ t, activeSeason, onSeasonChange }: Props) {

  return (
    <div data-lifestyle id="location">
      <LocationExperience t={t} />


      <section data-bretaye className="bg-swiss-red px-5 py-28 text-ivory md:px-12 md:py-40">
        <p className="eyebrow mb-16 text-ivory/65">{t.accessLevel}</p>
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center justify-between gap-5">
              <span className="min-w-0 font-serif text-3xl sm:text-4xl md:text-6xl">{t.bretayeFrom}</span>
              <span className="min-w-0 text-right font-serif text-3xl sm:text-4xl md:text-6xl">{t.bretayeTo}</span>
            </div>
            <div data-bretaye-track className="relative mt-8 h-px bg-ivory/30">
              <span data-bretaye-line className="absolute inset-y-0 left-0 w-full origin-left bg-ivory" />
              <span data-bretaye-dot className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory" />
            </div>
          </div>
          <p className="eyebrow col-span-12 text-ivory/70 md:col-span-3 md:col-start-10">{t.bretayeTime}</p>
          <p data-fade className="col-span-12 mt-10 max-w-md text-lg leading-relaxed text-ivory/85 md:col-span-4 md:col-start-7">{t.bretayeText}</p>
          <figure data-clip className="col-span-12 mt-12 md:col-span-8 md:col-start-3">
            <div className="aspect-[3/2] overflow-hidden">
              <img src={img.bretayeTrain} alt={t.imageAlts.bretaye} loading="lazy" width={2400} height={1600} className="h-[108%] w-full object-cover object-top" />
            </div>
            <PhotoCredit label={t.photoCredit} credit={photoCredits.bretaye} />
          </figure>
        </div>
      </section>

      <section className="relative min-h-[80svh] overflow-hidden bg-swiss-red text-ivory">
        <div className="relative flex min-h-[80svh] flex-col justify-between px-5 py-20 md:px-12 md:py-24">
          <p className="eyebrow text-ivory/80">{t.accessLevel} · {t.golfLabel}</p>
          <h2 className="max-w-5xl font-serif text-5xl font-light uppercase leading-[0.92] md:text-8xl md:leading-[0.88] lg:text-9xl">
            <span data-lines>{t.golfTitle.map((line, index) => <span key={index} className="line-mask"><span>{line} </span></span>)}</span>
          </h2>
          <div className="flex flex-col gap-4 border-t border-ivory/30 pt-6 md:flex-row md:items-end md:justify-between">
            <div>{t.golfStats.map((stat) => <p key={stat} className="eyebrow mt-2 normal-case tracking-[0.2em] text-ivory/80">{stat}</p>)}</div>
            <p className="max-w-sm font-serif text-2xl italic md:text-3xl">{t.golfText}</p>
          </div>
        </div>
      </section>

      <section className="relative min-h-[85svh] overflow-hidden bg-swiss-red text-ivory">
        <img src={img.glacier3000} alt={t.imageAlts.glacier} loading="lazy" width={2400} height={1600} className="absolute inset-0 h-full w-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-swiss-red/30" />
        <div className="relative flex min-h-[85svh] flex-col justify-between px-5 py-20 md:px-12 md:py-24">
          <p className="eyebrow text-ivory/80">{t.regionalLevel}</p>
          <div>
            <h2 className="font-serif text-6xl font-light md:text-9xl">{t.glacierTitle}</h2>
            <p className="mt-6 max-w-3xl font-serif text-3xl font-light leading-[1.08] md:text-6xl md:leading-[1.02]">{t.glacierHeadline[0]}<br /><span className="italic">{t.glacierHeadline[1]}</span></p>
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

      <section data-seasons className="bg-swiss-red text-ivory md:grid md:grid-cols-12">
        <div className="relative hidden min-h-svh overflow-hidden md:sticky md:top-0 md:col-span-7 md:block md:h-svh">
          {seasonImages.map((source, index) => (
            <img
              key={source}
              src={source}
              alt={t.imageAlts.seasons[index]}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${activeSeason === index ? "scale-100 opacity-55" : "scale-[1.025] opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-swiss-red/45" />
          <div className="absolute inset-0 flex items-center justify-center font-serif text-[40vw] font-light text-ivory/10" aria-hidden="true">{String(activeSeason + 1).padStart(2, "0")}</div>
          <div className="absolute inset-x-12 bottom-14">
            <p className="eyebrow mb-5 text-ivory/70">{t.seasonStates[activeSeason]?.[1]}</p>
            <h2 className="font-serif text-5xl font-light uppercase leading-[0.88] lg:text-9xl">{t.seasonsTitle[0]}<br />{t.seasonsTitle[1]}</h2>
            <p className="mt-7 max-w-md font-serif text-2xl italic text-ivory/85">{t.seasonStates[activeSeason]?.[3]}</p>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="px-5 py-24 md:hidden">
            <h2 className="font-serif text-5xl font-light uppercase leading-[0.92] sm:leading-[0.88]">{t.seasonsTitle[0]}<br />{t.seasonsTitle[1]}</h2>
            <p className="mt-8 text-ivory/80">{t.seasonsText}</p>
          </div>
          {t.seasonStates.map(([number, name, activities, copy], index) => (
            <article key={name} data-season-step className="flex min-h-0 flex-col justify-center border-t border-ivory/20 px-5 py-16 md:min-h-[68svh] md:px-12">
               <img src={seasonImages[index]} alt={t.imageAlts.seasons[index]} loading="lazy" className="mb-10 aspect-[16/9] w-full object-cover opacity-70 md:hidden" />
              <Button variant="ghost" onClick={() => onSeasonChange(index)} className="h-auto justify-start p-0 text-left text-ivory hover:bg-transparent hover:text-ivory">
                <span className="eyebrow mr-4 shrink-0 text-ivory/50 sm:mr-6">{number}</span><span className="min-w-0 break-words font-serif text-4xl font-light sm:text-5xl md:text-6xl">{name}</span>
              </Button>
              <p className="eyebrow mt-8 leading-relaxed text-ivory/65">{activities}</p>
              <p className="mt-5 max-w-sm font-serif text-2xl italic text-ivory/90">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ivory px-5 pb-32 md:px-12 md:pb-48">
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
                  <span className="eyebrow shrink-0 normal-case tracking-[0.18em] text-wood">{distance}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-stone px-5 py-32 md:px-12 md:py-48">
        <p data-fade className="eyebrow text-wood">{t.locationLevel} · {t.mountainLabel}</p>
        <h2 className="mt-8 max-w-5xl font-serif text-5xl font-light leading-[0.94] text-swiss-red md:text-8xl md:leading-[0.9] lg:text-9xl">
          <span data-lines>{t.mountainTitle.map((line, index) => <span key={index} className="line-mask"><span>{line} </span></span>)}</span>
        </h2>
        <div className="mt-24 grid grid-cols-12 gap-6 md:mt-36">
          <figure data-clip className="col-span-12 overflow-hidden md:col-span-8">
            <img src={img.villarsSki} alt={t.skiImageAlt} loading="lazy" width={1400} height={750} className="aspect-[3/2] w-full object-cover" />
            <figcaption className="eyebrow mt-3 text-[0.6rem] text-muted-foreground">{t.suppliedImage}</figcaption>
          </figure>
          <div className="col-span-12 self-end md:col-span-3 md:col-start-10">
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-b pb-6">
              {t.skiPlaces.map((place) => <span key={place} className="eyebrow text-muted-foreground">{place}</span>)}
            </div>
            <p className="mt-8 font-serif text-6xl font-light tabular-nums md:text-9xl">{t.skiStat}</p>
            <p className="eyebrow mt-2 text-wood">{t.skiUnit}</p>
            <p data-fade className="mt-8 max-w-xs text-lg leading-relaxed text-charcoal/80">{t.skiText}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6 bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-5">
          <p data-fade className="eyebrow text-wood">{t.locationLevel} · {t.rocLabel}</p>
           <h2 className="mt-8 font-serif text-5xl font-light leading-[0.94] text-swiss-red md:text-7xl md:leading-[0.9] lg:text-8xl">
            <span data-lines>{t.rocTitle.map((line, index) => <span key={index} className="line-mask"><span>{line} </span></span>)}</span>
          </h2>
          <p data-fade className="mt-10 max-w-sm text-lg leading-relaxed text-charcoal/80">{t.rocText}</p>
        </div>
        <figure data-clip className="col-span-12 mt-12 overflow-hidden md:col-span-6 md:col-start-7 md:mt-0">
          <img src={img.rocOrsay} alt={t.imageAlts.roc} loading="lazy" width={1600} height={1200} className="aspect-[4/5] w-full object-cover" />
          <PhotoCredit label={t.photoCredit} credit={photoCredits.roc} />
        </figure>
      </section>

      <section className="bg-ivory px-5 py-32 md:px-12 md:py-52">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <h2 className="font-serif text-5xl font-light leading-[1.04] text-swiss-red md:text-8xl md:leading-[1.02]">{t.lakeTitle}</h2>
            <p className="mt-12 font-serif text-6xl font-light tabular-nums md:text-9xl">{t.lakeStat}</p>
            <p className="mt-5 font-serif text-3xl italic md:text-4xl">{t.lakeText}</p>
            <p data-fade className="eyebrow mt-10 max-w-xs leading-relaxed text-muted-foreground">{t.lakeWalk}</p>
          </div>
          <figure data-clip className="col-span-12 mt-12 overflow-hidden md:col-span-7 md:mt-20">
            <img src={img.lacChavonnes} alt={t.imageAlts.lake} loading="lazy" width={1600} height={1072} className="aspect-[3/2] w-full object-cover" />
            <PhotoCredit label={t.photoCredit} credit={photoCredits.lake} />
          </figure>
          <figure data-clip className="col-span-9 mt-8 overflow-hidden md:col-span-4 md:col-start-2 md:-mt-16">
             <img src={img.lacChavonnesReflection} alt={t.imageAlts.lakeReflection} loading="lazy" width={2272} height={1514} className="aspect-[3/2] w-full object-cover" />
            <PhotoCredit label={t.photoCredit} credit={photoCredits.lakeReflection} />
          </figure>
        </div>
      </section>

      <section className="bg-stone px-5 py-32 md:px-12 md:py-48">
        <div className="grid grid-cols-12 gap-6">
          <h2 className="col-span-12 font-serif text-5xl font-light leading-[0.94] md:col-span-6 md:text-8xl md:leading-[0.9]">
            <span data-lines>{t.nearbyTitle.map((line, index) => <span key={index} className="line-mask"><span>{line} </span></span>)}</span>
          </h2>
          <div className="col-span-12 mt-12 border-t md:col-span-5 md:col-start-8 md:mt-0">
             {t.nearby.map(([place, items], index) => {
               const source = index === 0 ? img.chateauAigle : index === 1 ? img.bexVillage : img.chillonLeman;
               const alt = index === 0 ? t.imageAlts.aigle : index === 1 ? t.imageAlts.bex : t.imageAlts.chillon;
               const credit = index === 0 ? photoCredits.aigle : index === 1 ? photoCredits.bex : photoCredits.chillon;
               return <div data-fade key={place} className="border-b py-7"><p className="eyebrow mb-4 text-wood">{index < 2 ? t.regionalLevel : t.beyondLevel}</p><h3 className="font-serif text-3xl">{place}</h3><p className="eyebrow mt-3 leading-relaxed text-muted-foreground">{items}</p><figure className="mt-8"><img src={source} alt={alt} loading="lazy" width={2400} height={index === 2 ? 1800 : 1600} className="aspect-[3/2] w-full object-cover" /><PhotoCredit label={t.photoCredit} credit={credit} /></figure></div>;
             })}
          </div>
        </div>
      </section>

    </div>
  );
}