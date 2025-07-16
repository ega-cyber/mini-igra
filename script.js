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
  6: "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/%D1%80%D1%80%D1%80%D1%80%D1%80%D1%80%D1%80%D1%80%D1%80%D1%80.jpeg",
  5: "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%B4%D0%BB.jpeg",
  4: "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/%D1%8D%D1%8D%D1%8D%D1%8D%D1%8D%D1%8D%D1%8D%D1%8D%D1%8D%D1%8D.jpeg",
  3: "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82%D1%82.jpeg",
  2: "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D0%BE%D1%82%D0%BE%D1%82%D0%BE%D1%82.jpeg",
  1: "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/images.jpeg"
};

const enemyHpImages = {
  4: "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/%D0%91%D0%B5%D0%B7%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%D1%82%D0%BE%D1%82%D0%BE%D1%82%D0%BE%D0%BE%D0%BE%D1%82%D0%BE%D1%82%D0%BE.png",
  3: "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/%D0%BE%D1%80%D0%BE%D1%80%D0%BE%D1%80%D0%BE%D1%80.png",
  2: "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C%D1%8C.png",
  1: "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4%D0%B4.png"
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
    ? "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/%D0%91%D0%B5%D0%B7%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.jpeg"
    : "https://uploads.onecompiler.io/43n9hghfn/43qm5kr8d/images.png";
  endScreen.classList.remove("hidden");
}
