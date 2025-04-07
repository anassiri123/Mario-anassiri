// Musique
const bgMusic = new Audio("mario_theme.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

document.addEventListener("click", () => {
  if (bgMusic.paused) bgMusic.play();
}, { once: true });

document.addEventListener("touchstart", () => {
  if (bgMusic.paused) bgMusic.play();
}, { once: true });

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Variables principales
let gameMode = 'main';
let cameraX = 0;
let velocityY = 0;
let isJumping = false;
let moveLeft = false, moveRight = false;
let projectiles = [];

// Déclaration de la structure du sol (doit être AVANT pipes et blocks)
const sol = {
  main: { x: 0, y: canvas.height - 50, width: 5000, height: 50 },
  secret: { x: 0, y: canvas.height - 30, width: 3000, height: 30, background: "#1a1a1a" }
};

// Toboggans verts
const pipes = [
  { x: 600, y: sol.main.y - 80, width: 60, height: 80, color: "green", target: "secret" },
  { x: 2000, y: sol.main.y - 100, width: 60, height: 100, color: "green", target: "secret" },
  { x: 100, y: sol.secret.y - 80, width: 60, height: 80, color: "green", target: "main" }
];

// Blocs solides et bonus
const blocks = [
  { x: 300, y: sol.main.y - 100, width: 50, height: 50, type: "solid" },
  { x: 400, y: sol.main.y - 100, width: 50, height: 50, type: "?" },
  { x: 500, y: sol.main.y - 100, width: 50, height: 50, type: "solid" },
  { x: 800, y: sol.main.y - 150, width: 50, height: 50, type: "solid" },
  { x: 1000, y: sol.main.y - 80, width: 50, height: 50, type: "?" }
];

// Images
const backgroundImg = new Image();
backgroundImg.src = "background.png";

const marioImg = new Image();
marioImg.src = "mario.png";

// Mario
const mario = {
  x: 50, y: sol.main.y - 70,
  width: 80, height: 70,
  direction: 'right'
};

// FONCTIONS DE DESSIN
function drawSol() {
  const s = sol[gameMode];

  if (gameMode === 'main' && backgroundImg.complete) {
    const imgWidth = backgroundImg.width;
    for (let x = Math.floor(cameraX / imgWidth) * imgWidth; x < cameraX + canvas.width; x += imgWidth) {
      ctx.drawImage(backgroundImg, x - cameraX, 0, imgWidth, canvas.height);
    }
  } else {
    ctx.fillStyle = s.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = "green";
  ctx.fillRect(s.x - cameraX, s.y, s.width, s.height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = pipe.color;
    ctx.fillRect(pipe.x - cameraX, pipe.y, pipe.width, pipe.height);
  });
}

function drawBlocks() {
  blocks.forEach(block => {
    const x = block.x - cameraX;
    ctx.fillStyle = (block.type === "?") ? "orange" : "saddlebrown";
    ctx.fillRect(x, block.y, block.width, block.height);

    if (block.type === "?") {
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText("?", x + 15, block.y + 30);
    }
  });
}

function drawMario() {
  ctx.save();
  ctx.translate(mario.x - cameraX + mario.width / 2, mario.y + mario.height / 2);
  ctx.scale(mario.direction === 'left' ? -1 : 1, 1);
  ctx.drawImage(marioImg, -mario.width / 2, -mario.height / 2, mario.width, mario.height);
  ctx.restore();
}

function drawProjectiles() {
  projectiles.forEach((p, i) => {
    p.x += p.speed;
    ctx.beginPath();
    ctx.arc(p.x - cameraX, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();

    if (p.x < cameraX - 50 || p.x > cameraX + canvas.width + 50) {
      projectiles.splice(i, 1);
    }
  });
}

// AUTRES FONCTIONS
function fireProjectile() {
  const direction = mario.direction === 'left' ? -1 : 1;
  projectiles.push({
    x: mario.x + mario.width / 2,
    y: mario.y + mario.height / 2,
    speed: 8 * direction
  });
}

function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function enterOrExitPipe() {
  const currentPipes = pipes.filter(p => p.target !== gameMode);
  const marioBox = { x: mario.x, y: mario.y, width: mario.width, height: mario.height };

  currentPipes.forEach(pipe => {
    if (checkCollision(marioBox, pipe)) {
      gameMode = pipe.target;
      mario.y = sol[gameMode].y - mario.height;
    }
  });
}

// BOUCLE DU JEU
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (moveLeft) { mario.x -= 4; mario.direction = 'left'; }
  if (moveRight) { mario.x += 4; mario.direction = 'right'; }

  velocityY += 1;
  mario.y += velocityY;

  // Collision avec les blocs
  blocks.forEach(block => {
    if (
      mario.x + mario.width > block.x &&
      mario.x < block.x + block.width &&
      mario.y + mario.height > block.y &&
      mario.y + mario.height < block.y + 20
    ) {
      mario.y = block.y - mario.height;
      velocityY = 0;
      isJumping = false;
    }
  });

  // Collision avec le sol
  const s = sol[gameMode];
  if (mario.y + mario.height > s.y) {
    mario.y = s.y - mario.height;
    velocityY = 0;
    isJumping = false;
  }

  cameraX = mario.x - canvas.width / 2;
  if (cameraX < 0) cameraX = 0;

  drawSol();
  drawPipes();
  drawBlocks();
  drawMario();
  drawProjectiles();

  requestAnimationFrame(gameLoop);
}

// CONTRÔLES CLAVIER
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft": moveLeft = true; break;
    case "ArrowRight": moveRight = true; break;
    case "ArrowUp":
      if (!isJumping) {
        velocityY = -15;
        isJumping = true;
      }
      break;
    case "ArrowDown": enterOrExitPipe(); break;
    case " ": fireProjectile(); break;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

// CONTRÔLES MOBILE
const leftBtn = document.getElementById("btn-left");
const rightBtn = document.getElementById("btn-right");
const upBtn = document.getElementById("btn-up");
const downBtn = document.getElementById("btn-down");

if (leftBtn) {
  leftBtn.addEventListener("touchstart", () => moveLeft = true);
  leftBtn.addEventListener("touchend", () => moveLeft = false);
}
if (rightBtn) {
  rightBtn.addEventListener("touchstart", () => moveRight = true);
  rightBtn.addEventListener("touchend", () => moveRight = false);
}
if (upBtn) {
  upBtn.addEventListener("touchstart", () => {
    if (!isJumping) {
      velocityY = -15;
      isJumping = true;
    }
  });
}
if (downBtn) {
  downBtn.addEventListener("touchstart", () => enterOrExitPipe());
}

// Lancer le jeu après chargement de Mario
marioImg.onload = () => {
  gameLoop();
  bgMusic.play().catch(e => console.log("Musique bloquée :", e));
};
