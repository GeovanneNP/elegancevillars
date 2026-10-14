import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/villa/LegalPage";
import { useEffect, useState } from "react";
import type { Lang } from "@/components/villa/i18n";

const url = "https://www.brodardproperty.ch/privacy";
const title = "Politique de confidentialité | Brodard Property";
const description = "Politique de confidentialité nLPD applicable aux demandes relatives à l’appartement de Villars-sur-Ollon.";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { name: "twitter:card", content: "summary" }], links: [{ rel: "canonical", href: url }] }),
  component: Privacy,
});

function Privacy() {
  const [lang, setLang] = useState<Lang>("fr");
  useEffect(() => { const saved = localStorage.getItem("villars-lang"); if (saved === "en" || saved === "de") setLang(saved); }, []);
  const copy = {
    fr: { title: "Politique de confidentialité", intro: "Cette politique explique comment les données transmises au sujet du bien sont traitées.", back: "Retour au bien", sections: [
      { title: "Responsable", paragraphs: ["Brodard Property Sàrl · gregory.brodard@pfgbrodard.ch · +41 76 253 24 22."] },
      { title: "Données et finalités", paragraphs: ["Pour une demande de dossier, nous recueillons votre nom, e-mail, téléphone facultatif, langue et référence du bien afin de répondre, organiser un échange ou une visite et suivre votre intérêt. Ces données ne sont pas vendues."] },
      { title: "Conservation et droits", paragraphs: ["Les demandes sont conservées pendant la durée nécessaire au suivi et aux obligations légales, puis supprimées ou anonymisées. Selon la nLPD, vous pouvez demander accès, rectification ou suppression par e-mail."] },
      { title: "Services techniques", paragraphs: ["L’hébergement, le stockage sécurisé, la cartographie et les polices peuvent traiter des données techniques nécessaires au fonctionnement du site."] },
    ] },
    en: { title: "Privacy policy", intro: "This policy explains how information submitted about the property is handled.", back: "Back to the property", sections: [
      { title: "Controller", paragraphs: ["Brodard Property Sàrl · gregory.brodard@pfgbrodard.ch · +41 76 253 24 22."] },
      { title: "Data and purposes", paragraphs: ["For dossier requests, we collect your name, email, optional telephone, language and property reference to answer you, arrange contact or a viewing, and follow up your interest. This information is not sold."] },
      { title: "Retention and rights", paragraphs: ["Requests are retained as needed for follow-up and legal obligations, then deleted or anonymised. Under Swiss data-protection law, you may request access, correction or deletion by email."] },
      { title: "Technical services", paragraphs: ["Hosting, secure storage, mapping and font services may process technical information required for the site to operate."] },
    ] },
    de: { title: "Datenschutzerklärung", intro: "Diese Erklärung erläutert die Bearbeitung von Angaben, die Sie zur Immobilie übermitteln.", back: "Zurück zur Immobilie", sections: [
      { title: "Verantwortliche", paragraphs: ["Brodard Property Sàrl · gregory.brodard@pfgbrodard.ch · +41 76 253 24 22."] },
      { title: "Daten und Zwecke", paragraphs: ["Bei einer Dossieranfrage erfassen wir Name, E-Mail, freiwillige Telefonnummer, Sprache und Objektreferenz, um zu antworten, Kontakt oder eine Besichtigung zu organisieren und Ihr Interesse nachzuverfolgen. Die Daten werden nicht verkauft."] },
      { title: "Aufbewahrung und Rechte", paragraphs: ["Anfragen werden nur so lange wie für Betreuung und gesetzliche Pflichten nötig aufbewahrt und danach gelöscht oder anonymisiert. Nach Schweizer Datenschutzrecht können Sie per E-Mail Auskunft, Berichtigung oder Löschung verlangen."] },
      { title: "Technische Dienste", paragraphs: ["Hosting, sicherer Speicher, Karten- und Schriftdienste können für den Betrieb erforderliche technische Daten bearbeiten."] },
    ] },
  }[lang];
  return <LegalPage eyebrow="nLPD · Schweiz" {...copy} />;
}