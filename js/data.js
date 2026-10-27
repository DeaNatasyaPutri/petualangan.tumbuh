// ============================================================
// DATA.JS — Default Data, IndexedDB Media Store, & Real-Time
//           Collaborative Synchronization Engine (RealtimeSync)
// ============================================================

const DEFAULT_DATA = {

  // ── USERS ──────────────────────────────────────────────────
  users: [
    { id: 'u1', username: 'admin',   password: 'admin123',   role: 'admin',  name: 'Administrator',       avatar: '🔑', kelas: '-' },
    { id: 'u2', username: 'guru1',   password: 'guru123',    role: 'guru',   name: 'Bu Sari Dewi',        avatar: '👩‍🏫', kelas: '5A' },
    { id: 'u3', username: 'guru2',   password: 'guru456',    role: 'guru',   name: 'Pak Budi Santoso',    avatar: '👨‍🏫', kelas: '5B' },
    { id: 'u4', username: 'murid1',  password: 'murid123',   role: 'murid',  name: 'Andi Pratama',        avatar: '🌱', kelas: '5A', groupId: 'g1', poin: 0, badges: [] },
    { id: 'u5', username: 'murid2',  password: 'murid456',   role: 'murid',  name: 'Siti Rahayu',         avatar: '🌸', kelas: '5A', groupId: 'g1', poin: 0, badges: [] },
    { id: 'u6', username: 'murid3',  password: 'murid789',   role: 'murid',  name: 'Deni Kusuma',         avatar: '⭐', kelas: '5A', groupId: 'g2', poin: 0, badges: [] },
    { id: 'u7', username: 'murid4',  password: 'murid123',   role: 'murid',  name: 'Rina Amelia',         avatar: '🌻', kelas: '5A', groupId: 'g2', poin: 0, badges: [] },
    { id: 'u8', username: 'murid5',  password: 'murid123',   role: 'murid',  name: 'Bima Sakti',          avatar: '🦁', kelas: '5A', groupId: 'g3', poin: 0, badges: [] },
    { id: 'u9', username: 'murid6',  password: 'murid123',   role: 'murid',  name: 'Citra Lestari',       avatar: '🦋', kelas: '5A', groupId: 'g3', poin: 0, badges: [] },
  ],

  // ── CLASSES ────────────────────────────────────────────────
  kelas: [
    { id: 'k5a', name: 'Kelas 5A', guruId: 'u2', muridIds: ['u4','u5','u6','u7','u8','u9'] },
    { id: 'k5b', name: 'Kelas 5B', guruId: 'u3', muridIds: [] },
  ],

  // ── GROUPS (Kelompok Belajar — Dikelola Manual oleh Guru) ──
  groups: [
    { id: 'g1', name: 'Kelompok 1 — Tunas Hijau', emoji: '🌱', color: '#43A047', kelas: '5A', muridIds: ['u4', 'u5'] },
    { id: 'g2', name: 'Kelompok 2 — Akar Kuat',   emoji: '🌳', color: '#1565C0', kelas: '5A', muridIds: ['u6', 'u7'] },
    { id: 'g3', name: 'Kelompok 3 — Bunga Mekar', emoji: '🌻', color: '#FB8C00', kelas: '5A', muridIds: ['u8', 'u9'] },
  ],

  // ── POS 2 REAL-TIME STATE (Dikendalikan Guru & Kolaborasi LKK) ──
  pos2State: {
    turnOrder: [],        // Array of groupIds in spun order
    activeGroupId: null,  // Group currently selected/spun by Guru
    assignments: {},      // { [groupId]: { caseId: 'c1', assignedAt: ISO, assignedBy: 'Bu Sari' } }
    lkk: {}               // { [groupId]: { answers: ['','','','',''], typing: { userName: '', fieldIdx: -1, ts: 0 }, submitted: false, score: 0, submittedAt: null } }
  },

  // ── POS 3 REAL-TIME GROUP QUIZ STATE ───────────────────────
  pos3GroupState: {
    // Per-group synchronized quiz state so each group only sees its own quiz & syncs options live
    groups: {}
    // Structure per groupId:
    // {
    //   currentIdx: 0,
    //   selectedOption: null,
    //   selectedBy: null,
    //   lockedAnswers: { [qIdx]: { selected: 1, correct: 1, isCorrect: true, points: 10, lockedBy: 'Andi' } },
    //   totalScore: 0,
    //   completed: false,
    //   lastFeedback: null // { qIdx, isCorrect, points, correctText, explanation, lockedBy, ts }
    // }
  },

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

// ── Real-Time Synchronization Engine (BroadcastChannel + Storage + Optional WS) ──
const RealtimeSync = {
  _channel: null,
  _listeners: [],
  _clientId: 'client_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
  _ws: null,

  init() {
    // 1. BroadcastChannel for instant multi-tab / multi-window real-time sync
    if (typeof BroadcastChannel !== 'undefined') {
      this._channel = new BroadcastChannel('petualangan_tumbuh_realtime');
      this._channel.onmessage = (e) => {
        if (e.data && e.data.senderId !== this._clientId) {
          this._notify(e.data);
        }
      };
    }

    // 2. Storage event listener as universal fallback across browser windows
    window.addEventListener('storage', (e) => {
      if (e.key === 'tumbuh_rt_event' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload.senderId !== this._clientId) {
            this._notify(payload);
          }
        } catch {}
      }
    });
  },

  emit(eventType, data = {}) {
    const payload = {
      senderId: this._clientId,
      type: eventType,
      data,
      ts: Date.now()
    };

    if (this._channel) {
      try { this._channel.postMessage(payload); } catch {}
    }

    try {
      localStorage.setItem('tumbuh_rt_event', JSON.stringify(payload));
    } catch {}
  },

   subscribe(callback) {
    this._listeners.push(callback);
    return () => {
      this._listeners = this._listeners.filter(cb => cb !== callback);
    };
  },

  _notify(payload) {
    this._listeners.forEach(cb => {
      try { cb(payload); } catch (err) { console.error(err); }
    });
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

    // Migrate legacy users/groups if needed
    const groups = this.get('groups') || DEFAULT_DATA.groups;
    const users = this.get('users') || [];
    let usersUpdated = false;
    // Add extra demo students if missing
    DEFAULT_DATA.users.forEach(defU => {
      if (!users.some(u => u.id === defU.id)) {
        users.push(defU);
        usersUpdated = true;
      }
    });
    // Ensure groupId is synced from groups.muridIds
    groups.forEach(g => {
      (g.muridIds || []).forEach(uid => {
        const u = users.find(x => x.id === uid);
        if (u && u.groupId !== g.id) {
          u.groupId = g.id;
          usersUpdated = true;
        }
      });
    });
    if (usersUpdated) this.set('users', users);

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

    RealtimeSync.init();
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
    RealtimeSync.emit('SYSTEM_RESET', {});
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

  // Groups (Kelompok Belajar)
  getGroups() { return this.get('groups') || []; },
  getGroupById(id) { return this.getGroups().find(g => g.id === id) || null; },
  getGroupByUserId(userId) {
    const u = this.getUserById(userId);
    if (u && u.groupId) {
      const byAttr = this.getGroupById(u.groupId);
      if (byAttr) return byAttr;
    }
    return this.getGroups().find(g => (g.muridIds || []).includes(userId)) || null;
  },
  saveGroups(groups) {
    this.set('groups', groups);
    // Sync each murid's groupId attribute so login/session always knows their group
    const users = this.getUsers();
    users.forEach(u => {
      if (u.role === 'murid') {
        const foundGroup = groups.find(g => (g.muridIds || []).includes(u.id));
        u.groupId = foundGroup ? foundGroup.id : null;
      }
    });
    this.saveUsers(users);
    RealtimeSync.emit('GROUPS_UPDATED', { groups });
  },
  addGroup(group) {
    const groups = this.getGroups();
    group.id = group.id || ('g' + Date.now());
    group.muridIds = group.muridIds || [];
    // Ensure a student is only in one group at a time
    groups.forEach(g => {
      g.muridIds = (g.muridIds || []).filter(id => !group.muridIds.includes(id));
    });
    groups.push(group);
    this.saveGroups(groups);
    return group;
  },
  updateGroup(groupId, data) {
    const groups = this.getGroups();
    if (data.muridIds) {
      groups.forEach(g => {
        if (g.id !== groupId) {
          g.muridIds = (g.muridIds || []).filter(id => !data.muridIds.includes(id));
        }
      });
    }
    const updated = groups.map(g => g.id === groupId ? { ...g, ...data } : g);
    this.saveGroups(updated);
  },
  deleteGroup(groupId) {
    const groups = this.getGroups().filter(g => g.id !== groupId);
    this.saveGroups(groups);
  },

  // Pos 2 Real-Time State (Wheel Spin by Guru & Collaborative LKK)
  getPos2State() {
    return this.get('pos2State') || { turnOrder: [], activeGroupId: null, assignments: {}, lkk: {} };
  },
  savePos2State(state, eventType = 'POS2_STATE_UPDATED', eventPayload = {}) {
    this.set('pos2State', state);
    RealtimeSync.emit(eventType, { state, ...eventPayload });
  },
  assignCaseToGroup(groupId, caseId, guruName = 'Guru') {
    const state = this.getPos2State();
    state.activeGroupId = groupId;
    if (!state.turnOrder.includes(groupId)) {
      state.turnOrder.push(groupId);
    }
    state.assignments[groupId] = {
      caseId,
      assignedAt: new Date().toISOString(),
      assignedBy: guruName
    };
    if (!state.lkk[groupId]) {
      state.lkk[groupId] = {
        answers: ['', '', '', '', ''],
        typing: null,
        submitted: false,
        score: 0,
        submittedAt: null
      };
    }
    this.savePos2State(state, 'POS2_CASE_ASSIGNED', { groupId, caseId });
  },
  updatePos2LKKField(groupId, fieldIdx, text, userName) {
    const state = this.getPos2State();
    if (!state.lkk[groupId]) {
      state.lkk[groupId] = { answers: ['', '', '', '', ''], typing: null, submitted: false, score: 0 };
    }
    state.lkk[groupId].answers[fieldIdx] = text;
    state.lkk[groupId].typing = { userName, fieldIdx, ts: Date.now() };
    this.savePos2State(state, 'POS2_LKK_TYPING', { groupId, fieldIdx, text, userName });
  },
  submitPos2LKK(groupId, submittedBy) {
    const state = this.getPos2State();
    if (!state.lkk[groupId]) return null;
    const answers = state.lkk[groupId].answers || [];
    const filledCount = answers.filter(a => (a || '').trim().length > 0).length;
    const pointsEarned = filledCount * 4; // 5 questions * 4 = 20 points max
    state.lkk[groupId].submitted = true;
    state.lkk[groupId].score = pointsEarned;
    state.lkk[groupId].submittedBy = submittedBy;
    state.lkk[groupId].submittedAt = new Date().toISOString();

    // Award points & save score for all members of this group
    const group = this.getGroupById(groupId);
    const caseId = state.assignments[groupId]?.caseId;
    if (group && group.muridIds) {
      const users = this.getUsers();
      group.muridIds.forEach(uid => {
        const u = users.find(x => x.id === uid);
        if (u) {
          u.poin = (u.poin || 0) + pointsEarned;
          if (!u.badges) u.badges = [];
          if (!u.badges.includes('pos2_done')) u.badges.push('pos2_done');
        }
        this.saveScore(uid, 'pos2', {
          completed: true,
          lastCase: caseId,
          jawaban: answers,
          kelompok: group.name,
          groupId: group.id,
          score: pointsEarned
        });
      });
      this.saveUsers(users);
    }

    this.savePos2State(state, 'POS2_LKK_SUBMITTED', { groupId, pointsEarned, submittedBy });
    return pointsEarned;
  },
  resetPos2State() {
    const fresh = { turnOrder: [], activeGroupId: null, assignments: {}, lkk: {} };
    this.savePos2State(fresh, 'POS2_RESET', {});
  },

  // Pos 3 Real-Time Group Quiz State
  getPos3GroupState() {
    return this.get('pos3GroupState') || { groups: {} };
  },
  getPos3ForGroup(groupId) {
    const all = this.getPos3GroupState();
    if (!all.groups[groupId]) {
      all.groups[groupId] = {
        currentIdx: 0,
        selectedOption: null,
        selectedBy: null,
        lockedAnswers: {},
        totalScore: 0,
        completed: false,
        lastFeedback: null
      };
      this.set('pos3GroupState', all);
    }
    return all.groups[groupId];
  },
  selectPos3GroupOption(groupId, qIdx, optionIdx, userName) {
    const all = this.getPos3GroupState();
    const gState = this.getPos3ForGroup(groupId);
    if (gState.lockedAnswers[qIdx]) return; // already submitted
    gState.currentIdx = qIdx;
    gState.selectedOption = optionIdx;
    gState.selectedBy = userName;
    all.groups[groupId] = gState;
    this.set('pos3GroupState', all);
    RealtimeSync.emit('POS3_OPTION_SELECTED', { groupId, qIdx, optionIdx, userName, gState });
  },
  submitPos3GroupAnswer(groupId, qIdx, userName) {
    const all = this.getPos3GroupState();
    const gState = this.getPos3ForGroup(groupId);
    if (gState.lockedAnswers[qIdx]) return gState.lockedAnswers[qIdx];

    const questions = this.getKuisKejutan();
    const q = questions[qIdx];
    if (!q) return null;

    const selected = gState.selectedOption !== null ? gState.selectedOption : -1;
    const isCorrect = selected === q.jawaban;
    const settings = this.getSettings();
    const points = isCorrect ? (settings.pointsBenar || 10) : (settings.pointsSalah || 0);

    const record = {
      qIdx,
      selected,
      correct: q.jawaban,
      isCorrect,
      points,
      lockedBy: userName,
      lockedAt: new Date().toISOString()
    };

    gState.lockedAnswers[qIdx] = record;
    gState.totalScore = Object.values(gState.lockedAnswers).reduce((sum, r) => sum + (r.points || 0), 0);
    gState.lastFeedback = {
      qIdx,
      no: qIdx + 1,
      isCorrect,
      points,
      totalScore: gState.totalScore,
      selectedText: selected >= 0 ? q.pilihan[selected] : '(Waktu Habis / Tidak Memilih)',
      correctText: q.pilihan[q.jawaban],
      explanation: q.penjelasan || '',
      lockedBy: userName,
      ts: Date.now()
    };

    if (Object.keys(gState.lockedAnswers).length >= questions.length) {
      gState.completed = true;
    }

    all.groups[groupId] = gState;
    this.set('pos3GroupState', all);

    // Sync score to group members
    const group = this.getGroupById(groupId);
    if (group && group.muridIds) {
      const users = this.getUsers();
      group.muridIds.forEach(uid => {
        const u = users.find(x => x.id === uid);
        if (u && points > 0) {
          u.poin = (u.poin || 0) + points;
        }
        if (u && gState.completed) {
          if (!u.badges) u.badges = [];
          if (!u.badges.includes('pos3_done')) u.badges.push('pos3_done');
        }
        const existing = this.getScoreByUser(uid);
        this.saveScore(uid, 'pos3', {
          ...existing.pos3,
          kuis: gState.totalScore,
          groupId: group.id,
          kelompok: group.name
        });
      });
      this.saveUsers(users);
    }

    RealtimeSync.emit('POS3_ANSWER_SUBMITTED', { groupId, qIdx, record, gState });
    return record;
  },
  navigatePos3GroupQuestion(groupId, nextIdx) {
    const all = this.getPos3GroupState();
    const gState = this.getPos3ForGroup(groupId);
    const questions = this.getKuisKejutan();
    if (nextIdx < 0 || nextIdx >= questions.length) return;
    gState.currentIdx = nextIdx;
    const locked = gState.lockedAnswers[nextIdx];
    gState.selectedOption = locked ? locked.selected : null;
    gState.selectedBy = locked ? locked.lockedBy : null;
    all.groups[groupId] = gState;
    this.set('pos3GroupState', all);
    RealtimeSync.emit('POS3_QUESTION_CHANGED', { groupId, nextIdx, gState });
  },
  resetPos3Group(groupId) {
    const all = this.getPos3GroupState();
    if (groupId) {
      delete all.groups[groupId];
    } else {
      all.groups = {};
    }
    this.set('pos3GroupState', all);
    RealtimeSync.emit('POS3_RESET', { groupId });
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
