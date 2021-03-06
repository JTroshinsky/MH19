const KEY = 'pk.eyJ1IjoianRyb3NoaW5za3kiLCJhIjoiY2puaWI3a3JoMDc0ajNrcjE5Mmhhb3EyZCJ9.fZ8G7cdM8RjoPaiwq01aYQ';

var data;
var tbl;
var plot;

var fData;
var ftbl
var loaded;

var matrix;
var matX;
var matY;

var origin = new Array(2);
var dim = new Array(2);
var tileDim = new Array(2);

var totalColor;
var colorVal;
var col;

var oppacity;

var mark;

const mappa = new Mappa('Mapbox', KEY);
var myMap;

function preload(){
  tbl= loadStrings('farmData.txt');
  mark = loadImage('/img/mark.png');
  loaded = 0;
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
  dim[1] = abs(-92.944163-(-92.931893));
  oppacity = 120;

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

  var dLat = origin[0]-(dim[0]/20);
  var dLong = origin[1]+(dim[1]/40);

  const posit = myMap.latLngToPixel(dLat, dLong);
  const posit2 = myMap.latLngToPixel(origin[0], origin[1]);

  tileDim[0] = posit.x-posit2.x;
  tileDim[1] = posit.y-posit2.y;

  for (var x = 0; x<matrix.length;x++){
    var row = matrix[x];
    for(var y= 0; y<row.length; y++){
      fill(row[y].colorValue,oppacity);
      rect(row[y].xPos,row[y].yPos,tileDim[0],tileDim[1]);
    }
  }

  fill(255);
  rect(890,10,100,35);
  textSize(12);
  fill(0);
  stroke(0);
  text("+",910,30);
  text("-",960,30);
  stroke(190);
  line(888,11,888,41);
  line(938,11,938,41);
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
    rect(pos.x,pos.y-43,60,40);
    fill(0);
    textSize(15);
    text("Score: ",pos.x+2,pos.y-31);
    textSize(30);
    text(row[2],pos.x+4,pos.y-5);

    var pointLoc = data[index];

    var returns = request(pointLoc[0], pointLoc[1])
    console.log(returns);
    ftbl= loadStrings('returns');
    fData = new Array(ftbl.length);
    for(x in ftbl){
      fData[x] = splitTokens(ftbl[x], ' ');
    }

    document.getElementById("message").innerHTML = returns;

  }
}

function genMatrix(){
  matrix = new Array(20);
  for (var x = 0; x<matrix.length;x++){
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

      this.lat = origin[0]-(dim[0]/20*matX);
      this.long = origin[1]+(dim[1]/40*matY);

      const pos = myMap.latLngToPixel(this.lat, this.long);

      this.xPos = pos.x;
      this.yPos = pos.y;


      var totalDistance = 0;

      var max = 0;
      var min=100000000000
      var avg=0;
      var distance;

      for(x in data){
        var row = data[x];

        const latitude = Number(row[0]);
        const longitude = Number(row[1]);
        const pos = myMap.latLngToPixel(latitude, longitude);
        distance = sqrt(pow(abs(pos.x-this.xPos),2)+pow(abs(pos.y-this.yPos),2));
        totalDistance = totalDistance + distance;

        if(distance>max){
          max=distance;
        }
        if(distance<min){
          min=distance;
        }
      }

      avg = totalDistance/7;

      this.colorValue=0;
      this.pColor=0;
      var plemColor = 0;

      for(x in data){
        var row = data[x];

        const latitude = Number(row[0]);
        const longitude = Number(row[1]);
        const pos = myMap.latLngToPixel(latitude, longitude);
        distance = sqrt(pow(abs(pos.x-this.xPos),2)+pow(abs(pos.y-this.yPos),2));
        if(distance<avg){
            plemColor = plemColor + (totalDistance/(abs(pos.x-this.xPos)+abs(pos.y-this.yPos))*row[2]);
        }
      }
      this.pColor=plemColor;
  }

  setColor(){
    this.colorValue = col;
  }
}

function setColors(){
  var max=new Array(10);
  var min= 1000000000000000;
  var tempColor=0;

  for(z in max){
    max[z]=0;
  }

  var found=0;

  for (var x = 0; x<matrix.length;x++){
    var row = matrix[x];
    for(var y= 0; y<row.length; y++){
      for(z in max){
        if(row[y].pColor>max[z]&&found<1){
          max [z]= row[y].pColor;
          found = 1;
        }
      }
      if(row[y].pColor<min){
        min = row[y].pColor;
      }
    }
  }

  var maxVal=0;
  found = 0;

  for (var x = 0; x<matrix.length;x++){
    var row = matrix[x];
    for(var y= 0; y<row.length; y++){
      if(row[y].pColor>maxVal){
        for(z in max){
          if(row[y].pColor>=max[x]){
            found=1;
          }
        }
        if(found<1){
          maxVal = row[y].pColor
        }
      }
    }
  }

  for (var x = 0; x<matrix.length;x++){
    var row = matrix[x];
    for(var y= 0; y<row.length; y++){
      col=row[y].pColor*(255/maxVal);
      if(col<255){
        col*=2.1;
      }
      if(col>255){
        col = 255;
      }
      row[y].setColor();
    }
  }
}

function request(lat,lon){
  let theUrl=`https://farmsim2k19.herokuapp.com/score?lat=${lat}&lon=${lon}`
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false );
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

function mouseClicked() {
  if(mouseY>11 && mouseY<41){
    if(mouseX>488 && mouseX<938){
      if(oppacity<220){
        oppacity+=25;
        drawPoints();
      }
    }
    else if(mouseX>938 && mouseX<990){
      if(oppacity>25){
        oppacity-=25;
        drawPoints();
      }
    }
  }
  drawStat();

  //loadPoints();
}

function loadPoints(){

  var returns = request(44.801794, -92.940902)
  console.log(returns);
  ftbl= loadStrings('returns');
  fData = new Array(ftbl.length);
  for(x in ftbl){
    fData[x] = splitTokens(ftbl[x], ' ');
  }

  document.getElementById("message").innerHTML = returns;

  loaded = 1;
}
