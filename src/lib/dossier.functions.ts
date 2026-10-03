import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40),
  language: z.enum(["fr", "en"]),
  website: z.string().max(200),
});

export const requestDossier = createServerFn({ method: "POST" })
  .validator((input) => requestSchema.parse(input))
  .handler(async ({ data }) => {
    // Hidden field keeps simple automated submissions out of the private list.
    if (data.website) return { ok: true };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("dossier_requests").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      language: data.language,
      property_reference: "044598",
    });
    if (error) throw new Error("Unable to save dossier request");
    return { ok: true };
  });