import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import mapWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { Map as MlMap, Marker, StyleSpecification, LayerSpecification } from "maplibre-gl";
import { pois, type Category, type PoiId } from "./locationPlaces";
import mapStyle from "./openfreemap-style.json";

// Map paint cannot read CSS variables: these mirror the --swiss-red / --ivory tokens.
const WINE = "#830b18";
const IVORY = "#f4f1ea";
const BG = "#ffffff";

type Props = {
  names: Record<PoiId, readonly string[]>;
  category: Category;
  activeId: PoiId | null;
  onSelect: (id: PoiId) => void;
  label: string;
  routeLabel: string;
};

function restyleMap(style: StyleSpecification): StyleSpecification {
  const layers: LayerSpecification[] = [];
  for (const layer of style.layers) {
    const id = layer.id.toLowerCase();
    if (layer.type === "raster") continue;
    if (layer.type === "background") {
      layers.push({ ...layer, paint: { "background-color": BG } });
    } else if (layer.type === "fill") {
      if (/park|wood|grass|landcover|forest|wetland|sand|ice|glacier/.test(id)) continue;
      const water = id.includes("water");
      const building = id.includes("building");
      layers.push({ ...layer, paint: { "fill-color": water ? "#f4f1ea" : building ? "#f3e5e4" : BG, "fill-opacity": water ? 0.9 : building ? 0.7 : 1, "fill-antialias": true } } as LayerSpecification);
    } else if (layer.type === "line") {
      const water = id.includes("water") || id.includes("river");
      const boundary = id.includes("boundary");
      const major = /motorway|trunk|primary|rail/.test(id);
      const paint: Record<string, unknown> = { "line-color": water ? "rgba(131,11,24,0.18)" : boundary ? "rgba(131,11,24,0.22)" : major ? "rgba(131,11,24,0.46)" : "rgba(131,11,24,0.2)" };
      const width = (layer.paint as Record<string, unknown> | undefined)?.["line-width"];
      if (width !== undefined) paint["line-width"] = width;
      if (boundary) paint["line-dasharray"] = [2, 2];
      layers.push({ ...layer, paint } as LayerSpecification);
    } else if (layer.type === "symbol") {
      if (/poi|shield|housenumber|aerodrome|transit|airport/.test(id)) continue;
      const paint = { "text-color": "rgba(131,11,24,0.68)", "text-halo-color": BG, "text-halo-width": 1.4 };
      layers.push({ ...layer, paint, layout: { ...(layer.layout ?? {}), "icon-image": "" } } as LayerSpecification);
    }
  }
  const sources = { ...style.sources };
  delete (sources as Record<string, unknown>)["ne2_shaded"];
  return { ...style, sources, layers };
}

