import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicy, legalHead } from "@/components/villa/legalPages";

export const Route = createFileRoute("/en_/privacy")({
  head: () => legalHead("privacy", "en"),
  component: () => <PrivacyPolicy lang="en" />,
});
