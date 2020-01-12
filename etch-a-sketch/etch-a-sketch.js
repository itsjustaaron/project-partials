const canvas = document.querySelector('#etch-a-sketch');
const context = canvas.getContext('2d');
const shakeBtn = document.querySelector('.shake');
const moveAmount = 10;
const { width } = canvas;
const { height } = canvas;

let x = Math.floor(Math.random() * width);
let y = Math.floor(Math.random() * height);
let hue = 0;
const myColor = 'black';
const hsl = `hsl(${hue}, 100%, 50%)`;

context.lineJoin = 'round';
context.lineCap = 'round';
context.lineWidth = 40;

// start the drawing
context.beginPath();
context.moveTo(x, y);
context.lineTo(x, y);
context.strokeStyle = '#000000';
context.stroke();

// write a draw function
function draw({ key }) {
  console.log(key);
  // start new path at current position
  context.beginPath();
  context.moveTo(x, y);
  // move coords based on user input
  switch (key) {
    case 'ArrowUp':
      y -= moveAmount;
      break;
    case 'ArrowDown':
      y += moveAmount;
      break;
    case 'ArrowLeft':
      x -= moveAmount;
      break;
    case 'ArrowRight':
      x += moveAmount;
      break;
    default:
      break;
  }
  context.lineTo(x, y);
  hue += 2;
  //  context.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  context.strokeStyle = myColor;
  context.stroke();
}

// write a handler for working with keys
function handleKey(event) {
  if (event.key.includes('Arrow')) {
    event.preventDefault();
    draw({ key: event.key });
  }
}

// keyCode 37 = ArrowLeft
// keyCode 38 = ArrowUp
// keyCode 39 = ArrowRight
// keyCode 40 = ArrowDown

// clear/shake function
function clearCanvas() {
  canvas.classList.add('shake');
  context.clearRect(0, 0, width, height);
  canvas.addEventListener(
    'animationend',
    () => {
      canvas.classList.remove('shake');
    },
    { once: true } // removes the event listener after it runs
  );
}
shakeBtn.addEventListener('click', clearCanvas);
// listen for arrow keys
window.addEventListener('keydown', handleKey);

// additional ideas
// change cursor size/color/position based on user input
const getColor = document.querySelector('.color-picker');
function checkColor() {
  const suffix = this.dataset.sizing || '';
  document.documentElement.style.setProperty(
    `--${this.name}`,
    this.value + suffix
  );

  context.strokeStyle = this.value;
  // myColor = e.currentTarget.value;
  // console.log(e);
  // // console.log(`you chose the color: ${myColor}`);
  // switch (myColor) {
  //   case 'Red':
  //     context.strokeStyle = 'red';
  //     break;
  //   case 'Green':
  //     context.strokeStyle = 'green';
  //     break;
  //   case 'Blue':
  //     context.strokeStyle = 'blue';
  //     break;
  //   case 'Black':
  //     context.strokeStyle = 'black';
  //     break;
  //   case 'Rainbow':
  //     context.strokeStyle = `${hsl}`;
  //     break;
  //   default:
  //     context.strokeStyle = 'black';
  //     break;
  // }
}
getColor.addEventListener('change', checkColor);
// change interface via css to mirror real etch-a-sketch
// add knobs that rotate based on keypress
