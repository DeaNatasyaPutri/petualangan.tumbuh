// ============================================================
// DATA.JS — Default Data, IndexedDB Media Store, & Real-Time
//           Collaborative Synchronization Engine (RealtimeSync)
// ============================================================

const DEFAULT_DATA = {

  // ── USERS ──────────────────────────────────────────────────
  users: [
    { id: 'u1',  username: 'admin',       password: 'admin123',   role: 'admin', name: 'Administrator',                    avatar: '🔑', kelas: '-' },
    { id: 'u2',  username: 'Dea Natasya', password: 'Deanatasya', role: 'guru',  name: 'Dea Natasya',                      avatar: '👩‍🏫', kelas: '5A', aliasUsernames: ['Dea Natasya', 'dea natasya', 'Deanatasya', 'guru1', 'Ibu Dea', 'dea'] },
    { id: 'u3',  username: 'guru2',       password: 'guru456',    role: 'guru',  name: 'Bapak Jaya',                       avatar: '👨‍🏫', kelas: '5B' },
    // Kelompok 1 (g1)
    { id: 'u4',  username: 'Adilla Nisa Ardani',              password: 'murid123', role: 'murid', name: 'Adilla Nisa Ardani',              avatar: '🌸', kelas: '5A', groupId: 'g1', poin: 0, badges: [], aliasUsernames: ['murid1', 'adilla', 'adilla nisa ardani'] },
    { id: 'u5',  username: 'Fathimah Azzahra',                password: 'murid123', role: 'murid', name: 'Fathimah Azzahra',                avatar: '🌺', kelas: '5A', groupId: 'g1', poin: 0, badges: [], aliasUsernames: ['murid2', 'fathimah', 'fathimah azzahra'] },
    { id: 'u6',  username: 'Hafizh Azmi Syawal',              password: 'murid123', role: 'murid', name: 'Hafizh Azmi Syawal',              avatar: '🌱', kelas: '5A', groupId: 'g1', poin: 0, badges: [], aliasUsernames: ['murid3', 'hafizh', 'hafizh azmi syawal'] },
    { id: 'u7',  username: 'Muhammad Al Farizi',              password: 'murid123', role: 'murid', name: 'Muhammad Al Farizi',              avatar: '🦁', kelas: '5A', groupId: 'g1', poin: 0, badges: [], aliasUsernames: ['murid4', 'farizi', 'muhammad al farizi'] },
    { id: 'u8',  username: 'Rendi Ahmad Mahesa',              password: 'murid123', role: 'murid', name: 'Rendi Ahmad Mahesa',              avatar: '⭐', kelas: '5A', groupId: 'g1', poin: 0, badges: [], aliasUsernames: ['murid5', 'rendi', 'rendi ahmad mahesa'] },
    // Kelompok 2 (g2)
    { id: 'u9',  username: 'Anas Nurrayyan Alfaqih',          password: 'murid123', role: 'murid', name: 'Anas Nurrayyan Alfaqih',          avatar: '🌳', kelas: '5A', groupId: 'g2', poin: 0, badges: [], aliasUsernames: ['murid6', 'anas', 'anas nurrayyan alfaqih'] },
    { id: 'u10', username: 'Inayah Zochra Maligana',          password: 'murid123', role: 'murid', name: 'Inayah Zochra Maligana',          avatar: '🌻', kelas: '5A', groupId: 'g2', poin: 0, badges: [], aliasUsernames: ['murid7', 'inayah', 'inayah zochra maligana'] },
    { id: 'u11', username: 'Luna Keisha Azelina',             password: 'murid123', role: 'murid', name: 'Luna Keisha Azelina',             avatar: '🦋', kelas: '5A', groupId: 'g2', poin: 0, badges: [], aliasUsernames: ['murid8', 'luna', 'luna keisha azelina'] },
    { id: 'u12', username: 'Nazwan Al Azhar',                 password: 'murid123', role: 'murid', name: 'Nazwan Al Azhar',                 avatar: '🌿', kelas: '5A', groupId: 'g2', poin: 0, badges: [], aliasUsernames: ['murid9', 'nazwan', 'nazwan al azhar'] },
    { id: 'u13', username: 'Nor Naima Aisyah',                password: 'murid123', role: 'murid', name: 'Nor Naima Aisyah',                avatar: '🌸', kelas: '5A', groupId: 'g2', poin: 0, badges: [], aliasUsernames: ['murid10', 'naima', 'nor naima aisyah'] },
    // Kelompok 3 (g3)
    { id: 'u14', username: 'Annisa Aulia Rahmi Ariyadi',      password: 'murid123', role: 'murid', name: 'Annisa Aulia Rahmi Ariyadi',      avatar: '🌻', kelas: '5A', groupId: 'g3', poin: 0, badges: [], aliasUsernames: ['murid11', 'annisa', 'annisa aulia rahmi ariyadi'] },
    { id: 'u15', username: 'Aura Arifina',                    password: 'murid123', role: 'murid', name: 'Aura Arifina',                    avatar: '🌺', kelas: '5A', groupId: 'g3', poin: 0, badges: [], aliasUsernames: ['murid12', 'aura', 'aura arifina'] },
    { id: 'u16', username: 'Keisha Adara Rizky',              password: 'murid123', role: 'murid', name: 'Keisha Adara Rizky',              avatar: '🌸', kelas: '5A', groupId: 'g3', poin: 0, badges: [], aliasUsernames: ['murid13', 'keisha', 'keisha adara rizky'] },
    { id: 'u17', username: 'Muhammad Rayyan Alfarisi',        password: 'murid123', role: 'murid', name: 'Muhammad Rayyan Alfarisi',        avatar: '🦁', kelas: '5A', groupId: 'g3', poin: 0, badges: [], aliasUsernames: ['murid14', 'rayyan', 'muhammad rayyan alfarisi'] },
    { id: 'u18', username: 'Muhammad Syaifullah Zulkarnain',  password: 'murid123', role: 'murid', name: 'Muhammad Syaifullah Zulkarnain',  avatar: '🌱', kelas: '5A', groupId: 'g3', poin: 0, badges: [], aliasUsernames: ['murid15', 'syaifullah', 'muhammad syaifullah zulkarnain'] },
    // Kelompok 4 (g4)
    { id: 'u19', username: 'Haifa Nabila Husna',              password: 'murid123', role: 'murid', name: 'Haifa Nabila Husna',              avatar: '🦋', kelas: '5A', groupId: 'g4', poin: 0, badges: [], aliasUsernames: ['murid16', 'haifa', 'haifa nabila husna'] },
    { id: 'u20', username: 'Muhammad Hamdi',                  password: 'murid123', role: 'murid', name: 'Muhammad Hamdi',                  avatar: '🌿', kelas: '5A', groupId: 'g4', poin: 0, badges: [], aliasUsernames: ['murid17', 'hamdi', 'muhammad hamdi'] },
    { id: 'u21', username: 'Muhammad Hauzan Nabil Lakuleky',  password: 'murid123', role: 'murid', name: 'Muhammad Hauzan Nabil Lakuleky',  avatar: '🦁', kelas: '5A', groupId: 'g4', poin: 0, badges: [], aliasUsernames: ['murid18', 'hauzan', 'muhammad hauzan nabil lakuleky'] },
    { id: 'u22', username: 'Muhammad Rafa',                   password: 'murid123', role: 'murid', name: 'Muhammad Rafa',                   avatar: '⭐', kelas: '5A', groupId: 'g4', poin: 0, badges: [], aliasUsernames: ['murid19', 'rafa', 'muhammad rafa'] },
    { id: 'u23', username: 'Sayyidah Rahimah',                password: 'murid123', role: 'murid', name: 'Sayyidah Rahimah',                avatar: '🌸', kelas: '5A', groupId: 'g4', poin: 0, badges: [], aliasUsernames: ['murid20', 'sayyidah', 'sayyidah rahimah'] },
    // Kelompok 5 (g5)
    { id: 'u24', username: 'Kiandra Alvaronizam',             password: 'murid123', role: 'murid', name: 'Kiandra Alvaronizam',             avatar: '⭐', kelas: '5A', groupId: 'g5', poin: 0, badges: [], aliasUsernames: ['murid21', 'kiandra', 'kiandra alvaronizam'] },
    { id: 'u25', username: 'Muhammad Althaf',                 password: 'murid123', role: 'murid', name: 'Muhammad Althaf',                 avatar: '🌱', kelas: '5A', groupId: 'g5', poin: 0, badges: [], aliasUsernames: ['murid22', 'althaf', 'muhammad althaf'] },
    { id: 'u26', username: 'Muhammad Rizqi Musthafa',         password: 'murid123', role: 'murid', name: 'Muhammad Rizqi Musthafa',         avatar: '🦁', kelas: '5A', groupId: 'g5', poin: 0, badges: [], aliasUsernames: ['murid23', 'rizqi', 'muhammad rizqi musthafa'] },
    { id: 'u27', username: 'Najwa Zaina',                     password: 'murid123', role: 'murid', name: 'Najwa Zaina',                     avatar: '🌺', kelas: '5A', groupId: 'g5', poin: 0, badges: [], aliasUsernames: ['murid24', 'najwa', 'najwa zaina'] },
    { id: 'u28', username: 'Sultan Khatulistiwa Parama Ahmad',password: 'murid123', role: 'murid', name: 'Sultan Khatulistiwa Parama Ahmad',avatar: '🌳', kelas: '5A', groupId: 'g5', poin: 0, badges: [], aliasUsernames: ['murid25', 'sultan', 'sultan khatulistiwa parama ahmad'] },
    { id: 'u29', username: 'Zahra Nur Alifa',                 password: 'murid123', role: 'murid', name: 'Zahra Nur Alifa',                 avatar: '🌻', kelas: '5A', groupId: 'g5', poin: 0, badges: [], aliasUsernames: ['murid26', 'zahra', 'zahra nur alifa'] },
  ],

  // ── CLASSES ────────────────────────────────────────────────
  kelas: [
    { id: 'k5a', name: 'Kelas 5A', guruId: 'u2', muridIds: ['u4','u5','u6','u7','u8','u9','u10','u11','u12','u13','u14','u15','u16','u17','u18','u19','u20','u21','u22','u23','u24','u25','u26','u27','u28','u29'] },
    { id: 'k5b', name: 'Kelas 5B', guruId: 'u3', muridIds: [] },
  ],

  // ── GROUPS (Kelompok Belajar — Dikelola oleh Guru) ─────────
  groups: [
    { id: 'g1', name: 'Kelompok 1', emoji: '🌱', color: '#43A047', kelas: '5A', muridIds: ['u4', 'u5', 'u6', 'u7', 'u8'], memberIds: ['u4', 'u5', 'u6', 'u7', 'u8'] },
    { id: 'g2', name: 'Kelompok 2', emoji: '🌳', color: '#1565C0', kelas: '5A', muridIds: ['u9', 'u10', 'u11', 'u12', 'u13'], memberIds: ['u9', 'u10', 'u11', 'u12', 'u13'] },
    { id: 'g3', name: 'Kelompok 3', emoji: '🌻', color: '#FB8C00', kelas: '5A', muridIds: ['u14', 'u15', 'u16', 'u17', 'u18'], memberIds: ['u14', 'u15', 'u16', 'u17', 'u18'] },
    { id: 'g4', name: 'Kelompok 4', emoji: '🦋', color: '#8E24AA', kelas: '5A', muridIds: ['u19', 'u20', 'u21', 'u22', 'u23'], memberIds: ['u19', 'u20', 'u21', 'u22', 'u23'] },
    { id: 'g5', name: 'Kelompok 5', emoji: '⭐', color: '#E53935', kelas: '5A', muridIds: ['u24', 'u25', 'u26', 'u27', 'u28', 'u29'], memberIds: ['u24', 'u25', 'u26', 'u27', 'u28', 'u29'] },
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
      title: 'Serangan Belalang di Padang Rumput',
      emoji: '🦗',
      color: '#2E7D32',
      bgGradient: 'linear-gradient(135deg, #43A047, #1B5E20)',
      deskripsi: 'Di sebuah padang rumput yang hijau, hiduplah berbagai makhluk hidup, seperti rumput, belalang, katak, ular, dan elang. Selama ini, rumput tumbuh dengan subur dan menjadi sumber makanan bagi belalang. Belalang kemudian dimakan oleh katak, katak dapat dimakan oleh ular, dan ular menjadi salah satu mangsa elang. Namun, beberapa minggu terakhir, jumlah belalang meningkat sangat banyak. Belalang memakan rumput dalam jumlah besar sehingga sebagian padang rumput mulai gundul. Katak memang memiliki banyak makanan, tetapi persediaan rumput semakin berkurang. Jika keadaan ini terus berlangsung, hubungan antarmakhluk hidup di padang rumput tersebut dapat terganggu. Kini, kelompokmu mendapat tugas sebagai penjelajah ekosistem. Selidikilah masalah yang terjadi dan temukan cara untuk membantu menjaga keseimbangan ekosistem tersebut!',
      gambar: '🌿',
      imageData: null,
      pertanyaanPanduan: [
        'Apa masalah utama yang terjadi dalam kasus kelompokmu?',
        'Apa penyebab masalah tersebut? Jelaskan hubungan dengan rantai makanan!',
        'Apa yang mungkin terjadi pada makhluk hidup lain jika masalah terus berlanjut?',
        'Apa solusi yang kalian usulkan untuk mengatasi masalah ini?',
        'Jika jawaban awal kelompokmu ternyata kurang tepat, apa yang akan kalian lakukan untuk memperbaikinya?'
      ]
    },
    {
      id: 'c2',
      title: 'Katak yang Menghilang dari Sawah',
      emoji: '🐸',
      color: '#0277BD',
      bgGradient: 'linear-gradient(135deg, #29B6F6, #01579B)',
      deskripsi: 'Pak Rahmat memiliki sawah yang ditanami padi. Di sawah itu terdapat rumput, belalang, katak, ular, dan elang. Belalang memakan tumbuhan, katak memangsa belalang, ular memangsa katak, dan elang dapat memangsa ular. Beberapa waktu terakhir, Pak Rahmat menyadari bahwa katak di sawahnya semakin jarang ditemukan. Ia menduga hal ini terjadi karena lingkungan sawah sering terganggu dan tempat hidup katak semakin tidak nyaman. Pada saat yang sama, jumlah belalang justru semakin banyak. Daun-daun tanaman padi mulai rusak karena dimakan belalang. Pak Rahmat khawatir hasil panennya akan menurun. Ia ingin mengetahui mengapa berkurangnya satu jenis hewan dapat memengaruhi makhluk hidup lainnya. Kelompokmu diminta membantu Pak Rahmat memahami masalah tersebut dan mengusulkan solusi yang tepat.',
      gambar: '🌾',
      imageData: null,
      pertanyaanPanduan: [
        'Apa masalah utama yang terjadi dalam kasus kelompokmu?',
        'Apa penyebab masalah tersebut? Jelaskan hubungan dengan rantai makanan!',
        'Apa yang mungkin terjadi pada makhluk hidup lain jika masalah terus berlanjut?',
        'Apa solusi yang kalian usulkan untuk mengatasi masalah ini?',
        'Jika jawaban awal kelompokmu ternyata kurang tepat, apa yang akan kalian lakukan untuk memperbaikinya?'
      ]
    },
    {
      id: 'c3',
      title: 'Sawah yang Diserbu Tikus',
      emoji: '🐀',
      color: '#5D4037',
      bgGradient: 'linear-gradient(135deg, #8D6E63, #3E2723)',
      deskripsi: 'Di sebuah kawasan persawahan, terdapat rantai makanan yang melibatkan padi, tikus, ular, dan elang. Padi menjadi sumber makanan bagi tikus, sedangkan tikus dapat dimangsa oleh ular. Ular kemudian dapat menjadi mangsa elang. Suatu hari, para petani mulai menemukan banyak tanaman padi yang rusak. Setelah memeriksa sawah, mereka mengetahui bahwa jumlah tikus meningkat jauh lebih banyak daripada biasanya. Sementara itu, ular yang biasanya ditemukan di sekitar sawah kini semakin jarang terlihat. Sebagian petani mengusulkan agar semua ular yang masih ditemukan di sawah diusir atau dibunuh karena dianggap berbahaya. Namun, petani lainnya khawatir tindakan tersebut justru membuat jumlah tikus semakin sulit dikendalikan. Mereka belum mengetahui bagaimana perubahan jumlah ular dapat memengaruhi populasi tikus dan tanaman padi. Kelompokmu menjadi tim penyelidik. Analisislah hubungan antara hilangnya ular, meningkatnya jumlah tikus, dan kerusakan tanaman padi. Temukan solusi yang dapat membantu menjaga keseimbangan ekosistem sawah.',
      gambar: '🌾',
      imageData: null,
      pertanyaanPanduan: [
        'Apa masalah utama yang terjadi dalam kasus kelompokmu?',
        'Apa penyebab masalah tersebut? Jelaskan hubungan dengan rantai makanan!',
        'Apa yang mungkin terjadi pada makhluk hidup lain jika masalah terus berlanjut?',
        'Apa solusi yang kalian usulkan untuk mengatasi masalah ini?',
        'Jika jawaban awal kelompokmu ternyata kurang tepat, apa yang akan kalian lakukan untuk memperbaikinya?'
      ]
    },
    {
      id: 'c4',
      title: 'Elang yang Semakin Langka',
      emoji: '🦅',
      color: '#BF360C',
      bgGradient: 'linear-gradient(135deg, #FF7043, #BF360C)',
      deskripsi: 'Di sebuah hutan yang berdekatan dengan persawahan, hidup berbagai makhluk seperti tumbuhan, tikus, ular, dan elang. Tikus memakan bagian tumbuhan tertentu, ular memangsa tikus, sedangkan elang dapat memangsa ular maupun tikus. Dalam beberapa bulan terakhir, elang semakin jarang terlihat terbang di atas hutan. Warga menduga perubahan lingkungan dan berkurangnya tempat bersarang membuat elang kesulitan bertahan hidup. Mereka khawatir jika elang terus menghilang, keseimbangan hubungan makan dan dimakan di lingkungan tersebut akan berubah. Beberapa warga menganggap hilangnya elang tidak terlalu berpengaruh karena masih banyak hewan lain yang hidup di hutan. Namun, warga lainnya berpendapat bahwa setiap makhluk hidup memiliki peran dalam ekosistem. Mereka ingin mengetahui apa yang mungkin terjadi terhadap ular, tikus, dan tumbuhan apabila jumlah elang terus menurun. Kelompokmu diminta menyelidiki kemungkinan dampak berkurangnya elang. Gunakan hubungan dalam rantai makanan untuk menjelaskan pendapat kelompokmu dan usulkan tindakan yang dapat dilakukan untuk menjaga keberadaan elang.',
      gambar: '🌲',
      imageData: null,
      pertanyaanPanduan: [
        'Apa masalah utama yang terjadi dalam kasus kelompokmu?',
        'Apa penyebab masalah tersebut? Jelaskan hubungan dengan rantai makanan!',
        'Apa yang mungkin terjadi pada makhluk hidup lain jika masalah terus berlanjut?',
        'Apa solusi yang kalian usulkan untuk mengatasi masalah ini?',
        'Jika jawaban awal kelompokmu ternyata kurang tepat, apa yang akan kalian lakukan untuk memperbaikinya?'
      ]
    },
    {
      id: 'c5',
      title: 'Rumput yang Mengering',
      emoji: '🌾',
      color: '#F57F17',
      bgGradient: 'linear-gradient(135deg, #FFCA28, #F57F17)',
      deskripsi: 'Musim kemarau panjang melanda sebuah padang rumput. Hujan sudah lama tidak turun sehingga banyak rumput mengering dan mati. Padahal, rumput merupakan sumber makanan bagi belalang. Belalang kemudian menjadi makanan bagi katak, sedangkan katak dapat dimangsa oleh ular dan ular dapat dimangsa oleh elang. Karena rumput semakin sedikit, belalang kesulitan mendapatkan makanan. Jumlah belalang pun mulai menurun. Katak yang biasanya memangsa belalang juga menjadi lebih sulit menemukan makanan. Jika keadaan tersebut berlangsung lama, hewan lain yang bergantung pada hubungan makan dan dimakan di ekosistem itu mungkin ikut terdampak. Warga sekitar ingin memulihkan padang rumput, tetapi mereka perlu memahami mengapa masalah yang bermula dari tumbuhan dapat memengaruhi hewan-hewan lainnya. Mereka juga ingin mengetahui tindakan yang dapat dilakukan tanpa semakin merusak lingkungan. Kelompokmu mendapat misi untuk menemukan penyebab terganggunya rantai makanan, memperkirakan dampaknya bagi makhluk hidup lain, dan mengusulkan solusi yang dapat membantu memulihkan ekosistem.',
      gambar: '☀️',
      imageData: null,
      pertanyaanPanduan: [
        'Apa masalah utama yang terjadi dalam kasus kelompokmu?',
        'Apa penyebab masalah tersebut? Jelaskan hubungan dengan rantai makanan!',
        'Apa yang mungkin terjadi pada makhluk hidup lain jika masalah terus berlanjut?',
        'Apa solusi yang kalian usulkan untuk mengatasi masalah ini?',
        'Jika jawaban awal kelompokmu ternyata kurang tepat, apa yang akan kalian lakukan untuk memperbaikinya?'
      ]
    },
  ],

  // ── QUIZ QUESTIONS — Pos 3 Kuis Kejutan (Kelompok: 6 PG & 4 Esai) ──
  kuisKejutan: [
    {
      id: 'kk1', babak: 'utama', no: 1, type: 'pg',
      pertanyaan: 'Dalam rantai makanan padi → tikus → ular → elang, organisme yang berperan sebagai konsumen tingkat II adalah ...',
      pilihan: ['Tikus', 'Padi', 'Ular', 'Elang'],
      jawaban: 2,
      penjelasan: 'Kunci Jawaban: C. Ular'
    },
    {
      id: 'kk2', babak: 'utama', no: 2, type: 'pg',
      pertanyaan: 'Perhatikan rantai makanan berikut! Fitoplankton → ikan kecil → anjing laut → hiu. Fitoplankton berperan sebagai ....',
      pilihan: ['Produsen', 'Konsumen tingkat I', 'Pengurai', 'Konsumen tingkat II'],
      jawaban: 0,
      penjelasan: 'Kunci Jawaban: A. Produsen'
    },
    {
      id: 'kk3', babak: 'utama', no: 3, type: 'pg',
      pertanyaan: 'Ketika seekor hiena mati, tubuhnya diuraikan oleh pengurai. Peran pengurai dalam peristiwa tersebut adalah ....',
      pilihan: [
        'Memangsa rumput untuk memperoleh energi',
        'Menghentikan hubungan makan dan dimakan dalam ekosistem',
        'Menghasilkan makanan bagi rusa melalui fotosintesis',
        'Menguraikan tubuh makhluk hidup mati dan mengembalikan zat hara ke lingkungan'
      ],
      jawaban: 3,
      penjelasan: 'Kunci Jawaban: D. Menguraikan tubuh makhluk hidup mati dan mengembalikan zat hara ke lingkungan'
    },
    {
      id: 'kk4', babak: 'utama', no: 4, type: 'pg',
      pertanyaan: 'Perhatikan rantai makanan di gurun berikut! Rumput → rusa → hiena. Jika rumput berkurang drastis akibat kekeringan, dampak yang paling mungkin terjadi adalah ....',
      pilihan: [
        'Rusa memperoleh lebih banyak makanan sehingga populasinya pasti meningkat',
        'Rusa kesulitan memperoleh makanan dan hiena dapat terdampak karena mangsanya berkurang',
        'Rumput tidak lagi memiliki peran dalam kelangsungan hidup ekosistem',
        'Hiena berubah menjadi produsen agar tetap mendapatkan energi'
      ],
      jawaban: 1,
      penjelasan: 'Kunci Jawaban: B. Rusa kesulitan memperoleh makanan dan hiena dapat terdampak karena mangsanya berkurang'
    },
    {
      id: 'kk5', babak: 'utama', no: 5, type: 'pg',
      pertanyaan: 'Di ekosistem darat terdapat dua rantai makanan: rumput → rusa → hiena dan rumput → belalang → katak. Kedua rantai makanan tersebut saling berhubungan dalam satu ekosistem. Kesimpulan yang tepat adalah ....',
      pilihan: [
        'Setiap makhluk hidup hanya dapat menjadi bagian dari satu rantai makanan',
        'Rumput berperan sebagai konsumen karena dimakan oleh rusa dan belalang',
        'Rusa dan belalang harus saling memangsa agar ekosistem seimbang',
        'Beberapa rantai makanan dapat saling berhubungan membentuk jaring-jaring makanan'
      ],
      jawaban: 3,
      penjelasan: 'Kunci Jawaban: D. Beberapa rantai makanan dapat saling berhubungan membentuk jaring-jaring makanan'
    },
    {
      id: 'kk6', babak: 'utama', no: 6, type: 'pg',
      pertanyaan: 'Dalam rantai makanan laut, fitoplankton dimakan ikan kecil, ikan kecil dimakan anjing laut, dan anjing laut dimakan hiu. Jika jumlah fitoplankton menurun dalam waktu lama, alasan paling tepat mengapa hiu dapat ikut terdampak adalah ....',
      pilihan: [
        'Hiu dapat menghasilkan fitoplankton untuk menggantikan makanan yang berkurang',
        'Hiu memperoleh seluruh makanannya secara langsung dari fitoplankton',
        'Penurunan fitoplankton dapat mengurangi sumber makanan pada tingkat berikutnya sehingga memengaruhi ketersediaan makanan hiu',
        'Fitoplankton merupakan pengurai yang menjaga tubuh hiu tetap hidup'
      ],
      jawaban: 2,
      penjelasan: 'Kunci Jawaban: C. Penurunan fitoplankton dapat mengurangi sumber makanan pada tingkat berikutnya sehingga memengaruhi ketersediaan makanan hiu'
    },
    {
      id: 'kk7', babak: 'penentuan', no: 7, type: 'esai',
      pertanyaan: 'Dalam rantai makanan padi → tikus → ular → elang, jumlah ular menurun sehingga tikus semakin banyak dan tanaman padi semakin rusak. Perubahan ini menunjukkan bahwa berkurangnya satu jenis konsumen dapat memengaruhi jumlah organisme lain. Hubungan sebab-akibat yang menjelaskan peristiwa tersebut adalah ....',
      kunciEsai: 'Berkurangnya ular menyebabkan tekanan pemangsaan terhadap tikus menurun. Akibatnya, jumlah tikus dapat meningkat dan lebih banyak padi dimakan sehingga tanaman padi rusak.',
      penjelasan: 'Berkurangnya ular menyebabkan tekanan pemangsaan terhadap tikus menurun. Akibatnya, jumlah tikus dapat meningkat dan lebih banyak padi dimakan sehingga tanaman padi rusak.',
      kataKunci: ['ular', 'tikus', 'padi', 'mangsa', 'pemangsaan', 'meningkat', 'berkurang', 'rusak']
    },
    {
      id: 'kk8', babak: 'penentuan', no: 8, type: 'esai',
      pertanyaan: 'Dalam suatu ekosistem, beberapa rantai makanan saling berhubungan karena satu jenis produsen dapat dimakan oleh beberapa jenis konsumen. Jaringan hubungan makan dan dimakan tersebut disebut ....',
      kunciEsai: 'Jaring-jaring makanan',
      penjelasan: 'Jaring-jaring makanan',
      kataKunci: ['jaring-jaring makanan', 'jaring makanan', 'jaring']
    },
    {
      id: 'kk9', babak: 'penentuan', no: 9, type: 'esai',
      pertanyaan: 'Perhatikan rantai makanan laut berikut!\nFitoplankton → ikan kecil → anjing laut → hiu\nJika jumlah fitoplankton menurun drastis, jelaskan dampaknya terhadap rantai makanan tersebut dan alasan produsen penting bagi keseimbangan ekosistem laut!',
      kunciEsai: 'Jumlah ikan kecil menurun karena kekurangan makanan. Anjing laut dan hiu juga dapat terdampak karena makanan semakin berkurang. Produsen penting sebagai sumber makanan dan energi bagi konsumen.',
      penjelasan: 'Jumlah ikan kecil menurun karena kekurangan makanan. Anjing laut dan hiu juga dapat terdampak karena makanan semakin berkurang. Produsen penting sebagai sumber makanan dan energi bagi konsumen.',
      kataKunci: ['ikan', 'anjing laut', 'hiu', 'makanan', 'energi', 'produsen', 'menurun', 'berkurang']
    },
    {
      id: 'kk10', babak: 'penentuan', no: 10, type: 'esai',
      pertanyaan: 'Dalam suatu ekosistem sawah, jumlah tikus meningkat sehingga banyak tanaman padi rusak. Setelah berdiskusi, kelompokmu mengetahui bahwa jumlah ular yang memangsa tikus semakin berkurang. Jelaskan hubungan antara berkurangnya ular dan meningkatnya jumlah tikus!',
      kunciEsai: 'Berkurangnya ular menyebabkan tikus lebih sedikit dimangsa sehingga jumlah tikus meningkat. Salah satu tindakannya adalah menjaga habitat ular agar keseimbangan rantai makanan tetap terpelihara.',
      penjelasan: 'Berkurangnya ular menyebabkan tikus lebih sedikit dimangsa sehingga jumlah tikus meningkat. Salah satu tindakannya adalah menjaga habitat ular agar keseimbangan rantai makanan tetap terpelihara.',
      kataKunci: ['ular', 'tikus', 'mangsa', 'dimangsa', 'meningkat', 'habitat', 'seimbang', 'keseimbangan']
    },
  ],

  // ── TANTANGAN AKHIR QUESTIONS — Pos 3 (Individu: 10 Pilihan Ganda) ─
  tantanganAkhir: [
    {
      id: 'ta1', no: 1, type: 'pg',
      pertanyaan: 'Dalam rantai makanan, makhluk hidup yang dapat membuat makanannya sendiri disebut ....',
      pilihan: ['Konsumen', 'Pengurai', 'Produsen', 'Predator'],
      jawaban: 2,
      waktu: 30
    },
    {
      id: 'ta2', no: 2, type: 'pg',
      pertanyaan: 'Perhatikan rantai makanan berikut: rumput → belalang → katak → ular → elang. Makhluk hidup yang memakan belalang adalah ....',
      pilihan: ['Rumput', 'Elang', 'Ular', 'Katak'],
      jawaban: 3,
      waktu: 30
    },
    {
      id: 'ta3', no: 3, type: 'pg',
      pertanyaan: 'Di sawah terdapat rantai makanan padi → tikus → ular → elang. Jika tikus memakan padi, peran tikus dalam rantai makanan tersebut adalah ....',
      pilihan: ['Konsumen tingkat I', 'Produsen', 'Konsumen tingkat II', 'Pengurai'],
      jawaban: 0,
      waktu: 30
    },
    {
      id: 'ta4', no: 4, type: 'pg',
      pertanyaan: 'Kelompokmu menemukan rantai makanan rumput → belalang → katak → ular. Urutan tersebut menunjukkan bahwa ....',
      pilihan: [
        'Belalang memperoleh energi dari rumput',
        'Ular menjadi sumber makanan bagi rumput',
        'Katak membuat makanan untuk ular',
        'Rumput memperoleh makanan dari belalang'
      ],
      jawaban: 0,
      waktu: 30
    },
    {
      id: 'ta5', no: 5, type: 'pg',
      pertanyaan: 'Di sebuah sawah, jumlah katak menurun karena habitatnya terganggu. Pada saat yang sama, jumlah belalang meningkat dan tanaman padi rusak. Penjelasan yang paling tepat adalah ....',
      pilihan: [
        'Belalang bertambah karena katak menghasilkan makanan untuknya',
        'Padi rusak karena katak memakan seluruh tanaman',
        'Katak yang berkurang membuat belalang lebih sedikit dimangsa',
        'Berkurangnya katak langsung membuat padi berhenti tumbuh'
      ],
      jawaban: 2,
      waktu: 30
    },
    {
      id: 'ta6', no: 6, type: 'pg',
      pertanyaan: 'Di sawah, jumlah ular menurun dan jumlah tikus meningkat sehingga banyak padi rusak. Tindakan yang paling tepat untuk membantu memulihkan keseimbangan ekosistem adalah ....',
      pilihan: [
        'Menangkap seluruh tikus tanpa memeriksa penyebabnya',
        'Mengganti semua tanaman padi dengan rumput',
        'Membasmi semua ular yang tersisa',
        'Menjaga habitat dan mengurangi gangguan terhadap rantai makanan'
      ],
      jawaban: 3,
      waktu: 35
    },
    {
      id: 'ta7', no: 7, type: 'pg',
      pertanyaan: 'Musim kemarau menyebabkan rumput mengering. Jumlah belalang menurun, kemudian katak kesulitan mendapatkan makanan. Kesimpulan yang paling tepat adalah ....',
      pilihan: [
        'Katak dapat membuat makanan pengganti sendiri',
        'Perubahan pada produsen dapat memengaruhi konsumen berikutnya',
        'Jumlah elang pasti meningkat karena belalang berkurang',
        'Rumput yang mengering hanya memengaruhi tumbuhan lain'
      ],
      jawaban: 1,
      waktu: 35
    },
    {
      id: 'ta8', no: 8, type: 'pg',
      pertanyaan: 'Elang semakin langka di suatu ekosistem. Di sana, elang memangsa ular dan tikus. Mengapa berkurangnya elang perlu diperhatikan?',
      pilihan: [
        'Karena semua makhluk hidup akan langsung punah',
        'Karena elang merupakan satu-satunya produsen di hutan',
        'Karena berkurangnya pemangsa dapat mengubah populasi mangsa dan keseimbangan ekosistem',
        'Karena ular dan tikus tidak membutuhkan makanan lagi'
      ],
      jawaban: 2,
      waktu: 35
    },
    {
      id: 'ta9', no: 9, type: 'pg',
      pertanyaan: 'Kelompokmu menjawab bahwa berkurangnya ular tidak memengaruhi jumlah tikus. Setelah berdiskusi, kalian menyadari bahwa jawaban awal mungkin keliru. Apa langkah terbaik?',
      pilihan: [
        'Memeriksa kembali hubungan rantai makanan, mendiskusikan bukti, lalu memperbaiki jawaban',
        'Menghapus jawaban tanpa membahas alasannya',
        'Mempertahankan jawaban awal agar kelompok terlihat benar',
        'Menunggu kelompok lain memberikan semua jawaban'
      ],
      jawaban: 0,
      waktu: 35
    },
    {
      id: 'ta10', no: 10, type: 'pg',
      pertanyaan: 'Kelompokmu sudah mencoba dua cara menyelesaikan kasus rantai makanan, tetapi jawabannya belum tepat. Sikap yang paling mencerminkan Growth Mindset adalah ....',
      pilihan: [
        'Menganggap kelompok tidak mampu dan berhenti mencoba',
        'Menyalin jawaban kelompok lain tanpa memahaminya',
        'Menyalahkan anggota kelompok yang berbeda pendapat',
        'Mengevaluasi strategi, meminta masukan, lalu mencoba cara yang lebih tepat'
      ],
      jawaban: 3,
      waktu: 35
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
  },

  // ── POS 4 SHARED ──────────────────────────────────────────
  pos4Shared: {
    answers: {},
    currentScreen: 0,
    completed: false
  },

  // ── CLOUD MEDIA MAP (Cross-Device Uploaded PDF/Video/Image URLs) ──
  cloudMediaMap: {}
};

