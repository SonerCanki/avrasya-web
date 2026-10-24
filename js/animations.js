// Avrasya Toptan Pasta Süsleri — the scroll story (PLAN.md, section 3).
// Libraries are self-hosted in assets/vendor. The page's static look is always the final state:
// starting states for animated elements are written under html.anim, which the inline script in
// <head> sets only when motion is allowed. With reduced motion, without JavaScript, or if a library
// fails to load, nothing is hidden and nothing moves.
(() => {
  const root = document.documentElement;
  const { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Lenis } = window;
  if (!gsap || !ScrollTrigger || !SplitText || !DrawSVGPlugin || !Lenis) {
    root.classList.remove('anim', 'acilis-on');
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

  // ---------- Confetti ----------
  // Used by the hero and final scenes. Fewer pieces on phones.
  const CONFETTI_COLORS = ['#F4A7BB', '#D9B15C', '#F3D98F', '#45E0D8', '#7CC6F0', '#D6457A'];
  const mobileQuery = window.matchMedia('(max-width: 860px)');
  const party = (options = {}) => window.confetti?.({
    particleCount: mobileQuery.matches ? 45 : 110,
    spread: 75,
    startVelocity: 38,
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
    ...options,
  });

  // ---------- Entrances ----------
  // The opening and the hero play once per page load, so they live outside gsap.matchMedia and are
  // not rebuilt when the layout changes. If reduced motion is switched on while they play,
  // settleEntrances() jumps them to their end.
  const entrances = [];
  let splitTitle = null;

  // Scene 0: the logo appears, a small candle lights, the curtain lifts. 1.2 s, first visit only.
  const playOpening = () => {
    const tl = gsap.timeline({
      onComplete() {
        root.classList.remove('acilis-on');
        try { localStorage.setItem('avrasya-acilis', '1'); } catch (e) { /* private mode: it plays again next time */ }
      },
    });
    tl.fromTo('.acilis-logo', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)' })
      .fromTo('.acilis-mum', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25, ease: 'power2.out' }, 0.25)
      .fromTo('.acilis-mum .alev', { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.25, ease: 'back.out(3)' }, 0.45)
      .to('.acilis-icerik', { autoAlpha: 0, scale: 0.94, duration: 0.2 }, 0.72)
      // Lift past the dripping edge as well, which hangs below the curtain.
      .to('.acilis-perde', { yPercent: -100, y: -80, duration: 0.48, ease: 'power3.inOut' }, 0.72);
    entrances.push(tl);
  };

  // Scene 1: the title letters bounce in, the text and balloons follow. On the first scroll
  // (or a moment later) the topper drops into the cake, the candles light and confetti bursts.
  const playHero = delay => {
    splitTitle = new SplitText('.hero h1', { type: 'words,chars' });
    gsap.set('.hero h1', { visibility: 'visible' });
    const intro = gsap.timeline({ delay });
    intro.from(splitTitle.chars, {
      yPercent: -120,
      autoAlpha: 0,
      rotation: () => gsap.utils.random(-25, 25),
      duration: 0.7,
      ease: 'back.out(2.2)',
      stagger: 0.025,
      onComplete() { splitTitle.revert(); },
    })
      .fromTo(['.hero .lede', '.hero-actions'], { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out', stagger: 0.12 }, 0.45)
      .fromTo('.hero-balloons .balon', { y: 160, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 2.2, ease: 'power2.out', stagger: 0.25 }, 0.2);
    entrances.push(intro);

    const cake = document.querySelector('.pasta');
    const drop = gsap.timeline({ paused: true });
    drop.to('#sus', { autoAlpha: 1, duration: 0.15 }, 0)
      .fromTo('#sus', { y: -330, rotation: -10, transformOrigin: '50% 100%' }, { y: 0, rotation: 0, duration: 0.85, ease: 'bounce.out' }, 0)
      // The cake gives a little as the topper lands.
      .to(cake, { scaleY: 0.96, scaleX: 1.025, transformOrigin: '50% 100%', duration: 0.08, ease: 'power1.in' }, 0.3)
      .to(cake, { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' }, 0.38)
      .fromTo('.pasta .alev', { scale: 0, autoAlpha: 0, transformOrigin: '50% 100%' }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.18 }, 0.75)
      .call(() => {
        const r = cake.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        party({ origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height * 0.22) / window.innerHeight } });
      }, null, 0.95);
    entrances.push(drop);

    const start = () => {
      window.removeEventListener('scroll', start);
      clearTimeout(timer);
      if (!drop.isActive() && drop.progress() === 0) drop.play();
    };
    const timer = setTimeout(start, (delay + 1.6) * 1000);
    window.addEventListener('scroll', start, { passive: true });
  };

  const settleEntrances = () => {
    // suppressEvents: no confetti and no localStorage write mid-jump; the clean-up happens here.
    entrances.forEach(tl => tl.progress(1, true));
    splitTitle?.revert();
    root.classList.remove('acilis-on');
  };

  // ---------- Scenes ----------
  // A scene is a function that builds its tweens and ScrollTriggers from { mobile, lenis }.
  // gsap.matchMedia reverts all of them when reduced motion is switched on or the layout
  // crosses the mobile breakpoint, then builds them again.
  // Still to come, in page order: stand, koleksiyon, kule, uretim, final.
  const scenes = [];
  const scene = (name, build) => scenes.push({ name, build });

  // Sprinkles behind the hero drift up more slowly than the page.
  scene('serpinti', () => {
    gsap.to('.hero-serpinti', {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  // Balloons bob on their strings and float up faster than the page as it scrolls.
  // The bob moves each <use>, the parallax the wrapper, so neither fights the entrance on .balon.
  scene('balonlar', ({ mobile }) => {
    gsap.utils.toArray('.hero-balloons use').forEach((el, i) => {
      gsap.to(el, { y: -9, rotation: i % 2 ? 2 : -2, transformOrigin: '50% 100%', duration: 2.2 + i * 0.45, ease: 'sine.inOut', repeat: -1, yoyo: true });
    });
    gsap.to('.hero-balloons', {
      y: mobile ? -60 : -140,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  // Candle flames flicker while the hero is on screen.
  scene('mumlar', () => {
    const loops = [
      ...gsap.utils.toArray('.pasta .alev path').map((el, i) => gsap.to(el, {
        scaleY: 0.86, scaleX: 1.07, transformOrigin: '50% 100%',
        duration: 0.14 + (i % 3) * 0.04, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true,
      })),
      gsap.to('.pasta .alev-isik', { scale: 0.9, opacity: 0.75, transformOrigin: '50% 50%', duration: 0.3, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true }),
    ];
    ScrollTrigger.create({
      trigger: '.hero', start: 'top bottom', end: 'bottom top',
      onToggle: self => loops.forEach(t => (self.isActive ? t.play() : t.pause())),
    });
  });

  // ---------- Smooth scroll and scene setup ----------
  let lenis = null;
  const startedWithMotion = root.classList.contains('anim');

  try {
    gsap.matchMedia().add({ motion: '(prefers-reduced-motion: no-preference)', mobile: mobileQuery.media }, ctx => {
      if (!ctx.conditions.motion) {
        settleEntrances();
        root.classList.remove('anim');
        return;
      }
      // html.anim is not added back here: its starting states only make sense before the entrances play.

      lenis = new Lenis({ autoRaf: false });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = time => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      scenes.forEach(({ build }) => build({ mobile: ctx.conditions.mobile, lenis }));

      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        lenis = null;
      };
    });

    if (startedWithMotion) {
      const opening = root.classList.contains('acilis-on');
      if (opening) playOpening();
      // The title starts as the curtain lifts.
      playHero(opening ? 0.8 : 0.1);
    }
    window.animReady = true;
  } catch (err) {
    // Show the static page rather than half-hidden content.
    root.classList.remove('anim', 'acilis-on');
    console.error(err);
  }

  // In-page links glide instead of jumping. Lenis reads the html scroll-padding-top, so they
  // stop below the sticky header like native anchors do.
  // The skip link keeps its native jump so keyboard focus moves with it.
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]:not(.skip-link)');
    if (!lenis || !link) return;
    const hash = link.getAttribute('href');
    const target = hash === '#' ? 0 : document.querySelector(hash);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target);
    history.pushState(null, '', hash === '#' ? location.pathname : hash);
  });

  // The page behind the open lightbox must not scroll.
  const lightbox = document.getElementById('lightbox');
  new MutationObserver(() => (lightbox.open ? lenis?.stop() : lenis?.start()))
    .observe(lightbox, { attributes: true, attributeFilter: ['open'] });
})();
