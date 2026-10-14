import { describe, expect, it } from "vitest";
import { dict } from "@/components/villa/i18n";

describe("confirmed listing requirements", () => {
  it.each(["fr", "en", "de"] as const)("uses CHF 610'000.- in %s", (lang) => {
    expect(dict[lang].heroMeta).toContain("CHF 610'000.-");
  });

  it.each(["fr", "en", "de"] as const)("shows approximately 48 m² in %s", (lang) => {
    expect(dict[lang].details[0]?.[1]).toBe("~48 m²");
  });

  it.each(["fr", "en", "de"] as const)("states the LFAIE condition in %s", (lang) => {
    expect(dict[lang].ownText).toContain("LFAIE");
  });
});