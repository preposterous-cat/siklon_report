// URL GeoJSON
const geojsonURL =
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia.geojson";

// Fungsi untuk memuat dan menampilkan GeoJSON Provinsi Lampung
function loadAndDisplayLampungGeoJSON(map, daftarWilayah = []) {
  fetch(geojsonURL)
    .then((response) => response.json())
    .then((data) => {
      // Filter fitur yang sesuai dengan Provinsi Lampung (gantilah 'Lampung' sesuai dengan data Anda)
      let lampungFeatures = data.features.filter((feature) =>
        daftarWilayah.includes(feature.properties.state)
      );

      // Buat layer GeoJSON
      let lampungGeoJSON = L.geoJSON(lampungFeatures, {
        style: {
          fillColor: "red",
          fillOpacity: 1,
          color: "red",
          weight: 2,
        },
      });

      // Tambahkan layer GeoJSON ke peta
      lampungGeoJSON.addTo(map);
    })
    .catch((error) => {
      console.error("Error loading Lampung GeoJSON:", error);
    });
}

// Inisialisasi peta
let indonesiaBounds = [
  [-10.9417, 94.9722], // Sudut Barat-Selatan
  [5.9075, 141.0458], // Sudut Timur-Utara
];

let map = L.map("map", {
  center: [-2.5489, 118.0149], // Koordinat tengah Indonesia
  zoom: 5, // Tingkat zoom awal
  maxZoom: 19,
  maxBounds: indonesiaBounds, // Batas peta
}); // Koordinat tengah Indonesia dan tingkat zoom

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  }
).addTo(map);

// Panggil fungsi untuk memuat dan menampilkan GeoJSON Provinsi Lampung
loadAndDisplayLampungGeoJSON(map);

// Fungsi untuk memuat seluruh provinsi
function loadState() {
  fetch(geojsonURL)
    .then((response) => response.json())
    .then((data) => {
      //Looping nama provinsi
      let optionWilayah = ``;
      let arrayWilayah = [];
      data.features.forEach((feature) => {
        arrayWilayah.push(feature.properties.state);
        // console.log(feature.properties.state);
      });
      arrayWilayah.sort();

      arrayWilayah.forEach((wilayah) => {
        optionWilayah += `<option value="${wilayah}">${wilayah}</option>`;
      });

      $(".daftarWilayah").append(optionWilayah);
    })
    .catch((error) => {
      console.error("Error loading GeoJSON:", error);
    });
}

loadState();

//Tombol Tambah
$(document).on("click", ".addWilayah", function () {
  let daftarWilayah = $(".daftarWilayah").html();
  let wilayahChild =
    `<div class="row wilayahChild mb-2">
      <div class="col-sm-2 text-dark">
        <button class="btn btn-info addWilayah">Add</button>
      </div>
      <div class="col-sm-2 text-dark">
        <button class="btn btn-danger remWilayah">Del</button>
      </div>
      <div class="col-sm-8">
        <select
          class="form-select daftarWilayah"
          aria-label="Default select example"
        >
         ` +
    daftarWilayah +
    `
        </select>
      </div>
    </div>`;
  $(".wilayahParent").append(wilayahChild);
});

//Tombol Kurang
$(document).on("click", ".remWilayah", function () {
  $(this).closest(".wilayahChild").remove();
});

//Tombol Process
$(document).on("click", ".process", async function () {
  let wilayahTerpilih = [];
  $(".daftarWilayah").each(function () {
    wilayahTerpilih.push($(this).val());
  });

  await loadAndDisplayLampungGeoJSON(map, wilayahTerpilih);

  //Fungsi Capture Maps menjadi Image
  let elementMap = $("#map");
  console.log(elementMap);

  html2canvas(elementMap[0], {
    useCORS: true, // Tambahkan ini untuk mengaktifkan CORS
  }).then(function (canvas) {
    let image = canvas.toDataURL("image/png");

    $("#image-temp").attr("src", image);
  });
});
