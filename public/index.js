const KEY = 'pk.eyJ1IjoianRyb3NoaW5za3kiLCJhIjoiY2puaWI3a3JoMDc0ajNrcjE5Mmhhb3EyZCJ9.fZ8G7cdM8RjoPaiwq01aYQ';

var data;
var tbl;
var plot;

var matrix;
var matX;
var matY;

var origin = new Array(2);
var dim = new Array(2);

var totalColor;
var colorVal;

var step;

var mark;

const mappa = new Mappa('Mapbox', KEY);
var myMap;

function preload(){
  tbl= loadStrings('farmData.txt');
  mark = loadImage('/img/mark.png');
}

function setup(){
  var myCanvas = createCanvas(1000, 700);
  myCanvas.parent("canvas-div");

  data = new Array(tbl.length);
  for(x in tbl){
    data[x] = splitTokens(tbl[x], ',');
  }

  origin[0] = 44.803748;
  origin[1] = -92.944163;
  dim[0] = (44.803748-44.790315);
  dim[1] = (-92.944163+(-92.931893));

  step=0;

  const options = {
    lat: 44.797520,
    lng: -92.936900,
    zoom: 15,
    studio: true,
    style: 'mapbox://styles/mapbox/satellite-streets-v9'
  };
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

  genMatrix();


  for (var x = 0; x<matrix.lenght;x++){
    row = matrix[x];
    var row = matrix[x];
    for(var y= 0; y<row.length; y++){
      fill(row[y].colorValue);
      rect(xPos,yPos,dim[0],dim[1]);
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

function mouseClicked() {
  drawStat();
}

function genMatrix(){
  for (var x = 0; x<matrix.lenght;x++){
    matrix[x] = new Array(40);
    matX = x;
    var row = matrix[x];
    for(var y= 0; y<row.length; y++){
      matY = y;
      row[y] = new tile();
    }
  }

  setColors();
}

class tile{
  constructor(){
      this.x = matX;
      this.y = matY;

      this.lat = origin[0]+(dim[0]/20*x)
      this.long = origin[1]+(dim[1]/40*y)

      const pos = myMap.latLngToPixel(latitude, longitude);

      this.xPos = pos.x;
      this.yPos = pos.y;

      setPlemColor();
  }

  setPlemColor(){
    var totalDistance = 0;
    for(x in data){
      var row = data[x];

      const latitude = Number(row[0]);
      const longitude = Number(row[1]);
      const pos = myMap.latLngToPixel(latitude, longitude);
      totalDistance = totalDistance + (abs(pos.x-xPos)+abs(pos.y-yPos));

    }

    var plemColor = 0;

    for(x in data){
      var row = data[x];

      const latitude = Number(row[0]);
      const longitude = Number(row[1]);
      const pos = myMap.latLngToPixel(latitude, longitude);
      plemColor = plemColor + ((totalDistance/(abs(pos.x-xPos)+abs(pos.y-yPos)))*row[2]);
    }

    this.pColor=plemColor;
  }

  setColor(){
    this.colorValue = colorVal;
  }
}

function setColors(){
  var max= -1000;
  var min= 1000000000000000;
  var tempColor=0;

  for (var x = 0; x<matrix.lenght;x++){
    var row = matrix[x];
    for(var y= 0; y<row.length; y++){
      if(row[y].plemColor>max){
        max = row[y].plemColor;
      }
      if(row[y].plemColor<min){
        min = row[y].plemColor;
      }
    }
  }

  for (var x = 0; x<matrix.lenght;x++){
    var row = matrix[x];
    for(var y= 0; y<row.length; y++){
      row[y].setColor(row[y].plemColor*(255/max));
    }
  }
}
