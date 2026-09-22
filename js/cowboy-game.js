// Uji Refleks Koboi Cabut Pistol Engine

class CowboyDuelGame {
  constructor() {
    this.arena = document.getElementById('duelArena');
    this.signalText = document.getElementById('signalText');
    this.signalSub = document.getElementById('signalSubtext');
    this.roundBadge = document.getElementById('roundBadge');
    this.livesEl = document.getElementById('cowboyLives');
    this.botSprite = document.getElementById('botSprite');
    this.botName = document.getElementById('botName');
    this.playerSprite = document.getElementById('playerSprite');

    this.modal = document.getElementById('cowboyModal');
    this.modalCard = document.getElementById('cowboyModalCard');
    this.modalTitle = document.getElementById('cowboyModalTitle');
    this.modalDesc = document.getElementById('cowboyModalDesc');
    this.retryBtn = document.getElementById('btnCowboyRetry');

    this.lives = 3;
    this.round = 1;
    this.totalRounds = 3;

    this.state = 'idle'; // idle | waiting | fire | ended
    this.roundConfig = [
      { name: "Bandit Amatir 🤠", botSpeed: 270, minDelay: 2500, maxDelay: 4500 },
      { name: "Sheriff Mata Elang 🦅", botSpeed: 215, minDelay: 3000, maxDelay: 5000 },
      { name: "El Cepat Kilat ⚡", botSpeed: 178, minDelay: 3200, maxDelay: 6000 }
    ];

    this.falseAlarmInterval = null;
    this.fireTimeout = null;
    this.botShotTimeout = null;
    this.fireStartTime = 0;

    this.falseAlarms = [
      "SIAP-SIAP...",
      "TARIK NAPAS...",
      "KUNING!",
      "DOR... eh belum!",
      "FOKUS MATAMU...",
      "TUNGGU ABA-ABA...",
      "JANGAN NAFSU DULU..."
    ];

    this.init();
  }

