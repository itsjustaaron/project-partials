import { hslToRgb } from './utils';

const WIDTH = 1500;
const HEIGHT = 1500;
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let analyzer;
let bufferLength;

canvas.width = WIDTH;
canvas.height = HEIGHT;

function handleError(err) {
  console.log(`${err} - you must allow microphone access to proceed`);
}

async function getAudio() {
  const stream = await navigator.mediaDevices
    .getUserMedia({ audio: true })
    .catch(handleError);
  const audioContext = new AudioContext();
  analyzer = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyzer);
  // set how much data is analyzed
  analyzer.fftSize = 2 ** 10;
  // get the data from the audio
  // determine the number of pieces of data
  bufferLength = analyzer.frequencyBinCount;
  const timeData = new Uint8Array(bufferLength);
  const frequencyData = new Uint8Array(bufferLength);
  drawTime(timeData);
  drawFrequency(frequencyData);
}

function drawTime(timeData) {
  // add time data into array
  analyzer.getByteTimeDomainData(timeData);
  // visualize the data
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.lineWidth = 10;
  context.strokeStyle = '#F46036';
  context.beginPath();
  const sliceWidth = WIDTH / bufferLength;
  let x = 0;
  timeData.forEach((data, index) => {
    const v = data / 128;
    const y = (v * HEIGHT) / 2;
    // draw lines
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
    x += sliceWidth;
  });
  context.stroke();
  // call itself on repaint
  requestAnimationFrame(() => drawTime(timeData));
}

function drawFrequency(frequencyData) {
  // get the frequency data into our frequencyData array
  analyzer.getByteFrequencyData(frequencyData);
  const barWidth = (WIDTH / bufferLength) * 2.5;
  let x = 0;
  frequencyData.forEach(amount => {
    const percent = amount / 255;
    const [h, s, l] = [360 / (percent * 360) - 0.5, 0.8, 0.5];
    const barHeight = (HEIGHT * percent) / 2;
    const [r, g, b] = hslToRgb(h, s, l);
    context.fillStyle = `rgb(${r}, ${g}, ${b})`;
    context.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  });
  // call itself
  requestAnimationFrame(() => drawFrequency(frequencyData));
}

getAudio();
