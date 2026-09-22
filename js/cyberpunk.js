// Cyberpunk Brutalist Portfolio Engine

class CyberpunkPortfolio {
  constructor() {
    this.dot = document.getElementById('cursorDot');
    this.ring = document.getElementById('cursorRing');
    this.musicPlayBtn = document.getElementById('musicPlayBtn');
    this.vizCanvas = document.getElementById('visualizerCanvas');
    this.glitchCanvas = document.getElementById('glitchCanvas');
    
    this.isPlaying = false;
    this.vizCtx = this.vizCanvas ? this.vizCanvas.getContext('2d') : null;
    this.vizBars = new Array(32).fill(10);
    this.vizAnimation = null;

    this.cursorX = window.innerWidth / 2;
    this.cursorY = window.innerHeight / 2;
    this.targetX = this.cursorX;
    this.targetY = this.cursorY;

    this.initCursor();
    this.initGlitchPhoto();
    this.initMusicPlayer();
    this.initHardwareToggles();
    this.initContactTags();
  }

  // 1. Custom Minimalist Cyberpunk Cursor
  initCursor() {
    if (!this.dot || !this.ring) return;

    window.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
      this.dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    const renderCursor = () => {
      // Smooth lerp for outer ring
      this.cursorX += (this.targetX - this.cursorX) * 0.22;
      this.cursorY += (this.targetY - this.cursorY) * 0.22;
      this.ring.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Hover magnification for interactive elements
    const hoverTargets = document.querySelectorAll('button, a, .cyber-tag, .bento-card, .cyber-switch');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => this.ring.classList.add('active-hover'));
      el.addEventListener('mouseleave', () => this.ring.classList.remove('active-hover'));
    });
  }

  // 2. Distorted Glitch Photo Canvas
  initGlitchPhoto() {
    if (!this.glitchCanvas) return;
    const ctx = this.glitchCanvas.getContext('2d');
    const w = (this.glitchCanvas.width = 480);
    const h = (this.glitchCanvas.height = 600);

    // Draw procedural cyberpunk portrait silhouette
    const drawBase = () => {
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, w, h);

      // Cyber geometric grid
      ctx.strokeStyle = 'rgba(204, 255, 0, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let j = 0; j < h; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();
      }

      // Cyberpunk stylized mask / helmet silhouette
      ctx.fillStyle = '#161922';
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h * 0.35);
      ctx.lineTo(w * 0.75, h * 0.35);
      ctx.lineTo(w * 0.65, h * 0.75);
      ctx.lineTo(w * 0.35, h * 0.75);
      ctx.closePath();
      ctx.fill();

      // Glowing Neon Visor
      ctx.fillStyle = '#ccff00';
      ctx.shadowColor = '#ccff00';
      ctx.shadowBlur = 15;
      ctx.fillRect(w * 0.28, h * 0.44, w * 0.44, 28);
      ctx.shadowBlur = 0;

      // Tech details
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(w * 0.32, h * 0.52, w * 0.15, 6);
      ctx.fillRect(w * 0.53, h * 0.52, w * 0.15, 6);

      // Noise grain
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() > 0.94) {
          const noise = Math.random() * 40;
          data[i] += noise;
          data[i+1] += noise;
          data[i+2] += noise;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    };

    drawBase();

    // Glitch animation on hover
    let glitching = false;
    const triggerGlitch = () => {
      drawBase();
      // Slice & displace random horizontal bars
      for (let i = 0; i < 6; i++) {
        const sliceY = Math.random() * h;
        const sliceH = 10 + Math.random() * 30;
        const sliceW = w;
        const offset = (Math.random() - 0.5) * 40;

        try {
          const sliceData = ctx.getImageData(0, sliceY, sliceW, sliceH);
          ctx.putImageData(sliceData, offset, sliceY);
        } catch (e) {}

        // Cyan / Magenta chromatic aberration stripe
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 0, 100, 0.4)';
        ctx.fillRect(0, sliceY, w, 4);
      }
    };

    this.glitchCanvas.parentElement.addEventListener('mouseenter', () => {
      glitching = true;
      const interval = setInterval(() => {
        if (!glitching) {
          clearInterval(interval);
          drawBase();
        } else {
          triggerGlitch();
        }
      }, 120);
    });

    this.glitchCanvas.parentElement.addEventListener('mouseleave', () => {
      glitching = false;
      drawBase();
    });
  }

  // 3. Live Music Player & Animated Audio Visualizer
  initMusicPlayer() {
    if (!this.musicPlayBtn || !this.vizCanvas) return;

    this.vizCanvas.width = this.vizCanvas.parentElement.clientWidth || 300;
    this.vizCanvas.height = 60;

    const drawViz = () => {
      this.vizCtx.clearRect(0, 0, this.vizCanvas.width, this.vizCanvas.height);
      const barWidth = (this.vizCanvas.width / this.vizBars.length) - 2;

      for (let i = 0; i < this.vizBars.length; i++) {
        if (this.isPlaying) {
          // Dynamic bouncing levels
          this.vizBars[i] += (Math.random() * 50 - this.vizBars[i]) * 0.3;
        } else {
          // Idle low bars
          this.vizBars[i] += (4 - this.vizBars[i]) * 0.1;
        }

        const h = Math.max(3, this.vizBars[i]);
        const x = i * (barWidth + 2);
        const y = this.vizCanvas.height - h;

        this.vizCtx.fillStyle = i % 2 === 0 ? '#ccff00' : '#00f0ff';
        this.vizCtx.fillRect(x, y, barWidth, h);
      }

      this.vizAnimation = requestAnimationFrame(drawViz);
    };
    drawViz();

    this.musicPlayBtn.addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      this.musicPlayBtn.textContent = this.isPlaying ? '❚❚' : '▶';

      if (window.soundFX) {
        if (this.isPlaying) {
          window.soundFX.startCyberpunkBeat((step) => {
            // Kick visualizer peak on beat
            this.vizBars[step * 4] = 55;
            this.vizBars[(step * 4 + 1) % this.vizBars.length] = 45;
          });
        } else {
          window.soundFX.stopCyberpunkBeat();
        }
      }
    });
  }

  // 4. Hardware-Style Interactive Toggles
  initHardwareToggles() {
    const overdriveToggle = document.getElementById('toggleOverdrive');
    const wireframeToggle = document.getElementById('toggleWireframe');
    const glitchToggle = document.getElementById('toggleGlitch');

    if (overdriveToggle) {
      overdriveToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('overdrive-mode', e.target.checked);
        if (window.soundFX) window.soundFX.playKeyClack();
      });
    }

    if (wireframeToggle) {
      wireframeToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('wireframe-mode', e.target.checked);
        if (window.soundFX) window.soundFX.playKeyClack();
      });
    }

    if (glitchToggle) {
      glitchToggle.addEventListener('change', (e) => {
        if (window.soundFX) window.soundFX.playKeyClack();
        const heroTitle = document.querySelector('.hero-headline');
        if (heroTitle) {
          if (e.target.checked) {
            heroTitle.style.textShadow = '3px 0 #ccff00, -3px 0 #0055ff';
          } else {
            heroTitle.style.textShadow = 'none';
          }
        }
      });
    }
  }

  // 5. Quick Contact & Drop Tags
  initContactTags() {
    const tags = document.querySelectorAll('.cyber-tag');
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        const text = tag.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          const original = tag.textContent;
          tag.textContent = 'BERHASIL DISALIN! ✓';
          if (window.soundFX) window.soundFX.playTerminalBeep(true);
          setTimeout(() => {
            tag.textContent = original;
          }, 1500);
        }).catch(() => {});
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cyberPortfolio = new CyberpunkPortfolio();
});
