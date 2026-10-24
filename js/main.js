// Avrasya Toptan Pasta Süsleri — site behaviour.
(() => {
  const waNumber = document.body.dataset.wa;
  const waLink = text => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // WhatsApp links carry a ready-made first message.
  document.querySelectorAll('[data-wa-text]').forEach(a => { a.href = waLink(a.dataset.waText); });

  // ---------- Mobile menu ----------
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Kapat' : 'Menü';
  });
  nav.addEventListener('click', e => {
    if (e.target.closest('a') && nav.classList.contains('open')) toggle.click();
  });

  // ---------- Videos: play only while on screen ----------
  const videos = document.querySelectorAll('.auto-video');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    videos.forEach(v => { v.controls = true; });
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) target.play().catch(() => { target.controls = true; });
        else target.pause();
      });
    }, { threshold: 0.35 });
    videos.forEach(v => io.observe(v));
  }

  // ---------- Collection filter ----------
  // Each stand's data-kategori lists its topics. js/animations.js listens for 'galeri:suzuldu'
  // to re-measure the sideways strip.
  const gallery = document.getElementById('gallery');
  const filter = document.querySelector('.filtre');
  const count = document.querySelector('.filtre-sayi');
  filter.hidden = false;
  count.hidden = false;
  filter.addEventListener('click', e => {
    const btn = e.target.closest('button[data-filtre]');
    if (!btn || btn.getAttribute('aria-pressed') === 'true') return;
    filter.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    const key = btn.dataset.filtre;
    let shown = 0;
    gallery.querySelectorAll('li').forEach(li => {
      li.hidden = key !== 'hepsi' && !li.dataset.kategori.split(' ').includes(key);
      if (!li.hidden) shown++;
    });
    count.textContent = `${shown} stand`;
    gallery.scrollLeft = 0;
    document.dispatchEvent(new CustomEvent('galeri:suzuldu'));
  });

  // ---------- Final: blowing out the candles ----------
  // A click or tap puts out every candle, one after another; a mouse passing over a candle puts
  // out that one. When the last one goes out the WhatsApp button glows and js/animations.js
  // hears 'mumlar:sondu' (confetti). Clicking the dark cake lights the candles again.
  const finalBtn = document.querySelector('.final-dugme');
  const hint = document.querySelector('.final-ipucu');
  const candles = [...finalBtn.querySelectorAll('.mum')];
  const finalWa = document.querySelector('.contact-copy .btn-wa');
  const hintLit = hint.textContent;
  finalBtn.disabled = false;
  hint.hidden = false;
  const allOut = () => candles.every(c => c.classList.contains('sondu'));
  const blow = candle => {
    if (candle.classList.contains('sondu')) return;
    candle.classList.add('sondu');
    if (!allOut()) return;
    hint.textContent = 'Dileğiniz kabul olsun! Standınız için bize yazın.';
    finalBtn.setAttribute('aria-label', 'Mumları yeniden yak');
    finalWa.classList.add('parla');
    document.dispatchEvent(new CustomEvent('mumlar:sondu'));
  };
  finalBtn.addEventListener('click', () => {
    if (allOut()) {
      candles.forEach(c => c.classList.remove('sondu'));
      hint.textContent = hintLit;
      finalBtn.setAttribute('aria-label', 'Mumları üfle');
      finalWa.classList.remove('parla');
      return;
    }
    candles.filter(c => !c.classList.contains('sondu'))
      .forEach((c, i) => (reduceMotion ? blow(c) : setTimeout(() => blow(c), i * 110)));
  });
  candles.forEach(c => c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') blow(c); }));

  // ---------- Gallery lightbox ----------
  const box = document.getElementById('lightbox');
  const boxImg = box.querySelector('img');
  gallery.addEventListener('click', e => {
    const btn = e.target.closest('button[data-full]');
    if (!btn) return;
    boxImg.src = btn.dataset.full;
    boxImg.alt = btn.querySelector('img').alt;
    box.showModal();
  });
  box.addEventListener('click', e => { if (e.target === box) box.close(); });
})();
