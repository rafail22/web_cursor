// Simulator Batalin Langganan - The Cancel Subscription Nightmare Engine

class UnsubscribeGame {
  constructor() {
    this.steps = [
      document.getElementById('step1'),
      document.getElementById('step2'),
      document.getElementById('step3'),
      document.getElementById('step4')
    ];
    this.currentStep = 0;

    this.modal = document.getElementById('unsubModal');
    this.retryBtn = document.getElementById('btnUnsubRetry');

    this.init();
  }

  init() {
    // Step 1 buttons
    const btnStay1 = document.getElementById('btnStay1');
    const btnCancel1 = document.getElementById('btnCancel1');
    if (btnStay1) {
      btnStay1.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playCashChime();
        alert("🎉 TERIMA KASIH! Kartu kredit Anda telah didebit otomatis untuk 12 bulan ke depan demi kenyamanan bersama!");
      });
    }
    if (btnCancel1) {
      btnCancel1.addEventListener('click', () => this.goToStep(1));
    }

    // Step 2 buttons
    const btnConfirmStep2 = document.getElementById('btnConfirmStep2');
    if (btnConfirmStep2) {
      btnConfirmStep2.addEventListener('click', () => {
        const cb1 = document.getElementById('cb1').checked;
        const cb2 = document.getElementById('cb2').checked;
        const cb3 = document.getElementById('cb3').checked;

        // Correct logic: cb1 must be true, cb2 must be true, cb3 must be false!
        if (cb1 && cb2 && !cb3) {
          if (window.soundFX) window.soundFX.playTerminalBeep(true);
          this.goToStep(2);
        } else {
          if (window.soundFX) window.soundFX.playExpenseBuzz();
          alert("❌ LOGIKA SALAH! Perhatikan kata-kata negasi ganda: TIDAK ingin TIDAK membatalkan, dan JANGAN mencentang komitmen seumur hidup!");
        }
      });
    }

    // Step 3 buttons
    const btnGuiltStay = document.getElementById('btnGuiltStay');
    const btnColdHeart = document.getElementById('btnColdHeart');
    if (btnGuiltStay) {
      btnGuiltStay.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playCashChime();
        alert("😻 Maskot kucing kami berterima kasih! Langganan Anda diperpanjang otomatis.");
        this.goToStep(0);
      });
    }
    if (btnColdHeart) {
      btnColdHeart.addEventListener('click', () => this.goToStep(3));
    }

    // Step 4 button (Final CS Bot showdown)
    const btnFinalKill = document.getElementById('btnFinalKill');
    let clicks = 0;
    if (btnFinalKill) {
      btnFinalKill.addEventListener('click', () => {
        clicks++;
        if (clicks < 3) {
          if (window.soundFX) window.soundFX.playWhoosh();
          btnFinalKill.style.transform = `translate(${(Math.random() - 0.5) * 120}px, ${(Math.random() - 0.5) * 40}px)`;
          btnFinalKill.textContent = `BATALKAN SEKARANG! (KLIK ${3 - clicks} KALI LAGI)`;
        } else {
          this.handleVictory();
        }
      });
    }

    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => this.restart());
    }
  }

  goToStep(index) {
    this.steps.forEach((s, idx) => {
      s.classList.toggle('active', idx === index);
    });
    this.currentStep = index;
    if (window.soundFX) window.soundFX.playKeyClack();
  }

  handleVictory() {
    if (window.soundFX) window.soundFX.playCashChime();
    this.modal.style.display = 'flex';
  }

  restart() {
    this.modal.style.display = 'none';
    document.getElementById('cb1').checked = false;
    document.getElementById('cb2').checked = false;
    document.getElementById('cb3').checked = false;
    const btn = document.getElementById('btnFinalKill');
    if (btn) {
      btn.style.transform = 'none';
      btn.textContent = 'KONFIRMASI AKHIR PEMBATALAN SEKARANG';
    }
    this.goToStep(0);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.unsubGame = new UnsubscribeGame();
});
