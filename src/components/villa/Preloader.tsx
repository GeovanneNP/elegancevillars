import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import logo from "@/assets/brodard-logo.png.asset.json";

export function Preloader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("villars-intro");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setShow(false);
      onDone();
      return;
    }
    sessionStorage.setItem("villars-intro", "1");
    document.documentElement.style.overflow = "hidden";
    const el = ref.current;
    if (!el) {
      document.documentElement.style.overflow = "";
      onDone();
      return;
    }
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setShow(false);
      },
    });
    tl.from(el.querySelector("[data-pl-logo]"), { opacity: 0, y: 18, duration: 0.8, ease: "power3.out" })
      .fromTo(el.querySelector("[data-pl-line]"), { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, "-=0.3")
      .from(el.querySelector("[data-pl-tag]"), { opacity: 0, duration: 0.35 }, "-=0.25")
      .call(onDone, [], "+=0.05")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.55, ease: "expo.inOut" });
    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, [onDone]);

  if (!show) return null;
  return (
    <div
      ref={ref}
      style={{ clipPath: "inset(0 0 0% 0)" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-swiss-red text-ivory"
    >
      <div className="flex w-[min(84vw,560px)] flex-col items-center text-center">
        <img data-pl-logo src={logoWebp} alt="Brodard Property" width={440} height={164} className="w-full object-contain" />
        <div data-pl-line className="mt-8 h-px w-full origin-left bg-ivory/40" />
        <span data-pl-tag className="eyebrow mt-5 text-ivory/75">Villars-sur-Ollon · Suisse</span>
      </div>
    </div>
  );
}
