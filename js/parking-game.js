// Parkir Paralel Paling Mustahil Engine

class ImpossibleParkingGame {
  constructor() {
    this.canvas = document.getElementById('parkingCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.honkBalloon = document.getElementById('taxiBalloon');
    this.modal = document.getElementById('parkingModal');
    this.modalCard = document.getElementById('parkingModalCard');
    this.modalTitle = document.getElementById('parkingModalTitle');
    this.modalDesc = document.getElementById('parkingModalDesc');
    this.retryBtn = document.getElementById('btnParkingRetry');

    this.width = 600;
    this.height = 480;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Player Car state
    this.car = {
      x: 270,
      y: 280,
      w: 110,
      h: 50,
      speed: 0,
      maxSpeed: 2.8,
      accel: 0.12,
      friction: 0.985, // Very slippery drift!
      angle: 0,
      steer: 0
    };

    // Obstacle Luxury Cars
    this.frontCar = { x: 410, y: 75, w: 125, h: 54, color: '#eab308', name: 'Lamborghini Aventador' };
    this.rearCar = { x: 80, y: 75, w: 125, h: 54, color: '#0066ff', name: 'Bugatti Chiron' };

    // Target Parking Slot (Green Box)
    this.targetSlot = { x: 235, y: 70, w: 145, h: 64 };

    // Control flags
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      brake: false
    };

    this.isDead = false;
    this.isParked = false;
    this.honkInterval = null;

    this.honkTaunts = [
      "TIIIN TIIIN! WOI CEPETAN!",
      "SIM-NYA NEMBAK YA?! 😤",
      "LAMBAT AMAT NYETIRNYA!",
      "MAU SAYA TABRAK BELAKANG?!",
      "KIRI ITU KANAN, KANAN ITU KIRI!",
      "NENEK GUE PARKIR LEBIH JAGO! 👵"
    ];

    this.init();
  }