// ── Real-Time Synchronization Engine (BroadcastChannel + Storage + Local Server + 24/7 Cloud Sync) ──
const RealtimeSync = {
  _channel: null,
  _listeners: [],
  _clientId: 'client_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
  _serverUrl: (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http') && window.location.port === '8765')
    ? window.location.origin
    : 'http://127.0.0.1:8765',
  _cloudBaseUrl: 'https://ntfy.sh',
  _cloudTopic: 'ptumbuh_dea_sync_v11',
  _cloudMediaTopic: 'ptumbuh_dea_v11_media',
  _processedCloudIds: new Set(),
  _lastCloudId: null,
  _cloudPushTimers: {},
  _cloudEventTimer: null,
  _chunkBuffer: {},
  _sse: null,
  _lastServerVersion: 0,
  _lastEventTs: 0,
  _localServerFails: 0,
  _lastLocalAttempt: 0,
  _pollTimer: null,
  _cloudPollTimer: null,

  init() {
    // 1. BroadcastChannel for instant multi-tab / multi-window real-time sync
    if (typeof BroadcastChannel !== 'undefined' && !this._channel) {
      this._channel = new BroadcastChannel('petualangan_tumbuh_realtime');
      this._channel.onmessage = (e) => {
        if (e.data && e.data.senderId !== this._clientId) {
          this._notify(e.data);
          this._refreshActiveViewIfIdle();
        }
      };
    }

    // 2. Storage event listener across windows in the same profile
    window.addEventListener('storage', (e) => {
      if (e.key === 'tumbuh_rt_event' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload.senderId !== this._clientId) {
            this._notify(payload);
          }
        } catch {}
      } else if (e.key && e.key.startsWith('tumbuh_') && !e.key.startsWith('tumbuh_ts_') && e.key !== 'tumbuh_session') {
        this._refreshActiveViewIfIdle();
      }
    });

    // 3. Refresh when switching back to window/tab
    window.addEventListener('focus', () => {
      this.pullFromServer(true);
      this.pullFromCloud(true);
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.pullFromServer(true);
        this.pullFromCloud(true);
      }
    });

    // 4. Local Cross-Profile Server Polling (for localhost / LAN)
    this.pullFromServer(true);
    if (!this._pollTimer) {
      this._pollTimer = setInterval(() => this.pullFromServer(false), 600);
    }

    // 5. 24/7 Cross-Device / Cross-Network Cloud Real-Time Sync (Instant SSE + Fast Polling Fallback)
    this.pullFromCloud(true);
    this.connectCloudStream();
    if (!this._cloudPollTimer) {
      this._cloudPollTimer = setInterval(() => this.pullFromCloud(false), 1200);
    }
  },

  connectCloudStream() {
    if (typeof EventSource === 'undefined' || this._sse) return;
    try {
      const sse = new EventSource(`${this._cloudBaseUrl}/${this._cloudTopic}/sse`);
      this._sse = sse;
      sse.onmessage = async (e) => {
        try {
          const msg = JSON.parse(e.data);
          const changed = await this._processCloudMessage(msg, false);
          if (changed) {
            this._refreshActiveViewIfIdle();
          }
        } catch {}
      };
      sse.onerror = () => {
        try { sse.close(); } catch {}
        this._sse = null;
        setTimeout(() => this.connectCloudStream(), 2500);
      };
    } catch {}
  },

  async pullFromCloud(forceRefreshView = false) {
    try {
      const sinceParam = this._lastCloudId || 'all';
      const res = await fetch(`${this._cloudBaseUrl}/${this._cloudTopic}/json?poll=1&since=${encodeURIComponent(sinceParam)}`, {
        method: 'GET',
        cache: 'no-store'
      });
      if (!res.ok) return;
      const text = await res.text();
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

      if (lines.length === 0) {
        if (!this._lastCloudId) {
          this._lastCloudId = 'all';
          this.publishCloudSnapshot();
        }
        return;
      }

      let anyChanged = false;
      for (let i = 0; i < lines.length; i++) {
        try {
          const msg = JSON.parse(lines[i]);
          const isLast = (i === lines.length - 1);
          const changed = await this._processCloudMessage(msg, !isLast);
          if (changed) anyChanged = true;
        } catch {}
      }

      if (anyChanged || forceRefreshView) {
        this._refreshActiveViewIfIdle();
      }
    } catch {}
  },

  async _processCloudMessage(msg, isBatchReplay = false) {
    if (!msg || msg.event !== 'message' || !msg.id) return false;
    if (this._processedCloudIds.has(msg.id)) return false;
    this._processedCloudIds.add(msg.id);
    this._lastCloudId = msg.id;

    let payload = null;
    try {
      if (msg.attachment && msg.attachment.url) {
        const attRes = await fetch(msg.attachment.url, { cache: 'no-store' });
        if (!attRes.ok) return false;
        payload = await attRes.json();
      } else if (msg.message) {
        payload = JSON.parse(msg.message);
      }
    } catch {
      return false;
    }
    if (!payload || typeof payload !== 'object') return false;

    // Handle inline chunked payload reassembly for fast >3.5KB sync without attachment lag
    if (payload.type === 'KEY_CHUNK' && payload.chunkId) {
      if (payload.senderId === this._clientId) return false;
      let entry = this._chunkBuffer[payload.chunkId];
      if (!entry) {
        entry = { parts: new Array(payload.total), received: 0, total: payload.total, ts: Date.now() };
        this._chunkBuffer[payload.chunkId] = entry;
      }
      if (entry.parts[payload.idx] === undefined) {
        entry.parts[payload.idx] = payload.data;
        entry.received++;
      }
      if (entry.received < entry.total) return false;
      delete this._chunkBuffer[payload.chunkId];
      try {
        payload = JSON.parse(entry.parts.join(''));
      } catch {
        return false;
      }
    }

    return this._applyCloudPayload(payload, msg, isBatchReplay);
  },

  _applyCloudPayload(payload, msg, isBatchReplay = false) {
    let changed = false;

    // 1. Full state snapshot
    if (payload.type === 'FULL_SNAPSHOT' && payload.store && typeof payload.store === 'object') {
      const keyTsMap = payload.keyTimestamps || {};
      Object.keys(payload.store).forEach(k => {
        const incomingTs = keyTsMap[k] || payload.ts || ((msg.time || 0) * 1000);
        const localTs = DB.getKeyTs(k);
        const shouldApply = (payload.senderId === 'server_init')
          ? (localTs === 0)
          : (incomingTs >= localTs);
        if (shouldApply) {
          const incomingStr = JSON.stringify(payload.store[k]);
          if (incomingStr !== localStorage.getItem(DB._prefix + k)) {
            localStorage.setItem(DB._prefix + k, incomingStr);
            changed = true;
          }
          if (incomingTs > localTs) {
            DB.setKeyTs(k, incomingTs);
          }
        }
      });
      return changed;
    }

    // 2. System reset
    if (payload.type === 'SYSTEM_RESET' && payload.senderId !== this._clientId) {
      Object.keys(DEFAULT_DATA).forEach(key => {
        localStorage.removeItem(DB._prefix + key);
        DB.setKeyTs(key, 0);
      });
      DB.init();
      return true;
    }

    // 3. Single key update
    if (payload.key !== undefined && payload.value !== undefined) {
      const k = payload.key;
      const incomingTs = payload.ts || ((msg.time || 0) * 1000);
      const localTs = DB.getKeyTs(k);
      if (incomingTs >= localTs && payload.senderId !== this._clientId) {
        const incomingStr = JSON.stringify(payload.value);
        if (incomingStr !== localStorage.getItem(DB._prefix + k)) {
          localStorage.setItem(DB._prefix + k, incomingStr);
          changed = true;
        }
        DB.setKeyTs(k, incomingTs);
        if (k === 'topics') {
          this._notify({ type: 'TOPICS_UPDATED', topics: payload.value, ts: incomingTs });
        }
        if (!isBatchReplay && payload.event) {
          this._notify(payload.event);
        }
      }
    }

    // 4. Standalone real-time event
    if (payload.type === 'RT_EVENT' && payload.event && payload.senderId !== this._clientId) {
      const evTs = payload.ts || payload.event.ts || ((msg.time || 0) * 1000);
      const isRecent = (Date.now() - evTs) < 15000;
      if ((!isBatchReplay || isRecent) && evTs > this._lastEventTs) {
        this._lastEventTs = evTs;
        this._notify(payload.event);
      }
    }

    return changed;
  },

  async publishCloudSnapshot() {
    try {
      const store = {};
      const keyTimestamps = {};
      const now = Date.now();
      Object.keys(DEFAULT_DATA).forEach(k => {
        store[k] = DB.get(k);
        keyTimestamps[k] = DB.getKeyTs(k) || now;
      });
      const bodyStr = JSON.stringify({
        type: 'FULL_SNAPSHOT',
        senderId: this._clientId,
        ts: now,
        store,
        keyTimestamps
      });
      await fetch(`${this._cloudBaseUrl}/${this._cloudTopic}`, {
        method: 'POST',
        headers: { 'Filename': `snapshot_${now}.json` },
        body: bodyStr
      });
    } catch {}
  },

  pushKeyToCloud(key, value, ts) {
    if (this._cloudPushTimers[key]) {
      clearTimeout(this._cloudPushTimers[key]);
    }
    this._cloudPushTimers[key] = setTimeout(async () => {
      delete this._cloudPushTimers[key];
      try {
        const latestVal = DB.get(key);
        const latestTs = DB.getKeyTs(key) || ts || Date.now();
        const eventObj = {
          senderId: this._clientId,
          type: 'DATA_UPDATED',
          event: 'DATA_UPDATED',
          data: { key },
          payload: { key },
          ts: latestTs
        };
        const bodyStr = JSON.stringify({
          type: 'KEY_UPDATE',
          senderId: this._clientId,
          key,
          value: latestVal,
          ts: latestTs,
          event: eventObj
        });

        // Fast path 1: <= 3500 bytes -> 1 single inline SSE packet (~100ms)
        if (bodyStr.length <= 3500) {
          await fetch(`${this._cloudBaseUrl}/${this._cloudTopic}`, {
            method: 'POST',
            body: bodyStr
          });
          return;
        }

        // Fast path 2: 3501..28000 bytes -> parallel inline SSE chunks (~150ms, no attachment download lag!)
        if (bodyStr.length <= 28000) {
          const chunkSize = 3100;
          const total = Math.ceil(bodyStr.length / chunkSize);
          const chunkId = `${key}_${latestTs}_${Math.random().toString(36).slice(2, 6)}`;
          for (let i = 0; i < total; i++) {
            const slice = bodyStr.slice(i * chunkSize, (i + 1) * chunkSize);
            const chunkMsg = JSON.stringify({
              type: 'KEY_CHUNK',
              senderId: this._clientId,
              chunkId,
              idx: i,
              total,
              data: slice,
              ts: latestTs
            });
            await fetch(`${this._cloudBaseUrl}/${this._cloudTopic}`, {
              method: 'POST',
              body: chunkMsg
            });
          }
          return;
        }

        // Fallback for very large payloads (>28KB): send as file attachment
        await fetch(`${this._cloudBaseUrl}/${this._cloudTopic}`, {
          method: 'POST',
          headers: { 'Filename': `sync_${key}_${latestTs}.json` },
          body: bodyStr
        });
      } catch {}
    }, 50);
  },

  async pullFromServer(forceRefreshView = false) {
    const now = Date.now();
    // If local server is not running on this device, avoid spamming connection timeouts
    if (!forceRefreshView && this._localServerFails >= 2 && (now - this._lastLocalAttempt) < 15000) {
      return;
    }
    this._lastLocalAttempt = now;

    try {
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = ctrl ? setTimeout(() => ctrl.abort(), 750) : null;
      const res = await fetch(`${this._serverUrl}/api/sync?since=${this._lastServerVersion}`, {
        method: 'GET',
        cache: 'no-store',
        signal: ctrl ? ctrl.signal : undefined
      });
      if (timer) clearTimeout(timer);
      if (!res.ok) {
        this._localServerFails++;
        return;
      }
      this._localServerFails = 0;
      const json = await res.json();
      if (!json || !json.ok) return;

      if (json.changed && json.store) {
        const storeKeys = Object.keys(json.store);
        if (storeKeys.length === 0) {
          const localDump = {};
          const keyTimestamps = {};
          Object.keys(DEFAULT_DATA).forEach(k => {
            localDump[k] = DB.get(k);
            keyTimestamps[k] = DB.getKeyTs(k);
          });
          await fetch(`${this._serverUrl}/api/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ store: localDump, keyTimestamps, onlyIfEmpty: true })
          });
        } else {
          const serverKeyTs = json.keyTimestamps || {};
          let anyChanged = false;

          storeKeys.forEach(k => {
            const valToStore = json.store[k];
            const incomingTs = serverKeyTs[k] || json.version || 0;
            const localTs = DB.getKeyTs(k);

            if (localTs > incomingTs && incomingTs > 0) {
              this.pushKeyToLocalServer(k, DB.get(k), localTs);
              return;
            }

            const incomingStr = JSON.stringify(valToStore);
            const currentStr = localStorage.getItem(DB._prefix + k);
            if (incomingStr !== currentStr) {
              localStorage.setItem(DB._prefix + k, incomingStr);
              anyChanged = true;
            }
            if (incomingTs > localTs) {
              DB.setKeyTs(k, incomingTs);
            }
          });
          this._lastServerVersion = json.version || 0;

          if (json.lastEvent && json.lastEvent.ts > this._lastEventTs && json.lastEvent.senderId !== this._clientId) {
            this._lastEventTs = json.lastEvent.ts;
            this._notify(json.lastEvent);
          }
          if (anyChanged || forceRefreshView) {
            this._refreshActiveViewIfIdle();
          }
        }
      }
    } catch {
      this._localServerFails++;
    }
  },

  async pushKeyToLocalServer(key, value, ts) {
    if (this._localServerFails >= 3) return;
    try {
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = ctrl ? setTimeout(() => ctrl.abort(), 800) : null;
      const res = await fetch(`${this._serverUrl}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, ts: ts || Date.now(), explicit: true }),
        signal: ctrl ? ctrl.signal : undefined
      });
      if (timer) clearTimeout(timer);
      if (res.ok) {
        this._localServerFails = 0;
        const json = await res.json();
        if (json.version) this._lastServerVersion = json.version;
      }
    } catch {
      this._localServerFails++;
    }
  },

  async pushKeyToServer(key, value, ts) {
    const stamp = ts || Date.now();
    this.pushKeyToLocalServer(key, value, stamp);
    this.pushKeyToCloud(key, value, stamp);
  },

  _refreshActiveViewIfIdle() {
    // Do not interrupt if a modal is open or user is actively typing in an input/textarea or spinning a wheel
    if (document.getElementById('modal-backdrop') || document.querySelector('.modal-backdrop.visible')) {
      return;
    }
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
      // Still update Pos2 collaborative LKK fields in-place if on Pos2
      if (window.App && App.currentView === 'pos2' && window.Pos2View) {
        Pos2View._syncLKKFieldsInPlace?.();
      }
      return;
    }
    if (window.Pos2View && (Pos2View._spinningGroup || Pos2View._spinningCase)) return;
    if (window.Pos3View && (Pos3View._kkTimer || Pos3View._ta?.timer)) {
      // During active timer on Pos 3, only update live options/scoreboard in-place
      Pos3View._syncInPlaceFromStorage?.();
      return;
    }

    if (window.App && App.currentView) {
      switch (App.currentView) {
        case 'admin': AdminView.render(AdminView._currentTab || 'overview'); break;
        case 'guru':  GuruView.render(GuruView._currentTab || 'overview'); break;
        case 'murid': MuridView.render(); break;
        case 'pos1':  Pos1View.render(); break;
        case 'pos2':  Pos2View.render(); break;
        case 'pos3':
          if (window.Pos3View) {
            if (Pos3View._mode === 'kuis') Pos3View._syncInPlaceFromStorage?.();
            else Pos3View.render();
          }
          break;
        case 'pos4':  Pos4View._syncInPlaceOrRender?.(); break;
      }
    }
  },

  emit(eventType, data = {}, skipCloud = false) {
    const payload = {
      senderId: this._clientId,
      type: eventType,
      event: eventType,
      data,
      payload: data,
      ts: Date.now()
    };
    this._lastEventTs = payload.ts;

    if (this._channel) {
      try { this._channel.postMessage(payload); } catch {}
    }

    try {
      localStorage.setItem('tumbuh_rt_event', JSON.stringify(payload));
    } catch {}

    // Broadcast event to Local Server
    fetch(`${this._serverUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: payload })
    }).then(r => r.json()).then(j => {
      if (j && j.version) this._lastServerVersion = j.version;
    }).catch(() => {});

    // Broadcast standalone real-time events (e.g. wheel spin, quiz lock) to Cloud
    if (!skipCloud && eventType !== 'DATA_UPDATED') {
      if (this._cloudEventTimer) clearTimeout(this._cloudEventTimer);
      this._cloudEventTimer = setTimeout(() => {
        const bodyStr = JSON.stringify({
          type: 'RT_EVENT',
          senderId: this._clientId,
          ts: payload.ts,
          event: payload
        });
        const headers = bodyStr.length > 3500 ? { 'Filename': `evt_${payload.ts}.json` } : {};
        fetch(`${this._cloudBaseUrl}/${this._cloudTopic}`, {
          method: 'POST',
          headers,
          body: bodyStr
        }).catch(() => {});
      }, 150);
    }
  },

  subscribe(callback) {
    this._listeners.push(callback);
    return () => {
      this._listeners = this._listeners.filter(cb => cb !== callback);
    };
  },

  on(callback) {
    return this.subscribe(callback);
  },

  _notify(rawPayload) {
    // Normalize payload so both msg.type/msg.data and msg.event/msg.payload work everywhere
    const payload = {
      ...rawPayload,
      type: rawPayload.type || rawPayload.event,
      event: rawPayload.event || rawPayload.type,
      data: rawPayload.data || rawPayload.payload || {},
      payload: rawPayload.payload || rawPayload.data || {}
    };
    this._listeners.forEach(cb => {
      try { cb(payload); } catch (err) { console.error(err); }
    });
  }
};

// ── IndexedDB + Local Server + 24/7 Cloud Media Store for Large Files (Video/PDF/Images) ──
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

    // 1. Immediately store into local IndexedDB (instant response in ~5ms!)
    await new Promise((resolve, reject) => {
      const tx = db.transaction(this._storeName, 'readwrite');
      const store = tx.objectStore(this._storeName);
      store.put({
        id,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        blob: file,
        createdAt: new Date().toISOString()
      });
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });

    // 2. Dispatch background server & cloud uploads (non-blocking, keeps UI super fast!)
    this._uploadInBackground(id, file);

    return { id, name: file.name, type: file.type || 'application/octet-stream', size: file.size };
  },

  _uploadInBackground(id, file) {
    // A. Local Sync Server (instant on same machine/LAN)
    try {
      fetch(`${RealtimeSync._serverUrl}/api/media/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'X-File-Name': encodeURIComponent(file.name || id),
          'X-File-Type': file.type || 'application/octet-stream'
        },
        body: file
      }).catch(() => {});
    } catch {}

    // B. 24/7 Cloud Media Upload (in background for other remote devices/phones)
    if (file.size <= 15 * 1024 * 1024) {
      setTimeout(async () => {
        try {
          const safeName = (file.name || id).replace(/[^a-zA-Z0-9._-]/g, '_');
          const cloudRes = await fetch(`${RealtimeSync._cloudBaseUrl}/${RealtimeSync._cloudMediaTopic}`, {
            method: 'POST',
            headers: { 'Filename': safeName },
            body: file
          });
          if (cloudRes.ok) {
            const cloudJson = await cloudRes.json();
            const attUrl = cloudJson?.attachment?.url;
            if (attUrl) {
              const map = DB.get('cloudMediaMap') || {};
              map[id] = {
                id,
                url: attUrl,
                name: file.name,
                type: file.type || 'application/octet-stream',
                size: file.size
              };
              DB.set('cloudMediaMap', map);
            }
          }
        } catch {}
      }, 50);
    }
  },

  async getFileUrl(id) {
    if (!id) return null;

    // 1. Check local IndexedDB first (0ms instant!)
    let localRecord = null;
    try {
      const db = await this._open();
      localRecord = await new Promise((resolve) => {
        const tx = db.transaction(this._storeName, 'readonly');
        const store = tx.objectStore(this._storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {}

    if (localRecord && localRecord.blob) {
      const mime = localRecord.type || (localRecord.name?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'video/mp4');
      const typedBlob = new Blob([localRecord.blob], { type: mime });
      const blobUrl = URL.createObjectURL(typedBlob);

      // On file:// protocol, Chrome blocks blob:null/ in PDF <embed>; convert PDF <=15MB to data: URL
      if (window.location.protocol === 'file:' && mime === 'application/pdf' && typedBlob.size <= 15 * 1024 * 1024) {
        try {
          const dataUrl = await new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.onerror = () => rej();
            reader.readAsDataURL(typedBlob);
          });
          return { url: dataUrl, blobUrl, name: localRecord.name, type: mime };
        } catch {}
      }

      return { url: blobUrl, blobUrl, name: localRecord.name, type: mime };
    }

    // 2. Check Local Sync Server with fast 600ms timeout
    const mediaUrl = `${RealtimeSync._serverUrl}/api/media/${id}`;
    try {
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const t = ctrl ? setTimeout(() => ctrl.abort(), 600) : null;
      const check = await fetch(mediaUrl, { method: 'HEAD', signal: ctrl ? ctrl.signal : undefined });
      if (t) clearTimeout(t);
      if (check.ok) {
        const serverName = check.headers.get('X-File-Name');
        return {
          url: mediaUrl,
          blobUrl: mediaUrl,
          name: serverName ? decodeURIComponent(serverName) : id,
          type: check.headers.get('Content-Type') || 'application/octet-stream'
        };
      }
    } catch {}

    // 3. Check 24/7 Cloud Media Map (for other devices/phones/laptops)
    const cloudMap = DB.get('cloudMediaMap') || {};
    const cloudEntry = cloudMap[id];
    if (cloudEntry && cloudEntry.url) {
      try {
        const resp = await fetch(cloudEntry.url);
        if (resp.ok) {
          const rawBlob = await resp.blob();
          const mime = cloudEntry.type || (cloudEntry.name?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'video/mp4');
          const typedBlob = new Blob([rawBlob], { type: mime });
          try {
            const db = await this._open();
            const tx = db.transaction(this._storeName, 'readwrite');
            tx.objectStore(this._storeName).put({
              id,
              name: cloudEntry.name || id,
              type: mime,
              size: typedBlob.size,
              blob: typedBlob,
              createdAt: new Date().toISOString()
            });
          } catch {}
          const blobUrl = URL.createObjectURL(typedBlob);
          return { url: blobUrl, blobUrl, name: cloudEntry.name || id, type: mime };
        }
      } catch {}
    }

    return null;
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
  _tsPrefix: 'tumbuh_ts_',

  getKeyTs(key) {
    try {
      return parseInt(localStorage.getItem(this._tsPrefix + key) || '0', 10) || 0;
    } catch { return 0; }
  },

  setKeyTs(key, ts) {
    try {
      localStorage.setItem(this._tsPrefix + key, String(ts || 0));
    } catch {}
  },

  init() {
    // Merge restored snapshot for Dea Natasya into DEFAULT_DATA & initialize baseline
    if (typeof window !== 'undefined' && window.RESTORED_DEA_DATA) {
      Object.keys(window.RESTORED_DEA_DATA).forEach(k => {
        DEFAULT_DATA[k] = window.RESTORED_DEA_DATA[k];
      });
      if (!localStorage.getItem('tumbuh_clean_v11')) {
        Object.keys(DEFAULT_DATA).forEach(k => {
          localStorage.setItem(this._prefix + k, JSON.stringify(DEFAULT_DATA[k]));
          this.setKeyTs(k, 0);
        });
        localStorage.setItem('tumbuh_clean_v11', '1');
      }
    }

    Object.keys(DEFAULT_DATA).forEach(key => {
      if (!localStorage.getItem(this._prefix + key)) {
        localStorage.setItem(this._prefix + key, JSON.stringify(DEFAULT_DATA[key]));
      }
    });

    // Ensure Guru u2 has Dea Natasya name/username, password Deanatasya, and aliases
    const currentUsers = this.get('users') || [];
    let deaUpdated = false;
    currentUsers.forEach(u => {
      if (u.id === 'u2') {
        if (u.name === 'Bu Sari Dewi' || u.name === 'Ibu Dea') { u.name = 'Dea Natasya'; deaUpdated = true; }
        if (u.username === 'guru1') { u.username = 'Dea Natasya'; deaUpdated = true; }
        if (u.password === 'guru123') { u.password = 'Deanatasya'; deaUpdated = true; }
        u.aliasUsernames = ['Dea Natasya', 'dea natasya', 'Deanatasya', 'guru1', 'Ibu Dea', 'dea'];
      }
    });
    if (deaUpdated) {
      localStorage.setItem(this._prefix + 'users', JSON.stringify(currentUsers));
    }

    // Migrate & normalize groups (ensure both muridIds and memberIds exist and match)
    const rawGroups = this.get('groups') || DEFAULT_DATA.groups;
    let groupsChanged = false;
    const groups = rawGroups.map(g => {
      const ids = g.memberIds || g.muridIds || [];
      if (!g.memberIds || !g.muridIds || JSON.stringify(g.memberIds) !== JSON.stringify(g.muridIds)) {
        groupsChanged = true;
      }
      return { ...g, muridIds: [...ids], memberIds: [...ids] };
    });
    if (groupsChanged) {
      localStorage.setItem(this._prefix + 'groups', JSON.stringify(groups));
    }

    // Migrate legacy users if needed
    const users = this.get('users') || [];
    let usersUpdated = false;
    DEFAULT_DATA.users.forEach(defU => {
      if (!users.some(u => u.id === defU.id)) {
        users.push(defU);
        usersUpdated = true;
      }
    });
    groups.forEach(g => {
      (g.memberIds || []).forEach(uid => {
        const u = users.find(x => x.id === uid);
        if (u && u.groupId !== g.id) {
          u.groupId = g.id;
          usersUpdated = true;
        }
      });
    });
    if (usersUpdated) {
      localStorage.setItem(this._prefix + 'users', JSON.stringify(users));
    }

    // Ensure tantanganAkhir has type property on legacy saved items
    const ta = this.get('tantanganAkhir') || [];
    let updated = false;
    ta.forEach(q => {
      if (!q.type) { q.type = 'pg'; updated = true; }
    });
    if (updated) {
      localStorage.setItem(this._prefix + 'tantanganAkhir', JSON.stringify(ta));
    }

    // Backfill materials history from topics & cases so past uploads always appear in history
    const existingMaterials = this.get('materials') || [];
    let matChanged = false;
    const currentTopics = this.get('topics') || [];
    currentTopics.forEach(t => {
      if (t.pdfMediaId && !existingMaterials.some(m => m.pdfMediaId === t.pdfMediaId)) {
        existingMaterials.push({
          id: 'm_auto_' + t.id + '_pdf',
          title: `${t.title} (${t.pdfFileName || 'Dokumen PDF'})`,
          type: 'pdf',
          topicId: t.id,
          topicTitle: t.title,
          pdfMediaId: t.pdfMediaId,
          fileName: t.pdfFileName || 'Dokumen.pdf',
          fileSize: 'Modul PDF',
          guruId: 'u2',
          uploaderName: 'Dea Natasya',
          createdAt: new Date().toISOString()
        });
        matChanged = true;
      }
      if (t.videoMediaId && !existingMaterials.some(m => m.videoMediaId === t.videoMediaId)) {
        existingMaterials.push({
          id: 'm_auto_' + t.id + '_video',
          title: `${t.title} (${t.videoFileName || 'Video MP4'})`,
          type: 'video',
          topicId: t.id,
          topicTitle: t.title,
          videoMediaId: t.videoMediaId,
          fileName: t.videoFileName || 'Video.mp4',
          fileSize: 'Video Lokal',
          guruId: 'u2',
          uploaderName: 'Dea Natasya',
          createdAt: new Date().toISOString()
        });
        matChanged = true;
      }
      if (t.videoUrl && !t.videoMediaId && !existingMaterials.some(m => m.url === t.videoUrl)) {
        existingMaterials.push({
          id: 'm_auto_' + t.id + '_url',
          title: `${t.title} (Tautan Video YouTube)`,
          type: 'link',
          topicId: t.id,
          topicTitle: t.title,
          url: t.videoUrl,
          fileName: t.videoUrl,
          fileSize: 'Tautan YouTube',
          guruId: 'u2',
          uploaderName: 'Dea Natasya',
          createdAt: new Date().toISOString()
        });
        matChanged = true;
      }
    });

    const currentCases = this.get('cases') || [];
    currentCases.forEach(c => {
      if (c.imageData && !existingMaterials.some(m => m.caseId === c.id)) {
        existingMaterials.push({
          id: 'm_auto_case_' + c.id,
          title: `Gambar Studi Kasus: ${c.title}`,
          type: 'image',
          caseId: c.id,
          imageData: c.imageData,
          fileName: `${c.title}.png`,
          fileSize: 'Gambar JPG/PNG',
          guruId: 'u2',
          uploaderName: 'Dea Natasya',
          createdAt: new Date().toISOString()
        });
        matChanged = true;
      }
    });

    if (matChanged) {
      localStorage.setItem(this._prefix + 'materials', JSON.stringify(existingMaterials));
    }

    RealtimeSync.init();
  },

  get(key) {
    try {
      const raw = localStorage.getItem(this._prefix + key);
      return raw ? JSON.parse(raw) : DEFAULT_DATA[key];
    } catch { return DEFAULT_DATA[key]; }
  },

  set(key, value) {
    const ts = Date.now();
    localStorage.setItem(this._prefix + key, JSON.stringify(value));
    this.setKeyTs(key, ts);
    RealtimeSync.pushKeyToServer(key, value, ts);
    RealtimeSync.emit('DATA_UPDATED', { key, ts }, false);
  },

  reset() {
    Object.keys(DEFAULT_DATA).forEach(key => {
      localStorage.removeItem(this._prefix + key);
      this.setKeyTs(key, 0);
    });
    localStorage.removeItem(this._prefix + 'pos4Shared');
    MediaDB.clearAll();
    fetch(`${RealtimeSync._serverUrl}/api/reset`, { method: 'POST' }).catch(() => {});
    fetch(`${RealtimeSync._cloudBaseUrl}/${RealtimeSync._cloudTopic}`, {
      method: 'POST',
      body: JSON.stringify({ type: 'SYSTEM_RESET', senderId: RealtimeSync._clientId, ts: Date.now() })
    }).catch(() => {});
    this.init();
    RealtimeSync.emit('SYSTEM_RESET', {}, true);
  },

  // Users
  getUsers()          { return this.get('users'); },
  getUserById(id)     { return this.getUsers().find(u => u.id === id); },
  getUserByUsername(u){ return this.getUsers().find(x => x.username === u); },
  saveUsers(users)    { this.set('users', users); },

  addUser(user) {
    const users = this.getUsers();
    user.id = 'u' + Date.now();
    // If adding a student and they don't have a groupId yet, assign to first group so they are immediately connected
    if (user.role === 'murid' && !user.groupId) {
      const groups = this.getGroups();
      if (groups.length > 0) {
        user.groupId = groups[0].id;
        const g0 = groups[0];
        const ids = Array.from(new Set([...(g0.memberIds || g0.muridIds || []), user.id]));
        g0.memberIds = ids;
        g0.muridIds = ids;
        this.set('groups', groups);
      }
    }
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

  // Groups (Kelompok Belajar — Normalized memberIds & muridIds)
  getGroups() {
    const raw = this.get('groups') || [];
    return raw.map(g => {
      const ids = g.memberIds || g.muridIds || [];
      return { ...g, memberIds: ids, muridIds: ids };
    });
  },
  getGroupById(id) { return this.getGroups().find(g => g.id === id) || null; },
  getGroupByUserId(userId) {
    const groups = this.getGroups();
    const byMember = groups.find(g => (g.memberIds || []).includes(userId));
    if (byMember) return byMember;
    const u = this.getUserById(userId);
    if (u && u.groupId) {
      const byAttr = groups.find(g => g.id === u.groupId);
      if (byAttr) return byAttr;
    }
    // Fallback to first group if student isn't in any group yet so all edits stay synced
    return groups[0] || null;
  },
  saveGroups(groups) {
    const normalized = groups.map(g => {
      const ids = g.memberIds || g.muridIds || [];
      return { ...g, memberIds: ids, muridIds: ids };
    });
    this.set('groups', normalized);
    const users = this.getUsers();
    users.forEach(u => {
      if (u.role === 'murid') {
        const foundGroup = normalized.find(g => (g.memberIds || []).includes(u.id));
        u.groupId = foundGroup ? foundGroup.id : (normalized[0]?.id || null);
      }
    });
    this.saveUsers(users);
    RealtimeSync.emit('GROUPS_UPDATED', { groups: normalized });
  },
  addGroup(group) {
    const groups = this.getGroups();
    group.id = group.id || ('g' + Date.now());
    const ids = group.memberIds || group.muridIds || [];
    group.memberIds = ids;
    group.muridIds = ids;
    groups.forEach(g => {
      const filtered = (g.memberIds || []).filter(id => !ids.includes(id));
      g.memberIds = filtered;
      g.muridIds = filtered;
    });
    groups.push(group);
    this.saveGroups(groups);
    return group;
  },
  updateGroup(groupId, data) {
    const groups = this.getGroups();
    const incomingIds = data.memberIds || data.muridIds;
    if (incomingIds) {
      data.memberIds = incomingIds;
      data.muridIds = incomingIds;
      groups.forEach(g => {
        if (g.id !== groupId) {
          const filtered = (g.memberIds || []).filter(id => !incomingIds.includes(id));
          g.memberIds = filtered;
          g.muridIds = filtered;
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

  // Pos 2 Real-Time State (Wheel Spin by Guru & Collaborative LKK synced per Group across accounts)
  getPos2State() {
    const state = this.get('pos2State') || { turnOrder: [], activeGroupId: null, assignments: {}, lkk: {} };
    if (!state.assignments) state.assignments = {};
    if (!state.lkk) state.lkk = {};
    if (!state.turnOrder) state.turnOrder = [];

    // Pastikan 1 studi kasus hanya dimiliki oleh 1 kelompok (gunakan Set pada daftar gid agar grup yang sama tidak dicek 2 kali!)
    const seenCases = new Set();
    const uniqueGroupIds = Array.from(new Set([...(state.turnOrder || []), ...Object.keys(state.assignments)]));
    let deduped = false;
    uniqueGroupIds.forEach(gid => {
      const a = state.assignments[gid];
      if (a && a.caseId) {
        if (seenCases.has(a.caseId)) {
          delete state.assignments[gid];
          deduped = true;
        } else {
          seenCases.add(a.caseId);
        }
      }
    });
    if (deduped) {
      this.set('pos2State', state);
    }

    return state;
  },
  savePos2State(state, eventType = 'POS2_STATE_UPDATED', eventPayload = {}) {
    this.set('pos2State', state);
    RealtimeSync.emit(eventType, { state, ...eventPayload });
  },
  assignCaseToGroup(groupId, caseId, guruName = 'Guru') {
    const state = this.getPos2State();
    if (!state.turnOrder.includes(groupId)) {
      state.turnOrder.push(groupId);
    }
    const assignObj = {
      caseId,
      assignedAt: new Date().toISOString(),
      assignedBy: guruName
    };
    state.assignments[groupId] = assignObj;
    if (!state.lkk[groupId]) {
      state.lkk[groupId] = {
        answers: ['', '', '', '', ''],
        typing: null,
        lastTypedBy: null,
        submitted: false,
        score: 0,
        pointsEarned: 0,
        submittedAt: null
      };
    }

    // Otomatis berpindah ke kelompok selanjutnya sesuai urutan pengundian di Roda 1 (turnOrder)
    const turnOrder = state.turnOrder || [];
    const curTurnIdx = turnOrder.indexOf(groupId);
    let nextInTurnOrder = null;
    if (curTurnIdx >= 0 && turnOrder.length > 0) {
      for (let offset = 1; offset <= turnOrder.length; offset++) {
        const candidateId = turnOrder[(curTurnIdx + offset) % turnOrder.length];
        if (!state.assignments?.[candidateId]?.caseId) {
          nextInTurnOrder = candidateId;
          break;
        }
      }
    } else {
      nextInTurnOrder = turnOrder.find(gid => !state.assignments?.[gid]?.caseId) || null;
    }

    const nextUnassignedGroup = nextInTurnOrder
      || this.getGroups().map(g => g.id).find(gid => !state.assignments?.[gid]?.caseId)
      || groupId;
    state.activeGroupId = nextUnassignedGroup;

    this.savePos2State(state, 'POS2_CASE_ASSIGNED', { groupId, caseId, nextGroupId: nextUnassignedGroup });
  },
  updatePos2LKKField(groupId, fieldIndex, value, userName) {
    const state = this.getPos2State();
    const defaultLKK = () => ({
      answers: ['', '', '', '', ''],
      typing: null,
      lastTypedBy: null,
      submitted: false,
      score: 0,
      pointsEarned: 0
    });

    if (!state.lkk[groupId]) state.lkk[groupId] = defaultLKK();
    state.lkk[groupId].answers[fieldIndex] = value;
    state.lkk[groupId].lastTypedBy = userName;
    state.lkk[groupId].typing = { userName, fieldIdx: fieldIndex, fieldIndex, ts: Date.now() };

    this.savePos2State(state, 'POS2_LKK_TYPING', {
      groupId,
      fieldIdx: fieldIndex,
      fieldIndex,
      text: value,
      value,
      userName
    });
  },
  submitPos2LKK(groupId, submittedBy) {
    const state = this.getPos2State();
    if (!state.lkk[groupId]) return null;
    const answers = state.lkk[groupId].answers || [];
    const filledCount = answers.filter(a => (a || '').trim().length > 0).length;
    const pointsEarned = Math.max(20, filledCount * 4);
    const firstSubmit = !state.lkk[groupId].submitted;

    const applySubmit = (lkkObj) => {
      lkkObj.submitted = true;
      lkkObj.score = pointsEarned;
      lkkObj.pointsEarned = pointsEarned;
      lkkObj.submittedBy = submittedBy;
      lkkObj.submittedAt = new Date().toISOString();
    };

    applySubmit(state.lkk[groupId]);

    // Award points & save score for all members of this group
    const group = this.getGroupById(groupId);
    const caseId = state.assignments[groupId]?.caseId;
    if (group && group.memberIds) {
      const users = this.getUsers();
      group.memberIds.forEach(uid => {
        const u = users.find(x => x.id === uid);
        if (u && firstSubmit) {
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

    this.savePos2State(state, 'POS2_LKK_SUBMITTED', { groupId, pointsEarned, submittedBy, firstSubmit });
    return { pointsEarned, firstSubmit };
  },
  resetPos2State() {
    const fresh = { turnOrder: [], activeGroupId: null, assignments: {}, lkk: {}, sharedAssignment: null, sharedLKK: null };
    this.savePos2State(fresh, 'POS2_RESET', {});
  },

  // Pos 3 Real-Time Group Quiz State (Normalized answers & selectedOptions + cross-account sync)
  getPos3GroupState() {
    const raw = this.get('pos3GroupState') || { groups: {} };
    if (!raw.groups) raw.groups = {};
    return raw;
  },
  _normalizePos3GroupObj(gState) {
    if (!gState.lockedAnswers) gState.lockedAnswers = {};
    if (!gState.answers) gState.answers = {};
    // Keep answers and lockedAnswers in sync
    Object.keys(gState.lockedAnswers).forEach(k => { gState.answers[k] = gState.lockedAnswers[k]; });
    Object.keys(gState.answers).forEach(k => { gState.lockedAnswers[k] = gState.answers[k]; });
    if (!gState.selectedOptions) gState.selectedOptions = {};
    if (!gState.essayDrafts) gState.essayDrafts = {};
    gState.totalScore = Object.values(gState.answers).reduce((sum, r) => sum + (r.points || 0), 0);
    return gState;
  },
  getPos3ForGroup(groupId) {
    const all = this.getPos3GroupState();
    if (!all.groups[groupId]) {
      // Inherit from sharedGroup if available so switching accounts stays updated
      const base = all.sharedGroup ? JSON.parse(JSON.stringify(all.sharedGroup)) : {
        currentIdx: 0,
        selectedOption: null,
        selectedBy: null,
        selectedOptions: {},
        essayDrafts: {},
        lockedAnswers: {},
        answers: {},
        totalScore: 0,
        completed: false,
        lastFeedback: null
      };
      all.groups[groupId] = this._normalizePos3GroupObj(base);
    } else {
      all.groups[groupId] = this._normalizePos3GroupObj(all.groups[groupId]);
    }
    return all.groups[groupId];
  },
  selectPos3GroupOption(groupId, qIdx, optionIdx, userName) {
    const all = this.getPos3GroupState();
    const gState = this.getPos3ForGroup(groupId);
    if (gState.answers[qIdx]) return; // already submitted

    const applySelect = (gs) => {
      this._normalizePos3GroupObj(gs);
      gs.currentIdx = qIdx;
      gs.selectedOption = optionIdx;
      gs.selectedBy = userName;
      gs.selectedOptions[qIdx] = { optionIdx, selectedBy: userName };
    };

    applySelect(gState);
    all.groups[groupId] = gState;
    all.sharedGroup = JSON.parse(JSON.stringify(gState));

    // Also sync to other groups that haven't locked this question so switching accounts shows the selected option
    this.getGroups().forEach(g => {
      if (g.id !== groupId) {
        const other = this.getPos3ForGroup(g.id);
        if (!other.answers[qIdx]) {
          applySelect(other);
          all.groups[g.id] = other;
        }
      }
    });

    this.set('pos3GroupState', all);
    RealtimeSync.emit('POS3_OPTION_SELECTED', { groupId, qIdx, optionIdx, userName, gState });
  },
  updatePos3GroupEssay(groupId, qIdx, essayText, userName) {
    const all = this.getPos3GroupState();
    const gState = this.getPos3ForGroup(groupId);
    if (gState.answers[qIdx]) return; // already submitted

    const applyEssay = (gs) => {
      this._normalizePos3GroupObj(gs);
      gs.currentIdx = qIdx;
      gs.essayDrafts[qIdx] = { text: essayText, typedBy: userName, ts: Date.now() };
    };

    applyEssay(gState);
    all.groups[groupId] = gState;
    all.sharedGroup = JSON.parse(JSON.stringify(gState));

    this.getGroups().forEach(g => {
      if (g.id !== groupId) {
        const other = this.getPos3ForGroup(g.id);
        if (!other.answers[qIdx]) {
          applyEssay(other);
          all.groups[g.id] = other;
        }
      }
    });

    this.set('pos3GroupState', all);
    RealtimeSync.emit('POS3_ESSAY_TYPING', { groupId, qIdx, essayText, userName, gState });
  },
  submitPos3GroupAnswer(groupId, qIdx, userName) {
    const all = this.getPos3GroupState();
    const gState = this.getPos3ForGroup(groupId);
    if (gState.answers[qIdx]) return gState;

    const questions = this.getKuisKejutan();
    const q = questions[qIdx];
    if (!q) return gState;

    const settings = this.getSettings();
    let record = null;
    let points = 0;

    if (q.type === 'esai') {
      const draftObj = gState.essayDrafts?.[qIdx];
      const essayText = (draftObj?.text || '').trim();
      const lower = essayText.toLowerCase();
      const keywords = q.kataKunci || [];
      const matched = keywords.filter(k => lower.includes(k.toLowerCase()));
      const isCorrect = essayText.length >= 4 && (keywords.length === 0 || matched.length >= 1 || essayText.length >= 15);
      points = isCorrect ? (settings.pointsBenar || 10) : (settings.pointsSalah || 0);

      record = {
        qIdx,
        type: 'esai',
        essayText: essayText || '(Belum diisi)',
        kunciEsai: q.kunciEsai || q.penjelasan || '',
        isCorrect,
        points,
        submittedBy: draftObj?.typedBy || userName,
        lockedBy: userName,
        lockedAt: new Date().toISOString()
      };
    } else {
      const pickObj = gState.selectedOptions?.[qIdx];
      const selected = pickObj && pickObj.optionIdx !== undefined
        ? pickObj.optionIdx
        : (gState.selectedOption !== null && gState.selectedOption !== undefined ? gState.selectedOption : -1);
      const isCorrect = selected === q.jawaban;
      points = isCorrect ? (settings.pointsBenar || 10) : (settings.pointsSalah || 0);

      record = {
        qIdx,
        type: 'pg',
        selected,
        correct: q.jawaban,
        isCorrect,
        points,
        submittedBy: userName,
        lockedBy: userName,
        lockedAt: new Date().toISOString()
      };
    }

    const applyAnswer = (gs) => {
      this._normalizePos3GroupObj(gs);
      gs.lockedAnswers[qIdx] = record;
      gs.answers[qIdx] = record;
      gs.totalScore = Object.values(gs.answers).reduce((sum, r) => sum + (r.points || 0), 0);
      if (Object.keys(gs.answers).length >= questions.length) {
        gs.completed = true;
      }
    };

    applyAnswer(gState);
    all.groups[groupId] = gState;
    all.sharedGroup = JSON.parse(JSON.stringify(gState));

    this.getGroups().forEach(g => {
      if (g.id !== groupId) {
        const other = this.getPos3ForGroup(g.id);
        if (!other.answers[qIdx]) {
          applyAnswer(other);
          all.groups[g.id] = other;
        }
      }
    });

    this.set('pos3GroupState', all);

    // Sync score to group members
    const group = this.getGroupById(groupId);
    if (group && group.memberIds) {
      const users = this.getUsers();
      group.memberIds.forEach(uid => {
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

    RealtimeSync.emit('POS3_ANSWER_SUBMITTED', {
      groupId,
      qIdx,
      record,
      answerRecord: record,
      totalScore: gState.totalScore,
      gState
    });
    return gState;
  },
  navigatePos3GroupQuestion(groupId, nextIdx) {
    const all = this.getPos3GroupState();
    const gState = this.getPos3ForGroup(groupId);
    const questions = this.getKuisKejutan();
    if (nextIdx < 0 || nextIdx >= questions.length) return;

    const applyNav = (gs) => {
      this._normalizePos3GroupObj(gs);
      gs.currentIdx = nextIdx;
      const locked = gs.answers[nextIdx];
      const livePick = gs.selectedOptions[nextIdx];
      gs.selectedOption = locked ? locked.selected : (livePick ? livePick.optionIdx : null);
      gs.selectedBy = locked ? locked.submittedBy : (livePick ? livePick.selectedBy : null);
    };

    applyNav(gState);
    all.groups[groupId] = gState;
    all.sharedGroup = JSON.parse(JSON.stringify(gState));
    this.getGroups().forEach(g => {
      if (g.id !== groupId) {
        const other = this.getPos3ForGroup(g.id);
        applyNav(other);
        all.groups[g.id] = other;
      }
    });

    this.set('pos3GroupState', all);
    RealtimeSync.emit('POS3_QUESTION_CHANGED', { groupId, nextIdx, gState });
  },
  resetPos3Group(groupId) {
    const all = this.getPos3GroupState();
    if (groupId) {
      delete all.groups[groupId];
      delete all.sharedGroup;
    } else {
      all.groups = {};
      delete all.sharedGroup;
    }
    this.set('pos3GroupState', all);
    RealtimeSync.emit('POS3_RESET', { groupId });
  },

  // Pos 4 Shared State (so reflections stay synced across accounts/emails)
  getPos4Shared() {
    return this.get('pos4Shared') || { answers: {}, currentScreen: 0, completed: false };
  },
  savePos4Shared(data) {
    const curr = this.getPos4Shared();
    const merged = {
      ...curr,
      ...data,
      answers: { ...(curr.answers || {}), ...(data.answers || {}) },
      updatedAt: new Date().toISOString()
    };
    this.set('pos4Shared', merged);
    RealtimeSync.emit('POS4_UPDATED', merged);
  },

  extractYouTubeId(url) {
    if (!url) return null;
    url = String(url).trim();
    const iframeSrc = url.match(/src=["']([^"']+)["']/i);
    if (iframeSrc) url = iframeSrc[1];
    if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    const m = url.match(/(?:embed\/|v\/|watch\?v=|youtu\.be\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  },

  toEmbedUrl(url) {
    if (!url) return '';
    url = String(url).trim();
    const id = this.extractYouTubeId(url);
    if (id) {
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('drive.google.com/file/d/')) {
      return url.replace(/\/view(?:\?.*)?$/, '/preview');
    }
    return url;
  },

  getVideoPlayerSrc(url, autoplay = true) {
    if (!url) return '';
    url = String(url).trim();
    const id = this.extractYouTubeId(url);
    const ap = autoplay ? '1' : '0';
    if (id) {
      if (typeof window !== 'undefined' && window.location) {
        if (window.location.protocol === 'file:') {
          // When running via file://, route through local server player proxy to provide valid HTTP origin and eliminate Error 153
          return `http://127.0.0.1:8765/player?id=${id}&autoplay=${ap}`;
        }
        if (window.location.port === '8765' || window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
          return `/player?id=${id}&autoplay=${ap}`;
        }
      }
      return `https://www.youtube.com/embed/${id}?autoplay=${ap}&rel=0&modestbranding=1&enablejsapi=1`;
    }
    if (url.includes('drive.google.com/file/d/')) {
      return url.replace(/\/view(?:\?.*)?$/, '/preview');
    }
    return url;
  },

  toWatchUrl(url) {
    if (!url) return '';
    url = String(url).trim();
    const id = this.extractYouTubeId(url);
    if (id) {
      return `https://www.youtube.com/watch?v=${id}`;
    }
    return url;
  },

  // Topics (Pos 1)
  getTopics()         { return this.get('topics'); },
  saveTopics(topics)  {
    this.set('topics', topics);
    RealtimeSync.emit('TOPICS_UPDATED', { topics }, false);
  },
  addTopic(t)         {
    const ts = this.getTopics();
    t.id = t.id || ('t' + Date.now());
    if (t.videoUrl) t.videoUrl = this.toEmbedUrl(t.videoUrl);
    ts.push(t);
    this.saveTopics(ts);
    return t;
  },
  updateTopic(id, d)  {
    const updates = { ...d };
    if (updates.videoUrl) updates.videoUrl = this.toEmbedUrl(updates.videoUrl);
    const ts = this.getTopics().map(t => t.id === id ? { ...t, ...updates } : t);
    this.saveTopics(ts);
  },
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

  // Materials (Riwayat Unggahan File PDF, Video, Link, & Gambar)
  getMaterials()      { return this.get('materials') || []; },
  addMaterial(m)      {
    const ms = [...this.getMaterials()];
    m.id = m.id || ('m' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
    m.createdAt = m.createdAt || new Date().toISOString();
    if (m.type === 'link' || m.url) {
      m.watchUrl = this.toWatchUrl(m.watchUrl || m.url);
      m.url = this.toEmbedUrl(m.url || m.watchUrl);
    }
    ms.unshift(m); // unshift so newest uploaded material always shows at the very top of history!
    this.set('materials', ms);
    RealtimeSync.emit('MATERIALS_UPDATED', { materials: ms }, false);
    return m;
  },
  deleteMaterial(id)  {
    const ms = this.getMaterials().filter(m => m.id !== id);
    this.set('materials', ms);
    RealtimeSync.emit('MATERIALS_UPDATED', { materials: ms }, false);
  },

  // Settings
  getSettings()       { return this.get('settings'); },
  saveSettings(s)     { this.set('settings', { ...this.getSettings(), ...s }); },

  // Kelas
  getKelas()          { return this.get('kelas'); },
  saveKelas(k)        { this.set('kelas', k); },
};
