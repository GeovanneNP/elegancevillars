import { createFileRoute } from "@tanstack/react-router";
import { LegalNotice, legalHead } from "@/components/villa/legalPages";

export const Route = createFileRoute("/legal")({
  head: () => legalHead("legal", "fr"),
  component: () => <LegalNotice lang="fr" />,
});
