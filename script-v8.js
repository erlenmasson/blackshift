/**
 * Script Purpose: Custom Code for Black Shift
 * Author: Erlen Masson
 * Version: 8
 * Started: 22st August 2024
 */

//
//------- Initialize on DOMContentLoaded -------//
//

document.addEventListener("DOMContentLoaded", () => {
  setupScrollSmoother();
  fadeAnimations();
  cmsHeading();
  recentlyRead();
  smoothScrollAnchors();
});

//
//------- Initial Setup -------//
//

console.log("Script - Custom v8");

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Array to store SplitText instances
var splitTextInstances = [];

//
//------- GSAP Animations -------//
//

// Function to check if the device is a touch device
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

// Initialize ScrollSmoother only on non-touch devices
function setupScrollSmoother() {
  if (!isTouchDevice()) {
    ScrollSmoother.create({
      smooth: 1.5,
      effects: true,
      smoothTouch: 0, // This value is for non-touch devices
    });
    //  ScrollTrigger.normalizeScroll(true);
  }
}

//
//------- Text Animations-------//
//

// Function for fade animations
function fadeAnimations() {
  var fadeStart = gsap.utils.clamp(
    0,
    window.innerHeight,
    window.innerWidth < 768 ? "top 100%" : "top 85%"
  ); // Clamped fadeStart value
  var fadeEnd = window.innerWidth < 768 ? "top 60%" : "bottom 75%"; // Mobile : Desktop
  var fadeEnd2 = window.innerWidth < 768 ? "top 50%" : "bottom 75%"; // Mobile : Desktop

  // Clear previous instances
  splitTextInstances.forEach((instance) => instance.revert());
  splitTextInstances = [];

  // Fade-In Text by Characters
  gsap.utils.toArray("[data-fade='chars']").forEach((element) => {
    const split = new SplitText(element, { type: "chars" });
    splitTextInstances.push(split); // Store instance
    gsap.set(split.chars, { opacity: 0 });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: element,
          start: fadeStart,
          end: fadeEnd2,
          scrub: true,
        },
      })
      .to(split.chars, {
        opacity: 1,
        ease: "power1.inOut",
        stagger: 0.05,
      });
  });

  // Fade-In Text by Words
  gsap.utils.toArray("[data-fade='words']").forEach((element) => {
    const split = new SplitText(element, { type: "words" });
    splitTextInstances.push(split); // Store instance
    gsap.set(split.words, { opacity: 0 });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: element,
          start: fadeStart,
          end: fadeEnd,
          scrub: true,
        },
      })
      .to(split.words, {
        opacity: 1,
        ease: "power1.inOut",
        stagger: 0.1,
      });
  });

  // Fade-In Text by Lines
  gsap.utils.toArray("[data-fade='lines']").forEach((element) => {
    const split = new SplitText(element, { type: "lines" });
    splitTextInstances.push(split); // Store instance
    gsap.set(split.lines, { opacity: 0 });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: element,
          start: fadeStart,
          end: fadeEnd,
          scrub: true,
          // markers: true,
        },
      })
      .to(split.lines, {
        opacity: 1,
        ease: "power1.inOut",
        stagger: 0.15,
      });
  });

  // Fade-In Rich Text by Lines
  gsap.utils.toArray("[data-fade='rich-text']").forEach((richTextElement) => {
    gsap.utils
      .toArray(
        richTextElement.querySelectorAll(
          "h1, h2, h3, h4, h5, h6, p, li, li::marker, blockquote"
        )
      )
      .forEach((element) => {
        const split = new SplitText(element, { type: "lines" });
        splitTextInstances.push(split); // Store instance
        gsap.set(split.lines, { opacity: 0 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: element,
              start: fadeStart,
              end: fadeEnd,
              scrub: true,
            },
          })
          .to(split.lines, {
            opacity: 1,
            ease: "power1.inOut",
            stagger: 0.15,
          });
      });
  });

  // Fade-In Elements
  gsap.utils.toArray("[data-fade='element']").forEach((element) => {
    gsap.set(element, { opacity: 0, y: 0 });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          end: "top 60%",
          scrub: true,
        },
      })
      .to(element, {
        opacity: 1,
        ease: "power2.inOut",
        y: 0,
      });
  });

  // Fade-In List
  gsap.utils.toArray("[data-fade='list']").forEach((list) => {
    // Convert the HTMLCollection of children to an array for easier manipulation
    const items = gsap.utils.toArray(list.children); // Now targets all direct children as an array

    items.forEach((item) => {
      gsap.set(item, { opacity: 0 }); // Initial state for each item

      gsap.to(item, {
        opacity: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: item,
          start: fadeStart,
          end: fadeEnd,
          scrub: true,
          //markers: true, // Uncomment for debugging
        },
      });
    });
  });
}

// Ensure fonts are loaded before running animations
document.fonts.ready
  .then(function () {
    console.log("Fonts loaded successfully");
    fadeAnimations();
  })
  .catch(function () {
    console.error("Font loading error");
  });

//
//------- Resize Handling -------//
//

// Debounce function to throttle the resize event handler
function debounce(func) {
  var timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 150, event); // 150ms seems like a good sweetspot
  };
}

// Optional: Define the resize event handling logic
function handleResize() {
  console.log("Window resized, refreshing animations");

  // Revert SplitText instances
  splitTextInstances.forEach((instance) => instance.revert());

  // Refresh ScrollTrigger
  ScrollTrigger.refresh();

  // Re-initialize the fade animations on resize
  fadeAnimations();
}

// Optional: Add event listener for window resize if needed
function addResizeListener() {
  window.addEventListener("resize", debounce(handleResize));
}

//
//------- Smooth Scroll to URL Anchors -------//
//

function smoothScrollAnchors() {
  // Smooth scroll to section based on URL hash
  const smoothScrollToSection = () => {
    const hash = window.location.hash;
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        gsap.to(window, { duration: 1, scrollTo: targetElement });
      }
    }
  };

  // Scroll after the entire page is loaded
  window.addEventListener("load", smoothScrollToSection);
}

//
//------- CMS Styling -------//
//

// Function to wrap specified text in headings with a span
function cmsHeading() {
  const headings = document.querySelectorAll('[cms-style="heading"]');

  headings.forEach(function (heading) {
    const headingContent = heading.innerHTML;
    const wrappedContent = headingContent.replace(
      /%%(.*?)%%/gi,
      function (_, match) {
        return `<span class="text-style-span">${match}</span>`;
      }
    );
    heading.innerHTML = wrappedContent;
  });
}
//
//------- Recently Read -------//
//

function recentlyRead() {
  const posterLinks = document.querySelectorAll(".poster_link");

  posterLinks.forEach((posterLink) => {
    posterLink.addEventListener("click", () => {
      const recentlyRead = posterLink.querySelector(".recently-read");

      if (recentlyRead) {
        setTimeout(() => {
          recentlyRead.style.display = "flex"; // Show or move the 'recently-read' element
          posterLink.appendChild(recentlyRead);
        }, 3000); // 3 seconds delay
      }
    });
  });
}
