import { describe, expect, it } from "vitest";
import { listingHead, langFromPath } from "@/components/villa/seo";

const href = (h: ReturnType<typeof listingHead>, lang: string) => h.links.find((l) => l.hrefLang === lang)?.href;

describe("international SEO", () => {
  it.each([["fr", "https://www.brodardproperty.ch/"], ["en", "https://www.brodardproperty.ch/en"], ["de", "https://www.brodardproperty.ch/de"]] as const)("%s canonical is self-referencing", (lang, url) => {
    const h = listingHead(lang);
    expect(h.links.find((l) => l.rel === "canonical")?.href).toBe(url);
    expect(href(h, "x-default")).toBe("https://www.brodardproperty.ch/");
    expect(href(h, "fr-CH")).toBe("https://www.brodardproperty.ch/");
    expect(href(h, "en")).toBe("https://www.brodardproperty.ch/en");
    expect(href(h, "de-CH")).toBe("https://www.brodardproperty.ch/de");
  });
  it("maps URL to language", () => {
    expect(langFromPath("/")).toBe("fr");
    expect(langFromPath("/en")).toBe("en");
    expect(langFromPath("/de")).toBe("de");
  });
});
