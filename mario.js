// Musique du jeu
const bgMusic = new Audio("mario_theme.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

// Activer la musique au premier clic ou touch
document.addEventListener("touchstart", () => {
  if (bgMusic.paused) bgMusic.play();
}, { once: true });

document.addEventListener("click", () => {
  if (bgMusic.paused) bgMusic.play();
}, { once: true });

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let cameraX = 0;
let gameMode = 'main';

const backgroundImg = new Image();
backgroundImg.src = "background.png";

const sol = {
  main: { x: 0, y: canvas.height - 50, width: 5000, height: 50 },
  secret: { x: 0, y: canvas.height - 30, width: 3000, height: 30, background: '#1a1a1a' }
};

const mario = {
  x: 50, y: sol.main.y - 32,
  width: 80, height: 70,
  color: "red"
};

let speed = 4, gravity = 1, velocityY = 0, isJumping = false;
let moveLeft = false, moveRight = false;

document.getElementById("btn-left").addEventListener("touchstart", () => moveLeft = true);
document.getElementById("btn-left").addEventListener("touchend", () => moveLeft = false);
document.getElementById("btn-right").addEventListener("touchstart", () => moveRight = true);
document.getElementById("btn-right").addEventListener("touchend", () => moveRight = false);
document.getElementById("btn-up").addEventListener("touchstart", () => {
  if (!isJumping) {
    velocityY = -15;
    isJumping = true;
  }
});
document.getElementById("btn-down").addEventListener("touchstart", () => enterOrExitPipe());
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") enterOrExitPipe();
});

document.addEventListener("touchstart", () => {
  if (bgMusic.paused) bgMusic.play();
}, { once: true });

function enterOrExitPipe() {
  toboggans.forEach(t => {
    if (checkCollision(mario, t) && gameMode === 'main') {
      gameMode = 'secret';
      mario.x = 50;
      mario.y = sol.secret.y - mario.height;
    } else if (checkCollision(mario, t) && gameMode === 'secret') {
      gameMode = 'main';
      mario.x = t.exitToX || 600;
      mario.y = sol.main.y - mario.height;
    }
  });
}

const marioImg = new Image();
marioImg.src = "mario.png";

const blocs = {
  main: [
    { x: 200, y: sol.main.y - 40, width: 40, height: 40 },
    { x: 300, y: sol.main.y - 80, width: 40, height: 40 },
    { x: 600, y: sol.main.y - 40, width: 40, height: 40 },

    // Nouveaux blocs
    { x: 850, y: sol.main.y - 90, width: 40, height: 40 },
    { x: 950, y: sol.main.y - 130, width: 40, height: 40 },
    { x: 1050, y: sol.main.y - 90, width: 40, height: 40 },
    { x: 1400, y: sol.main.y - 120, width: 40, height: 40 },
    { x: 1800, y: sol.main.y - 100, width: 40, height: 40 },
   { x: 200, y: sol.main.y - 40, width: 40, height: 40 },
    { x: 300, y: sol.main.y - 80, width: 40, height: 40 },
    { x: 600, y: sol.main.y - 40, width: 40, height: 40 },

    // Nouveaux blocs
    { x: 850, y: sol.main.y - 90, width: 40, height: 40 },
    { x: 950, y: sol.main.y - 130, width: 40, height: 40 },
    { x: 1050, y: sol.main.y - 90, width: 40, height: 40 },
    { x: 1400, y: sol.main.y - 120, width: 40, height: 40 },
    { x: 1800, y: sol.main.y - 100, width: 40, height: 40 },
   { x: 200, y: sol.main.y - 40, width: 40, height: 40 },
    { x: 300, y: sol.main.y - 80, width: 40, height: 40 },
    { x: 600, y: sol.main.y - 40, width: 40, height: 40 },

    // Nouveaux blocs
    { x: 850, y: sol.main.y - 90, width: 40, height: 40 },
    { x: 950, y: sol.main.y - 130, width: 40, height: 40 },
    { x: 1050, y: sol.main.y - 90, width: 40, height: 40 },
    { x: 1400, y: sol.main.y - 120, width: 40, height: 40 },
    { x: 1800, y: sol.main.y - 100, width: 40, height: 40 },
   { x: 200, y: sol.main.y - 40, width: 40, height: 40 },
    { x: 300, y: sol.main.y - 80, width: 40, height: 40 },
    { x: 600, y: sol.main.y - 40, width: 40, height: 40 },

    // Nouveaux blocs
    { x: 850, y: sol.main.y - 90, width: 40, height: 40 },
    { x: 950, y: sol.main.y - 130, width: 40, height: 40 },
    { x: 1050, y: sol.main.y - 90, width: 40, height: 40 },
    { x: 1400, y: sol.main.y - 120, width: 40, height: 40 },
    { x: 1800, y: sol.main.y - 100, width: 40, height: 40 }
  ],
  secret: Array.from({ length: 20 }, (_, i) => ({
    x: 100 + i * 100,
    y: sol.secret.y - 40 - (i % 2 === 0 ? 30 : 0),
    width: 40,
    height: 40
  }))
};

