function initMap() {
  const indonesiaBounds = {
    north: 5.9075, // Garis Utara
    south: -10.9417, // Garis Selatan
    west: 94.9722, // Garis Barat
    east: 141.0458, // Garis Timur
  };

  const mapOptions = {
    center: { lat: -2.5489, lng: 118.0149 }, // Koordinat tengah Indonesia
    restriction: {
      latLngBounds: indonesiaBounds,
      strictBounds: false,
    },
    zoom: 5, // Anda dapat menyesuaikan tingkat zoom sesuai kebutuhan
    styles: [
      {
        featureType: "administrative",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // URL GeoJSON
  const geojsonURL =
    "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia.geojson";

  // Fungsi untuk memuat dan menampilkan GeoJSON Provinsi Lampung
  function loadAndDisplayLampungGeoJSON() {
    fetch(geojsonURL)
      .then((response) => response.json())
      .then((data) => {
        // Filter fitur yang sesuai dengan Provinsi Lampung (gantilah 'Lampung' sesuai dengan data Anda)
        const lampungFeatures = data.features.filter((feature) =>
          ["Sumatera Selatan", "Lampung"].includes(feature.properties.state)
        );

        // Buat objek Data Layer untuk menampilkan fitur-fitur tersebut
        const lampungDataLayer = new google.maps.Data();
        lampungDataLayer.addGeoJson({
          type: "FeatureCollection",
          features: lampungFeatures,
        });

        // Setel gaya atau warna polygon sesuai keinginan Anda
        lampungDataLayer.setStyle({
          fillColor: "red",
          fillOpacity: 1,
          strokeColor: "maroon",
          strokeWeight: 2,
        });

        // Tambahkan Data Layer ke peta
        lampungDataLayer.setMap(map);
      })
      .catch((error) => {
        console.error("Error loading Lampung GeoJSON:", error);
      });
  }

  // Panggil fungsi untuk memuat dan menampilkan GeoJSON Provinsi Lampung
  loadAndDisplayLampungGeoJSON();
}

window.initMap = initMap;
