// ============================================================
// POS1.JS — Pos 1: Jelajah Pengetahuan
//           (Internal Video Player & Internal PDF Document Viewer)
// ============================================================

const Pos1View = {

  render() {
    const user = Auth.getCurrentUser();
    const topics = DB.getTopics();
    const scores = user ? DB.getScoreByUser(user.id) : {};
    const watched = scores.pos1?.topicsWatched || [];
    const backTarget = (user?.role === 'guru' || user?.role === 'admin') ? 'dashboard' : 'murid';

    const el = document.getElementById('view-pos1');
    el.innerHTML = `
      <div class="pos-layout">
        <!-- Header -->
        <div class="pos-header" style="background:linear-gradient(135deg,#43A047,#1B5E20)">
          <button class="pos-back-btn" onclick="App.navigate('${backTarget}')">← Kembali</button>
          <div class="pos-header-content">
            <div class="pos-header-num">POS 1</div>
            <h1 class="pos-header-title">🔭 Jelajah Pengetahuan</h1>
            <p class="pos-header-desc">Pilih topik materi untuk menonton video pembelajaran dan membaca modul dokumen PDF!</p>
          </div>
          <div class="pos-header-progress">
            <div class="pos-progress-circle">${watched.length}/${topics.length}</div>
            <span>Materi Dipelajari</span>
          </div>
        </div>

        <!-- Content -->
        <div class="pos-content">
          <!-- Filter & Search -->
          <div class="pos1-toolbar">
            <div class="pos1-search-wrap">
              <span>🔍</span>
              <input type="text" class="pos1-search" id="pos1-search" placeholder="Cari topik materi atau dokumen..." oninput="Pos1View.filterTopics()">
            </div>
            <div class="pos1-filter-pills">
              <button class="filter-pill active" data-level="Semua" onclick="Pos1View.filterLevel(this,'Semua')">Semua (${topics.length})</button>
              <button class="filter-pill" data-level="Dasar" onclick="Pos1View.filterLevel(this,'Dasar')">🟢 Dasar</button>
              <button class="filter-pill" data-level="Menengah" onclick="Pos1View.filterLevel(this,'Menengah')">🟡 Menengah</button>
              <button class="filter-pill" data-level="Lanjutan" onclick="Pos1View.filterLevel(this,'Lanjutan')">🔴 Lanjutan</button>
            </div>
          </div>

          <!-- Topic Grid -->
          <div class="topics-grid" id="topics-grid">
            ${topics.map(t => this._renderTopicCard(t, watched)).join('')}
          </div>

          <!-- Completion Banner -->
          ${watched.length >= topics.length && topics.length > 0 ? `
          <div class="completion-banner green">
            <div class="completion-icon">🎉</div>
            <div style="flex:1">
              <h3>Luar Biasa! Kamu sudah mempelajari seluruh materi di Pos 1!</h3>
              <p>Sekarang kamu siap melanjutkan petualangan ke Pos 2 untuk memecahkan tantangan kasus!</p>
            </div>
            <button class="btn-primary lg" onclick="App.navigate('pos2')">Lanjut ke Pos 2 →</button>
          </div>` : ''}
        </div>
      </div>`;
  },

  _renderTopicCard(topic, watched) {
    const isWatched = watched.includes(topic.id);
    const hasVideo = Boolean(topic.videoMediaId || topic.videoUrl);
    const hasPdf = Boolean(topic.pdfMediaId);
    const hasGuruUpload = Boolean(topic.videoMediaId || topic.pdfMediaId);

    return `
      <div class="topic-card ${isWatched ? 'watched' : ''}" data-title="${topic.title.toLowerCase()}" data-level="${topic.level}">
        <div class="topic-card-header" style="background:${topic.bgGradient}">
          <div class="topic-card-emoji">${topic.emoji}</div>
          ${isWatched ? '<div class="topic-watched-badge">✅ Selesai Dipelajari</div>' : ''}
          <div class="topic-card-level level-${topic.level.toLowerCase()}">${topic.level}</div>
          ${hasGuruUpload ? '<div class="topic-card-duration">📤 Materi Guru</div>' : ''}
        </div>
        <div class="topic-card-body">
          <h3 class="topic-card-title">${topic.title}</h3>
          <p class="topic-card-desc">${topic.description}</p>
          <div class="topic-card-tags">
            ${hasVideo ? `<span class="tag">🎬 ${topic.videoMediaId ? 'Video Internal' : 'Video Edukasi'}</span>` : ''}
            ${hasPdf ? `<span class="tag" style="background:#E3F2FD;color:#1565C0">📄 Modul PDF</span>` : ''}
            ${(topic.tags || []).slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <div class="topic-card-actions-row">
            ${hasVideo ? `
              <button class="btn-watch" style="background:${topic.bgGradient}" onclick="Pos1View.openMediaModal('${topic.id}', 'video')">
                ▶️ ${isWatched ? 'Putar Video' : 'Tonton Video'}
              </button>
            ` : ''}
            ${hasPdf ? `
              <button class="btn-watch pdf-btn" style="background:linear-gradient(135deg,#1565C0,#0D47A1)" onclick="Pos1View.openMediaModal('${topic.id}', 'pdf')">
                📄 Baca PDF
              </button>
            ` : ''}
          </div>
        </div>
      </div>`;
  },

  filterTopics() {
    const query = document.getElementById('pos1-search').value.toLowerCase();
    const activeLevel = document.querySelector('.filter-pill.active')?.dataset.level || 'Semua';
    document.querySelectorAll('.topic-card').forEach(card => {
      const matchTitle = card.dataset.title.includes(query);
      const matchLevel = activeLevel === 'Semua' || card.dataset.level === activeLevel;
      card.style.display = matchTitle && matchLevel ? 'flex' : 'none';
    });
  },

  filterLevel(btn, level) {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    this.filterTopics();
  },

  async openMediaModal(topicId, mode = 'video') {
    const topic = DB.getTopics().find(t => t.id === topicId);
    if (!topic) return;

    const hasVideo = Boolean(topic.videoMediaId || topic.videoUrl);
    const hasPdf = Boolean(topic.pdfMediaId);
    const activeMode = (mode === 'pdf' && hasPdf) ? 'pdf' : (hasVideo ? 'video' : 'pdf');

    let localVideoObj = null;
    let localPdfObj = null;

    if (topic.videoMediaId) {
      localVideoObj = await MediaDB.getFileUrl(topic.videoMediaId);
    }
    if (topic.pdfMediaId) {
      localPdfObj = await MediaDB.getFileUrl(topic.pdfMediaId);
    }

    let viewerHtml = '';
    if (activeMode === 'video') {
      if (typeof SoundManager !== 'undefined') SoundManager.pauseBGMForMedia(true);
      if (localVideoObj && localVideoObj.url) {
        viewerHtml = `
          <div class="internal-media-stage">
            <video controls autoplay class="internal-video-player" src="${localVideoObj.url}">
              Browser Anda tidak mendukung pemutar video HTML5.
            </video>
          </div>`;
      } else if (topic.videoUrl) {
        const sep = topic.videoUrl.includes('?') ? '&' : '?';
        viewerHtml = `
          <div class="video-wrapper">
            <iframe
              src="${topic.videoUrl}${sep}autoplay=1&rel=0&modestbranding=1"
              title="${topic.title}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowfullscreen>
            </iframe>
          </div>`;
      } else {
        viewerHtml = `<div class="empty-state"><span>🎬</span><p>Video belum tersedia pada topik ini.</p></div>`;
      }
    } else {
      if (typeof SoundManager !== 'undefined') SoundManager.pauseBGMForMedia(false);
      if (localPdfObj && localPdfObj.url) {
        viewerHtml = `
          <div class="internal-pdf-stage">
            <embed src="${localPdfObj.url}#toolbar=1&navpanes=1&scrollbar=1" type="application/pdf" class="internal-pdf-viewer" />
          </div>`;
      } else {
        viewerHtml = `<div class="empty-state"><span>📄</span><p>Dokumen PDF belum diunggah oleh Guru untuk topik ini.</p></div>`;
      }
    }

    App.showModal(`
      <div class="video-modal">
        <div class="video-modal-header" style="background:${topic.bgGradient}">
          <span class="video-modal-emoji">${topic.emoji}</span>
          <div style="flex:1">
            <h2>${topic.title}</h2>
            <p>${topic.description}</p>
          </div>
          ${(hasVideo && hasPdf) ? `
            <div class="media-mode-switcher">
              <button class="media-switch-btn ${activeMode === 'video' ? 'active' : ''}" onclick="Pos1View.openMediaModal('${topic.id}', 'video')">
                🎬 Pemutar Video
              </button>
              <button class="media-switch-btn ${activeMode === 'pdf' ? 'active' : ''}" onclick="Pos1View.openMediaModal('${topic.id}', 'pdf')">
                📄 Viewer PDF
              </button>
            </div>
          ` : ''}
        </div>

        ${viewerHtml}

        <div class="video-modal-footer">
          <div class="video-tags">
            <span class="tag">${activeMode === 'video' ? (localVideoObj ? `🎬 File: ${localVideoObj.name}` : '🎬 Video Pembelajaran') : `📄 File: ${localPdfObj?.name || 'Dokumen PDF'}`}</span>
          </div>
          <div style="display:flex;gap:10px">
            ${(activeMode === 'pdf' && localPdfObj?.url) ? `
              <a href="${localPdfObj.url}" download="${localPdfObj.name || 'materi.pdf'}" class="btn-secondary sm" style="text-decoration:none">⬇️ Unduh PDF</a>
            ` : ''}
            <button class="btn-primary" onclick="Pos1View.markWatched('${topicId}')">
              ✅ Tandai Selesai Dipelajari (+5 Poin)
            </button>
          </div>
        </div>
      </div>`, 'xl');
  },

  openVideo(topicId) {
    this.openMediaModal(topicId, 'video');
  },

  markWatched(topicId, silent = false) {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'murid') {
      if (!silent) App.closeModal();
      return;
    }

    const scores = DB.getScoreByUser(user.id);
    const watched = scores.pos1?.topicsWatched || [];

    if (!watched.includes(topicId)) {
      watched.push(topicId);
      const allTopics = DB.getTopics();
      const completed = watched.length >= allTopics.length;

      DB.saveScore(user.id, 'pos1', { topicsWatched: watched, completed });
      MuridView.addPoin(user.id, 5);

      if (!silent) {
        App.showToast('✅ Materi ditandai selesai dipelajari! +5 poin', 'success');
        App.closeModal();
      }

      if (completed) {
        setTimeout(() => {
          App.showConfetti();
          App.showToast('🎉 Pos 1 Selesai! Badge Penjelajah Ilmu diraih!', 'success');
          MuridView.awardBadge(user.id, 'pos1_done');
        }, 500);
      }

      this.render();
    } else {
      if (!silent) {
        App.showToast('Materi ini sudah tercatat selesai dipelajari!', 'info');
        App.closeModal();
      }
    }
  },
};
