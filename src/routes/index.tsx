import { createFileRoute } from "@tanstack/react-router";
import { Villa } from "@/components/villa/Villa";

const title =
  "Appartement 2.5 pièces à vendre à Villars-sur-Ollon — CHF 590'000 | Brodard Property";
const description =
  "Rénové en 2023, 48 m², balcon avec vue sur les Alpes et cheminée. Résidence principale ou secondaire — vente directe par le propriétaire. Réf. 044598.";
const url = "https://www.elegancevillars.ch/";
const ogImage = "https://www.elegancevillars.ch/og-villars.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Brodard Property" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:locale:alternate", content: "de_CH" },
      {
        property: "og:image",
        content: ogImage,
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content:
          "Immeuble alpin à Villars-sur-Ollon — Appartement à vendre, CHF 590 000",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "fr", href: url },
      { rel: "alternate", hrefLang: "en", href: url },
      { rel: "alternate", hrefLang: "de", href: url },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          name: "Appartement 2.5 pièces à Villars-sur-Ollon",
          url,
          image: ogImage,
          description,
          inLanguage: ["fr", "en", "de"],
          offers: { "@type": "Offer", price: 590000, priceCurrency: "CHF", availability: "https://schema.org/InStock", seller: { "@type": "Person", name: "Gregory Brodard", email: "Marketing@uptechswiss.ch", telephone: "+41765426230" } },
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
  }),
  component: Villa,
});
