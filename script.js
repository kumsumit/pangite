'use strict';

/* ---------- Header: scrolled state ---------- */
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Hero motion ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Wrap each headline word so it can rise out of its own mask (keeps <em>).
(() => {
  const h1 = document.querySelector('.hero h1');
  let i = 0;
  const split = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) { split(child); return; }
      if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(' '); return; }
        const outer = document.createElement('span');
        const inner = document.createElement('span');
        outer.className = 'w';
        inner.textContent = part;
        inner.style.setProperty('--i', i++);
        outer.append(inner);
        frag.append(outer);
      });
      child.replaceWith(frag);
    });
  };
  h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
  split(h1);
  [...h1.querySelectorAll('.w')].forEach(w => w.setAttribute('aria-hidden', 'true'));
  h1.classList.add('is-split');
})();

// Map: pointer parallax on precise pointers; SVG route dots respect reduced motion.
(() => {
  const scene = document.querySelector('.discovery-scene');
  const map = scene.querySelector('.scene-map');
  const animatedSvgs = [map, document.querySelector('.story-art')].filter(Boolean);
  const syncSmil = () => animatedSvgs.forEach(svg => (reduceMotion.matches ? svg.pauseAnimations() : svg.unpauseAnimations()));
  syncSmil();
  reduceMotion.addEventListener('change', syncSmil);

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let frame = 0;
  scene.addEventListener('pointermove', e => {
    if (!finePointer.matches || reduceMotion.matches || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const r = scene.getBoundingClientRect();
      scene.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      scene.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
  });
  scene.addEventListener('pointerleave', () => {
    scene.style.setProperty('--mx', 0);
    scene.style.setProperty('--my', 0);
  });
})();

/* ---------- Ecosystem story: scenes appear in order as it scrolls into view ---------- */
(() => {
  const story = document.querySelector('.story');
  if (!story) return;
  const scenes = [...story.querySelectorAll('.scene')];
  const steps = [...story.querySelectorAll('.story-steps li')];
  const nodes = [...story.querySelectorAll('.story-nodes circle')];
  const total = scenes.length;
  let shown = 0;
  let line = 0;

  function render(step, progress) {
    shown = Math.max(shown, step);
    line = Math.max(line, progress);
    for (let i = 0; i < total; i++) {
      const on = i < shown;
      scenes[i].classList.toggle('on', on);
      steps[i]?.classList.toggle('on', on);
      nodes[i]?.classList.toggle('on', on);
    }
    story.style.setProperty('--s', line.toFixed(3));
    story.classList.toggle('is-complete', shown >= total);
  }

  if (reduceMotion.matches) { render(total, 1); return; }
  render(0, 0);

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    const top = story.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.55)));
    const step = p <= 0 ? 0 : Math.min(total, Math.ceil(p * total));
    render(step, Math.min(1, Math.max(0, (p * total - 1) / (total - 1))));
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ---------- Mobile navigation ---------- */
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menu.focus(); }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

/* ---------- Information dialogs ---------- */
const info = {
  access: ['Your local market. A new possibility.', 'Pangeabuy is being introduced as a local product and merchant discovery platform, scheduled to launch on 14 December 2026. This website is an introduction only; searching, shopping and registration will take place in the Pangeabuy desktop and mobile apps.\n\nLocal coverage at launch will be confirmed closer to the date. The product and merchant illustrations explain the concept; they are not live listings. No personal information or early-access sign-ups are collected here.'],
  merchant: ['A new way to be discovered.', 'Pangeabuy aims to create an additional discovery opportunity for participating local merchants. This website is an introduction only; merchant onboarding will take place in the Pangeabuy desktop and mobile apps.\n\nPangeabuy launches on 14 December 2026. Participation requirements and launch coverage will be published when confirmed. Where an authorised Stromule integration is implemented, eligible product information may support discovery. No customer growth or sales are guaranteed.'],
  contact: ['Contact & support information', 'Send us a message using the form below. Your name, email, optional phone number and message are sent to our form provider, Forminit, so we can reply.'],
  privacy: ['Privacy on this introductory website', 'This website has no sign-up form or account system. The only form is the contact form, whose details are sent to Forminit when you submit it. There is no analytics script or connected merchant database. Category selections only change the page displayed in your browser and are not saved.\n\nThe page requests the Fraunces, Geist and Geist Mono fonts from Google Fonts; your browser may share standard connection information with that provider. Hosting providers may also process standard request logs.\n\nA platform-specific privacy policy has not been supplied. This information is a description of this website, not a substitute for that policy.'],
  terms: ['An introduction, with clear limits.', 'This website explains the Pangeabuy concept. Products, merchant names and artwork are illustrative. No transactions, reservations, product availability checks or account registrations take place here.\n\nLive coverage, onboarding requirements, ordering, payments and fulfilment depend on confirmed platform capabilities. Formal platform terms have not been supplied for publication.']
};
const categoryInfo = {
  electronics: ['Electronics & accessories', 'Charging cables, adapters, headphones and everyday technology accessories.'],
  home: ['Home & everyday essentials', 'Household products, kitchen accessories and useful items for daily life.'],
  fashion: ['Fashion & lifestyle', 'Clothing, footwear and accessories from local retailers.'],
  books: ['Books & stationery', 'Notebooks, school supplies, writing materials and everyday creative essentials.'],
  tools: ['Tools & specialist products', 'Hardware, tools and specialist products for particular jobs and needs.']
};

