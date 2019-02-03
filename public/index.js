const key = 'pk.eyJ1IjoianRyb3NoaW5za3kiLCJhIjoiY2puaWI3a3JoMDc0ajNrcjE5Mmhhb3EyZCJ9.fZ8G7cdM8RjoPaiwq01aYQ';
// Create an instance of Mapboxgl
const mappa = new Mappa('MapboxGL', key);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let meteorites = [];

// Options for map
const options = {
  lat: 44.797520,
  lng: -92.936900,
  zoom: 15,
  style: 'mapbox://styles/mapbox/traffic-night-v2',
  pitch: 50,
};
const myMap = mappa.tileMap(options);

myMap.overlay(canvas);
