const key = 'pk.eyJ1IjoianRyb3NoaW5za3kiLCJhIjoiY2puaWI3a3JoMDc0ajNrcjE5Mmhhb3EyZCJ9.fZ8G7cdM8RjoPaiwq01aYQ';
// Create an instance of Mapboxgl
const mappa = new Mappa('Mapbox', key);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Options for map
const options = {
  lat: 44.797520,
  lng: -92.936900,
  zoom: 15,
  style: 'mapbox://styles/mapbox/satellite-streets-v9',
};

const myMap = mappa.tileMap(options);

// Make a circle
const circle = (x, y, s) => {
  ctx.beginPath();
  ctx.arc(x, y, s, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "#00ff1f";
  ctx.fill();
};


// Draw the meteorites
const drawData = () => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  meteorites.forEach((e) => {
    //const mass = convertRange(e.size, [558, 60000000], [2, 15]);
    const pos = myMap.latLngToPixel(e.lat, e.lng);
    circle(pos.x, pos.y, 10);
  });
};

// Load the data using d3.js
d3.csv("farmData.txt", d => {
  return {
    lat: Number(d.reclat),
    lng: Number(d.reclong),
    size: Number(d['score']),
  }
}, data => {
  meteorites = data;
  drawData();
});

myMap.overlay(canvas);
myMap.onChange(drawData);