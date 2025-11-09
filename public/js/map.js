// ✅ Secure map rendering (no API key here)

// Local style using proxy tiles
const style = {
  version: 8,
  sources: {
    "proxy-tiles": {
      type: "raster",
      tiles: ["/tiles/{z}/{x}/{y}.png"], // uses secure backend proxy
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "proxy-tiles",
      type: "raster",
      source: "proxy-tiles",
    },
  ],
};

// Create default map
const map = new maptilersdk.Map({
  container: "map",
  style: style,
  center: [77.209, 28.6139],
  zoom: 4,
});

// Function to auto-show listing location
async function showListingLocation(location) {
  try {
    const res = await fetch(`/geocode?q=${encodeURIComponent(location)}`);
    const data = await res.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].geometry.coordinates;

      map.flyTo({ center: [lng, lat], zoom: 12 });

      new maptilersdk.Marker()
        .setLngLat([lng, lat])
        .setPopup(new maptilersdk.Popup().setHTML(`<b><p>${location} exact location provided after booking</p></b>`))
        .addTo(map);
    } else {
      console.warn("❌ Location not found:", location);
    }
  } catch (err) {
    console.error("❌ Geocoding error:", err);
  }
}

// ✅ Automatically run for listing
if (typeof listingLocation !== "undefined" && listingLocation.trim() !== "") {
  showListingLocation(listingLocation);
}
