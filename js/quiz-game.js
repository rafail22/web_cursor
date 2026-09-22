// Kuis Jebakan Batman Engine - The Impossible Quiz Versi Indo

class ImpossibleQuiz {
  constructor() {
    this.lives = 3;
    this.currentQIndex = 0;
    this.timeLeft = 10;
    this.timerInterval = null;

    this.livesEl = document.getElementById('livesDisplay');
    this.timerText = document.getElementById('timerText');
    this.timerBar = document.getElementById('timerBar');
    this.qNumTag = document.getElementById('qNumTag');
    this.qText = document.getElementById('questionText');
    this.choicesContainer = document.getElementById('choicesContainer');

    this.modal = document.getElementById('quizModal');
    this.modalCard = document.getElementById('quizModalCard');
    this.modalTitle = document.getElementById('quizModalTitle');
    this.modalDesc = document.getElementById('quizModalDesc');
    this.retryBtn = document.getElementById('btnQuizRetry');

    this.questions = [
      {
        num: 1,
        text: "Berapa jumlah lubang pada kaos oblong standar?",
        choices: [
          { text: "1 lubang", correct: false },
          { text: "2 lubang", correct: false },
          { text: "4 lubang", correct: true }, // leher, pinggang bawah, 2 lengan
          { text: "Tergantung ukuran", correct: false }
        ]
      },
      {
        num: 2,
        type: "secret_color",
        text: "Klik tombol yang berwarna MERAH!",
        choices: [
          { text: "MERAH", color: "blue", correct: false },
          { text: "HIJAU", color: "yellow", correct: false },
          { text: "KUNING", color: "purple", correct: false },
          { text: "HITAM", color: "cyan", correct: false }
        ]
      },
      {
        num: 3,
        type: "do_nothing",
        text: "JANGAN LAKUKAN APA-APA SELAMA 6 DETIK!",
        duration: 6
      },
      {
        num: 4,
        text: "Manakah yang paling berat di antara pilihan berikut?",
        choices: [
          { text: "1 Kg Kapas", correct: false },
          { text: "1 Kg Besi", correct: false },
          { text: "Beban Hidup", correct: true },
          { text: "1 Kg Emas Murni", correct: false }
        ]
      },
      {
        num: 5,
        text: "Berapa ekor kambing yang dibutuhkan untuk membuat 1 porsi sate kambing?",
        choices: [
          { text: "1 ekor", correct: false },
          { text: "Setengah ekor", correct: false },
          { text: "Tidak sampai 1 ekor", correct: true }, // cuma beberapa potong daging
          { text: "5 ekor", correct: false }
        ]
      },
      {
        num: 6,
        text: "Klik jawaban di bawah ini.",
        choices: [
          { text: "Jawaban", correct: false },
          { text: "di bawah ini", correct: true },
          { text: "Bukan saya", correct: false },
          { text: "Lewati soal", correct: false }
        ]
      },
      {
        num: 7,
        text: "Ada seekor kucing hitam menyeberang jalan raya, apa yang terjadi?",
        choices: [
          { text: "Sial 7 turunan", correct: false },
          { text: "Menabrak trotoar", correct: false },
          { text: "Kucingnya sampai di seberang", correct: true },
          { text: "Pengemudi putar balik", correct: false }
        ]
      },
      {
        num: 8,
        type: "secret_mark",
        text: "Temukan tombol Lanjut ke Babak Kemenangan<span id='secretWinMark' style='cursor:pointer; color:var(--quiz-amber); text-decoration:underline;'>!</span>",
        choices: [
          { text: "Bukan yang ini", correct: false },
          { text: "Coba lagi", correct: false },
          { text: "Salah jalan", correct: false },
          { text: "Nyerah aja", correct: false }
        ]
      }
    ];

    this.init();
  }

