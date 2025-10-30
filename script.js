const input = document.getElementById('input');
var reset = false;
var timpernote = 0;
var length = 0;

//variables (why they so goofyy AHHH)
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

oscillator.start();
gainNode.gain.value = 0;

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;

// draw function
var counter = 0;
var x = 0;
var y = height / 2;

function drawWave() {
  clearInterval(interval);

  if (reset) {
    ctx.clearRect(0, 0, width, height);
    x = 0;
    y = height / 2;
    ctx.moveTo(x, y);
    ctx.beginPath();
    reset = false; 
  }

  counter = 0;
  interval = setInterval(line, 20);
}

// sin function
function line() {
  y = height / 2 + amplitude * Math.sin(x * 2 * Math.PI * freq * (0.5 * length));
  ctx.lineTo(x, y);
  ctx.stroke();
  x = x + 1;
  counter++;

  if (counter > (timpernote / 20)) {
    clearInterval(interval);
  }
}

const notenames = new Map();
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
notenames.set("A", 440.0);
notenames.set("B", 493.9);

function frequency(pitch) {
  freq = pitch / 10000;
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + (timpernote / 1000) - 0.1);
}

function handle() { //WWWHY WONT U WORK 
  reset = true;

  var usernotes = String(input.value);
  var noteslist = [];
  length = usernotes.length;
  timpernote = 6000 / length;

  for (i = 0; i < usernotes.length; i++) {
    noteslist.push(notenames.get(usernotes.charAt(i)));
  }

  let j = 0;
  repeat = setInterval(() => {
    if (j < noteslist.length) {
      frequency(parseInt(noteslist[j]));
      drawWave();
      j++;
    } else {
      clearInterval(repeat);
    }
  }, timpernote);

  audioCtx.resume();
}