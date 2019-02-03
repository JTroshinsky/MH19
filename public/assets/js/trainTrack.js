const opt = {
  lat: 44.975439,
  lng: -93.232866,
  zoom: 12,
  studio: true,style: 'mapbox://styles/jtroshinsky/cjniban195pkd2sls6gc36i54'
};

var key = 'pk.eyJ1IjoianRyb3NoaW5za3kiLCJhIjoiY2puaWI3a3JoMDc0ajNrcjE5Mmhhb3EyZCJ9.fZ8G7cdM8RjoPaiwq01aYQ';

//Data:

var data;
var tbl;

var plot;
var pData

const mappa = new Mappa('Mapbox', key);
var myMap;

function preload(){
  //tbl= loadStrings('sch.txt');//Current (VB1)

}

function setup(){
  var myCanvas = createCanvas(600, 400);
  myCanvas.parent("mapContainer");

  //loadTabls();

  myMap = mappa.tileMap(opt);
  myMap.overlay(myCanvas);
  //myMap.onChange(drawPoints);

  //sdrawStat();
}

function drawPoints(){
  clear();
  stroke(0);
  fill(255);
  var lx, ly;


    for(x in data){
      var row = data[x];
      if(x <data.length-1 && row[8]==0){
        const latitude = Number(row[1]);
        const longitude = Number(row[2]);

        if (myMap.map.getBounds().contains([latitude, longitude])) {
          const pos = myMap.latLngToPixel(latitude, longitude);
          ellipse(pos.x, pos.y, 8,8);

          if(x>0){
            line(lx,ly,pos.x,pos.y);
          }
          lx=pos.x;
          ly=pos.y;
        }
      }
    }



  noStroke();
  fill(255);
  rect(-5,365,650,400);
  rect(440,11,150,30);


}


function loadTabls(){
  data = new Array(tbl.length);
  for(x in tbl){
    data[x] = splitTokens(tbl[x], ',');
  }
}



function mouseClicked(){
  if(mouseY>11 && mouseY<41){
    if(mouseX>440 && mouseX<488){
      plot=1;
      drawPoints();
    }
    else if(mouseX>488 && mouseX<538){
      plot=2;
      drawPoints();
    }
    else if(mouseX>538 && mouseX<590){
      plot=3
      drawPoints();
    }
  }
  drawStat();
}
