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