// Single tracking source: events go to window.dataLayer; GTM (when configured and consented)
// forwards them to GA4, Meta Pixel and Google Ads. No direct gtag/fbq installs here.
export const PROPERTY_ID = "044598";
export const CONSENT_KEY = "brodard-consent";
export const CONSENT_VERSION = 1;
const ATTR_KEY = "brodard-attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid"] as const;
const PII_KEYS = /^(name|email|e-mail|phone|tel|telephone|first_name|last_name|address|message)$/i;

export type Consent = { v: number; analytics: boolean; marketing: boolean; ts: string };
export type TrackEvent =
  | "view_property" | "view_gallery" | "view_virtual_tour" | "contact_whatsapp" | "contact_click"
  | "request_dossier" | "generate_lead" | "schedule_visit" | "change_language";

type DL = Record<string, unknown>[];
declare global { interface Window { dataLayer?: DL } }

function dl(win: Window): DL { return (win.dataLayer = win.dataLayer || []); }
function gtagPush(win: Window, ...args: unknown[]) {
  // Consent Mode needs the Arguments-style entry GTM understands.
  // eslint-disable-next-line prefer-rest-params
  (function (..._a: unknown[]) { dl(win).push(arguments as unknown as Record<string, unknown>); })(...args);
}

export function readConsent(win: Window = window): Consent | null {
  try {
    const c = JSON.parse(win.localStorage.getItem(CONSENT_KEY) || "null") as Consent | null;
    return c && c.v === CONSENT_VERSION ? c : null;
  } catch { return null; }
}

function consentState(c: Pick<Consent, "analytics" | "marketing"> | null) {
  const a = c?.analytics ? "granted" : "denied";
  const m = c?.marketing ? "granted" : "denied";
  return { analytics_storage: a, ad_storage: m, ad_user_data: m, ad_personalization: m };
}

/** Consent Mode v2 default (everything optional denied) before any tag can load. */
export function initConsentDefaults(win: Window = window) {
  gtagPush(win, "consent", "default", { ...consentState(null), functionality_storage: "granted", security_storage: "granted", wait_for_update: 500 });
  gtagPush(win, "set", "ads_data_redaction", true);
  const saved = readConsent(win);
  if (saved) gtagPush(win, "consent", "update", consentState(saved));
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }, win: Window = window): Consent {
  const record: Consent = { v: CONSENT_VERSION, ...choice, ts: new Date().toISOString() };
  win.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  gtagPush(win, "consent", "update", consentState(record));
  dl(win).push({ event: "consent_update", consent_analytics: record.analytics, consent_marketing: record.marketing });
  win.dispatchEvent(new CustomEvent("brodard-consent", { detail: record }));
  if (record.analytics || record.marketing) loadGtm(win);
  return record;
}

/** GTM loads only when an ID is configured AND an optional category was granted. */
export function loadGtm(win: Window = window, id = import.meta.env.VITE_GTM_ID as string | undefined) {
  const c = readConsent(win);
  if (!id || !/^GTM-[A-Z0-9]+$/.test(id) || !c || !(c.analytics || c.marketing)) return false;
  if (win.document.getElementById("gtm-script")) return true;
  dl(win).push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = win.document.createElement("script");
  s.id = "gtm-script"; s.async = true; s.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  win.document.head.appendChild(s);
  return true;
}

/** Store first-touch campaign data for the session (no PII). */
export function captureAttribution(win: Window = window) {
  const params = new URLSearchParams(win.location.search);
  const found: Record<string, string> = {};
  [...UTM_KEYS, ...CLICK_IDS].forEach((k) => { const v = params.get(k); if (v) found[k] = v.slice(0, 150); });
  if (Object.keys(found).length) {
    found.landing_page = win.location.pathname;
    found.captured_at = new Date().toISOString();
    win.sessionStorage.setItem(ATTR_KEY, JSON.stringify(found));
  }
  return getAttribution(win);
}

export function getAttribution(win: Window = window): Record<string, string> {
  try { return JSON.parse(win.sessionStorage.getItem(ATTR_KEY) || "{}"); } catch { return {}; }
}

export function newEventId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const once = new Set<string>();
/** Push one standardized event. `onceKey` prevents duplicate firing of the same action. */
export function track(event: TrackEvent, params: Record<string, unknown> = {}, opts: { onceKey?: string; win?: Window } = {}) {
  const win = opts.win ?? (typeof window !== "undefined" ? window : undefined);
  if (!win) return null;
  if (opts.onceKey) { if (once.has(opts.onceKey)) return null; once.add(opts.onceKey); }
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) if (!PII_KEYS.test(k)) clean[k] = v;
  const attr = getAttribution(win);
  const utm = Object.fromEntries(UTM_KEYS.filter((k) => attr[k]).map((k) => [k, attr[k]]));
  const payload = { event, event_id: newEventId(), property_id: PROPERTY_ID, page_language: win.document.documentElement.lang || "fr", ...utm, ...clean };
  dl(win).push(payload);
  return payload;
}

export function resetTrackingForTests() { once.clear(); }
