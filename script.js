const input = document.getElementById('input');
var reset = false;
var timepernote = 0;
var length = 0;

//variables 
var pitch;
var freq = 0;
var interval = null;
var blob, recorder = null;
var chunks = [];


// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

const color_picker = document.getElementById('color');
const vol_slider = document.getElementById('vol-slider');
const thickness_slider = document.getElementById('thickness');
const sound_type = document.getElementById('sound-type');
const recording_toggle = document.getElementById('record');

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

ctx.lineWidth = thickness_slider.value;

// draw function
var counter = 0;
var x = 0;
var y = height / 2;

function drawWave() {
  clearInterval(interval);
  ctx.beginPath();

  if (reset) {
    ctx.clearRect(0, 0, width, height);
    x = 0;
    y = height / 2;
    ctx.moveTo(x, y);
    reset = false; 
  }

  counter = 0;
  interval = setInterval(line, 20);
}



// sin function
function line() {
  ctx.lineWidth = thickness_slider.value;
  ctx.strokeStyle = color_picker.value;

  y = height / 2 + (vol_slider.value/100)*40 * Math.sin(x * 2 * Math.PI * freq * (0.5 * length));
  ctx.lineTo(x, y);
  ctx.stroke();
  x = x + 1;
  counter++;

  if (counter > (timepernote / 20)) {
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
  freq = pitch/10000;
  gainNode.gain.setValueAtTime(vol_slider.value/100, audioCtx.currentTime);
  setting = setInterval(() =>
    {gainNode.gain.value = vol_slider.value/100}, 1);

  oscillator.type = sound_type.value;

  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  setTimeout(() => {clearInterval(setting); gainNode.gain.value = 0; }, ((timepernote)-10));
  
}




function handle() { 
  reset = true;
  var usernotes = String(input.value);
  var noteslist = [];
  length = usernotes.length;
  timepernote = 6000/length;

  for (i = 0; i < usernotes.length; i++) {
    noteslist.push(notenames.get(usernotes.charAt(i)));
  }

  let j = 0;
  const repeat = setInterval(() => {
    if (j < noteslist.length) {
      frequency((noteslist[j]));
      drawWave();
      j++;
    } else {
      clearInterval(repeat);
    }
  }, timepernote);

  audioCtx.resume();
}


function startRecording() {
  const canvasStream = canvas.captureStream(20);
  const audioDestination = audioCtx.createMediaStreamDestination();
  const combinedStream = new MediaStream();

  gainNode.connect(audioDestination);

  canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
  audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));

  recorder = new MediaRecorder(combinedStream, { mimeType:
    'video/webm' });

  recorder.ondataavailable = e => {
 if (e.data.size > 0) {
   chunks.push(e.data);
 }
};

recorder.onstop = () => {
   const blob = new Blob(chunks, { type: 'video/webm' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'recording.webm';
   a.click();
   URL.revokeObjectURL(url);
};
recorder.start();
}

var is_recording = false;

function toggle(){
  is_recording = !is_recording;
  if(is_recording){
    recording_toggle.innerHTML = "Stop Recording";
    startRecording();
  } else {
    recording_toggle.innerHTML = "Start Recording";
    recorder.stop();
  }
  
}