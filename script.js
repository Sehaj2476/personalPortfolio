const yearNode = document.getElementById("year");
const root = document.documentElement;
const photo = document.getElementById("profile-photo");
const portraitFrame = document.querySelector(".portrait-frame");
const loadRevealItems = document.querySelectorAll(".reveal-on-load");
const scrollRevealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll("[data-tilt]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (photo && portraitFrame) {
  const showFallback = () => {
    portraitFrame.classList.add("image-missing");
  };

  if (!photo.getAttribute("src")) {
    showFallback();
  } else if (photo.complete && photo.naturalWidth === 0) {
    showFallback();
  } else {
    photo.addEventListener("error", showFallback);
  }
}

window.addEventListener("load", () => {
  loadRevealItems.forEach((item, index) => {
    window.setTimeout(() => {
      item.classList.add("visible");
    }, index * 140);
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  scrollRevealItems.forEach((item) => {
    observer.observe(item);
  });
} else {
  scrollRevealItems.forEach((item) => {
    item.classList.add("visible");
  });
}

document.addEventListener("pointermove", (event) => {
  if (!supportsFinePointer || prefersReducedMotion) {
    return;
  }

  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;

  root.style.setProperty("--glow-x", `${x}%`);
  root.style.setProperty("--glow-y", `${y}%`);
});

tiltCards.forEach((card) => {
  if (!supportsFinePointer || prefersReducedMotion) {
    return;
  }

  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
