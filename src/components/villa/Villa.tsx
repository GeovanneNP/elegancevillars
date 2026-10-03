import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { dict, type Lang } from "./i18n";
import { img } from "./images";
import { Preloader } from "./Preloader";
import { Gallery } from "./Gallery";

const ids = ["residence", "location", "gallery", "details", "contact"];

function Lines({ lines, className = "" }: { lines: string[]; className?: string }) {
  return (
    <span data-lines className={className}>
      {lines.map((l) => (
        <span key={l} className="line-mask"><span>{l}</span></span>
      ))}
    </span>
  );
}

export function Villa() {
  const [lang, setLang] = useState<Lang>("fr");
  const [ready, setReady] = useState(false);
  const t = dict[lang];
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const marquee = useRef<gsap.core.Tween | null>(null);
  const onDone = useCallback(() => setReady(true), []);

  // Smooth scroll
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.25, easing: (x) => 1 - Math.pow(1 - x, 4) });
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
      gsap.fromTo("[data-hero-img]", { scale: 1.08 }, { scale: 1, duration: 2.4, ease: "power2.out" });
      gsap.from("[data-hero] .line-mask > span", { yPercent: 110, duration: 1.3, stagger: 0.1, ease: "expo.out", delay: 0.1 });
      gsap.from("[data-hero-fade]", { opacity: 0, y: 12, duration: 1, stagger: 0.08, delay: 0.6, ease });

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
        gsap.from(el, { opacity: 0, y: 24, duration: 1.2, ease, scrollTrigger: { trigger: el, start: "top 88%" } });
      });

      // Parallax speeds
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const s = parseFloat(el.dataset["speed"] || "0");
        gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // Counters
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset["count"]!);
        const dec = el.dataset["count"]!.includes(".") ? 1 : 0;
        const o = { v: end > 1000 ? 1980 : 0 };
        gsap.to(o, {
          v: end, duration: 2.2, ease: "power2.out",
          onUpdate: () => { el.textContent = o.v.toFixed(dec); },
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Clip reveal for images
      gsap.utils.toArray<HTMLElement>("[data-gal], [data-clip]").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(12% 0 12% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });

      // Location line + map
      gsap.fromTo("[data-vline]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-distances]", start: "top 70%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>("[data-dist]").forEach((el) => {
        gsap.from(el, { opacity: 0, x: -16, duration: 1, ease, scrollTrigger: { trigger: el, start: "top 80%" } });
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
          .from("[data-living-text] > *", { opacity: 0, y: 30, stagger: 0.08, duration: 0.25 }, 0.15)
          .to("[data-living-text] > *", { opacity: 0, y: -30, stagger: 0.05, duration: 0.2 }, 0.75);

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
          .from("[data-bal-text] > *", { opacity: 0, y: 40, stagger: 0.1, duration: 0.25 }, 0.55);
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

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${form.message}\n\n${form.name}\n${form.email}\n${form.phone}`;
    window.location.href = `mailto:christopher.janin@swsir.ch?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(body)}`;
  };
  const requestDossier = () => {
    window.location.href = `mailto:christopher.janin@swsir.ch?subject=${encodeURIComponent(t.ownCta + " — 044598")}`;
  };

  return (
    <div ref={root} className="overflow-x-clip">
      <Preloader onDone={onDone} />

      {/* NAV */}
      <header className="absolute inset-x-0 top-0 z-40 flex items-start justify-between px-5 py-6 text-ivory md:px-12 md:py-8">
        <div className="leading-tight">
          <div className="eyebrow text-[0.6rem] text-ivory/80">Switzerland</div>
          <div className="font-serif text-lg tracking-wide md:text-xl">Sotheby's <span className="italic">International Realty</span></div>
        </div>
        <nav className="flex items-center gap-6 md:gap-10">
          <ul className="hidden gap-8 md:flex">
            {t.nav.map((n, i) => (
              <li key={n}>
                <button onClick={() => scrollTo(ids[i] ?? "residence")} className="eyebrow relative text-ivory/85 transition-colors hover:text-ivory after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100">
                  {n}
                </button>
              </li>
            ))}
          </ul>
          <div className="eyebrow flex gap-2">
            {(["fr", "en"] as Lang[]).map((l, i) => (
              <span key={l} className="flex gap-2">
                {i > 0 && <span className="text-ivory/40">|</span>}
                <button onClick={() => setLang(l)} className={lang === l ? "text-ivory" : "text-ivory/50 hover:text-ivory"}>{l.toUpperCase()}</button>
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section data-hero className="relative h-svh min-h-[620px] overflow-hidden bg-ink text-ivory">
        <div data-hero-wrap className="absolute inset-0">
          <img data-hero-img src={img.living} alt="Séjour de l'appartement à Villars-sur-Ollon" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative flex h-full flex-col justify-end px-5 pb-28 md:px-12 md:pb-24">
          <div data-hero-title>
            <p data-hero-fade className="eyebrow mb-6 text-ivory/80">{t.heroKicker}</p>
            <h1 className="font-serif text-[13vw] font-light leading-[0.92] tracking-tight md:text-[8.5vw]">
              <Lines lines={t.heroTitle} />
            </h1>
          </div>
          <div data-hero-meta className="mt-10 flex flex-col gap-6 border-t border-ivory/25 pt-6 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {t.heroMeta.map((m) => (
                <li data-hero-fade key={m} className="eyebrow text-ivory/90">{m}</li>
              ))}
            </ul>
            <button data-hero-fade onClick={() => scrollTo("residence")} className="eyebrow group flex items-center gap-4 self-start text-ivory">
              {t.heroCta}
              <span className="h-px w-12 bg-ivory transition-all duration-700 group-hover:w-20" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="eyebrow text-[0.55rem] text-ivory/70">{t.scroll}</span>
          <span className="relative h-10 w-px overflow-hidden bg-ivory/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-ivory" />
          </span>
        </div>
      </section>

      {/* MANIFESTO */}
      <section id="residence" className="grid grid-cols-12 gap-6 bg-ivory px-5 py-32 md:px-12 md:py-56">
        <p data-fade className="eyebrow col-span-12 text-wood md:col-span-3">46°18'N — Villars-sur-Ollon</p>
        <h2 className="col-span-12 font-serif text-[15vw] font-light leading-[0.9] tracking-tight md:col-span-9 md:text-[9vw]">
          <Lines lines={t.manifesto} />
        </h2>
        <div className="col-span-12 mt-10 grid grid-cols-12 md:mt-20">
          <p data-fade className="col-span-12 max-w-md text-lg leading-relaxed text-charcoal/80 md:col-span-4 md:col-start-8">{t.manifestoText}</p>
        </div>
      </section>

      {/* LIVING STORY */}
      <section data-living className="relative bg-ivory md:h-[220vh]">
        <div className="relative h-[80vh] overflow-hidden md:sticky md:top-0 md:h-svh">
          <div data-living-frame className="absolute inset-0 overflow-hidden">
            <img data-living-img src={img.living2} alt="Espace de vie, bois et pierre" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-ink/20" />
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
      <section className="bg-ink px-5 py-32 text-ivory md:px-12 md:py-48">
        <h2 className="max-w-5xl font-serif text-5xl font-light leading-[1.02] md:text-7xl">
          <Lines lines={t.factsTitle} />
        </h2>
        <div className="mt-24 grid grid-cols-2 border-t border-ivory/15 md:grid-cols-4">
          {t.facts.map(([n, l], i) => (
            <div key={l} className={`border-b border-ivory/15 py-10 md:border-b-0 md:py-14 ${i % 2 ? "pl-6" : "pr-6"} md:px-8 ${i > 0 ? "md:border-l" : ""} ${i % 2 ? "border-l" : ""} border-ivory/15`}>
              <div data-count={n} className="font-serif text-7xl font-light tabular-nums lining-nums md:text-8xl">{n}</div>
              <div className="eyebrow mt-4 text-ivory/55">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERIOR */}
      <section className="grid grid-cols-12 items-center gap-6 bg-stone px-5 py-32 md:px-12 md:py-48">
        <div className="relative col-span-12 aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-[5/6]">
          <img data-speed="6" src={img.kitchen} alt="Cuisine ouverte et salle à manger" loading="lazy" className="absolute inset-0 h-[115%] w-full -translate-y-[7%] object-cover" />
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
      <section data-bedroom className="relative bg-ink text-ivory md:h-[260vh]">
        <div className="relative overflow-hidden md:sticky md:top-0 md:h-svh">
          <div data-bed-title className="flex flex-col justify-center px-5 py-32 md:absolute md:inset-0 md:px-12 md:py-0">
            <h2 className="font-serif text-[14vw] font-light leading-[0.92] md:text-[9vw]">
              <span>{t.bedroomTitle.map((l, i) => (
                <span key={l} className={`line-mask ${i === 1 ? "md:pl-[12vw] italic" : ""}`}><span>{l}</span></span>
              ))}</span>
            </h2>
          </div>
          <div data-bed-img className="relative h-[70vh] overflow-hidden md:absolute md:inset-0 md:h-auto">
            <img src={img.bedroom} alt="Chambre avec accès au balcon" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-ink/15" />
          </div>
          <figure data-bed-img2 className="relative mx-5 -mt-24 w-[60%] md:absolute md:bottom-12 md:right-12 md:mx-0 md:mt-0 md:w-[24vw]">
            <img src={img.bedroom2} alt="Détail de la chambre, mur en pierre" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <figcaption className="mt-3 text-xs leading-relaxed text-ivory/75">{t.bedroomCaption}</figcaption>
          </figure>
          <div className="h-16 md:hidden" />
        </div>
      </section>

      {/* BALCONY */}
      <section data-balcony className="relative bg-ivory md:h-[240vh]">
        <div className="relative h-[90vh] overflow-hidden md:sticky md:top-0 md:h-svh">
          <div data-bal-frame className="absolute inset-0 overflow-hidden">
            <img src={img.balcony} alt="Balcon privé avec vue sur les Alpes" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-ink/30" />
          </div>
          <div data-bal-text className="absolute inset-x-5 bottom-14 text-ivory md:inset-x-12 md:bottom-20">
            <h2 className="font-serif text-[16vw] font-light leading-[0.9] md:text-[10vw]">{t.balconyTitle}</h2>
            <p className="mt-6 font-serif text-2xl italic md:ml-[40vw] md:text-3xl">{t.balconySub[0]}<br />{t.balconySub[1]}</p>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="grid grid-cols-12 gap-6 bg-ivory px-5 py-32 md:px-12 md:py-48">
        <div className="col-span-12 md:col-span-6">
          <h2 className="font-serif text-[15vw] font-light leading-[0.9] md:text-[7.5vw]">
            <Lines lines={t.locationTitle} />
          </h2>
          <p data-fade className="mt-10 max-w-md text-lg leading-relaxed text-charcoal/80">{t.locationText}</p>
          <div data-map className="mt-16 max-w-xl">
            <svg viewBox="0 0 600 300" className="w-full text-charcoal" fill="none" stroke="currentColor" aria-label="Carte stylisée des Alpes vaudoises">
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
              <li data-dist key={p} className="relative flex items-baseline justify-between border-b py-7 pl-8">
                <span className="absolute left-[-3px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-wood" />
                <span className="font-serif text-2xl md:text-3xl">{p}</span>
                <span className="eyebrow text-wood">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SEASONS */}
      <section className="relative overflow-hidden bg-ink py-40 text-ivory md:py-56">
        <img data-speed="10" src={img.seasons} alt="Villars sous la neige au crépuscule" loading="lazy" width={1920} height={1088} className="absolute inset-0 h-[120%] w-full -translate-y-[10%] object-cover opacity-60" />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative px-5 md:px-12">
          <h2 className="font-serif text-[16vw] font-light uppercase leading-[0.88] tracking-tight md:text-[11vw]">
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
          <h2 className="font-serif text-[13vw] font-light leading-[0.92] md:text-[7vw]">
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
          <button data-fade onClick={requestDossier} className="eyebrow group mt-10 flex w-full items-center justify-between bg-charcoal px-7 py-6 text-ivory transition-colors hover:bg-ink">
            {t.ownCta}
            <span className="h-px w-10 bg-gold transition-all duration-700 group-hover:w-16" />
          </button>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative bg-ink text-ivory">
        <div className="relative h-[50vh] overflow-hidden">
          <img data-speed="12" src={img.alps} alt="Les Alpes vaudoises à l'aube" loading="lazy" width={1920} height={1088} className="absolute inset-0 h-[130%] w-full -translate-y-[15%] object-cover opacity-80" />
        </div>
        <div className="grid grid-cols-12 gap-6 px-5 py-28 md:px-12 md:py-40">
          <div className="col-span-12 md:col-span-5">
            <h2 className="font-serif text-[14vw] font-light leading-[0.92] md:text-[6.5vw]">
              <Lines lines={t.contactTitle} />
            </h2>
            <p data-fade className="eyebrow mt-12 text-ivory/50">{t.contactText}</p>
            <div data-fade className="mt-8 flex items-center gap-6">
              <img src={img.agent} alt="Christopher Janin" loading="lazy" className="h-24 w-20 object-cover grayscale" />
              <div>
                <div className="font-serif text-3xl">Christopher Janin</div>
                <div className="mt-1 text-sm text-ivory/60">Switzerland | Sotheby's International Realty</div>
              </div>
            </div>
            <div data-fade className="mt-10 space-y-2 font-serif text-2xl">
              <a href="tel:+41795476936" className="block hover:text-gold">+41 79 547 69 36</a>
              <a href="mailto:christopher.janin@swsir.ch" className="block break-all hover:text-gold">christopher.janin@swsir.ch</a>
            </div>
          </div>
          <form data-fade onSubmit={submit} className="col-span-12 mt-10 space-y-8 md:col-span-6 md:col-start-7 md:mt-0">
            {(["name", "email", "phone"] as const).map((f) => (
              <label key={f} className="block border-b border-ivory/25 pb-3 focus-within:border-ivory">
                <span className="eyebrow text-ivory/50">{t.form[f]}</span>
                <input
                  required={f !== "phone"}
                  type={f === "email" ? "email" : f === "phone" ? "tel" : "text"}
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="mt-2 block w-full bg-transparent font-serif text-2xl outline-none"
                />
              </label>
            ))}
            <label className="block border-b border-ivory/25 pb-3 focus-within:border-ivory">
              <span className="eyebrow text-ivory/50">{t.form.message}</span>
              <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 block w-full resize-none bg-transparent font-serif text-2xl outline-none" />
            </label>
            <button type="submit" className="eyebrow group flex items-center gap-5 text-ivory">
              {t.form.send}
              <span className="h-px w-12 bg-gold transition-all duration-700 group-hover:w-20" />
            </button>
          </form>
        </div>
        <footer className="flex flex-col gap-4 border-t border-ivory/10 px-5 py-8 text-xs text-ivory/40 md:flex-row md:justify-between md:px-12">
          <span>Réf. 044598 — Villars-sur-Ollon, Vaud, Switzerland</span>
          <span>{t.rights}</span>
          <span>© {2026} Switzerland | Sotheby's International Realty</span>
        </footer>
      </section>
    </div>
  );
}
