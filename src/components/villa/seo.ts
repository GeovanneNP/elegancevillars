import type { Lang } from "./i18n";

export const SITE = "https://www.brodardproperty.ch";
export const LANG_PATH: Record<Lang, "/" | "/en" | "/de"> = { fr: "/", en: "/en", de: "/de" };
export const HTML_LANG: Record<Lang, string> = { fr: "fr-CH", en: "en", de: "de-CH" };
const OG_LOCALE: Record<Lang, string> = { fr: "fr_CH", en: "en_US", de: "de_CH" };
const OG_IMAGE = `${SITE}/og-villars.jpg`;

export const langUrl = (l: Lang) => (l === "fr" ? `${SITE}/` : `${SITE}${LANG_PATH[l]}`);
export const langFromPath = (path: string): Lang => (path === "/en" || path.startsWith("/en/") ? "en" : path === "/de" || path.startsWith("/de/") ? "de" : "fr");

const COPY: Record<Lang, { title: string; description: string; name: string; alt: string }> = {
  fr: {
    title: "Appartement 2.5 pièces à vendre à Villars-sur-Ollon — CHF 610'000.- | Brodard Property",
    description: "Appartement rénové de 48 m² à Villars-sur-Ollon, proposé à CHF 610'000.- avec balcon, cheminée et vente directe. Réf. 044598.",
    name: "Appartement 2.5 pièces à Villars-sur-Ollon",
    alt: "Immeuble alpin à Villars-sur-Ollon — Appartement à vendre, CHF 610'000.-",
  },
  en: {
    title: "2.5-room apartment for sale in Villars-sur-Ollon — CHF 610'000.- | Brodard Property",
    description: "Renovated 48 m² apartment in Villars-sur-Ollon, offered at CHF 610'000.- with balcony, fireplace and direct sale. Ref. 044598.",
    name: "2.5-room apartment in Villars-sur-Ollon",
    alt: "Alpine building in Villars-sur-Ollon — apartment for sale, CHF 610'000.-",
  },
  de: {
    title: "2.5-Zimmer-Wohnung zu verkaufen in Villars-sur-Ollon — CHF 610'000.- | Brodard Property",
    description: "Renovierte 48 m² Wohnung in Villars-sur-Ollon für CHF 610'000.- mit Balkon, Cheminée und Direktverkauf. Ref. 044598.",
    name: "2.5-Zimmer-Wohnung in Villars-sur-Ollon",
    alt: "Alpines Gebäude in Villars-sur-Ollon — Wohnung zu verkaufen, CHF 610'000.-",
  },
};

export function listingHead(lang: Lang) {
  const c = COPY[lang];
  const url = langUrl(lang);
  const others = (["fr", "en", "de"] as Lang[]).filter((l) => l !== lang);
  return {
    meta: [
      { title: c.title },
      { name: "description", content: c.description },
      { property: "og:title", content: c.title },
      { property: "og:description", content: c.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Brodard Property" },
      { property: "og:locale", content: OG_LOCALE[lang] },
      ...others.map((l) => ({ property: "og:locale:alternate", content: OG_LOCALE[l] })),
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: c.alt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: c.title },
      { name: "twitter:description", content: c.description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "fr-CH", href: langUrl("fr") },
      { rel: "alternate", hrefLang: "en", href: langUrl("en") },
      { rel: "alternate", hrefLang: "de-CH", href: langUrl("de") },
      { rel: "alternate", hrefLang: "x-default", href: langUrl("fr") },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          name: c.name,
          url,
          image: OG_IMAGE,
          description: c.description,
          inLanguage: HTML_LANG[lang],
          offers: { "@type": "Offer", price: 610000, priceCurrency: "CHF", availability: "https://schema.org/InStock", seller: { "@type": "Person", name: "Gregory Brodard", email: "gregory.brodard@pfgbrodard.ch", telephone: "+41762532422" } },
          about: {
            "@type": "Apartment",
            numberOfRooms: 2.5,
            numberOfBedrooms: 1,
            floorSize: { "@type": "QuantitativeValue", value: 48, unitCode: "MTK" },
            address: { "@type": "PostalAddress", addressLocality: "Villars-sur-Ollon", addressRegion: "VD", addressCountry: "CH" },
          },
        }),
      },
    ],
  };
}
