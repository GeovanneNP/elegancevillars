import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/villa/LegalPage";
import { useEffect, useState } from "react";
import type { Lang } from "@/components/villa/i18n";

const url = "https://www.brodardproperty.ch/legal";
const title = "Mentions légales | Brodard Property";
const description = "Mentions légales de Brodard Property pour la présentation de l’appartement de Villars-sur-Ollon, référence 044598.";

export const Route = createFileRoute("/legal")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { name: "twitter:card", content: "summary" }], links: [{ rel: "canonical", href: url }] }),
  component: Legal,
});

function Legal() {
  const [lang, setLang] = useState<Lang>("fr");
  useEffect(() => { const saved = localStorage.getItem("villars-lang"); if (saved === "en" || saved === "de") setLang(saved); }, []);
  const copy = {
    fr: { title: "Mentions légales · Impressum", intro: "Informations relatives à l’éditeur de cette présentation immobilière.", back: "Retour au bien", sections: [
      { title: "Éditeur", paragraphs: ["Brodard Property Sàrl", "Contact : gregory.brodard@pfgbrodard.ch · +41 79 727 31 88", "L’adresse officielle du siège et le numéro IDE seront ajoutés après confirmation des données du registre."] },
      { title: "Bien présenté", paragraphs: ["Appartement à Villars-sur-Ollon, Vaud · Référence 044598.", "Les informations sont communiquées à titre indicatif. Toute transaction reste soumise aux vérifications contractuelles et notariales."] },
      { title: "Propriété intellectuelle", paragraphs: ["Les textes, la conception et les photographies du bien ne peuvent pas être reproduits sans autorisation. Les photographies de lieux tiers portent leur attribution et leur licence sur la page."] },
    ] },
    en: { title: "Legal notice · Impressum", intro: "Information about the publisher of this property presentation.", back: "Back to the property", sections: [
      { title: "Publisher", paragraphs: ["Brodard Property Sàrl", "Contact: gregory.brodard@pfgbrodard.ch · +41 79 727 31 88", "The registered-office address and UID number will be added once the registry details are confirmed."] },
      { title: "Property", paragraphs: ["Apartment in Villars-sur-Ollon, Vaud · Reference 044598.", "Information is provided for guidance. Any transaction remains subject to contractual and notarial verification."] },
      { title: "Intellectual property", paragraphs: ["The copy, design and property photographs may not be reproduced without permission. Third-party location photographs show their attribution and licence on the page."] },
    ] },
    de: { title: "Impressum", intro: "Angaben zur Herausgeberin dieser Immobilienpräsentation.", back: "Zurück zur Immobilie", sections: [
      { title: "Herausgeberin", paragraphs: ["Brodard Property Sàrl", "Kontakt: gregory.brodard@pfgbrodard.ch · +41 79 727 31 88", "Sitzadresse und UID-Nummer werden nach Bestätigung der Registerangaben ergänzt."] },
      { title: "Immobilie", paragraphs: ["Wohnung in Villars-sur-Ollon, Waadt · Referenz 044598.", "Die Angaben dienen zur Orientierung. Jede Transaktion unterliegt der vertraglichen und notariellen Prüfung."] },
      { title: "Urheberrecht", paragraphs: ["Texte, Gestaltung und Objektfotografien dürfen nicht ohne Genehmigung reproduziert werden. Bilder Dritter tragen auf der Seite Angaben zu Urheber und Lizenz."] },
    ] },
  }[lang];
  return <LegalPage eyebrow="Brodard Property Sàrl" {...copy} />;
}