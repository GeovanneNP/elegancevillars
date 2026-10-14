import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { dict, langs, type Lang } from "./i18n";
import { Link } from "@tanstack/react-router";
import { HTML_LANG, LANG_PATH } from "./seo";
import { img } from "./images";
import { Preloader } from "./Preloader";
import { Gallery } from "./Gallery";
import { VirtualTour } from "./VirtualTour";
import { DossierDialog } from "./DossierDialog";
import { ConsentBanner, openCookieSettings } from "./ConsentBanner";
import { track } from "@/lib/tracking";
import { VillarsLifestyle } from "./VillarsLifestyle";
import { HeroVideo } from "./HeroVideo";
import { Button } from "@/components/ui/button";
import logo from "@/assets/brodard-logo.png.asset.json";
import { Link } from "@tanstack/react-router";
import { getVisitUrl } from "./visit";
import { MessageCircle } from "lucide-react";

const CONTACT_EMAIL = "gregory.brodard@pfgbrodard.ch";
const CONTACT_PHONE = "+41 76 253 24 22";
const CONTACT_PHONE_LINK = "+41762532422";

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
      {lines.map((l, index) => (
         <span key={index} className="line-mask"><span>{l}{" "}</span></span>
      ))}
    </span>
  );
}

export function Villa({ lang }: { lang: Lang }) {
  const [ready, setReady] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeSeason, setActiveSeason] = useState(0);
  const t = dict[lang];
  const root = useRef<HTMLDivElement>(null);
  const mobileVisitBar = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const marquee = useRef<gsap.core.Tween | null>(null);
  const onDone = useCallback(() => setReady(true), []);
  const visitUrl = getVisitUrl(lang);

  // Language comes from the URL (/, /en, /de); no browser-based switching or redirect.
  useEffect(() => { document.documentElement.lang = HTML_LANG[lang]; window.localStorage.setItem("villars-lang", lang); }, [lang]);
  const chooseLang = (l: Lang) => { if (l !== lang) track("change_language", { from_language: lang, to_language: l, interaction_type: "language_switch" }); };

  // Tracking: one property view per page load + delegated contact clicks (no PII in params).
  useEffect(() => {
    track("view_property", { property_type: "apartment", location: "Villars-sur-Ollon" }, { onceKey: "view_property" });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const section = a.closest("section, footer, [data-hero]")?.getAttribute("id") || (a.closest(".fixed") ? "floating_cta" : "page");
      if (href.includes("wa.me/")) track("contact_whatsapp", { button_location: section, interaction_type: "click" });
      else if (href.startsWith("tel:")) track("contact_click", { contact_method: "phone", button_location: section, interaction_type: "click" });
      else if (href.startsWith("mailto:")) track("contact_click", { contact_method: "email", button_location: section, interaction_type: "click" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
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

  useEffect(() => {
    const bar = mobileVisitBar.current;
    const page = root.current;
    if (!bar || !page) return;
    const update = () => page.style.setProperty("--mobile-visit-height", `${bar.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(update);
    observer.observe(bar);
    update();
    return () => {
      observer.disconnect();
      page.style.removeProperty("--mobile-visit-height");
    };
  }, [dossierOpen, galleryOpen, lang]);

  // Scroll choreography
  useEffect(() => {
    if (!ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let mm: gsap.MatchMedia | undefined;
    const ctx = gsap.context(() => {
      const finishOnLeave = (self: ScrollTrigger) => self.animation?.progress(1);
      mm = gsap.matchMedia();

      // Hero intro
      gsap.fromTo("[data-hero-img]", { scale: 1.045 }, { scale: 1, duration: 1.8, ease: "power2.out" });
      gsap.from("[data-hero] .line-mask > span", { yPercent: 105, duration: 1.05, stagger: 0.08, ease: "expo.out", delay: 0.05 });
      gsap.from("[data-hero-fade]", { opacity: 0, duration: 0.8, stagger: 0.06, delay: 0.4, ease: motion.ease });

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
      mm.add("(min-width: 768px)", () => {
        const heroTl = gsap.timeline({ scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom 12%", scrub: motion.scrub, invalidateOnRefresh: true } });
        heroTl.to("[data-hero-wrap]", { scale: 1.075, ease: "none" }, 0)
          .to("[data-hero-title]", { yPercent: -24, ease: "none" }, 0)
          .to("[data-hero-meta]", { opacity: 0, y: -20, ease: "none" }, 0);

        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          const s = parseFloat(el.dataset["speed"] || "0");
          const distance = Math.min(Math.abs(s), 7) * Math.sign(s || 1);
          gsap.fromTo(el, { yPercent: -distance }, { yPercent: distance, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: motion.scrub, invalidateOnRefresh: true } });
        });

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
    let refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    const refresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
    };
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
      mm?.revert();
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
    if (lenisRef.current) lenisRef.current.scrollTo(el, {
      duration: 1.8,
      ...(id === "visite-virtuelle" ? { onComplete: () => lenisRef.current?.scrollTo(el, { immediate: true }) } : {}),
    });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={root} className="villa-page overflow-x-clip pb-[calc(var(--mobile-visit-height,5rem)+1.5rem)] md:pb-0">
      <Preloader onDone={onDone} />

      {/* NAV */}
       <header className="relative z-40 grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 bg-swiss-red px-5 py-3 text-ivory md:flex md:min-h-24 md:justify-between md:px-12">
         <a href="#top" aria-label="Brodard Property — Villars-sur-Ollon" className="block min-w-0 w-28 sm:w-36 md:w-56">
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
           <div className="eyebrow flex shrink-0 gap-0 sm:gap-2">
            {langs.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                {i > 0 && <span className="hidden text-ivory/40 sm:inline">|</span>}
                 <Button asChild variant="ghost" className={`eyebrow h-11 w-11 p-0 sm:h-auto sm:w-auto hover:bg-transparent ${lang === l ? "text-ivory" : "text-ivory/50 hover:text-ivory"}`}>
                   <Link to={LANG_PATH[l]} hrefLang={HTML_LANG[l]} onClick={() => chooseLang(l)} aria-current={lang === l ? "page" : undefined} aria-label={l.toUpperCase()}>{l.toUpperCase()}</Link>
                 </Button>
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* HERO */}
        <section id="top" data-hero className="relative overflow-hidden bg-ivory text-charcoal">
        <div data-hero-wrap className="relative aspect-video w-full overflow-hidden bg-charcoal md:aspect-auto md:h-[calc(100svh-6rem)] md:max-h-[64vw] md:min-h-[480px]">
            <HeroVideo label={t.filmPlay} />
            <p className="eyebrow pointer-events-none absolute bottom-3 left-5 text-ivory [text-shadow:0_1px_12px_rgb(0_0_0/0.55)] md:bottom-8 md:left-12">Villars-sur-Ollon · 1'250 m</p>
        </div>
        <div className="relative px-5 pb-16 pt-10 md:px-12 md:pb-24 md:pt-16">
          <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-12">
            <div data-hero-title className="md:col-span-8">
              <p data-hero-fade className="eyebrow mb-5 text-swiss-red md:mb-6">{t.heroKicker}</p>
              <h1 className="max-w-full font-serif text-5xl font-light leading-[1] text-charcoal min-[360px]:text-[3.3rem] min-[420px]:text-6xl sm:text-7xl md:text-8xl md:leading-[0.95] lg:text-9xl">
                <Lines lines={t.heroTitle} />
              </h1>
            </div>
            <div data-hero-fade className="grid gap-5 md:col-span-4 md:pb-3">
              <a href={visitUrl} target="_blank" rel="noreferrer" className="eyebrow flex min-h-14 w-full items-center justify-between gap-3 bg-swiss-red px-6 text-ivory transition-colors hover:bg-charcoal">
                <span className="min-w-0 break-words">{t.visitCta}</span><span aria-hidden="true">→</span>
              </a>
              <Button variant="ghost" onClick={() => scrollTo("residence")} className="eyebrow group flex h-auto min-h-12 w-full items-center justify-between gap-3 whitespace-normal border-b border-charcoal/30 p-0 pb-3 text-left text-charcoal hover:bg-transparent hover:text-swiss-red">
                <span className="min-w-0 break-words">{t.heroCta}</span><span className="h-px w-8 shrink-0 bg-current transition-all duration-700 group-hover:w-12" />
              </Button>
              <Button asChild variant="ghost" className="flex h-auto min-h-12 w-full items-center justify-between gap-3 whitespace-normal border-b border-charcoal/30 p-0 pb-3 text-left text-base text-swiss-red hover:bg-transparent hover:text-charcoal">
                <a href="#visite-virtuelle" onClick={(event) => { event.preventDefault(); scrollTo("visite-virtuelle"); }}><span>{t.virtualTour.label}</span><span aria-hidden="true">↗</span></a>
              </Button>
            </div>
          </div>
          <div data-hero-meta className="mt-10 border-t border-charcoal/20 pt-5 md:mt-14 md:pt-6">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 min-[390px]:flex min-[390px]:flex-wrap min-[390px]:gap-x-10">
              {t.heroMeta.map((m) => (
                <li data-hero-fade key={m} className="eyebrow text-charcoal/80">{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* LIVING STORY */}
        <section id="residence" data-living className="relative bg-ivory md:h-[150svh]">
         <div className="relative h-[78svh] overflow-hidden md:sticky md:top-0 md:h-svh">
          <div data-living-frame className="absolute inset-0 overflow-hidden">
             <img data-living-img src={img.living2} alt={t.imageAlts.living} loading="lazy" className="absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover object-[center_62%] md:inset-0 md:h-full md:object-center" />
              <div className="absolute inset-0 bg-swiss-red/30 md:bg-swiss-red/20" />
          </div>
          <div data-living-text className="absolute bottom-10 inset-x-5 text-ivory md:bottom-16 md:left-12 md:right-auto">
            <p className="eyebrow mb-4 text-ivory/95 md:text-ivory/80">01</p>
            <p className="mb-6 font-serif text-3xl italic md:text-6xl">{t.livingTitle}</p>
            {t.livingWords.map((w) => (
              <p key={w} className="font-serif text-2xl font-light md:text-3xl">{w}</p>
            ))}
          </div>
        </div>
      </section>

      {/* FACTS */}
       <section className="bg-swiss-red px-5 py-24 text-ivory md:px-12 md:py-48">
        <h2 className="max-w-5xl font-serif text-4xl font-light leading-[1.02] md:text-7xl">
          <Lines lines={t.factsTitle} />
        </h2>
         <div className="mt-16 grid grid-cols-2 border-t border-ivory/15 md:mt-24 md:grid-cols-4">
          {t.facts.map(([n, l], i) => (
            <div key={l} className={`border-b border-ivory/15 py-10 md:border-b-0 md:py-14 ${i % 2 ? "pl-6" : "pr-6"} md:px-8 ${i > 0 ? "md:border-l" : ""} ${i % 2 ? "border-l" : ""} border-ivory/15`}>
               <div data-count={n} className="font-serif text-5xl font-light tabular-nums lining-nums md:text-8xl">{n}</div>
              <div className="eyebrow mt-4 text-ivory/55">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERIOR */}
       <section className="grid grid-cols-12 items-center gap-6 bg-stone px-5 py-24 md:px-12 md:py-48">
        <div className="relative col-span-12 aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-[5/6]">
           <img data-speed="6" src={img.kitchen} alt={t.imageAlts.kitchen} loading="lazy" className="absolute inset-0 h-[115%] w-full -translate-y-[7%] object-cover" />
        </div>
        <div className="col-span-12 md:col-span-4 md:col-start-9">
          <p data-fade className="eyebrow mb-8 text-wood">{t.interiorKicker}</p>
          <h3 className="font-serif text-4xl font-light leading-[1.06] sm:text-5xl md:text-6xl md:leading-[1.02]">
            <Lines lines={t.interiorTitle} />
          </h3>
          <p data-fade className="mt-10 leading-relaxed text-charcoal/80">{t.interiorText}</p>
          <div data-fade className="mt-10 h-px w-16 bg-gold" />
        </div>
      </section>

      {/* BEDROOM */}
       <section data-bedroom className="relative bg-ivory text-charcoal md:h-[185svh]">
         <div className="relative overflow-hidden md:sticky md:top-0 md:h-svh">
           <div data-bed-title className="flex flex-col justify-center px-5 py-24 md:absolute md:inset-0 md:px-12 md:py-0">
             <h2 className="font-serif text-5xl font-light leading-[0.96] sm:text-6xl md:text-8xl md:leading-[0.92] lg:text-9xl">
               <span>{t.bedroomTitle.map((l, i) => (
                 <span key={i} className={`line-mask ${i === 1 ? "md:pl-[12vw] italic" : ""}`}><span>{l}</span></span>
              ))}</span>
            </h2>
          </div>
          <div data-bed-img className="relative h-[70vh] overflow-hidden md:absolute md:inset-0 md:h-auto">
             <img src={img.bedroom} alt={t.imageAlts.bedroom} loading="lazy" className="h-full w-full object-cover" />
             <div className="absolute inset-0 bg-swiss-red/10" />
          </div>
        </div>
         <figure data-bed-img2 className="relative w-full bg-ivory px-5 py-8 md:absolute md:bottom-0 md:left-0 md:z-10 md:w-[58vw] md:px-12 md:py-10">
            <img src={img.bedroom2} alt={t.imageAlts.bedroomDetail} loading="lazy" width={1600} height={2000} className="aspect-[4/3] w-full object-cover object-center" />
            <figcaption className="mt-3 text-sm leading-relaxed text-charcoal/75">{t.bedroomCaption}</figcaption>
         </figure>
      </section>

      {/* BALCONY */}
       <section data-balcony className="relative bg-ivory md:h-[160svh]">
        <div className="relative h-[90vh] overflow-hidden md:sticky md:top-0 md:h-svh">
          <div data-bal-frame className="absolute inset-0 overflow-hidden">
             <img src={img.balcony} alt={t.imageAlts.balcony} loading="lazy" className="h-full w-full object-cover object-[58%_center] md:object-center" />
              <div className="absolute inset-0 bg-swiss-red/30" />
          </div>
          <div data-bal-text className="absolute inset-x-5 bottom-14 text-ivory md:inset-x-12 md:bottom-20">
             <h2 className="font-serif text-5xl font-light leading-[0.94] sm:text-6xl md:text-8xl md:leading-[0.9] lg:text-9xl">{t.balconyTitle}</h2>
            <p className="mt-6 font-serif text-2xl italic md:ml-[40vw] md:text-3xl">{t.balconySub[0]}<br />{t.balconySub[1]}</p>
          </div>
        </div>
      </section>

      {/* DETAILS */}
       <section id="details" className="grid grid-cols-12 gap-6 bg-ivory px-5 py-24 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-4">
          <h2 className="font-serif text-5xl font-light leading-[1.04] sm:text-6xl md:sticky md:top-24 md:text-7xl md:leading-[1.02]">
            <Lines lines={[t.detailsTitle]} />
          </h2>
        </div>
        <dl className="col-span-12 border-t md:col-span-7 md:col-start-6">
          {t.details.map(([k, v]) => (
            <div data-fade key={k} className="grid grid-cols-1 gap-2 border-b py-5 min-[520px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] min-[520px]:gap-4">
              <dt className="eyebrow min-w-0 self-center text-muted-foreground">{k}</dt>
              <dd className="min-w-0 break-words font-serif text-2xl sm:text-3xl">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* AMENITIES */}
      <section
        className="overflow-hidden border-y bg-stone py-10 text-swiss-red"
        onMouseEnter={() => marquee.current && gsap.to(marquee.current, { timeScale: 0.25, duration: 0.8 })}
        onMouseLeave={() => marquee.current && gsap.to(marquee.current, { timeScale: 1, duration: 0.8 })}
      >
        <div data-marquee className="flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex" aria-hidden={k === 1}>
              {t.amenities.map((a) => (
                <span key={a} className="flex items-center font-serif text-5xl font-light uppercase md:text-7xl">
                  <span className="px-8">{a}</span>
                  <span className="h-2 w-2 rounded-full bg-swiss-red" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>


      <Gallery t={t} visitUrl={visitUrl} onOpenChange={setGalleryOpen} />
      <VirtualTour t={t} lang={lang} visitUrl={visitUrl} />

      {/* OWNERSHIP */}
       <section className="relative grid grid-cols-12 gap-6 overflow-hidden bg-stone px-5 py-24 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-7">
           <h2 className="font-serif text-5xl font-light leading-[0.96] sm:text-6xl md:text-7xl md:leading-[0.92] lg:text-8xl">
            <Lines lines={t.ownTitle} />
          </h2>
          <p data-fade className="mt-10 max-w-md text-lg leading-relaxed text-charcoal/80">{t.ownText}</p>
        </div>
        <div className="col-span-12 self-end md:col-span-4 md:col-start-9">
          <div data-fade className="border-t py-6">
            <div className="eyebrow text-muted-foreground">{t.price}</div>
             <div className="mt-3 font-serif text-4xl sm:text-5xl">CHF 610'000.-</div>
          </div>
          <div data-fade className="border-y py-6">
            <div className="eyebrow text-muted-foreground">{t.availability}</div>
            <div className="mt-3 font-serif text-3xl">{t.availabilityValue}</div>
          </div>
            <Button asChild variant="default" data-fade className="eyebrow group mt-10 flex h-auto w-full items-center justify-between bg-swiss-red px-7 py-6 text-ivory transition-colors hover:bg-swiss-red/85">
              <a href={visitUrl} target="_blank" rel="noreferrer"><span>{t.ownCta}</span><span className="h-px w-10 bg-gold transition-all duration-700 group-hover:w-16" /></a>
            </Button>
            <Button variant="ghost" data-fade onClick={() => { track("request_dossier", { button_location: "price", interaction_type: "open_form" }); setDossierOpen(true); }} className="eyebrow group mt-5 flex h-auto w-full items-center justify-between p-0 py-3 text-charcoal hover:bg-transparent hover:text-swiss-red">
              {t.dossierCta}<span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Button>
        </div>
      </section>

      <VillarsLifestyle t={t} activeSeason={activeSeason} onSeasonChange={setActiveSeason} />

      {/* CONTACT */}
       <section id="contact" className="relative bg-swiss-red text-ivory">
        <div className="relative h-[50vh] overflow-hidden">
           <img data-speed="12" src={img.alps} alt={t.imageAlts.alps} loading="lazy" width={1920} height={1088} className="absolute inset-0 h-[130%] w-full -translate-y-[15%] object-cover opacity-80" />
        </div>
        <div className="grid grid-cols-12 gap-6 px-5 py-28 md:px-12 md:py-40">
          <div className="col-span-12 md:col-span-5">
             <h2 className="font-serif text-5xl font-light leading-[0.96] sm:text-6xl md:text-7xl md:leading-[0.92] lg:text-8xl">
              <Lines lines={t.contactTitle} />
            </h2>
            <p data-fade className="eyebrow mt-12 text-ivory/85 md:text-ivory/70">{t.contactText}</p>
             <div data-fade className="mt-10 h-px w-16 bg-ivory/40" />
          </div>
           <div data-fade className="col-span-12 mt-10 flex flex-col justify-end border-t border-ivory/20 pt-8 md:col-span-5 md:col-start-8 md:mt-0">
               <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.mailSubject)}`} className="break-all font-serif text-2xl leading-snug text-ivory transition-colors hover:text-gold sm:text-3xl md:text-4xl" aria-label={`${t.contactEmail}: ${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
               <a href={`tel:${CONTACT_PHONE_LINK}`} className="mt-6 self-start font-serif text-3xl leading-snug text-ivory transition-colors hover:text-gold md:text-4xl" aria-label={`${t.contactPhone}: ${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>
               <a href={visitUrl} target="_blank" rel="noreferrer" className="eyebrow mt-8 self-start border-b border-ivory/40 pb-1 text-ivory/80 transition-colors hover:text-ivory">{t.whatsapp} →</a>
           </div>
        </div>
         <footer className="grid gap-4 border-t border-ivory/10 px-5 py-8 text-sm leading-relaxed text-ivory/60 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-12">
           <span>{t.reference} 044598 — Villars-sur-Ollon, Vaud, {t.country}</span>
           <span className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end"><span>{t.rights}</span><Link to="/legal" className="text-ivory/70 underline decoration-ivory/30 underline-offset-4 hover:text-ivory">{t.legal}</Link><Link to="/privacy" className="text-ivory/70 underline decoration-ivory/30 underline-offset-4 hover:text-ivory">{t.privacy}</Link><button type="button" onClick={openCookieSettings} className="text-ivory/70 underline decoration-ivory/30 underline-offset-4 hover:text-ivory">Cookies</button></span>
        </footer>
      </section>
       <DossierDialog open={dossierOpen} onOpenChange={setDossierOpen} lang={lang} />
       <ConsentBanner lang={lang} />
        {!dossierOpen && !galleryOpen && (
          <>
           <div ref={mobileVisitBar} className="fixed inset-x-0 bottom-0 z-40 border-t border-ivory/25 bg-swiss-red px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-ivory md:hidden">
            <div className="grid grid-cols-1 items-center gap-2 min-[380px]:grid-cols-[auto_minmax(0,1fr)] min-[380px]:gap-3">
               <span className="hidden whitespace-nowrap font-serif text-xl tabular-nums min-[380px]:inline">CHF 610'000.-</span>
              <Button asChild variant="ghost" className="eyebrow h-auto min-h-12 min-w-0 w-full justify-center gap-3 whitespace-normal p-0 text-center leading-snug tracking-[0.08em] text-ivory hover:bg-transparent hover:text-ivory min-[380px]:justify-end min-[380px]:text-right min-[380px]:tracking-normal"><a href={visitUrl} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" className="size-5 shrink-0" /><span className="min-w-0 break-words">{t.visitCta}</span></a></Button>
           </div>
         </div>
          <Button asChild className="eyebrow fixed bottom-8 right-8 z-40 hidden h-auto min-w-64 max-w-[calc(100vw-4rem)] items-center justify-between gap-4 whitespace-normal rounded-none border border-ivory/25 bg-swiss-red px-7 py-6 text-ivory hover:bg-swiss-red/90 md:flex"><a href={visitUrl} target="_blank" rel="noopener noreferrer">{t.visitCta}<MessageCircle aria-hidden="true" className="size-5 shrink-0" /></a></Button>
          </>
       )}
    </div>
  );
}
