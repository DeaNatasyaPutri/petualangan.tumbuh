// ============================================================
// DATA.JS — Default data & Media Storage untuk Petualangan TUMBUH
// ============================================================

const DEFAULT_DATA = {

  // ── USERS ──────────────────────────────────────────────────
  users: [
    { id: 'u1', username: 'admin',   password: 'admin123',   role: 'admin',  name: 'Administrator',       avatar: '🔑', kelas: '-' },
    { id: 'u2', username: 'guru1',   password: 'guru123',    role: 'guru',   name: 'Bu Sari Dewi',        avatar: '👩‍🏫', kelas: '5A' },
    { id: 'u3', username: 'guru2',   password: 'guru456',    role: 'guru',   role: 'guru', name: 'Pak Budi Santoso', avatar: '👨‍🏫', kelas: '5B' },
    { id: 'u4', username: 'murid1',  password: 'murid123',   role: 'murid',  name: 'Andi Pratama',        avatar: '🌱', kelas: '5A', poin: 0, badges: [] },
    { id: 'u5', username: 'murid2',  password: 'murid456',   role: 'murid',  name: 'Siti Rahayu',         avatar: '🌸', kelas: '5A', poin: 0, badges: [] },
    { id: 'u6', username: 'murid3',  password: 'murid789',   role: 'murid',  name: 'Deni Kusuma',         avatar: '⭐', kelas: '5B', poin: 0, badges: [] },
  ],

  // ── CLASSES ────────────────────────────────────────────────
  kelas: [
    { id: 'k5a', name: 'Kelas 5A', guruId: 'u2', muridIds: ['u4','u5'] },
    { id: 'k5b', name: 'Kelas 5B', guruId: 'u3', muridIds: ['u6'] },
  ],

  // ── TOPICS — Pos 1 ─────────────────────────────────────────
  topics: [
    {
      id: 't1',
      title: 'Ekosistem & Komponennya',
      description: 'Pelajari tentang ekosistem, komponen biotik & abiotik, serta keseimbangannya di alam.',
      emoji: '🌿',
      color: '#2E7D32',
      bgGradient: 'linear-gradient(135deg, #43A047, #1B5E20)',
      videoUrl: 'https://www.youtube.com/embed/3sCVR7GS3xE',
      videoMediaId: null,
      pdfMediaId: null,
      pdfFileName: null,
      videoFileName: null,
      tags: ['Ekosistem', 'IPA', 'Kelas 5'],
      level: 'Dasar'
    },
    {
      id: 't2',
      title: 'Rantai Makanan',
      description: 'Pahami hubungan makan-memakan antar makhluk hidup dan aliran energi dalam ekosistem.',
      emoji: '🦁',
      color: '#E65100',
      bgGradient: 'linear-gradient(135deg, #FF7043, #BF360C)',
      videoUrl: 'https://www.youtube.com/embed/v7PYl0YHfOQ',
      videoMediaId: null,
      pdfMediaId: null,
      pdfFileName: null,
      videoFileName: null,
      tags: ['Rantai Makanan', 'IPA', 'Kelas 5'],
      level: 'Dasar'
    },
    {
      id: 't3',
      title: 'Jaring-Jaring Makanan',
      description: 'Eksplorasi hubungan kompleks antar rantai makanan yang membentuk jaring-jaring kehidupan.',
      emoji: '🕸️',
      color: '#6A1B9A',
      bgGradient: 'linear-gradient(135deg, #AB47BC, #4A148C)',
      videoUrl: 'https://www.youtube.com/embed/6bq3KuFtX_E',
      videoMediaId: null,
      pdfMediaId: null,
      pdfFileName: null,
      videoFileName: null,
      tags: ['Jaring Makanan', 'IPA', 'Kelas 5'],
      level: 'Menengah'
    },
    {
      id: 't4',
      title: 'Adaptasi Makhluk Hidup',
      description: 'Temukan cara unik hewan dan tumbuhan beradaptasi untuk bertahan hidup di lingkungannya.',
      emoji: '🐠',
      color: '#0277BD',
      bgGradient: 'linear-gradient(135deg, #29B6F6, #01579B)',
      videoUrl: 'https://www.youtube.com/embed/B-4Z7-y3B84',
      videoMediaId: null,
      pdfMediaId: null,
      pdfFileName: null,
      videoFileName: null,
      tags: ['Adaptasi', 'IPA', 'Kelas 5'],
      level: 'Menengah'
    },
    {
      id: 't5',
      title: 'Simbiosis Makhluk Hidup',
      description: 'Pelajari berbagai jenis hubungan simbiosis: mutualisme, komensalisme, dan parasitisme.',
      emoji: '🌺',
      color: '#C62828',
      bgGradient: 'linear-gradient(135deg, #EF5350, #B71C1C)',
      videoUrl: 'https://www.youtube.com/embed/jzgPKB-jfhM',
      videoMediaId: null,
      pdfMediaId: null,
      pdfFileName: null,
      videoFileName: null,
      tags: ['Simbiosis', 'IPA', 'Kelas 5'],
      level: 'Menengah'
    },
    {
      id: 't6',
      title: 'Siklus Air & Cuaca',
      description: 'Ikuti perjalanan air dari lautan ke awan hingga kembali ke bumi melalui siklus hidrologi.',
      emoji: '💧',
      color: '#00838F',
      bgGradient: 'linear-gradient(135deg, #26C6DA, #006064)',
      videoUrl: 'https://www.youtube.com/embed/TWqJDxPKGrM',
      videoMediaId: null,
      pdfMediaId: null,
      pdfFileName: null,
      videoFileName: null,
      tags: ['Siklus Air', 'IPA', 'Kelas 5'],
      level: 'Dasar'
    },
    {
      id: 't7',
      title: 'Pelestarian Lingkungan',
      description: 'Pelajari pentingnya menjaga kelestarian alam dan cara-cara yang bisa kita lakukan.',
      emoji: '🌍',
      color: '#558B2F',
      bgGradient: 'linear-gradient(135deg, #8BC34A, #33691E)',
      videoUrl: 'https://www.youtube.com/embed/3oCfNJ_AZQM',
      videoMediaId: null,
      pdfMediaId: null,
      pdfFileName: null,
      videoFileName: null,
      tags: ['Lingkungan', 'IPA', 'Kelas 5'],
      level: 'Lanjutan'
    },
    {
      id: 't8',
      title: 'Pencemaran Lingkungan',
      description: 'Kenali berbagai jenis pencemaran lingkungan dan dampaknya bagi makhluk hidup.',
      emoji: '🏭',
      color: '#4E342E',
      bgGradient: 'linear-gradient(135deg, #8D6E63, #3E2723)',
      videoUrl: 'https://www.youtube.com/embed/TkFDi5oJjNg',
      videoMediaId: null,
      pdfMediaId: null,
      pdfFileName: null,
      videoFileName: null,
      tags: ['Pencemaran', 'IPA', 'Kelas 5'],
      level: 'Lanjutan'
    },
  ],

  // ── CASES — Pos 2 ─────────────────────────────────────────
  cases: [
    {
      id: 'c1',
      title: 'Pencemaran Sungai Citarum',
      emoji: '🏭',
      color: '#5D4037',
      bgGradient: 'linear-gradient(135deg, #8D6E63, #3E2723)',
      deskripsi: 'Sungai Citarum, salah satu sungai terbesar di Indonesia, kini dipenuhi sampah dan limbah pabrik. Air sungai berubah warna menjadi hitam dan berbau busuk. Ribuan ikan mati, dan warga yang tinggal di sekitar sungai kesulitan mendapatkan air bersih. Petani juga tidak bisa mengairi sawah mereka karena air sudah tercemar zat kimia berbahaya.',
      gambar: '🌊',
      imageData: null,
      pertanyaanPanduan: [
        'Apa permasalahan utama yang terjadi di Sungai Citarum?',
        'Apa saja penyebab terjadinya pencemaran sungai ini?',
        'Apa dampak pencemaran ini bagi ekosistem sungai dan makhluk hidup di sekitarnya?',
        'Apa solusi yang kalian usulkan untuk mengatasi masalah ini?',
        'Informasi apa dari video yang dapat membantu kalian memecahkan kasus ini?'
      ]
    },
    {
      id: 'c2',
      title: 'Kebakaran Hutan Kalimantan',
      emoji: '🔥',
      color: '#BF360C',
      bgGradient: 'linear-gradient(135deg, #FF7043, #BF360C)',
      deskripsi: 'Kebakaran hutan besar terjadi di Kalimantan. Ribuan hektar hutan tropis habis terbakar dalam waktu singkat. Asap tebal menyelimuti kota-kota di sekitarnya hingga jarak pandang hanya beberapa meter. Orangutan, beruang madu, dan berbagai satwa liar kehilangan habitat mereka. Udara dipenuhi partikel berbahaya yang membahayakan kesehatan warga.',
      gambar: '🌲',
      imageData: null,
      pertanyaanPanduan: [
        'Apa permasalahan utama yang terjadi dalam kasus kebakaran hutan ini?',
        'Apa saja penyebab terjadinya kebakaran hutan di Kalimantan?',
        'Bagaimana dampak kebakaran ini terhadap ekosistem hutan dan makhluk hidup di dalamnya?',
        'Solusi apa yang kalian rekomendasikan untuk mencegah dan mengatasi kebakaran hutan?',
        'Koneksi apa antara informasi dari video dan permasalahan kebakaran hutan ini?'
      ]
    },
    {
      id: 'c3',
      title: 'Sampah Plastik di Laut',
      emoji: '🐢',
      color: '#0D47A1',
      bgGradient: 'linear-gradient(135deg, #42A5F5, #0D47A1)',
      deskripsi: 'Setiap tahun, jutaan ton sampah plastik masuk ke lautan Indonesia. Penyu laut mati setelah menelan kantong plastik yang dikira ubur-ubur. Ikan-ikan kecil memakan mikroplastik dan akhirnya ikan tersebut dimakan manusia. Terumbu karang yang indah tertutup sampah plastik dan perlahan mati. Ekosistem laut yang kaya kini menghadapi ancaman serius.',
      gambar: '🌊',
      imageData: null,
      pertanyaanPanduan: [
        'Apa permasalahan utama yang dihadapi lautan akibat sampah plastik?',
        'Mengapa sampah plastik bisa sampai ke lautan dalam jumlah sebesar itu?',
        'Bagaimana dampak sampah plastik terhadap ekosistem laut dan rantai makanan?',
        'Apa langkah konkret yang bisa kalian lakukan untuk mengurangi sampah plastik di laut?',
        'Hubungkan informasi dari video tentang ekosistem dengan dampak sampah plastik ini!'
      ]
    },
    {
      id: 'c4',
      title: 'Deforestasi & Hilangnya Habitat',
      emoji: '🦧',
      color: '#1B5E20',
      bgGradient: 'linear-gradient(135deg, #66BB6A, #1B5E20)',
      deskripsi: 'Hutan Sumatera terus menyusut karena dibabat untuk perkebunan kelapa sawit. Harimau Sumatera yang dilindungi kini hanya tersisa kurang dari 400 ekor. Mereka tidak punya tempat berlindung dan terpaksa mendekati pemukiman warga, menyebabkan konflik antara manusia dan satwa. Ekosistem yang telah terbentuk selama ribuan tahun hancur hanya dalam hitungan bulan.',
      gambar: '🌳',
      imageData: null,
      pertanyaanPanduan: [
        'Apa permasalahan utama yang dialami hutan Sumatera dan satwa liarnya?',
        'Apa yang menyebabkan terjadinya deforestasi besar-besaran ini?',
        'Bagaimana hilangnya hutan mempengaruhi keseimbangan ekosistem dan makhluk hidup?',
        'Solusi apa yang bisa diterapkan untuk melindungi hutan dan habitatnya?',
        'Gunakan informasi dari video tentang adaptasi atau ekosistem untuk mendukung jawaban kalian!'
      ]
    },
    {
      id: 'c5',
      title: 'Kekeringan & Krisis Air Bersih',
      emoji: '🏜️',
      color: '#F57F17',
      bgGradient: 'linear-gradient(135deg, #FFCA28, #F57F17)',
      deskripsi: 'Di musim kemarau panjang, banyak desa di Nusa Tenggara Timur mengalami kekeringan parah. Sumber mata air mengering, sumur-sumur tidak berair lagi. Warga harus berjalan bermil-mil untuk mencari air. Tanaman padi gagal panen, ternak mati kehausan, dan anak-anak tidak bisa mandi berhari-hari. Perubahan iklim membuat musim kemarau semakin panjang dan ekstrem.',
      gambar: '💧',
      imageData: null,
      pertanyaanPanduan: [
        'Apa permasalahan utama yang dihadapi masyarakat dalam kasus kekeringan ini?',
        'Apa saja penyebab terjadinya kekeringan yang semakin parah ini?',
        'Bagaimana kekeringan mempengaruhi ekosistem, makhluk hidup, dan kehidupan manusia?',
        'Solusi apa yang dapat membantu mengatasi krisis air bersih ini?',
        'Bagaimana informasi dari video tentang siklus air dapat membantu memahami penyebab kekeringan?'
      ]
    },
  ],

  // ── QUIZ QUESTIONS — Pos 3 Kuis Kejutan (Kelompok) ─────────
  kuisKejutan: [
    // Babak Utama (6 soal)
    {
      id: 'kk1', babak: 'utama', no: 1,
      pertanyaan: 'Makhluk hidup yang tidak dapat membuat makanan sendiri dan bergantung pada makhluk hidup lain disebut...',
      pilihan: ['Produsen', 'Konsumen', 'Dekomposer', 'Autotrof'],
      jawaban: 1,
      penjelasan: 'Konsumen adalah makhluk hidup yang tidak dapat membuat makanan sendiri (heterotrof) dan mendapatkan energi dengan memakan makhluk hidup lain.'
    },
    {
      id: 'kk2', babak: 'utama', no: 2,
      pertanyaan: 'Urutan rantai makanan yang benar di ekosistem sawah adalah...',
      pilihan: [
        'Padi → Belalang → Katak → Ular → Elang',
        'Belalang → Padi → Katak → Ular → Elang',
        'Elang → Ular → Katak → Belalang → Padi',
        'Padi → Katak → Belalang → Elang → Ular'
      ],
      jawaban: 0,
      penjelasan: 'Rantai makanan dimulai dari produsen (padi) ke konsumen tingkat 1 (belalang), konsumen 2 (katak), konsumen 3 (ular), hingga konsumen puncak (elang).'
    },
    {
      id: 'kk3', babak: 'utama', no: 3,
      pertanyaan: 'Hubungan simbiosis antara kupu-kupu dan bunga adalah contoh simbiosis...',
      pilihan: ['Parasitisme', 'Komensalisme', 'Mutualisme', 'Amensalisme'],
      jawaban: 2,
      penjelasan: 'Mutualisme: kupu-kupu mendapat nektar (untung), bunga terbantu penyerbukannya (untung). Keduanya saling menguntungkan.'
    },
    {
      id: 'kk4', babak: 'utama', no: 4,
      pertanyaan: 'Komponen abiotik dalam ekosistem adalah...',
      pilihan: [
        'Hewan, tumbuhan, dan jamur',
        'Air, udara, tanah, dan cahaya matahari',
        'Produsen, konsumen, dan dekomposer',
        'Bakteri, virus, dan plankton'
      ],
      jawaban: 1,
      penjelasan: 'Komponen abiotik adalah benda tidak hidup yang mendukung kehidupan: air, udara, tanah, cahaya matahari, suhu, dan mineral.'
    },
    {
      id: 'kk5', babak: 'utama', no: 5,
      pertanyaan: 'Hewan yang hidup di padang pasir beradaptasi dengan cara...',
      pilihan: [
        'Memiliki insang untuk bernapas di air',
        'Menyimpan cadangan air dan lemak di punuk',
        'Memiliki bulu tebal untuk menghangatkan tubuh',
        'Berkulit tipis untuk menyerap air'
      ],
      jawaban: 1,
      penjelasan: 'Unta beradaptasi dengan menyimpan lemak di punuk. Lemak ini diurai menjadi energi dan air saat dibutuhkan di padang pasir.'
    },
    {
      id: 'kk6', babak: 'utama', no: 6,
      pertanyaan: 'Proses jatuhnya air dari awan ke permukaan bumi disebut...',
      pilihan: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Transpirasi'],
      jawaban: 2,
      penjelasan: 'Presipitasi adalah jatuhnya air dari awan ke permukaan bumi dalam bentuk hujan, salju, atau es.'
    },
    // Babak Penentuan (4 soal)
    {
      id: 'kk7', babak: 'penentuan', no: 7,
      pertanyaan: 'Jika populasi katak di sawah punah, apa yang akan terjadi pada populasi belalang?',
      pilihan: [
        'Berkurang drastis karena kehilangan makanan',
        'Bertambah banyak karena tidak ada predator',
        'Tetap sama karena tidak ada hubungannya',
        'Punah juga bersama katak'
      ],
      jawaban: 1,
      penjelasan: 'Dalam rantai makanan Padi→Belalang→Katak, jika katak punah, belalang tidak punya musuh alami sehingga populasinya meningkat.'
    },
    {
      id: 'kk8', babak: 'penentuan', no: 8,
      pertanyaan: 'Tumbuhan yang hidup di daerah kutub beradaptasi dengan cara memiliki daun yang berbentuk jarum. Tujuan adaptasi ini adalah...',
      pilihan: [
        'Memperluas permukaan daun untuk fotosintesis maksimal',
        'Mengurangi penguapan air dan tahan terhadap salju',
        'Menarik serangga penyerbuk yang lebih banyak',
        'Memperkuat batang pohon agar tidak patah'
      ],
      jawaban: 1,
      penjelasan: 'Daun berbentuk jarum bertujuan mengurangi penguapan air dan mudah menggeser salju agar tidak mematahkan cabang.'
    },
    {
      id: 'kk9', babak: 'penentuan', no: 9,
      pertanyaan: 'Pengurai (dekomposer) sangat penting dalam ekosistem karena...',
      pilihan: [
        'Menghasilkan oksigen untuk semua makhluk hidup',
        'Mengubah sisa organisme menjadi zat hara yang menyuburkan tanah',
        'Memangsa konsumen yang lemah agar ekosistem seimbang',
        'Menghasilkan glukosa melalui proses fotosintesis'
      ],
      jawaban: 1,
      penjelasan: 'Dekomposer (bakteri, jamur) mengurai sisa-sisa organisme menjadi zat hara anorganik yang menyuburkan tanah.'
    },
    {
      id: 'kk10', babak: 'penentuan', no: 10,
      pertanyaan: 'Penebangan hutan secara liar dapat menyebabkan banjir karena...',
      pilihan: [
        'Pohon menghalangi aliran air sehingga air meluap',
        'Tanpa pohon, tidak ada yang menyerap air hujan sehingga langsung mengalir ke sungai',
        'Kayu pohon yang ditebang menyumbat aliran sungai',
        'Penebangan membuat tanah menjadi lebih keras dan tidak menyerap air'
      ],
      jawaban: 1,
      penjelasan: 'Akar pohon berfungsi menyerap dan menahan air. Tanpa pohon, air hujan langsung mengalir ke permukaan dan memicu banjir.'
    },
  ],

  // ── TANTANGAN AKHIR QUESTIONS — Pos 3 (Individu: PG & Esai) ─
  tantanganAkhir: [
    {
      id: 'ta1', no: 1, type: 'pg',
      pertanyaan: 'Ekosistem adalah...',
      pilihan: [
        'Kumpulan makhluk hidup sejenis yang hidup di satu tempat',
        'Hubungan timbal balik antara makhluk hidup dengan lingkungannya',
        'Proses pembuatan makanan oleh tumbuhan',
        'Perpindahan energi dari satu makhluk ke makhluk lain'
      ],
      jawaban: 1,
      waktu: 30
    },
    {
      id: 'ta2', no: 2, type: 'pg',
      pertanyaan: 'Organisme yang berada di tingkat pertama dalam rantai makanan adalah...',
      pilihan: ['Karnivora', 'Herbivora', 'Omnivora', 'Produsen'],
      jawaban: 3,
      waktu: 30
    },
    {
      id: 'ta3', no: 3, type: 'pg',
      pertanyaan: 'Proses penguapan air dari permukaan laut dan sungai karena panas matahari disebut...',
      pilihan: ['Kondensasi', 'Presipitasi', 'Evaporasi', 'Infiltrasi'],
      jawaban: 2,
      waktu: 30
    },
    {
      id: 'ta4', no: 4, type: 'pg',
      pertanyaan: 'Burung jalak yang hinggap di punggung kerbau dan memakan kutu di tubuhnya. Hubungan ini disebut...',
      pilihan: ['Parasitisme', 'Mutualisme', 'Komensalisme', 'Amensalisme'],
      jawaban: 1,
      waktu: 30
    },
    {
      id: 'ta5', no: 5, type: 'pg',
      pertanyaan: 'Hewan berikut yang termasuk konsumen tingkat 3 dalam rantai makanan sawah adalah...',
      pilihan: ['Belalang', 'Katak', 'Ular', 'Padi'],
      jawaban: 2,
      waktu: 30
    },
    {
      id: 'ta6', no: 6, type: 'pg',
      pertanyaan: 'Tumbuhan kantong semar memperoleh nitrogen tambahan dengan cara...',
      pilihan: [
        'Menyerap nitrogen dari udara langsung',
        'Menjebak dan mencerna serangga',
        'Bersimbiosis dengan bakteri di dalam tanahnya',
        'Menyerap nitrogen dari air hujan'
      ],
      jawaban: 1,
      waktu: 35
    },
    {
      id: 'ta7', no: 7, type: 'pg',
      pertanyaan: 'Mengapa tumbuhan hijau disebut sebagai produsen dalam ekosistem?',
      pilihan: [
        'Karena tumbuhan menghasilkan oksigen untuk manusia',
        'Karena tumbuhan dapat membuat makanannya sendiri melalui fotosintesis',
        'Karena tumbuhan dimakan oleh semua hewan',
        'Karena tumbuhan hidup paling lama dibanding makhluk lain'
      ],
      jawaban: 1,
      waktu: 30
    },
    {
      id: 'ta8', no: 8, type: 'pg',
      pertanyaan: 'Pernyataan yang BENAR tentang jaring-jaring makanan adalah...',
      pilihan: [
        'Jaring-jaring makanan hanya terdiri dari satu rantai makanan',
        'Jaring-jaring makanan adalah gabungan beberapa rantai makanan yang saling berhubungan',
        'Semua hewan dalam jaring-jaring makanan adalah herbivora',
        'Jaring-jaring makanan tidak melibatkan tumbuhan'
      ],
      jawaban: 1,
      waktu: 35
    },
    {
      id: 'ta9', no: 9, type: 'esai',
      pertanyaan: 'Jelaskan apa yang akan terjadi pada ekosistem sawah apabila seluruh populasi ular habis diburu oleh manusia!',
      kunciEsai: 'Populasi katak dan tikus akan meningkat pesat karena kehilangan predator alami, sedangkan populasi elang akan menurun karena kekurangan sumber makanan.',
      kataKunci: ['katak', 'tikus', 'elang', 'predator', 'seimbang', 'meningkat', 'menurun'],
      waktu: 90
    },
    {
      id: 'ta10', no: 10, type: 'esai',
      pertanyaan: 'Sebutkan dan jelaskan 3 langkah nyata yang dapat kamu lakukan di sekolah maupun di rumah untuk mencegah pencemaran lingkungan!',
      kunciEsai: 'Mengurangi penggunaan plastik sekali pakai, membuang dan memilah sampah pada tempatnya, menghemat air serta menanam pohon di lingkungan sekitar.',
      kataKunci: ['sampah', 'plastik', 'pohon', 'daur ulang', 'hemat', 'air', 'bersih'],
      waktu: 90
    },
  ],

  // ── SCORES — Progress Murid ─────────────────────────────────
  scores: {},

  // ── MATERIALS — Guru uploads (Synced with Pos 1) ───────────
  materials: [],

  // ── SETTINGS ──────────────────────────────────────────────
  settings: {
    appName: 'Petualangan TUMBUH',
    slogan: 'Pantang Menyerah, Terus Melangkah',
    pos1Active: true,
    pos2Active: true,
    pos3Active: true,
    pos4Active: true,
    timerTantangan: 30,
    pointsBenar: 10,
    pointsSalah: 0,
  }
};

