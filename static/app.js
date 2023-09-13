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
  maxBounds: indonesiaBounds, // Batas peta
  renderer: L.svg()

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

let options = {
  position: 'topright',
  draw: {
    circle: true,
    rectangle: true,
    marker: true
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!! 
    remove: true
  }
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
  fillColor: '#E0b439',
  fillOpacity: 1
}
$.getJSON(myGeoJSONPath, function (data) {
  L.geoJson(data, {
    clickable: false,
    style: myCustomStyle
  }).addTo(map);
})

L.easyPrint({
  title: "My awesome print button",
  position: "bottomright",
  sizeModes: ["Current", "A4Portrait", "A4Landscape"],
}).addTo(map);

//initialise the L.Draw.Svg.enable function with the svg we want to draw. here we can also include a dialog and such for selection
L.Draw.Svg.include({
  enable: function () {
    let drawsvg = this;

    this._map.fire('modal', {
      title: 'Open SVG',
      content: [
        'Select an SVG to show it on the map<br>',
        '<table>',
        '  <tr>',
        '    <td>file:</td><td><input type="file" id="file-input" /></td>',
        '  <tr></tr>',
        '    <td>scale:</td><td><input type="number" id="scale" name="scale" min="0.000001" max="10.0" value="0.01"></td>',
        '  </tr>',
        '</table><br>'].join(''),

      template: [
        '<div class="modal-header"><h2>{title}</h2></div>',
        '<hr>',
        '<div class="modal-body">{content}</div>',
        '<div class="modal-footer">',
        '  <button class="topcoat-button--large {OK_CLS}">{okText}</button>',
        '  <button class="topcoat-button--large {CANCEL_CLS}">{cancelText}</button>',
        '</div>'
      ].join(''),

      okText: 'Ok',
      cancelText: 'Cancel',
      OK_CLS: 'modal-ok',
      CANCEL_CLS: 'modal-cancel',

      width: 300,

      onShow: function (evt) {
        let modal = evt.modal;
        let imported = null;

        L.DomEvent
          .on(modal._container.querySelector('#file-input'), 'change', function (e) {
            let file = e.target.files[0];
            if (!file) {
              return;
            }
            let reader = new FileReader();
            reader.onload = function (e) {
              imported = e.target.result;
            };
            reader.readAsText(file);
          })
          .on(modal._container.querySelector('.modal-ok'), 'click', function () {
            if (imported != null) {
              drawsvg._svgViewBox = "calculate";
              drawsvg._svgFitBounds = true;
              drawsvg._scale = modal._container.querySelector('#scale').valueAsNumber;
              drawsvg._template = imported;
              L.Draw.SimpleShape.prototype.enable.call(drawsvg);
            }
            modal.hide();
          })
          .on(modal._container.querySelector('.modal-cancel'), 'click', function () {
            modal.hide();
          });
      }
    });
  }
});

// // Buat elemen HTML Bootstrap untuk kotak pertama
// var popupContent = `
//     <div class="container" id="map-box">
//         <div class="row">
//             <div class="col">
//                 <div class="alert alert-primary" role="alert">
//                     Ini adalah kotak Bootstrap di dalam peta Leaflet.
//                 </div>
//             </div>
//         </div>
//     </div>
// `;

// // Buat popup pertama dan tambahkan ke grup layer
// var popupGroup = L.layerGroup().addTo(map);
// var popup1 = L.popup({
//   closeButton: false,
//   autoPan: false,
//   autoClose: false,
// })
//   .setLatLng([centerCoordinates[0] - 13, centerCoordinates[1] - 20])
//   .setContent(popupContent);
// popupGroup.addLayer(popup1);

// // Buat elemen HTML Bootstrap untuk kotak kedua
// var popupContent2 = `
//     <div class="container" id="map-box2">
//         <div class="row">
//             <div class="col">
//                 <div class="alert alert-primary" role="alert">
//                     Ini adalah kotak Bootstrap di dalam peta Leaflet.
//                 </div>
//             </div>
//         </div>
//     </div>
// `;

// // Buat popup kedua dan tambahkan ke grup layer
// var popup2 = L.popup({
//   closeButton: false,
//   autoPan: false,
//   autoClose: false,
// })
//   .setLatLng([centerCoordinates[0] - 13, centerCoordinates[1] + 20])
//   .setContent(popupContent2);
// popupGroup.addLayer(popup2);

// Buat kotak dengan batas koordinat yang telah dihitung
// var rectangle = L.rectangle(bounds, {
//   fillColor: "black", // Warna pengisian
//   fillOpacity: 1, // Opasitas pengisian (0-1)
//   color: "black", // Warna garis tepi
//   weight: 2, // Ketebalan garis tepi
// }).addTo(map);

// // Koordinat tengah kotak
// var centerLatLng = bounds.getCenter();

// // Buat L.divIcon dengan teks di dalamnya
// var customIcon = L.divIcon({
//   className: "custom-icon text-white m-auto",
//   html: '<div style="text-align: center;">Teks di dalam Kotak</div>',
//   iconSize: [100, 100], // Ukuran ikon (sesuaikan sesuai kebutuhan)
//   iconAnchor: [50, 50], // Anchor di tengah ikon
// });

// // Buat marker dengan L.divIcon dan tambahkan ke peta
// var textMarker = L.marker(centerLatLng, { icon: customIcon }).addTo(map);

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
