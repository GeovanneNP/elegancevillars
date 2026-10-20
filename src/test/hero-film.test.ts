import { describe, expect, it } from "vitest";
import { shouldLoadFilm } from "@/components/villa/HeroVideo";

describe("opening film loading", () => {
  it("skips the film when data saver is on", () => expect(shouldLoadFilm({ saveData: true, effectiveType: "4g" })).toBe(false));
  it("skips the film on 2g and slow-2g", () => {
    expect(shouldLoadFilm({ effectiveType: "2g" })).toBe(false);
    expect(shouldLoadFilm({ effectiveType: "slow-2g" })).toBe(false);
  });
  it("loads the film on 3g/4g or when the connection is unknown", () => {
    expect(shouldLoadFilm({ effectiveType: "4g" })).toBe(true);
    expect(shouldLoadFilm({ effectiveType: "3g" })).toBe(true);
    expect(shouldLoadFilm(undefined)).toBe(true);
  });
});
