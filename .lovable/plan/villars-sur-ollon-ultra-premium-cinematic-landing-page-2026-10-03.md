# Villars-sur-Ollon — Ultra-premium cinematic landing page

A single page with an editorial, Swiss-luxury feel for listing ref. 044598 (CHF 590'000), following the brief closely. The French copy comes from the brief.

## Look
- Palette from the brief: ivory #F4F1EA, stone #E8E1D5, gold #C6A15B (used sparingly), wood #92795F, charcoal #21201E, near-black #0A0A0A, white.
- Headlines in Cormorant Garamond (editorial serif). Body text in Manrope.
- Lots of empty space, asymmetric layouts, thin dividing lines, square corners, no card boxes and no colour fades.

## Photos
- The 8 property photos in the Sotheby's brochure (living room, kitchen, bedroom, balcony, etc.) will be pulled out and used at their real size.
- The brochure photos are small (about 740px wide), so the full-screen sections may look slightly soft. A few extra atmosphere images (Alpine landscape, all four seasons) will be AI-generated for the Four Seasons and location sections. The property itself will only be shown with real photos.
- If you have higher-resolution originals, send them and they can be swapped in.

## Sections (in order)
1. Cinematic loading screen: VILLARS / 46°18'N, a growing line, then "Élégance alpine". Shown once per visit.
2. Full-screen opening photo with a slow zoom, a see-through top bar (Sotheby's mark, menu, FR | EN), the large headline, key figures, a call to action and a scroll cue.
3. Manifesto: "Entre bois, pierre et sommets", revealed line by line.
4. Living room: the photo stays in place while it grows from a framed view to full screen, with short captions appearing alongside.
5. Key figures on a dark background (48 m², 2.5 pièces, 1 chambre, 2023), with numbers that count up.
6. Interior: editorial layout of the kitchen and living area, with image and text moving at slightly different speeds.
7. Bedroom: a large headline that the photo slides over, plus a second overlapping photo.
8. Balcony: the photo opens from a small frame to full screen, with "Respirez Villars."
9. Location: travel times linked by an animated line, plus a minimal hand-drawn-style map of the Swiss Alps.
10. Four seasons: "UN LIEU. QUATRE SAISONS." with ski, hiking, golf and more appearing as you scroll.
11. Details: a clean table divided by thin lines.
12. Amenities: a slow scrolling band of words that slows down when hovered.
13. Gallery: a mixed editorial layout with a "VIEW" cursor, and a full-screen viewer with arrow keys and ESC.
14. Ownership: price, availability and "Demander le dossier complet".
15. Contact and footer: Christopher Janin, phone, email, and an inquiry form that opens the visitor's email app.

## Mobile
The whole page will work on phones. The heavy pinned scroll effects become simpler fades so scrolling stays smooth on small screens.

## Language
French by default. The FR | EN switch toggles all text to English.

## Technical details
- GSAP + ScrollTrigger + Lenis, using transform, opacity, clip-path and scale only. Animations respect prefers-reduced-motion.
- Brochure images are extracted with pdfimages and uploaded through lovable-assets. A small i18n dictionary holds FR/EN text. Each section is its own component under src/components/villa/. The index route gets full head metadata.
- No backend: the contact form uses a mailto link.
