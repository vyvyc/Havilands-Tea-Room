const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsapAvailable = typeof window.gsap !== "undefined";

const showEverything = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const sectionsById = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && navLinks.length && sectionsById.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
        if (isCurrent) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { threshold: [0.25, 0.45], rootMargin: "-18% 0px -62% 0px" }
  );

  sectionsById.forEach((section) => navObserver.observe(section));
}

const hero = document.querySelector("[data-hero]");
const header = document.querySelector(".site-header");

if (hero && header && "IntersectionObserver" in window) {
  const headerObserver = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("is-compact", !entry.isIntersecting);
    },
    { threshold: 0.18 }
  );
  headerObserver.observe(hero);
}

if (reduceMotion || !gsapAvailable) {
  showEverything();
} else {
  const { gsap } = window;
  document.body.classList.add("motion-ready");

  gsap.defaults({
    duration: 0.58,
    ease: "power2.out"
  });

  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTimeline
    .from(".site-header", {
      opacity: 0.86,
      y: -14,
      duration: 0.72
    })
    .from(".hero-media img", {
      scale: 1.08,
      x: 28,
      filter: "saturate(0.82) brightness(0.92)",
      duration: 1.4
    }, 0)
    .from(".hero .kicker", {
      opacity: 0,
      x: -16,
      y: 20,
      duration: 0.54
    }, 0.18)
    .from("#hero-title", {
      opacity: 0,
      x: -20,
      y: 38,
      duration: 0.86
    }, 0.28)
    .from(".hero-copy", {
      opacity: 0,
      x: -14,
      y: 26,
      duration: 0.68
    }, 0.44)
    .from(".hero-actions .button", {
      opacity: 0,
      x: -10,
      y: 16,
      scale: 0.98,
      stagger: 0.08,
      duration: 0.54
    }, 0.58)
    .from(".hero-strip a", {
      opacity: 0,
      y: 18,
      stagger: 0.05,
      duration: 0.52
    }, 0.72);

  document.querySelectorAll(".hero [data-reveal]").forEach((item) => item.classList.add("is-visible"));

  const heroRevealItems = new Set(document.querySelectorAll(".hero [data-reveal]"));
  const revealTargets = revealItems.filter((item) => !heroRevealItems.has(item));

  const detailTargetsFor = (target) => {
    if (target.matches(".intro-copy")) {
      return Array.from(target.children);
    }

    if (target.matches(".menu-board")) {
      return Array.from(target.querySelectorAll(".menu-feature, .menu-list article"));
    }

    if (target.matches(".image-ledger")) {
      return Array.from(target.querySelectorAll(".image-tile"));
    }

    if (target.matches(".visit-card")) {
      return Array.from(target.querySelectorAll("h3, dl div"));
    }

    if (target.matches(".time-table")) {
      return Array.from(target.querySelectorAll("dl div"));
    }

    return [];
  };

  const revealProfileFor = (target) => {
    if (target.matches(".campaign-panel, .menu-board, .image-ledger, .map-panel")) {
      return {
        from: {
          autoAlpha: 0,
          y: 44,
          scale: 0.985,
          clipPath: "inset(10% 0% 12% 0%)"
        },
        to: {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.86
        }
      };
    }

    return {
      from: {
        autoAlpha: 0,
        y: 30
      },
      to: {
        autoAlpha: 1,
        y: 0,
        duration: 0.64
      }
    };
  };

  const prepareRevealTarget = (target) => {
    const profile = revealProfileFor(target);
    gsap.set(target, {
      ...profile.from,
      willChange: "transform, opacity, clip-path"
    });

    const details = detailTargetsFor(target);
    if (details.length) {
      gsap.set(details, {
        autoAlpha: 0,
        y: target.matches(".intro-copy") ? 18 : 16,
        willChange: "transform, opacity"
      });
    }

    const image = target.matches(".campaign-panel, .image-tile, .map-panel")
      ? target.querySelector("img, iframe")
      : null;

    if (image) {
      gsap.set(image, {
        scale: 1.06,
        filter: "blur(8px) saturate(0.92)",
        willChange: "transform, filter"
      });
    }
  };

  const runReveal = (target) => {
    const profile = revealProfileFor(target);
    const details = detailTargetsFor(target);
    const image = target.matches(".campaign-panel, .image-tile, .map-panel")
      ? target.querySelector("img, iframe")
      : null;

    target.classList.add("is-visible");

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
        overwrite: "auto"
      }
    });

    timeline.to(target, {
      ...profile.to,
      clearProps: "transform,opacity,visibility,clipPath,willChange"
    });

    if (image) {
      timeline.to(
        image,
        {
          scale: 1,
          filter: "blur(0px) saturate(1)",
          duration: 1,
          clearProps: "transform,filter,willChange"
        },
        0.02
      );
    }

    if (details.length) {
      timeline.to(
        details,
        {
          autoAlpha: 1,
          y: 0,
          duration: target.matches(".intro-copy") ? 0.52 : 0.46,
          stagger: target.matches(".time-table") ? 0.035 : 0.055,
          clearProps: "transform,opacity,visibility,willChange"
        },
        target.matches(".intro-copy") ? 0.14 : 0.18
      );
    }
  };

  if (revealTargets.length && "IntersectionObserver" in window) {
    revealTargets.forEach(prepareRevealTarget);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runReveal(entry.target);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" }
    );

    revealTargets.forEach((item) => revealObserver.observe(item));
  } else {
    revealTargets.forEach((item) => item.classList.add("is-visible"));
  }

  const heroImage = document.querySelector(".hero-media img");
  if (hero && heroImage && window.matchMedia("(pointer: fine)").matches) {
    const imageX = gsap.quickTo(heroImage, "x", { duration: 0.75, ease: "power3.out" });
    const imageY = gsap.quickTo(heroImage, "y", { duration: 0.75, ease: "power3.out" });

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      imageX(x * 14);
      imageY(y * 9);
    });

    hero.addEventListener("pointerleave", () => {
      imageX(0);
      imageY(0);
    });
  }

  document.querySelectorAll(".button, .map-link").forEach((button) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const moveX = gsap.quickTo(button, "x", { duration: 0.34, ease: "power3.out" });
    const moveY = gsap.quickTo(button, "y", { duration: 0.34, ease: "power3.out" });

    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      moveX((event.clientX - rect.left - rect.width / 2) * 0.12);
      moveY((event.clientY - rect.top - rect.height / 2) * 0.16);
    });

    button.addEventListener("pointerleave", () => {
      moveX(0);
      moveY(0);
    });
  });

  document.querySelectorAll(".motion-card").forEach((card) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const lift = gsap.quickTo(card, "y", { duration: 0.32, ease: "power3.out" });

    card.addEventListener("pointerenter", () => lift(-3));
    card.addEventListener("pointerleave", () => lift(0));
  });
}
