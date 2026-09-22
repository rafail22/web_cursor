// Flappy Kursor: Fisika Terbalik Engine

class InvertedFlappyGame {
  constructor() {
    this.canvas = document.getElementById('flappyCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreEl = document.getElementById('flappyScore');
    this.notifBanner = document.getElementById('notifBanner');
    this.notifTitle = document.getElementById('notifTitle');
    this.notifText = document.getElementById('notifText');
    this.modal = document.getElementById('flappyModal');
    this.finalScoreEl = document.getElementById('finalScoreDisplay');
    this.finalDescEl = document.getElementById('finalDesc');
    this.retryBtn = document.getElementById('btnFlappyRetry');

    this.width = 440;
    this.height = 580;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.birdX = 80;
    this.birdY = 280;
    this.birdRadius = 16;
    this.velocity = 0;
    this.buoyancy = -0.32; // Inverted gravity pulling UP
    this.diveForce = 5.8;  // Flap force pushing DOWN

    this.pipes = [];
    this.score = 0;
    this.isPlaying = false;
    this.isDead = false;
    this.pipeTimer = 0;

    this.distractions = [
      { icon: "💬", title: "WhatsApp: Mama", text: "Kapan nikah le? Tetangga sebelah udah punya anak 2." },
      { icon: "🔋", title: "Peringatan Baterai", text: "Baterai Anda tinggal 1%. Layar akan mati." },
      { icon: "📦", title: "Shopee Express", text: "Kurir paket Anda tersesat di segitiga bermuda." },
      { icon: "⚡", title: "Peringatan Windows", text: "Restart darurat dalam 5... 4... 3..." }
    ];
    this.shownDistractions = 0;

    this.init();
  }

  init() {
    const handleAction = (e) => {
      if (e) e.preventDefault();
      if (this.isDead) return;

      if (!this.isPlaying) {
        this.isPlaying = true;
      }

      // DIVE DOWNWARD (Inverted mechanic!)
      this.velocity = this.diveForce;
      if (window.soundFX) window.soundFX.playWhoosh();
    };

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') handleAction(e);
    });

