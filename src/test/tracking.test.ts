import { beforeEach, describe, expect, it } from "vitest";
import { captureAttribution, loadGtm, resetTrackingForTests, saveConsent, track } from "@/lib/tracking";

beforeEach(() => { window.dataLayer = []; localStorage.clear(); sessionStorage.clear(); document.getElementById("gtm-script")?.remove(); resetTrackingForTests(); });

describe("tracking rules", () => {
  it("never sends personal data in event parameters", () => {
    const e = track("generate_lead", { name: "Jane", email: "j@x.ch", phone: "+41", lead_type: "dossier_request" })!;
    expect(e).not.toHaveProperty("name"); expect(e).not.toHaveProperty("email"); expect(e).not.toHaveProperty("phone");
    expect(e.property_id).toBe("044598");
  });
  it("does not load GTM before optional consent", () => {
    expect(loadGtm(window, "GTM-ABC123")).toBe(false);
    saveConsent({ analytics: false, marketing: false });
    expect(loadGtm(window, "GTM-ABC123")).toBe(false);
  });
  it("loads GTM once after consent when an ID is configured", () => {
    saveConsent({ analytics: true, marketing: false });
    expect(loadGtm(window, "GTM-ABC123")).toBe(true);
    loadGtm(window, "GTM-ABC123");
    expect(document.querySelectorAll("#gtm-script")).toHaveLength(1);
  });
  it("attaches captured UTM campaign data to events", () => {
    history.replaceState(null, "", "/?utm_source=google["utm_campaign"]=villars");
    captureAttribution();
    const e = track("contact_whatsapp", {})!;
    expect(e["utm_source"]).toBe("google"); expect(e["utm_campaign"]).toBe("villars");
  });
  it("fires a once-keyed event only once", () => {
    track("view_property", {}, { onceKey: "vp" }); track("view_property", {}, { onceKey: "vp" });
    expect(window.dataLayer!.filter((x) => (x as { event?: string }).event === "view_property")).toHaveLength(1);
  });
});
