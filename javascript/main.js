const toggle = document.getElementById("navToggle");
const menu = document.getElementById("mobileMenu");
const backdrop = document.getElementById("mobileMenuBackdrop");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menu.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

toggle.addEventListener("click", () =>
  setMenu(toggle.getAttribute("aria-expanded") !== "true")
);
backdrop.addEventListener("click", () => setMenu(false));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
window.matchMedia("(min-width: 651px)").addEventListener("change", e => { if (e.matches) setMenu(false); });




/* =========================================== */
/* ============ Pages CMS ==================== */
/* =========================================== */
const load = name =>
  fetch(`data/${name}.json`).then(r => r.json()).catch(() => null);

Promise.all([load('navigation'), load('hero'), load('about')]).then(([nav, hero, about]) => {
  const $ = sel => document.querySelector(sel);
  const has = v => v !== undefined && v !== null;
  const text = (el, v) => { if (el && has(v)) el.textContent = v; };
  const image = (el, v) => { if (el && v) el.src = v; };

  // rebuilds an element from text pieces, <br>, and highlighted <span>s
  const rebuild = (el, parts) => {
    if (!el) return;
    el.replaceChildren(...parts.map(p => {
      if (p === 'br') return document.createElement('br');
      if (typeof p === 'object') {
        const s = document.createElement('span');
        s.textContent = p.hl;
        return s;
      }
      return document.createTextNode(p);
    }));
  };

  if (nav) {
    const desktop = document.querySelectorAll('.nav-links');
    const mobile = document.querySelectorAll('.mobile-link');
    ['home', 'about', 'services', 'projects', 'testimonials', 'reach_me'].forEach((key, i) => {
      text(desktop[i], nav[key]);
      text(mobile[i], nav[key]);
    });
  }

  if (hero) {
    const spans = document.querySelectorAll('.hero-h1 span');
    text(spans[0], hero.first_name);
    text(spans[1], hero.last_name);
    text($('.hero-h3'), hero.subtitle);
    if (hero.background_image) $('#hero').style.backgroundImage = `url("${hero.background_image}")`;
  }

  if (about) {
    const g = k => about[k] ?? '';
    rebuild($('.about-txt'), [
      `${g('intro_before')} ${g('name')}${g('intro_after')}`,
      'br',
      ` ${g('role_before')} `,
      { hl: g('profession') },
      ` ${g('role_after')}`
    ]);
    rebuild($('.about-subtxt'), [
      `${g('subtext_before')} `,
      { hl: g('years_experience') },
      g('subtext_after')
    ]);
    text($('.about-context'), about.bio);
    const photo = $('.blob-photo');
    image(photo, about.photo);
    if (photo && has(about.photo_alt)) photo.alt = about.photo_alt;
  }
});
