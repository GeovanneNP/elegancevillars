import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

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
    if (!el) return;
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setShow(false);
      },
    });
    tl.from(el.querySelectorAll("[data-pl-text]"), { yPercent: 110, duration: 0.55, stagger: 0.06, ease: "power3.out" })
      .fromTo(el.querySelector("[data-pl-line]"), { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, "-=0.3")
      .from(el.querySelector("[data-pl-tag]"), { opacity: 0, duration: 0.35 }, "-=0.25")
      .call(onDone, [], "+=0.05")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.65, ease: "expo.inOut" });
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-ivory"
    >
      <div className="flex w-[min(80vw,420px)] flex-col items-center text-center">
        <div className="flex w-full items-end justify-between">
          <span className="line-mask"><span data-pl-text className="font-serif text-4xl tracking-[0.2em]">VILLARS</span></span>
          <span className="line-mask"><span data-pl-text className="eyebrow text-ivory/60">46°18'N</span></span>
        </div>
        <div data-pl-line className="my-5 h-px w-full origin-left bg-ivory/40" />
        <div className="flex w-full items-start justify-between">
          <span className="line-mask"><span data-pl-text className="eyebrow text-ivory/60">Swiss Alps</span></span>
          <span data-pl-tag className="font-serif text-xl italic text-ivory/90">Élégance alpine</span>
        </div>
      </div>
    </div>
  );
}
