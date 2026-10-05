<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Landing page sections live in src/components/villa/; FR/EN copy lives in i18n.ts dictionary — keeps copy editable in one place.
- Scroll animations use GSAP ScrollTrigger + Lenis inside one gsap.context; pinned effects only under gsap.matchMedia(min-width 768px) — mobile stays light.
- Property photos use faithful restored WebP versions of the brochure originals; direct-sale contact uses the owner's supplied email and phone via mailto/tel links, without a backend form — this avoids invented property views or routing leads to the former agency.
- The entrance uses the supplied logo as a transparent CDN asset, and Swiss red/light surfaces replace black backgrounds — this preserves the client's brand while avoiding black page panels.
- Dossier enquiries are validated in a public server function and stored in a locked Cloud table for manual owner follow-up; no dossier file is available to send automatically.
- The Villars location and lifestyle narrative is isolated in VillarsLifestyle and mounted in the original location slot — this preserves every approved property and conversion section unchanged.
- Location photography must be a verified real view of the named place, carry its visible reuse credit, and be registered in the asset credit file — this prevents synthetic or unlicensed tourism imagery from being presented as factual.
- The page is trilingual (FR default, EN, DE); every dictionary language is typed against the French Dict so missing keys fail the typecheck.
