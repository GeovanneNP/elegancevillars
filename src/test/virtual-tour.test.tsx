import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VirtualTour } from "@/components/villa/VirtualTour";
import { dict } from "@/components/villa/i18n";
import { getVisitUrl } from "@/components/villa/visit";
import { VIRTUAL_TOUR_SHARE_URL, VIRTUAL_TOUR_URL } from "@/components/villa/virtual-tour";
const tourEvents = () => (window.dataLayer ?? []).filter((e) => (e as { event?: string }).event === "view_virtual_tour");

afterEach(() => { cleanup(); vi.useRealTimers(); window.dataLayer = []; });

describe("approved virtual tour integration", () => {
  it("preserves the confirmed panorama and orientation and sharing destination", () => {
    expect(VIRTUAL_TOUR_URL).toBe("https://tourmkr.com/F107wi7Z84/48157416p&0h&90t");
    expect(VIRTUAL_TOUR_SHARE_URL).toBe("https://gothru.co/P6tcAq3wJ");
  });

  it("does not mount the third-party iframe or emit analytics before interaction", () => {
    const { container } = render(<VirtualTour t={dict.fr} lang="fr" visitUrl={getVisitUrl("fr")} />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(tourEvents()).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: dict.fr.virtualTour.start }));
    expect(container.querySelector("iframe")?.getAttribute("src")).toBe(VIRTUAL_TOUR_URL);
    expect(tourEvents()).toHaveLength(1);
  });

  it("emits the tour event once despite closing and reopening", async () => {
    render(<VirtualTour t={dict.en} lang="en" visitUrl={getVisitUrl("en")} />);
    fireEvent.click(screen.getByRole("button", { name: dict.en.virtualTour.start }));
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: dict.en.virtualTour.close })); });
    fireEvent.click(screen.getByRole("button", { name: dict.en.virtualTour.start }));
    expect(tourEvents()).toHaveLength(1);
  });

  it.each(["fr", "en", "de"] as const)("preserves the existing WhatsApp destination in %s", (lang) => {
    render(<VirtualTour t={dict[lang]} lang={lang} visitUrl={getVisitUrl(lang)} />);
    const link = screen.getByRole("link", { name: dict[lang].virtualTour.viewing });
    expect(link.getAttribute("href")).toBe(getVisitUrl(lang));
    expect(new URL(link.getAttribute("href") ?? "").pathname).toBe("/41762532422");
  });

  it("unmounts an unresponsive iframe and offers the approved external link", () => {
    vi.useFakeTimers();
    const { container } = render(<VirtualTour t={dict.fr} lang="fr" visitUrl={getVisitUrl("fr")} />);
    fireEvent.click(screen.getByRole("button", { name: dict.fr.virtualTour.start }));
    act(() => { vi.advanceTimersByTime(20000); });
    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getByRole("alert").querySelector("a")?.getAttribute("href")).toBe("https://gothru.co/P6tcAq3wJ");
    fireEvent.click(screen.getByRole("button", { name: dict.fr.virtualTour.retry }));
    expect(container.querySelector("iframe")?.getAttribute("src")).toBe(VIRTUAL_TOUR_URL);
  });
});