function boundsFor(category: Category): [[number, number], [number, number]] {
  const set = pois.filter((p) => p.id === "villars" || p.category === category);
  const lngs = set.map((p) => p.lngLat[0]);
  const lats = set.map((p) => p.lngLat[1]);
  return [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
}

export function LocationMap({ names, category, activeId, onSelect, label, routeLabel }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markers = useRef<Map<PoiId, { marker: Marker; el: HTMLButtonElement }>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!container.current) return;
    let cancelled = false;
    (async () => {
      const maplibregl = await import("maplibre-gl");
      maplibregl.setWorkerUrl(mapWorkerUrl);
      const style = restyleMap(mapStyle as StyleSpecification);
      if (cancelled || !container.current) return;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const map = new maplibregl.Map({
        container: container.current,
        style,
        bounds: boundsFor("lifestyle"),
        fitBoundsOptions: { padding: 80 },
        attributionControl: { compact: true },
        scrollZoom: false,
        dragPan: !isTouch,
        touchZoomRotate: false,
        dragRotate: false,
        pitchWithRotate: false,
        cooperativeGestures: false,
      });
      mapRef.current = map;
      map.on("load", () => {
        const villarsPoi = pois.find((p) => p.id === "villars");
        const rocPoi = pois.find((p) => p.id === "roc");
        if (!villarsPoi || !rocPoi) return;
        const villars = villarsPoi.lngLat;
        const roc = rocPoi.lngLat;
        map.addSource("route", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [villars, roc] } } });
        map.addLayer({ id: "route", type: "line", source: "route", paint: { "line-color": WINE, "line-width": 2, "line-dasharray": [2, 1.5] } });
        map.resize();
        setReady(true);
      });
      for (const poi of pois) {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "loc-marker";
        el.dataset["id"] = poi.id;
        el.dataset["tier"] = String(poi.tier);
        el.innerHTML = `<span class="loc-dot"></span><span class="loc-label"><span class="loc-name"></span><span class="loc-sub"></span></span>`;
        el.addEventListener("click", () => onSelectRef.current(poi.id));
        const marker = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat(poi.lngLat).addTo(map);
        markers.current.set(poi.id, { marker, el });
      }
      setReady((r) => r);
    })().catch((error) => {
      if (!cancelled) {
        setFailed(true);
        console.error("Map failed to load", error);
      }
    });
    const resize = () => mapRef.current?.resize();
    window.addEventListener("resize", resize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
      markers.current.forEach(({ marker }) => marker.remove());
      markers.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Labels and highlighted state
  useEffect(() => {
    markers.current.forEach(({ el }, id) => {
      const poi = pois.find((p) => p.id === id);
      if (!poi) return;
      const name = names[id][0] ?? ""; const sub = names[id][1] ?? "";
      (el.querySelector(".loc-name") as HTMLElement).textContent = name;
      (el.querySelector(".loc-sub") as HTMLElement).textContent = sub;
      el.setAttribute("aria-label", `${name} — ${sub}`);
      const inCategory = poi.category === category || poi.category === "origin";
      el.dataset["state"] = id === activeId ? "active" : inCategory ? "on" : "off";
      el.dataset["primary"] = poi.primary || poi.category === "origin" ? "true" : "false";
      el.tabIndex = inCategory ? 0 : -1;
    });
  }, [names, category, activeId, ready]);

  // Camera + line: travel to frame the apartment and the active place, drawing the link as it flies.
  const lineEnd = useRef<[number, number] | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const villarsPoi = pois.find((p) => p.id === "villars");
    const poi = pois.find((p) => p.id === activeId) ?? villarsPoi;
    if (!villarsPoi || !poi) return;
    const villars = villarsPoi.lngLat;
    const target = poi.lngLat;
    const src = map.getSource("route") as { setData: (d: unknown) => void } | undefined;
    const setLine = (end: [number, number]) => {
      lineEnd.current = end;
      src?.setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [villars, end] } });
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    const pad = small ? { top: 70, bottom: 70, left: 50, right: 50 } : { top: 120, bottom: 120, left: 110, right: 190 };
    const lngs = [villars[0], target[0]]; const lats = [villars[1], target[1]];
    const cam = map.cameraForBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: pad, maxZoom: 14.5 });
    if (!cam?.center) return;
    const zoom = Math.max(cam.zoom ?? 12, poi.tier >= 2 ? 9 : 11.5) - (poi.id === "villars" ? 1.5 : 0);
    map.stop();
    if (reduce) {
      map.jumpTo({ center: cam.center, zoom });
      setLine(target);
      return;
    }
    const from = map.getCenter();
    const dist = Math.hypot(from.lng - target[0], from.lat - target[1]);
    const duration = Math.min(1600, Math.max(900, 900 + dist * 4000));
    map.flyTo({ center: cam.center, zoom, duration, curve: 1.2, essential: true, easing: (t) => 1 - Math.pow(1 - t, 3) });
    // Line grows from the apartment to the place; start from a short stub so it reads as a new link.
    let raf = 0; const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - k, 3);
      setLine([villars[0] + (target[0] - villars[0]) * e, villars[1] + (target[1] - villars[1]) * e]);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const finish = () => setLine(target);
    map.once("moveend", finish);
    return () => { cancelAnimationFrame(raf); map.off("moveend", finish); };
  }, [activeId, ready]);

  return (
    <div className="relative h-full w-full bg-paper">
      <div ref={container} role="region" aria-label={label} className="loc-map h-full w-full" />
      {!ready && !failed && <div className="pointer-events-none absolute inset-0 bg-paper" aria-hidden="true" />}
      {failed && (
        <div className="absolute inset-0 grid place-items-center bg-ivory px-8 text-center">
          <a href="https://www.openstreetmap.org/?mlat=46.2989&mlon=7.0556#map=15/46.2989/7.0556" target="_blank" rel="noreferrer" className="font-serif text-2xl text-swiss-red underline decoration-swiss-red/30 underline-offset-8">
            Villars-sur-Ollon
          </a>
        </div>
      )}
      <p className="pointer-events-none absolute bottom-8 left-4 max-w-[65%] font-sans text-sm md:bottom-3 md:text-base leading-relaxed tracking-[0.08em] text-swiss-red/80">
        <span className="mr-2 inline-block h-px w-5 align-middle" style={{ background: WINE, borderTop: `1px dashed ${IVORY}00` }} />
        {routeLabel}
      </p>
    </div>
  );
}
