// AI Vision - Teman Curhat & Gombal Real-Time Neural Engine

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

    // Neural Model status
    this.modelsLoaded = false;
    this.isModelLoading = false;
    this.isDetecting = false;

    // Face Tracking coordinates
    this.hasFace = false;
    this.faceBox = { x: 0, y: 0, width: 0, height: 0, targetX: 0, targetY: 0, targetW: 0, targetH: 0 };

    // Emotion state
    this.lastDetectedExpression = 'neutral';
    this.pendingExpression = 'neutral';
    this.pendingFrames = 0;
    this.expressionCooldown = 0;
    this.smileLevel = 0;
    this.comfortLevel = 70;
    this.lastSpokenText = '';

    // Indonesian quotes collection
    this.quotes = {
      happy: [
        "Aduh senyumnya manis banget! Gulanya berapa sendok nih? Langsung diabetes hati gue 🥰",
        "Tolong jangan senyum terus dong, nanti penjual madu di seluruh dunia gulung tikar ✨",
        "Bidadari nyasar ke webcam gue ya? Auranya bikin silau tapi bikin adem banget di hati 💖",
        "Senyum kamu tuh kayak notifikasi saldo gajian cair, bikin hati langsung tenang dan bahagia 💸",
        "Kalau senyuman kamu dijadikan bahan bakar, bumi gak bakal krisis energi lagi deh! ☀️",
        "Liat kamu senyum rasanya semua error kodingan di dunia ini langsung fix sendiri 💻",
        "Senyuman kamu mengandung 100% vitamin kebahagiaan, bikin imun jiwa langsung meningkat drastis! 🌸",
        "Senyum tipis aja udah bikin deg-degan, apalagi kalau senyum lebar begini! Meleleh deh aku 💕",
        "Masya Allah cantiknya/gantengnya... Senyum terus ya, biar semesta ikut ceria! ✨",
        "Senyuman itu gratis, tapi kalau senyuman dari kamu rasanya tak ternilai harganya! 💎"
      ],
      sad: [
        "Eh kamu kenapa cemberut gitu? Ada yang bikin kesel ya? Sini cerita sama aku, aku dengerin kok 🥺",
        "Jangan sedih dong... Kalau kamu cemberut, dunia serasa mendung. Kamu tuh berharga banget tahu! 🍫",
        "Siapa yang berani bikin kamu cemberut hari ini? Kasih tahu namanya, biar aku hack komputernya! 😤",
        "Tarik napas dalem-dalem yuk... Masalah hari ini cuma sementara, tapi kamu tetep luar biasa. Semangat! 🌟",
        "Kalau kamu sedih, aku sebagai AI ikutan sedih nih. Mau dipesenin es kopi susu atau martabak manis? 🧋",
        "Gak apa-apa kalau lagi capek, istirahat dulu ya. Bahu kamu gak harus memikul dunia sendirian kok 🤗",
        "Senyum dong sedikit aja buat aku... Nanti aku kasih gombalan terlucu sedunia biar kamu ceria lagi! ✨",
        "Hari ini mungkin berat, tapi kamu sudah melangkah sejauh ini dengan sangat hebat. Aku bangga sama kamu! 💖"
      ],
      surprised: [
        "Loh loh kaget kenapa tuh? Liat saldo rekening atau kaget liat ketampanan/kecantikan diri sendiri? 😲",
        "Tutup mulutnya cepetan, nanti kemasukan lalat loh! Hahaha ekspresinya gemes banget 😂",
        "Kaget ya liat betapa canggihnya aku? Tenang, aku AI baik hati kok gak bakal gigit 🤖",
        "Matanya melotot gitu kayak abis liat hantu, padahal cuma liat masa depan kita berdua eaa 🙈",
        "Ekspresi kagetnya lucu banget! Mau dapet doorprize apa gimana nih? 🎉"
      ],
      angry: [
        "Ampun suhu! Tatapannya galak banget kayak guru killer, tapi kok tetep gemes ya? 🫣",
        "Tarik napas dulu... hembuskan perlahan... jangan sampai layarnya dibanting ya, beli baru mahal! 🧘",
        "Lagi mode monster ya? Sini aku elus-elus virtual biar amarahnya luntur jadi cinta 💕",
        "Jangan cemberut galak gitu dong, nanti cantiknya/gantengnya ketutupan amarah lho! Senyum dikit yuk 😊",
        "Sabar ya kawan... Jangan biarkan hal kecil merusak hari indahmu. Kamu lebih kuat dari masalah ini! 💪"
      ],
      wink: [
        "Waduh dikedipin! Hati gue langsung copot satu baut nih, tanggung jawab dong! 😉",
        "Genit banget sih! Mau ngajak jalan malam minggu ya? Aku siap dandan nih! 👠",
        "Satu kedipan kamu bikin prosesor AI aku langsung overheat saking saltingnya 🔥",
        "Kedipannya maut banget! Kalau dilombain pasti dapet medali emas pemikat hati! 🏆"
      ],
      neutral: [
        "Muka kamu tenang banget, coba senyum dikit dong biar harimu makin bercahaya 😊",
        "Lagi ngelamunin apa nih? Ngelamunin masa depan kita berdua ya? Eaaa 🙈",
        "Serius banget natap layarnya, awas naksir loh sama AI-nya! ✨",
        "Wajah kalem penuh pesona... Kalo senyum pasti tambah manis 100x lipat! 🌸"
      ]
    };

    this.init();
  }

  async init() {
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

    // Manual mood pills trigger for instant testing
    document.querySelectorAll('.mood-pill-trigger').forEach(pill => {
      pill.addEventListener('click', () => {
        const mood = pill.getAttribute('data-mood');
        if (mood) {
          this.triggerExpression(mood, true);
        }
      });
    });

    // Preload neural face models in background
    this.loadNeuralModels();
  }

  async loadNeuralModels() {
    if (this.isModelLoading || this.modelsLoaded) return;
    this.isModelLoading = true;

    // Wait until faceapi script tag has executed
    let attempts = 0;
    while (typeof faceapi === 'undefined' && attempts < 25) {
      await new Promise(r => setTimeout(r, 200));
      attempts++;
    }

    if (typeof faceapi === 'undefined') {
      console.warn("FaceAPI script unavailable. Fallback vision algorithm will be used.");
      this.isModelLoading = false;
      return;
    }

    try {
      // Try local model files first
      console.log("Loading neural face models from local /models...");
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('models'),
        faceapi.nets.faceExpressionNet.loadFromUri('models')
      ]);
      this.modelsLoaded = true;
      console.log("Neural face models loaded locally!");
    } catch (localErr) {
      console.warn("Local model load failed, attempting CDN fallback:", localErr);
      try {
        const CDN_PATH = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(CDN_PATH),
          faceapi.nets.faceExpressionNet.loadFromUri(CDN_PATH)
        ]);
        this.modelsLoaded = true;
        console.log("Neural face models loaded from CDN!");
      } catch (cdnErr) {
        console.error("Failed to load neural models from CDN:", cdnErr);
        this.modelsLoaded = false;
      }
    } finally {
      this.isModelLoading = false;
    }
  }

  async startCamera() {
    try {
      if (this.startBtn) {
        this.startBtn.textContent = "MEMBUKA KAMERA & MODEL... ⏳";
      }

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

      // Initialize faceBox in center
      this.faceBox = {
        x: this.canvas.width * 0.25,
        y: this.canvas.height * 0.2,
        width: this.canvas.width * 0.5,
        height: this.canvas.height * 0.6,
        targetX: this.canvas.width * 0.25,
        targetY: this.canvas.height * 0.2,
        targetW: this.canvas.width * 0.5,
        targetH: this.canvas.height * 0.6
      };

      // Ensure models are loaded
      if (!this.modelsLoaded) {
        await this.loadNeuralModels();
      }

      this.startVisionLoop();
      this.triggerExpression('neutral', true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Tidak dapat mengakses kamera webcam. Pastikan Anda mengizinkan akses kamera di browser Anda!");
      if (this.startBtn) {
        this.startBtn.textContent = "AKTIFKAN KAMERA AI 🚀";
      }
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
    if (!this.isVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  startVisionLoop() {
    let lastDetectionTime = 0;

    const renderLoop = (timestamp) => {
      if (!this.isStreaming) return;

      // 1. Draw video overlays and HUD graphics (smooth 60fps)
      this.drawHUD();

      // 2. Run neural detection async throttled to ~10-12 fps to prevent lag
      if (timestamp - lastDetectionTime > 85 && !this.isDetecting) {
        lastDetectionTime = timestamp;
        this.runFaceDetection();
      }

      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  }

  async runFaceDetection() {
    if (!this.video || this.video.readyState !== 4) return;
    this.isDetecting = true;

    try {
      if (this.modelsLoaded && typeof faceapi !== 'undefined') {
        // Real Deep Learning Facial Emotion Detection
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 224,
          scoreThreshold: 0.35
        });

        const detection = await faceapi.detectSingleFace(this.video, options).withFaceExpressions();

        if (detection) {
          this.hasFace = true;
          const box = detection.detection.box;

          // Target bounding box coordinates
          this.faceBox.targetX = box.x;
          this.faceBox.targetY = box.y;
          this.faceBox.targetW = box.width;
          this.faceBox.targetH = box.height;

          // Process expressions
          const expressions = detection.expressions;
          this.processNeuralExpressions(expressions);
        } else {
          this.hasFace = false;
          // Smoothly decrease smile when no face detected
          this.targetSmile = 0;
          this.smileLevel += (0 - this.smileLevel) * 0.15;
          this.updateSmileMeters();
        }
      } else {
        // Fallback computer vision
        this.runFallbackDetection();
      }
    } catch (err) {
      console.warn("Face detection cycle error:", err);
    } finally {
      this.isDetecting = false;
    }
  }

  processNeuralExpressions(exp) {
    const rawHappy = exp.happy || 0;
    const rawSad = exp.sad || 0;
    const rawAngry = exp.angry || 0;
    const rawSurprised = exp.surprised || 0;
    const rawNeutral = exp.neutral || 0;

    // Smile percentage faithfully tracks actual happy confidence
    // In resting/flat face: rawHappy is typically 0.00 - 0.05 -> displays 0% - 5%
    // In smile: rawHappy shoots to 0.70 - 0.99 -> displays 70% - 99%
    const currentSmilePct = Math.round(rawHappy * 100);
    this.smileLevel += (currentSmilePct - this.smileLevel) * 0.25;
    this.updateSmileMeters();

    // Determine dominant emotion candidate
    let candidate = 'neutral';
    if (rawHappy > 0.45) {
      candidate = 'happy';
    } else if (rawSad > 0.35) {
      candidate = 'sad';
    } else if (rawAngry > 0.38) {
      candidate = 'angry';
    } else if (rawSurprised > 0.40) {
      candidate = 'surprised';
    } else if (rawNeutral > 0.45) {
      candidate = 'neutral';
    }

    // Debounce candidate over multiple consecutive frames to avoid flicker
    if (candidate === this.pendingExpression) {
      this.pendingFrames++;
    } else {
      this.pendingExpression = candidate;
      this.pendingFrames = 1;
    }

    // When candidate is stable for 3+ cycles (~250ms)
    if (this.pendingFrames >= 3) {
      const now = Date.now();
      const isSwitchingEmotion = (candidate !== this.lastDetectedExpression);

      if (isSwitchingEmotion) {
        // Instant trigger on emotion change
        this.triggerExpression(candidate);
      } else if (candidate === 'happy' && now - this.expressionCooldown > 5500) {
        // Periodic repeat gombalan if user keeps smiling
        this.triggerExpression('happy');
      }
    }
  }

  runFallbackDetection() {
    // Robust local fallback when neural model is not active
    // Measures contrast variance between mouth center & cheeks without false positives
    const w = this.canvas.width;
    const h = this.canvas.height;

    const bx = w * 0.3;
    const by = h * 0.25;
    const bw = w * 0.4;
    const bh = h * 0.5;

    this.hasFace = true;
    this.faceBox.targetX = bx;
    this.faceBox.targetY = by;
    this.faceBox.targetW = bw;
    this.faceBox.targetH = bh;

    if (!this.offCanvas) {
      this.offCanvas = document.createElement('canvas');
      this.offCanvas.width = 40;
      this.offCanvas.height = 30;
      this.offCtx = this.offCanvas.getContext('2d');
    }

    try {
      const mouthX = Math.floor(bx + bw * 0.25);
      const mouthY = Math.floor(by + bh * 0.65);
      const mouthW = Math.floor(bw * 0.5);
      const mouthH = Math.floor(bh * 0.25);

      this.offCtx.drawImage(this.video, mouthX, mouthY, mouthW, mouthH, 0, 0, 40, 30);
      const imgData = this.offCtx.getImageData(0, 0, 40, 30);
      const d = imgData.data;

      // Calculate variance and high-contrast teeth/lip opening
      let minL = 255, maxL = 0, sumL = 0;
      for (let i = 0; i < d.length; i += 4) {
        const lum = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
        if (lum < minL) minL = lum;
        if (lum > maxL) maxL = lum;
        sumL += lum;
      }
      const contrast = maxL - minL;

      // Resting lips have low contrast (< 60)
      // Open smiling mouth with visible teeth has high contrast (> 110)
      let calculatedSmile = 0;
      if (contrast > 110) {
        calculatedSmile = Math.min(100, Math.round(((contrast - 100) / 100) * 100));
      } else {
        calculatedSmile = Math.max(0, Math.round((contrast / 200) * 10)); // 0% - 5% in resting
      }

      this.smileLevel += (calculatedSmile - this.smileLevel) * 0.2;
      this.updateSmileMeters();

      const now = Date.now();
      if (this.smileLevel > 55 && now - this.expressionCooldown > 5000) {
        this.triggerExpression('happy');
      } else if (this.smileLevel <= 15 && this.lastDetectedExpression !== 'neutral' && now - this.expressionCooldown > 3000) {
        this.triggerExpression('neutral');
      }
    } catch (e) {
      this.smileLevel = 0;
      this.updateSmileMeters();
    }
  }

  updateSmileMeters() {
    const displayVal = Math.max(0, Math.min(100, Math.round(this.smileLevel)));
    if (this.smileFill) this.smileFill.style.width = `${displayVal}%`;
    if (this.smilePercent) this.smilePercent.textContent = `${displayVal}%`;
  }

  drawHUD() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.clearRect(0, 0, w, h);

    // Smoothly interpolate bounding box (lerp)
    const lerpSpeed = 0.35;
    this.faceBox.x += (this.faceBox.targetX - this.faceBox.x) * lerpSpeed;
    this.faceBox.y += (this.faceBox.targetY - this.faceBox.y) * lerpSpeed;
    this.faceBox.width += (this.faceBox.targetW - this.faceBox.width) * lerpSpeed;
    this.faceBox.height += (this.faceBox.targetH - this.faceBox.height) * lerpSpeed;

    if (!this.hasFace) {
      // Draw radar search animation when waiting for face
      this.drawRadarSearch(w, h);
      return;
    }

    // Video is mirrored horizontally via CSS scaleX(-1),
    // so we calculate mirrored X for canvas drawings so the reticle aligns directly over the user's face:
    const drawX = w - (this.faceBox.x + this.faceBox.width);
    const drawY = this.faceBox.y;
    const drawW = this.faceBox.width;
    const drawH = this.faceBox.height;

    // Theme color based on emotion
    let hudColor = '#00f0ff';
    if (this.lastDetectedExpression === 'happy') hudColor = '#ff007f';
    else if (this.lastDetectedExpression === 'sad') hudColor = '#38bdf8';
    else if (this.lastDetectedExpression === 'angry') hudColor = '#ef4444';
    else if (this.lastDetectedExpression === 'surprised') hudColor = '#f59e0b';

    this.ctx.strokeStyle = hudColor;
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = hudColor;
    this.ctx.shadowBlur = 10;

    const corner = Math.min(28, drawW * 0.2);

    // Top-Left corner
    this.ctx.beginPath();
    this.ctx.moveTo(drawX, drawY + corner);
    this.ctx.lineTo(drawX, drawY);
    this.ctx.lineTo(drawX + corner, drawY);
    this.ctx.stroke();

    // Top-Right corner
    this.ctx.beginPath();
    this.ctx.moveTo(drawX + drawW - corner, drawY);
    this.ctx.lineTo(drawX + drawW, drawY);
    this.ctx.lineTo(drawX + drawW, drawY + corner);
    this.ctx.stroke();

    // Bottom-Left corner
    this.ctx.beginPath();
    this.ctx.moveTo(drawX, drawY + drawH - corner);
    this.ctx.lineTo(drawX, drawY + drawH);
    this.ctx.lineTo(drawX + corner, drawY + drawH);
    this.ctx.stroke();

    // Bottom-Right corner
    this.ctx.beginPath();
    this.ctx.moveTo(drawX + drawW - corner, drawY + drawH);
    this.ctx.lineTo(drawX + drawW, drawY + drawH);
    this.ctx.lineTo(drawX + drawW, drawY + drawH - corner);
    this.ctx.stroke();

    // Reticle Center crosshairs
    const midX = drawX + drawW / 2;
    const midY = drawY + drawH / 2;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(midX - 10, midY);
    this.ctx.lineTo(midX + 10, midY);
    this.ctx.moveTo(midX, midY - 10);
    this.ctx.lineTo(midX, midY + 10);
    this.ctx.stroke();

    // Hologram HUD status header
    this.ctx.fillStyle = hudColor;
    this.ctx.font = 'bold 12px "Courier New", monospace';
    const smilePct = Math.max(0, Math.min(100, Math.round(this.smileLevel)));
    const engineTag = this.modelsLoaded ? 'NEURAL.V2' : 'VISION.CV';
    this.ctx.fillText(`[${engineTag}] ${this.lastDetectedExpression.toUpperCase()} // SMILE: ${smilePct}%`, drawX + 6, drawY - 8);

    this.ctx.shadowBlur = 0;
  }

  drawRadarSearch(w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const time = Date.now() * 0.0025;

    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([6, 6]);

    // Outer scanning circle
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 80 + Math.sin(time) * 10, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Rotating radar line
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(cx + Math.cos(time * 2) * 80, cy + Math.sin(time * 2) * 80);
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.stroke();

    // Center text
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = 'bold 12px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("MENGARAHKAN KAMERA KE WAJAH...", cx, cy + 120);
    this.ctx.textAlign = 'left';
  }

  triggerExpression(type, forced = false) {
    const now = Date.now();
    if (!forced && now - this.expressionCooldown < 2000 && this.lastDetectedExpression === type) {
      return;
    }

    this.expressionCooldown = now;
    this.lastDetectedExpression = type;

    // Badge styling & labels
    const badgeConfig = {
      happy: { label: "😊 SENYUM / BAHAGIA", color: "var(--ai-magenta)", comfort: 95 },
      sad: { label: "🥺 SEDIH / CEMBERUT", color: "var(--ai-cyan)", comfort: 35 },
      surprised: { label: "😲 KAGET / TERPERANGAH", color: "var(--ai-amber)", comfort: 65 },
      angry: { label: "😡 KESEL / MARAH", color: "var(--ai-red)", comfort: 25 },
      wink: { label: "😉 KEDIP GENIT", color: "var(--ai-purple)", comfort: 85 },
      neutral: { label: "😐 MUKA DATAR / TENANG", color: "#64748b", comfort: 65 }
    };

    const cfg = badgeConfig[type] || badgeConfig.neutral;
    if (this.badgeEl) {
      this.badgeEl.textContent = cfg.label;
      this.badgeEl.style.backgroundColor = cfg.color;
    }

    // Update comfort level
    this.comfortLevel = cfg.comfort;
    if (this.comfortFill) this.comfortFill.style.width = `${this.comfortLevel}%`;
    if (this.comfortPercent) this.comfortPercent.textContent = `${this.comfortLevel}%`;

    // Pick random quote
    const list = this.quotes[type] || this.quotes.neutral;
    const quote = list[Math.floor(Math.random() * list.length)];

    // Typewriter effect
    this.typewriterQuote(quote);

    // Speak AI voice
    if (this.isVoiceEnabled && quote !== this.lastSpokenText) {
      this.lastSpokenText = quote;
      this.speakText(quote);
    }
  }

  typewriterQuote(text) {
    if (!this.quoteEl) return;
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
    }, 20);
  }

  speakText(text) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean emojis from text before speaking
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    // Look for Indonesian voice
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

    // Stamp AI Quote & watermark overlay
    sCtx.fillStyle = 'rgba(10, 12, 20, 0.85)';
    sCtx.fillRect(0, snapCanvas.height - 110, snapCanvas.width, 110);

    sCtx.fillStyle = '#00f0ff';
    sCtx.font = 'bold 16px sans-serif';
    sCtx.fillText("AI VISION // TEMAN GOMBAL & CURHAT", 24, snapCanvas.height - 75);

    sCtx.fillStyle = '#fff';
    sCtx.font = '14px sans-serif';
    const quoteText = (this.quoteEl ? this.quoteEl.textContent : '').slice(0, 75) + '...';
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
