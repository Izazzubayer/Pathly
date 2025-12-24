// Mapbox style configuration
// Using light theme for calm, minimal feel

export const MAP_STYLE = 'mapbox://styles/mapbox/light-v11';

// Alternative: Use a custom style from Mapbox Studio
// export const MAP_STYLE = 'mapbox://styles/your-username/your-style-id';

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

