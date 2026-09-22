// Labirin Senggol Bacok - Steady Hand Maze Engine

class SteadyMazeGame {
  constructor() {
    this.canvas = document.getElementById('mazeCanvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.shock = document.getElementById('shockOverlay');
    this.failCountEl = document.getElementById('failCount');
    this.levelBadge = document.getElementById('levelBadge');
    this.modal = document.getElementById('mazeModal');
    this.retryBtn = document.getElementById('btnMazeRetry');

    this.width = 760;
    this.height = 570;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.level = 1;
    this.fails = 0;
    this.isPlaying = false;
    this.playerX = 60;
    this.playerY = 60;
    this.targetX = 60;
    this.targetY = 60;

    // Moving hazards
    this.hazardY = 200;
    this.hazardSpeed = 2.5;

    // Level 3 troll goal evasions
    this.goalEvasions = 0;
    this.goalX = 680;
    this.goalY = 490;

    this.init();
  }

  init() {
    const arena = document.getElementById('mazeArena');

    arena.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    arena.addEventListener('mouseleave', () => {
      if (this.isPlaying) {
        this.triggerShock("Kursor keluar dari arena!");
      }
    });

    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => this.restartGame());
    }

    this.startLoop();
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.width / rect.width;
    const scaleY = this.height / rect.height;

