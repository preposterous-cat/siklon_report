// URL GeoJSON
const geojsonURL =
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia.geojson";

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

// Fungsi untuk memuat seluruh provinsi
function loadState() {
  fetch(geojsonURL)
    .then((response) => response.json())
    .then((data) => {
      //Looping nama provinsi
      data.features.forEach(feature => {
        console.log(feature.properties.state);
      });


    })
    .catch((error) => {
      console.error("Error loading GeoJSON:", error);
    });
}

loadState();

//Tombol Tambah
$(document).on("click", ".addWilayah", function () {
  let wilayahChild = `<div class="row wilayahChild mb-2">
      <div class="col-sm-2 text-dark">
        <button class="btn btn-info addWilayah">Add</button>
      </div>
      <div class="col-sm-2 text-dark">
        <button class="btn btn-danger remWilayah">Rem</button>
      </div>
      <div class="col-sm-8">
        <select
          class="form-select daftarWilayah"
          aria-label="Default select example"
        >
          <option selected>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
    </div>`;
  $(".wilayahParent").append(wilayahChild);
});

//Tombol Kurang
$(document).on("click", ".remWilayah", function () {
  $(this).closest(".wilayahChild").remove();
});
