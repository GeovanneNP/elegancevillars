import { createFileRoute } from "@tanstack/react-router";
import { Villa } from "@/components/villa/Villa";
import { listingHead } from "@/components/villa/seo";

export const Route = createFileRoute("/de")({
  head: () => listingHead("de"),
  component: () => <Villa lang="de" />,
});
