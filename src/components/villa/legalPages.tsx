import { LegalPage } from "./LegalPage";
import type { Lang } from "./i18n";
import { HTML_LANG, OG_LOCALE, pageUrl } from "./seo";

type Page = "legal" | "privacy";

const META: Record<Page, Record<Lang, { title: string; description: string }>> = {
  legal: {
    fr: { title: "Mentions légales | Brodard Property", description: "Mentions légales de Brodard Property pour la présentation de l’appartement de Villars-sur-Ollon, référence 044598." },
    en: { title: "Legal notice | Brodard Property", description: "Legal notice of Brodard Property for the presentation of the Villars-sur-Ollon apartment, reference 044598." },
    de: { title: "Impressum | Brodard Property", description: "Impressum von Brodard Property zur Präsentation der Wohnung in Villars-sur-Ollon, Referenz 044598." },
  },
  privacy: {
    fr: { title: "Politique de confidentialité | Brodard Property", description: "Politique de confidentialité nLPD applicable aux demandes relatives à l’appartement de Villars-sur-Ollon." },
    en: { title: "Privacy policy | Brodard Property", description: "Swiss data-protection (nFADP) privacy policy for enquiries about the Villars-sur-Ollon apartment." },
    de: { title: "Datenschutzerklärung | Brodard Property", description: "Datenschutzerklärung nach revDSG für Anfragen zur Wohnung in Villars-sur-Ollon." },
  },
};

export function legalHead(page: Page, lang: Lang) {
  const { title, description } = META[page][lang];
  const url = pageUrl(lang, page);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:locale", content: OG_LOCALE[lang] },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: HTML_LANG.fr, href: pageUrl("fr", page) },
      { rel: "alternate", hrefLang: HTML_LANG.en, href: pageUrl("en", page) },
      { rel: "alternate", hrefLang: HTML_LANG.de, href: pageUrl("de", page) },
      { rel: "alternate", hrefLang: "x-default", href: pageUrl("fr", page) },
    ],
  };
}

const LEGAL = {
    fr: { title: "Mentions légales · Impressum", intro: "Informations relatives à l’éditeur de cette présentation immobilière.", back: "Retour au bien", sections: [
      { title: "Éditeur", paragraphs: ["Brodard Property Sàrl", "Contact : gregory.brodard@pfgbrodard.ch · +41 76 253 24 22", "L’adresse officielle du siège et le numéro IDE seront ajoutés après confirmation des données du registre."] },
      { title: "Bien présenté", paragraphs: ["Appartement à Villars-sur-Ollon, Vaud · Référence 044598.", "Les informations sont communiquées à titre indicatif. Toute transaction reste soumise aux vérifications contractuelles et notariales."] },
      { title: "Propriété intellectuelle", paragraphs: ["Les textes, la conception et les photographies du bien ne peuvent pas être reproduits sans autorisation. Les photographies de lieux tiers portent leur attribution et leur licence sur la page."] },
    ] },
    en: { title: "Legal notice · Impressum", intro: "Information about the publisher of this property presentation.", back: "Back to the property", sections: [
      { title: "Publisher", paragraphs: ["Brodard Property Sàrl", "Contact: gregory.brodard@pfgbrodard.ch · +41 76 253 24 22", "The registered-office address and UID number will be added once the registry details are confirmed."] },
      { title: "Property", paragraphs: ["Apartment in Villars-sur-Ollon, Vaud · Reference 044598.", "Information is provided for guidance. Any transaction remains subject to contractual and notarial verification."] },
      { title: "Intellectual property", paragraphs: ["The copy, design and property photographs may not be reproduced without permission. Third-party location photographs show their attribution and licence on the page."] },
    ] },
    de: { title: "Impressum", intro: "Angaben zur Herausgeberin dieser Immobilienpräsentation.", back: "Zurück zur Immobilie", sections: [
      { title: "Herausgeberin", paragraphs: ["Brodard Property Sàrl", "Kontakt: gregory.brodard@pfgbrodard.ch · +41 76 253 24 22", "Sitzadresse und UID-Nummer werden nach Bestätigung der Registerangaben ergänzt."] },
      { title: "Immobilie", paragraphs: ["Wohnung in Villars-sur-Ollon, Waadt · Referenz 044598.", "Die Angaben dienen zur Orientierung. Jede Transaktion unterliegt der vertraglichen und notariellen Prüfung."] },
      { title: "Urheberrecht", paragraphs: ["Texte, Gestaltung und Objektfotografien dürfen nicht ohne Genehmigung reproduziert werden. Bilder Dritter tragen auf der Seite Angaben zu Urheber und Lizenz."] },
    ] },
  };

