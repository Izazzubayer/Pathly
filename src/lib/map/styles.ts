// MapLibre style configuration
// Using OpenStreetMap-based styles (free, no token required)

// MapLibre uses OpenStreetMap styles - no API key needed!
export const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

// Alternative free styles:
// - 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' (dark)
// - 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' (colorful)
// - 'https://demotiles.maplibre.org/style.json' (demo style)

// Map configuration
export const MAP_CONFIG = {
  style: MAP_STYLE,
  initialViewState: {
    longitude: 0,
    latitude: 0,
    zoom: 2,
  },
  minZoom: 2,
  maxZoom: 18,
};

