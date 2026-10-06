import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Map as MlMap, Marker, StyleSpecification, LayerSpecification } from "maplibre-gl";
import { pois, type Category, type PoiId } from "./locationPlaces";

// Map paint cannot read CSS variables: these mirror the --swiss-red / --ivory tokens.
const WINE = "#830b18";
const IVORY = "#f4f1ea";
const BG = "#141313";
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

type Props = {
  names: Record<PoiId, readonly string[]>;
  category: Category;
  activeId: PoiId | null;
  onSelect: (id: PoiId) => void;
  label: string;
  routeLabel: string;
};

function darken(style: StyleSpecification): StyleSpecification {
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
      layers.push({ ...layer, paint: { "fill-color": water ? "#242322" : building ? "#1f1e1d" : "#181717", "fill-opacity": water ? 1 : 0.8, "fill-antialias": true } } as LayerSpecification);
    } else if (layer.type === "line") {
      const water = id.includes("water") || id.includes("river");
      const boundary = id.includes("boundary");
      const major = /motorway|trunk|primary|rail/.test(id);
      const paint: Record<string, unknown> = { "line-color": water ? "#2c2b2a" : boundary ? "rgba(244,241,234,0.12)" : major ? "rgba(244,241,234,0.26)" : "rgba(244,241,234,0.12)" };
      const width = (layer.paint as Record<string, unknown> | undefined)?.["line-width"];
      if (width !== undefined) paint["line-width"] = width;
      if (boundary) paint["line-dasharray"] = [2, 2];
      layers.push({ ...layer, paint } as LayerSpecification);
    } else if (layer.type === "symbol") {
      if (/poi|shield|housenumber|aerodrome|transit|airport/.test(id)) continue;
      const paint = { "text-color": "rgba(244,241,234,0.42)", "text-halo-color": BG, "text-halo-width": 1.2 };
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry?.isIntersecting && setVisible(true), { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !container.current) return;
    let cancelled = false;
    (async () => {
      const [maplibregl, res] = await Promise.all([import("maplibre-gl"), fetch(STYLE_URL)]);
      const style = darken((await res.json()) as StyleSpecification);
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
        const villars = pois.find((p) => p.id === "villars")!.lngLat;
        const roc = pois.find((p) => p.id === "roc")!.lngLat;
        map.addSource("route", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [villars, roc] } } });
        map.addLayer({ id: "route", type: "line", source: "route", paint: { "line-color": WINE, "line-width": 2, "line-dasharray": [2, 1.5] } });
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
    })().catch((error) => console.error("Map failed to load", error));
    return () => {
      cancelled = true;
      markers.current.forEach(({ marker }) => marker.remove());
      markers.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [visible]);

  // Labels and highlighted state
  useEffect(() => {
    markers.current.forEach(({ el }, id) => {
      const poi = pois.find((p) => p.id === id)!;
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

  // Camera
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    map.fitBounds(boundsFor(category), { padding: small ? 48 : 96, duration: reduce ? 0 : 1400, essential: true, maxZoom: 14.2 });
  }, [category, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !activeId) return;
    const poi = pois.find((p) => p.id === activeId);
    if (!poi || poi.tier === 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.easeTo({ center: poi.lngLat, zoom: Math.min(map.getZoom() + 0.25, 15), duration: reduce ? 0 : 1100 });
  }, [activeId, ready]);

  return (
    <div className="relative h-full w-full" style={{ background: BG }}>
      <div ref={container} role="region" aria-label={label} className="loc-map h-full w-full" />
      <p className="eyebrow pointer-events-none absolute bottom-3 left-4 max-w-[70%] text-[0.55rem] normal-case tracking-[0.12em] text-ivory/55">
        <span className="mr-2 inline-block h-px w-5 align-middle" style={{ background: WINE, borderTop: `1px dashed ${IVORY}00` }} />
        {routeLabel}
      </p>
    </div>
  );
}
