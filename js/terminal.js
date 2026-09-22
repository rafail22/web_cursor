// Retro Terminal OS CLI Engine - Bahasa Indonesia

const ASCII_BANNER = `
  ██████╗ ███████╗████████╗██████╗  ██████╗        ██████╗ ███████╗
  ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗      ██╔═══██╗██╔════╝
  ██████╔╝█████╗     ██║   ██████╔╝██║   ██║█████╗██║   ██║███████╗
  ██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║╚════╝██║   ██║╚════██║
  ██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝      ╚██████╔╝███████║
  ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝        ╚═════╝ ╚══════╝
        [ SISTEM OPERASI RETRO v3.11 - AKSES PENUH DIAKTIFKAN ]
`;

const COMMANDS = {
  help: `
DAFTAR PERINTAH YANG DAPAT DIJALANKAN:
------------------------------------------------------------------------
  help            - Menampilkan panduan daftar perintah ini
  cat bio.txt     - Membaca berkas identitas & riwayat operator hacker
  projects        - Melihat daftar proyek siber & eksperimen teknologi
  matrix          - Menjalankan hujan kode digital Matrix (Tekan ESC untuk keluar)
  theme <warna>   - Mengganti palet warna fosfor: 'green' atau 'amber'
  scanlines       - Mengaktifkan / mematikan garis scanline tabung CRT
  clear           - Membersihkan layar konsol terminal
  date            - Menampilkan waktu dan tanggal sinkronisasi saat ini
  whoami          - Menampilkan data kredensial akun aktif
  sudo <perintah> - Meminta izin akses administrator root
  reboot          - Memulai ulang sistem Retro Terminal OS dari awal
  nav             - Pindah ke modul lain (button, payday, portfolio, hub)
------------------------------------------------------------------------
`,

  'cat bio.txt': `
=== BERKAS OPERATOR SIBER // RAHASIA TINGKAT TINGGI ===
[IDENTITAS]     : AGEN_SIBER_RECON // UNIT 734
[AFILIASI]      : SINDIKAT INDEPENDEN CYBERNET
[SPESIALISASI]  : REVERSE ENGINEERING, SHADER GLSL, EKSPLOITASI WEB
[PERANGKAT RIG] : PROSESOR DUAL-CORE NEUROMORFIK, MONITOR TABUNG CRT 90-AN
[STATUS SISTEM] : OVERCLOCK MAKSIMAL & SIAP TEMPUR
[CATATAN MISI]  : "Membangun sistem web interaktif yang mustahil di era digital."
`,

  projects: `
=== ARSIP PROYEK & EKSPERIMEN SIBER ===
[01] THE UNCLICKABLE BUTTON  -> Tombol jahil dengan matriks penghindar kursor
     Status: AKTIF (Ketik 'nav button' untuk membuka)

[02] BERTAHAN GAJIAN         -> Simulator finansial bertahan hidup 30 hari
     Status: AKTIF (Ketik 'nav payday' untuk membuka)

[03] PORTOFOLIO CYBERPUNK    -> Arsip streetwear brutalist & pemutar audio lofi
     Status: AKTIF (Ketik 'nav portfolio' untuk membuka)

[04] MATRIX DIGITAL RAIN     -> Visualisasi aliran data kriptografi real-time
     Status: TERPASANG (Ketik 'matrix' untuk menjalankan)
`
};

class TerminalOS {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.container = document.getElementById('terminalHistory');
    this.input = document.getElementById('terminalInput');
    this.cursor = document.getElementById('terminalCursor');
    this.crtContainer = document.getElementById('crtContainer');
    this.matrixCanvas = document.getElementById('matrixCanvas');
    this.matrixExitHint = document.getElementById('matrixExitHint');
    this.matrixAnimation = null;
    
