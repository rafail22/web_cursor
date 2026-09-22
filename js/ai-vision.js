// AI Vision - Teman Curhat & Gombal Real-Time Engine

class AIVisionCompanion {
  constructor() {
    this.video = document.getElementById('webcamVideo');
    this.canvas = document.getElementById('visionCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.startOverlay = document.getElementById('startOverlay');
    this.startBtn = document.getElementById('btnStartCamera');
    this.switchCamBtn = document.getElementById('btnSwitchCam');
    this.voiceToggleBtn = document.getElementById('btnToggleVoice');
    this.snapshotBtn = document.getElementById('btnSnapshot');
    this.toast = document.getElementById('snapshotToast');

    this.quoteEl = document.getElementById('aiQuoteText');
    this.badgeEl = document.getElementById('detectedBadge');
    this.smileFill = document.getElementById('smileFill');
    this.smilePercent = document.getElementById('smilePercent');
    this.comfortFill = document.getElementById('comfortFill');
    this.comfortPercent = document.getElementById('comfortPercent');

    this.isStreaming = false;
    this.isVoiceEnabled = true;
    this.currentFacingMode = 'user';
    this.stream = null;

    this.lastDetectedExpression = 'neutral';
    this.expressionCooldown = 0;
    this.smileLevel = 0;
    this.comfortLevel = 50;

    this.quotes = {
      happy: [
        "Aduh senyumnya manis banget! Gulanya berapa sendok nih? Langsung diabetes hati gue 🥰",
        "Tolong jangan senyum terus dong, nanti penjual madu di seluruh dunia gulung tikar ✨",
        "Bidadari nyasar ke webcam gue ya? Auranya bikin silau tapi bikin adem banget di hati 💖",
        "Senyum kamu tuh kayak notifikasi saldo gajian cair, bikin hati langsung tenang dan bahagia 💸",
        "Kalau senyuman kamu dijadikan bahan bakar, bumi gak bakal krisis energi lagi deh! ☀️",
        "Liat kamu senyum rasanya semua error kodingan di dunia ini langsung fix sendiri 💻",
        "Senyuman kamu mengandung 100% vitamin kebahagiaan, bikin imun jiwa langsung meningkat drastis! 🌸",
        "Senyum tipis aja udah bikin deg-degan, apalagi kalau senyum lebar begini! Meleleh deh aku 💕"
      ],
      sad: [
        "Eh kamu kenapa cemberut gitu? Ada yang bikin kesel ya? Sini cerita sama aku, aku dengerin kok 🥺",
        "Jangan sedih dong... Kalau kamu cemberut, dunia serasa mendung. Kamu tuh berharga banget tahu! 🍫",
        "Siapa yang berani bikin kamu cemberut hari ini? Kasih tahu namanya, biar aku hack komputernya! 😤",
        "Tarik napas dalem-dalem yuk... Masalah hari ini cuma sementara, tapi kamu tetep luar biasa. Semangat! 🌟",
        "Kalau kamu sedih, aku sebagai AI ikutan sedih nih. Mau dipesenin es kopi susu atau martabak manis? 🧋",
        "Gak apa-apa kalau lagi capek, istirahat dulu ya. Bahu kamu gak harus memikul dunia sendirian kok 🤗",
        "Senyum dong sedikit aja buat aku... Nanti aku kasih gombalan terlucu sedunia biar kamu ceria lagi! ✨"
      ],
      surprised: [
        "Loh loh kaget kenapa tuh? Liat saldo rekening atau kaget liat ketampanan/kecantikan diri sendiri? 😲",
        "Tutup mulutnya cepetan, nanti kemasukan lalat loh! Hahaha ekspresinya gemes banget 😂",
        "Kaget ya liat betapa canggihnya aku? Tenang, aku AI baik hati kok gak bakal gigit 🤖",
        "Matanya melotot gitu kayak abis liat hantu, padahal cuma liat masa depan kita berdua eaa 🙈"
      ],
      angry: [
        "Ampun suhu! Tatapannya galak banget kayak guru killer, tapi kok tetep gemes ya? 🫣",
        "Tarik napas dulu... hembuskan perlahan... jangan sampai laptopnya dibanting ya, beli baru mahal! 🧘",
        "Lagi mode monster ya? Sini aku elus-elus virtual biar amarahnya luntur jadi cinta 💕",
        "Jangan cemberut galak gitu dong, nanti cantiknya/gantengnya ketutupan amarah lho! Senyum dikit yuk 😊"
      ],
      wink: [
        "Waduh dikedipin! Hati gue langsung copot satu baut nih, tanggung jawab dong! 😉",
        "Genit banget sih! Mau ngajak jalan malam minggu ya? Aku siap dandan nih! 👠",
        "Satu kedipan kamu bikin prosesor AI aku langsung overheat saking saltingnya 🔥"
      ],
      neutral: [
        "Muka kamu datar banget kayak tembok kosan, coba dong senyum dikit biar dunia lebih berwarna 😊",
        "Lagi ngelamunin apa nih? Ngelamunin masa depan kita berdua ya? Eaaa 🙈",
        "Serius banget natap layarnya, awas naksir loh sama AI-nya! ✨"
      ]
    };

    this.init();
  }

  init() {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.startCamera());
    }
    if (this.switchCamBtn) {
      this.switchCamBtn.addEventListener('click', () => this.switchCamera());
    }
    if (this.voiceToggleBtn) {
      this.voiceToggleBtn.addEventListener('click', () => this.toggleVoice());
    }
    if (this.snapshotBtn) {
      this.snapshotBtn.addEventListener('click', () => this.takeSnapshot());
    }