const pieces = {
  main: [
    { x: 620, y: sol.main.y - 60, collected: false },

    // Nouvelles pièces
    { x: 880, y: sol.main.y - 90, collected: false },
    { x: 980, y: sol.main.y - 120, collected: false },
    { x: 1080, y: sol.main.y - 90, collected: false },
    { x: 1430, y: sol.main.y - 110, collected: false },
    { x: 1830, y: sol.main.y - 90, collected: false },
   { x: 880, y: sol.main.y - 90, collected: false },
    { x: 980, y: sol.main.y - 120, collected: false },
    { x: 1080, y: sol.main.y - 90, collected: false },
    { x: 1430, y: sol.main.y - 110, collected: false },
    { x: 1830, y: sol.main.y - 90, collected: false },
   { x: 880, y: sol.main.y - 90, collected: false },
    { x: 980, y: sol.main.y - 120, collected: false },
    { x: 1080, y: sol.main.y - 90, collected: false },
    { x: 1430, y: sol.main.y - 110, collected: false },
    { x: 1830, y: sol.main.y - 90, collected: false }
  ],

  secret: Array.from({ length: 30 }, (_, i) => ({
    x: 70 + (i % 10) * 80,
    y: sol.secret.y - 100 - Math.floor(i / 10) * 40,
    collected: false
  }))
};

const toboggans = [
  { x: 550, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 600 },
  { x: 300, y: sol.secret.y - 30, width: 60, height: 30, slope: -1, exitToX: 550 },

  // Nouveaux toboggans
  { x: 900, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1000 },
  { x: 1200, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1300 },
  { x: 1600, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1700 },
  { x: 2000, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 2100 },
{ x: 550, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 600 },
  { x: 300, y: sol.secret.y - 30, width: 60, height: 30, slope: -1, exitToX: 550 },

  // Nouveaux toboggans
  { x: 900, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1000 },
  { x: 1200, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1300 },
  { x: 1600, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1700 },
  { x: 2000, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 2100 },
{ x: 550, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 600 },
  { x: 300, y: sol.secret.y - 30, width: 60, height: 30, slope: -1, exitToX: 550 },

  // Nouveaux toboggans
  { x: 900, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1000 },
  { x: 1200, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1300 },
  { x: 1600, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1700 },
  { x: 2000, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 2100 },
{ x: 550, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 600 },
  { x: 300, y: sol.secret.y - 30, width: 60, height: 30, slope: -1, exitToX: 550 },

  // Nouveaux toboggans
  { x: 900, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1000 },
  { x: 1200, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1300 },
  { x: 1600, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 1700 },
  { x: 2000, y: sol.main.y - 30, width: 60, height: 30, slope: -1, exitToX: 2100 }
];

function drawSol() {
  const s = sol[gameMode];

  if (gameMode === 'main') {
    // Répéter l’image de fond sur toute la largeur du sol
    const imgWidth = backgroundImg.width;
    for (let x = Math.floor(cameraX / imgWidth) * imgWidth; x < cameraX + canvas.width; x += imgWidth) {
      ctx.drawImage(backgroundImg, x - cameraX, 0, imgWidth, canvas.height);
    }
  } else {
    ctx.fillStyle = s.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Dessiner le sol vert
  ctx.fillStyle = "green";
  ctx.fillRect(s.x - cameraX, s.y, s.width, s.height);
}

function drawMario() {
  ctx.drawImage(marioImg, mario.x - cameraX, mario.y, mario.width, mario.height);
}

function drawBlocs() {
  ctx.fillStyle = "orange";
  blocs[gameMode].forEach(b => ctx.fillRect(b.x - cameraX, b.y, b.width, b.height));
}

function drawPieces() {
  ctx.fillStyle = "gold";
  pieces[gameMode].forEach(p => {
    if (!p.collected) {
      ctx.beginPath();
      ctx.arc(p.x - cameraX, p.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawToboggans() {
  ctx.fillStyle = "green";
  toboggans.forEach(t => {
    ctx.save();
    ctx.translate(t.x - cameraX, t.y);
    ctx.rotate(t.slope * Math.PI / 12);
    ctx.fillRect(0, 0, t.width, t.height);
    ctx.restore();
  });
}

function checkCollision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (moveLeft) mario.x -= speed;
  if (moveRight) mario.x += speed;

  velocityY += gravity;
  mario.y += velocityY;

  const s = sol[gameMode];
  if (mario.y + mario.height > s.y) {
    mario.y = s.y - mario.height;
    velocityY = 0;
    isJumping = false;
  }

  blocs[gameMode].forEach(b => {
    if (
      mario.x + mario.width > b.x &&
      mario.x < b.x + b.width &&
      mario.y + mario.height > b.y &&
      mario.y < b.y &&
      velocityY >= 0
    ) {
      mario.y = b.y - mario.height;
      velocityY = 0;
      isJumping = false;
    }
  });

  pieces[gameMode].forEach(p => {
    if (
      !p.collected &&
      mario.x < p.x + 10 &&
      mario.x + mario.width > p.x - 10 &&
      mario.y < p.y + 10 &&
      mario.y + mario.height > p.y - 10
    ) {
      p.collected = true;
    }
  });

  cameraX = mario.x - canvas.width / 2;
  if (cameraX < 0) cameraX = 0;

  drawSol();
  drawBlocs();
  drawToboggans();
  drawPieces();
  drawMario();

  requestAnimationFrame(gameLoop);
}

marioImg.onload = () => {
  bgMusic.play().catch(e => console.log("Lecture refusée :", e));
  gameLoop();
};

function requestFullscreenOnLandscape() {
  if (window.innerWidth > window.innerHeight) {
    const canvas = document.documentElement;
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    }
  }
}

// Quand l'utilisateur tourne l'écran
window.addEventListener('orientationchange', () => {
  setTimeout(requestFullscreenOnLandscape, 500);
});

// Quand l'utilisateur touche l’écran pour la première fois
document.addEventListener("touchstart", () => {
  requestFullscreenOnLandscape();
}, { once: true });
