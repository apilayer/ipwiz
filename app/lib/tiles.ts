/**
 * Basemap configuration.
 *
 * This used to point at CARTO's basemaps. They need no API key, which is how
 * they get picked, but needing no key and being free to use are different
 * questions. OpenStreetMap's standard tiles are genuinely free with
 * attribution, so the dark and light styles are now the same OSM tiles under a
 * CSS filter rather than two pre-styled basemaps.
 *
 * OSM asks heavy consumers to move to their own provider. Point
 * NEXT_PUBLIC_TILE_URL at any {z}/{x}/{y} endpoint to do that.
 *
 * @see https://operations.osmfoundation.org/policies/tiles/
 */
export const TILE_URL =
  process.env.NEXT_PUBLIC_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" style="color:#71717a">OpenStreetMap</a> contributors';

/** OSM's standard tiles stop at 19; asking for more just 404s. */
export const TILE_MAX_ZOOM = 19;

/**
 * Applied to Leaflet's tile pane to settle OSM's default palette down so the
 * markers stay the loudest thing on the map. A custom NEXT_PUBLIC_TILE_URL is
 * assumed to be styled already and is left alone.
 */
export const TILE_FILTER = process.env.NEXT_PUBLIC_TILE_URL
  ? ""
  : "saturate(0.6) contrast(0.96)";