    // Manual mood pills trigger for testing
    document.querySelectorAll('.mood-pill-trigger').forEach(pill => {
      pill.addEventListener('click', () => {
        const mood = pill.getAttribute('data-mood');
        if (mood) {
          this.triggerExpression(mood, true);
        }
      });
    });
  }

  async startCamera() {
    try {
      if (this.stream) {
        this.stream.getTracks().forEach(t => t.stop());
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: this.currentFacingMode
        },
        audio: false
      });

      this.video.srcObject = this.stream;
      await this.video.play();

      this.isStreaming = true;
      if (this.startOverlay) this.startOverlay.style.display = 'none';

      this.canvas.width = this.video.videoWidth || 640;
      this.canvas.height = this.video.videoHeight || 480;

      this.startVisionLoop();
      this.triggerExpression('neutral');
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Tidak dapat mengakses kamera webcam. Pastikan Anda mengizinkan akses kamera di browser Anda!");
    }
  }

  switchCamera() {
    this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user';
    this.startCamera();
  }

  toggleVoice() {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    this.voiceToggleBtn.textContent = this.isVoiceEnabled ? '🔊 Suara AI: ON' : '🔇 Suara AI: OFF';
    this.voiceToggleBtn.classList.toggle('active-tool', this.isVoiceEnabled);
  }

  startVisionLoop() {
    const loop = () => {
      if (this.isStreaming) {
        this.analyzeFrame();
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  analyzeFrame() {
    if (!this.ctx || !this.video || this.video.readyState !== 4) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // Face detection simulation & landmark tracking
    // Draw futuristic Cyberpunk holographic face reticle
    const boxW = w * 0.44;
    const boxH = h * 0.55;
    const boxX = (w - boxW) / 2;
    const boxY = (h - boxH) / 2 - 10;

    this.drawHoloReticle(boxX, boxY, boxW, boxH);

    // Auto emotion analysis based on video frame sampling
    this.detectFacialMuscles(boxX, boxY, boxW, boxH);
  }

  drawHoloReticle(x, y, w, h) {
    this.ctx.strokeStyle = this.lastDetectedExpression === 'happy' ? '#ff007f' : '#00f0ff';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = this.ctx.strokeStyle;
    this.ctx.shadowBlur = 12;

    const cornerLen = 24;

    // Top-Left corner
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + cornerLen);
    this.ctx.lineTo(x, y);
    this.ctx.lineTo(x + cornerLen, y);
    this.ctx.stroke();

    // Top-Right corner
    this.ctx.beginPath();
    this.ctx.moveTo(x + w - cornerLen, y);
    this.ctx.lineTo(x + w, y);
    this.ctx.lineTo(x + w, y + cornerLen);
    this.ctx.stroke();

    // Bottom-Left corner
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + h - cornerLen);
    this.ctx.lineTo(x, y + h);
    this.ctx.lineTo(x + cornerLen, y + h);
    this.ctx.stroke();

    // Bottom-Right corner
    this.ctx.beginPath();
    this.ctx.moveTo(x + w - cornerLen, y + h);
    this.ctx.lineTo(x + w, y + h);
    this.ctx.lineTo(x + w, y + h - cornerLen);
    this.ctx.stroke();

    // Tracking text tag
    this.ctx.fillStyle = this.ctx.strokeStyle;
    this.ctx.font = 'bold 12px Inter';
    this.ctx.fillText(`AI.TRACK // ${this.lastDetectedExpression.toUpperCase()}`, x + 6, y - 8);

    this.ctx.shadowBlur = 0;
  }

  detectFacialMuscles(bx, by, bw, bh) {
    // We sample pixels in the mouth area (bottom 35% of the face box)
    const mouthX = Math.floor(bx + bw * 0.25);
    const mouthY = Math.floor(by + bh * 0.65);
    const mouthW = Math.floor(bw * 0.5);
    const mouthH = Math.floor(bh * 0.28);

    // Draw scanning grid on mouth & eyes
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    this.ctx.setLineDash([4, 4]);
    this.ctx.strokeRect(mouthX, mouthY, mouthW, mouthH);
    this.ctx.setLineDash([]);

    // Sample video luminance variation to estimate lip curvature
    let smileScore = 0;
    try {
      // Create temporary offscreen sampling
      if (!this.offCanvas) {
        this.offCanvas = document.createElement('canvas');
        this.offCanvas.width = 40;
        this.offCanvas.height = 30;
        this.offCtx = this.offCanvas.getContext('2d');
      }
      this.offCtx.drawImage(this.video, mouthX, mouthY, mouthW, mouthH, 0, 0, 40, 30);
      const imgData = this.offCtx.getImageData(0, 0, 40, 30);
      const d = imgData.data;

      // Check red contrast for teeth/smile opening
      let brightnessSpread = 0;
      let redCount = 0;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i+1];
        const b = d[i+2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum > 140) brightnessSpread++;
        if (r > g + 25 && r > b + 25) redCount++;
      }

      smileScore = Math.min(100, Math.round((brightnessSpread / (40 * 30)) * 260));
    } catch (e) {
      smileScore = 30;
    }

    // Smooth smileLevel
    this.smileLevel += (smileScore - this.smileLevel) * 0.15;
    this.smileFill.style.width = `${Math.min(100, Math.round(this.smileLevel))}%`;
    this.smilePercent.textContent = `${Math.min(100, Math.round(this.smileLevel))}%`;

    const now = Date.now();
    if (now - this.expressionCooldown > 3500) {
      if (this.smileLevel > 45) {
        this.triggerExpression('happy');
      }
    }
  }

  triggerExpression(type, forced = false) {
    const now = Date.now();
    if (!forced && now - this.expressionCooldown < 2500 && this.lastDetectedExpression === type) {
      return;
    }

    this.expressionCooldown = now;
    this.lastDetectedExpression = type;

    // Badges & styling
    const badgeNames = {
      happy: "😊 SENYUM / BAHAGIA",
      sad: "🥺 SEDIH / CEMBERUT",
      surprised: "😲 KAGET / TERPERANGAH",
      angry: "😡 KESEL / MARAH",
      wink: "😉 KEDIP GENIT",
      neutral: "😐 MUKA DATAR / TENANG"
    };

    const badgeColors = {
      happy: "var(--ai-magenta)",
      sad: "var(--ai-cyan)",
      surprised: "var(--ai-amber)",
      angry: "var(--ai-red)",
      wink: "var(--ai-purple)",
      neutral: "#64748b"
    };

    this.badgeEl.textContent = badgeNames[type] || type.toUpperCase();
    this.badgeEl.style.backgroundColor = badgeColors[type] || "var(--ai-cyan)";

    // Pick random quote
    const list = this.quotes[type] || this.quotes.neutral;
    const quote = list[Math.floor(Math.random() * list.length)];

    // Typewriter effect
    this.typewriterQuote(quote);

    // Update comfort level
    if (type === 'happy') this.comfortLevel = 95;
    else if (type === 'sad') this.comfortLevel = 40;
    else if (type === 'angry') this.comfortLevel = 25;
    else this.comfortLevel = 70;

    this.comfortFill.style.width = `${this.comfortLevel}%`;
    this.comfortPercent.textContent = `${this.comfortLevel}%`;

    // Speak AI Voice
    if (this.isVoiceEnabled) {
      this.speakText(quote);
    }
  }

  typewriterQuote(text) {
    this.quoteEl.textContent = "";
    let i = 0;
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    this.typewriterTimer = setInterval(() => {
      if (i < text.length) {
        this.quoteEl.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(this.typewriterTimer);
      }
    }, 22);
  }

  speakText(text) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop ongoing speech

    // Clean emojis from text before speaking
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    // Look for Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;

    window.speechSynthesis.speak(utterance);
  }

  takeSnapshot() {
    if (!this.video || this.video.readyState !== 4) {
      alert("Aktifkan kamera terlebih dahulu untuk jepret foto!");
      return;
    }

    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = this.canvas.width;
    snapCanvas.height = this.canvas.height;
    const sCtx = snapCanvas.getContext('2d');

    // Draw video mirrored
    sCtx.save();
    sCtx.translate(snapCanvas.width, 0);
    sCtx.scale(-1, 1);
    sCtx.drawImage(this.video, 0, 0, snapCanvas.width, snapCanvas.height);
    sCtx.restore();

    // Stamp AI Quote & watermark
    sCtx.fillStyle = 'rgba(10, 12, 20, 0.85)';
    sCtx.fillRect(0, snapCanvas.height - 110, snapCanvas.width, 110);

    sCtx.fillStyle = '#00f0ff';
    sCtx.font = 'bold 16px Syne';
    sCtx.fillText("AI VISION // TEMAN GOMBAL & CURHAT", 24, snapCanvas.height - 75);

    sCtx.fillStyle = '#fff';
    sCtx.font = '14px Inter';
    const quoteText = this.quoteEl.textContent.slice(0, 75) + '...';
    sCtx.fillText(`"${quoteText}"`, 24, snapCanvas.height - 40);

    // Download trigger
    const link = document.createElement('a');
    link.download = `selfie-gombal-ai-${Date.now()}.png`;
    link.href = snapCanvas.toDataURL('image/png');
    link.click();

    // Show toast
    if (this.toast) {
      this.toast.classList.add('show');
      if (window.soundFX) window.soundFX.playCashChime();
      setTimeout(() => this.toast.classList.remove('show'), 2500);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.aiCompanion = new AIVisionCompanion();
});
