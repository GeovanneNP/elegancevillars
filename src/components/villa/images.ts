import living from "@/assets/living-enhanced.webp";
import living2 from "@/assets/living2-enhanced.webp";
import kitchen from "@/assets/kitchen-enhanced.webp";
import bedroom from "@/assets/bedroom-enhanced.webp";
import bedroom2 from "@/assets/bedroom2-enhanced.webp";
import bath from "@/assets/bath-enhanced.webp";
import balcony from "@/assets/balcony-enhanced.webp";
import exterior from "@/assets/exterior-enhanced.webp";
import alps from "@/assets/alps.jpg";
import villarsPanoramaAsset from "@/assets/villars-panorama.webp.asset.json";
import rocOrsayAsset from "@/assets/roc-orsay-real.webp.asset.json";
import bretayeTrainAsset from "@/assets/bretaye-train.webp.asset.json";
import lacChavonnesAsset from "@/assets/lac-chavonnes-wide.webp.asset.json";
import lacChavonnesReflectionAsset from "@/assets/lac-chavonnes-reflection.webp.asset.json";
import glacier3000Asset from "@/assets/glacier-3000-real.webp.asset.json";
import peakWalkAsset from "@/assets/peak-walk-real.webp.asset.json";
import chateauAigleAsset from "@/assets/chateau-aigle.webp.asset.json";
import chillonLemanAsset from "@/assets/chillon-leman.webp.asset.json";

export const img = {
  living,
  living2,
  kitchen,
  bedroom,
  bedroom2,
  bath,
  balcony,
  exterior,
  alps,
  villarsPanorama: villarsPanoramaAsset.url,
  rocOrsay: rocOrsayAsset.url,
  bretayeTrain: bretayeTrainAsset.url,
  lacChavonnes: lacChavonnesAsset.url,
  lacChavonnesReflection: lacChavonnesReflectionAsset.url,
  glacier3000: glacier3000Asset.url,
  peakWalk: peakWalkAsset.url,
  chateauAigle: chateauAigleAsset.url,
  chillonLeman: chillonLemanAsset.url,
};

export const galleryImages = [
  { src: img.living, alt: "Séjour avec cheminée en pierre" },
  { src: img.bedroom2, alt: "Chambre, mur en pierre" },
  { src: img.kitchen, alt: "Cuisine ouverte et table en bois" },
  { src: img.bath, alt: "Salle d'eau en marbre" },
  { src: img.living2, alt: "Espace de vie et salle à manger" },
  { src: img.balcony, alt: "Balcon avec vue sur les montagnes" },
  { src: img.exterior, alt: "Le bâtiment au centre de Villars" },
];
