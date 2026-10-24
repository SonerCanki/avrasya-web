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
