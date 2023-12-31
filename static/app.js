// URL GeoJSON
const geojsonURL =
  "https://raw.githubusercontent.com/preposterous-cat/indonesia-geojson/master/indonesia.geojson";

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

// Koordinat pusat peta
var centerCoordinates = [-2.5489, 118.0149];

// Hitung koordinat sudut-sudut kotak berdasarkan pusat peta
var halfSize = 2; // Setengah dari ukuran kotak (tingkatkan sesuai kebutuhan)
var corner1 = L.latLng(
  centerCoordinates[0] - halfSize - 13,
  centerCoordinates[1] - halfSize - 10
);
var corner2 = L.latLng(
  centerCoordinates[0] + halfSize - 10,
  centerCoordinates[1] + halfSize - 30
);

// Batas kotak
var bounds = L.latLngBounds(corner1, corner2);

let map = L.map("map", {
  center: centerCoordinates, // Koordinat tengah Indonesia
  zoom: 5, // Tingkat zoom awal
  maxZoom: 19,
  // maxBounds: indonesiaBounds, // Batas peta
  renderer: L.svg(),
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

let editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

const customIcon = new L.Icon({
  iconUrl: "", // Ganti dengan path menuju gambar PNG Anda
  iconSize: [0, 0], // Sesuaikan dengan ukuran gambar
});

let options = {
  position: "topright",
  draw: {
    circle: true,
    rectangle: {
      shapeOptions: {
        color: "blue", // Warna stroke
        fillColor: "yellow", // Warna fill
        fillOpacity: 1,
      },
    },
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: true,
  },
};
let drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

//register events
map.on(L.Draw.Event.CREATED, function (e) {
  editableLayers.addLayer(e.layer);
});

//Map Color
let myGeoJSONPath = "../static/geojson/world.geo.json";
let myCustomStyle = {
  stroke: false,
  fill: true,
  fillColor: "#E0b439",
  fillOpacity: 1,
};

//Map Color
let oceanGeoJSONPath = "../static/geojson/oceans.geojson";
let oceanCustomStyle = {
  stroke: true,
  fill: true,
  fillColor: "#F5F5F5",
  color: "#F5F5F5",
  fillOpacity: 1,
  weight: 10, // Lebar garis (stroke) dalam piksel
};

let addedLayers = {};
let n = 0;
let COLOR = "black";

function renderMap(coordinate = [], text = [], intensity = [], color = COLOR) {
  $.getJSON(oceanGeoJSONPath, function (data) {
    L.geoJson(data, {
      clickable: false,
      style: oceanCustomStyle,
    }).addTo(map);
  });
  $.getJSON(myGeoJSONPath, function (data) {
    L.geoJson(data, {
      clickable: false,
      style: myCustomStyle,
    }).addTo(map);

    // Buat polyline
    if (coordinate.length > 0) {
      const coordinates = coordinate;

      const polyline = L.polyline(coordinates, {
        color: color, // Ganti dengan warna yang Anda inginkan
      }).addTo(map);
      addedLayers[`polyline${n}`] = polyline;
      let m = 0;

      // Tambahkan elemen SVG sebagai marker pada setiap titik koordinat dalam polyline
      coordinates.forEach((coord, index) => {
        const customIcon = L.divIcon({
          className: "custom-icon-class",
          html: `
          <div style="position: relative;margin:10px">
            <div class="circle"></div> <!-- Lingkaran -->
            <div class="intensity">${intensity[index]}</div>
            <img src="static/images/tc.png" alt="Marker" style="width:20px" />
            <div class="custom-text rotated" style="margin-top: -63px;margin-right: -30px;margin-left: -25px;
            margin-bottom: -30px;;width:70px"><strong style="">${text[index]}</strong></div>
          </div>
            `,
          iconSize: [40, 40], // Sesuaikan dengan ukuran SVG Anda
        });

        let marker = L.marker(coord, { icon: customIcon }).addTo(map);
        addedLayers[`marker${n}-${m}`] = marker;

        // Tambahkan CSS untuk memutar teks sebesar 180 derajat
        const rotatedText = marker._icon.querySelector(".rotated");
        rotatedText.style.transform = "rotate(85deg)";
        const circleElement = marker._icon.querySelector(".intensity");
        circleElement.style.position = "absolute";
        circleElement.style.top = "20%";
        circleElement.style.left = "50%";
        circleElement.style.width = "15px"; // Sesuaikan dengan ukuran yang Anda butuhkan
        circleElement.style.height = "15px"; // Sesuaikan dengan ukuran yang Anda butuhkan
        circleElement.style.transform = "translate(-50%, 10%)";
        circleElement.style.backgroundColor = "white"; /* Fill putih */
        circleElement.style.border = "2px solid black"; /* Stroke hitam */
        circleElement.style.borderRadius = "50%"; /* Membuatnya lingkaran */
        circleElement.style.textAlign = "center"; // Pusatkan teks
        circleElement.style.lineHeight = "13px"; // Sesuaikan dengan ukuran yang Anda butuhkan
        circleElement.style.fontWeight = "bold"; // Membuat teks menjadi tebal (bold)

        // Hitung jarak dalam piksel ke titik selanjutnya (jika bukan titik terakhir)
        if (index < coordinates.length - 1) {
          const nextCoord = coordinates[index + 1];

          // Tambahkan arrowHead dengan offset yang dihitung
          const arrowHead = L.polylineDecorator([coord, nextCoord], {
            patterns: [
              {
                offset: "50%",
                repeat: 0,
                symbol: L.Symbol.arrowHead({
                  pixelSize: 10,
                  pathOptions: {
                    color: color, // Ganti dengan warna yang diinginkan
                    fillOpacity: 1,
                    weight: 1, // Lebar garis
                  },
                }),
              },
            ],
          }).addTo(map);
          addedLayers[`arrowHead${n}-${m}`] = arrowHead;
        }
        m++;
      });

      // polyline.bringToFront();
      n++;
    }
  });
}

renderMap();
let igSize = {
  width: 1080,
  height: 1080,
  className: "igSize",
  name: "Instagram Size",
  icon: "P",
};
L.easyPrint({
  title: "My awesome print button",
  position: "bottomright",
  exportOnly: true,
  sizeModes: ["Current", "A4Portrait", "A4Landscape", igSize],
}).addTo(map);

$("#upload-csv").on("submit", function (e) {
  e.preventDefault();
  $("#btn-csv").prop("disabled", true);
  setTimeout(() => {
    $("#btn-csv").prop("disabled", false);
  }, 1000);
  var formData = new FormData(this);
  // console.log(formData);
  $.ajax({
    type: "POST",
    url: "/read_csv_report",
    data: formData,
    contentType: false,
    processData: false,
    success: function (data) {
      // Tampilkan hasil pemrosesan di div "result"
      let coordinates = [];
      let text = [];
      let intensity = [];
      for (let index = 0; index < data.latitudes.length; index++) {
        let coor = [data.longitudes[index], data.latitudes[index]];
        coordinates.push(coor);
        text.push(data.tanggal[index] + " " + data.waktu[index]);
        intensity.push(data.intensity[index]);
        // console.log(text);
      }
      renderMap(coordinates, text, intensity);
    },
    error: function () {
      alert("Terjadi kesalahan dalam pengiriman data.");
    },
  });
});

$("#reset-plot").on("click", function () {
  for (const layerId in addedLayers) {
    const layer = addedLayers[layerId];
    map.removeLayer(layer);
  }
  addedLayers = {}; // Kosongkan objek setelah menghapus
  // Aktifkan mode edit
  map.editable.enable();
});

// Tambahkan teks yang dapat diedit ke peta
// const textLayer = L.Editable.Text([-2.5489, 118.0149], "Teks Anda di sini", {
//   className: "custom-text-class", // Atur kelas CSS
//   fontSize: "16px", // Atur ukuran font
//   color: "blue", // Atur warna teks
// }).addTo(map);

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
$(document).on("click", ".process", function () {
  let wilayahTerpilih = [];
  $(".daftarWilayah").each(function () {
    wilayahTerpilih.push($(this).val());
  });

  loadAndDisplayLampungGeoJSON(map, wilayahTerpilih);
});

// Mendengarkan perubahan input dan memperbarui ikon marker
document.getElementById("updateMarker").addEventListener("click", function () {
  var fileImage = document.getElementById("imageUpload");
  var iconWidth = parseInt(document.getElementById("iconWidth").value);
  var iconHeight = parseInt(document.getElementById("iconHeight").value);

  var file = fileImage.files[0];
  var imageUrl = URL.createObjectURL(file);

  // Validasi input
  if (imageUrl && iconWidth && iconHeight) {
    // Buat ikon baru dengan URL dan ukuran yang diinputkan
    var customIcon = new L.Icon({
      iconUrl: imageUrl,
      iconSize: [iconWidth, iconHeight],
    });

    // Perbarui ikon marker pada opsi
    drawControl.setDrawingOptions({
      marker: {
        icon: customIcon,
      },
    });

    alert("Ikon marker telah diperbarui!");
  } else {
    alert("Mohon isi URL gambar, lebar, dan tinggi ikon.");
  }
});

// Fungsi untuk mengubah warna myCustomStyle
$(".updateMap").on("click", function () {
  const colorInputOcean = document.getElementById("ocean-color").value;
  const colorInputIsland = document.getElementById("island-color").value;
  oceanCustomStyle.color = colorInputOcean;
  oceanCustomStyle.fillColor = colorInputOcean;
  myCustomStyle.fillColor = colorInputIsland;
  // Update peta dengan warna baru
  reRenderMap();
});

$(".resetProcess").on("click", function () {
  renderMap();
});

// Fungsi untuk memperbarui peta dengan warna yang diperbarui
function reRenderMap() {
  // Hapus lapisan yang ada
  for (const key in addedLayers) {
    map.removeLayer(addedLayers[key]);
  }

  // Render peta kembali dengan warna yang diperbarui
  renderMap();
}

// // Gambar yang akan ditambahkan ke peta
// var imageUrl = "static/images/myMap.png"; // Ganti dengan URL gambar PNG/JPG yang sesuai

// // Buat lapisan gambar
// var imageOverlay = L.imageOverlay(imageUrl, indonesiaBounds).addTo(map);
