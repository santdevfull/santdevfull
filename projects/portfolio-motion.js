/* Motion interactions. No third-party JS; progressive enhancement with reduced-motion safeguards. */
const film = document.getElementById("flow-film");
const filmToggle = document.getElementById("motion-toggle");
const filmLabel = document.getElementById("motion-toggle-label");
const filmIcon = filmToggle?.querySelector(".motion-toggle-icon");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const saveData = Boolean(navigator.connection?.saveData);
let userPaused = reduced.matches || saveData;
let onScreen = false;

function motionLanguage() {
  return document.documentElement.lang === "en" ? "en" : "pt";
}
function syncFilmButton() {
  if (!film || !filmToggle || !filmLabel) return;
  const paused = film.paused;
  const label = paused
    ? (motionLanguage() === "en" ? "Play video" : "Reproduzir vídeo")
    : (motionLanguage() === "en" ? "Pause video" : "Pausar vídeo");
  filmToggle.setAttribute("aria-label", label);
  filmToggle.setAttribute("aria-pressed", String(!paused));
  filmLabel.textContent = label;
  filmIcon.textContent = paused ? "▶" : "Ⅱ";
}
async function resumeFilm() {
  if (!film || reduced.matches || saveData || userPaused || !onScreen || document.hidden) return;
  try { await film.play(); }
  catch { userPaused = true; }
  syncFilmButton();
}
function pauseFilm() {
  film?.pause();
  syncFilmButton();
}
if (film && filmToggle) {
  film.addEventListener("play", syncFilmButton);
  film.addEventListener("pause", syncFilmButton);
  if (reduced.matches || saveData) pauseFilm();
  filmToggle.addEventListener("click", async () => {
    if (film.paused) {
      userPaused = false;
      try { await film.play(); }
      catch { userPaused = true; }
    } else {
      userPaused = true;
      pauseFilm();
    }
    syncFilmButton();
  });
  const filmObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        onScreen = entries[0]?.isIntersecting ?? false;
        if (onScreen) resumeFilm(); else pauseFilm();
      }, { threshold: .12 })
    : null;
  if (filmObserver) filmObserver.observe(film);
  else { onScreen = true; resumeFilm(); }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseFilm(); else resumeFilm();
  });
  reduced.addEventListener?.("change", () => {
    if (reduced.matches) { userPaused = true; pauseFilm(); }
    else { userPaused = false; resumeFilm(); }
  });
  const languageObserver = new MutationObserver(syncFilmButton);
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  syncFilmButton();
}

// Single RAF scroll listener: only transform-based reading progress.
let scrollQueued = false;
function updateReadingProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty("--scroll-progress", height > 0 ? String(window.scrollY / height) : "0");
  scrollQueued = false;
}
window.addEventListener("scroll", () => {
  if (scrollQueued) return;
  scrollQueued = true;
  window.requestAnimationFrame(updateReadingProgress);
}, { passive: true });
updateReadingProgress();

// A restrained one-time scene reveal, never hides content if script / IO is unavailable.
if (!reduced.matches && "IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove("reveal-pending");
      entry.target.classList.add("reveal-visible");
      reveal.unobserve(entry.target);
    }
  }, { threshold: .05, rootMargin: "0px 0px -40px 0px" });
  const targets = document.querySelectorAll(".motion-heading, .section-intro, .case-nivia, .case-olive, .case-abyssal");
  for (const target of targets) {
    if (target.getBoundingClientRect().top > window.innerHeight + 10) {
      target.classList.add("reveal-pending");
      reveal.observe(target);
    }
  }
}

// Optional 3D tilt on fine pointers: never on touch or reduced motion.
const consoleCard = document.querySelector(".system-card");
if (consoleCard && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced.matches) {
  let nextX = 0, nextY = 0, tiltQueued = false;
  const setTilt = () => {
    consoleCard.style.setProperty("--tilt-x", nextX.toFixed(2) + "deg");
    consoleCard.style.setProperty("--tilt-y", nextY.toFixed(2) + "deg");
    tiltQueued = false;
  };
  consoleCard.addEventListener("pointermove", event => {
    const rect = consoleCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    nextX = x * 5;
    nextY = -y * 5;
    if (!tiltQueued) {
      tiltQueued = true;
      requestAnimationFrame(setTilt);
    }
  }, { passive: true });
  consoleCard.addEventListener("pointerleave", () => {
    nextX = nextY = 0;
    requestAnimationFrame(setTilt);
  });
}
