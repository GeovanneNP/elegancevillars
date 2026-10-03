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
- Property photos use faithful restored WebP versions of the brochure originals, while direct-sale contact stays informational until owner details are supplied — this avoids invented property views or routing leads to the former agency.
