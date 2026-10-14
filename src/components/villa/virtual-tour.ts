import { track } from "@/lib/tracking";

export const VIRTUAL_TOUR_URL = "https://tourmkr.com/F107wi7Z84/48157416p&0h&90t";
export const VIRTUAL_TOUR_SHARE_URL = "https://gothru.co/P6tcAq3wJ";

// Single source: dataLayer only. GTM forwards to GA4/Meta/Ads after consent (no direct gtag/fbq → no duplicates).
export function trackVirtualTourOpen(win: Window, language: string) {
  return track("view_virtual_tour", { language, interaction_type: "open_tour", button_location: "visite-virtuelle" }, { win });
}
