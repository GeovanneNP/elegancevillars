import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicy, legalHead } from "@/components/villa/legalPages";

export const Route = createFileRoute("/privacy")({
  head: () => legalHead("privacy", "fr"),
  component: () => <PrivacyPolicy lang="fr" />,
});
