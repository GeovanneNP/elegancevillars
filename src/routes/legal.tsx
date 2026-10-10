import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/villa/LegalPage";

const url = "https://www.brodardproperty.ch/legal";
const title = "Mentions légales | Brodard Property";
const description = "Mentions légales de Brodard Property pour la présentation de l’appartement de Villars-sur-Ollon, référence 044598.";

export const Route = createFileRoute("/legal")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { name: "twitter:card", content: "summary" }], links: [{ rel: "canonical", href: url }] }),
  component: Legal,
});

function Legal() {
  return <LegalPage eyebrow="Brodard Property Sàrl" title="Mentions légales · Impressum" intro="Informations relatives à l’éditeur de cette présentation immobilière." back="Retour au bien" sections={[
    { title: "Éditeur", paragraphs: ["Brodard Property Sàrl", "Contact : gregory.brodard@pfgbrodard.ch · +41 79 727 31 88", "L’adresse officielle du siège et le numéro IDE seront ajoutés après confirmation des données du registre."] },
    { title: "Bien présenté", paragraphs: ["Appartement à Villars-sur-Ollon, Vaud · Référence 044598.", "Les informations, surfaces, temps de trajet et disponibilités sont communiqués à titre indicatif et peuvent être modifiés. Toute transaction reste soumise aux vérifications contractuelles et notariales."] },
    { title: "Propriété intellectuelle", paragraphs: ["Les textes, la conception et les photographies du bien ne peuvent pas être reproduits sans autorisation. Les photographies de lieux tiers portent leur attribution et leur licence directement sur la page."] },
    { title: "Responsabilité", paragraphs: ["Brodard Property Sàrl veille à l’exactitude des informations publiées, sans garantir qu’elles soient exemptes d’erreurs. Les liens externes relèvent de la responsabilité de leurs éditeurs."] },
  ]} />;
}