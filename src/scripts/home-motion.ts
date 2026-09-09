/** Optional motion only. No tracking, cookies, storage or third-party scripts. */
const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const toggle = document.querySelector<HTMLButtonElement>(
  "[data-motion-toggle]",
);
const label = document.querySelector<HTMLElement>("[data-motion-label]");
const activeReveals = new Set<Animation>();
let manuallyPaused = false;
const motionEnabled = () => !reducedMotion.matches && !manuallyPaused;

function updateMotion() {
  const enabled = motionEnabled();
  root.dataset.motion = enabled ? "on" : "off";
  if (toggle) {
    toggle.hidden = false;
    toggle.disabled = reducedMotion.matches;
    toggle.setAttribute("aria-pressed", String(!enabled));
    toggle.title = reducedMotion.matches
      ? "기기의 동작 줄이기 설정을 따르고 있습니다."
      : "장식 애니메이션을 켜거나 끕니다.";
  }
  if (label)
    label.textContent = reducedMotion.matches
      ? "동작 줄이기 적용 중"
      : enabled
        ? "움직임 끄기"
        : "움직임 켜기";
  if (!enabled) {
    activeReveals.forEach((animation) => animation.cancel());
    activeReveals.clear();
    document
      .querySelectorAll<HTMLElement>("[data-parallax-plane]")
      .forEach((plane) => {
        plane.style.removeProperty("--pointer-x");
        plane.style.removeProperty("--pointer-y");
      });
  }
}
toggle?.addEventListener("click", () => {
  manuallyPaused = !manuallyPaused;
  updateMotion();
});
reducedMotion.addEventListener("change", updateMotion);
updateMotion();

function reveal(element: HTMLElement, delay = 0) {
  if (!motionEnabled() || typeof element.animate !== "function") return;
  // The underlying DOM remains visible, even if this script or animation is interrupted.
  const animation = element.animate(
    [
      { opacity: 0, transform: "translate3d(0, 18px, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ],
    {
      duration: 650,
      delay,
      easing: "cubic-bezier(.2,.7,.2,1)",
      fill: "backwards",
    },
  );
  activeReveals.add(animation);
  animation.finished.then(
    () => activeReveals.delete(animation),
    () => activeReveals.delete(animation),
  );
}
document
  .querySelectorAll<HTMLElement>("[data-intro]")
  .forEach((element, index) => reveal(element, 55 * index));

if ("IntersectionObserver" in window) {
  const revealed = new WeakSet<Element>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (element.hasAttribute("data-animated"))
          element.dataset.inView = String(entry.isIntersecting);
        if (
          entry.isIntersecting &&
          element.hasAttribute("data-reveal") &&
          !revealed.has(element)
        ) {
          revealed.add(element);
          reveal(element);
          if (!element.hasAttribute("data-animated"))
            observer.unobserve(element);
        }
      }
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll<HTMLElement>("[data-animated], [data-reveal]")
    .forEach((element) => observer.observe(element));
} else {
  document
    .querySelectorAll<HTMLElement>("[data-animated]")
    .forEach((element) => {
      element.dataset.inView = "true";
    });
}
function updateVisibility() {
  root.dataset.pageHidden = String(document.hidden);
}
document.addEventListener("visibilitychange", updateVisibility);
updateVisibility();

// Small pointer movement on desktop, not a scroll listener or a continuous render loop.
document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((card) => {
  const plane = card.querySelector<HTMLElement>("[data-parallax-plane]");
  if (!plane) return;
  let frame = 0;
  let x = 0;
  let y = 0;
  card.addEventListener(
    "pointermove",
    (event) => {
      if (!motionEnabled() || !finePointer.matches || innerWidth <= 840) return;
      const bounds = card.getBoundingClientRect();
      x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
      y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!motionEnabled()) return;
        plane.style.setProperty("--pointer-x", `${x.toFixed(2)}px`);
        plane.style.setProperty("--pointer-y", `${y.toFixed(2)}px`);
      });
    },
    { passive: true },
  );
  card.addEventListener("pointerleave", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    plane.style.removeProperty("--pointer-x");
    plane.style.removeProperty("--pointer-y");
  });
});
export {};
