(() => {
  const state = { view: 'home', topicId: null, stack: [] };

  const root = document.getElementById('speakingRoot');
  const backBtn = document.getElementById('speakingBackBtn');

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Wraps the exact substrings (phrase.find) inside the answer text with
  // <mark> tags so they appear highlighted, matching the reference design.
  function highlightAnswer(answer, phrases) {
    let result = escapeHtml(answer);
    phrases.forEach((p) => {
      const escapedFind = escapeHtml(p.find);
      const idx = result.indexOf(escapedFind);
      if (idx !== -1) {
        result =
          result.slice(0, idx) +
          `<mark class="phrase-mark">${escapedFind}</mark>` +
          result.slice(idx + escapedFind.length);
      }
    });
    return result;
  }

  function renderHome() {
    backBtn.style.display = 'none';
    root.innerHTML = `
      <div class="speaking-topic-grid">
        ${SPEAKING_TOPICS.map((t) => {
          const isFree = t.id === 'travelling';
          return `
          <button class="speaking-topic-card" type="button" data-topic="${t.id}" ${isFree ? '' : 'data-premium-only'}>
            <span class="speaking-topic-icon">${t.icon}</span>
            <span class="speaking-topic-title">${t.title}</span>
            <span class="speaking-topic-count">${isFree ? `${t.questions.length} questions · ${t.questions.length * 5} phrases` : '🔒 Premium'}</span>
          </button>
        `;
        }).join('')}
      </div>
    `;
    root.querySelectorAll('[data-topic]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const topicId = btn.getAttribute('data-topic');
        if (topicId !== 'travelling' && typeof isPremium === 'function') {
          const premium = await isPremium();
          if (!premium) {
            if (typeof showPremiumModal === 'function') showPremiumModal();
            return;
          }
        }
        state.stack.push({ view: 'home' });
        state.view = 'topic';
        state.topicId = topicId;
        renderTopic();
      });
    });
    if (typeof applyPremiumLocks === 'function') applyPremiumLocks();
  }

  function renderTopic() {
    backBtn.style.display = 'inline-flex';
    const topic = SPEAKING_TOPICS.find((t) => t.id === state.topicId);
    if (!topic) return renderHome();

    root.innerHTML = `
      <div class="speaking-topic-header">
        <span class="speaking-topic-icon lg">${topic.icon}</span>
        <div>
          <h2>${topic.title}</h2>
          <p>${topic.questions.length} savol · har birida sample answer va 5 ta kolokatsiya</p>
        </div>
      </div>
      <div class="speaking-question-list">
        ${topic.questions.map((q, idx) => `
          <div class="speaking-q-card" id="q-${idx}">
            <button class="speaking-q-toggle" type="button" data-qidx="${idx}">
              <span class="speaking-q-num">${String(idx + 1).padStart(2, '0')}</span>
              <span class="speaking-q-text">${q.q}</span>
              <span class="speaking-q-arrow">▾</span>
            </button>
            <div class="speaking-q-body" hidden>
              <p class="speaking-answer-label">ANSWER</p>
              <p class="speaking-answer-text">${highlightAnswer(q.answer, q.phrases)}</p>
              <p class="speaking-phrases-label">Native Phrases — bosing va kartani ag'daring</p>
              <div class="flip-grid">
                ${q.phrases.map((p, pIdx) => `
                  <div class="flip-card" data-flip="${idx}-${pIdx}">
                    <div class="flip-card-inner">
                      <div class="flip-card-face flip-card-front">
                        <span>${p.phrase}</span>
                      </div>
                      <div class="flip-card-face flip-card-back">
                        <p class="flip-uz">${p.uz}</p>
                        <p class="flip-def">${p.def}</p>
                        <p class="flip-ex">${p.ex1}</p>
                        <p class="flip-ex">${p.ex2}</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    root.querySelectorAll('.speaking-q-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const body = btn.nextElementSibling;
        const arrow = btn.querySelector('.speaking-q-arrow');
        const isHidden = body.hasAttribute('hidden');
        if (isHidden) {
          body.removeAttribute('hidden');
          arrow.textContent = '▴';
        } else {
          body.setAttribute('hidden', '');
          arrow.textContent = '▾';
        }
      });
    });

    root.querySelectorAll('.flip-card').forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }

  function renderCurrentView() {
    if (!root) return;
    if (state.view === 'home') return renderHome();
    if (state.view === 'topic') return renderTopic();
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (state.stack.length > 0) {
        const prev = state.stack.pop();
        state.view = prev.view;
        renderCurrentView();
        return;
      }
      state.view = 'home';
      renderCurrentView();
    });
  }

  renderCurrentView();
})();