// Survive Your Paycheck - Engine Simulator Finansial Bahasa Indonesia

const SCENARIOS = [
  {
    day: 1,
    emoji: "🚀",
    title: "FOMO Koin Kripto Temen Kuliah",
    desc: "Temen lu nge-chat heboh: 'Bro, buruan all-in di koin $PEPEDOGE sekarang! Dijamin to the moon!'",
    acceptCost: 2500000,
    acceptHappiness: -15,
    acceptCoffee: 10,
    acceptResult: "Lu beli di pucuk. 10 menit kemudian langsung anjlok 80%.",
    declineHappiness: 5,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Lu tahan godaan. Dua hari kemudian koinnya kena rugpull."
  },
  {
    day: 2,
    emoji: "🍵",
    title: "Es Kopi Susu Gula Aren Jam 9 Pagi",
    desc: "Baru jam 9:15 bos udah ngirim email pedes. Cuma es kopi susu creamy yang bisa nyelametin kewarasan lu.",
    acceptCost: 35000,
    acceptHappiness: 15,
    acceptCoffee: 20,
    acceptResult: "Kenikmatan hakiki. Serotonin kembali terisi penuh.",
    declineHappiness: -10,
    declineCost: 0,
    declineCoffee: -10,
    declineResult: "Minum air dispenser kantor sambil merenungi nasib."
  },
  {
    day: 3,
    emoji: "🎮",
    title: "Steam Mega Sale Khilaf",
    desc: "Paket diskon 85% berisi 20 game indie. Di library lu udah ada 140 game yang belom pernah di-install.",
    acceptCost: 450000,
    acceptHappiness: 20,
    acceptCoffee: 5,
    acceptResult: "Download semua 20 game. Dimainin cuma 5 menit trus balik scroll medsos.",
    declineHappiness: -5,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Uang selamat, tapi jiwa gamer lu menangis dalam sunyi."
  },
  {
    day: 4,
    emoji: "🏋️",
    title: "Auto-Debit Tempat Gym Hantu",
    desc: "Muncul notifikasi tagihan dari tempat gym yang terakhir kali lu datengin pas tahun 2023.",
    acceptCost: 550000,
    acceptHappiness: -15,
    acceptCoffee: 5,
    acceptResult: "Kepotong juga... lu membatin: 'Senin depan gue pasti mulai rajin gym.'",
    declineHappiness: 10,
    declineCost: 0,
    declineCoffee: 10,
    declineResult: "Berantem 45 menit sama CS, tapi berhasil batalkan langganan!"
  },
  {
    day: 5,
    emoji: "🐱",
    title: "Patungan Ultah Kucing Temen Kantor",
    desc: "HR ngirim form patungan beli kue salmon organik dan kostum dasi kupu-kupu buat si Meng.",
    acceptCost: 100000,
    acceptHappiness: 10,
    acceptCoffee: 0,
    acceptResult: "Kucingnya gak peduli, tapi lu dapet foto lucu di grup chat.",
    declineHappiness: -15,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Lu nolak. Sekantor langsung mandang lu kayak penjahat berhati dingin."
  },
  {
    day: 6,
    emoji: "🦷",
    title: "Gigi Bungsu Mendadak Ngamuk",
    desc: "Lagi enak makan bakso urat, tiba-tiba gigi geraham ngilu menusuk ke otak. Dokter gigi udah siap operasi.",
    acceptCost: 2200000,
    acceptHappiness: -20,
    acceptCoffee: 15,
    acceptResult: "Sakit hilang, dompet kritis. Diet bubur saring selama 48 jam.",
    declineHappiness: -45,
    declineCost: 100000,
    declineCoffee: 30,
    declineResult: "Beli obat pereda nyeri warung. Pipi bengkak sebelah kayak tupai."
  },
  {
    day: 7,
    emoji: "🥑",
    title: "Brunch Roti Sourdough & Alpukat",
    desc: "Hari Minggu wajib nongkrong estetik pesen poached egg pake taburan garam Himalaya pink.",
    acceptCost: 180000,
    acceptHappiness: 25,
    acceptCoffee: 15,
    acceptResult: "Gaya hidup mewah tercapai. Feed Instagram makin kece badai.",
    declineHappiness: -10,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Makan biskuit kering sisa kemarin di kamar kos."
  },
  {
    day: 8,
    emoji: "⌨️",
    title: "Group Buy Mechanical Keyboard",
    desc: "Case aluminium CNC, switch lubed Holy Panda. Pengiriman dijadwalkan 'Q4 2027'. Mau checkout?",
    acceptCost: 1800000,
    acceptHappiness: 30,
    acceptCoffee: 5,
    acceptResult: "Suara 'thock'-nya begitu syahdu sampai menyembuhkan stres lu.",
    declineHappiness: -10,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Lanjut ngetik di keyboard kantor yang tombol spasinya macet."
  },
  {
    day: 9,
    emoji: "🌮",
    title: "Delivery Makanan Jam 12 Malem",
    desc: "Niatnya mau diet malam. Tapi martabak manis keju susu manggil-manggil dari aplikasi online.",
    acceptCost: 85000,
    acceptHappiness: 20,
    acceptCoffee: -10,
    acceptResult: "Santap malam penuh lemak dan gula. Langsung kenyang bego trus tidur.",
    declineHappiness: -15,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Minum air putih anget dua gelas sambil menatap langit-langit kamar."
  },
  {
    day: 10,
    emoji: "🚗",
    title: "Lampu Check Engine Nyala",
    desc: "Di dashboard kendaraan muncul indikator keran oranye misterius. Montir bengkel mulai mengelus jenggot.",
    acceptCost: 950000,
    acceptHappiness: -15,
    acceptCoffee: 10,
    acceptResult: "Ganti sensor elektronik mahal. Lampu mati, kantong kempes.",
    declineHappiness: -30,
    declineCost: 0,
    declineCoffee: 20,
    declineResult: "Ditutup lakban hitam di speedometer. Kalau gak keliatan berarti gak rusak!"
  },
  {
    day: 11,
    emoji: "💼",
    title: "Proyek Freelance Kilat Dadakan!",
    desc: "Klien lama butuh revisi tampilan web semaleman. Bayaran langsung transfer Rp 2.500.000 tunai!",
    acceptCost: -2500000, // Dapet duit!
    acceptHappiness: -20,
    acceptCoffee: 35,
    acceptResult: "Begadang suntuk semaleman. Rekening gemuk, kantung mata menghitam!",
    declineHappiness: 15,
    declineCost: 0,
    declineCoffee: -10,
    declineResult: "Lu memilih tidur nyenyak 8 jam. Kesehatan mental terjaga."
  },
  {
    day: 12,
    emoji: "👟",
    title: "Raffle Sepatu Sneaker Langka",
    desc: "Menang undian sepatu techwear glow-in-the-dark! Harga jual kembali (resell) dijamin melambung.",
    acceptCost: 1700000,
    acceptHappiness: 35,
    acceptCoffee: 5,
    acceptResult: "Gaya lu kayak karakter anime masa depan. Drip maksimal!",
    declineHappiness: -20,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Lu lewatin. Seminggu kemudian harganya digoreng jadi Rp 5.000.000."
  },
  {
    day: 13,
    emoji: "🎟️",
    title: "Tiket Festival Musik Bareng Circle",
    desc: "Semua temen lu udah beli tiket festival musik 3 hari. Lu ditagih kepastian sekarang juga.",
    acceptCost: 1500000,
    acceptHappiness: 40,
    acceptCoffee: 25,
    acceptResult: "Bass menggelegar di dada. Momen nongkrong legendaris seumur hidup.",
    declineHappiness: -30,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Malam Minggu sendirian nonton 60 Instagram story temen di venue."
  },
  {
    day: 14,
    emoji: "📦",
    title: "Keracunan Air Fryer TikTok",
    desc: "Algoritma medsos bikin lu yakin tanpa air fryer hidup lu belom lengkap seutuhnya.",
    acceptCost: 650000,
    acceptHappiness: 20,
    acceptCoffee: 0,
    acceptResult: "Semua makanan sekarang lu goreng pake angin dalam 7 menit.",
    declineHappiness: 0,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Wajan penggorengan legend peninggalan ibu masih setia melayani."
  },
  {
    day: 15,
    emoji: "💰",
    title: "Rezeki Nomplok Tengah Bulan!",
    desc: "Klaim reimbursement kantor yang lu ajukan 2 bulan lalu akhirnya cair Rp 1.500.000!",
    acceptCost: -1500000, // Dapet duit!
    acceptHappiness: 25,
    acceptCoffee: 10,
    acceptResult: "Bonus cair! Udah setengah bulan jalan dan lu masih bertahan hidup!",
    declineHappiness: 5,
    declineCost: -1500000,
    declineCoffee: 0,
    declineResult: "Rezeki nomplok langsung disikat tanpa banyak tanya."
  },
  {
    day: 16,
    emoji: "🧋",
    title: "Ngantuk Berat 15:30: Boba Gula Aren",
    desc: "Jam rawan ngantuk di kantor. Mata sepet, otak nge-hang. Boba kenyal manis melambai-lambai.",
    acceptCost: 38000,
    acceptHappiness: 15,
    acceptCoffee: 20,
    acceptResult: "Gula dan karbohidrat mengalir ke pembuluh darah. Melek sampai jam 5 sore.",
    declineHappiness: -10,
    declineCost: 0,
    declineCoffee: -15,
    declineResult: "Ketiduran pas rapat koordinasi online."
  },
  {
    day: 17,
    emoji: "⚡",
    title: "Tagihan Listrik AC Non-Stop",
    desc: "Hawa panas bikin AC nyala 24 jam nonstop suhu 16 derajat. Tagihan PLN dateng tanpa ampun.",
    acceptCost: 1100000,
    acceptHappiness: -15,
    acceptCoffee: 5,
    acceptResult: "Dibayar lunas. Kamar tetap sedingin kutub utara.",
    declineHappiness: -35,
    declineCost: 150000,
    declineCoffee: 10,
    declineResult: "Tidur mandi keringat ditemenin kipas angin yang bunyinya kayak helikopter."
  },
  {
    day: 18,
    emoji: "📱",
    title: "HP Jatuh & Layar Retak Seribu",
    desc: "Jatoh dari kasur setinggi 30 cm, layarnya langsung jadi mozaik retak abstrak. Servis sekarang?",
    acceptCost: 900000,
    acceptHappiness: -10,
    acceptCoffee: 10,
    acceptResult: "Layar mulus kembali. Gak ada lagi serpihan kaca nancep di jempol.",
    declineHappiness: -25,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Mata juling ngeliat layar retak, tapi ngeles: 'Ini seni jalanan.'"
  },
  {
    day: 19,
    emoji: "🍣",
    title: "All-You-Can-Eat Sushi Bareng Kolega",
    desc: "Rayain keberhasilan project launching. Meja penuh piring salmon roll dan gyoza bertumpuk.",
    acceptCost: 320000,
    acceptHappiness: 25,
    acceptCoffee: -5,
    acceptResult: "Makan 42 piring sushi. Harus longgarin kancing celana. Sangat sepadan.",
    declineHappiness: -15,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Makan mie instan rebus kuah dobel telur di pojokan kos."
  },
  {
    day: 20,
    emoji: "🎧",
    title: "Headphone Noise Cancelling",
    desc: "Tetangga sebelah rumah mulai renovasi dan hobi ngebor tembok jam 7 pagi. Butuh peredam darurat!",
    acceptCost: 1350000,
    acceptHappiness: 30,
    acceptCoffee: -5,
    acceptResult: "Hening total. Lu bisa denger detak jantung lu sendiri dalam resolusi 4K.",
    declineHappiness: -30,
    declineCost: 0,
    declineCoffee: 25,
    declineResult: "Terpaksa menghafal pola ketukan palu tetangga di luar kepala."
  },
  {
    day: 21,
    emoji: "🎁",
    title: "Kado Ulang Tahun Ibu Tercinta",
    desc: "Ibu bilang: 'Gausah beliin apa-apa nak, uangnya ditabung aja' (PERINGATAN: INI JEBAKAN MAUT).",
    acceptCost: 750000,
    acceptHappiness: 30,
    acceptCoffee: 0,
    acceptResult: "Kirim buket bunga & perhiasan cantik. Ibu nangis terharu bahagia.",
    declineHappiness: -50,
    declineCost: 0,
    declineCoffee: 20,
    declineResult: "Cuma kirim stiker jempol di WhatsApp. Langsung dicoret dari kartu keluarga."
  },
  {
    day: 22,
    emoji: "☕",
    title: "Biji Kopi Specialty Single Origin",
    desc: "Catatan rasa: 'Melati, aprikot kering, dan kepedihan hidup'. Berat 250 gram dari proses anaerobik.",
    acceptCost: 190000,
    acceptHappiness: 20,
    acceptCoffee: 35,
    acceptResult: "Seduhan V60 sempurna. Lu sekarang bisa melihat dimensi ke-4.",
    declineHappiness: -5,
    declineCost: 0,
    declineCoffee: -20,
    declineResult: "Minum kopi sachet kantor yang expired 2 minggu lalu."
  },
  {
    day: 23,
    emoji: "📺",
    title: "Langganan 4 Aplikasi Streaming Numpuk",
    desc: "Netflix, Disney, Spotify, dan YouTube Premium ditarik dari rekening di hari Selasa yang sama.",
    acceptCost: 380000,
    acceptHappiness: -10,
    acceptCoffee: 0,
    acceptResult: "Dibayar juga. Paling cuma ditonton 15 menit sebelum ketiduran.",
    declineHappiness: 15,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Unsubscribe massal! Lu terbebas dari perbudakan langganan digital!"
  },
  {
    day: 24,
    emoji: "👔",
    title: "Seragam Bridesmaid / Kondangan Sepupu",
    desc: "Sepupu nikah tema 'Earthy Garden'. Wajib jahit seragam warna sage green bahan satin premium.",
    acceptCost: 850000,
    acceptHappiness: -5,
    acceptCoffee: 10,
    acceptResult: "Baju pas banget di badan. Siap rebutan bunga pengantin.",
    declineHappiness: -25,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Dateng pake baju lama yang warnanya rada beda. Disindir tante-tante."
  },
  {
    day: 25,
    emoji: "🕯️",
    title: "Lilin Aromaterapi Penghilang Stres",
    desc: "Aroma 'Hutan Pinus Skandinavia'. Lu yakin benda ini bisa nyembuhin burnout kerjaan kantor.",
    acceptCost: 240000,
    acceptHappiness: 15,
    acceptCoffee: 0,
    acceptResult: "Kamar lu beraroma hutan peri pegunungan yang menyejukkan.",
    declineHappiness: 0,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Nyalain korek api trus ditiup buat nyium bau asepnya doang."
  },
  {
    day: 26,
    emoji: "🚗",
    title: "Surat Tilang Elektronik (ETLE)",
    desc: "Kemarin gak sengaja lewatin garis putih lampu merah 5 senti. Surat cinta polantas tiba di pagar.",
    acceptCost: 350000,
    acceptHappiness: -20,
    acceptCoffee: 10,
    acceptResult: "Bayar denda negara. Robek bukti transfer sambil menggerutu.",
    declineHappiness: -35,
    declineCost: 0,
    declineCoffee: 15,
    declineResult: "Disimpen di laci mobil. Biar jadi urusan lu di masa depan."
  },
  {
    day: 27,
    emoji: "🍕",
    title: "Traktiran Pizza Truffle Malam Minggu",
    desc: "Circle nongkrong mesen 3 loyang pizza truffle keju molor. Bill dibagi rata tanpa ampun.",
    acceptCost: 220000,
    acceptHappiness: 20,
    acceptCoffee: 0,
    acceptResult: "Kelezatan minyak truffle. Ngakak bareng temen-temen terbaik.",
    declineHappiness: -20,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Alasan mules dan pulang duluan. Makan mie instan di rumah hemat Rp 220 ribu."
  },
  {
    day: 28,
    emoji: "💉",
    title: "Kucing Peliharaan Nelen Pita Kado",
    desc: "Kucing lu nelen pita plastik sepanjang 20 cm dan masang muka polos tanpa rasa bersalah. Klinik darurat?",
    acceptCost: 1100000,
    acceptHappiness: -10,
    acceptCoffee: 20,
    acceptResult: "Pita berhasil dikeluarkan dokter. Kucing lu kembali mendengkur sehat.",
    declineHappiness: -60,
    declineCost: 0,
    declineCoffee: 40,
    declineResult: "Panik mantau pup kucing selama 12 jam dengan detak jantung 150 BPM."
  },
  {
    day: 29,
    emoji: "🎮",
    title: "Nongkrong Dingdong Retro Hari ke-29",
    desc: "Tinggal 24 jam sebelum gajian! Selangkah lagi selamat! Rayain tipis-tipis di arena dingdong arcade?",
    acceptCost: 120000,
    acceptHappiness: 30,
    acceptCoffee: 10,
    acceptResult: "Dapet rekor high score di Street Fighter! Garis finish udah di depan mata!",
    declineHappiness: -10,
    declineCost: 0,
    declineCoffee: 0,
    declineResult: "Mantengin jam dinding di kamar kayak elang ngincer mangsa."
  },
  {
    day: 30,
    emoji: "🏁",
    title: "Ujian Terakhir: Wi-Fi Kantor / Kosan Rusak!",
    desc: "Di hari terakhir kerja sebelum gajian, router jebol. Padahal harus submit laporan bulanan hari ini juga!",
    acceptCost: 350000,
    acceptHappiness: 10,
    acceptCoffee: 15,
    acceptResult: "Beli router baru kilat! Laporan terkirim! TIKET GAJIAN CAIR!",
    declineHappiness: -30,
    declineCost: 0,
    declineCoffee: 30,
    declineResult: "Tethering kuota darurat baterai 1%, laporan tepat waktu terkirim!"
  }
];

