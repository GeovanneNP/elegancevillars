import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicy, legalHead } from "@/components/villa/legalPages";

export const Route = createFileRoute("/de_/privacy")({
  head: () => legalHead("privacy", "de"),
  component: () => <PrivacyPolicy lang="de" />,
});
