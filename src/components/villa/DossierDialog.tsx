import { useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestDossier } from "@/lib/dossier.functions";
import type { Lang } from "./i18n";
import { Link } from "@tanstack/react-router";
import { dict } from "./i18n";
import { getVisitUrl } from "./visit";

const copy = {
  fr: {
    title: "Recevoir le dossier privé",
    intro: "Laissez vos coordonnées pour recevoir les informations sur l’appartement.",
    name: "Nom",
    email: "E-mail",
    phone: "Téléphone (facultatif)",
    send: "Demander le dossier",
    sending: "Envoi en cours…",
    success: "Votre demande a bien été reçue.",
    followup: "Nous vous contacterons personnellement au sujet du dossier.",
    error: "La demande n’a pas pu être envoyée. Réessayez ou écrivez-nous directement.",
    close: "Fermer",
  },
  en: {
    title: "Request the private dossier",
    intro: "Leave your details to receive information about the apartment.",
    name: "Name",
    email: "Email",
    phone: "Phone (optional)",
    send: "Request the dossier",
    sending: "Sending…",
    success: "Your request has been received.",
    followup: "We’ll contact you personally about the dossier.",
    error: "Your request could not be sent. Please try again or email us directly.",
    close: "Close",
  },
  de: {
    title: "Privates Dossier anfordern",
    intro: "Hinterlassen Sie Ihre Angaben, um Informationen zur Wohnung zu erhalten.",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon (optional)",
    send: "Dossier anfordern",
    sending: "Wird gesendet…",
    success: "Ihre Anfrage ist eingegangen.",
    followup: "Wir melden uns persönlich bei Ihnen zum Dossier.",
    error: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt.",
    close: "Schliessen",
  },
};

export function DossierDialog({ open, onOpenChange, lang }: { open: boolean; onOpenChange: (open: boolean) => void; lang: Lang }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const t = copy[lang];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    try {
      await requestDossier({ data: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        website: String(formData.get("website") ?? ""),
        language: lang,
      } });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) setStatus("idle"); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-charcoal/65 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="villa-dossier fixed inset-x-4 top-1/2 z-[71] mx-auto max-h-[calc(100svh-2rem)] w-auto max-w-xl -translate-y-1/2 overflow-y-auto bg-ivory px-6 py-8 text-charcoal shadow-xl outline-none sm:px-12 sm:py-12" aria-describedby="dossier-intro">
          <Dialog.Close asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 text-charcoal hover:bg-stone" aria-label={t.close}><X className="size-5" /></Button>
          </Dialog.Close>
          <p className="eyebrow mb-6 text-wood">Villars-sur-Ollon · 044598</p>
          <Dialog.Title className="max-w-md pr-8 font-serif text-4xl font-light leading-[1.06] sm:text-6xl sm:leading-[1.02]">{t.title}</Dialog.Title>
          {status === "success" ? (
            <div role="status" className="mt-10 border-t pt-8">
              <p className="font-serif text-3xl">{t.success}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.followup}</p>
            </div>
          ) : (
            <>
              <Dialog.Description id="dossier-intro" className="mt-5 text-sm leading-relaxed text-muted-foreground">{t.intro}</Dialog.Description>
               <form onSubmit={submit} className="mt-8 space-y-5">
                <label className="block text-sm uppercase"><span>{t.name}</span><Input name="name" autoComplete="name" required minLength={2} maxLength={120} className="mt-2 h-12 rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-wood" /></label>
                <label className="block text-sm uppercase"><span>{t.email}</span><Input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2 h-12 rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-wood" /></label>
                <label className="block text-sm uppercase"><span>{t.phone}</span><Input name="phone" type="tel" autoComplete="tel" maxLength={40} className="mt-2 h-12 rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-wood" /></label>
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" />
                 <p className="text-sm leading-relaxed text-muted-foreground">{lang === "fr" ? "En envoyant cette demande, vous acceptez que vos coordonnées soient utilisées pour vous répondre." : lang === "de" ? "Mit dem Absenden stimmen Sie zu, dass Ihre Angaben zur Beantwortung Ihrer Anfrage verwendet werden." : "By submitting, you agree that your details may be used to answer your request."} <Link to="/privacy" className="underline underline-offset-4">{lang === "fr" ? "Politique de confidentialité" : lang === "de" ? "Datenschutz" : "Privacy policy"}</Link>.</p>
                {status === "error" && <p role="alert" className="text-sm text-swiss-red">{t.error}</p>}
                <Button type="submit" disabled={status === "sending"} className="mt-4 flex h-14 w-full justify-between rounded-none bg-swiss-red px-6 text-ivory hover:bg-swiss-red/90">
                  {status === "sending" ? t.sending : t.send}<ArrowRight className="size-4" />
                </Button>
              </form>
            </>
          )}
          <Button asChild variant="ghost" className="eyebrow mt-6 h-auto min-h-12 w-full gap-3 whitespace-normal text-swiss-red hover:bg-transparent hover:text-charcoal"><a href={getVisitUrl(lang)} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" className="size-5 shrink-0" />{dict[lang].visitCta}</a></Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}