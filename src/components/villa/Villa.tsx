import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { dict, langs, type Lang } from "./i18n";
import { img } from "./images";
import { Preloader } from "./Preloader";
import { Gallery } from "./Gallery";
import { DossierDialog } from "./DossierDialog";
import { VillarsLifestyle } from "./VillarsLifestyle";
import { Button } from "@/components/ui/button";
import logo from "@/assets/brodard-logo.png.asset.json";

const ids = ["residence", "location", "gallery", "details", "contact"];
const motion = {
  ease: "power3.out",
  revealStart: "top 86%",
  clipStart: "top 88%",
  scrub: 0.55,
} as const;

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
  const [contactVisible, setContactVisible] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [activeSeason, setActiveSeason] = useState(0);
  const t = dict[lang];
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const marquee = useRef<gsap.core.Tween | null>(null);
  const onDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    const saved = window.localStorage.getItem("villars-lang") as Lang | null;
    const browser = navigator.language.slice(0, 2) as Lang;
    const initial = saved && langs.includes(saved) ? saved : langs.includes(browser) ? browser : "fr";
    if (initial !== "fr") setLang(initial);
  }, []);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(([entry]) => setContactVisible(Boolean(entry?.isIntersecting)), { threshold: 0.05 });
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const chooseLang = (l: Lang) => { setLang(l); window.localStorage.setItem("villars-lang", l); };

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
    const lenis = new Lenis({ duration: 0.82, easing: (x) => 1 - Math.pow(1 - x, 4), smoothWheel: true });
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
      const finishOnLeave = (self: ScrollTrigger) => self.animation?.progress(1);

      // Hero intro
      gsap.fromTo("[data-hero-img]", { scale: 1.045 }, { scale: 1, duration: 1.8, ease: "power2.out" });
      gsap.from("[data-hero] .line-mask > span", { yPercent: 105, duration: 1.05, stagger: 0.08, ease: "expo.out", delay: 0.05 });
      gsap.from("[data-hero-fade]", { opacity: 0, duration: 0.8, stagger: 0.06, delay: 0.4, ease: motion.ease });

      // Hero camera on scroll
      const heroTl = gsap.timeline({ scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom 12%", scrub: motion.scrub, invalidateOnRefresh: true } });
      heroTl.to("[data-hero-wrap]", { scale: 1.075, ease: "none" }, 0)
        .to("[data-hero-title]", { yPercent: -24, ease: "none" }, 0)
        .to("[data-hero-meta]", { opacity: 0, y: -20, ease: "none" }, 0);

      // Line reveals (except hero)
      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
        if (el.closest("[data-hero]") || el.closest("[data-pin-text]")) return;
        gsap.fromTo(el.querySelectorAll(".line-mask > span"), { yPercent: 105 }, {
          yPercent: 0, duration: 0.9, stagger: 0.08, ease: "expo.out",
          scrollTrigger: { trigger: el, start: motion.revealStart, onLeave: finishOnLeave },
        });
      });

      // Soft fades
       gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
         gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.75, ease: motion.ease, scrollTrigger: { trigger: el, start: "top 90%", onLeave: finishOnLeave } });
       });

      // Parallax speeds
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const s = parseFloat(el.dataset["speed"] || "0");
        const distance = Math.min(Math.abs(s), 7) * Math.sign(s || 1);
        gsap.fromTo(el, { yPercent: -distance }, { yPercent: distance, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: motion.scrub, invalidateOnRefresh: true } });
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
          scrollTrigger: { trigger: el, start: motion.revealStart, once: true, onLeave: finishOnLeave },
        });
      });

      // Clip reveal for images
       gsap.utils.toArray<HTMLElement>("[data-gal], [data-clip]").forEach((el) => {
         gsap.fromTo(el, { clipPath: "inset(6% 0 6% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 0.95, ease: "expo.out", scrollTrigger: { trigger: el, start: motion.clipStart, onLeave: finishOnLeave } });
      });

      // Location timeline + map
      const timelinePath = document.querySelector<SVGPathElement>("[data-timeline-path]");
      if (timelinePath) {
        const length = timelinePath.getTotalLength();
        gsap.fromTo(timelinePath, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: "[data-mobility]", start: "top 76%", end: "bottom 48%", scrub: motion.scrub, invalidateOnRefresh: true } });
      }
      gsap.utils.toArray<HTMLElement>("[data-timeline-point]").forEach((el) => {
        const point = el.querySelector("span");
        if (!point) return;
        gsap.fromTo(point, { scale: 0.7 }, { scale: 1, duration: 0.3, scrollTrigger: { trigger: el, start: "top 70%", onLeave: finishOnLeave } });
      });
      gsap.utils.toArray<SVGPathElement>("[data-draw]").forEach((p) => {
        const len = p.getTotalLength();
        gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: "[data-map]", start: "top 82%", end: "bottom 55%", scrub: motion.scrub, invalidateOnRefresh: true } });
      });

      // Bretaye route
      gsap.fromTo("[data-bretaye-line]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-bretaye-track]", start: "top 82%", end: "bottom 45%", scrub: motion.scrub, invalidateOnRefresh: true } });
      gsap.fromTo("[data-bretaye-dot]", { left: "0%" }, { left: "100%", ease: "none", scrollTrigger: { trigger: "[data-bretaye-track]", start: "top 82%", end: "bottom 45%", scrub: motion.scrub, invalidateOnRefresh: true } });

      // Marquee
      marquee.current = gsap.to("[data-marquee]", { xPercent: -50, duration: 48, ease: "none", repeat: -1, paused: true });
      ScrollTrigger.create({
        trigger: "[data-marquee]",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => marquee.current?.play(),
        onEnterBack: () => marquee.current?.play(),
        onLeave: () => marquee.current?.pause(),
        onLeaveBack: () => marquee.current?.pause(),
      });

      // Desktop-only pinned sequences
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-season-step]").forEach((el, index) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom 42%",
            onEnter: () => setActiveSeason(index),
            onEnterBack: () => setActiveSeason(index),
          });
        });
        // Living room expand
        const lv = gsap.timeline({ scrollTrigger: { trigger: "[data-living]", start: "top top", end: "bottom bottom", scrub: motion.scrub, invalidateOnRefresh: true } });
        lv.fromTo("[data-living-frame]", { clipPath: "inset(14% 15% 14% 15%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 }, 0)
          .fromTo("[data-living-img]", { scale: 1.15, yPercent: -4 }, { scale: 1, yPercent: 4, ease: "none", duration: 1 }, 0)
           .from("[data-living-text] > *", { opacity: 0, y: 12, stagger: 0.05, duration: 0.2 }, 0.1)
           .to("[data-living-text] > *", { opacity: 0, y: -10, stagger: 0.03, duration: 0.16 }, 0.84);

        // Bedroom cover
        const bd = gsap.timeline({ scrollTrigger: { trigger: "[data-bedroom]", start: "top top", end: "bottom bottom", scrub: motion.scrub, invalidateOnRefresh: true } });
        bd.from("[data-bed-title] .line-mask > span", { yPercent: 110, stagger: 0.1, duration: 0.25 }, 0)
          .fromTo("[data-bed-img]", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none", duration: 0.48 }, 0.28)
          .fromTo("[data-bed-img] img", { scale: 1.14 }, { scale: 1, ease: "none", duration: 0.65 }, 0.28)
          .fromTo("[data-bed-img2]", { yPercent: 35, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power2.out", duration: 0.22 }, 0.72);

        // Balcony open
        const bc = gsap.timeline({ scrollTrigger: { trigger: "[data-balcony]", start: "top top", end: "bottom bottom", scrub: motion.scrub, invalidateOnRefresh: true } });
        bc.fromTo("[data-bal-frame]", { clipPath: "inset(30% 36% 30% 36%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 0.7 }, 0)
          .fromTo("[data-bal-frame] img", { scale: 1.3 }, { scale: 1.02, ease: "none", duration: 1 }, 0)
           .from("[data-bal-text] > *", { opacity: 0, y: 12, stagger: 0.08, duration: 0.22 }, 0.5);
      });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(refresh, 80);
    const images = Array.from(root.current?.querySelectorAll("img") ?? []);
    images.forEach((image) => {
      if (!image.complete) image.addEventListener("load", refresh, { once: true });
    });
    document.fonts?.ready.then(refresh);
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    ScrollTrigger.refresh();
    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      images.forEach((image) => image.removeEventListener("load", refresh));
      marquee.current = null;
      ctx.revert();
    };
  }, [ready]);

  // Refresh measurements when language changes text length
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [lang]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.8 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={root} className="overflow-x-clip pb-20 md:pb-0">
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
            {langs.map((l, i) => (
              <span key={l} className="flex gap-2">
                {i > 0 && <span className="text-ivory/40">|</span>}
                 <Button variant="ghost" onClick={() => chooseLang(l)} aria-pressed={lang === l} aria-label={l.toUpperCase()} className={`eyebrow h-auto p-0 hover:bg-transparent ${lang === l ? "text-ivory" : "text-ivory/50 hover:text-ivory"}`}>{l.toUpperCase()}</Button>
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
       <section data-living className="relative bg-ivory md:h-[150svh]">
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
       <section data-bedroom className="relative bg-ivory text-charcoal md:h-[170svh]">
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
       <section data-balcony className="relative bg-ivory md:h-[160svh]">
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

      <VillarsLifestyle t={t} activeSeason={activeSeason} onSeasonChange={setActiveSeason} />

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
              <a href={`https://wa.me/41765426230?text=${encodeURIComponent(t.whatsappMessage)}`} target="_blank" rel="noreferrer" className="eyebrow mt-8 self-start border-b border-ivory/40 pb-1 text-ivory/80 transition-colors hover:text-ivory">{t.whatsapp} →</a>
           </div>
        </div>
        <footer className="flex flex-col gap-4 border-t border-ivory/10 px-5 py-8 text-xs text-ivory/40 md:flex-row md:justify-between md:px-12">
           <span>{t.reference} 044598 — Villars-sur-Ollon, Vaud, {t.country}</span>
          <span>{t.rights}</span>
           <span>Villars-sur-Ollon · Vaud</span>
        </footer>
      </section>
       <DossierDialog open={dossierOpen} onOpenChange={setDossierOpen} lang={lang} />
       {pastHero && !contactVisible && !dossierOpen && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ivory/20 bg-swiss-red px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-ivory md:hidden">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <span className="whitespace-nowrap font-serif text-xl tabular-nums">CHF 590'000</span>
              <Button variant="ghost" onClick={() => scrollTo("contact")} className="eyebrow h-auto min-w-0 justify-end gap-2 whitespace-normal p-0 text-right text-[0.58rem] leading-relaxed text-ivory hover:bg-transparent hover:text-ivory">{t.visitCta}<span aria-hidden="true" className="shrink-0">→</span></Button>
           </div>
         </div>
       )}
    </div>
  );
}
