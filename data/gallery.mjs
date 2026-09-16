/**
 * Project photos.
 *
 * Ships EMPTY. While it is empty the gallery page points visitors at the
 * Facebook feed instead of showing a grid of empty placeholder tiles, and the
 * home page drops its gallery section entirely — an obviously unfinished
 * gallery costs more trust than no gallery at all.
 *
 * To switch it on: drop photos into public/assets/img/gallery/ and add an
 * entry per photo. `alt` matters — it is what Google Images ranks on and what
 * a screen reader announces, so describe the actual work.
 *
 * Example:
 *   {
 *     file: 'driveway-cranberry-2025.jpg',
 *     caption: 'Driveway replacement — Cranberry Township',
 *     alt: 'New broom-finished concrete driveway with a smooth troweled border',
 *     service: 'concrete-driveways',
 *   },
 *
 * Photo tips that make a real difference:
 *   • Shoot after cleanup, in flat light or late afternoon — not midday glare.
 *   • Same angle before and after; pairs convert better than finished shots.
 *   • Resize to about 1600px wide and save as JPEG at ~75% quality.
 */
export const gallery = [];

export default gallery;
