/* Uplift site — vanilla JS, no dependencies. Animations touch transform/opacity only. */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  $$('.yr').forEach(e => (e.textContent = new Date().getFullYear()));

  /* nav: scrolled state + mobile menu */
  const nav = $('#nav'), menuBtn = $('.menu-btn'), links = $('#navlinks');
  if (menuBtn && links) {
    const close = () => { menuBtn.setAttribute('aria-expanded', 'false'); links.classList.remove('open'); menuBtn.setAttribute('aria-label', 'Open menu'); };
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      links.classList.toggle('open', open);
    });
    links.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* reveal on scroll */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  $$('.reveal, .reveal-scale, .fan').forEach(el => io.observe(el));

  /* statement words light up with scroll */
  const words = $('.words');
  let wordEls = [];
  if (words) {
    words.innerHTML = words.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    wordEls = $$('.w', words);
  }

  /* hero background crossfade */
  const bgs = $$('.hero-bg img');
  const loadLazyBgs = () => bgs.forEach(img => { if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); } });
  if (document.readyState === 'complete') setTimeout(loadLazyBgs, 300); else window.addEventListener('load', () => setTimeout(loadLazyBgs, 300));
  let bgIndex = 0;
  const nextBg = () => {
    const nxt = (bgIndex + 1) % bgs.length;
    const img = bgs[nxt];
    if (!img.complete || !img.naturalWidth) return; // wait until loaded
    bgs[bgIndex].classList.remove('on');
    img.classList.add('on');
    bgIndex = nxt;
  };

  /* typing quote */
  const quotes = [
    ['One good thought can change your day.', 'Uplift'],
    ['Bravery is being the only one who knows you’re afraid.', 'Franklin P. Jones'],
    ['The wound is the place where the light enters you.', 'Rumi'],
    ['Peace comes from within. Do not seek it without.', 'Buddha'],
    ['The best way to predict the future is to create it.', 'Peter Drucker']
  ];
  const tText = $('.typed-text'), tAuthor = $('.typed-author');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let heroVisible = true;
  async function typeLoop() {
    let qi = 0;
    // first quote is already rendered in HTML; hold, then continue cycling
    await sleep(3200);
    while (true) {
      qi = (qi + 1) % quotes.length;
      const [q, a] = quotes[qi];
      while (!heroVisible || document.hidden) await sleep(500);
      // erase
      tAuthor.classList.remove('show');
      let cur = tText.textContent;
      while (cur.length) { cur = cur.slice(0, -Math.max(1, Math.round(cur.length / 14))); tText.textContent = cur; await sleep(22); }
      nextBg();
      await sleep(350);
      for (let i = 1; i <= q.length; i++) { tText.textContent = q.slice(0, i); await sleep(q[i - 1] === ' ' ? 70 : 38 + Math.random() * 40); }
      tAuthor.textContent = a === 'Uplift' ? 'Uplift' : '— ' + a;
      tAuthor.classList.add('show');
      await sleep(4200);
    }
  }
  if (tText) {
    if (!reduce) typeLoop();
    else setInterval(() => { if (!document.hidden) nextBg(); }, 9000);
  }

  /* particles */
  const pBox = $('.particles');
  if (pBox && !reduce) {
    const n = window.innerWidth < 700 ? 14 : 28;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--s', (1.5 + Math.random() * 3).toFixed(1) + 'px');
      p.style.setProperty('--d', (12 + Math.random() * 16).toFixed(1) + 's');
      p.style.setProperty('--delay', (-Math.random() * 25).toFixed(1) + 's');
      p.style.setProperty('--x', (Math.random() * 120 - 60).toFixed(0) + 'px');
      p.style.setProperty('--o', (0.25 + Math.random() * 0.55).toFixed(2));
      frag.appendChild(p);
    }
    pBox.appendChild(frag);
  }

  /* hero phone tilt with pointer */
  const heroPhone = $('#heroPhone'), hero = $('.hero');
  if (hero) new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);
  if (heroPhone && fine && !reduce) {
    let raf = 0, tx = 0, ty = 0;
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        heroPhone.style.transform = `rotateY(${-14 + tx * 18}deg) rotateX(${6 - ty * 12}deg) rotateZ(1deg)`;
      });
    });
    hero.addEventListener('pointerleave', () => { heroPhone.style.transform = ''; });
  }

  /* magnetic buttons */
  if (fine && !reduce) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + 'px');
        el.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); });
    });
    /* feature card spotlight */
    $$('.fcard').forEach(c => {
      const s = $('.spot', c);
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        s.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        s.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      });
    });
  }
  /* magnetic transforms need CSS vars applied to transform; .appstore & .round use same vars */
  $$('.appstore.magnetic, .round.magnetic').forEach(el => {
    el.style.transform = 'translate3d(var(--mx,0px),var(--my,0px),0)';
    el.style.transition = 'transform .35s cubic-bezier(.22,1,.36,1)';
  });

  /* showcase: sticky phone, scroll-driven tilt + screen switching */
  const steps = $$('.step'), stagePhone = $('#stagePhone');
  const stageImgs = stagePhone ? $$('.screen img', stagePhone) : [];
  const rings = $$('.stage-ring'), orb = $('.stage-orb');
  const showcase = $('.showcase');
  let activeShot = 0;
  const setShot = i => {
    if (i === activeShot) return;
    stageImgs.forEach((im, k) => im.classList.toggle('on', k === i));
    activeShot = i;
  };
  if (steps.length) {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          steps.forEach(s => s.classList.toggle('active', s === en.target));
          setShot(+en.target.dataset.shot);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => sio.observe(s));
    steps[0].classList.add('active');
  }

  /* scroll loop (single rAF) */
  const bar = $('.progress');
  const premiumImg = $('.premium > img'), finalImg = $('.final > img');
  const heroBg = $('.hero-bg');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = `scaleX(${docH > 0 ? y / docH : 0})`;
    nav && nav.classList.toggle('scrolled', y > 30);
    if (reduce) return;
    if (heroBg && y < vh * 1.2) heroBg.style.transform = `translate3d(0,${y * 0.25}px,0)`;

    if (wordEls.length) {
      const r = words.getBoundingClientRect();
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      const lit = Math.round(p * wordEls.length);
      wordEls.forEach((w, i) => w.classList.toggle('lit', i < lit));
    }
    if (stagePhone && showcase && window.innerWidth > 820) {
      const r = showcase.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - vh), 0, 1); // 0..1 through section
      const rotY = -22 + p * 44, rotX = 8 - p * 10, rz = Math.sin(p * Math.PI) * -3;
      stagePhone.style.transform = `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) translate3d(0,${(Math.sin(p * Math.PI * 2) * 14).toFixed(1)}px,0)`;
      rings.forEach((rg, i) => { rg.style.transform = `scale(${(0.85 + p * 0.3 + i * 0.04).toFixed(3)}) rotate(${(p * (i ? -60 : 90)).toFixed(1)}deg)`; });
      if (orb) orb.style.transform = `translate3d(${((p - 0.5) * 120).toFixed(1)}px,${((0.5 - p) * 80).toFixed(1)}px,0)`;
    }
    const par = (img, k) => {
      if (!img) return;
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const c = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.transform = `translate3d(0,${(c * k).toFixed(1)}px,0) scale(1.1)`;
    };
    par(premiumImg, -60); par(finalImg, -90);
  }
  const reqScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  window.addEventListener('scroll', reqScroll, { passive: true });
  window.addEventListener('resize', reqScroll, { passive: true });
  onScroll();

  /* focus-mode demo */
  const fp = $('#focusPhone'), ring = $('.ring'), status = $('#focusStatus');
  if (fp) {
    let timer = 0, started = false;
    const restartRing = () => { if (!ring) return; ring.classList.remove('run'); void ring.getBoundingClientRect(); ring.classList.add('run'); };
    const arm = () => {
      clearTimeout(timer);
      fp.classList.remove('focused');
      fp.setAttribute('aria-label', 'Focus mode demo. Controls are visible; they fade after 3 seconds.');
      restartRing();
      status.innerHTML = '<strong>Controls visible</strong>Focus mode in 3 seconds…';
      timer = setTimeout(() => {
        fp.classList.add('focused');
        fp.setAttribute('aria-label', 'Focus mode demo. Only the quote remains. Tap to show the controls.');
        status.innerHTML = '<strong>Focus mode</strong>Only the quote and author remain. Tap the phone to bring the controls back.';
      }, 3000);
    };
    fp.addEventListener('click', e => {
      if (!reduce && e.clientX) {
        const sc = $('.screen', fp).getBoundingClientRect();
        const rp = document.createElement('span');
        rp.className = 'tap-ripple';
        rp.style.left = (e.clientX - sc.left) + 'px'; rp.style.top = (e.clientY - sc.top) + 'px';
        $('.screen', fp).appendChild(rp);
        setTimeout(() => rp.remove(), 800);
      }
      arm();
    });
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !started) { started = true; arm(); }
    }, { threshold: 0.6 }).observe(fp);
  }

  /* theme carousel: center scaling, inner parallax, drag, arrows */
  const track = $('#track');
  if (track) {
    const cards = $$('.tcard', track);
    let traf = 0;
    const update = () => {
      traf = 0;
      const tr = track.getBoundingClientRect(), mid = tr.left + tr.width / 2;
      cards.forEach(c => {
        const r = c.getBoundingClientRect();
        const d = (r.left + r.width / 2 - mid) / tr.width; // -0.5..0.5 roughly
        const ad = Math.min(1, Math.abs(d) * 2);
        c.style.setProperty('--sc', (1 - ad * 0.1).toFixed(3));
        c.style.setProperty('--op', (1 - ad * 0.45).toFixed(3));
        if (!reduce) c.style.setProperty('--px', (d * -40).toFixed(1) + 'px');
      });
    };
    track.addEventListener('scroll', () => { if (!traf) traf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
    const step = dir => {
      const w = cards[0].getBoundingClientRect().width + 22;
      track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
    };
    $('#prev').addEventListener('click', () => step(-1));
    $('#next').addEventListener('click', () => step(1));
    track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } });
    // mouse drag
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.classList.add('dragging'); });
    window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; track.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => {
      if (!down) return; down = false; track.classList.remove('dragging');
      // snap to nearest
      const w = cards[0].getBoundingClientRect().width + 22;
      track.scrollTo({ left: Math.round(track.scrollLeft / w) * w, behavior: reduce ? 'auto' : 'smooth' });
    });
    track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    // start at the 2nd card so both sides show
    requestAnimationFrame(() => { const c = cards[2] || cards[0]; track.scrollLeft = c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2; update(); });
  }

  /* widgets: rotate quote + background */
  const wq = [
    ['Peace comes from within. Do not seek it without.', 'Buddha'],
    ['The best way to predict the future is to create it.', 'Peter Drucker'],
    ['Calm mind brings inner strength and self‑confidence.', 'Dalai Lama'],
    ['Life is a balance of holding on and letting go.', 'Rumi']
  ];
  const sq = ['Find peace in the present moment.', 'Be thankful for what you have.', 'Bravery is being the only one who knows you’re afraid.'];
  const lq = ['The wound is the place where the light enters you.', 'The only way to do great work is to love what you do.', 'Calm mind brings inner strength.'];
  const wdgs = $$('[data-wdg]'), lsq = $('[data-lsq]');
  const wStage = $('.w-stage');
  let wi = 0, wVisible = false;
  if (wStage) new IntersectionObserver(([e]) => { wVisible = e.isIntersecting; }).observe(wStage);
  const swapText = (el, txt, after) => {
    el.classList.add('out');
    setTimeout(() => { el.textContent = txt; after && after(); el.classList.remove('out'); }, reduce ? 0 : 600);
  };
  setInterval(() => {
    if (!wVisible || document.hidden) return;
    wi++;
    wdgs.forEach((w, k) => {
      const imgs = $$('.wbg img', w);
      imgs.forEach((im, j) => im.classList.toggle('on', j === wi % imgs.length));
      const q = $('.wq', w), a = $('.wa', w);
      if (k === 0) swapText(q, wq[wi % wq.length][0], () => { if (a) a.textContent = wq[wi % wq.length][1]; });
      else swapText(q, sq[wi % sq.length]);
    });
    if (lsq) swapText(lsq, lq[wi % lq.length]);
  }, 4500);

  /* FAQ accordion */
  $$('.qa button').forEach(b => {
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      b.closest('.qa').classList.toggle('open', open);
    });
  });
})();
