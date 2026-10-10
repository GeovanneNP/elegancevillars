import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/villa/LegalPage";

const url = "https://www.brodardproperty.ch/privacy";
const title = "Politique de confidentialité | Brodard Property";
const description = "Politique de confidentialité nLPD applicable aux demandes relatives à l’appartement de Villars-sur-Ollon.";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { name: "twitter:card", content: "summary" }], links: [{ rel: "canonical", href: url }] }),
  component: Privacy,
});

function Privacy() {
  return <LegalPage eyebrow="nLPD · Suisse" title="Politique de confidentialité" intro="Cette politique explique comment les données transmises au sujet du bien sont traitées." back="Retour au bien" sections={[
    { title: "Responsable", paragraphs: ["Brodard Property Sàrl", "Contact pour toute question ou demande : gregory.brodard@pfgbrodard.ch · +41 79 727 31 88."] },
    { title: "Données traitées", paragraphs: ["Lorsque vous demandez le dossier privé, nous recueillons votre nom, votre adresse e-mail, votre téléphone si vous choisissez de le transmettre, la langue de votre demande et la référence du bien."] },
    { title: "Finalités", paragraphs: ["Ces données servent uniquement à répondre à votre demande, organiser un échange ou une visite, et assurer le suivi de votre intérêt pour le bien. Elles ne sont pas vendues."] },
    { title: "Conservation et sécurité", paragraphs: ["Les demandes sont conservées pendant la durée nécessaire au suivi commercial et aux obligations légales applicables, puis supprimées ou anonymisées. Des mesures adaptées protègent leur accès."] },
    { title: "Vos droits", paragraphs: ["Conformément à la nLPD, vous pouvez demander l’accès, la rectification ou la suppression de vos données, sous réserve des obligations légales de conservation, en écrivant à l’adresse de contact ci-dessus."] },
    { title: "Services techniques", paragraphs: ["Le site utilise des services d’hébergement, de stockage sécurisé, de cartographie et de polices nécessaires à son fonctionnement. Ces prestataires peuvent traiter des données techniques telles que l’adresse IP et les informations du navigateur selon leurs propres conditions."] },
  ]} />;
}