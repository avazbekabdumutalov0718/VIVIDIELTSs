(() => {
  const listeningDatabase = {
    single: [
      {
        id: 'listening-1',
        title: 'Full Listening Test 1',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Car Servicing + Rosedale Library + Samuel Prout + Chocozine',
        href: 'listening-test-1.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-2',
        title: 'Full Listening Test 2',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Washing Machine Warranty + Driving Licences + Hotel Internship + Salt History',
        href: 'listening-test-2.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-4',
        title: 'Full Listening Test 4',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Party Reservation + The Power of Smell',
        href: 'listening-test-4.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-5',
        title: 'Full Listening Test 5',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Birthday Party Arrangements + Curling + Art & Science + Sustainability',
        href: 'listening-test-5.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-6',
        title: 'Full Listening Test 6',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Hennings Travel Agency + Spring Festival + Archaeology Course',
        href: 'listening-test-6.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-7',
        title: 'Full Listening Test 7',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Drama Club Membership + City Centre Field Trip + Manufacturing Process',
        href: 'listening-test-7.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-8',
        title: 'Full Listening Test 8',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Corton Insurance Claim + Campsite Map + Dolphin Presentation + The Lontar Palm',
        href: 'listening-test-8.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-9',
        title: 'Full Listening Test 9',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'International Club Membership + Assignment Notes + Australian Species Extinction',
        href: 'listening-test-9.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-10',
        title: 'Full Listening Test 10',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Manor Farm Fruit Picking + Karrara Sports Centre + House Prices Survey + Drama in Classrooms',
        href: 'listening-test-10.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-11',
        title: 'Full Listening Test 11',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Adventure Camp + Canadian Maple Syrup',
        href: 'listening-test-11.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-12',
        title: 'Full Listening Test 12',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Theatre Booking + Tourism Research + Patent Attorney Career',
        href: 'listening-test-12.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-13',
        title: 'Full Listening Test 13',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Jackson Island Holiday + Grampic Arts Campus + Geography Lesson Plan + Biomass Fuel',
        href: 'listening-test-13.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-14',
        title: 'Full Listening Test 14',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Newspaper Photo Reprint + Hospitality Training Courses + History of the Telescope',
        href: 'listening-test-14.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-15',
        title: 'Full Listening Test 15',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Film Club + extrahands.com + Song-Writing Course + Office Design',
        href: 'listening-test-15.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-16',
        title: 'Full Listening Test 16',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Family Presents + Work Experience Programme + Theories of Intelligence',
        href: 'listening-test-16.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-17',
        title: 'Full Listening Test 17',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Clarence House Hotel Wedding + Group Project + Impact of Cars in Australia',
        href: 'listening-test-17.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-18',
        title: 'Full Listening Test 18',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Job Details + Eyewitness Reliability + Plastics Exhibition',
        href: 'listening-test-18.html',
        source: 'Full Test',
        type: 'single'
      },
      {
        id: 'listening-19',
        title: 'Full Listening Test 19',
        meta: 'Parts 1–4 · 40 questions · 30 min',
        description: 'Darwin Hostel & Kangaroo Lodge + Anglia Sculpture Park + Marketing Report + Fireworks History',
        href: 'listening-test-19.html',
        source: 'Full Test',
        type: 'single'
      }
    ]
  };

  const state = {
    view: 'home',
    stack: []
  };

  const navRoot = document.getElementById('listeningNavigator');
  const backBtn = document.getElementById('readingBackBtn');

  function renderHome() {
    const items = listeningDatabase.single;

    navRoot.innerHTML = `
      <div class="unit-grid reading-grid">
        ${items.map((item, idx) => {
          const isFree = idx < 2;
          return `
          <a href="${item.href}" class="unit-card reading-card" ${isFree ? '' : 'data-premium-only'}>
            <span class="unit-card-num">${item.meta}</span>
            <span class="unit-card-title">${item.title}</span>
            <span class="unit-card-count">${item.description}</span>
            <span class="reading-card-cta">${isFree ? 'Open test →' : '🔒 Premium'}</span>
          </a>
        `;
        }).join('')}
      </div>
    `;

    if (typeof applyPremiumLocks === 'function') applyPremiumLocks();
  }

  function renderCurrentView() {
    if (!navRoot) return;
    if (backBtn) backBtn.style.display = 'none';
    renderHome();
  }

  renderCurrentView();
})();