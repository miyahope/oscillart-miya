const input = document.getElementById('input');

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
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
}

function handle() {
  audioCtx.resume();
  gainNode.gain.value = 0;

  var usernotes = String(input.value);
  frequency(notenames.get(usernotes)); 

}

