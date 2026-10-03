import { createFileRoute } from "@tanstack/react-router";
import { Villa } from "@/components/villa/Villa";

const title = "Élégance alpine au cœur de Villars — Appartement CHF 590'000";
const description =
  "Appartement de 2.5 pièces et environ 48 m² rénové en 2023 à Villars-sur-Ollon. Balcon, cheminée et exposition est. Vente directe par le propriétaire.";

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
