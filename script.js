const input = document.getElementById('input');

//variables (why they so goofyy)
var pitch;
var freq = 0;
var amplitude = 40;
var interval = null;

// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

// start the oscillator and set volume to 0
oscillator.start();
gainNode.gain.value = 0;

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;

// draw function
var counter = 0;

function drawWave() {
  ctx.clearRect(0, 0, width, height);
  x = 0;
  y = height/2;
  ctx.moveTo(x,y);
  ctx.beginPath();

  counter = 0;

  interval = setInterval (line, 20);
  
}



//sin function
function line() {
y = height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq));

ctx.lineTo(x,y);
ctx.stroke();

x = x+1;
counter++;

if(counter > 50) {
    clearInterval (interval);
  }

}

const notenames = new Map();

notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
notenames.set("A", 440.0);
notenames.set("Bb", 466.2);
notenames.set("Eb", 311.1);
notenames.set("Ab", 415.3);
notenames.set("Db", 277.2);
notenames.set("Gb", 369.9);
notenames.set("Cb", 246.9);



function frequency(pitch) {
  freq = pitch /10000;
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
}

function handle() {
  audioCtx.resume();
  gainNode.gain.value = 0;

  var usernotes = String(input.value);
  pitch = notenames.get(usernotes); 
  frequency(pitch);
  drawWave();
}
