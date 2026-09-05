(() => {
  const readingDatabase = {
    single: [
      { id: 'passage-1', title: 'The link between low light and mood', part: 'Passage 1', questions: 13, href: 'reading-test-1.html' },
      { id: 'passage-2', title: 'Bird Migration', part: 'Passage 2', questions: 13, href: 'reading-test-2.html' },
      { id: 'passage-3', title: 'Listening to the Ocean', part: 'Passage 1', questions: 13, href: 'reading-test-3.html' },
      { id: 'passage-4', title: 'The Blockbuster Phenomenon', part: 'Passage 1', questions: 13, href: 'reading-test-4.html' },
      { id: 'passage-5', title: 'The lost animals of Australia', part: 'Passage 3', questions: 14, href: 'reading-test-5.html' },
      { id: 'passage-6', title: 'The Blockbuster Phenomenon: a new museum trend', part: 'Passage 1', questions: 13, href: 'reading-test-6.html' },
      { id: 'passage-7', title: 'The Cause of Linguistic Change', part: 'Passage 3', questions: 14, href: 'reading-test-7.html' },
      { id: 'passage-8', title: 'Traditional Maori Medicine', part: 'Passage 1', questions: 13, href: 'reading-test-8.html' },
      { id: 'passage-9', title: 'Improving Patient Safety', part: 'Passage 3', questions: 14, href: 'reading-test-9.html' },
      { id: 'passage-10', title: 'Why Should We Study History?', part: 'Passage 1', questions: 13, href: 'reading-test-10.html' },
      { id: 'passage-11', title: 'Bees and Pollination', part: 'Passage 2', questions: 13, href: 'reading-test-11.html' },
      { id: 'passage-12', title: 'A New Stage in the Study and Teaching of History', part: 'Passage 3', questions: 14, href: 'reading-test-12.html' },
      { id: 'passage-13', title: 'Antarctic Research', part: 'Passage 2', questions: 13, href: 'reading-test-13.html' },
      { id: 'passage-14', title: 'Violins and Very Cold Weather – A Hypothesis', part: 'Passage 2', questions: 13, href: 'reading-test-14.html' },
      { id: 'passage-15', title: 'Game Theory', part: 'Passage 3', questions: 14, href: 'reading-test-15.html' },
      { id: 'passage-16', title: 'The Terracotta Army', part: 'Passage 1', questions: 16, href: 'reading-test-16.html' },
      { id: 'passage-17', title: 'What Should Companies Do to Survive?', part: 'Passage 3', questions: 14, href: 'reading-test-17.html' },
      { id: 'passage-18', title: 'The Return of Monkey Life', part: 'Passage 2', questions: 13, href: 'reading-test-18.html' },
      { id: 'passage-19', title: 'European Heatwave of Summer 2003', part: 'Passage 2', questions: 13, href: 'reading-test-19.html' },
      { id: 'passage-20', title: 'Research into the Effects of Different Teaching Styles', part: 'Passage 3', questions: 14, href: 'reading-test-20.html' },
      { id: 'passage-21', title: 'Roman Tunnels', part: 'Passage 1', questions: 13, href: 'reading-test-21.html' },
      { id: 'passage-22', title: 'Research Using Twins', part: 'Passage 2', questions: 13, href: 'reading-test-22.html' },
      { id: 'passage-23', title: 'An Introduction to Film Sound', part: 'Passage 3', questions: 14, href: 'reading-test-23.html' }
    ]
  };

  const articleDatabase = [
    { id: 'article-1', title: 'Healing Outdoors: How Nature Helps Us Process Loss', meta: 'Article 1 · B2–C1 · 6 min read', description: 'Highlight, notes, live dictionary + 20-word vocab test', href: 'article-1.html' },
    { id: 'article-2', title: 'Post-Workout Nutrition: Simple Pillars for Recovery', meta: 'Article 2 · B2–C1 · 6 min read', description: 'Science-based reading with vocabulary clues and notes', href: 'article-2.html' },
    { id: 'article-3', title: 'How Hot Weather Accelerates Biological Ageing', meta: 'Article 3 · C1 · 6 min read', description: 'Academic style text with a short vocabulary practice round', href: 'article-3.html' },
    { id: 'article-4', title: 'Couples Who Cope Together, Stay Together', meta: 'Article 4 · B2–C1 · 6 min read', description: 'Relationship and wellbeing reading with highlighting tools', href: 'article-4.html' },
    { id: 'article-5', title: 'The Carbon-Free Energy of the Future: Fusion Breakthrough', meta: 'Article 5 · C1–C2 · 7 min read', description: 'Nuclear fusion breakthrough report from The Guardian with C1 vocabulary', href: 'article-5.html' }
  ];

  function getCompletedSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem('vivid_reading_completed') || '[]'));
    } catch (e) {
      return new Set();
    }
  }

  const state = { view: 'home', stack: [], searchTerm: '' };

  const navRoot = document.getElementById('readingNavigator');
  const backBtn = document.getElementById('readingBackBtn');

  function renderHome() {
    navRoot.innerHTML = `
      <div class="reading-landing-grid">
        <button class="reading-landing-card" type="button" data-view="single" style="text-align:left; cursor:pointer; border:1px solid var(--line);">
          <span class="eyebrow">Reading Real Exam Practice</span>
          <h3>All Passages</h3>
          <p>Single-passage practice from the reading database</p>
          <span class="cta">Open practice →</span>
        </button>

        <button class="reading-landing-card" type="button" data-view="articles" style="text-align:left; cursor:pointer; border:1px solid var(--line);">
          <span class="eyebrow">Article</span>
          <h3>Independent reading articles</h3>
          <p>Short academic-style articles with notes and vocabulary support</p>
          <span class="cta">Open articles →</span>
        </button>

        <a class="reading-landing-card" href="reading-rocket/index.html">
          <span class="eyebrow">Interactive Booster</span>
          <h3>Avazbek Reader Booster</h3>
          <p>30 passages, interactive audio, flashcards and 7 full mock tests</p>
          <span class="cta">Open booster →</span>
        </a>
      </div>
    `;

    navRoot.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-view');
        state.stack.push({ view: 'home' });
        if (target === 'single') {
          state.view = 'single';
          renderSingle();
        } else if (target === 'articles') {
          state.view = 'articles';
          renderArticles();
        }
      });
    });
  }

  function renderSingle() {
    const completed = getCompletedSet();

    navRoot.innerHTML = `
      <div class="reading-toptabs">
        <span class="reading-toptab active">Real-Exam</span>
        <span class="reading-toptab disabled">Cambridge <span class="tab-pill">Soon</span></span>
        <span class="reading-toptab disabled">Gold <span class="tab-pill">Soon</span></span>
        <span class="reading-toptab disabled">Mock <span class="tab-pill">Soon</span></span>
        <span class="reading-toptab disabled">Speaking <span class="tab-pill">Soon</span></span>
      </div>

      <div class="reading-subtabs">
        <span class="reading-subtab active">📖 Reading</span>
        <span class="reading-subtab disabled">🎧 Listening</span>
      </div>

      <div class="reading-toolbar">
        <div class="reading-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input type="text" id="passageSearchInput" placeholder="Search passages by title...">
        </div>
        <select class="reading-filter" id="passageSortSelect">
          <option value="default">Default order</option>
          <option value="az">Title A–Z</option>
        </select>
      </div>

      <div class="reading-section-title">Reading Question Sets</div>
      <div class="ielts-card-grid" id="passageCardGrid"></div>
    `;

    function renderCards() {
      const grid = document.getElementById('passageCardGrid');
      const term = state.searchTerm.trim().toLowerCase();
      let items = readingDatabase.single.filter((item) =>
        !term || item.title.toLowerCase().includes(term)
      );

      const sortSelect = document.getElementById('passageSortSelect');
      if (sortSelect && sortSelect.value === 'az') {
        items = [...items].sort((a, b) => a.title.localeCompare(b.title));
      }

      if (items.length === 0) {
        grid.innerHTML = `<p style="color:var(--ink-soft); grid-column:1/-1;">Hech narsa topilmadi.</p>`;
        return;
      }

      grid.innerHTML = items.map((item) => {
        const originalIdx = readingDatabase.single.indexOf(item);
        const isFree = originalIdx < 2;
        const done = completed.has(item.id);
        return `
          <a href="${item.href}" class="ielts-card" ${isFree ? '' : 'data-premium-only'}>
            <div class="ielts-card-top">
              <span class="ielts-card-day">Day ${originalIdx + 1}: ${item.title}</span>
              ${done ? '<span class="ielts-badge done">Done</span>' : isFree ? '<span class="ielts-badge free">Free</span>' : '<span class="ielts-badge premium">Premium</span>'}
            </div>
            <span class="ielts-card-part">${item.part} · ${item.questions} questions</span>
            ${done ? '<span class="ielts-card-done">✓ Completed</span>' : ''}
          </a>
        `;
      }).join('');

      if (typeof applyPremiumLocks === 'function') applyPremiumLocks();
    }

    renderCards();

    const searchInput = document.getElementById('passageSearchInput');
    searchInput.addEventListener('input', (e) => {
      state.searchTerm = e.target.value;
      renderCards();
    });

    const sortSelect = document.getElementById('passageSortSelect');
    sortSelect.addEventListener('change', renderCards);
  }

  function renderArticles() {
    navRoot.innerHTML = `
      <div class="reading-section-title">Independent Reading Articles</div>
      <div class="ielts-card-grid">
        ${articleDatabase.map((article) => `
          <a href="${article.href}" class="ielts-card">
            <div class="ielts-card-top">
              <span class="ielts-card-day">${article.title}</span>
              <span class="ielts-badge free">Free</span>
            </div>
            <span class="ielts-card-part">${article.meta}</span>
          </a>
        `).join('')}
      </div>
    `;
  }

  function renderCurrentView() {
    if (!navRoot) return;

    if (state.view === 'home') {
      if (backBtn) backBtn.style.display = 'none';
      renderHome();
      return;
    }

    if (state.view === 'articles') {
      if (backBtn) backBtn.style.display = 'inline-flex';
      renderArticles();
      return;
    }

    if (state.view === 'single') {
      if (backBtn) backBtn.style.display = 'inline-flex';
      renderSingle();
    }
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      state.searchTerm = '';
      if (state.stack.length > 0) {
        const previous = state.stack.pop();
        state.view = previous.view;
        renderCurrentView();
        return;
      }
      state.view = 'home';
      renderCurrentView();
    });
  }

  renderCurrentView();
})();