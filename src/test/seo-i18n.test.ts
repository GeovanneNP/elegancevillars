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

import { altLocales, pagePath } from "@/components/villa/seo";
import { legalHead } from "@/components/villa/legalPages";
describe("localised sub-pages", () => {
  it("lists the two other locales as alternates", () => {
    expect(altLocales("fr")).toEqual(["en_US", "de_CH"]);
    expect(altLocales("en")).toEqual(["fr_CH", "de_CH"]);
    expect(altLocales("de")).toEqual(["fr_CH", "en_US"]);
  });
  it("keeps French legal pages at the root", () => {
    expect(pagePath("fr", "legal")).toBe("/legal");
    expect(pagePath("de", "privacy")).toBe("/de/privacy");
  });
  it("/en/privacy canonical self-references with x-default to French", () => {
    const h = legalHead("privacy", "en");
    expect(h.links.find((l) => l.rel === "canonical")?.href).toBe("https://www.brodardproperty.ch/en/privacy");
    expect(h.links.find((l) => l.hrefLang === "x-default")?.href).toBe("https://www.brodardproperty.ch/privacy");
  });
});
