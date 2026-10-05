# Evolution plan: German, SEO, contact, and refinements

The page keeps its approved look: same opening, sections, colours, fonts, gallery and buttons. Everything below adds to it or polishes it.

## 1. German language (FR | EN | DE)
- Add a third option to the language switch: FR | EN | DE. French stays the default.
- Translate every piece of text into Swiss Standard German, using Swiss spelling ("ss", never "ß") and the price format CHF 590'000.-. This covers the menu, opening, apartment sections, location and lifestyle sections, the four seasons, the details table, the amenities list, the gallery labels, the dossier form, the sticky mobile bar, the contact area and the photo credits.
- Remember the visitor's chosen language and preselect it from the browser language on a first visit. The page always first loads in French so search engines see one consistent version.
- Real place and school names stay in their original form.

## 2. Search engines and sharing
- Add structured property data: an apartment for sale in Villars-sur-Ollon at CHF 590'000, 48 m², 2.5 rooms, renovated in 2023, with the owner's contact details.
- Add signals saying the page is available in French, English and German.
- Add German to the alternative languages in sharing previews.
- Add a sitemap and point robots.txt to it.
- Give every photo a proper description in all three languages.

## 3. Contact and conversion
- Add a discreet WhatsApp link using +41 76 542 62 30, with a pre-written message in the visitor's language that quotes ref. 044598. It goes in the contact area and beside the existing actions. No floating bubble.
- Translate the dossier form's confirmation and error messages into German, and make the field labels clearer for screen readers.

## 4. Map and location
- Refine the stylised map with thin contour lines, the Rhône valley and a suggestion of Lake Geneva. The note "Illustration géographique simplifiée" stays.
- Make the map points easier to tap on phones (larger touch area) and usable with the keyboard.

## 5. Look, motion and comfort
- Polish small details only: consistent spacing between the new location sections, sharper title line breaks on 390 px screens, and no orphan words in headlines.
- Make sure every new animation stops when the system "reduce motion" setting is on, and that nothing jumps while photos load (images reserve their space).
- Load photos further down the page only when needed, so the first screen appears faster.

## 6. Copy proofreading
- Proofread FR and EN once more: typographic apostrophes, non-breaking spaces before ":" and "?" in French, consistent use of "m²", "min" and "CHF".
- Translate English leftovers in the French version (for example "Beyond Villars", "International schools", "Play above the clouds") or keep them deliberately as stylistic choices. See the question below.

## Order
1. German language and proofreading
2. Search engine and sharing data
3. WhatsApp contact
4. Map refinements and polish
5. Full check on computer, 430 px and 390 px, in all three languages

## Open questions (current choices shown, can be changed)
- English phrases inside the French version: they will be translated into French, except "Peak Walk by Tissot", which is a proper name.
- WhatsApp will use the same number as phone calls.

## Technical details
- Extend `Lang` to `"fr" | "en" | "de"` and add a full `de` dictionary to `i18n.ts`, typed as `Dict` so missing keys fail the typecheck. Update the toggle in `Villa.tsx`, `DossierDialog.tsx` and `VillarsLifestyle.tsx`.
- Store the language choice in localStorage. Read it in `useEffect` to avoid a hydration mismatch, and update `document.documentElement.lang`.
- JSON-LD (`RealEstateListing` + `Offer` + `Apartment`) goes in the `head().scripts` of `src/routes/index.tsx`. Add `alternate` hreflang links (fr, en, de, x-default) pointing to the same canonical URL, plus `og:locale:alternate` de_CH.
- Add a `src/routes/sitemap[.]xml.ts` server route and a `Sitemap:` line in robots.txt.
- WhatsApp link: `https://wa.me/41765426230?text=` with an encoded message.
- No new dependencies. GSAP stays as it is, and new animations are gated by `gsap.matchMedia` and the reduced-motion setting.
- Update AGENTS.md (the three-language rule) and roadmap.md.
