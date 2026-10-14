export const VIRTUAL_TOUR_URL = "https://tourmkr.com/F107wi7Z84/48157416p&0h&90t";
export const VIRTUAL_TOUR_SHARE_URL = "https://gothru.co/P6tcAq3wJ";

type TourAnalytics = {
  gtag?: ((command: "event", event: string, params: Record<string, string>) => void) | undefined;
  fbq?: ((command: "trackCustom", event: string, params: Record<string, string>) => void) | undefined;
};

declare global {
  interface Window {
    gtag?: TourAnalytics["gtag"];
    fbq?: TourAnalytics["fbq"];
  }
}

// Never initialize tracking or bypass consent: only use already-enabled providers.
export function trackVirtualTourOpen(target: TourAnalytics, language: string) {
  const params = { language, listing_reference: "044598" };
  target.gtag?.("event", "virtual_tour_open", params);
  target.fbq?.("trackCustom", "virtual_tour_open", params);
}