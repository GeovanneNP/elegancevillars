import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Lang } from "./i18n";
import { captureAttribution, initConsentDefaults, loadGtm, readConsent, saveConsent } from "@/lib/tracking";

const copy = {
  fr: { text: "Nous utilisons des cookies optionnels pour mesurer l'audience et nos campagnes. Les fonctions essentielles restent actives.", accept: "Tout accepter", reject: "Refuser", custom: "Personnaliser", save: "Enregistrer", analytics: "Mesure d'audience (Google Analytics)", marketing: "Marketing (Google Ads, Meta)", more: "Confidentialité", settings: "Cookies" },
  en: { text: "We use optional cookies to measure visits and our campaigns. Essential features always stay active.", accept: "Accept all", reject: "Reject", custom: "Customise", save: "Save", analytics: "Analytics (Google Analytics)", marketing: "Marketing (Google Ads, Meta)", more: "Privacy", settings: "Cookies" },
  de: { text: "Wir verwenden optionale Cookies, um Besuche und Kampagnen zu messen. Wesentliche Funktionen bleiben aktiv.", accept: "Alle akzeptieren", reject: "Ablehnen", custom: "Anpassen", save: "Speichern", analytics: "Analyse (Google Analytics)", marketing: "Marketing (Google Ads, Meta)", more: "Datenschutz", settings: "Cookies" },
};

export function openCookieSettings() { window.dispatchEvent(new Event("brodard-open-consent")); }

export function ConsentBanner({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    initConsentDefaults();
    captureAttribution();
    const saved = readConsent();
    if (saved) { setAnalytics(saved.analytics); setMarketing(saved.marketing); loadGtm(); } else setOpen(true);
    const reopen = () => { const c = readConsent(); setAnalytics(!!c?.analytics); setMarketing(!!c?.marketing); setCustom(true); setOpen(true); };
    window.addEventListener("brodard-open-consent", reopen);
    return () => window.removeEventListener("brodard-open-consent", reopen);
  }, []);

  if (!open) return null;
  const choose = (a: boolean, m: boolean) => { saveConsent({ analytics: a, marketing: m }); setOpen(false); };

  return (
    <div role="dialog" aria-live="polite" aria-label={t.settings} className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl border border-charcoal/15 bg-ivory p-5 text-charcoal shadow-2xl md:inset-x-auto md:bottom-8 md:left-8">
      <p className="text-base leading-relaxed">{t.text} <a href="/privacy" className="underline underline-offset-4">{t.more}</a></p>
      {custom && (
        <div className="mt-4 grid gap-3 text-base">
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" className="size-5 accent-[var(--swiss-red,currentColor)]" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />{t.analytics}</label>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" className="size-5" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />{t.marketing}</label>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Button variant="outline" className="min-h-11 rounded-none text-base" onClick={() => choose(false, false)}>{t.reject}</Button>
        {custom
          ? <Button variant="outline" className="min-h-11 rounded-none text-base" onClick={() => choose(analytics, marketing)}>{t.save}</Button>
          : <Button variant="outline" className="min-h-11 rounded-none text-base" onClick={() => setCustom(true)}>{t.custom}</Button>}
        <Button className="col-span-2 min-h-11 rounded-none bg-swiss-red text-base text-ivory hover:bg-swiss-red/90 sm:col-span-1" onClick={() => choose(true, true)}>{t.accept}</Button>
      </div>
    </div>
  );
}
