import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { Dict } from "./i18n";
import { categories, type Category, type PoiId } from "./locationPlaces";
import { img } from "./images";

const LocationMap = lazy(() => import("./LocationMap").then((m) => ({ default: m.LocationMap })));

type Props = { t: Dict };

export function LocationExperience({ t }: Props) {
  const loc = t.loc;
  const [category, setCategory] = useState<Category>("lifestyle");
  const [activeId, setActiveId] = useState<PoiId | null>("palace");
  const blocks = useRef<(HTMLElement | null)[]>([]);

  // Scroll sync: the place in the reading band becomes the active map point.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          setCategory(el.dataset["category"] as Category);
          setActiveId(el.dataset["poi"] as PoiId);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll("[data-location-experience] [data-poi]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const choose = (c: Category) => {
    setCategory(c);
    setActiveId(c === "lifestyle" ? "palace" : c === "montagne" ? "roc" : "beausoleil");
  };

  const fallback = <div className="h-full w-full bg-ivory" />;

  return (
    <section id="vivre-villars" data-location-experience className="bg-ivory">
      <div className="md:grid md:grid-cols-12">
        {/* Map: sticky on desktop, simple block on mobile */}
        <div className="relative h-[min(68svh,34rem)] min-h-[26rem] md:sticky md:top-0 md:order-2 md:col-span-7 md:h-svh">
          <ClientOnly fallback={fallback}>
            <Suspense fallback={fallback}>
              <LocationMap names={loc.pois} category={category} activeId={activeId} onSelect={setActiveId} label={loc.mapLabel} routeLabel={loc.routeNote} />
            </Suspense>
          </ClientOnly>
          <nav aria-label={loc.label} className="absolute inset-x-3 top-3 grid grid-cols-3 items-start gap-2 md:inset-x-auto md:left-8 md:top-8 md:flex md:items-center md:gap-3">
            {categories.map((c, i) => (
              <span key={c} className="flex min-w-0 items-center gap-3">
                {i > 0 && <span className="hidden h-px w-4 bg-swiss-red/25 md:block" aria-hidden="true" />}
                <button type="button" onClick={() => choose(c)} aria-pressed={category === c} className={`min-h-11 min-w-0 w-full py-3 text-center font-sans text-sm uppercase tracking-[0.04em] transition-colors md:w-auto md:text-left md:text-base md:tracking-[0.16em] ${category === c ? "text-swiss-red" : "text-swiss-red/55 hover:text-swiss-red/80"}`}>
                  <span className={`border-b pb-1 ${category === c ? "border-swiss-red" : "border-transparent"}`}>{loc.filters[i]}</span>
                </button>
              </span>
            ))}
          </nav>
        </div>

        <div className="px-5 md:order-1 md:col-span-5 md:px-12">
          {/* 01 Lifestyle — Villars Palace */}
          <article ref={(el) => { blocks.current[0] = el; }} data-category="lifestyle" data-poi="palace" className="flex flex-col justify-center border-b py-20 md:min-h-svh md:py-24">
            <p className="eyebrow text-wood">{loc.palace.eyebrow}</p>
            <p className="eyebrow mt-10 text-muted-foreground">{loc.tiers[0]}</p>
            <h3 className="mt-4 font-serif text-5xl font-light uppercase leading-[0.9] text-swiss-red md:text-7xl">{loc.palace.name}</h3>
            <p className="mt-4 font-serif text-3xl italic text-swiss-red">{loc.palace.stars}</p>
            <figure className="mt-10 overflow-hidden">
              <img src={img.villarsPalace} alt={t.palaceImageAlt} loading="lazy" width={1093} height={768} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="eyebrow mt-3 text-muted-foreground">{t.suppliedImage}</figcaption>
            </figure>
            <ul className="mt-10 space-y-1">
              {loc.palace.lines.map((l) => <li key={l} className="font-serif text-2xl text-charcoal/85">{l}</li>)}
            </ul>
            <div className="mt-10 grid grid-cols-1 gap-3 border-t pt-5 min-[520px]:grid-cols-[minmax(0,1fr)_auto] min-[520px]:items-end min-[520px]:gap-4">
              <p className="eyebrow text-charcoal">{loc.palace.distance}</p>
              <p className="min-w-0 break-words text-base leading-relaxed text-muted-foreground min-[520px]:text-right">{loc.palace.address}</p>
            </div>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-charcoal/70">{loc.lifestyleNote}</p>
          </article>

          {/* 02 Montagne */}
          <article ref={(el) => { blocks.current[1] = el; }} data-category="montagne" data-poi="roc" className="flex flex-col justify-center border-b py-20 md:min-h-svh md:py-24">
            <p className="eyebrow text-wood">{loc.mountain.eyebrow}</p>
            <p className="mt-10 font-serif text-[5rem] font-light leading-none tabular-nums md:text-[9rem]">{loc.mountain.time}</p>
            <h3 className="mt-4 font-serif text-3xl md:text-4xl">{loc.mountain.title}</h3>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-charcoal/80">{loc.mountain.text}</p>
              <p className="eyebrow mt-10 border-t pt-5 leading-loose text-charcoal/75">{loc.tiers[1]} · {loc.mountain.more}</p>
          </article>

          {/* 03 Éducation */}
          <article ref={(el) => { blocks.current[2] = el; }} data-category="education" className="flex flex-col justify-center py-20 md:min-h-svh md:py-24">
            <p className="eyebrow text-wood">{loc.edu.eyebrow}</p>
            <h3 data-category="education" data-poi="beausoleil" className="mt-8 font-serif text-4xl font-light uppercase leading-[0.9] md:text-6xl">{loc.edu.title[0]}<br />{loc.edu.title[1]}</h3>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-charcoal/80">{loc.edu.text}</p>
            <div className="mt-12 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:hidden">
              <span className="eyebrow text-muted-foreground">{loc.filters[2]}</span>
              <span aria-hidden="true" className="font-serif text-2xl text-swiss-red">← →</span>
            </div>
            <ol className="-mx-5 mt-4 flex snap-x snap-mandatory gap-0 overflow-x-auto px-5 [scroll-padding-left:1.25rem] md:mx-0 md:mt-12 md:block md:overflow-visible md:px-0">
              {loc.edu.schools.map((s) => {
                const active = activeId === s.id;
                return (
                  <li key={s.id} data-category="education" data-poi={s.id} className="w-[88%] shrink-0 snap-start border-t pr-5 [scroll-snap-stop:always] md:w-auto md:pr-0">
                    <button
                      type="button"
                      onMouseEnter={() => { setCategory("education"); setActiveId(s.id as PoiId); }}
                      onFocus={() => { setCategory("education"); setActiveId(s.id as PoiId); }}
                      onClick={() => { setCategory("education"); setActiveId(s.id as PoiId); }}
                      aria-pressed={active}
                      className={`grid w-full grid-cols-1 gap-y-5 py-7 text-left transition-opacity duration-500 md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-6 md:gap-y-0 ${active ? "opacity-100" : "md:opacity-55 hover:opacity-100"}`}
                    >
                      <span className="min-w-0 break-words font-serif text-xl leading-tight sm:text-2xl md:text-3xl">
                        <span className={`mr-3 inline-block h-2 w-2 rounded-full align-middle transition-colors ${active ? "bg-swiss-red" : "bg-charcoal/25"}`} />
                        {s.name}
                      </span>
                      <span className="flex flex-wrap items-end gap-x-8 gap-y-4 text-left md:row-span-2 md:flex-col md:items-end md:gap-4 md:text-right">
                        {s.stats.map(([v, l], i) => (
                          <span key={l}>
                            <span className={`block font-serif font-light leading-none tabular-nums ${i === 0 ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"}`}>{v}</span>
                            <span className="eyebrow mt-1 block text-muted-foreground">{l}</span>
                          </span>
                        ))}
                      </span>
                      <span className="mt-3 max-w-[20rem] text-sm leading-relaxed text-charcoal/70">{s.note}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="eyebrow mt-6 border-t pt-5 text-muted-foreground">{loc.edu.others}</p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/65">{loc.edu.disclaimer}</p>
          </article>
        </div>
      </div>

      <div className="px-5 py-24 md:px-12 md:py-48">
        <div className="grid grid-cols-12 gap-6">
          <p className="eyebrow col-span-12 text-wood md:col-span-3">{loc.label}</p>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <h2 className="font-serif text-5xl font-light uppercase leading-[0.88] md:text-8xl lg:text-9xl">
              <span data-lines>{loc.title.map((line, i) => <span key={i} className="line-mask"><span>{line} </span></span>)}</span>
            </h2>
            <p data-fade className="mt-10 max-w-md font-serif text-2xl italic text-charcoal/80 md:text-3xl">{loc.text}</p>
            <ol className="mt-14 grid grid-cols-2 border-t md:grid-cols-4">
              {loc.pillars.map((p, i) => (
                <li key={p} className="border-b py-5 pr-4">
                  <span className="eyebrow text-swiss-red">0{i + 1}</span>
                  <p className="eyebrow mt-2 text-charcoal">{p}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