    this.targetX = (e.clientX - rect.left) * scaleX;
    this.targetY = (e.clientY - rect.top) * scaleY;
  }

  triggerShock(reason) {
    this.isPlaying = false;
    this.fails++;
    this.failCountEl.textContent = this.fails;

    this.shock.classList.add('flash');
    setTimeout(() => this.shock.classList.remove('flash'), 180);

    if (window.soundFX) window.soundFX.playExpenseBuzz();

    // Reset player position to start
    this.playerX = 60;
    this.playerY = 60;
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
    // Smooth player movement
    this.playerX += (this.targetX - this.playerX) * 0.4;
    this.playerY += (this.targetY - this.playerY) * 0.4;

    // Level 3 virtual wind drift
    if (this.level === 3 && this.isPlaying) {
      this.playerX += (Math.sin(Date.now() * 0.003) * 0.8);
      this.playerY += (Math.cos(Date.now() * 0.003) * 0.8);
    }

    // Moving laser hazard for Level 2 & 3
    if (this.level >= 2) {
      this.hazardY += this.hazardSpeed;
      if (this.hazardY > 380 || this.hazardY < 180) {
        this.hazardSpeed = -this.hazardSpeed;
      }
    }

    // Check Start Zone
    const distToStart = Math.hypot(this.playerX - 60, this.playerY - 60);
    if (distToStart < 28) {
      this.isPlaying = true;
    }

    // Check Goal Collision
    const distToGoal = Math.hypot(this.playerX - this.goalX, this.playerY - this.goalY);
    if (this.isPlaying && distToGoal < 26) {
      if (this.level === 3 && this.goalEvasions < 2) {
        // Troll evasion on Level 3!
        this.goalEvasions++;
        if (window.soundFX) window.soundFX.playWhoosh();
        if (this.goalEvasions === 1) {
          this.goalX = 400;
          this.goalY = 490;
        } else {
          this.goalX = 680;
          this.goalY = 490;
        }
      } else {
        this.handleLevelWin();
      }
    }

    // Collision detection via pixel color sampling
    if (this.isPlaying) {
      // Check 4 points around player circle
      const checkOffsets = [
        [0, 0], [6, 0], [-6, 0], [0, 6], [0, -6]
      ];

      for (const [ox, oy] of checkOffsets) {
        const px = Math.floor(this.playerX + ox);
        const py = Math.floor(this.playerY + oy);

        if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
          const pixel = this.ctx.getImageData(px, py, 1, 1).data;
          // Wall color has high Red and low Green/Blue (#ff2a5f)
          if (pixel[0] > 200 && pixel[1] < 100 && pixel[2] < 150) {
            this.triggerShock("Menyenggol dinding listrik!");
            break;
          }
        }
      }
    }
  }

  handleLevelWin() {
    this.isPlaying = false;
    if (window.soundFX) window.soundFX.playCashChime();

    if (this.level < 3) {
      this.level++;
      this.levelBadge.textContent = `LEVEL ${this.level}: ${this.level === 2 ? 'SENSOR BERGERAK ⚠️' : 'PUNCAK EMOSI ☢️'}`;
      this.playerX = 60;
      this.playerY = 60;
      this.goalEvasions = 0;
      this.goalX = 680;
      this.goalY = 490;
    } else {
      this.modal.style.display = 'flex';
      const stats = document.getElementById('mazeStats');
      if (stats) {
        stats.textContent = `Luar biasa! Tangan lu seimbang seperti dewa bedah! Berhasil menaklukkan seluruh level dengan total kesenggol: ${this.fails} kali!`;
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#07080d';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw walls & safe path according to current level
    this.drawLabyrinth();

    // Draw START Zone
    this.ctx.fillStyle = '#10b981';
    this.ctx.beginPath();
    this.ctx.arc(60, 60, 24, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 12px Inter';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('START', 60, 60);

    // Draw GOAL Zone
    this.ctx.fillStyle = '#ccff00';
    this.ctx.beginPath();
    this.ctx.arc(this.goalX, this.goalY, 24, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#000';
    this.ctx.fillText('FINISH', this.goalX, this.goalY);

    // Moving laser hazard for Level 2 & 3
    if (this.level >= 2) {
      this.ctx.strokeStyle = '#ff2a5f';
      this.ctx.lineWidth = 8;
      this.ctx.beginPath();
      this.ctx.moveTo(340, this.hazardY);
      this.ctx.lineTo(440, this.hazardY);
      this.ctx.stroke();

      this.ctx.fillStyle = '#ff2a5f';
      this.ctx.fillRect(340 - 6, this.hazardY - 4, 12, 8);
      this.ctx.fillRect(440 - 6, this.hazardY - 4, 12, 8);
    }

    // Draw Player Dot
    this.ctx.fillStyle = this.isPlaying ? '#00f0ff' : '#94a3b8';
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.shadowBlur = this.isPlaying ? 15 : 0;
    this.ctx.beginPath();
    this.ctx.arc(this.playerX, this.playerY, 7, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Ghost decoy cursor for Level 2 & 3
    if (this.level >= 2 && this.isPlaying) {
      const decoyX = this.width - this.playerX;
      const decoyY = this.height - this.playerY;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.beginPath();
      this.ctx.arc(decoyX, decoyY, 6, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawLabyrinth() {
    this.ctx.strokeStyle = '#ff2a5f';
    this.ctx.shadowColor = 'rgba(255, 42, 95, 0.4)';
    this.ctx.shadowBlur = 8;

    // Thickness of safe corridor
    const corridor = this.level === 1 ? 52 : (this.level === 2 ? 44 : 36);
    this.ctx.lineWidth = 10;

    // Outer Boundary Walls
    this.ctx.strokeRect(10, 10, this.width - 20, this.height - 20);

    // Level-specific maze barriers
    if (this.level === 1) {
      // Level 1: Clean S-curves
      this.drawWall(140, 10, 140, 420);
      this.drawWall(260, 150, 260, 560);
      this.drawWall(390, 10, 390, 400);
      this.drawWall(520, 160, 520, 560);
    } else if (this.level === 2) {
      // Level 2: Tighter turns + laser crossing
      this.drawWall(120, 10, 120, 450);
      this.drawWall(220, 120, 220, 560);
      this.drawWall(330, 10, 330, 500);
      this.drawWall(450, 80, 450, 560);
      this.drawWall(570, 10, 570, 450);
    } else {
      // Level 3: Ultra narrow labyrinth with dead ends
      this.drawWall(110, 10, 110, 480);
      this.drawWall(200, 100, 200, 560);
      this.drawWall(300, 10, 300, 440);
      this.drawWall(390, 130, 390, 560);
      this.drawWall(490, 10, 490, 460);
      this.drawWall(580, 110, 580, 560);
      this.drawWall(660, 10, 660, 420);
    }

    this.ctx.shadowBlur = 0;
  }

  drawWall(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  restartGame() {
    this.level = 1;
    this.fails = 0;
    this.goalEvasions = 0;
    this.goalX = 680;
    this.goalY = 490;
    this.failCountEl.textContent = '0';
    this.levelBadge.textContent = 'LEVEL 1: PEMANASAN SANTAI';
    this.playerX = 60;
    this.playerY = 60;
    this.isPlaying = false;
    this.modal.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.mazeGame = new SteadyMazeGame();
});