const PRIVACY = {
    fr: { title: "Politique de confidentialité", intro: "Cette politique explique comment les données transmises au sujet du bien sont traitées.", back: "Retour au bien", sections: [
      { title: "Responsable", paragraphs: ["Brodard Property Sàrl · gregory.brodard@pfgbrodard.ch · +41 76 253 24 22."] },
      { title: "Données et finalités", paragraphs: ["Pour une demande de dossier, nous recueillons votre nom, e-mail, téléphone facultatif, langue et référence du bien afin de répondre, organiser un échange ou une visite et suivre votre intérêt. Ces données ne sont pas vendues."] },
      { title: "Conservation et droits", paragraphs: ["Les demandes sont conservées pendant la durée nécessaire au suivi et aux obligations légales, puis supprimées ou anonymisées. Selon la nLPD, vous pouvez demander accès, rectification ou suppression par e-mail."] },
      { title: "Services techniques", paragraphs: ["L’hébergement, le stockage sécurisé, la cartographie et les polices peuvent traiter des données techniques nécessaires au fonctionnement du site."] },
      { title: "Cookies et mesure", paragraphs: ["Avec votre accord seulement, Google Tag Manager peut charger Google Analytics 4 (mesure d’audience) et Google Ads / Meta (Facebook, Instagram) pour mesurer nos campagnes. Ces services peuvent traiter des données techniques et transférer des données hors de Suisse. Aucun nom, e-mail ou téléphone n’est transmis à ces plateformes. Votre choix, sa date et la version de ce texte sont enregistrés dans votre navigateur; vous pouvez le modifier à tout moment via « Cookies » en bas de page. [À valider juridiquement]"] },
    ] },
    en: { title: "Privacy policy", intro: "This policy explains how information submitted about the property is handled.", back: "Back to the property", sections: [
      { title: "Controller", paragraphs: ["Brodard Property Sàrl · gregory.brodard@pfgbrodard.ch · +41 76 253 24 22."] },
      { title: "Data and purposes", paragraphs: ["For dossier requests, we collect your name, email, optional telephone, language and property reference to answer you, arrange contact or a viewing, and follow up your interest. This information is not sold."] },
      { title: "Retention and rights", paragraphs: ["Requests are retained as needed for follow-up and legal obligations, then deleted or anonymised. Under Swiss data-protection law, you may request access, correction or deletion by email."] },
      { title: "Technical services", paragraphs: ["Hosting, secure storage, mapping and font services may process technical information required for the site to operate."] },
      { title: "Cookies and measurement", paragraphs: ["Only with your consent, Google Tag Manager may load Google Analytics 4 (audience measurement) and Google Ads / Meta (Facebook, Instagram) to measure our campaigns. These services may process technical data and transfer data outside Switzerland. No name, email or telephone is sent to these platforms. Your choice, its date and the notice version are stored in your browser; change it any time via “Cookies” in the footer. [Pending legal review]"] },
    ] },
    de: { title: "Datenschutzerklärung", intro: "Diese Erklärung erläutert die Bearbeitung von Angaben, die Sie zur Immobilie übermitteln.", back: "Zurück zur Immobilie", sections: [
      { title: "Verantwortliche", paragraphs: ["Brodard Property Sàrl · gregory.brodard@pfgbrodard.ch · +41 76 253 24 22."] },
      { title: "Daten und Zwecke", paragraphs: ["Bei einer Dossieranfrage erfassen wir Name, E-Mail, freiwillige Telefonnummer, Sprache und Objektreferenz, um zu antworten, Kontakt oder eine Besichtigung zu organisieren und Ihr Interesse nachzuverfolgen. Die Daten werden nicht verkauft."] },
      { title: "Aufbewahrung und Rechte", paragraphs: ["Anfragen werden nur so lange wie für Betreuung und gesetzliche Pflichten nötig aufbewahrt und danach gelöscht oder anonymisiert. Nach Schweizer Datenschutzrecht können Sie per E-Mail Auskunft, Berichtigung oder Löschung verlangen."] },
      { title: "Technische Dienste", paragraphs: ["Hosting, sicherer Speicher, Karten- und Schriftdienste können für den Betrieb erforderliche technische Daten bearbeiten."] },
      { title: "Cookies und Messung", paragraphs: ["Nur mit Ihrer Einwilligung kann Google Tag Manager Google Analytics 4 (Reichweitenmessung) sowie Google Ads / Meta (Facebook, Instagram) zur Kampagnenmessung laden. Diese Dienste können technische Daten bearbeiten und Daten ausserhalb der Schweiz übermitteln. Name, E-Mail oder Telefon werden nicht übermittelt. Ihre Wahl, deren Datum und die Version dieses Hinweises werden im Browser gespeichert; Sie können sie jederzeit über «Cookies» in der Fusszeile ändern. [Rechtliche Prüfung ausstehend]"] },
    ] },
  };

export function LegalNotice({ lang }: { lang: Lang }) {
  return <LegalPage eyebrow="Brodard Property Sàrl" {...LEGAL[lang]} />;
}

export function PrivacyPolicy({ lang }: { lang: Lang }) {
  return <LegalPage eyebrow="nLPD · Schweiz" {...PRIVACY[lang]} />;
}
