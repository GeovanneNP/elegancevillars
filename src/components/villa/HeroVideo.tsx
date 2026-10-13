import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import film1080 from "@/assets/villars-film-1080.mp4.asset.json";
import film720 from "@/assets/villars-film-720.mp4.asset.json";
import poster from "@/assets/villars-film-poster.jpg.asset.json";

export function HeroVideo({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.src = window.matchMedia("(max-width: 767px)").matches ? film720.url : film1080.url;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <>
      <video
        ref={ref}
        data-hero-img
        poster={poster.url}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={label}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Son / Sound" : "Muet / Mute"}
        aria-pressed={!muted}
        className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/70 bg-swiss-red/40 text-ivory backdrop-blur-sm md:right-12 md:top-8"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </>
  );
}
