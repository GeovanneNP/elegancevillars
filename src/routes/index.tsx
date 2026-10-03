import { createFileRoute } from "@tanstack/react-router";
import { Villa } from "@/components/villa/Villa";

const title = "Élégance alpine au cœur de Villars — Appartement CHF 590'000";
const description =
  "Appartement 2.5 pièces de 48 m² entièrement rénové en 2023 à Villars-sur-Ollon, Alpes vaudoises. Balcon, cheminée, vue montagnes. Switzerland | Sotheby's International Realty.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Villa,
});