    this.canvas.addEventListener('pointerdown', (e) => handleAction(e));

    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => this.restart());
    }

    this.startLoop();
  }

  triggerDistraction() {
    if (this.shownDistractions >= this.distractions.length) return;
    const item = this.distractions[this.shownDistractions % this.distractions.length];
    this.shownDistractions++;

    const iconEl = document.querySelector('.notif-icon');
    if (iconEl) iconEl.textContent = item.icon;
    this.notifTitle.textContent = item.title;
    this.notifText.textContent = item.text;

    this.notifBanner.classList.add('show');
    if (window.soundFX) window.soundFX.playTerminalBeep(true);

    setTimeout(() => {
      this.notifBanner.classList.remove('show');
    }, 2800);
  }

  startLoop() {
    const loop = () => {
      this.update();
      this.draw();
      requestAnimationFrame(loop);
    };
    loop();
  }

  update() {
    if (!this.isPlaying || this.isDead) return;

    // Upward buoyancy physics
    this.velocity += this.buoyancy;
    this.birdY += this.velocity;

    // Ceiling & Ground collisions
    if (this.birdY - this.birdRadius <= 15 || this.birdY + this.birdRadius >= this.height - 15) {
      this.triggerGameOver("Menabrak batas langit / tanah berduri!");
      return;
    }

    // Spawn pipes
    this.pipeTimer++;
    if (this.pipeTimer > 105) {
      this.pipeTimer = 0;
      this.spawnPipe();
    }

    // Move pipes & collision check
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.x -= 2.6;

      // Score check
      if (!p.passed && p.x + p.w < this.birdX) {
        p.passed = true;
        this.score++;
        this.scoreEl.textContent = this.score;
        if (window.soundFX) window.soundFX.playCashChime();

        // Distraction popups at milestone scores
        if (this.score === 1 || this.score === 3 || this.score === 5) {
          this.triggerDistraction();
        }
      }

      // Pipe Collision
      if (
        this.birdX + this.birdRadius > p.x &&
        this.birdX - this.birdRadius < p.x + p.w
      ) {
        if (
          this.birdY - this.birdRadius < p.topHeight ||
          this.birdY + this.birdRadius > p.topHeight + p.gap
        ) {
          this.triggerGameOver("Menabrak pipa neon!");
          return;
        }
      }

      // Remove offscreen pipes
      if (p.x + p.w < -20) {
        this.pipes.splice(i, 1);
      }
    }
  }

  spawnPipe() {
    const gap = 125;
    const minH = 60;
    const maxH = this.height - gap - minH;
    const topH = Math.floor(minH + Math.random() * (maxH - minH));

    this.pipes.push({
      x: this.width + 10,
      w: 52,
      topHeight: topH,
      gap: gap,
      passed: false
    });
  }

  triggerGameOver(reason) {
    this.isDead = true;
    this.isPlaying = false;
    if (window.soundFX) window.soundFX.playExpenseBuzz();

    this.finalScoreEl.textContent = this.score;

    let taunt = "Refleks bawaan lahir kebalik ya? 😂";
    if (this.score >= 4) {
      taunt = "Alien dari Mars! Otak Anda berhasil mengabaikan kodrat fisika normal! 👽";
    } else if (this.score >= 2) {
      taunt = "Lumayan, tapi masih level jalan santai. Coba lagi! 💪";
    }

    this.finalDescEl.textContent = `${reason} ${taunt}`;
    this.modal.style.display = 'flex';
  }

  draw() {
    this.ctx.fillStyle = '#070913';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle background grid
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    // Spikes on ceiling & floor
    this.drawSpikes(0, true);
    this.drawSpikes(this.height - 12, false);

    // Pipes
    for (const p of this.pipes) {
      // Top pipe
      this.ctx.fillStyle = '#ff007f';
      this.ctx.shadowColor = 'rgba(255, 0, 127, 0.5)';
      this.ctx.shadowBlur = 10;
      this.ctx.fillRect(p.x, 0, p.w, p.topHeight);

      // Bottom pipe
      const bottomY = p.topHeight + p.gap;
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
      this.ctx.fillRect(p.x, bottomY, p.w, this.height - bottomY);
      this.ctx.shadowBlur = 0;
    }

    // Player (Inverted Floating Balloon)
    this.ctx.fillStyle = '#ccff00';
    this.ctx.shadowColor = '#ccff00';
    this.ctx.shadowBlur = 15;
    this.ctx.beginPath();
    this.ctx.arc(this.birdX, this.birdY, this.birdRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Eyeball & funny pupil looking up
    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(this.birdX + 6, this.birdY - 3, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Idle prompt if not started
    if (!this.isPlaying && !this.isDead) {
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 16px Inter';
      this.ctx.textAlign = 'center';
      this.ctx.fillText("KLIK ATAU TEKAN SPASI UNTUK NUKIK", this.width / 2, this.height / 2 + 50);
      this.ctx.fillStyle = '#ff007f';
      this.ctx.font = '12px Inter';
      this.ctx.fillText("(INGAT: KARAKTER ALAMINYA MELAYANG KE ATAS!)", this.width / 2, this.height / 2 + 75);
    }
  }

  drawSpikes(y, isCeiling) {
    this.ctx.fillStyle = 'rgba(255, 42, 95, 0.6)';
    const spikeW = 20;
    const spikeH = 12;
    for (let x = 0; x < this.width; x += spikeW) {
      this.ctx.beginPath();
      if (isCeiling) {
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x + spikeW / 2, spikeH);
        this.ctx.lineTo(x + spikeW, 0);
      } else {
        this.ctx.moveTo(x, y + spikeH);
        this.ctx.lineTo(x + spikeW / 2, y);
        this.ctx.lineTo(x + spikeW, y + spikeH);
      }
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  restart() {
    this.birdY = 280;
    this.velocity = 0;
    this.pipes = [];
    this.score = 0;
    this.scoreEl.textContent = '0';
    this.pipeTimer = 0;
    this.isPlaying = false;
    this.isDead = false;
    this.shownDistractions = 0;
    this.notifBanner.classList.remove('show');
    this.modal.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.flappyGame = new InvertedFlappyGame();
});
