# Map follows the reading: camera travel and a connecting line for every point

## What changes for the visitor
- As you scroll through "Au cœur de Villars.", each place in the text (Villars Palace, Roc d'Orsay, Beau Soleil, Aiglon, La Garenne) becomes the active one in turn.
- For each active place, the map glides smoothly from the previous place to a view that shows both the apartment and that place, with the place slightly in front.
- The red-wine dashed line always starts at the apartment (Villars) and ends exactly on the active place. When the active place changes, the old line fades out and the new one draws itself from the apartment to the new place.
- Scrolling back up plays the same thing in reverse. A click or tap on a point or a school row does the same thing.
- On phones the map moves the same way, with less movement and no tilt. With "reduce motion" turned on, the map jumps to each view and the line appears already drawn.
- Nothing else on the page changes: same text, colours, layout, filters and points.

## Accuracy
- The line is a straight visual link, not a road or cable-car route. The existing note under the map stays, with wording that covers every place (for example "Lignes : connexions graphiques, pas des itinéraires"), in FR/EN/DE.
- Point positions stay the real OpenStreetMap coordinates already in use.

## Technical details
- `LocationExperience.tsx`: scroll sync runs on each place row instead of each of the three blocks. Every education row and the Palace/Roc blocks get `data-poi`. One IntersectionObserver with a centre band (`-45% 0 -45% 0`) sets `activeId` and derives `category` from the place. Clicks keep working.
- `LocationMap.tsx`:
  - Camera: replace the category framing plus lean with `cameraForBounds([villars, active])`, using asymmetric padding (more room for the label side), `maxZoom` 14.5 and a minimum zoom per tier so far places (Glacier, Aigle) stay readable. Use `flyTo` with duration based on distance (0.9–1.6 s), `curve` 1.2 and the shared ease. Stop any running animation before starting a new one so fast scrolling never leaves the map halfway.
  - Line: the `route` GeoJSON source is updated to `[villars, active]`. Draw-in uses `line-gradient` with `lineMetrics: true`, animated with requestAnimationFrame from 0 to 1 over the flight. The dash look stays through a second dashed layer masked by progress (`line-trim-offset`). Fallback: set the whole line immediately when reduced motion is on.
  - Final state is guaranteed: on `moveend` the line is set to fully drawn and the camera to the exact target.
- Locale strings: update `routeNote` in `i18n.ts` for fr/en/de.
- Check with Playwright at 1280 and 390: scroll step by step, screenshot each active place, confirm the line ends on the active marker and there are no console errors; also run once with reduced motion on.
