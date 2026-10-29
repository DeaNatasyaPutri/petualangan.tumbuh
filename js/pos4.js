// ============================================================
// POS4.JS — Pos 4: Jejak Tumbuhku (Growth Mindset Reflection)
// ============================================================

const Pos4View = {
  _currentScreen: 0,
  _totalScreens: 4,
  _answers: {},

  _screens: [
    {
      id: 'menemukan',
      title: '🌱 Aku Menemukan',
      subtitle: 'Hal baru yang aku pahami hari ini',
      color: '#43A047',
      gradient: 'linear-gradient(135deg,#66BB6A,#1B5E20)',
      bgPattern: '🌿🌱🍀🌿🌱',
      prompt: 'Apa hal baru atau pengetahuan baru yang kamu temukan dan pahami dari pembelajaran hari ini?',
      placeholder: 'Contoh: Hari ini aku menemukan bahwa ekosistem terdiri dari makhluk hidup dan benda tak hidup yang saling berinteraksi. Aku juga memahami bahwa setiap makhluk hidup punya peran penting...',
      icon: '💡',
      questionGuide: [
        'Apa konsep baru yang kamu pelajari hari ini?',
        'Apakah ada fakta yang membuatmu terkejut?',
        'Hal apa yang paling menarik dari pembelajaran ini?'
      ]
    },
    {
      id: 'tantangan',
      title: '🌊 Aku Menghadapi Tantangan',
      subtitle: 'Kesulitan yang aku alami',
      color: '#1565C0',
      gradient: 'linear-gradient(135deg,#42A5F5,#0D47A1)',
      bgPattern: '🌊💭🤔🌊💭',
      prompt: 'Kesulitan atau tantangan apa yang kamu hadapi selama pembelajaran hari ini?',
      placeholder: 'Contoh: Aku merasa kesulitan memahami perbedaan antara jaring-jaring makanan dan rantai makanan. Soal tentang adaptasi juga membuatku bingung karena...',
      icon: '🤔',
      questionGuide: [
        'Bagian mana yang paling sulit dipahami?',
        'Apakah ada soal yang membuatmu bingung?',
        'Apa yang menjadi hambatan dalam belajarmu?'
      ]
    },
    {
      id: 'berusaha',
      title: '💪 Aku Terus Berusaha',
      subtitle: 'Strategi yang aku gunakan untuk mengatasi kesulitan',
      color: '#F57F17',
      gradient: 'linear-gradient(135deg,#FFCA28,#E65100)',
      bgPattern: '💪🔥⚡💪🔥',
      prompt: 'Apa yang sudah kamu lakukan atau coba untuk mengatasi kesulitan tersebut?',
      placeholder: 'Contoh: Untuk mengatasi kebingunganku, aku mencoba menonton video lagi dari awal dan mencatat poin pentingnya. Aku juga bertanya kepada teman sebangkuku...',
      icon: '🛠️',
      questionGuide: [
        'Strategi apa yang kamu gunakan untuk belajar?',
        'Apakah kamu mencari bantuan dari teman atau guru?',
        'Apa yang berhasil membantumu memahami materi?'
      ]
    },
    {
      id: 'langkah',
      title: '🚀 Langkah Tumbuhku',
      subtitle: 'Rencana perbaikan dan langkah ke depan',
      color: '#8E24AA',
      gradient: 'linear-gradient(135deg,#AB47BC,#4A148C)',
      bgPattern: '🚀⭐🎯🚀⭐',
      prompt: 'Apa langkah konkret yang akan kamu lakukan untuk terus berkembang dan memperbaiki pemahamanmu?',
      placeholder: 'Contoh: Ke depannya, aku akan membuat catatan mind map setelah setiap video. Aku juga akan berlatih mengerjakan lebih banyak soal tentang rantai makanan dan bertanya jika ada yang tidak aku mengerti...',
      icon: '🎯',
      questionGuide: [
        'Apa rencanamu untuk belajar lebih baik?',
        'Topik apa yang ingin kamu pelajari lebih dalam?',
        'Bagaimana kamu akan mempersiapkan diri untuk pelajaran berikutnya?'
      ]
    }
  ],

  render() {
    const user = Auth.getCurrentUser();
    const scores = user ? DB.getScoreByUser(user.id) : {};
    const shared = DB.getPos4Shared();

    this._currentScreen = scores.pos4?.currentScreen !== undefined
      ? scores.pos4.currentScreen
      : (shared.currentScreen || 0);
    this._answers = { ...(shared.answers || {}), ...(scores.pos4?.answers || {}) };

    const el = document.getElementById('view-pos4');
    el.innerHTML = `
      <div class="pos-layout pos4-layout">
        <!-- Header -->
        <div class="pos-header" style="background:linear-gradient(135deg,#8E24AA,#4A148C)">
          <button class="pos-back-btn" onclick="App.navigate('murid')">← Kembali</button>
          <div class="pos-header-content">
            <div class="pos-header-num">POS 4</div>
            <h1 class="pos-header-title">🌱 Jejak Tumbuhku</h1>
            <p class="pos-header-desc">Refleksikan perjalanan belajarmu dan rencanakan langkah ke depan!</p>
          </div>
          <div class="pos4-nav-dots" id="pos4-nav-dots">
            ${this._screens.map((s, i) => `
              <div class="pos4-dot ${i <= this._currentScreen ? 'active' : ''} ${i < this._currentScreen ? 'done' : ''}"
                onclick="Pos4View.goToScreen(${i})" title="${s.title}"></div>`).join('')}
          </div>
        </div>

        <!-- Screens Container -->
        <div class="pos4-screens-wrap" id="pos4-screens-wrap">
          ${this._screens.map((s, i) => `
            <div class="pos4-screen ${i === this._currentScreen ? 'active' : i < this._currentScreen ? 'prev' : 'next'}"
              id="pos4-screen-${i}" style="--screen-color:${s.color};--screen-gradient:${s.gradient}">
              ${this._renderScreen(s, i)}
            </div>`).join('')}
        </div>

        <!-- Navigation Footer -->
        <div class="pos4-footer">
          <div class="pos4-footer-inner">
            <button class="btn-pos4-nav prev" onclick="Pos4View.prevScreen()" ${this._currentScreen === 0 ? 'disabled' : ''}>
              ← Sebelumnya
            </button>
            <div class="pos4-screen-indicator">
              ${this._currentScreen + 1} / ${this._totalScreens}
            </div>
            ${this._currentScreen < this._totalScreens - 1
              ? `<button class="btn-pos4-nav next" onclick="Pos4View.nextScreen()">Selanjutnya →</button>`
              : `<button class="btn-pos4-nav finish" onclick="Pos4View.finish()">✅ Selesai & Simpan!</button>`
            }
          </div>
        </div>
      </div>`;
  },

  _renderScreen(screen, idx) {
    const savedAnswer = this._answers[screen.id] || '';
    return `
      <div class="pos4-screen-inner">
        <!-- Decorative Background -->
        <div class="pos4-screen-bg" style="background:${screen.gradient}">
          <div class="pos4-bg-pattern">${screen.bgPattern.repeat(10)}</div>
          <div class="pos4-screen-header-content">
            <div class="pos4-screen-icon">${screen.icon}</div>
            <h2 class="pos4-screen-title">${screen.title}</h2>
            <p class="pos4-screen-subtitle">${screen.subtitle}</p>
          </div>
        </div>

        <!-- Content Area -->
        <div class="pos4-content-area">
          <!-- Guide Questions -->
          <div class="pos4-guide-section">
            <h4 class="pos4-guide-title">💭 Panduan Refleksi:</h4>
            <div class="pos4-guide-chips">
              ${screen.questionGuide.map(q => `
                <div class="pos4-guide-chip">
                  <span class="guide-arrow">→</span>
                  <span>${q}</span>
                </div>`).join('')}
            </div>
          </div>

          <!-- Answer Input -->
          <div class="pos4-input-section">
            <label class="pos4-input-label">
              <span>${screen.icon}</span>
              <span>${screen.prompt}</span>
            </label>
            <textarea
              class="pos4-textarea"
              id="pos4-answer-${screen.id}"
              placeholder="${screen.placeholder}"
              oninput="Pos4View.autoSave('${screen.id}')"
              style="border-color:${screen.color}">${savedAnswer}</textarea>
            <div class="pos4-word-count" id="wc-${screen.id}">
              ${savedAnswer.split(' ').filter(w=>w).length} kata
            </div>
          </div>

          <!-- Inspirational Quote -->
          <div class="pos4-quote-card" style="border-left:4px solid ${screen.color}">
            <div class="pos4-quote-text">${this._getQuote(idx)}</div>
            <div class="pos4-quote-author">— Growth Mindset 🌱</div>
          </div>
        </div>
      </div>`;
  },

  _getQuote(idx) {
    const quotes = [
      '"Setiap hari adalah kesempatan untuk belajar sesuatu yang baru dan menakjubkan."',
      '"Tantangan adalah bukti bahwa kamu sedang berkembang menjadi lebih baik."',
      '"Tidak ada usaha yang sia-sia. Setiap langkah kecil membawa perubahan besar."',
      '"Mimpimu dimulai dari langkah pertama yang kamu ambil hari ini."',
    ];
    return quotes[idx] || quotes[0];
  },

  autoSave(screenId) {
    const textarea = document.getElementById(`pos4-answer-${screenId}`);
    if (!textarea) return;

    const val = textarea.value;
    this._answers[screenId] = val;

    // Update word count
    const wcEl = document.getElementById(`wc-${screenId}`);
    if (wcEl) wcEl.textContent = `${val.split(' ').filter(w=>w).length} kata`;

    // Save to DB (both per-user and shared so switching emails/accounts stays updated)
    const user = Auth.getCurrentUser();
    if (user?.role === 'murid') {
      DB.saveScore(user.id, 'pos4', {
        answers: this._answers,
        currentScreen: this._currentScreen,
        completed: false,
      });
    }
    DB.savePos4Shared({
      answers: this._answers,
      currentScreen: this._currentScreen
    });
  },

  _syncInPlaceOrRender() {
    const shared = DB.getPos4Shared();
    const user = Auth.getCurrentUser();
    const scores = user ? DB.getScoreByUser(user.id) : {};
    const merged = { ...(shared.answers || {}), ...(scores.pos4?.answers || {}) };
    this._answers = merged;
    this._screens.forEach(s => {
      const ta = document.getElementById(`pos4-answer-${s.id}`);
      if (ta && document.activeElement !== ta && merged[s.id] !== undefined && ta.value !== merged[s.id]) {
        ta.value = merged[s.id];
      }
    });
  },

  goToScreen(idx) {
    this._saveCurrentAnswer();
    this._currentScreen = idx;
    this._updateScreens();
    this._updateDots();
    this._updateFooter();
  },

  nextScreen() {
    this._saveCurrentAnswer();
    if (this._currentScreen < this._totalScreens - 1) {
      this._currentScreen++;
      this._updateScreens();
      this._updateDots();
      this._updateFooter();
    }
  },

  prevScreen() {
    this._saveCurrentAnswer();
    if (this._currentScreen > 0) {
      this._currentScreen--;
      this._updateScreens();
      this._updateDots();
      this._updateFooter();
    }
  },

  _saveCurrentAnswer() {
    const screen = this._screens[this._currentScreen];
    const textarea = document.getElementById(`pos4-answer-${screen.id}`);
    if (textarea) {
      this._answers[screen.id] = textarea.value;
    }
  },

  _updateScreens() {
    this._screens.forEach((s, i) => {
      const el = document.getElementById(`pos4-screen-${i}`);
      if (el) {
        el.className = `pos4-screen ${
          i === this._currentScreen ? 'active' :
          i < this._currentScreen ? 'prev' : 'next'
        }`;
        // Restore saved answer
        const textarea = el.querySelector(`#pos4-answer-${s.id}`);
        if (textarea && this._answers[s.id]) {
          textarea.value = this._answers[s.id];
        }
      }
    });
  },

  _updateDots() {
    const dotsEl = document.getElementById('pos4-nav-dots');
    if (dotsEl) {
      dotsEl.innerHTML = this._screens.map((s, i) => `
        <div class="pos4-dot ${i <= this._currentScreen ? 'active' : ''} ${i < this._currentScreen ? 'done' : ''}"
          onclick="Pos4View.goToScreen(${i})" title="${s.title}"></div>`).join('');
    }
  },

  _updateFooter() {
    const footer = document.querySelector('.pos4-footer-inner');
    if (!footer) return;
    footer.innerHTML = `
      <button class="btn-pos4-nav prev" onclick="Pos4View.prevScreen()" ${this._currentScreen === 0 ? 'disabled' : ''}>
        ← Sebelumnya
      </button>
      <div class="pos4-screen-indicator">
        ${this._currentScreen + 1} / ${this._totalScreens}
      </div>
      ${this._currentScreen < this._totalScreens - 1
        ? `<button class="btn-pos4-nav next" onclick="Pos4View.nextScreen()">Selanjutnya →</button>`
        : `<button class="btn-pos4-nav finish" onclick="Pos4View.finish()">✅ Selesai & Simpan!</button>`
      }`;
  },

  finish() {
    this._saveCurrentAnswer();

    const filledCount = this._screens.filter(s => (this._answers[s.id] || '').trim().length > 10).length;
    if (filledCount < 2) {
      App.showToast('Mohon isi setidaknya 2 refleksi dengan lengkap!', 'warning');
      return;
    }

    const user = Auth.getCurrentUser();
    const pos4Data = {
      answers: this._answers,
      currentScreen: this._totalScreens - 1,
      completed: true,
      completedAt: new Date().toISOString(),
    };
    DB.savePos4Shared(pos4Data);
    if (user?.role === 'murid') {
      DB.saveScore(user.id, 'pos4', pos4Data);
      MuridView.addPoin(user.id, 30);
      MuridView.awardBadge(user.id, 'pos4_done');

      // Check all done
      const scores = DB.getScoreByUser(user.id);
      const allDone = [1,2,3,4].every(n => {
        if (n === 3) return scores.pos3?.tantangan !== undefined;
        return scores[`pos${n}`]?.completed;
      });
      if (allDone) MuridView.awardBadge(user.id, 'all_done');
    }

    App.showConfetti(100);
    this._showSummary();
  },

  _showSummary() {
    const el = document.getElementById('view-pos4');
    const user = Auth.getCurrentUser();

    el.innerHTML = `
      <div class="pos4-summary-page">
        <div class="pos4-summary-header">
          <div class="summary-mascot">🌟</div>
          <h1>Jejak Tumbuhku Tersimpan!</h1>
          <p>Terima kasih sudah meluangkan waktu untuk berefleksi. Kamu luar biasa!</p>
          <div class="summary-poin">+30 Poin Refleksi! ⭐</div>
        </div>

        <div class="pos4-summary-cards">
          ${this._screens.map(s => {
            const answer = this._answers[s.id] || '';
            const preview = answer.trim() || '(Belum diisi)';
            return `
            <div class="summary-card" style="border-top:4px solid ${s.color}">
              <div class="summary-card-header" style="background:${s.gradient}">
                <span>${s.icon}</span>
                <h3>${s.title}</h3>
              </div>
              <div class="summary-card-body">
                <p>${preview.substring(0, 200)}${preview.length > 200 ? '...' : ''}</p>
              </div>
            </div>`;
          }).join('')}
        </div>

        <div class="pos4-summary-quote">
          <div class="summary-quote-icon">🌱</div>
          <blockquote>
            "Refleksi adalah kunci pertumbuhan. Dengan mengenal diri sendiri, kamu bisa terus berkembang menjadi versi terbaikmu!"
          </blockquote>
        </div>

        <div class="pos4-summary-actions">
          <button class="btn-secondary" onclick="Pos4View.render()">✏️ Edit Refleksi</button>
          <button class="btn-primary lg" onclick="App.navigate('murid')">🏠 Kembali ke Beranda</button>
        </div>

        ${user?.role === 'murid' ? `
        <div class="pos4-complete-banner">
          🎉 Kamu telah menyelesaikan <strong>Pos 4 — Jejak Tumbuhku</strong>! Pantang menyerah, terus melangkah! 🚀
        </div>` : ''}
      </div>`;
  },
};