// ── IndexedDB Media Store for Large Local Files (Video/PDF/Images) ──
const MediaDB = {
  _dbName: 'PetualanganTumbuhMediaDB',
  _storeName: 'files',
  _dbPromise: null,

  _open() {
    if (this._dbPromise) return this._dbPromise;
    this._dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(this._dbName, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this._storeName)) {
          db.createObjectStore(this._storeName, { keyPath: 'id' });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
    return this._dbPromise;
  },

  async saveFile(file) {
    const db = await this._open();
    const id = 'media_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this._storeName, 'readwrite');
      const store = tx.objectStore(this._storeName);
      store.put({
        id,
        name: file.name,
        type: file.type,
        size: file.size,
        blob: file,
        createdAt: new Date().toISOString()
      });
      tx.oncomplete = () => resolve({ id, name: file.name, type: file.type, size: file.size });
      tx.onerror = (e) => reject(e.target.error);
    });
  },

  async getFileUrl(id) {
    if (!id) return null;
    try {
      const db = await this._open();
      return await new Promise((resolve) => {
        const tx = db.transaction(this._storeName, 'readonly');
        const store = tx.objectStore(this._storeName);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && req.result.blob) {
            resolve({
              url: URL.createObjectURL(req.result.blob),
              name: req.result.name,
              type: req.result.type
            });
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async deleteFile(id) {
    if (!id) return;
    try {
      const db = await this._open();
      const tx = db.transaction(this._storeName, 'readwrite');
      tx.objectStore(this._storeName).delete(id);
    } catch {}
  },

  async clearAll() {
    try {
      const db = await this._open();
      const tx = db.transaction(this._storeName, 'readwrite');
      tx.objectStore(this._storeName).clear();
    } catch {}
  }
};

// ── Data Manager ──────────────────────────────────────────────
const DB = {
  _prefix: 'tumbuh_',

  init() {
    Object.keys(DEFAULT_DATA).forEach(key => {
      if (!localStorage.getItem(this._prefix + key)) {
        this.set(key, DEFAULT_DATA[key]);
      }
    });
    // Ensure tantanganAkhir has type property on legacy saved items
    const ta = this.get('tantanganAkhir') || [];
    let updated = false;
    ta.forEach(q => {
      if (!q.type) { q.type = 'pg'; updated = true; }
    });
    if (!ta.some(q => q.type === 'esai')) {
      const defaultEssays = DEFAULT_DATA.tantanganAkhir.filter(q => q.type === 'esai');
      ta.push(...defaultEssays);
      updated = true;
    }
    if (updated) this.set('tantanganAkhir', ta);
  },

  get(key) {
    try {
      const raw = localStorage.getItem(this._prefix + key);
      return raw ? JSON.parse(raw) : DEFAULT_DATA[key];
    } catch { return DEFAULT_DATA[key]; }
  },

  set(key, value) {
    localStorage.setItem(this._prefix + key, JSON.stringify(value));
  },

  reset() {
    Object.keys(DEFAULT_DATA).forEach(key => {
      localStorage.removeItem(this._prefix + key);
    });
    MediaDB.clearAll();
    this.init();
  },

  // Users
  getUsers()          { return this.get('users'); },
  getUserById(id)     { return this.getUsers().find(u => u.id === id); },
  getUserByUsername(u){ return this.getUsers().find(x => x.username === u); },
  saveUsers(users)    { this.set('users', users); },

  addUser(user) {
    const users = this.getUsers();
    user.id = 'u' + Date.now();
    users.push(user);
    this.saveUsers(users);
    return user;
  },

  updateUser(id, data) {
    const users = this.getUsers().map(u => u.id === id ? { ...u, ...data } : u);
    this.saveUsers(users);
  },

  deleteUser(id) {
    const users = this.getUsers().filter(u => u.id !== id);
    this.saveUsers(users);
  },

  // Topics (Pos 1)
  getTopics()         { return this.get('topics'); },
  saveTopics(topics)  { this.set('topics', topics); },
  addTopic(t)         { const ts = this.getTopics(); t.id = t.id || ('t' + Date.now()); ts.push(t); this.saveTopics(ts); return t; },
  updateTopic(id, d)  { const ts = this.getTopics().map(t => t.id === id ? { ...t, ...d } : t); this.saveTopics(ts); },
  deleteTopic(id)     { this.saveTopics(this.getTopics().filter(t => t.id !== id)); },

  // Cases (Pos 2)
  getCases()          { return this.get('cases'); },
  saveCases(cases)    { this.set('cases', cases); },
  updateCase(id, d)   { const cs = this.getCases().map(c => c.id === id ? { ...c, ...d } : c); this.saveCases(cs); },

  // Quiz Questions (Pos 3)
  getKuisKejutan()    { return this.get('kuisKejutan'); },
  getTantanganAkhir() { return this.get('tantanganAkhir'); },
  saveKuisKejutan(q)  { this.set('kuisKejutan', q); },
  saveTantanganAkhir(q){ this.set('tantanganAkhir', q); },

  // Scores
  getScores()         { return this.get('scores'); },
  getScoreByUser(uid) { return this.getScores()[uid] || {}; },
  saveScore(uid, posKey, data) {
    const scores = this.getScores();
    if (!scores[uid]) scores[uid] = {};
    scores[uid][posKey] = { ...scores[uid][posKey], ...data, updatedAt: new Date().toISOString() };
    this.set('scores', scores);
  },

  // Materials
  getMaterials()      { return this.get('materials'); },
  addMaterial(m)      { const ms = this.getMaterials(); m.id = 'm' + Date.now(); m.createdAt = new Date().toISOString(); ms.push(m); this.set('materials', ms); return m; },
  deleteMaterial(id)  { this.set('materials', this.getMaterials().filter(m => m.id !== id)); },

  // Settings
  getSettings()       { return this.get('settings'); },
  saveSettings(s)     { this.set('settings', { ...this.getSettings(), ...s }); },

  // Kelas
  getKelas()          { return this.get('kelas'); },
  saveKelas(k)        { this.set('kelas', k); },
};
