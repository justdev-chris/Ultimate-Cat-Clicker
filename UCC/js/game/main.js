// Backend endpoint
const backendURL = 'https://visa20.ct.ws/ucc.php'; // no

// Prompt for username once
let username = localStorage.getItem('username');
if (!username) {
  username = prompt('Enter your cat name:') || 'AnonymousCat';
  localStorage.setItem('username', username);
}

// Game data
let fish = 0;
let fishPerSecond = 0;
let totalClicks = 0;
let powerLevel = 1;
let storyStage = 0;
let currentSlideIndex = 0;
let minigameWins = 0;
let currentScreen = 'game';
let evolutionLevel = 0;
let purrCrystals = 0;
let comboMeter = 0;
let catSkin = 'default';
let unlockedSkins = ['default'];
let loreEntries = [];
let dailyQuests = [];
let isVillainInvasion = false;
let villainDefenseClicks = 0;

let cursorCount = 0, cursorCost = 10;
let yarnCount = 0, yarnCost = 50;
let roboCount = 0, roboCost = 200;
let wizardCount = 0, wizardCost = 1000;
let portalCount = 0, portalCost = 5000;
let dragonCount = 0, dragonCost = 25000;

// Story progression text
const storyStages = [
  "The ancient cat stirs... Your first clicks have awakened something powerful. Whiskers' eyes begin to glow with mystical energy!",
  "🌟 Whiskers purrs with growing power! The curse weakens as cosmic fish energy flows through the dimensions!",
  "⚡ The vacuum cleaner's seal cracks! Whiskers' true form begins to emerge from the shadows of time!",
  "🔥 Ancient runes appear around Whiskers! The prophecy speaks of great power awakening within!",
  "🌈 Rainbow fish rain from the sky! Whiskers' power reaches legendary status across all realms!",
  "🌌 The multiverse trembles! Whiskers ascends to become the Eternal Fish Guardian of all dimensions!",
  "👑 YOU ARE THE CHOSEN ONE! Whiskers grants you the title of Supreme Cat Clicking Champion of the Universe!"
];

// Initialize daily quests
dailyQuests = [
  { id: 1, title: 'Click Master', description: 'Click the cat 100 times', target: 100, reward: '500 fish' },
  { id: 2, title: 'Fish Collector', description: 'Collect 1000 fish treats', target: 1000, reward: '1000 fish bonus' },
  { id: 3, title: 'Helper Buyer', description: 'Buy 5 helpers', target: 5, reward: 'Special cat skin' }
];

function clickCat() {
  fish += 1;
  totalClicks += 1;

  // Update combo meter
  comboMeter = Math.min(comboMeter + 1, 100);
  if (comboMeter >= 100) {
    showCatFrenzy();
    comboMeter = 0;
  }

  // Click effect
  const effect = document.createElement('div');
  effect.className = 'click-effect';
  effect.textContent = '+1 🐟';
  document.getElementById('clicker').appendChild(effect);
  setTimeout(() => effect.remove(), 1000);

  // Random floating fish
  if (Math.random() < 0.3) createFloatingFish();

  // Possibly start villain invasion
  if (Math.random() < 0.001 && !isVillainInvasion) startVillainInvasion();

  updateDisplay();
  submitClicks(); // send username+clicks to backend
}

function defendClick() {
  if (!isVillainInvasion) return;

  villainDefenseClicks++;
  document.getElementById('defenseProgress').textContent = villainDefenseClicks;

  const target = parseInt(document.getElementById('defenseTarget').textContent, 10);
  if (villainDefenseClicks >= target) {
    isVillainInvasion = false;
    document.getElementById('villainInvasion').style.display = 'none';
    fish += 1000; // reward
    showNotification('🏆 Villain defeated! +1000 fish!', 'success');
  }
}

function startVillainInvasion() {
  isVillainInvasion = true;
  villainDefenseClicks = 0;
  const target = 50;

  document.getElementById('villainInvasion').style.display = 'block';
  document.getElementById('defenseTarget').textContent = target;
  document.getElementById('defenseProgress').textContent = '0';

  let timeLeft = 30;
  const timer = setInterval(() => {
    timeLeft--;
    document.getElementById('invasionTimer').textContent = timeLeft;
    if (timeLeft <= 0 || !isVillainInvasion) {
      clearInterval(timer);
      if (isVillainInvasion) {
        fish = Math.max(0, fish - 500);
        isVillainInvasion = false;
        document.getElementById('villainInvasion').style.display = 'none';
        showNotification('💥 Villain escaped! Lost 500 fish!', 'error');
      }
    }
  }, 1000);
}

