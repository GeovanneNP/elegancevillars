import living from "@/assets/living.jpg.asset.json";
import living2 from "@/assets/living2.jpg.asset.json";
import kitchen from "@/assets/kitchen.jpg.asset.json";
import bedroom from "@/assets/bedroom.jpg.asset.json";
import bedroom2 from "@/assets/bedroom2.jpg.asset.json";
import bath from "@/assets/bath.jpg.asset.json";
import balcony from "@/assets/balcony.jpg.asset.json";
import exterior from "@/assets/exterior.jpg.asset.json";
import agent from "@/assets/agent.jpg.asset.json";
import alps from "@/assets/alps.jpg";
import seasons from "@/assets/seasons.jpg";

export const img = {
  living: living.url,
  living2: living2.url,
  kitchen: kitchen.url,
  bedroom: bedroom.url,
  bedroom2: bedroom2.url,
  bath: bath.url,
  balcony: balcony.url,
  exterior: exterior.url,
  agent: agent.url,
  alps,
  seasons,
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
