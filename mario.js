// Musique du jeu
const bgMusic = new Audio("mario_theme.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

// Activer la musique au premier clic ou touch
document.addEventListener("click", () => {
  if (bgMusic.paused) bgMusic.play().catch(e => console.log("Erreur musique :", e));
}, { once: true });

document.addEventListener("touchstart", () => {
  if (bgMusic.paused) bgMusic.play().catch(e => console.log("Erreur musique tactile :", e));
}, { once: true });

// Canvas
const canvas = document.getElementById('gameCanvas');
if (!canvas) {
  alert("Erreur : canvas introuvable !");
  throw new Error("Canvas manquant");
}
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Variables du jeu
let cameraX = 0;
let gameMode = 'main';
let projectiles = [];

const backgroundImg = new Image();
backgroundImg.src = "background.png";
backgroundImg.onerror = () => console.log("Erreur : background.png manquant");

const marioImg = new Image();
marioImg.src = "mario.png";
marioImg.onerror = () => console.log("Erreur : mario.png manquant");

const sol = {
  main: { x: 0, y: canvas.height - 50, width: 5000, height: 50 },
  secret: { x: 0, y: canvas.height - 30, width: 3000, height: 30, background: '#1a1a1a' }
};

const mario = {
  x: 50,
  y: sol.main.y - 70,
  width: 80,
  height: 70,
  color: "red",
  direction: 'right'
};

let speed = 4, gravity = 1, velocityY = 0, isJumping = false;
let moveLeft = false, moveRight = false;

// Contrôles tactiles
const leftBtn = document.getElementById("btn-left");
const rightBtn = document.getElementById("btn-right");
const upBtn = document.getElementById("btn-up");
const downBtn = document.getElementById("btn-down");


if (leftBtn && rightBtn && upBtn && downBtn) {
  leftBtn.addEventListener("touchstart", () => {
    moveLeft = true;
    mario.direction = 'left';
  });
  leftBtn.addEventListener("touchend", () => moveLeft = false);

  rightBtn.addEventListener("touchstart", () => {
    moveRight = true;
    mario.direction = 'right';
  });
  rightBtn.addEventListener("touchend", () => moveRight = false);

  upBtn.addEventListener("touchstart", () => {
    if (!isJumping) {
      velocityY = -15;
      isJumping = true;
    }
  });

  downBtn.addEventListener("touchstart", () => enterOrExitPipe());
}

// Contrôles clavier
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      moveLeft = true;
      mario.direction = 'left';
      break;
    case "ArrowRight":
      moveRight = true;
      mario.direction = 'right';
      break;
    case "ArrowUp":
      if (!isJumping) {
        velocityY = -15;
        isJumping = true;
      }
      break;
    case "ArrowDown":
      enterOrExitPipe();
      break;
    case " ": // espace
      fireProjectile();
      break;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

// Boucle principale du jeu
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Mouvements
  if (moveLeft && mario.x > 0) mario.x -= speed;
  if (moveRight) mario.x += speed;

  // Saut / gravité
  velocityY += gravity;
  mario.y += velocityY;

  const s = sol[gameMode];
  if (mario.y + mario.height > s.y) {
    mario.y = s.y - mario.height;
    velocityY = 0;
    isJumping = false;
  }

  // Caméra
  cameraX = mario.x - canvas.width / 2;
  if (cameraX < 0) cameraX = 0;

  drawSol();
  drawMario();
  drawProjectiles();

  requestAnimationFrame(gameLoop);
}

// Dessiner le sol et le fond
function drawSol() {
  const s = sol[gameMode];

  if (gameMode === 'main' && backgroundImg.complete) {
    const imgWidth = backgroundImg.width;
    for (let x = Math.floor(cameraX / imgWidth) * imgWidth; x < cameraX + canvas.width; x += imgWidth) {
      ctx.drawImage(backgroundImg, x - cameraX, 0, imgWidth, canvas.height);
    }
  } else {
    ctx.fillStyle = s.background || 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = "green";
  ctx.fillRect(s.x - cameraX, s.y, s.width, s.height);
}

// Dessiner Mario
function drawMario() {
  ctx.save();
  ctx.translate(mario.x - cameraX + mario.width / 2, mario.y + mario.height / 2);
  ctx.scale(mario.direction === 'left' ? -1 : 1, 1);
  ctx.drawImage(marioImg, -mario.width / 2, -mario.height / 2, mario.width, mario.height);
  ctx.restore();
}

// Dessiner les projectiles
function drawProjectiles() {
  projectiles.forEach((p, index) => {
    p.x += p.speed;

    ctx.beginPath();
    ctx.arc(p.x - cameraX, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();

    if (p.x < cameraX - 50 || p.x > cameraX + canvas.width + 50) {
      projectiles.splice(index, 1);
    }
  });
}

// Tirer un projectile
function fireProjectile() {
  const direction = mario.direction === 'left' ? -1 : 1;
  projectiles.push({
    x: mario.x + mario.width / 2,
    y: mario.y + mario.height / 2,
    speed: 8 * direction
  });
}

// Entrer dans un toboggan (à personnaliser)
function enterOrExitPipe() {
  console.log("Entrée ou sortie de toboggan !");
}

// Lancer le jeu quand l’image de Mario est chargée
marioImg.onload = () => {
  gameLoop();
  bgMusic.play().catch(e => console.log("Lecture musique refusée :", e));
};

// Plein écran si en paysage
function requestFullscreenOnLandscape() {
  if (window.innerWidth > window.innerHeight) {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  }
}

window.addEventListener('orientationchange', () => {
  setTimeout(requestFullscreenOnLandscape, 500);
});

// Tirer un projectile
function fireProjectile() {
  const direction = mario.direction === 'left' ? -1 : 1;
  projectiles.push({
    x: mario.x + mario.width / 2,
    y: mario.y + mario.height / 2,
    speed: 8 * direction
  });
}

// Entrer dans un toboggan (à personnaliser)
function enterOrExitPipe() {
  console.log("Entrée ou sortie de toboggan !");
}

// Lancer le jeu quand l’image de Mario est chargée
marioImg.onload = () => {
  gameLoop();
  bgMusic.play().catch(e => console.log("Lecture musique refusée :", e));
};

// Plein écran si en paysage
function requestFullscreenOnLandscape() {
  if (window.innerWidth > window.innerHeight) {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  }
}

window.addEventListener('orientationchange', () => {
  setTimeout(requestFullscreenOnLandscape, 500);
});

// ✅ Bouton tactile pour tirer le projectile
const fireBtn = document.getElementById("btn-fire");
if (fireBtn) {
  fireBtn.addEventListener("touchstart", (e) => {
    e.preventDefault(); // empêche le zoom ou scroll
    fireProjectile();
  });

  fireBtn.addEventListener("click", (e) => {
    e.preventDefault(); // pour le clic sur PC aussi
    fireProjectile();
  });
}
