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

function frequency(pitch) {
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
  console.log("Playing tone:", pitch);
}

function handle() {
  audioCtx.resume();
  gainNode.gain.value = 0;

  const pitch = parseFloat(input.value);
  if (!isNaN(pitch)) {
    frequency(pitch);
  } else {
    alert("Please enter a valid number for frequency!");
  }
}