class PaydaySurvival {
  constructor() {
    this.balance = 15000000; // Rp 15.000.000
    this.happiness = 85;
    this.coffee = 35;
    this.currentDay = 1;
    this.totalDays = 30;

    this.cardStack = document.getElementById('cardStack');
    this.balanceEl = document.getElementById('balanceAmount');
    this.timelineFill = document.getElementById('timelineFill');
    this.timelineLabel = document.getElementById('timelineDayLabel');
    this.hapFill = document.getElementById('happinessFill');
    this.hapText = document.getElementById('happinessText');
    this.cofFill = document.getElementById('coffeeFill');
    this.cofText = document.getElementById('coffeeText');
    
    this.btnDecline = document.getElementById('btnDecline');
    this.btnAccept = document.getElementById('btnAccept');

    this.modal = document.getElementById('paydayModal');
    this.modalCard = document.getElementById('modalCard');
    this.modalIcon = document.getElementById('modalIcon');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalDesc = document.getElementById('modalDesc');
    this.modalSummary = document.getElementById('modalSummary');
    this.btnRetry = document.getElementById('btnRetry');

    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
    this.activeCard = null;

    this.init();
  }

  formatIDR(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  init() {
    this.renderCard();
    this.updateHUD();

    this.btnDecline.addEventListener('click', () => this.makeChoice('decline'));
    this.btnAccept.addEventListener('click', () => this.makeChoice('accept'));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.makeChoice('decline');
      else if (e.key === 'ArrowRight') this.makeChoice('accept');
    });

