var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');



var x=20;
var y=20;
var dx=2;
var dy=2;

loadFile();

function loadFile(){
    loadStrings("test.txt");
    animate();
}


function animate(){
  requestAnimationFrame(animate);
  c.clearRect(0,00,innerWidth,innerHeight);

  c.beginPath();
  c.arc(x,y,15,0,Math.PI*2,false);
  c.strokeStyle='blue';
  c.stroke();

  if(x+15>300 ||x-15<0){
    dx= -dx;
  }
  if(y+15>150 ||y-15<0){
    dy= -dy;
  }
  x+=dx;
  y+=dy;
}