  init() {
    this.bindKeyboard();
    this.bindVirtualButtons();
    this.startHonking();
    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => this.restart());
    }
    this.startLoop();
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = true;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
      if (e.code === 'Space') this.keys.brake = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
      if (e.code === 'Space') this.keys.brake = false;
    });
  }

  bindVirtualButtons() {
    const bindBtn = (id, keyName) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.keys[keyName] = true;
        btn.classList.add('active');
      });
      const release = () => {
        this.keys[keyName] = false;
        btn.classList.remove('active');
      };
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointerleave', release);
    };

    bindBtn('btnGasD', 'up');
    bindBtn('btnGasR', 'down');
    bindBtn('btnSteerL', 'left');
    bindBtn('btnSteerR', 'right');
    bindBtn('btnBrake', 'brake');
  }

  startHonking() {
    this.honkInterval = setInterval(() => {
      if (this.isDead || this.isParked) return;
      const text = this.honkTaunts[Math.floor(Math.random() * this.honkTaunts.length)];
      this.honkBalloon.textContent = text;
      this.honkBalloon.classList.add('honk');

      if (window.soundFX) window.soundFX.playTrollBuzzer();

      setTimeout(() => {
        this.honkBalloon.classList.remove('honk');
      }, 2000);
    }, 3800);
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
    if (this.isDead || this.isParked) return;

    // Acceleration & Inverted Steer
    if (this.keys.up) {
      this.car.speed = Math.min(this.car.speed + this.car.accel, this.car.maxSpeed);
    } else if (this.keys.down) {
      this.car.speed = Math.max(this.car.speed - this.car.accel, -this.car.maxSpeed * 0.7);
    } else {
      this.car.speed *= this.car.friction;
    }

    if (this.keys.brake) {
      this.car.speed *= 0.85;
    }

    // INVERTED STEERING TROLL MECHANIC!
    // Left key turns Right (+angle), Right key turns Left (-angle)
    if (Math.abs(this.car.speed) > 0.1) {
      const dir = this.car.speed > 0 ? 1 : -1;
      if (this.keys.left) {
        this.car.angle += 0.045 * dir; // Inverted! Turns right!
      }
      if (this.keys.right) {
        this.car.angle -= 0.045 * dir; // Inverted! Turns left!
      }
    }

    // Move car along angle
    this.car.x += Math.cos(this.car.angle) * this.car.speed;
    this.car.y += Math.sin(this.car.angle) * this.car.speed;

    // Check boundary collisions
    if (this.car.y < 40 || this.car.y > this.height - 40 || this.car.x < 30 || this.car.x > this.width - 30) {
      this.triggerCrash("Menabrak trotoar jalan!");
      return;
    }

    // Check Luxury Cars Collisions
    if (this.checkCollision(this.car, this.frontCar)) {
      this.triggerCrash(`Menabrak ${this.frontCar.name}! Bumper depan lecet 2 milimeter!`);
      return;
    }

    if (this.checkCollision(this.car, this.rearCar)) {
      this.triggerCrash(`Menyerempet ${this.rearCar.name}! Cat titanium tergores!`);
      return;
    }

    // Check Victory Parked
    this.checkParked();
  }

  checkCollision(c1, c2) {
    // Oriented bounding radius check
    const r1 = 28;
    const r2 = 36;
    const dist = Math.hypot(c1.x - (c2.x + c2.w / 2), c1.y - (c2.y + c2.h / 2));
    return dist < (r1 + r2);
  }

  checkParked() {
    const targetCenterX = this.targetSlot.x + this.targetSlot.w / 2;
    const targetCenterY = this.targetSlot.y + this.targetSlot.h / 2;

    const dist = Math.hypot(this.car.x - targetCenterX, this.car.y - targetCenterY);

    // Normalize angle to [0, PI]
    const normAngle = Math.abs(this.car.angle % Math.PI);
    const isHorizontal = normAngle < 0.35 || Math.abs(normAngle - Math.PI) < 0.35;

    if (dist < 28 && isHorizontal && Math.abs(this.car.speed) < 0.15) {
      this.handleVictory();
    }
  }

  triggerCrash(reason) {
    this.isDead = true;
    if (window.soundFX) window.soundFX.playExpenseBuzz();

    this.modal.style.display = 'flex';
    this.modalCard.className = 'parking-modal-card crash';
    this.modalTitle.textContent = "CRASH! TABRAKAN MAUT 💥";
    this.modalDesc.textContent = `${reason} Total tagihan ganti rugi: Rp 480.000.000! Sertifikat mengemudi Anda otomatis dicabut!`;
  }

  handleVictory() {
    this.isParked = true;
    if (window.soundFX) window.soundFX.playCashChime();

    this.modal.style.display = 'flex';
    this.modalCard.className = 'parking-modal-card';
    this.modalTitle.textContent = "🏆 KEAJAIBAN DUNIA TERJADI!";
    this.modalDesc.textContent = "Luar biasa! Di tengah stir kebalik, aspal licin es, dan klakson taksi yang berisik, Anda sukses parkir paralel sempurna tanpa lecet!";
  }

  draw() {
    this.ctx.fillStyle = '#11141c';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Road lane markings
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([20, 15]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 230);
    this.ctx.lineTo(this.width, 230);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Curb line
    this.ctx.strokeStyle = '#475569';
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 150);
    this.ctx.lineTo(this.width, 150);
    this.ctx.stroke();

    // Target Parking Box (Green Dashed)
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([8, 6]);
    this.ctx.strokeRect(this.targetSlot.x, this.targetSlot.y, this.targetSlot.w, this.targetSlot.h);
    this.ctx.setLineDash([]);

    this.ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    this.ctx.fillRect(this.targetSlot.x, this.targetSlot.y, this.targetSlot.w, this.targetSlot.h);

    this.ctx.fillStyle = '#10b981';
    this.ctx.font = 'bold 12px Inter';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("SLOT PARKIR KOSONG (MUNDUR KE SINI)", this.targetSlot.x + this.targetSlot.w / 2, this.targetSlot.y + 36);

    // Front Lamborghini
    this.drawObstacleCar(this.frontCar);

    // Rear Bugatti
    this.drawObstacleCar(this.rearCar);

    // Taxi behind in driving lane
    this.drawTaxiBehind();

    // Player Car (Rotated)
    this.ctx.save();
    this.ctx.translate(this.car.x, this.car.y);
    this.ctx.rotate(this.car.angle);

    // Red Car Body
    this.ctx.fillStyle = '#ef4444';
    this.ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(-this.car.w / 2, -this.car.h / 2, this.car.w, this.car.h);
    this.ctx.shadowBlur = 0;

    // Windshield
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.fillRect(10, -18, 16, 36);

    // Rear windshield
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.fillRect(-32, -18, 14, 36);

    // Headlights
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(this.car.w / 2 - 4, -this.car.h / 2 + 4, 4, 8);
    this.ctx.fillRect(this.car.w / 2 - 4, this.car.h / 2 - 12, 4, 8);

    // Taillights
    this.ctx.fillStyle = '#ff0044';
    this.ctx.fillRect(-this.car.w / 2, -this.car.h / 2 + 4, 4, 8);
    this.ctx.fillRect(-this.car.w / 2, this.car.h / 2 - 12, 4, 8);

    this.ctx.restore();
  }

  drawObstacleCar(c) {
    this.ctx.fillStyle = c.color;
    this.ctx.shadowColor = c.color;
    this.ctx.shadowBlur = 12;
    this.ctx.fillRect(c.x, c.y, c.w, c.h);
    this.ctx.shadowBlur = 0;

    // Windows
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(c.x + 35, c.y + 8, c.w - 70, c.h - 16);

    // Car name label
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 10px Inter';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(c.name, c.x + c.w / 2, c.y - 8);
  }

  drawTaxiBehind() {
    const x = 50;
    const y = 330;
    this.ctx.fillStyle = '#eab308';
    this.ctx.fillRect(x, y, 90, 48);

    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 10px Inter';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("TAXI (KLAKSON)", x + 45, y + 28);
  }

  restart() {
    this.car.x = 270;
    this.car.y = 280;
    this.car.speed = 0;
    this.car.angle = 0;
    this.isDead = false;
    this.isParked = false;
    this.modal.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.parkingGame = new ImpossibleParkingGame();
});