    if (this.btnRetry) {
      this.btnRetry.addEventListener('click', () => this.restart());
    }
  }

  getScenario() {
    return SCENARIOS[this.currentDay - 1] || SCENARIOS[SCENARIOS.length - 1];
  }

  renderCard() {
    this.cardStack.innerHTML = '';
    const item = this.getScenario();

    const card = document.createElement('div');
    card.className = 'swipe-card';
    card.id = 'activeSwipeCard';

    const costStr = item.acceptCost > 0 ? `-${this.formatIDR(item.acceptCost)}` : `+${this.formatIDR(Math.abs(item.acceptCost))}`;

    card.innerHTML = `
      <div class="card-stamp accept" id="stampAccept">PASRAH</div>
      <div class="card-stamp decline" id="stampDecline">TOLAK</div>

      <div class="card-day-badge">HARI ${this.currentDay} DARI ${this.totalDays}</div>

      <div class="card-visual-emoji">${item.emoji}</div>

      <div class="card-content-body">
        <h3 class="card-scenario-title">${item.title}</h3>
        <p class="card-scenario-desc">${item.desc}</p>
      </div>

      <div class="card-impact-preview">
        <div class="impact-tag impact-cost">
          <span>💸</span>
          <span>${costStr}</span>
        </div>
        <div class="impact-tag impact-hap">
          <span>😊</span>
          <span>${item.acceptHappiness >= 0 ? `+${item.acceptHappiness}%` : `${item.acceptHappiness}%`}</span>
        </div>
        <div class="impact-tag impact-cof">
          <span>☕</span>
          <span>${item.acceptCoffee >= 0 ? `+${item.acceptCoffee}%` : `${item.acceptCoffee}%`}</span>
        </div>
      </div>
    `;

    this.cardStack.appendChild(card);
    this.activeCard = card;
    this.attachSwipeListeners(card);
  }

  attachSwipeListeners(card) {
    const stampAccept = card.querySelector('#stampAccept');
    const stampDecline = card.querySelector('#stampDecline');

    const onPointerDown = (e) => {
      this.isDragging = true;
      this.startX = e.clientX || (e.touches && e.touches[0].clientX);
      card.style.transition = 'none';
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      this.currentX = clientX - this.startX;

      const rotate = this.currentX * 0.08;
      card.style.transform = `translate(${this.currentX}px, 0) rotate(${rotate}deg)`;

      if (this.currentX > 20) {
        stampAccept.style.opacity = Math.min(this.currentX / 100, 1);
        stampDecline.style.opacity = 0;
      } else if (this.currentX < -20) {
        stampDecline.style.opacity = Math.min(Math.abs(this.currentX) / 100, 1);
        stampAccept.style.opacity = 0;
      } else {
        stampAccept.style.opacity = 0;
        stampDecline.style.opacity = 0;
      }
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

      if (this.currentX > 90) {
        this.animateCardExit(card, 'accept');
      } else if (this.currentX < -90) {
        this.animateCardExit(card, 'decline');
      } else {
        // Snap back
        card.style.transform = 'translate(0, 0) rotate(0deg)';
        stampAccept.style.opacity = 0;
        stampDecline.style.opacity = 0;
      }
    };

    card.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  animateCardExit(card, choice) {
    const exitX = choice === 'accept' ? window.innerWidth : -window.innerWidth;
    const rotate = choice === 'accept' ? 35 : -35;
    card.style.transform = `translate(${exitX}px, 50px) rotate(${rotate}deg)`;
    card.style.opacity = '0';

    setTimeout(() => {
      this.applyDecision(choice);
    }, 200);
  }

  makeChoice(choice) {
    if (!this.activeCard) return;
    this.animateCardExit(this.activeCard, choice);
  }

  applyDecision(choice) {
    const item = this.getScenario();

    if (choice === 'accept') {
      this.balance -= item.acceptCost;
      this.happiness = Math.max(0, Math.min(100, this.happiness + item.acceptHappiness));
      this.coffee = Math.max(0, Math.min(100, this.coffee + item.acceptCoffee));

      if (item.acceptCost > 0) {
        this.flashBalance('loss');
        if (window.soundFX) window.soundFX.playExpenseBuzz();
      } else {
        this.flashBalance('gain');
        if (window.soundFX) window.soundFX.playCashChime();
      }
    } else {
      this.balance -= (item.declineCost || 0);
      this.happiness = Math.max(0, Math.min(100, this.happiness + (item.declineHappiness || 0)));
      this.coffee = Math.max(0, Math.min(100, this.coffee + (item.declineCoffee || 0)));

      if (item.declineCost && item.declineCost > 0) {
        this.flashBalance('loss');
        if (window.soundFX) window.soundFX.playExpenseBuzz();
      } else {
        if (window.soundFX) window.soundFX.playKeyClack();
      }
    }

    this.updateHUD();

    // Check game condition
    if (this.balance <= 0) {
      this.triggerGameOver('bankrupt');
      return;
    }

    if (this.happiness <= 0) {
      this.triggerGameOver('burnout');
      return;
    }

    if (this.currentDay >= this.totalDays) {
      this.triggerVictory();
      return;
    }

    this.currentDay++;
    this.renderCard();
    this.updateHUD();
  }

  flashBalance(type) {
    this.balanceEl.classList.remove('flash-loss', 'flash-gain');
    void this.balanceEl.offsetWidth; // trigger reflow
    this.balanceEl.classList.add(type === 'loss' ? 'flash-loss' : 'flash-gain');
    setTimeout(() => {
      this.balanceEl.classList.remove('flash-loss', 'flash-gain');
    }, 400);
  }

  updateHUD() {
    this.balanceEl.textContent = this.formatIDR(this.balance);

    const progressPct = ((this.currentDay) / this.totalDays) * 100;
    this.timelineFill.style.width = `${progressPct}%`;
    this.timelineLabel.textContent = `Hari ${this.currentDay} dari ${this.totalDays}`;

    this.hapFill.style.width = `${this.happiness}%`;
    this.hapText.textContent = `${this.happiness}%`;

    this.cofFill.style.width = `${this.coffee}%`;
    this.cofText.textContent = `${this.coffee}%`;
  }

  triggerGameOver(reason) {
    this.modal.style.display = 'flex';
    this.modalCard.className = 'payday-modal-card bankrupt';

    if (reason === 'bankrupt') {
      this.modalIcon.textContent = "💸💥";
      this.modalTitle.textContent = "SALDO REKENING LUDES!";
      this.modalDesc.textContent = `Uang lu habis tak bersisa di Hari ke-${this.currentDay}! Lu terpaksa makan mie instan belahan sama temen kosan. Coba lagi bulan depan!`;
    } else {
      this.modalIcon.textContent = "😵‍💫🌧️";
      this.modalTitle.textContent = "BURNOUT TOTAL!";
      this.modalDesc.textContent = `Tingkat kebahagiaan lu anjlok ke 0% di Hari ke-${this.currentDay}! Manusia gak bisa hidup cuma modal hemat ekstrem dan minum air keran doang!`;
    }

    this.modalSummary.innerHTML = `
      <div>Bertahan Sampai: Hari ${this.currentDay}/30</div>
      <div>Sisa Saldo: ${this.formatIDR(this.balance)}</div>
      <div>Tingkat Kafein: ${this.coffee}%</div>
    `;

    if (window.soundFX) window.soundFX.playExpenseBuzz();
  }

  triggerVictory() {
    this.modal.style.display = 'flex';
    this.modalCard.className = 'payday-modal-card';
    this.modalIcon.textContent = "🎉💰";
    this.modalTitle.textContent = "BERHASIL GAJIAN!";
    
    let persona = "Penyintas Finansial Seimbang";
    if (this.balance > 8000000) persona = "Master Hemat & Investasi 🧘";
    else if (this.coffee > 70) persona = "Zombie Bertenaga Kafein ☕⚡";
    else if (this.happiness > 70) persona = "Hedon Sejati Penuh Gaya ✨";

    this.modalDesc.textContent = `Luar biasa! Lu berhasil bertahan hidup melewati 30 hari penuh godaan! Gaji bulanan baru resmi masuk ke rekening! Gelar lu: ${persona}.`;

    this.modalSummary.innerHTML = `
      <div>Sisa Saldo: ${this.formatIDR(this.balance)}</div>
      <div>Kebahagiaan: ${this.happiness}%</div>
      <div>Level Kopi: ${this.coffee}%</div>
    `;

    if (window.soundFX) window.soundFX.playCashChime();
  }

  restart() {
    this.balance = 15000000;
    this.happiness = 85;
    this.coffee = 35;
    this.currentDay = 1;
    this.modal.style.display = 'none';
    this.renderCard();
    this.updateHUD();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.paydaySim = new PaydaySurvival();
});
