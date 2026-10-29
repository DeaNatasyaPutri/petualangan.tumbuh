// ============================================================
// POS1.JS — Pos 1: Jelajah Pengetahuan
//           (Internal Video Player & Internal PDF Document Viewer)
// ============================================================

const Pos1View = {
  _unsubRT: null,
  _currentOpenTopicId: null,

  render() {
    if (this._unsubRT) { this._unsubRT(); this._unsubRT = null; }
    this._unsubRT = RealtimeSync.subscribe((evt) => {
      if (App.currentView === 'pos1') {
        const type = evt.type || evt.event;
        if (['TOPICS_UPDATED', 'DATA_UPDATED'].includes(type)) {
          const hasModal = !!document.getElementById('modal-backdrop');
          if (!hasModal) {
            this.render();
          } else {
            this._updateTopicCardsInPlace();
            if (this._currentOpenTopicId) {
              this._syncModalPlayerIfOpen(this._currentOpenTopicId);
            }
          }
        }
      }
    });

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

  _updateTopicCardsInPlace() {
    const topics = DB.getTopics();
    const user = Auth.getCurrentUser();
    const scores = user ? DB.getScoreByUser(user.id) : {};
    const watched = scores.pos1?.topicsWatched || [];
    const grid = document.getElementById('topics-grid');
    if (grid) {
      grid.innerHTML = topics.map(t => this._renderTopicCard(t, watched)).join('');
    }
    const countCircle = document.querySelector('.pos-progress-circle');
    if (countCircle) {
      countCircle.textContent = `${watched.length}/${topics.length}`;
    }
  },

  _syncModalPlayerIfOpen(topicId) {
    const topic = DB.getTopics().find(t => t.id === topicId);
    if (!topic) return;
    const iframe = document.querySelector('.video-wrapper iframe');
    if (iframe && topic.videoUrl) {
      const targetSrc = DB.getVideoPlayerSrc(topic.videoUrl, true);
      const ytId = DB.extractYouTubeId(topic.videoUrl);
      if (ytId && !iframe.src.includes(ytId)) {
        iframe.src = targetSrc;
      }
    }
  },

  _renderTopicCard(topic, watched) {
    const isWatched = watched.includes(topic.id);
    const hasLocalVideo = Boolean(topic.videoMediaId);
    const hasVideoUrl = Boolean(topic.videoUrl);
    const hasVideo = hasLocalVideo || hasVideoUrl;
    const hasPdf = Boolean(topic.pdfMediaId);
    const hasGuruUpload = Boolean(topic.videoMediaId || topic.pdfMediaId || (topic.videoUrl && !topic.videoUrl.includes('3sCVR7GS3xE')));

    let videoBadgeText = '🎬 Video Edukasi';
    if (hasLocalVideo && hasVideoUrl) {
      videoBadgeText = '🎬 Video Link & File';
    } else if (hasVideoUrl) {
      videoBadgeText = '🎬 Video YouTube / Tautan';
    } else if (hasLocalVideo) {
      videoBadgeText = `🎬 Video Lokal (${topic.videoFileName || 'File'})`;
    }

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
            ${hasVideo ? `<span class="tag">${videoBadgeText}</span>` : ''}
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

  async openMediaModal(topicId, mode = 'video', sourceChoice = null) {
    this._currentOpenTopicId = topicId;
    const topic = DB.getTopics().find(t => t.id === topicId);
    if (!topic) return;

    const hasLocalVideo = Boolean(topic.videoMediaId);
    const hasVideoUrl = Boolean(topic.videoUrl);
    const hasVideo = hasLocalVideo || hasVideoUrl;
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

      const hasBoth = Boolean(localVideoObj?.url && topic.videoUrl);
      const playSource = sourceChoice || (topic.videoUrl ? 'url' : 'file');

      let switcherHtml = '';
      if (hasBoth) {
        switcherHtml = `
          <div style="display:flex;gap:8px;margin-bottom:12px;background:rgba(0,0,0,0.06);padding:6px;border-radius:10px">
            <button class="filter-pill ${playSource === 'url' ? 'active' : ''}" style="margin:0;cursor:pointer" onclick="Pos1View.openMediaModal('${topic.id}', 'video', 'url')">
              🎬 Tautan Video (YouTube)
            </button>
            <button class="filter-pill ${playSource === 'file' ? 'active' : ''}" style="margin:0;cursor:pointer" onclick="Pos1View.openMediaModal('${topic.id}', 'video', 'file')">
              📁 File Video Lokal (${localVideoObj.name || 'File'})
            </button>
          </div>`;
      }

      if (playSource === 'file' && localVideoObj && localVideoObj.url) {
        viewerHtml = `
          ${switcherHtml}
          <div class="internal-media-stage">
            <video controls autoplay class="internal-video-player" src="${localVideoObj.url}">
              Browser Anda tidak mendukung pemutar video HTML5.
            </video>
          </div>`;
      } else if (topic.videoUrl) {
        const embedSrc = DB.getVideoPlayerSrc(topic.videoUrl, true);
        const watchUrl = DB.toWatchUrl(topic.videoUrl);
        const isFileProtocol = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');
        viewerHtml = `
          ${switcherHtml}
          <div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;background:#000;box-shadow:0 8px 24px rgba(0,0,0,0.18);">
            <iframe
              src="${embedSrc}"
              title="${topic.title}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
              style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;">
            </iframe>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:12px;padding:10px 14px;background:#FFF3E0;border:1px solid #FFE0B2;border-radius:10px;">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.2rem">📺</span>
              <div>
                <strong style="font-size:0.88rem;color:#E65100;display:block">Tautan Video: ${watchUrl}</strong>
                <small style="color:#666">Video langsung berputar otomatis. Jika ada batasan browser, gunakan tombol di samping.</small>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${isFileProtocol ? `
                <a href="http://127.0.0.1:8765/index.html#pos1" target="_blank" class="btn-primary sm" style="background:#2E7D32;border-color:#2E7D32;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:700">
                  🌐 Buka Server Lokal ↗
                </a>
              ` : ''}
              <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary sm" style="background:#CC0000;border-color:#CC0000;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:700">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                Buka di YouTube ↗
              </a>
            </div>
          </div>`;
      } else if (localVideoObj && localVideoObj.url) {
        viewerHtml = `
          <div class="internal-media-stage">
            <video controls autoplay class="internal-video-player" src="${localVideoObj.url}">
              Browser Anda tidak mendukung pemutar video HTML5.
            </video>
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
            <span class="tag">${activeMode === 'video' ? (topic.videoUrl ? '🎬 Tautan Video YouTube' : (localVideoObj ? `📁 File: ${localVideoObj.name}` : '🎬 Video Pembelajaran')) : `📄 File: ${localPdfObj?.name || 'Dokumen PDF'}`}</span>
          </div>
          <div style="display:flex;gap:10px">
            ${(activeMode === 'video' && topic.videoUrl) ? `
              <a href="${DB.toWatchUrl(topic.videoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-secondary sm" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px">
                ↗ Buka di YouTube
              </a>
            ` : ''}
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
