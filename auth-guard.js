/* Include AFTER db.js on every protected page (dashboard, vocabulary, grammar, reading). */
(async function authGuard() {
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      if (typeof VividDB !== 'undefined' && VividDB.isConfigured) await VividDB.signOut();
      window.location.href = '/auth.html';
    });
  }

  const configured = typeof VividDB !== 'undefined' && VividDB.isConfigured;

  if (configured) {
    const session = await VividDB.getSession();
    if (!session) {
      window.location.href = '/auth.html';
      return;
    }
  }

  await refreshUserDisplay();
  initEditableName();
})();

async function getFullProfile() {
  if (typeof VividDB !== 'undefined' && VividDB.isConfigured) {
    const profile = await VividDB.getProfile();
    return {
      full_name: profile?.full_name || 'IELTS Student',
      target_band: profile?.target_band ?? 7.0,
      current_band: profile?.current_band ?? 5.5,
    };
  }
  let name = 'IELTS Student';
  try { name = localStorage.getItem('vivid_guest_name') || name; } catch (e) {}
  return { full_name: name, target_band: 7.0, current_band: 5.5 };
}

async function getDisplayName() {
  const p = await getFullProfile();
  return p.full_name;
}

function initialsOf(name) {
  return name.split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'IS';
}

function firstNameOf(name) {
  return (name || '').trim().split(/\s+/)[0] || 'there';
}

function timeOfDayGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

async function refreshUserDisplay() {
  try {
    const profile = await getFullProfile();
    const name = profile.full_name;

    // Sidebar / topbar identity
    document.querySelectorAll('.dash-user-name').forEach((el) => (el.textContent = name));
    document.querySelectorAll('.dash-avatar').forEach((el) => (el.textContent = initialsOf(name)));

    // Dashboard greeting header (was hardcoded to a single demo user before)
    const greetingNameEl = document.getElementById('greetingName');
    if (greetingNameEl) greetingNameEl.textContent = firstNameOf(name);
    const greetingTitleEl = document.getElementById('greetingTitle');
    if (greetingTitleEl && greetingNameEl) {
      greetingTitleEl.childNodes[0].textContent = `${timeOfDayGreeting()}, `;
    }

    // Band score pill — now reflects this user's own profile row
    const bandCurrentEl = document.getElementById('bandCurrent');
    if (bandCurrentEl) bandCurrentEl.textContent = Number(profile.current_band).toFixed(1);
    const bandTargetEl = document.getElementById('bandTarget');
    if (bandTargetEl) bandTargetEl.textContent = Number(profile.target_band).toFixed(1);
  } catch (e) {
    console.warn('Could not load profile', e);
  }
}

// Click on your name in the sidebar to rename yourself (works with or without Supabase).
function initEditableName() {
  document.querySelectorAll('.dash-user-name').forEach((el) => {
    el.title = 'Click to edit your name';
    el.style.cursor = 'pointer';
    el.addEventListener('click', async () => {
      const current = el.textContent;
      const next = prompt('Your name:', current);
      if (!next || !next.trim() || next.trim() === current) return;
      const name = next.trim();
      try { localStorage.setItem('vivid_guest_name', name); } catch (e) {}
      if (typeof VividDB !== 'undefined' && VividDB.isConfigured) {
        await VividDB.updateProfile({ full_name: name });
      }
      refreshUserDisplay();
    });
  });
}// Add to auth-guard.js — checks if the user has active premium access.
async function isPremium() {
  if (typeof VividDB === 'undefined' || !VividDB.isConfigured) return false;
  const profile = await VividDB.getProfile();
  if (!profile || profile.tariff !== 'premium') return false;

  // Agar muddat belgilangan bo'lsa, muddati o'tganini tekshiramiz
  if (profile.premium_expires_at) {
    const expires = new Date(profile.premium_expires_at);
    if (expires < new Date()) return false;
  }
  return true;
}

// Premium sahifa boshida chaqiring: agar false bo'lsa, foydalanuvchini qaytaradi.
async function requirePremium(redirectTo = '/dashboard.html?locked=1') {
  const ok = await isPremium();
  if (!ok) {
    window.location.href = redirectTo;
  }
  return ok;
}

// Dashboarddagi qulf (🔒) belgilarini avtomatik yashirish/ko'rsatish uchun
async function applyPremiumLocks() {
  const premium = await isPremium();
  document.querySelectorAll('[data-premium-only]').forEach((el) => {
    if (premium) {
      el.classList.remove('locked');
      el.style.opacity = '1';
      el.style.filter = 'none';
      // Don't set pointer-events: none for premium users
      const lockOverlay = el.querySelector('.premium-lock-overlay');
      if (lockOverlay) lockOverlay.remove();
    } else {
      el.classList.add('locked');
      el.style.opacity = '0.6';
      el.style.filter = 'grayscale(1)';
      // Keep pointer-events auto so we can capture the click
      el.style.pointerEvents = 'auto';
      
      // Create lock overlay if it doesn't exist
      if (!el.querySelector('.premium-lock-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'premium-lock-overlay';
        overlay.innerHTML = `
          <div class="premium-lock-content">
            <div class="premium-lock-icon">🔒</div>
            <div class="premium-lock-text">Only for Premium users</div>
          </div>
        `;
        el.style.position = 'relative';
        el.appendChild(overlay);
      }
      
      // Add click handler to show modal and prevent default behavior
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showPremiumModal();
        return false;
      }, true);
    }
  });
}

