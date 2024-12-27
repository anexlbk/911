const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const planeImage = new Image();
planeImage.src = "plane.png";


const plane = {
  x: 50,
  y: canvas.height / 2,
  width: 100,
  height: 60,
  dy: 0,
  gravity: 0.5,
  lift: -10,
};

const pipes = [];
const pipeWidth = 100;
const pipeGap = 200;
let gameRunning = true;

let score = 0;
const sound = new Audio();
sound.src = "Voicy_Allahu Akbar BANG.mp3";

function createPipe() {
  const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
  const bottomHeight = canvas.height - topHeight - pipeGap;
  pipes.push({ x: canvas.width, topHeight, bottomHeight });
}

function drawPlane() {
  ctx.drawImage(planeImage, plane.x, plane.y, plane.width, plane.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
      // Top tower
      ctx.fillStyle = "#aaa";
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
  
      // Bottom tower
      ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    });
  }
  

function update() {
  plane.dy += plane.gravity;
  plane.y += plane.dy;

  pipes.forEach(pipe => {
    pipe.x -= 3;
  });

  if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
  }

  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
    createPipe();
  }

  if (
    plane.y <= 0 ||
    plane.y + plane.height >= canvas.height ||
    pipes.some(pipe => (
      plane.x < pipe.x + pipeWidth &&
      plane.x + plane.width > pipe.x &&
      (plane.y < pipe.topHeight || plane.y + plane.height > canvas.height - pipe.bottomHeight)
    ))
  ) {
    gameOver();
  }
}

function gameOver() {
  gameRunning = false;
  sound.play();
  document.getElementById('game-over').style.display = 'block';
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlane();
  drawPipes();
  drawScore();
  update();

  if (gameRunning) {
    requestAnimationFrame(loop);
  }
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    plane.dy = plane.lift;
  }
});

createPipe();
loop();