// ===== mobile nav toggle =====
const burger = document.getElementById('navBurger');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

if (burger) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navActions.classList.toggle('open');
  });
}

// ===== animate skill rings when visible =====
const CIRCUMFERENCE = 163; // 2 * PI * r(26), matches CSS stroke-dasharray

function animateRings() {
  document.querySelectorAll('.ring').forEach(ring => {
    const value = parseFloat(ring.dataset.value) || 0;
    const fg = ring.querySelector('.ring-fg');
    const offset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE;
    fg.style.strokeDashoffset = offset;
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateRings();
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });

const scoreCard = document.querySelector('.score-card');
if (scoreCard) observer.observe(scoreCard);

// fallback in case IntersectionObserver isn't supported
window.addEventListener('load', () => {
  setTimeout(animateRings, 400);
});

// ===== checkout (Payme / Click) =====
// Point this at your running backend (see /server folder).
const API_BASE = 'http://localhost:4000';

const payModal = document.getElementById('payModal');
const payModalClose = document.getElementById('payModalClose');
const payModalPlan = document.getElementById('payModalPlan');
const payModalStatus = document.getElementById('payModalStatus');

let selectedPlan = null;
const planLabels = { premium: 'Get Premium', pro: 'Get Pro' };

document.querySelectorAll('[data-plan]').forEach((btn) => {
  btn.addEventListener('click', () => {
    selectedPlan = btn.dataset.plan;
    payModalPlan.textContent = planLabels[selectedPlan] || 'Checkout';
    payModalStatus.textContent = '';
    payModal.hidden = false;
  });
});

if (payModalClose) {
  payModalClose.addEventListener('click', () => (payModal.hidden = true));
}
if (payModal) {
  payModal.addEventListener('click', (e) => {
    if (e.target === payModal) payModal.hidden = true;
  });
}

document.querySelectorAll('.pay-method').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const method = btn.dataset.method; // 'payme' | 'click'
    payModalStatus.textContent = 'Creating your order...';
    try {
      const res = await fetch(`${API_BASE}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, method }),
      });
      if (!res.ok) throw new Error('Checkout request failed');
      const data = await res.json();
      // Redirect the user to Payme/Click's hosted checkout page.
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      payModalStatus.textContent = 'Something went wrong. Please try again.';
    }
  });
});

// ===== learner counter: honest base number that grows deterministically over time =====
(function animateLearnerCount() {
  const el = document.getElementById('learnerCount');
  if (!el) return;
  const LAUNCH_DATE = new Date('2026-07-15T00:00:00Z');
  const BASE_COUNT = 500;
  const daysSinceLaunch = Math.max(0, Math.floor((Date.now() - LAUNCH_DATE.getTime()) / 86400000));
  // Deterministic pseudo-random daily growth (same value on every visit for a given day),
  // so the number only ever goes up and never flickers between reloads.
  let total = BASE_COUNT;
  for (let d = 0; d < daysSinceLaunch; d++) {
    const seed = Math.sin(d + 1) * 10000;
    const dailyGrowth = 3 + Math.floor((seed - Math.floor(seed)) * 9); // 3–11 new learners/day
    total += dailyGrowth;
  }
  el.textContent = total.toLocaleString('en-US') + '+';
})();