  init() {
    this.arena.addEventListener('pointerdown', () => this.handleArenaClick());
    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => this.restartGame());
    }
    this.startRound();
  }

  updateHUD() {
    this.livesEl.textContent = '❤️'.repeat(Math.max(0, this.lives)) + '🖤'.repeat(Math.max(0, 3 - this.lives));
    const cur = this.roundConfig[this.round - 1];
    this.roundBadge.textContent = `RONDE ${this.round} / ${this.totalRounds}: ${cur.name}`;
    this.botName.textContent = cur.name;
  }

  startRound() {
    this.state = 'waiting';
    this.updateHUD();

    this.arena.classList.remove('fire-now', 'shock-red');
    this.botSprite.style.transform = 'none';
    this.playerSprite.style.transform = 'none';

    this.signalText.textContent = "BERSIAP-SIAP...";
    this.signalSub.textContent = "Tunggu sinyal HIJAU 'TEMBAK SEKARANG!'";

    const config = this.roundConfig[this.round - 1];
    const trueDelay = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);

    // Schedule false alarm bait
    let falseCount = 0;
    this.falseAlarmInterval = setInterval(() => {
      if (this.state !== 'waiting') return;
      falseCount++;
      const text = this.falseAlarms[Math.floor(Math.random() * this.falseAlarms.length)];
      this.signalText.textContent = text;
      if (window.soundFX) window.soundFX.playKeyClack();
    }, 1100);

    // Schedule True Signal
    this.fireTimeout = setTimeout(() => {
      this.triggerGreenSignal();
    }, trueDelay);
  }

  triggerGreenSignal() {
    if (this.falseAlarmInterval) clearInterval(this.falseAlarmInterval);
    this.state = 'fire';
    this.fireStartTime = performance.now();

    this.arena.classList.add('fire-now');
    this.signalText.textContent = "TEMBAK SEKARANG! 💥";
    this.signalSub.textContent = "KLIK SECEPAT KILAT!";

    if (window.soundFX) window.soundFX.playTerminalBeep(true);

    const config = this.roundConfig[this.round - 1];
    // Bot draws trigger
    this.botShotTimeout = setTimeout(() => {
      if (this.state === 'fire') {
        this.handleBotShot();
      }
    }, config.botSpeed);
  }

  handleArenaClick() {
    if (this.state === 'waiting') {
      // PREMATURE SHOT! Shot himself in the foot!
      this.handlePrematureShot();
    } else if (this.state === 'fire') {
      // VALID FAST SHOT
      this.handlePlayerShot();
    }
  }

  handlePrematureShot() {
    if (this.fireTimeout) clearTimeout(this.fireTimeout);
    if (this.falseAlarmInterval) clearInterval(this.falseAlarmInterval);

    this.state = 'ended';
    this.lives--;
    this.updateHUD();

    this.arena.classList.add('shock-red');
    this.signalText.textContent = "TEMBAKAN PREMATUR! 🦶💥";
    this.signalSub.textContent = "Kena kaki sendiri! Belum ada aba-aba hijau!";

    if (window.soundFX) window.soundFX.playExpenseBuzz();

    this.playerSprite.style.transform = 'rotate(-25deg)';

    if (this.lives <= 0) {
      setTimeout(() => this.triggerGameOver("Anda kehabisan nyawa karena menembak kaki sendiri!"), 800);
    } else {
      setTimeout(() => this.startRound(), 1800);
    }
  }

  handlePlayerShot() {
    if (this.botShotTimeout) clearTimeout(this.botShotTimeout);
    this.state = 'ended';

    const reactionTime = Math.round(performance.now() - this.fireStartTime);
    if (window.soundFX) window.soundFX.playCashChime();

    this.signalText.textContent = `DOR! KENA! (${reactionTime}ms) ⚡`;
    this.signalSub.textContent = "Tembakan Anda lebih cepat!";

    this.botSprite.style.transform = 'rotate(90deg) translateY(30px)';

    setTimeout(() => {
      if (this.round < this.totalRounds) {
        this.round++;
        this.startRound();
      } else {
        this.triggerVictory(reactionTime);
      }
    }, 1500);
  }

  handleBotShot() {
    this.state = 'ended';
    this.lives--;
    this.updateHUD();

    this.arena.classList.remove('fire-now');
    this.arena.classList.add('shock-red');

    const config = this.roundConfig[this.round - 1];
    this.signalText.textContent = "KALAH CEPAT! 💀";
    this.signalSub.textContent = `${config.name} mencabut pistol dalam ${config.botSpeed}ms!`;

    if (window.soundFX) window.soundFX.playTrollBuzzer();

    this.playerSprite.style.transform = 'rotate(-30deg)';

    if (this.lives <= 0) {
      setTimeout(() => this.triggerGameOver(`Anda tertembak kalah cepat oleh ${config.name}!`), 800);
    } else {
      setTimeout(() => this.startRound(), 1800);
    }
  }

  triggerGameOver(msg) {
    this.modal.style.display = 'flex';
    this.modalCard.className = 'cowboy-modal-card defeat';
    this.modalTitle.textContent = "TEWAS DI PADANG PASIR 💀";
    this.modalDesc.textContent = msg;
  }

  triggerVictory(bestTime) {
    this.modal.style.display = 'flex';
    this.modalCard.className = 'cowboy-modal-card';
    this.modalTitle.textContent = "🏆 LEGENDA PENEMBAK TERCEPAT!";
    this.modalDesc.textContent = `Luar biasa! Anda berhasil menundukkan El Cepat Kilat dengan waktu reaksi mengagumkan ${bestTime}ms! Tangan Anda lebih cepat dari kilat!`;
    if (window.soundFX) window.soundFX.playCashChime();
  }

  restartGame() {
    this.lives = 3;
    this.round = 1;
    this.modal.style.display = 'none';
    this.startRound();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cowboyGame = new CowboyDuelGame();
});
