import { createFileRoute } from "@tanstack/react-router";
import { Villa } from "@/components/villa/Villa";
import { listingHead } from "@/components/villa/seo";

export const Route = createFileRoute("/")({
  head: () => listingHead("fr"),
  component: () => <Villa lang="fr" />,
});
