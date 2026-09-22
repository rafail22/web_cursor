// Interactive "Annoying / Impossible" Button Game Engine - Bahasa Indonesia

class ImpossibleButtonGame {
  constructor() {
    this.wrapper = document.getElementById('trollWrapper');
    this.btn = document.getElementById('trollBtn');
    this.missCountEl = document.getElementById('missCount');
    this.rageBar = document.getElementById('rageBar');
    this.rageText = document.getElementById('rageText');
    this.arena = document.getElementById('playArena');
    this.victoryModal = document.getElementById('victoryModal');
    this.restartBtn = document.getElementById('restartBtn');

    this.misses = 0;
    this.ragePercentage = 0;
    this.isDodging = false;
    this.isDizzy = false;
    this.dodgeCooldown = 0;

    this.taunts = [
      "Terlalu lambat! 🐢",
      "Coba lagi dong! 💪",
      "Kurang cepet, kawan! 🤖",
      "Lag ya sinyalnya? 📶",
      "Nenek gue nge-klik lebih cepet! 👵",
      "Skill issue nih bos? 💀",
      "Dikit lagi kena... TAPI BOONG! 😂",
      "Nge-klik pake jempol kaki ya? 🦶",
      "404: Refleks Tidak Ditemukan 🔌",
      "Lebih gampang nemu unicorn daripada ngeklik gue 🦄",
      "Gue bisa gini seharian! ⚡",
      "Wusshh! Luput lagi! 💨",
      "Ganti kursi gaming dulu sana 🪑",
      "Ping 999ms terdeteksi 📡",
      "Coba pake dua tangan deh! 👐",
      "Emosi ya? Napas dulu napas 🧘"
    ];

    this.init();
  }

  init() {
    // Track mouse movement in the arena
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));

    // Pointer down / touch support
    this.btn.addEventListener('pointerenter', (e) => this.dodge(e.clientX, e.clientY));
    this.btn.addEventListener('pointerdown', (e) => {
      if (!this.isDizzy) {
        e.preventDefault();
        this.dodge(e.clientX, e.clientY);
      } else {
        this.handleVictory();
      }
    });

    // Arena missed click
    this.arena.addEventListener('pointerdown', (e) => {
      if (e.target !== this.btn) {
        this.handleArenaClick(e);
      }
    });

    // Victory button handler
    this.btn.addEventListener('click', (e) => {
      if (this.isDizzy) {
        this.handleVictory();
      }
    });

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => this.restartGame());
    }
  }

  handleMouseMove(e) {
    if (this.isDizzy) return;

    const rect = this.wrapper.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Evasion trigger threshold (130px)
    const threshold = 130;

    const now = Date.now();
    if (distance < threshold && now - this.dodgeCooldown > 180) {
      this.dodgeCooldown = now;
      this.dodge(e.clientX, e.clientY);
    }
  }

  dodge(mouseX, mouseY) {
    if (this.isDizzy) return;

    this.misses++;
    this.updateHUD();

    if (window.soundFX) {
      window.soundFX.playWhoosh();
    }

    // Calculate safe screen bounds for repositioning
    const padding = 100;
    const maxW = window.innerWidth - padding * 2;
    const maxH = window.innerHeight - padding * 2;

    // Pick a new random location away from mouse
    let newX = padding + Math.random() * maxW;
    let newY = padding + Math.random() * maxH;

    // Apply offset relative to center
    const offsetX = newX - window.innerWidth / 2;
    const offsetY = newY - window.innerHeight / 2;

    this.wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    // Spawn mocking speech bubble
    this.spawnSpeechBubble(mouseX || newX, mouseY || newY);

    // Pity mechanic: after 40 misses, button gets dizzy for 1.8 seconds!
    if (this.misses % 40 === 0 && this.misses > 0) {
      this.triggerDizzyState();
    }
  }

  triggerDizzyState() {
    this.isDizzy = true;
    this.btn.textContent = "😵 PUSING! BURUAN KLIK!";
    this.btn.style.filter = "hue-rotate(180deg)";
    this.spawnSpeechBubble(window.innerWidth / 2, window.innerHeight / 2, "Gue capek ngindarin lu... 😵");

    setTimeout(() => {
      if (this.isDizzy) {
        this.isDizzy = false;
        this.btn.textContent = "💰 KLAIM HADIAH Rp 1.000.000.000 💰";
        this.btn.style.filter = "none";
      }
    }, 1800);
  }

  handleArenaClick(e) {
    this.misses++;
    this.updateHUD();
    if (window.soundFX) window.soundFX.playTrollBuzzer();
    this.spawnSpeechBubble(e.clientX, e.clientY, "Meleset jauh banget! 🎯");
  }

  spawnSpeechBubble(x, y, forcedText) {
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    
    const text = forcedText || this.taunts[Math.floor(Math.random() * this.taunts.length)];
    bubble.textContent = text;

    const safeX = Math.min(Math.max(x - 40, 20), window.innerWidth - 220);
    const safeY = Math.min(Math.max(y - 50, 80), window.innerHeight - 80);

    bubble.style.left = `${safeX}px`;
    bubble.style.top = `${safeY}px`;

    document.body.appendChild(bubble);

    setTimeout(() => {
      if (bubble.parentNode) bubble.parentNode.removeChild(bubble);
    }, 2400);
  }

  updateHUD() {
    this.missCountEl.textContent = this.misses;

    // Calculate rage percentage
    this.ragePercentage = Math.min(Math.round((this.misses / 35) * 100), 100);
    this.rageBar.style.width = `${this.ragePercentage}%`;

    let stage = "Santai 😌";
    if (this.misses >= 35) {
      stage = "MURKA NUKLIR ☢️💥";
      document.body.classList.add('body-shake');
    } else if (this.misses >= 22) {
      stage = "Banting Keyboard 💥";
    } else if (this.misses >= 12) {
      stage = "Emosi Jiwa 😡";
    } else if (this.misses >= 5) {
      stage = "Mulai Kesel 🤨";
    }

    this.rageText.textContent = `${stage} (${this.ragePercentage}%)`;
  }

  handleVictory() {
    this.isDizzy = false;
    document.body.classList.remove('body-shake');
    if (window.soundFX) window.soundFX.playCashChime();

    if (this.victoryModal) {
      this.victoryModal.style.display = 'flex';
      const statsEl = document.getElementById('victoryStats');
      if (statsEl) {
        statsEl.textContent = `Hebat banget! Lu berhasil ngalahin tombol jahil setelah ${this.misses} kali meleset dengan Level Emosi mencapai ${this.ragePercentage}%!`;
      }
    }
  }

  restartGame() {
    this.misses = 0;
    this.ragePercentage = 0;
    this.isDizzy = false;
    document.body.classList.remove('body-shake');
    this.wrapper.style.transform = 'translate(-50%, -50%)';
    this.btn.textContent = "💰 KLAIM HADIAH Rp 1.000.000.000 💰";
    this.btn.style.filter = "none";
    this.updateHUD();

    if (this.victoryModal) {
      this.victoryModal.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.impossibleGame = new ImpossibleButtonGame();
});
