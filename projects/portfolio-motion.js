// Restrained progressive enhancement. No autoplay media, no tracking.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let progressQueued = false;
function updateReadingProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
  document.documentElement.style.setProperty("--scroll-progress", String(progress));
  progressQueued = false;
}
window.addEventListener("scroll", () => {
  if (progressQueued) return;
  progressQueued = true;
  requestAnimationFrame(updateReadingProgress);
}, { passive: true });
updateReadingProgress();

if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("reveal-pending");
      entry.target.classList.add("reveal-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.07, rootMargin: "0px 0px -28px 0px" });
  document.querySelectorAll(".section-intro, .case, .method-intro").forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight + 30) {
      element.classList.add("reveal-pending");
      observer.observe(element);
    }
  });
}
