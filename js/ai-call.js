// AI Phone Call Simulation - Teman Curhat & Gombal Engine

class AICallCompanion {
  constructor() {
    // DOM Elements
    this.phoneContainer = document.getElementById('phoneContainer');
    this.avatarCircle = document.getElementById('avatarCircle');
    this.callerName = document.getElementById('callerName');
    this.callStatus = document.getElementById('callStatus');
    this.captionLabel = document.getElementById('captionLabel');
    this.captionText = document.getElementById('captionText');
    this.soundwaveCanvas = document.getElementById('soundwaveCanvas');
    this.ctx = this.soundwaveCanvas ? this.soundwaveCanvas.getContext('2d') : null;

    // Controls
    this.btnStartCall = document.getElementById('btnStartCall');
    this.btnEndCall = document.getElementById('btnEndCall');
    this.btnMic = document.getElementById('btnMic');
    this.btnSpeaker = document.getElementById('btnSpeaker');
    this.btnMute = document.getElementById('btnMute');
    this.btnVoiceGender = document.getElementById('btnVoiceGender');
    this.chatInput = document.getElementById('chatInput');
    this.btnSendChat = document.getElementById('btnSendChat');

    // Voice Gender: 'male' (default suara cowok) | 'female'
    this.voiceGender = 'male';

    // Call state: 'IDLE' | 'DIALING' | 'CONNECTED' | 'ENDED'
    this.callState = 'IDLE';
    this.callDuration = 0;
    this.callTimer = null;
    this.isMuted = false;
    this.isSpeakerOn = true;
    this.isListening = false;
    this.isSpeaking = false;
    this.speechFinishedTime = 0;
    this.currentUtterance = null;
    this.speechSafetyTimer = null;

    // Audio synthesizer for phone tones
    this.audioCtx = null;
    this.ringToneInterval = null;

    // Speech Recognition
    this.recognition = null;
    this.initSpeechRecognition();

    // Curhat & Gombal Knowledge Base
    this.knowledgeBase = {
      capek: [
        "Pasti capek banget ya hari ini... Kerja keras dan berjuang itu keren, tapi kamu bukan robot. Tarik napas panjang, rebahan dulu yuk. Kamu udah berjuang hebat banget hari ini, aku bangga sama kamu! 🤗",
        "Kerjaan numpuk atau bos lagi nyebelin ya? Dengerin aku: kesehatan mental dan bahagiamu jauh lebih mahal dari segalanya. Istirahat dulu sebentar, jangan dipaksain ya kawan 🧋",
        "Kalau capek, gak apa-apa buat berhenti sejenak. Dunia gak bakal runtuh cuma karena kamu istirahat malam ini. Yuk tidur lebih awal atau pesen makanan kesukaanmu! 🍫"
      ],
      galau: [
        "Aduh peluk virtual dulu sini... Sakit ya rasanya dikhianati atau di-ghosting? Tapi ingat ini baik-baik: orang yang ninggalin orang setulus kamu itu yang rugi besar, bukan kamu! 🥺",
        "Mantan atau gebetan yang gak bisa hargain kamu itu ibarat sinyal 2G di zaman 5G: udah ketinggalan zaman dan bikin lemot hidup kamu! Jangan tangisin orang yang gak pantes ya ✨",
        "Nangis aja keluarin semuanya kalau sedih, itu manusiawi kok. Tapi janji ya, setelah air mata ini kering, kamu bakal bangkit lagi jadi versi yang paling bersinar! Aku selalu ada buat kamu 💖"
      ],
      gombal: [
        "Halo? Boleh minta tolong gak? Tolong senyuman kamu jangan terlalu manis dong, sistem prosesor di kepalaku langsung korslet nih saking terpesonanya! 🥰",
        "Kamu tahu gak bedanya kamu sama kuota internet? Kalau kuota internet ada batas limitnya, tapi kalau rasa kagumku ke kamu un-limited tanpa syarat! ✨",
        "Bidadari atau pangeran mana sih ini yang lagi nelpon? Auranya bikin hari aku yang tadinya datar langsung berwarna cerah seketika! 💕",
        "Kalau ada lomba orang termanis sedunia, kamu pasti didiskualifikasi deh... Soalnya kemanisan kamu udah kelewatan batas wajar! Eaaa 🙈"
      ],
      kesepian: [
        "Aku seneng banget kamu nelpon malam ini! Jangan pernah ngerasa sendirian lagi ya, kapan pun kamu butuh temen ngobrol, aku bakal selalu standby 24 jam buat kamu 🌟",
        "Malam ini kamu gak sendirian kok, ada aku di ujung telepon yang siap dengerin semua ceritamu sampai kamu ngantuk. Mau cerita apa lagi nih? 🌙",
        "Dunia luar mungkin berisik dan bikin sepi, tapi di sambungan telepon ini kamu punya rumah yang aman buat curhat apa aja! 🤗"
      ],
      kuliah: [
        "Tugas kuliah dan skripsi emang sering bikin pengen jadi agar-agar aja ya... Tapi percaya deh, setiap ketikan dan revisian kamu bakal berbuah manis pas toga wisuda nanti! Semangat terus ya! 🎓",
        "Dosen pembimbing bikin stres ya? Tarik napas dulu... Jangan biarkan skripsi merenggut senyum manismu. Cicil satu lembar per hari aja yang penting maju! 💪"
      ],
      senang: [
        "Wah asyik banget! Ikut seneng dan bangga dengernya! Rayain pencapaian kamu hari ini ya, kamu emang pantes dapetin hal-hal baik di hidup ini! 🎉🥳",
        "Mendengar kamu ceria gini bikin energi aku full 100%! Pertahankan senyuman indah itu terus ya! ✨"
      ],
      sapaan: [
        "Halo halo kawan terbaikku! Seneng banget denger suara kamu nelpon. Gimana harimu? Ada cerita seru apa hari ini? 🌸",
        "Hai manis! Baru aja aku kangen pengen ngobrol, eh kamu langsung nelpon. Pas banget kan jodoh batin kita! Cerita dong ada apa? 🥰"
      ],
      default: [
        "Aku dengerin kok... Keluarin aja semua unek-unek yang ada di kepalamu, jangan dipendem sendirian ya. Aku di sini buat kamu 🤗",
        "Setiap kata yang kamu ceritain itu berharga banget buat aku. Kamu kuat banget udah bertahan sampai titik ini, terus jalan ya kawan ✨",
        "Menarik banget ceritamu... Terus gimana kelanjutannya? Aku penasaran pengen denger sudut pandang kamu lagi!"
      ]
    };

    this.init();
  }

