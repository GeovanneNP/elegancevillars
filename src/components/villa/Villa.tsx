import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { dict, type Lang } from "./i18n";
import { img } from "./images";
import { Preloader } from "./Preloader";
import { Gallery } from "./Gallery";
import { DossierDialog } from "./DossierDialog";
import { Button } from "@/components/ui/button";
import logo from "@/assets/brodard-logo.png.asset.json";

const ids = ["residence", "location", "gallery", "details", "contact"];

function Lines({ lines, className = "" }: { lines: string[]; className?: string }) {
  return (
    <span data-lines className={className}>
      {lines.map((l) => (
         <span key={l} className="line-mask"><span>{l}{" "}</span></span>
      ))}
    </span>
  );
}

export function Villa() {
  const [lang, setLang] = useState<Lang>("fr");
  const [ready, setReady] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const t = dict[lang];
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const marquee = useRef<gsap.core.Tween | null>(null);
  const onDone = useCallback(() => setReady(true), []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setPastHero(entry.boundingClientRect.bottom <= 0);
    }, { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Smooth scroll
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.05, easing: (x) => 1 - Math.pow(1 - x, 4) });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Scroll choreography
  useEffect(() => {
    if (!ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      const ease = "power3.out";

      // Hero intro
       gsap.fromTo("[data-hero-img]", { scale: 1.06 }, { scale: 1, duration: 2.4, ease: "power2.out" });
      gsap.from("[data-hero] .line-mask > span", { yPercent: 110, duration: 1.3, stagger: 0.1, ease: "expo.out", delay: 0.1 });
       gsap.from("[data-hero-fade]", { opacity: 0, duration: 1, stagger: 0.08, delay: 0.6, ease });

      // Hero camera on scroll
      const heroTl = gsap.timeline({ scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true } });
      heroTl.to("[data-hero-wrap]", { scale: 1.12, ease: "none" }, 0)
        .to("[data-hero-title]", { yPercent: -40, ease: "none" }, 0)
        .to("[data-hero-meta]", { opacity: 0, y: -20, ease: "none" }, 0);

      // Line reveals (except hero)
      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
        if (el.closest("[data-hero]") || el.closest("[data-pin-text]")) return;
        gsap.from(el.querySelectorAll(".line-mask > span"), {
          yPercent: 110, duration: 1.3, stagger: 0.12, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Soft fades
       gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
         gsap.from(el, { opacity: 0, duration: 1.1, ease, scrollTrigger: { trigger: el, start: "top 88%" } });
       });

      // Parallax speeds
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const s = parseFloat(el.dataset["speed"] || "0");
        gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // Counters
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
         const count = el.dataset["count"];
         if (!count) return;
         const end = parseFloat(count);
         const dec = count.includes(".") ? 1 : 0;
        const o = { v: end > 1000 ? 1980 : 0 };
        gsap.to(o, {
          v: end, duration: 2.2, ease: "power2.out",
          onUpdate: () => { el.textContent = o.v.toFixed(dec); },
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Clip reveal for images
       gsap.utils.toArray<HTMLElement>("[data-gal], [data-clip]").forEach((el) => {
         gsap.fromTo(el, { clipPath: "inset(8% 0 8% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });

      // Location line + map
      gsap.fromTo("[data-vline]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-distances]", start: "top 70%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>("[data-dist]").forEach((el) => {
         gsap.from(el, { opacity: 0, duration: 1, ease, scrollTrigger: { trigger: el, start: "top 80%" } });
      });
      gsap.utils.toArray<SVGPathElement>("[data-draw]").forEach((p) => {
        const len = p.getTotalLength();
        gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.8, ease: "power2.inOut", scrollTrigger: { trigger: "[data-map]", start: "top 75%" } });
      });

      // Seasons words
      gsap.from("[data-season]", { opacity: 0, yPercent: 60, stagger: 0.12, duration: 1.1, ease, scrollTrigger: { trigger: "[data-seasons-list]", start: "top 80%" } });

      // Marquee
      marquee.current = gsap.to("[data-marquee]", { xPercent: -50, duration: 40, ease: "none", repeat: -1 });

      // Desktop-only pinned sequences
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        // Living room expand
        const lv = gsap.timeline({ scrollTrigger: { trigger: "[data-living]", start: "top top", end: "bottom bottom", scrub: 0.8 } });
        lv.fromTo("[data-living-frame]", { clipPath: "inset(14% 15% 14% 15%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 }, 0)
          .fromTo("[data-living-img]", { scale: 1.15, yPercent: -4 }, { scale: 1, yPercent: 4, ease: "none", duration: 1 }, 0)
           .from("[data-living-text] > *", { opacity: 0, stagger: 0.08, duration: 0.25 }, 0.15)
           .to("[data-living-text] > *", { opacity: 0, stagger: 0.05, duration: 0.2 }, 0.75);

        // Bedroom cover
        const bd = gsap.timeline({ scrollTrigger: { trigger: "[data-bedroom]", start: "top top", end: "bottom bottom", scrub: 0.8 } });
        bd.from("[data-bed-title] .line-mask > span", { yPercent: 110, stagger: 0.1, duration: 0.25 }, 0)
          .fromTo("[data-bed-img]", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none", duration: 0.5 }, 0.35)
          .fromTo("[data-bed-img] img", { scale: 1.2 }, { scale: 1, ease: "none", duration: 0.65 }, 0.35)
          .fromTo("[data-bed-img2]", { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power2.out", duration: 0.25 }, 0.75);

        // Balcony open
        const bc = gsap.timeline({ scrollTrigger: { trigger: "[data-balcony]", start: "top top", end: "bottom bottom", scrub: 0.8 } });
        bc.fromTo("[data-bal-frame]", { clipPath: "inset(30% 36% 30% 36%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 0.7 }, 0)
          .fromTo("[data-bal-frame] img", { scale: 1.3 }, { scale: 1.02, ease: "none", duration: 1 }, 0)
           .from("[data-bal-text] > *", { opacity: 0, stagger: 0.1, duration: 0.25 }, 0.55);
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [ready]);

  // Refresh measurements when language changes text length
  useEffect(() => { ScrollTrigger.refresh(); }, [lang]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.8 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={root} className="overflow-x-clip">
      <Preloader onDone={onDone} />

      {/* NAV */}
       <header className="relative z-40 flex min-h-20 items-center justify-between gap-4 bg-swiss-red px-5 py-3 text-ivory md:min-h-24 md:px-12">
         <a href="#top" aria-label="Brodard Property — Villars-sur-Ollon" className="block w-40 shrink-0 md:w-56">
           <img src={logo.url} alt="Brodard Property" className="w-full object-contain" />
         </a>
        <nav className="flex items-center gap-6 md:gap-10">
          <ul className="hidden gap-8 md:flex">
            {t.nav.map((n, i) => (
              <li key={n}>
                 <Button variant="ghost" onClick={() => scrollTo(ids[i] ?? "residence")} className="eyebrow relative h-auto p-0 text-ivory/85 transition-colors hover:bg-transparent hover:text-ivory after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100">
                  {n}
                 </Button>
              </li>
            ))}
          </ul>
           <div className="eyebrow flex gap-2">
            {(["fr", "en"] as Lang[]).map((l, i) => (
              <span key={l} className="flex gap-2">
                {i > 0 && <span className="text-ivory/40">|</span>}
                 <Button variant="ghost" onClick={() => setLang(l)} className={`eyebrow h-auto p-0 hover:bg-transparent ${lang === l ? "text-ivory" : "text-ivory/50 hover:text-ivory"}`}>{l.toUpperCase()}</Button>
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* HERO */}
        <section id="top" data-hero className="relative h-[calc(90svh-5rem)] min-h-[560px] overflow-hidden bg-stone text-ivory md:h-[calc(94svh-6rem)]">
        <div data-hero-wrap className="absolute inset-0">
            <img data-hero-img src={img.living} alt={t.imageAlts.hero} fetchPriority="high" className="h-full w-full object-cover object-[48%_center]" />
        </div>
          <div className="absolute inset-0 bg-swiss-red/20" />
         <div className="relative flex h-full flex-col justify-end px-5 pb-20 md:px-12 md:pb-20">
          <div data-hero-title>
            <p data-hero-fade className="eyebrow mb-6 text-ivory/80">{t.heroKicker}</p>
             <h1 className="font-serif text-6xl font-light leading-[0.92] sm:text-7xl md:text-8xl lg:text-9xl">
              <Lines lines={t.heroTitle} />
            </h1>
          </div>
          <div data-hero-meta className="mt-10 flex flex-col gap-6 border-t border-ivory/25 pt-6 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {t.heroMeta.map((m) => (
                <li data-hero-fade key={m} className="eyebrow text-ivory/90">{m}</li>
              ))}
            </ul>
             <div data-hero-fade className="flex flex-wrap items-center gap-x-8 gap-y-4">
               <Button variant="ghost" onClick={() => scrollTo("residence")} className="eyebrow group flex h-auto items-center gap-4 p-0 text-ivory hover:bg-transparent hover:text-ivory">
                 {t.heroCta}<span className="h-px w-8 bg-ivory transition-all duration-700 group-hover:w-12" />
               </Button>
               <Button variant="ghost" onClick={() => scrollTo("contact")} className="eyebrow group flex h-auto items-center gap-2 p-0 text-ivory/85 hover:bg-transparent hover:text-ivory">
                 {t.visitCta}<span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
               </Button>
             </div>
          </div>
        </div>
         <div className="absolute bottom-4 right-5 hidden flex-col items-center gap-2 md:bottom-6 md:right-12 md:flex">
          <span className="eyebrow text-[0.55rem] text-ivory/70">{t.scroll}</span>
          <span className="relative h-10 w-px overflow-hidden bg-ivory/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-ivory" />
          </span>
        </div>
      </section>

      {/* MANIFESTO */}
       <section id="residence" className="grid grid-cols-12 gap-6 bg-ivory px-5 py-28 md:px-12 md:py-48">
        <p data-fade className="eyebrow col-span-12 text-wood md:col-span-3">46°18'N — Villars-sur-Ollon</p>
         <h2 className="col-span-12 font-serif text-6xl font-light leading-[0.9] md:col-span-9 md:text-8xl lg:text-9xl">
          <Lines lines={t.manifesto} />
        </h2>
        <div className="col-span-12 mt-10 grid grid-cols-12 md:mt-20">
          <p data-fade className="col-span-12 max-w-md text-lg leading-relaxed text-charcoal/80 md:col-span-4 md:col-start-8">{t.manifestoText}</p>
        </div>
      </section>

      {/* LIVING STORY */}
       <section data-living className="relative bg-ivory md:h-[170vh]">
         <div className="relative h-[78svh] overflow-hidden md:sticky md:top-0 md:h-svh">
          <div data-living-frame className="absolute inset-0 overflow-hidden">
             <img data-living-img src={img.living2} alt={t.imageAlts.living} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-swiss-red/20" />
          </div>
          <div data-living-text className="absolute bottom-10 left-5 text-ivory md:bottom-16 md:left-12">
            <p className="eyebrow mb-4 text-ivory/80">01</p>
            <p className="mb-6 font-serif text-4xl italic md:text-6xl">{t.livingTitle}</p>
            {t.livingWords.map((w) => (
              <p key={w} className="font-serif text-2xl font-light md:text-3xl">{w}</p>
            ))}
          </div>
        </div>
      </section>

      {/* FACTS */}
      <section className="bg-swiss-red px-5 py-32 text-ivory md:px-12 md:py-48">
        <h2 className="max-w-5xl font-serif text-5xl font-light leading-[1.02] md:text-7xl">
          <Lines lines={t.factsTitle} />
        </h2>
         <div className="mt-16 grid grid-cols-2 border-t border-ivory/15 md:mt-24 md:grid-cols-4">
          {t.facts.map(([n, l], i) => (
            <div key={l} className={`border-b border-ivory/15 py-10 md:border-b-0 md:py-14 ${i % 2 ? "pl-6" : "pr-6"} md:px-8 ${i > 0 ? "md:border-l" : ""} ${i % 2 ? "border-l" : ""} border-ivory/15`}>
               <div data-count={n} className="font-serif text-6xl font-light tabular-nums lining-nums md:text-8xl">{n}</div>
              <div className="eyebrow mt-4 text-ivory/55">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERIOR */}
      <section className="grid grid-cols-12 items-center gap-6 bg-stone px-5 py-32 md:px-12 md:py-48">
        <div className="relative col-span-12 aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-[5/6]">
           <img data-speed="6" src={img.kitchen} alt={t.imageAlts.kitchen} loading="lazy" className="absolute inset-0 h-[115%] w-full -translate-y-[7%] object-cover" />
        </div>
        <div className="col-span-12 md:col-span-4 md:col-start-9">
          <p data-fade className="eyebrow mb-8 text-wood">{t.interiorKicker}</p>
          <h3 className="font-serif text-5xl font-light leading-[1.02] md:text-6xl">
            <Lines lines={t.interiorTitle} />
          </h3>
          <p data-fade className="mt-10 leading-relaxed text-charcoal/80">{t.interiorText}</p>
          <div data-fade className="mt-10 h-px w-16 bg-gold" />
        </div>
      </section>

      {/* BEDROOM */}
        <section data-bedroom className="relative bg-ivory text-charcoal md:h-[190vh]">
        <div className="relative overflow-hidden md:sticky md:top-0 md:h-svh">
          <div data-bed-title className="flex flex-col justify-center px-5 py-32 md:absolute md:inset-0 md:px-12 md:py-0">
             <h2 className="font-serif text-6xl font-light leading-[0.92] md:text-8xl lg:text-9xl">
               <span>{t.bedroomTitle.map((l, i) => (
                <span key={l} className={`line-mask ${i === 1 ? "md:pl-[12vw] italic" : ""}`}><span>{l}</span></span>
              ))}</span>
            </h2>
          </div>
          <div data-bed-img className="relative h-[70vh] overflow-hidden md:absolute md:inset-0 md:h-auto">
             <img src={img.bedroom} alt={t.imageAlts.bedroom} loading="lazy" className="h-full w-full object-cover" />
             <div className="absolute inset-0 bg-swiss-red/10" />
          </div>
          <figure data-bed-img2 className="relative mx-5 -mt-24 w-[60%] md:absolute md:bottom-12 md:right-12 md:mx-0 md:mt-0 md:w-[24vw]">
             <img src={img.bedroom2} alt={t.imageAlts.bedroomDetail} loading="lazy" className="aspect-[4/5] w-full object-cover" />
             <figcaption className="mt-3 text-xs leading-relaxed text-charcoal/75">{t.bedroomCaption}</figcaption>
          </figure>
          <div className="h-16 md:hidden" />
        </div>
      </section>

      {/* BALCONY */}
       <section data-balcony className="relative bg-ivory md:h-[180vh]">
        <div className="relative h-[90vh] overflow-hidden md:sticky md:top-0 md:h-svh">
          <div data-bal-frame className="absolute inset-0 overflow-hidden">
             <img src={img.balcony} alt={t.imageAlts.balcony} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-swiss-red/30" />
          </div>
          <div data-bal-text className="absolute inset-x-5 bottom-14 text-ivory md:inset-x-12 md:bottom-20">
             <h2 className="font-serif text-6xl font-light leading-[0.9] md:text-8xl lg:text-9xl">{t.balconyTitle}</h2>
            <p className="mt-6 font-serif text-2xl italic md:ml-[40vw] md:text-3xl">{t.balconySub[0]}<br />{t.balconySub[1]}</p>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="grid grid-cols-12 gap-6 bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-6">
           <h2 className="font-serif text-6xl font-light leading-[0.9] md:text-7xl lg:text-8xl">
            <Lines lines={t.locationTitle} />
          </h2>
          <p data-fade className="mt-10 max-w-md text-lg leading-relaxed text-charcoal/80">{t.locationText}</p>
          <div data-map className="mt-16 max-w-xl">
             <svg viewBox="0 0 600 300" className="w-full text-charcoal" fill="none" stroke="currentColor" aria-label={t.imageAlts.map}>
              <path data-draw strokeWidth="0.8" opacity="0.5" d="M0 250 L60 190 L95 215 L150 120 L190 170 L240 80 L290 150 L330 110 L380 175 L430 60 L480 140 L530 100 L600 180" />
              <path data-draw strokeWidth="0.6" opacity="0.3" d="M0 280 L80 230 L130 250 L200 190 L260 230 L320 180 L400 240 L470 200 L540 240 L600 220" />
              <path data-draw strokeWidth="0.6" strokeDasharray="3 4" opacity="0.6" d="M60 60 C 140 120, 220 140, 300 175 S 470 230, 560 270" />
              <circle cx="300" cy="175" r="4" fill="currentColor" stroke="none" />
              <circle cx="300" cy="175" r="12" strokeWidth="0.6" />
              <text x="314" y="170" className="fill-current" stroke="none" fontSize="11" letterSpacing="3">VILLARS</text>
              <text x="20" y="54" className="fill-current" stroke="none" fontSize="9" letterSpacing="2" opacity="0.6">LAUSANNE</text>
              <text x="490" y="290" className="fill-current" stroke="none" fontSize="9" letterSpacing="2" opacity="0.6">SION</text>
              <text x="190" y="140" className="fill-current" stroke="none" fontSize="9" letterSpacing="2" opacity="0.6">AIGLE</text>
            </svg>
          </div>
        </div>
        <div data-distances className="relative col-span-12 mt-12 md:col-span-5 md:col-start-8 md:mt-0">
          <span data-vline className="absolute left-0 top-0 h-full w-px origin-top bg-wood" />
          <ul>
            {t.distances.map(([p, d]) => (
               <li data-dist key={p} className="relative flex items-baseline justify-between gap-3 border-b py-7 pl-8">
                <span className="absolute left-[-3px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-wood" />
                 <span className="min-w-0 font-serif text-2xl md:text-3xl">{p}</span>
                 <span className="eyebrow shrink-0 text-wood">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SEASONS */}
      <section className="relative overflow-hidden bg-swiss-red py-40 text-ivory md:py-56">
          <img data-speed="10" src={img.seasons} alt={t.imageAlts.seasons} loading="lazy" width={1920} height={1088} className="absolute inset-0 h-[120%] w-full -translate-y-[10%] object-cover opacity-80" />
         <div className="absolute inset-0 bg-swiss-red/35" />
        <div className="relative px-5 md:px-12">
           <h2 className="font-serif text-6xl font-light uppercase leading-[0.88] md:text-8xl lg:text-9xl">
            <Lines lines={t.seasonsTitle} />
          </h2>
          <div className="mt-20 grid grid-cols-12 gap-6">
            <p data-fade className="col-span-12 max-w-md text-lg leading-relaxed text-ivory/85 md:col-span-4">{t.seasonsText}</p>
            <ul data-seasons-list className="col-span-12 flex flex-wrap gap-x-10 gap-y-4 md:col-span-7 md:col-start-6">
              {t.seasons.map((s) => (
                <li key={s} className="overflow-hidden"><span data-season className="block font-serif text-4xl italic md:text-5xl">{s}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section id="details" className="grid grid-cols-12 gap-6 bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-4">
          <h2 className="font-serif text-6xl font-light leading-none md:sticky md:top-24 md:text-7xl">
            <Lines lines={[t.detailsTitle]} />
          </h2>
        </div>
        <dl className="col-span-12 border-t md:col-span-7 md:col-start-6">
          {t.details.map(([k, v]) => (
            <div data-fade key={k} className="grid grid-cols-2 border-b py-5">
              <dt className="eyebrow self-center text-muted-foreground">{k}</dt>
              <dd className="font-serif text-2xl">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* AMENITIES */}
      <section
        className="overflow-hidden border-y bg-stone py-10"
        onMouseEnter={() => marquee.current && gsap.to(marquee.current, { timeScale: 0.25, duration: 0.8 })}
        onMouseLeave={() => marquee.current && gsap.to(marquee.current, { timeScale: 1, duration: 0.8 })}
      >
        <div data-marquee className="flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex" aria-hidden={k === 1}>
              {t.amenities.map((a) => (
                <span key={a} className="flex items-center font-serif text-5xl font-light uppercase md:text-7xl">
                  <span className="px-8">{a}</span>
                  <span className="h-2 w-2 rounded-full bg-wood" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Gallery t={t} />

      {/* OWNERSHIP */}
      <section className="relative grid grid-cols-12 gap-6 overflow-hidden bg-stone px-5 py-32 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-7">
           <h2 className="font-serif text-6xl font-light leading-[0.92] md:text-7xl lg:text-8xl">
            <Lines lines={t.ownTitle} />
          </h2>
          <p data-fade className="mt-10 max-w-md text-lg leading-relaxed text-charcoal/80">{t.ownText}</p>
        </div>
        <div className="col-span-12 self-end md:col-span-4 md:col-start-9">
          <div data-fade className="border-t py-6">
            <div className="eyebrow text-muted-foreground">{t.price}</div>
            <div className="mt-3 font-serif text-5xl">CHF 590'000.-</div>
          </div>
          <div data-fade className="border-y py-6">
            <div className="eyebrow text-muted-foreground">{t.availability}</div>
            <div className="mt-3 font-serif text-3xl">{t.availabilityValue}</div>
          </div>
            <Button variant="default" data-fade onClick={() => scrollTo("contact")} className="eyebrow group mt-10 flex h-auto w-full items-center justify-between bg-swiss-red px-7 py-6 text-ivory transition-colors hover:bg-swiss-red/85">
            {t.ownCta}
            <span className="h-px w-10 bg-gold transition-all duration-700 group-hover:w-16" />
           </Button>
            <Button variant="ghost" data-fade onClick={() => setDossierOpen(true)} className="eyebrow group mt-5 flex h-auto w-full items-center justify-between p-0 py-3 text-charcoal hover:bg-transparent hover:text-swiss-red">
              {t.dossierCta}<span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Button>
        </div>
      </section>

      {/* CONTACT */}
       <section id="contact" className="relative bg-swiss-red text-ivory">
        <div className="relative h-[50vh] overflow-hidden">
           <img data-speed="12" src={img.alps} alt={t.imageAlts.alps} loading="lazy" width={1920} height={1088} className="absolute inset-0 h-[130%] w-full -translate-y-[15%] object-cover opacity-80" />
        </div>
        <div className="grid grid-cols-12 gap-6 px-5 py-28 md:px-12 md:py-40">
          <div className="col-span-12 md:col-span-5">
             <h2 className="font-serif text-6xl font-light leading-[0.92] md:text-7xl lg:text-8xl">
              <Lines lines={t.contactTitle} />
            </h2>
            <p data-fade className="eyebrow mt-12 text-ivory/50">{t.contactText}</p>
             <div data-fade className="mt-10 h-px w-16 bg-ivory/40" />
          </div>
           <div data-fade className="col-span-12 mt-10 flex flex-col justify-end border-t border-ivory/20 pt-8 md:col-span-5 md:col-start-8 md:mt-0">
              <a href={`mailto:Marketing@uptechswiss.ch?subject=${encodeURIComponent(t.mailSubject)}`} className="break-all font-serif text-3xl leading-snug text-ivory transition-colors hover:text-gold md:text-4xl" aria-label={`${t.contactEmail}: Marketing@uptechswiss.ch`}>Marketing@uptechswiss.ch</a>
              <a href="tel:+41765426230" className="mt-6 self-start font-serif text-3xl leading-snug text-ivory transition-colors hover:text-gold md:text-4xl" aria-label={`${t.contactPhone}: +41 76 542 62 30`}>+41 76 542 62 30</a>
           </div>
        </div>
        <footer className="flex flex-col gap-4 border-t border-ivory/10 px-5 py-8 text-xs text-ivory/40 md:flex-row md:justify-between md:px-12">
           <span>{t.reference} 044598 — Villars-sur-Ollon, Vaud, {t.country}</span>
          <span>{t.rights}</span>
           <span>Villars-sur-Ollon · Vaud</span>
        </footer>
      </section>
       <DossierDialog open={dossierOpen} onOpenChange={setDossierOpen} lang={lang} />
       {pastHero && !dossierOpen && (
         <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ivory/20 bg-swiss-red px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-ivory md:hidden">
           <div className="flex items-center justify-between gap-3">
             <span className="font-serif text-2xl tabular-nums whitespace-nowrap">CHF 590'000</span>
             <Button variant="ghost" onClick={() => scrollTo("contact")} className="eyebrow h-auto min-w-0 gap-2 p-0 text-right text-ivory hover:bg-transparent hover:text-ivory">{t.visitCta}<span aria-hidden="true">→</span></Button>
           </div>
         </div>
       )}
    </div>
  );
}
