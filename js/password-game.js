// The Impossible Password Game Engine

class PasswordGame {
  constructor() {
    this.input = document.getElementById('pwdInput');
    this.container = document.getElementById('rulesContainer');
    this.charCounter = document.getElementById('charCounter');
    this.submitBtn = document.getElementById('submitBtn');
    this.modal = document.getElementById('pwdModal');
    this.retryBtn = document.getElementById('retryBtn');

    this.rules = [
      {
        id: 1,
        title: "Panjang Karakter",
        desc: "Kata sandi Anda harus memiliki minimal 6 karakter.",
        validate: (pwd) => pwd.length >= 6
      },
      {
        id: 2,
        title: "Karakter Angka",
        desc: "Kata sandi Anda harus menyertakan setidaknya 1 angka.",
        validate: (pwd) => /\d/.test(pwd)
      },
      {
        id: 3,
        title: "Huruf Kapital",
        desc: "Kata sandi Anda harus menyertakan setidaknya 1 huruf besar (kapital).",
        validate: (pwd) => /[A-Z]/.test(pwd)
      },
      {
        id: 4,
        title: "Karakter Spesial",
        desc: "Kata sandi Anda harus menyertakan salah satu simbol spesial (@, #, $, %, !, &).",
        validate: (pwd) => /[@#$%!&*]/.test(pwd)
      },
      {
        id: 5,
        title: "Penjumlahan Matematika",
        desc: "Jumlah seluruh digit angka di dalam kata sandi Anda harus sama persis dengan 25.",
        validate: (pwd) => {
          const digits = pwd.match(/\d/g);
          if (!digits) return false;
          const sum = digits.reduce((acc, d) => acc + parseInt(d, 10), 0);
          return sum === 25;
        },
        getHint: (pwd) => {
          const digits = pwd.match(/\d/g);
          const sum = digits ? digits.reduce((acc, d) => acc + parseInt(d, 10), 0) : 0;
          return `Total angka saat ini: ${sum} / 25`;
        }
      },
      {
        id: 6,
        title: "Bahasa Latin Kuno",
        desc: "Kata sandi Anda harus menyertakan nama hari dalam Bahasa Latin (contoh: Solis, Lunae, Martis, Mercurii, Jovis, Veneris, Saturni).",
        validate: (pwd) => {
          const days = ['solis', 'lunae', 'martis', 'mercurii', 'jovis', 'veneris', 'saturni'];
          const lower = pwd.toLowerCase();
          return days.some(day => lower.includes(day));
        }
      },
      {
        id: 7,
        title: "Perkalian Angka Romawi",
        desc: "Kata sandi Anda harus menyertakan angka Romawi yang jika dikalikan nilainya tepat 35 (V [5] dan VII [7]).",
        validate: (pwd) => {
          return pwd.includes('V') && pwd.includes('VII');
        },
        getHint: () => "Petunjuk: Sertakan 'V' dan 'VII' (5 × 7 = 35)"
      },
      {
        id: 8,
        title: "Fase Astronomi Bulan",
        desc: "Kata sandi Anda harus menyertakan salah satu emoji fase bulan: 🌕, 🌖, 🌗, 🌘, 🌑, 🌒, 🌓, 🌔.",
        validate: (pwd) => {
          const moons = ['🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔'];
          return moons.some(m => pwd.includes(m));
        }
      },
      {
        id: 9,
        title: "JEBAKAN TERLARANG: Anti Huruf 'A'",
        desc: "PEMBERITAHUAN DARURAT: Kata sandi Anda DILARANG MENGANDUNG HURUF 'A' (baik besar maupun kecil)!",
        validate: (pwd) => {
          return !pwd.toLowerCase().includes('a');
        },
        getHint: () => "Peringatan: Ganti nama hari latin yang mengandung huruf 'A'!"
      }
    ];

    this.unlockedRuleIndex = 0;
    this.countdownTimer = null;
    this.timeLeft = 8;

    this.init();
  }

  init() {
    this.input.addEventListener('input', () => this.handleInput());
    this.submitBtn.addEventListener('click', () => this.handleSubmit());
    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => this.restart());
    }
    this.renderRules();
  }

  handleInput() {
    const pwd = this.input.value;
    this.charCounter.textContent = `${pwd.length} karakter`;

    if (window.soundFX) {
      window.soundFX.playKeyClack();
    }

    // Check unlocking progress
    for (let i = 0; i < this.rules.length; i++) {
      const isValid = this.rules[i].validate(pwd);
      if (isValid && i === this.unlockedRuleIndex && this.unlockedRuleIndex < this.rules.length - 1) {
        this.unlockedRuleIndex++;
        if (window.soundFX) window.soundFX.playTerminalBeep(true);
      }
    }

    this.renderRules();
  }

  renderRules() {
    const pwd = this.input.value;
    this.container.innerHTML = '';

    let allValid = true;

    for (let i = 0; i <= this.unlockedRuleIndex; i++) {
      const rule = this.rules[i];
      const valid = rule.validate(pwd);
      if (!valid) allValid = false;

      const card = document.createElement('div');
      card.className = `rule-card ${valid ? 'valid' : 'invalid'}`;

      const hintText = rule.getHint ? `<span class="rule-hint">${rule.getHint(pwd)}</span>` : '';

      card.innerHTML = `
        <div class="rule-icon">${valid ? '✅' : '❌'}</div>
        <div class="rule-content">
          <div class="rule-title">
            <span>${rule.title}</span>
            <span class="rule-num">ATURAN ${rule.id}</span>
          </div>
          <div class="rule-desc">${rule.desc}</div>
          ${hintText}
        </div>
      `;

      this.container.appendChild(card);
    }

    // Check if fully ready
    if (this.unlockedRuleIndex === this.rules.length - 1 && allValid) {
      this.activateSubmit();
    } else {
      this.deactivateSubmit();
    }
  }

  activateSubmit() {
    if (!this.submitBtn.classList.contains('ready')) {
      this.submitBtn.classList.add('ready');
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = `KIRIM SEKARANG! (KADALUARSA DALAM 8d)`;
      if (window.soundFX) window.soundFX.playCashChime();

      this.timeLeft = 8;
      if (this.countdownTimer) clearInterval(this.countdownTimer);

      this.countdownTimer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft > 0) {
          this.submitBtn.textContent = `KIRIM SEKARANG! (KADALUARSA DALAM ${this.timeLeft}d)`;
        } else {
          clearInterval(this.countdownTimer);
          this.deactivateSubmit();
          this.submitBtn.textContent = "KADALUARSA! SILAKAN KETIK ULANG 😈";
          this.input.value = "";
          this.unlockedRuleIndex = 0;
          this.renderRules();
          if (window.soundFX) window.soundFX.playExpenseBuzz();
        }
      }, 1000);
    }
  }

  deactivateSubmit() {
    this.submitBtn.classList.remove('ready');
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = "KIRIM PENDAFTARAN (LENGKAPI SEMUA ATURAN)";
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  handleSubmit() {
    if (this.submitBtn.classList.contains('ready')) {
      if (this.countdownTimer) clearInterval(this.countdownTimer);
      if (window.soundFX) window.soundFX.playCashChime();
      this.modal.style.display = 'flex';
    }
  }

  restart() {
    this.input.value = '';
    this.unlockedRuleIndex = 0;
    this.deactivateSubmit();
    this.modal.style.display = 'none';
    this.renderRules();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.passwordGame = new PasswordGame();
});