    this.initClock();
    this.initBattery();
    this.initEventListeners();
    this.printWelcome();
  }

  initClock() {
    const clockEl = document.getElementById('osClock');
    const update = () => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      if (clockEl) clockEl.textContent = `WAKTU: ${timeStr}`;
    };
    update();
    setInterval(update, 1000);
  }

  async initBattery() {
    const batEl = document.getElementById('osBattery');
    if (!batEl) return;
    
    if (navigator.getBattery) {
      try {
        const battery = await navigator.getBattery();
        const updateBat = () => {
          const level = Math.round(battery.level * 100);
          batEl.textContent = `BATERAI: [${'█'.repeat(Math.floor(level / 12))}${'░'.repeat(8 - Math.floor(level / 12))}] ${level}%`;
        };
        updateBat();
        battery.addEventListener('levelchange', updateBat);
        return;
      } catch (e) {}
    }
    batEl.textContent = 'BATERAI: [███████░] 94%';
  }

  initEventListeners() {
    const termMain = document.getElementById('terminalMain');
    if (termMain) {
      termMain.addEventListener('click', () => {
        this.input.focus();
      });
    }

    this.input.addEventListener('keydown', (e) => {
      if (window.soundFX) window.soundFX.playKeyClack();

      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        this.executeCommand(cmd);
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
        }
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autoComplete();
      }
    });

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    const scanBtn = document.getElementById('scanToggleBtn');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        const scanOverlay = document.querySelector('.crt-scanlines');
        if (scanOverlay) {
          scanOverlay.style.display = scanOverlay.style.display === 'none' ? 'block' : 'none';
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'q') {
        this.stopMatrix();
      }
    });

    if (this.matrixCanvas) {
      this.matrixCanvas.addEventListener('click', () => this.stopMatrix());
    }
  }

  printWelcome() {
    this.println(ASCII_BANNER, 'system ascii-banner');
    this.println("SISTEM RETRO-OS DIAKTIFKAN. VERSI 3.11. PENGECEKAN MEMORI BIOS: 640K OK.");
    this.println("Ketik 'help' untuk melihat perintah atau 'matrix' untuk efek hujan kode digital.\n");
    if (window.soundFX) window.soundFX.playTerminalBeep(true);
  }

  println(text, className = 'system') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    this.container.appendChild(line);
    this.scrollToBottom();
  }

  scrollToBottom() {
    const termMain = document.getElementById('terminalMain');
    if (termMain) {
      termMain.scrollTop = termMain.scrollHeight;
    }
  }

  autoComplete() {
    const val = this.input.value.toLowerCase().trim();
    if (!val) return;
    const known = ['help', 'cat bio.txt', 'projects', 'clear', 'matrix', 'theme green', 'theme amber', 'scanlines', 'date', 'whoami', 'sudo', 'reboot', 'nav'];
    const match = known.find(k => k.startsWith(val));
    if (match) {
      this.input.value = match;
    }
  }

  toggleTheme(forcedTheme) {
    if (forcedTheme) {
      if (forcedTheme === 'amber') {
        document.body.classList.add('theme-amber');
      } else {
        document.body.classList.remove('theme-amber');
      }
    } else {
      document.body.classList.toggle('theme-amber');
    }
    const isAmber = document.body.classList.contains('theme-amber');
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.textContent = isAmber ? '[WARNA: AMBER]' : '[WARNA: HIJAU]';
    }
  }

  executeCommand(rawCmd) {
    const cmd = rawCmd.trim();
    this.println(`tamu@cybernet:~$ ${cmd}`, 'amber');

    if (!cmd) return;

    const lower = cmd.toLowerCase();

    if (COMMANDS[lower]) {
      this.println(COMMANDS[lower], 'output');
      if (window.soundFX) window.soundFX.playTerminalBeep();
      return;
    }

    if (lower === 'clear') {
      this.container.innerHTML = '';
      return;
    }

    if (lower === 'date') {
      this.println(`WAKTU SISTEM: ${new Date().toLocaleString('id-ID')} (TERSINKRONISASI)`, 'output');
      return;
    }

    if (lower === 'whoami') {
      this.println("PENGGUNA: root@cyberdeck-9000 [TINGKAT KEAMANAN 5 - AKSES ROOT PENUH]", 'output');
      return;
    }

    if (lower.startsWith('sudo')) {
      this.println("AKSES DITOLAK: Insiden ini akan dilaporkan ke Komando Keamanan Siber.", 'error');
      if (window.soundFX) window.soundFX.playExpenseBuzz();
      return;
    }

    if (lower === 'scanlines') {
      const scanOverlay = document.querySelector('.crt-scanlines');
      if (scanOverlay) {
        const isHidden = scanOverlay.style.display === 'none';
        scanOverlay.style.display = isHidden ? 'block' : 'none';
        this.println(`Garis Scanline CRT: ${isHidden ? 'DIAKTIFKAN' : 'DIMATIKAN'}`, 'output');
      }
      return;
    }

    if (lower === 'theme green') {
      this.toggleTheme('green');
      this.println("Warna layar fosfor dialihkan ke P1 HIJAU (525nm).", 'output');
      return;
    }

    if (lower === 'theme amber') {
      this.toggleTheme('amber');
      this.println("Warna layar fosfor dialihkan ke P3 AMBER (600nm).", 'output');
      return;
    }

    if (lower === 'matrix') {
      this.println("Menjalankan simulasi hujan digital... Tekan ESC atau klik layar untuk keluar.", 'output');
      this.startMatrix();
      return;
    }

    if (lower === 'reboot') {
      this.container.innerHTML = '';
      this.println("MEMULAI ULANG KERNEL CYBERNET OS...", 'system');
      setTimeout(() => {
        this.printWelcome();
      }, 700);
      return;
    }

    if (lower.startsWith('nav')) {
      const parts = lower.split(' ');
      const target = parts[1];
      if (target === 'button' || target === 'tombol') {
        this.println("Mengalihkan ke Tombol Jahil...", 'output');
        setTimeout(() => window.location.href = 'button-game.html', 500);
      } else if (target === 'payday' || target === 'gajian') {
        this.println("Mengalihkan ke Bertahan Gajian...", 'output');
        setTimeout(() => window.location.href = 'payday-survival.html', 500);
      } else if (target === 'portfolio' || target === 'portofolio') {
        this.println("Mengalihkan ke Portofolio Cyberpunk...", 'output');
        setTimeout(() => window.location.href = 'cyberpunk-portfolio.html', 500);
      } else if (target === 'hub' || target === 'menu') {
        this.println("Mengalihkan ke Menu Utama...", 'output');
        setTimeout(() => window.location.href = 'index.html', 500);
      } else {
        this.println("Tujuan nav yang tersedia: 'nav tombol', 'nav gajian', 'nav portofolio', 'nav menu'", 'error');
      }
      return;
    }

    // Unknown command
    this.println(`Perintah tidak ditemukan: "${cmd}". Ketik 'help' untuk panduan perintah.`, 'error');
    if (window.soundFX) window.soundFX.playExpenseBuzz();
  }

  startMatrix() {
    if (!this.matrixCanvas) return;
    this.matrixCanvas.style.display = 'block';
    this.matrixExitHint.style.display = 'block';

    const canvas = this.matrixCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const isAmber = document.body.classList.contains('theme-amber');
    const headColor = '#ffffff';
    const rainColor = isAmber ? '#ffb000' : '#39ff14';

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'VT323', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillStyle = Math.random() > 0.9 ? headColor : rainColor;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      this.matrixAnimation = requestAnimationFrame(draw);
    };

    draw();
  }

  stopMatrix() {
    if (this.matrixAnimation) {
      cancelAnimationFrame(this.matrixAnimation);
      this.matrixAnimation = null;
    }
    if (this.matrixCanvas) {
      this.matrixCanvas.style.display = 'none';
      this.matrixExitHint.style.display = 'none';
    }
    this.input.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.terminalOS = new TerminalOS();
});
