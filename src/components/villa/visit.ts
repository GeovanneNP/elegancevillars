import { dict, type Lang } from "./i18n";

export function getVisitUrl(lang: Lang) {
  return `https://wa.me/41762532422?text=${encodeURIComponent(dict[lang].whatsappMessage)}`;
}