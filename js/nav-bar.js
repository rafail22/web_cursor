// Universal floating navigation dock for switching between all 11 experiences + Hub

(function() {
  function initNav() {
    const currentPath = window.location.pathname;
    
    // Determine active page
    let activePage = 'hub';
    if (currentPath.includes('terminal.html')) activePage = 'terminal';
    else if (currentPath.includes('button-game.html')) activePage = 'button';
    else if (currentPath.includes('payday-survival.html')) activePage = 'payday';
    else if (currentPath.includes('cyberpunk-portfolio.html')) activePage = 'cyberpunk';
    else if (currentPath.includes('password-game.html')) activePage = 'password';
    else if (currentPath.includes('maze-game.html')) activePage = 'maze';
    else if (currentPath.includes('quiz-game.html')) activePage = 'quiz';
    else if (currentPath.includes('unsubscribe-game.html')) activePage = 'unsubscribe';
    else if (currentPath.includes('flappy-game.html')) activePage = 'flappy';
    else if (currentPath.includes('cowboy-game.html')) activePage = 'cowboy';
    else if (currentPath.includes('parking-game.html')) activePage = 'parking';
    
    const dock = document.createElement('nav');
    dock.className = 'showcase-dock';
    dock.setAttribute('aria-label', 'Experience switcher');
    
    const pages = [
      { id: 'hub', label: 'Menu Utama', icon: '🏠', url: 'index.html', theme: '' },
      { id: 'button', label: 'Tombol Jahil', icon: '🎯', url: 'button-game.html', theme: 'button-theme' },
      { id: 'payday', label: 'Bertahan Gajian', icon: '💸', url: 'payday-survival.html', theme: 'payday-theme' },
      { id: 'password', label: 'Password Mustahil', icon: '📝', url: 'password-game.html', theme: 'button-theme' },
      { id: 'maze', label: 'Labirin Senggol', icon: '🌀', url: 'maze-game.html', theme: 'payday-theme' },
      { id: 'quiz', label: 'Kuis Jebakan', icon: '🧠', url: 'quiz-game.html', theme: 'terminal-theme' },
      { id: 'unsubscribe', label: 'Batalin Langganan', icon: '🏢', url: 'unsubscribe-game.html', theme: 'cyberpunk-theme' },
      { id: 'flappy', label: 'Flappy Kebalik', icon: '🕊️', url: 'flappy-game.html', theme: 'button-theme' },
      { id: 'cowboy', label: 'Refleks Koboi', icon: '🤠', url: 'cowboy-game.html', theme: 'payday-theme' },
      { id: 'parking', label: 'Parkir Mustahil', icon: '🚗', url: 'parking-game.html', theme: 'button-theme' },
      { id: 'terminal', label: 'Terminal OS', icon: '💻', url: 'terminal.html', theme: 'terminal-theme' },
      { id: 'cyberpunk', label: 'Portofolio Cyber', icon: '⚡', url: 'cyberpunk-portfolio.html', theme: 'cyberpunk-theme' }
    ];
    
    dock.innerHTML = `
      <div class="dock-scroll-wrapper">
        ${pages.map(p => `
          <a href="${p.url}" 
             class="dock-item ${p.id === activePage ? `active ${p.theme}` : ''}" 
             title="${p.label}"
             data-page="${p.id}">
            <span class="icon">${p.icon}</span>
            <span class="text">${p.label}</span>
          </a>
        `).join('')}
      </div>
      <div class="dock-divider"></div>
      <button class="dock-sound-btn" id="dockSoundToggle" title="Nyalakan / Matikan Suara">
        🔊
      </button>
    `;
    
    document.body.appendChild(dock);
    
    // Sound toggle handler
    const soundBtn = document.getElementById('dockSoundToggle');
    if (soundBtn && window.soundFX) {
      soundBtn.addEventListener('click', () => {
        const isMuted = window.soundFX.toggleMute();
        soundBtn.textContent = isMuted ? '🔇' : '🔊';
        soundBtn.classList.toggle('muted', isMuted);
      });
    }

    // Hover audio feedback
    dock.querySelectorAll('.dock-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        if (window.soundFX && !item.classList.contains('active')) {
          window.soundFX.playKeyClack();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
