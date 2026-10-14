import { describe, expect, it } from "vitest";
import { getVisitUrl } from "@/components/villa/visit";
import { dict } from "@/components/villa/i18n";

describe("WhatsApp viewing destination", () => {
  it.each(["fr", "en", "de"] as const)("opens Gregory's number with the %s message", (lang) => {
    const url = new URL(getVisitUrl(lang));
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/41762532422");
    expect(url.searchParams.get("text")).toBe(dict[lang].whatsappMessage);
    expect(url.searchParams.get("text")).toContain("044598");
  });
});