function prestige() {
  if (fish < 1000000) return;
  if (confirm('Prestige resets progress but grants Purr Crystals. Proceed?')) {
    const crystals = Math.floor(fish / 100000);
    purrCrystals += crystals;

    // reset
    fish = 0; fishPerSecond = 0; totalClicks = 0;
    powerLevel = 1; evolutionLevel = 0;
    cursorCount = 0; cursorCost = 10;
    yarnCount = 0; yarnCost = 50;
    roboCount = 0; roboCost = 200;
    wizardCount = 0; wizardCost = 1000;
    portalCount = 0; portalCost = 5000;
    dragonCount = 0; dragonCost = 25000;

    showNotification(`✨ Prestiged! Gained ${crystals} Purr Crystals!`, 'success');
    updateDisplay();
  }
}

function buyCrystalUpgrade(upgradeType) {
  showNotification('Crystal upgrades coming soon!', 'info');
}

function secretClick(location) {
  showNotification('🔍 Secret discovered! +100 fish!', 'success');
  fish += 100;
  updateDisplay();
}

function showCatFrenzy() {
  const frenzyDiv = document.createElement('div');
  frenzyDiv.style.cssText = `
    position: fixed; top:50%; left:50%; transform:translate(-50%,-50%);
    background:linear-gradient(45deg,#ff6b6b,#4ecdc4); color:white; padding:30px;
    border-radius:20px; z-index:2000; text-align:center; font-size:1.5em;
    animation:pulse 0.5s infinite; border:3px solid gold;
  `;
  frenzyDiv.innerHTML = '⚡ CAT FRENZY ACTIVATED! ⚡<br>Auto-clicking for 10 seconds!';
  document.body.appendChild(frenzyDiv);

  let frenzyTime = 10;
  const frenzyInterval = setInterval(() => {
    fish += 10;
    frenzyTime--;
    if (frenzyTime <= 0) {
      clearInterval(frenzyInterval);
      frenzyDiv.remove();
    }
    updateDisplay();
  }, 100);
}

function createFloatingFish() {
  const f = document.createElement('div');
  f.className = 'floating-fish';
  f.textContent = '🐟';
  f.style.left = Math.random() * (window.innerWidth - 50) + 'px';
  f.style.top = Math.random() * (window.innerHeight - 50) + 'px';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 3000);
}

// ——— Backend integration ———

function submitClicks() {
  fetch(backendURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'submitClicks',
      username: username,
      clicks: totalClicks
    })
  })
  .then(r => r.json())
  .then(json => {
    if (json.status !== 'success') console.error('Submit error:', json.message);
  })
  .catch(err => console.error('Network error on submitClicks:', err));
}

function fetchLeaderboard() {
  fetch(backendURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getLeaderboard' })
  })
  .then(r => r.json())
  .then(json => {
    if (json.status === 'success') {
      const lb = document.getElementById('leaderboard');
      lb.innerHTML = json.leaderboard
        .map((e,i) => `${i+1}. ${e.username}: ${e.clicks}`)
        .join('<br>');
    } else {
      console.error('Leaderboard error:', json.message);
    }
  })
  .catch(err => console.error('Network error on fetchLeaderboard:', err));
}

// Auto-collect and periodic backend calls
setInterval(() => {
  fish += fishPerSecond / 10;
  updateDisplay();
}, 100);

setInterval(submitClicks, 5000);
setInterval(fetchLeaderboard, 30000);

// Game initialization
function startGame() {
  document.getElementById("loreScreen").style.display = "none";
  initializeAchievements();
  createStars();
  createMemoryGrid();
  updateDisplay();
  updateAchievementDisplay();
  updateSkinSelector();
  updateQuestDisplay();
  updateLoreDisplay();
  showSlide(0);
}

window.addEventListener('load', () => {
  startGame();
  fetchLeaderboard();
  // If loreScreen hidden, keep stars alive
  if (document.getElementById("loreScreen").style.display === "none") {
    createStars();
  }
});
