// Экраны
const mainScreen = document.getElementById("main-screen");
const arenaScreen = document.getElementById("arena-screen");
const endScreen = document.getElementById("end-screen");

// Кнопки и UI
const startBtn = document.getElementById("startGame");
const exitBtn = document.getElementById("exitBtn");
const backToMenu = document.getElementById("backToMenu");
const endImage = document.getElementById("endImage");

// HP изображения
const playerHpBar = document.getElementById("playerHp");
const enemyHpBar = document.getElementById("enemyHp");
const shieldIcon = document.getElementById("shieldIcon");

// Музыка и звуки
const musicMain = document.getElementById("music-main");
const musicArena = document.getElementById("music-arena");
const soundHit = document.getElementById("sound-hit");
const soundHeal = document.getElementById("sound-heal");
const soundDefend = document.getElementById("sound-defend");

// Игровые данные
let playerHp = 30;
let enemyHp = 20;
let shieldActive = false;

// Прямые ссылки на изображения HP
const playerHpImages = {
  6: "https://i.postimg.cc/FKgMYD9q/image.jpg",
  5: "https://i.postimg.cc/1zQxRLZw/image.jpg",
  4: "https://i.postimg.cc/76Hp00hL/image.jpg",
  3: "https://i.postimg.cc/76Hp00hL/image.jpg",
  2: "https://i.postimg.cc/6pRJXBFB/image.jpg",
  1: "https://i.postimg.cc/m2KfJPXd/images.jpg"
};

const enemyHpImages = {
  4: "https://i.postimg.cc/VNY7V18G/image.png",
  3: "https://i.postimg.cc/W4X9RKp2/image.png",
  2: "https://i.postimg.cc/vBK3TV6k/image.png",
  1: "https://i.postimg.cc/FRzThZ10/image.png"
};

// Обновление изображений ХП
function updateHpImages() {
  const playerHpIndex = Math.max(1, Math.ceil(playerHp / 5));
  const enemyHpIndex = Math.max(1, Math.ceil(enemyHp / 5));
  playerHpBar.src = playerHpImages[playerHpIndex];
  enemyHpBar.src = enemyHpImages[enemyHpIndex];
}

function resetGame() {
  playerHp = 30;
  enemyHp = 20;
  shieldActive = false;
  shieldIcon.classList.add("hidden");
  updateHpImages();
  endScreen.classList.add("hidden");
  document.body.classList.remove("red-flash");
}

// Переход в бой
startBtn.onclick = () => {
  mainScreen.classList.remove("active");
  arenaScreen.classList.add("active");
  musicMain.pause();
  musicArena.currentTime = 0;
  musicArena.play();
  resetGame();
};

// Выход из боя
exitBtn.onclick = () => {
  musicArena.pause();
  musicMain.currentTime = 0;
  musicMain.play();
  arenaScreen.classList.remove("active");
  mainScreen.classList.add("active");
};

// Назад с экрана победы/поражения
backToMenu.onclick = () => {
  endScreen.classList.add("hidden");
  arenaScreen.classList.remove("active");
  mainScreen.classList.add("active");
  musicArena.pause();
  musicMain.currentTime = 0;
  musicMain.play();
  document.body.classList.remove("red-flash");
};

// Действия игрока
const actionButtons = document.querySelectorAll(".action-btn");
const enemySprite = document.getElementById("enemy");

actionButtons.forEach(btn => {
  btn.onclick = () => {
    const action = btn.dataset.action;
    if (enemyHp <= 0 || playerHp <= 0) return;

    if (action === "attack") {
      soundHit.play();
      enemyHp -= 5;
      if (enemyHp < 0) enemyHp = 0;
      enemySprite.classList.add("enemy-hit");
      setTimeout(() => enemySprite.classList.remove("enemy-hit"), 400);
    }

    if (action === "defend") {
      if (shieldActive) return;
      shieldIcon.classList.remove("hidden");
      shieldActive = true;
      soundDefend.play();
    }

    if (action === "heal") {
      playerHp += 5;
      if (playerHp > 30) playerHp = 30;
      soundHeal.play();
    }

    updateHpImages();

    setTimeout(() => {
      if (enemyHp <= 0) {
        endBattle(true);
        return;
      }
      enemyAttack();
    }, 1000); // ⏱ увеличено время перед атакой врага
  };
});

function enemyAttack() {
  if (shieldActive) {
    shieldIcon.classList.add("hidden");
    shieldActive = false;
    return;
  }

  playerHp -= 5;
  if (playerHp < 0) playerHp = 0;
  updateHpImages();

  // Красная вспышка
  document.body.classList.add("red-flash");
  setTimeout(() => document.body.classList.remove("red-flash"), 200);

  if (playerHp <= 0) {
    setTimeout(() => endBattle(false), 500);
  }
}

function endBattle(victory) {
  endImage.src = victory
    ? "https://i.postimg.cc/BQSXbVJW/image.jpg"
    : "https://i.postimg.cc/qq0Xzxvm/images.png";
  endScreen.classList.remove("hidden");
}