const dialog = document.querySelector('#info-dialog');
let previousFocus;
const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');
function showInfo(title, copy, withForm = false) {
  previousFocus = document.activeElement;
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-copy').textContent = copy;
  contactForm.hidden = !withForm;
  document.querySelector('.dialog-done').hidden = withForm;
  contactStatus.textContent = '';
  dialog.showModal();
}
document.querySelectorAll('[data-info]').forEach(button =>
  button.addEventListener('click', () => showInfo(...info[button.dataset.info], button.dataset.info === 'contact')));
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  const [title, copy] = categoryInfo[button.dataset.category];
  showInfo(title, copy + '\n\nThis is an illustrative category, not a live product result. Listings, coverage and category availability depend on participating merchants and the eventual platform experience.');
}));
document.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', e => {
  if (e.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
});
dialog.addEventListener('close', () => previousFocus?.focus());

/* ---------- Category filters ---------- */
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const group = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  document.querySelectorAll('[data-group]').forEach(card => {
    card.hidden = group !== 'all' && card.dataset.group !== group;
  });
  document.querySelector('.more-card').hidden = group !== 'all';
}));

/* ---------- Categories: scroll-driven horizontal gallery ----------
   On larger screens the section pins and vertical scrolling moves the whole
   row (intro + panels) sideways; once the last panel is in view, normal
   scrolling resumes. Elsewhere it is a stacked intro with a native swipe rail. */
(() => {
  const section = document.querySelector('.categories');
  const viewport = section.querySelector('.h-viewport');
  const row = section.querySelector('.h-row');
  const track = section.querySelector('.h-track');
  const bar = section.querySelector('.h-progress');
  const hint = section.querySelector('.h-hint');
  const countNow = section.querySelector('.h-count-now');
  const countTotal = section.querySelector('.h-count-total');
  const wrap = document.querySelector('.site-header .wrap');
  const canPin = window.matchMedia('(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
  let distance = 0;
  let ticking = false;

  const pinned = () => section.classList.contains('is-pinned');
  const panels = () => [...track.children].filter(el => !el.hidden);
  const pad = n => String(n).padStart(2, '0');

  // Which panel is the "current" one: the first whose right edge is past the viewport's left third.
  function currentIndex() {
    const list = panels();
    const line = window.innerWidth * 0.35;
    const i = list.findIndex(el => el.getBoundingClientRect().right > line);
    return Math.max(0, i === -1 ? list.length - 1 : i);
  }

  function update() {
    ticking = false;
    let progress;
    if (pinned()) {
      const scrolled = -section.getBoundingClientRect().top;
      progress = distance ? Math.min(1, Math.max(0, scrolled / distance)) : 0;
      row.style.setProperty('--x', `${(-progress * distance).toFixed(1)}px`);
    } else {
      const max = track.scrollWidth - track.clientWidth;
      progress = max > 0 ? track.scrollLeft / max : 0;
    }
    bar.style.setProperty('--p', progress.toFixed(4));
    const list = panels();
    const idx = progress >= 0.999 ? list.length - 1 : currentIndex();
    countNow.textContent = pad(idx + 1);
    countTotal.textContent = pad(list.length);
  }
  const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  function measure() {
    section.style.setProperty('--edge', `${wrap.getBoundingClientRect().left}px`);
    section.classList.toggle('is-pinned', canPin.matches);
    hint.firstChild.textContent = canPin.matches ? 'Scroll to explore ' : 'Swipe to explore ';
    if (canPin.matches) {
      distance = Math.max(0, row.scrollWidth - viewport.clientWidth);
      section.style.height = `${window.innerHeight + distance}px`;
    } else {
      distance = 0;
      section.style.height = '';
      row.style.removeProperty('--x');
    }
    update();
  }

  // Keep keyboard focus visible: bring a focused panel into the pinned frame.
  row.addEventListener('focusin', e => {
    if (!pinned() || !distance) return;
    const panel = e.target.closest('.h-track > *');
    if (!panel) return;
    const edge = parseFloat(getComputedStyle(section).getPropertyValue('--edge')) || 0;
    const progress = Math.min(1, Math.max(0, (panel.offsetLeft + track.offsetLeft - edge) / distance));
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sectionTop + progress * distance, behavior: 'instant' });
  });

  window.addEventListener('scroll', requestUpdate, { passive: true });
  track.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  canPin.addEventListener('change', measure);
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => {
    measure();
    if (!pinned()) track.scrollTo({ left: 0 });
  }));
  measure();
})();

document.querySelector('#year').textContent = new Date().getFullYear();

/* ---------- Scroll reveal ---------- */
const revealables = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('reveal'); observer.unobserve(entry.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealables.forEach(el => observer.observe(el));
} else {
  revealables.forEach(el => el.classList.add('reveal'));
}

/* ---------- Contact form (Forminit) ---------- */
const FORMINIT_ID = 'xxa4jb3cw44';
let sending = false;
contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (sending) return;
  sending = true;
  const fd = new FormData(contactForm);
  if (!fd.get('fi-sender-phone')) fd.delete('fi-sender-phone');
  const button = contactForm.querySelector('[type=submit]');
  button.disabled = true;
  contactStatus.textContent = 'Sending…';
  try {
    if (typeof Forminit === 'undefined') throw new Error('Forminit SDK not loaded');
    const { data, error } = await new Forminit().submit(FORMINIT_ID, fd);
    if (error || typeof data?.hashId !== 'string') {
      console.error(error);
      contactStatus.textContent = error?.message || 'Sorry, that did not send. Please check your details and try again.';
    } else {
      contactForm.reset();
      contactStatus.textContent = 'Thank you. Your message has been sent.';
    }
  } catch (err) {
    console.error(err);
    contactStatus.textContent = 'Sorry, that did not send. Please try again.';
  } finally {
    sending = false;
    button.disabled = false;
  }
});
