// ===== mobile sidebar toggle =====
const dashBurger = document.getElementById('dashBurger');
const dashSidebar = document.getElementById('dashSidebar');
const dashOverlay = document.getElementById('dashOverlay');

function toggleSidebar(open) {
  dashSidebar.classList.toggle('open', open);
  dashOverlay.classList.toggle('show', open);
}
if (dashBurger) dashBurger.addEventListener('click', () => toggleSidebar(true));
if (dashOverlay) dashOverlay.addEventListener('click', () => toggleSidebar(false));

// ===== daily plan checklist =====
const planList = document.getElementById('planList');
const planProgress = document.getElementById('planProgress');

function updatePlanProgress() {
  if (!planList) return;
  const items = planList.querySelectorAll('li');
  const checked = planList.querySelectorAll('input[type="checkbox"]:checked');
  items.forEach((li) => {
    const box = li.querySelector('input[type="checkbox"]');
    li.classList.toggle('done', box.checked);
  });
  if (planProgress) planProgress.textContent = `${checked.length}/${items.length} done`;
}

async function savePlanState() {
  if (!planList || typeof VividDB === 'undefined') return;
  const checkedIds = Array.from(planList.querySelectorAll('li'))
    .filter((li) => li.querySelector('input[type="checkbox"]')?.checked)
    .map((li) => li.dataset.planId || '');

  try {
    await VividDB.saveUserState('dashboard_plan_state', { checkedIds });
    if (typeof VividDB.showSavedToast === 'function') {
      VividDB.showSavedToast('Plan saved');
    }
  } catch (err) {
    console.error('Failed to save plan state:', err);
  }
}

async function loadPlanState() {
  if (!planList || typeof VividDB === 'undefined') return;
  const savedState = await VividDB.loadUserState('dashboard_plan_state', { checkedIds: [] });
  const checkedIds = new Set((savedState?.checkedIds || []).map(String));

  planList.querySelectorAll('li').forEach((li, index) => {
    li.dataset.planId = String(index);
    const box = li.querySelector('input[type="checkbox"]');
    if (box) box.checked = checkedIds.has(String(index));
  });

  updatePlanProgress();
}

if (planList) {
  planList.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    box.addEventListener('change', async () => {
      updatePlanProgress();
      await savePlanState();
    });
  });
  updatePlanProgress();
  loadPlanState();
}

function animateCountUp(el, target) {
  if (target <= 0) { el.textContent = '0'; return; }
  const duration = 700;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===== real stats (pulled from actual saved progress, not fake demo numbers) =====
(async function renderRealStats() {
  let wordsCount = 0;
  let grammarPassed = 0;
  if (typeof VividDB !== 'undefined') {
    const learned = await VividDB.getLearnedWordIds();
    wordsCount = learned.size;
    const grammarProgress = await VividDB.getGrammarProgress();
    grammarPassed = Object.values(grammarProgress).filter((t) => t.passed).length;
  }

  const wordsEl = document.getElementById('statWords');
  if (wordsEl) animateCountUp(wordsEl, wordsCount);
  const grammarEl = document.getElementById('statGrammar');
  if (grammarEl) animateCountUp(grammarEl, grammarPassed);

  // Lessons completed / Day streak have no tracking system yet,
  // so they honestly start at 0 rather than showing invented progress.

  // Adapt the AI Mentor card to whether the learner has any real activity yet.
  const aiTitle = document.getElementById('aiTitle');
  const aiText = document.getElementById('aiText');
  if (wordsCount > 0 && aiTitle && aiText) {
    aiTitle.textContent = `Nice work — ${wordsCount} word${wordsCount === 1 ? '' : 's'} learned so far.`;
    aiText.textContent = 'Keep your streak going with a few more words today, then try a timed Reading test to see your first band estimate.';
  }

  // ===== reading progress (only present on dashboard.html) =====
  const emptyEl = document.getElementById('readingProgressEmpty');
  const listEl = document.getElementById('readingProgressList');
  if (typeof VividDB !== 'undefined' && emptyEl && listEl) {
    const results = await VividDB.getReadingResults();
    if (results.length > 0) {
      emptyEl.hidden = true;
      listEl.hidden = false;
      listEl.innerHTML = results.slice(0, 5).map((r) => {
        const date = new Date(r.completed_at || r.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        return `
          <div class="reading-progress-row">
            <span class="reading-progress-test">${r.test_id || r.testId}</span>
            <span class="reading-progress-score">${r.score}/${r.total} · Band ${r.band}</span>
            <span class="reading-progress-date">${date}</span>
          </div>`;
      }).join('');
    }
  }
})();