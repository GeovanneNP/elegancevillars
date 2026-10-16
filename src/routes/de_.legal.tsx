import { createFileRoute } from "@tanstack/react-router";
import { LegalNotice, legalHead } from "@/components/villa/legalPages";

export const Route = createFileRoute("/de_/legal")({
  head: () => legalHead("legal", "de"),
  component: () => <LegalNotice lang="de" />,
});