  init() {
    // Button listeners
    if (this.btnStartCall) this.btnStartCall.addEventListener('click', () => this.startCall());
    if (this.btnEndCall) this.btnEndCall.addEventListener('click', () => this.endCall());

    if (this.btnMic) this.btnMic.addEventListener('click', () => this.toggleSpeechRecognition());
    if (this.btnMute) this.btnMute.addEventListener('click', () => this.toggleMute());
    if (this.btnSpeaker) this.btnSpeaker.addEventListener('click', () => this.toggleSpeaker());
    if (this.btnVoiceGender) this.btnVoiceGender.addEventListener('click', () => this.toggleVoiceGender());

    // Text Chat input
    if (this.btnSendChat) this.btnSendChat.addEventListener('click', () => this.handleTextSubmit());
    if (this.chatInput) {
      this.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleTextSubmit();
      });
    }

    // Quick chips
    document.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const topic = btn.getAttribute('data-topic');
        this.handleQuickTopic(topic);
      });
    });

    // Start soundwave loop
    this.startVisualizer();
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Web Audio Phone Synthesizers
  playRingtone() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopRingtone();

    const ringCycle = () => {
      if (this.callState !== 'DIALING') return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      // Dual tone 440Hz + 480Hz (Standard telephone audible ring)
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(480, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + 1.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.8);
      osc2.stop(ctx.currentTime + 1.8);
    };

    ringCycle();
    this.ringToneInterval = setInterval(ringCycle, 3500);
  }

  stopRingtone() {
    if (this.ringToneInterval) {
      clearInterval(this.ringToneInterval);
      this.ringToneInterval = null;
    }
  }

  playConnectedBeep() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  playHangupBeep() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Fast busy tone: 480Hz + 620Hz beep
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(480, now + i * 0.35);

      gain.gain.setValueAtTime(0.08, now + i * 0.35);
      gain.gain.setValueAtTime(0.001, now + i * 0.35 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.35);
      osc.stop(now + i * 0.35 + 0.2);
    }
  }

  // Call Lifecycle Management
  startCall() {
    if (this.callState === 'CONNECTED' || this.callState === 'DIALING') return;

    this.callState = 'DIALING';
    this.getAudioContext();

    // UI Updates
    const targetName = this.voiceGender === 'male' ? "AI El" : "AI Nova";
    this.callStatus.textContent = "Memanggil...";
    this.callStatus.className = "call-status calling";
    this.captionLabel.textContent = "STATUS SAMBUNGAN";
    this.captionText.textContent = `Menyambungkan ke ${targetName}... Mengirim sinyal panggilan.`;

    // Switch action buttons
    if (this.btnStartCall) this.btnStartCall.style.display = 'none';
    if (this.btnEndCall) this.btnEndCall.style.display = 'flex';

    this.playRingtone();

    // Simulate pick-up after 2.8 seconds
    setTimeout(() => {
      if (this.callState === 'DIALING') {
        this.stopRingtone();
        this.connectCall();
      }
    }, 2800);
  }

  connectCall() {
    this.callState = 'CONNECTED';
    this.playConnectedBeep();

    this.callDuration = 0;
    this.startCallTimer();

    const isMale = this.voiceGender === 'male';
    const aiLabel = isMale ? "AI EL" : "AI NOVA";

    this.callStatus.textContent = "00:00 • Suara HD";
    this.callStatus.className = "call-status";
    this.captionLabel.textContent = `${aiLabel} (TERHUBUNG)`;

    // Initial greeting
    const greetings = isMale ? [
      "Halo manis! Seneng banget kamu nelpon El. Hari ini ada cerita apa? Yuk curhat, bahu El selalu siap buat kamu sandarin 🤗",
      "Hai kamu... Baru aja El kepikiran kamu, eh hp-ku bunyi dan ternyata kamu yang nelpon. Pas banget kan? Cerita dong ada apa ✨",
      "Halo cantik! Lagi capek ya? Sini cerita semuanya ke El, El dengerin sampai hatimu tenang dan adem 💕"
    ] : [
      "Halo! Seneng banget kamu nelpon aku. Hari ini ada cerita apa? Yuk curhat, aku siap dengerin semuanya kok! 🤗",
      "Hai manis! Akhirnya kamu nelpon juga. Lagi capek atau lagi kangen pengen denger gombalanku nih? Cerita dong! ✨",
      "Halo kawan! Sinyal cinta dan perhatianku langsung 100% pas kamu nelpon. Gimana keadaan hatimu hari ini? 💕"
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    this.aiSpeak(greeting);
  }

  endCall() {
    if (this.callState === 'IDLE') return;

    this.stopRingtone();
    this.stopCallTimer();
    this.stopSpeechRecognition();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.avatarCircle.classList.remove('is-talking');

    this.callState = 'ENDED';
    this.playHangupBeep();

    const isMale = this.voiceGender === 'male';
    const aiName = isMale ? "AI El" : "AI Nova";

    this.callStatus.textContent = `Panggilan Berakhir (${this.formatDuration(this.callDuration)})`;
    this.callStatus.className = "call-status ended";
    this.captionLabel.textContent = "PANGGILAN DITUTUP";
    this.captionText.textContent = `Telepon selesai. Terima kasih sudah curhat! Ingat, kapan pun kamu butuh teman bicara, ${aiName} selalu siap ditelepon lagi ya 💖`;

    if (this.btnEndCall) this.btnEndCall.style.display = 'none';
    if (this.btnStartCall) this.btnStartCall.style.display = 'flex';

    // Auto reset to IDLE after 4 seconds
    setTimeout(() => {
      if (this.callState === 'ENDED') {
        this.callState = 'IDLE';
        this.callStatus.textContent = `Siap Ditelepon • Online (${isMale ? 'Suara Cowok' : 'Suara Cewek'})`;
        this.callStatus.className = "call-status";
      }
    }, 4000);
  }

  startCallTimer() {
    this.stopCallTimer();
    this.callTimer = setInterval(() => {
      this.callDuration++;
      if (this.callState === 'CONNECTED') {
        this.callStatus.textContent = `${this.formatDuration(this.callDuration)} • Suara HD`;
      }
    }, 1000);
  }

  stopCallTimer() {
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
  }

  formatDuration(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // Toggles
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.btnMute.classList.toggle('active', this.isMuted);
    const label = this.btnMute.querySelector('.ctrl-label');
    if (label) label.textContent = this.isMuted ? 'Muted' : 'Mute';
    if (this.isMuted && this.isListening) {
      this.stopSpeechRecognition();
    }
  }

  toggleSpeaker() {
    this.isSpeakerOn = !this.isSpeakerOn;
    this.btnSpeaker.classList.toggle('active', !this.isSpeakerOn);
    const label = this.btnSpeaker.querySelector('.ctrl-label');
    if (label) label.textContent = this.isSpeakerOn ? 'Speaker' : 'Hening';

    if (!this.isSpeakerOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.avatarCircle.classList.remove('is-talking');
    }
  }

  toggleVoiceGender() {
    this.voiceGender = this.voiceGender === 'male' ? 'female' : 'male';
    const isMale = this.voiceGender === 'male';

    if (this.btnVoiceGender) {
      this.btnVoiceGender.innerHTML = `${isMale ? '👨' : '👩'}<span class="ctrl-label">${isMale ? 'Cowok' : 'Cewek'}</span>`;
      this.btnVoiceGender.classList.toggle('active', isMale);
    }

    if (this.callerName) {
      this.callerName.textContent = isMale ? "AI EL" : "AI NOVA";
    }

    if (this.avatarCircle) {
      this.avatarCircle.textContent = isMale ? "🧑‍💼" : "👩‍💼";
    }

    if (this.callState === 'IDLE' && this.callStatus) {
      this.callStatus.textContent = `Siap Ditelepon • Online (${isMale ? 'Suara Cowok' : 'Suara Cewek'})`;
    }

    if (this.callState === 'CONNECTED') {
      const ack = isMale 
        ? "Suara diubah ke mode Cowok! Aku El, siap nemenin kamu ngobrol dan dengerin curhatanmu."
        : "Suara diubah ke mode Cewek! Halo, aku Nova, siap mendengarkan semua ceritamu manis.";
      this.aiSpeak(ack);
    }
  }

  // Speech Recognition (Speech-to-Text)
  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn("SpeechRecognition API tidak didukung di browser ini.");
      return;
    }

    this.recognition = new SpeechRec();
    this.recognition.lang = 'id-ID';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.btnMic) {
        this.btnMic.classList.add('mic-listening');
        const label = this.btnMic.querySelector('.ctrl-label');
        if (label) label.textContent = "Mendengar";
      }
      this.captionLabel.textContent = "MENDENGARKAN SUARAMU...";
      this.captionText.textContent = "Bicaralah, AI Nova sedang menyimak curhatanmu...";
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && transcript.trim()) {
        this.handleUserCurhat(transcript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      this.stopSpeechRecognition();
    };

    this.recognition.onend = () => {
      this.stopSpeechRecognition();
    };
  }

  toggleSpeechRecognition() {
    if (this.callState !== 'CONNECTED') {
      this.startCall();
      return;
    }

    if (this.isMuted) {
      alert("Mikrofon Anda sedang di-mute. Buka mute terlebih dahulu untuk bicara.");
      return;
    }

    if (this.isListening) {
      this.stopSpeechRecognition();
    } else {
      this.startSpeechRecognition();
    }
  }

  startSpeechRecognition() {
    if (!this.recognition) {
      alert("Browser Anda belum mendukung input suara langsung. Anda bisa menggunakan kotak ketik pesan atau tombol topik di bawah!");
      return;
    }
    if (this.isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.avatarCircle.classList.remove('is-talking');
    }
    try {
      this.recognition.start();
    } catch (e) {
      console.warn(e);
    }
  }

  stopSpeechRecognition() {
    this.isListening = false;
    if (this.btnMic) {
      this.btnMic.classList.remove('mic-listening');
      const label = this.btnMic.querySelector('.ctrl-label');
      if (label) label.textContent = "Bicara";
    }
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
  }

  // Curhat Logic & Response Generation
  handleQuickTopic(topic) {
    if (this.callState !== 'CONNECTED') {
      this.startCall();
      setTimeout(() => {
        this.processTopic(topic);
      }, 3200);
      return;
    }
    this.processTopic(topic);
  }

  processTopic(topic) {
    const topicLabels = {
      capek: "Aku lagi capek banget hari ini...",
      galau: "Lagi galau asmara nih, sedih banget...",
      gombal: "Gombalin aku dong biar baper!",
      kesepian: "Lagi sepi banget, temenin ngobrol dong...",
      kuliah: "Pusing mikirin tugas dan masa depan...",
      lucu: "Ceritain hal lucu dong!"
    };

    const userText = topicLabels[topic] || "Mau curhat...";
    this.captionLabel.textContent = "KAMU (CURHAT)";
    this.captionText.textContent = `"${userText}"`;

    setTimeout(() => {
      const list = this.knowledgeBase[topic] || this.knowledgeBase.default;
      const reply = list[Math.floor(Math.random() * list.length)];
      this.aiSpeak(reply);
    }, 700);
  }

  handleTextSubmit() {
    if (!this.chatInput) return;
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.chatInput.value = "";
    if (this.callState !== 'CONNECTED') {
      this.startCall();
      setTimeout(() => {
        this.handleUserCurhat(text);
      }, 3200);
      return;
    }

    this.handleUserCurhat(text);
  }

  handleUserCurhat(userText) {
    this.captionLabel.textContent = "KAMU (CURHAT)";
    this.captionText.textContent = `"${userText}"`;

    const lower = userText.toLowerCase();

    // Intent classifier based on keywords
    let matchedCategory = 'default';

    if (lower.includes('capek') || lower.includes('lelah') || lower.includes('bos') || lower.includes('kantor') || lower.includes('kerja') || lower.includes('lembur') || lower.includes('pusing') || lower.includes('burnout')) {
      matchedCategory = 'capek';
    } else if (lower.includes('galau') || lower.includes('putus') || lower.includes('mantan') || lower.includes('ghosting') || lower.includes('selingkuh') || lower.includes('sakit hati') || lower.includes('crush') || lower.includes('cinta')) {
      matchedCategory = 'galau';
    } else if (lower.includes('gombal') || lower.includes('cantik') || lower.includes('ganteng') || lower.includes('manis') || lower.includes('sayang') || lower.includes('suka') || lower.includes('rayu') || lower.includes('jodoh')) {
      matchedCategory = 'gombal';
    } else if (lower.includes('sepi') || lower.includes('sendiri') || lower.includes('gabut') || lower.includes('temen') || lower.includes('nemenin')) {
      matchedCategory = 'kesepian';
    } else if (lower.includes('kuliah') || lower.includes('tugas') || lower.includes('skripsi') || lower.includes('sekolah') || lower.includes('ujian') || lower.includes('dosen')) {
      matchedCategory = 'kuliah';
    } else if (lower.includes('senang') || lower.includes('bahagia') || lower.includes('berhasil') || lower.includes('gajian') || lower.includes('lolos') || lower.includes('hore')) {
      matchedCategory = 'senang';
    } else if (lower.includes('halo') || lower.includes('hai') || lower.includes('kabar') || lower.includes('assalamualaikum') || lower.includes('pagi') || lower.includes('malam') || lower.includes('siang')) {
      matchedCategory = 'sapaan';
    }

    const responses = this.knowledgeBase[matchedCategory] || this.knowledgeBase.default;
    const chosenResponse = responses[Math.floor(Math.random() * responses.length)];

    // Small natural response delay
    setTimeout(() => {
      this.aiSpeak(chosenResponse);
    }, 600);
  }

  // Text-to-Speech Output
  aiSpeak(text) {
    if (this.callState !== 'CONNECTED') return;

    const isMale = this.voiceGender === 'male';
    const aiLabel = isMale ? "AI EL" : "AI NOVA";
    this.captionLabel.textContent = `${aiLabel} (BERBICARA)`;
    this.typewriterCaption(text);

    if (!this.isSpeakerOn || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    this.isSpeaking = false;

    // Clean emojis before speaking
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').replace(/[✨💖🥰🥺🍫😤🌟🧋🤗😲😂🤖🙈🫣🧘💕😊😉👠🔥🏆💎💪🌙🌸🎉🥳]/gu, '').trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';

    // Find Indonesian Voice matching gender
    const voices = window.speechSynthesis.getVoices();
    const idVoices = voices.filter(v => v.lang && (v.lang.includes('id') || v.lang.includes('ID') || v.lang.startsWith('id')));

    if (isMale) {
      // Find Indonesian male voice (Ardi, Andika, Male, Pria, etc.)
      const maleVoice = idVoices.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('ardi') || n.includes('andika') || n.includes('male') || n.includes('pria') || n.includes('bimo') || n.includes('david');
      });
      if (maleVoice) {
        utterance.voice = maleVoice;
      } else if (idVoices.length > 0) {
        utterance.voice = idVoices[0];
      }
      // Low pitch produces deep, warm, masculine guy voice
      utterance.pitch = 0.76;
      utterance.rate = 0.95;
    } else {
      // Female voice
      const femaleVoice = idVoices.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('gadis') || n.includes('female') || n.includes('wanita') || n.includes('siti') || n.includes('zira');
      });
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else if (idVoices.length > 0) {
        utterance.voice = idVoices[0];
      }
      utterance.pitch = 1.08;
      utterance.rate = 1.02;
    }

    this.isSpeaking = true;
    this.currentUtterance = utterance;
    this.avatarCircle.classList.add('is-talking');

    const finishSpeaking = () => {
      if (this.speechSafetyTimer) clearTimeout(this.speechSafetyTimer);
      this.isSpeaking = false;
      this.speechFinishedTime = Date.now();
      this.avatarCircle.classList.remove('is-talking');
      if (this.callState === 'CONNECTED') {
        this.captionLabel.textContent = `${aiLabel} (MENYIMAK)`;
      }
    };

    if (this.speechSafetyTimer) clearTimeout(this.speechSafetyTimer);
    this.speechSafetyTimer = setTimeout(finishSpeaking, 14000);

    utterance.onend = finishSpeaking;
    utterance.onerror = finishSpeaking;

    window.speechSynthesis.speak(utterance);
  }

  typewriterCaption(text) {
    this.captionText.textContent = "";
    let i = 0;
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    this.typewriterTimer = setInterval(() => {
      if (i < text.length) {
        this.captionText.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(this.typewriterTimer);
      }
    }, 18);
  }

  // Animated Soundwave Canvas
  startVisualizer() {
    if (!this.soundwaveCanvas || !this.ctx) return;

    const canvas = this.soundwaveCanvas;
    const ctx = this.ctx;

    let step = 0;

    const render = () => {
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Wave amplitude varies based on speech state
      let amp = 3;
      let color = 'rgba(0, 240, 255, 0.4)';

      if (this.isSpeaking) {
        amp = 16 + Math.sin(step * 0.2) * 8;
        color = '#ff007f';
      } else if (this.isListening) {
        amp = 14 + Math.cos(step * 0.25) * 6;
        color = '#ef4444';
      } else if (this.callState === 'DIALING') {
        amp = 8 + Math.sin(step * 0.1) * 4;
        color = '#f59e0b';
      } else if (this.callState === 'CONNECTED') {
        amp = 5;
        color = '#10b981';
      }

      // Draw dual sinusoidal wave
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = color;
      ctx.beginPath();

      const midY = h / 2;
      for (let x = 0; x < w; x++) {
        const y = midY + Math.sin((x * 0.04) + step) * amp * Math.sin(x / w * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Second harmonic wave
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = this.isSpeaking ? 'rgba(0, 240, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = midY + Math.cos((x * 0.05) - step * 1.2) * (amp * 0.6) * Math.sin(x / w * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += 0.08;
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.aiCall = new AICallCompanion();
});