// Show premium upgrade modal
function showPremiumModal(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('premiumModal');
  if (modal) {
    modal.style.display = 'flex';
  } else {
    // Create modal if it doesn't exist
    const newModal = document.createElement('div');
    newModal.id = 'premiumModal';
    newModal.className = 'premium-modal';
    newModal.innerHTML = `
      <div class="premium-modal-content">
        <button class="premium-modal-close" onclick="document.getElementById('premiumModal').style.display = 'none';">&times;</button>
        <div class="premium-modal-icon">🔒</div>
        <h2>Premium Feature</h2>
        <p>Bu bo'lim faqat Premium tarif uchun mavjud.</p>
        <p>Premiumga o'tish uchun Telegram orqali murojaat qiling:</p>
        <a href="https://t.me/vividieltsadmin" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          📱 Telegram bilan bog'lanish
        </a>
        <button class="btn btn-outline" onclick="document.getElementById('premiumModal').style.display = 'none';">Yopish</button>
      </div>
      <div class="premium-modal-backdrop" onclick="document.getElementById('premiumModal').style.display = 'none';"></div>
    `;
    document.body.appendChild(newModal);
    newModal.style.display = 'flex';
  }
}
// ============================================================
// PROFIL TO'LDIRISH (ism + username) — Telegram orqali kirgan
// foydalanuvchilarda username hali yo'q bo'lsa shu oynani ko'rsatadi.
// ============================================================
async function ensureProfileComplete() {
  if (typeof VividDB === 'undefined' || !VividDB.isConfigured) return;
  const profile = await VividDB.getProfile();
  if (!profile) return;
  if (profile.username) return; // allaqachon to'ldirilgan

  showCompleteProfileModal(profile);
}

function showCompleteProfileModal(profile) {
  if (document.getElementById('vividProfileModal')) return;

  const overlay = document.createElement('div');
  overlay.id = 'vividProfileModal';
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.55);
    display:flex; align-items:center; justify-content:center; padding:16px;
    font-family:'Inter',Arial,sans-serif;`;

  overlay.innerHTML = `
    <div style="background:#fff; border-radius:16px; padding:28px; width:100%; max-width:380px; box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <h2 style="margin:0 0 6px; font-size:20px; font-weight:700; color:#111;">Profilingizni to'ldiring</h2>
      <p style="margin:0 0 20px; font-size:14px; color:#666;">Davom etishdan oldin ism va username kiriting.</p>

      <label style="display:block; font-size:13px; font-weight:600; color:#333; margin-bottom:6px;">To'liq ism</label>
      <input id="vpFullName" type="text" value="${(profile.full_name || '').replace(/"/g, '&quot;')}"
        style="width:100%; box-sizing:border-box; padding:10px 12px; border:1px solid #ddd; border-radius:8px; font-size:14px; margin-bottom:14px;" />

      <label style="display:block; font-size:13px; font-weight:600; color:#333; margin-bottom:6px;">Username</label>
      <input id="vpUsername" type="text" placeholder="masalan: azizbek_23"
        style="width:100%; box-sizing:border-box; padding:10px 12px; border:1px solid #ddd; border-radius:8px; font-size:14px;" />
      <div id="vpError" style="color:#e11d48; font-size:13px; margin-top:8px; min-height:16px;"></div>

      <button id="vpSubmit" style="width:100%; margin-top:16px; padding:12px; background:#111; color:#fff; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer;">
        Saqlash va davom etish
      </button>
    </div>`;

  document.body.appendChild(overlay);

  const submitBtn = overlay.querySelector('#vpSubmit');
  const nameInput = overlay.querySelector('#vpFullName');
  const userInput = overlay.querySelector('#vpUsername');
  const errorEl = overlay.querySelector('#vpError');

  submitBtn.addEventListener('click', async () => {
    const fullName = nameInput.value.trim();
    let username = userInput.value.trim().toLowerCase();

    if (!fullName) { errorEl.textContent = 'Ismingizni kiriting.'; return; }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      errorEl.textContent = 'Username 3-20 belgidan iborat, faqat lotin harflari, raqam va pastki chiziq (_) bo\'lishi mumkin.';
      return;
    }

    errorEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saqlanmoqda...';

    const { error } = await VividDB.updateProfile({ full_name: fullName, username });

    if (error) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Saqlash va davom etish';
      if (String(error.message || '').includes('duplicate') || error.code === '23505') {
        errorEl.textContent = 'Bu username band. Boshqasini tanlang.';
      } else {
        errorEl.textContent = 'Xatolik yuz berdi. Qayta urinib ko\'ring.';
      }
      return;
    }

    overlay.remove();
    refreshUserDisplay();
  });
}

// Har bir himoyalangan sahifa yuklanganda tekshiramiz
ensureProfileComplete();
