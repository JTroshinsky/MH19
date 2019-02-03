const options = {
  lat: 44.975439,
  lng: -90.232866,
  zoom: 6,
  studio: true,style: 'mapbox://styles/jtroshinsky/cjniban195pkd2sls6gc36i54'
};

var key = 'pk.eyJ1IjoianRyb3NoaW5za3kiLCJhIjoiY2puaWI3a3JoMDc0ajNrcjE5Mmhhb3EyZCJ9.fZ8G7cdM8RjoPaiwq01aYQ';

//Data: time[0], lan[1], lon[2], alt[3], temp1[4], temp2[5], vel[6], targvel[7], mode[8], dur[9], startvel[10], endvel[11]
//Other data: time[0], lat[1], lon[2], alt[3]
var data;
var data2;
var data3;
var tbl;
var tb2;
var tb3;

var plot;
var pData

const mappa = new Mappa('Mapbox', key);
var myMap;

function preload(){
  tbl= loadStrings('push.txt');//Current (VB1)
  tbl2= loadStrings('push2.txt');//EQT2
  tbl3= loadStrings('push3.txt');//EQT1

  plot = 2;

}

function setup(){
  var myCanvas = createCanvas(600, 400);
  myCanvas.parent("container2");

  loadTabls();

  myMap = mappa.tileMap(options);
  myMap.overlay(myCanvas);
  myMap.onChange(drawPoints);

  //sdrawStat();
}

function drawPoints(){
  clear();
  stroke(0);
  fill(255);
  var lx, ly;

  if(plot==1){
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
  }

  else if(plot>1){
    var seenPoints=0;
    var diver=1;

    if(plot==2)
      pData=data2;
    else if(plot==3)
      pData=data3;

    for(x in pData){
      var row = pData[x];
      if(x <pData.length-1){
        const latitude = Number(row[1]);
        const longitude =  Number(row[2]);
        if (myMap.map.getBounds().contains([latitude, longitude])) {
          seenPoints++;
        }
      }
    }

    if(seenPoints>50)
      diver=2;
    if(seenPoints>100)
      diver=3;
    if(seenPoints>150)
      diver=5;
    if(seenPoints>200)
      diver=7;

    lx=null;

    for(x in pData){
      var row = pData[x];
      if(x <pData.length-1 && x%diver==0){
        const latitude = Number(row[1]);
        const longitude =  Number(row[2]);

        if (myMap.map.getBounds().contains([latitude, longitude])) {
          const pos = myMap.latLngToPixel(latitude, longitude);
          ellipse(pos.x, pos.y, 8,8);

          if(x>0 && lx!=null){
            line(lx,ly,pos.x,pos.y);
          }
          lx=pos.x;
          ly=pos.y;
        }
      }
    }
  }

  var n = data[data.length-2];
  noStroke();
  fill(255);
  rect(-5,365,650,400);
  rect(440,11,150,30);

  fill(0);
  textSize(10);
  text("Time: "+n[0]+", Lat: "+n[1]+", Lon: "+n[2]+", Alt: "+n[3]+", Temp 1: "+n[4],10,375);
  text("Vel: "+n[6]+", Targ Vel: "+n[7]+", Mode: "+n[8]+", Dur: "+n[9]+", Start Vel: "+n[10]+", End Vel: "+n[11]+"        Select launch at top and click on points on map for more data",10,395);
  textSize(12);
  text("VB1",455,30);
  text("EQT2",497,30);
  text("EQT1",545,30);
  stroke(190);
  line(488,11,488,41);
  line(538,11,538,41)
}


function loadTabls(){
  data = new Array(tbl.length);
  for(x in tbl){
    data[x] = splitTokens(tbl[x], ',');
  }

  data2 = new Array(tbl2.length);
  for(x in tbl2){
    data2[x] = splitTokens(tbl2[x], ',');
  }

  data3 = new Array(tbl3.length);
  for(x in tbl3){
    data3[x] = splitTokens(tbl3[x], ',');
  }
}

function drawStat(){
  var closestX=-100;
  var closestY=-100;
  var diffX=10000;
  var diffY=10000;
  var index;

  if(plot>0){
    if(plot==1)
      pData=data;
    else if(plot==2)
      pData=data2;
    else
      pData=data3

    for(x in pData){
      var row = pData[x];
      if(x <pData.length-1){
        const latitude = Number(row[1]);
        const longitude =  Number(row[2]);
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
    }

    if(diffX+diffY<30){
      fill(255);
      var row = pData[index];
      const latitude = Number(row[1]);
      const longitude =  Number(row[2]);
      const pos = myMap.latLngToPixel(latitude, longitude);
      rect(pos.x,pos.y-43,80,40);
      fill(0);
      textSize(10);
      text("Alt: "+row[3],pos.x+2,pos.y-33);
      text("Lat: "+row[1],pos.x+2,pos.y-20);
      text("Lon: "+row[2],pos.x+2,pos.y-8);
    }
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