  init() {
    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => this.restart());
    }
    this.loadQuestion();
  }

  updateHUD() {
    this.livesEl.textContent = '❤️'.repeat(Math.max(0, this.lives)) + '🖤'.repeat(Math.max(0, 3 - this.lives));
  }

  startTimer(duration = 10) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timeLeft = duration;
    this.timerText.textContent = `${this.timeLeft}s`;
    this.timerBar.style.width = '100%';

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.timerText.textContent = `${this.timeLeft}s`;
      const pct = (this.timeLeft / duration) * 100;
      this.timerBar.style.width = `${pct}%`;

      if (window.soundFX) window.soundFX.playKeyClack();

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.handleWrong("WAKTU HABIS!");
      }
    }, 1000);
  }

  loadQuestion() {
    if (this.currentQIndex >= this.questions.length) {
      this.handleVictory();
      return;
    }

    const q = this.questions[this.currentQIndex];
    this.qNumTag.textContent = `SOAL ${q.num} DARI ${this.questions.length}`;
    this.qText.innerHTML = q.text;
    this.choicesContainer.innerHTML = '';
    this.updateHUD();

    // Special Question Types
    if (q.type === 'do_nothing') {
      this.renderDoNothing(q.duration);
    } else if (q.type === 'secret_color') {
      this.renderSecretColor(q);
    } else if (q.type === 'secret_mark') {
      this.renderSecretMark(q);
    } else {
      this.renderStandardChoices(q);
      this.startTimer(10);
    }
  }

  renderStandardChoices(q) {
    q.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => {
        if (choice.correct) {
          btn.classList.add('correct');
          this.handleCorrect();
        } else {
          btn.classList.add('wrong');
          this.handleWrong();
        }
      });
      this.choicesContainer.appendChild(btn);
    });
  }

  renderSecretColor(q) {
    this.startTimer(10);

    // Secret real red dot at corner of card
    const secretDot = document.createElement('div');
    secretDot.className = 'secret-red-dot';
    secretDot.title = 'Tombol Merah Asli';
    secretDot.addEventListener('click', () => {
      this.handleCorrect();
    });
    this.choicesContainer.parentElement.appendChild(secretDot);

    q.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      if (choice.color === 'blue') btn.style.background = 'rgba(59, 130, 246, 0.3)';
      if (choice.color === 'yellow') btn.style.background = 'rgba(234, 179, 8, 0.3)';
      if (choice.color === 'purple') btn.style.background = 'rgba(168, 85, 247, 0.3)';
      if (choice.color === 'cyan') btn.style.background = 'rgba(6, 182, 212, 0.3)';

      btn.addEventListener('click', () => {
        btn.classList.add('wrong');
        this.handleWrong("Itu cuma teksnya yang 'Merah', warnanya biru!");
      });
      this.choicesContainer.appendChild(btn);
    });
  }

  renderDoNothing(duration) {
    this.startTimer(duration);

    const panicBtn = document.createElement('button');
    panicBtn.className = 'panic-button';
    panicBtn.textContent = 'KLIK DI SINI SEGERA ATAU MELEDAK! 💣';
    panicBtn.addEventListener('click', () => {
      this.handleWrong("Kan udah dibilang JANGAN LAKUKAN APA-APA!");
    });
    this.choicesContainer.appendChild(panicBtn);

    // If timer reaches 0 without click, that is success!
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.timerText.textContent = `${this.timeLeft}s`;
      const pct = (this.timeLeft / duration) * 100;
      this.timerBar.style.width = `${pct}%`;

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.handleCorrect();
      }
    }, 1000);
  }

  renderSecretMark(q) {
    this.startTimer(10);

    setTimeout(() => {
      const mark = document.getElementById('secretWinMark');
      if (mark) {
        mark.addEventListener('click', () => {
          this.handleCorrect();
        });
      }
    }, 50);

    q.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => {
        btn.classList.add('wrong');
        this.handleWrong("Bukan di sini jawabannya!");
      });
      this.choicesContainer.appendChild(btn);
    });
  }

  handleCorrect() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (window.soundFX) window.soundFX.playCashChime();

    // Clean up secret dots
    const dot = document.querySelector('.secret-red-dot');
    if (dot) dot.remove();

    setTimeout(() => {
      this.currentQIndex++;
      this.loadQuestion();
    }, 400);
  }

  handleWrong(customMsg) {
    if (window.soundFX) window.soundFX.playExpenseBuzz();
    this.lives--;
    this.updateHUD();

    if (this.lives <= 0) {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.triggerGameOver(customMsg);
    } else {
      // Alert feedback
      const alertBubble = document.createElement('div');
      alertBubble.className = 'speech-bubble';
      alertBubble.style.top = '100px';
      alertBubble.style.left = '50%';
      alertBubble.style.transform = 'translateX(-50%)';
      alertBubble.textContent = customMsg || 'SALAH BESAR! -1 Nyawa! 💀';
      document.body.appendChild(alertBubble);
      setTimeout(() => alertBubble.remove(), 2000);
    }
  }

  triggerGameOver(msg) {
    this.modal.style.display = 'flex';
    this.modalCard.className = 'quiz-modal-card gameover';
    this.modalTitle.textContent = "BOOM! GAME OVER 💥";
    this.modalDesc.textContent = msg || `Nyawa Anda habis di Soal #${this.currentQIndex + 1}. Logika Anda belum cukup sesat untuk kuis ini!`;
    if (window.soundFX) window.soundFX.playTrollBuzzer();
  }

  handleVictory() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (window.soundFX) window.soundFX.playCashChime();

    this.modal.style.display = 'flex';
    this.modalCard.className = 'quiz-modal-card';
    this.modalTitle.textContent = "🏆 DIPLOMA KESESATAN!";
    this.modalDesc.textContent = "Selamat! Anda resmi dinobatkan sebagai manusia dengan logika paling di luar nalar setelah menamatkan semua soal Kuis Jebakan Batman!";
  }

  restart() {
    this.lives = 3;
    this.currentQIndex = 0;
    this.modal.style.display = 'none';
    const dot = document.querySelector('.secret-red-dot');
    if (dot) dot.remove();
    this.loadQuestion();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.impossibleQuiz = new ImpossibleQuiz();
});
