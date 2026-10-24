// Avrasya Toptan Pasta Süsleri — the scroll story (PLAN.md, section 3).
// Libraries are self-hosted in assets/vendor. The page's static look is always the final state:
// starting states for animated elements are written under html.anim, which the inline script in
// <head> sets only when motion is allowed. With reduced motion, without JavaScript, or if a library
// fails to load, nothing is hidden and nothing moves.
(() => {
  const root = document.documentElement;
  const { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Lenis } = window;
  if (!gsap || !ScrollTrigger || !SplitText || !DrawSVGPlugin || !Lenis) {
    root.classList.remove('anim');
    return;
  }
  window.animReady = true;
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

  // ---------- Scenes ----------
  // A scene is a function that builds its tweens and ScrollTriggers from { mobile, lenis }.
  // gsap.matchMedia reverts all of them when reduced motion is switched on or the layout
  // crosses the mobile breakpoint, then builds them again.
  // Phase 4 adds, in page order: acilis, hero, stand, koleksiyon, kule, uretim, final.
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

  // ---------- Smooth scroll and scene setup ----------
  let lenis = null;

  gsap.matchMedia().add({ motion: '(prefers-reduced-motion: no-preference)', mobile: mobileQuery.media }, ctx => {
    if (!ctx.conditions.motion) {
      root.classList.remove('anim');
      return;
    }
    root.classList.add('anim');

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
