const options = {
  lat: 44.797520,
  lng: -92.936900,
  zoom: 15,
  studio: true,style: 'mapbox://styles/mapbox/satellite-streets-v9'
};

var key = 'pk.eyJ1IjoianRyb3NoaW5za3kiLCJhIjoiY2puaWI3a3JoMDc0ajNrcjE5Mmhhb3EyZCJ9.fZ8G7cdM8RjoPaiwq01aYQ';

var data;
var tbl;
var plot;

var matrix
var matX;
var matY;

var mark;

const mappa = new Mappa('Mapbox', key);
var myMap;

function preload(){
  tbl= loadStrings('farmData.txt');
  mark = loadImage('mark.png');
}

function setup(){
  var myCanvas = createCanvas(800, 550);
  myCanvas.parent("farmMap");

  data = new Array(tbl.length);
  for(x in tbl){
    data[x] = splitTokens(tbl[x], ',');
  }

  //genMatrix();

  myMap = mappa.tileMap(options);
  myMap.overlay(myCanvas);
  myMap.onChange(drawPoints);

}

function drawPoints(){
  clear();
  stroke(0);
  fill(255);

  for(x in data){
    var row = data[x];
    if(x <data.length-1){
      const latitude = Number(row[0]);
      const longitude = Number(row[1]);

      if (myMap.map.getBounds().contains([latitude, longitude])) {
        const pos = myMap.latLngToPixel(latitude, longitude);
        image(mark,pos.x-mark.width,pos.y-mark.height,mark.width, mark.height);
      }
    }
  }
}

function drawStat(){
  var closestX=-100;
  var closestY=-100;
  var diffX=10000;
  var diffY=10000;
  var index;

  for(x in data){
    var row = data[x];
    const latitude = Number(row[0]);
    const longitude =  Number(row[1]);
    if (myMap.map.getBounds().contains([latitude, longitude])) {
      const pos = myMap.latLngToPixel(latitude, longitude);
      if(abs(mouseX-pos.x)<diffX && abs(mouseY-pos.y)<diffY){
        closestX=pos.x;
        closestY=pos.y;
        diffX=abs(mouseX-pos.x);
        diffY= abs(mouseY-pos.y);
        index=x;
      }
    }
  }

  if(diffX+diffY<90){
    fill(255);
    var row = data[index];
    const latitude = Number(row[0]);
    const longitude =  Number(row[1]);
    const pos = myMap.latLngToPixel(latitude, longitude);
    rect(pos.x,pos.y-43,80,40);
    fill(0);
    textSize(10);
    text("Score: "+row[2],pos.x+2,pos.y-33);
    text("Temp: ",pos.x+2,pos.y-25);
    text("Temp: ",pos.x+2,pos.y-17);
    text("Wind: ",pos.x+2,pos.y-9);
    text("Preasure: ",pos.x+2,pos.y-1);
  }
}

function mouseClicked(){
  drawStat();
}

function genMatrix(){
  for (var x =0; x<matrix.lenght;x++){
    matrix[x] = new Array(40);
    matX = x;
    var row = matrix[x];
    for(var y=0; y<row.length; y++){
      matY = y;
      //let row[x] = new tile(x,y);
    }
  }

}

class tile(){
  constructor(){
    this.x = matX;
    this.y = matY;
  }
}
