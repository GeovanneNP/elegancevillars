import { createFileRoute } from "@tanstack/react-router";
import { LegalNotice, legalHead } from "@/components/villa/legalPages";

export const Route = createFileRoute("/en_/legal")({
  head: () => legalHead("legal", "en"),
  component: () => <LegalNotice lang="en" />,
});
