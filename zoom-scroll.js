/**
 * Script Purpose: Hero Section ZoomScroll Effect
 * Author: Erlen Masson
 * Version: 5
 * Last Updated: November 19th 2024
 */
console.log("Script - Zoom Scroll v3");

// ScrollTrigger.config({ ignoreMobileResize: true });
// ScrollTrigger.normalizeScroll(true);

const heroWrapper = document.querySelector("[data-hero-wrapper]");
const heroContent = document.querySelector("[data-hero-content]");
const zoomItems = document.querySelectorAll("[data-zoom-item]");
const customZoomItems = document.querySelectorAll("[data-zoom-id]");
const insightItems = document.querySelectorAll("[data-scroll-insight]");
let parallaxItems = document.querySelectorAll("[data-parallax-item]");
const zoomStart = 10;
const zoomEnd = 800;

function setupZoomItems() {
  // Centralized configuration
  const zoomConfig = {
    heading: { zoomStart: -10, zoomEnd: -1000 },
    scroll: { zoomStart: 10, zoomEnd: 700 },
    1: { zoomStart: 0, zoomEnd: 750 },
    2: { zoomStart: 10, zoomEnd: 800 },
    3: { zoomStart: 100, zoomEnd: 650 },
    4: { zoomStart: -200, zoomEnd: 300 },
    5: { zoomStart: 300, zoomEnd: 650 },
    6: { zoomStart: 200, zoomEnd: 850 },
    7: { zoomStart: 150, zoomEnd: 1000 },
    8: { zoomStart: -1800, zoomEnd: -1000 },
    9: { zoomStart: -1700, zoomEnd: -1200 },
    10: { zoomStart: -1500, zoomEnd: -1200 },
    "insight-1": { zoomStart: -1000, zoomEnd: -50 },
    "insight-2": { zoomStart: -1500, zoomEnd: 200 },
    "insight-3": { zoomStart: -1500, zoomEnd: -50 },

    // Mobile-specific overrides
    mobile: {
      heading: { zoomStart: -10, zoomEnd: -2000 },
      3: { zoomStart: -10, zoomEnd: 500 },
      4: { zoomStart: -200, zoomEnd: 200 },
      5: { zoomStart: 100, zoomEnd: 650 },
      6: { zoomStart: 100, zoomEnd: 1000 },
      7: { zoomStart: 10, zoomEnd: 950 },
      8: { zoomStart: -1800, zoomEnd: -600 },
      9: { zoomStart: -1700, zoomEnd: -300 },
      10: { zoomStart: -1500, zoomEnd: -700 },
      "insight-1": { zoomStart: -500, zoomEnd: 600 },
      "insight-2": { zoomStart: -400, zoomEnd: 600 },
      "insight-3": { zoomStart: -600, zoomEnd: 600 },
    },
  };

  // Helper function to fetch configurations
  const getConfig = (zoomId, isMobile) => {
    const baseConfig = zoomConfig[zoomId] ||
      zoomConfig.default || { zoomStart: 10, zoomEnd: 800 };
    if (isMobile && zoomConfig.mobile?.[zoomId]) {
      return { ...baseConfig, ...zoomConfig.mobile[zoomId] }; // Merge mobile overrides
    }
    return baseConfig;
  };

  // Use ScrollTrigger.matchMedia for desktop and mobile
  ScrollTrigger.matchMedia({
    // Desktop - screens 1024px and up
    "(min-width: 1024px)": function () {
      zoomItems.forEach((item) => {
        const zoomId = item.getAttribute("data-zoom-id");
        const config = getConfig(zoomId, false); // Desktop configuration
        gsap.set(item, {
          z: config.zoomStart,
        });
        item.zoomData = {
          zoomStart: config.zoomStart,
          zoomEnd: config.zoomEnd,
        };
      });
    },

    // Mobile - screens below 1024px
    "(max-width: 1023px)": function () {
      zoomItems.forEach((item) => {
        const zoomId = item.getAttribute("data-zoom-id");
        const config = getConfig(zoomId, true); // Mobile configuration
        gsap.set(item, {
          z: config.zoomStart,
        });
        item.zoomData = {
          zoomStart: config.zoomStart,
          zoomEnd: config.zoomEnd,
        };
      });
    },
  });
}

function zoomScroll() {
  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function () {
      ScrollTrigger.create({
        trigger: heroWrapper,
        start: "top top",
        end: "bottom bottom",
        pin: heroContent,
        scrub: true,
        // markers: true,
      });

      zoomItems.forEach((item) => {
        gsap.to(item, {
          z: item.zoomData.zoomEnd,
          scrollTrigger: {
            trigger: heroWrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            immediateRender: false,
          },
        });
      });
    },

    // Mobile - screens below 1024px
    "(max-width: 1023px)": function () {
      ScrollTrigger.create({
        trigger: heroWrapper,
        start: "top top",
        end: "center 10%",
        scrub: true,
        // markers: true,
      });

      zoomItems.forEach((item) => {
        gsap.to(item, {
          z: item.zoomData.zoomEnd,
          scrollTrigger: {
            trigger: heroWrapper,
            start: "top top",
            end: "center 10%",
            scrub: true,
            immediateRender: false,
          },
        });
      });
    },
  });
}

// ------- Insight Quotes ------- //
function insightScroll() {
  ScrollTrigger.matchMedia({
    // Desktop - screens 1024px and up
    "(min-width: 1024px)": function () {
      insightItems.forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            y: 0, // Moves into place
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroWrapper,
              start: "top top",
              end: "center center",
              scrub: true,
              // markers: true,
            },
          }
        );
      });
    },

    // Mobile - screens below 1024px
    "(max-width: 1023px)": function () {
      insightItems.forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroWrapper,
              start: "top top",
              end: "center 30%",
              scrub: true,
              // markers: true,
            },
          }
        );
      });
    },
  });
}
// ------- Cursor Parallax ------- //
function cursorParallax() {
  if (parallaxItems.length === 0 || !heroContent) {
    console.error(
      "Parallax items or hero content not found for parallax effect"
    );
    return;
  }

  heroContent.addEventListener("mousemove", (e) => {
    const rect = heroContent.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (e.clientY - rect.top) / rect.height - 0.5;

    parallaxItems.forEach((item) => {
      gsap.to(item, {
        x: -offsetX * 100, // Fixed movement without depth attribute
        y: -offsetY * 80,
        duration: 0.5,
        overwrite: true,
      });
    });
  });
}

// ------- Fade-In Animation ------- //
function fadeInZoomItems() {
  // Select all zoom items, both default and custom
  const allZoomItems = document.querySelectorAll("[data-zoom-item]");

  if (allZoomItems.length === 0) {
    console.error("No zoom items found for fade-in animation");
    return;
  }

  // Animate each item to fade in with a subtle scale effect
  allZoomItems.forEach((item, index) => {
    gsap.fromTo(
      item,
      { opacity: 0 }, // Starting state: slightly scaled down and transparent
      {
        opacity: 1,
        duration: 3,
        delay: index * 0.2, // Stagger delay for each item
        ease: "power1.out",
        onComplete: () => {
          // ScrollTrigger.refresh(); // Refresh ScrollTrigger after fade-in
        },
      }
    );
  });
}

// Initialize all functions
document.addEventListener("DOMContentLoaded", () => {
  setupZoomItems();
  fadeInZoomItems();
  zoomScroll();
  insightScroll();
  cursorParallax();
});
