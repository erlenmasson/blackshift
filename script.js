/**
 * Script Purpose: Custom Code for Black Shift
 * Author: Erlen Masson
 * Version: 11
 * Started: 18th November
 */

//
//------- Initialize on DOMContentLoaded -------//
//

document.addEventListener("DOMContentLoaded", () => {
  scrollToHash();
  setupScrollSmoother();
  cmsHeading();
  gradientBg();
});

//
//------- Initial Setup -------//
//

console.log("Script - Custom v11");

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Check if the device is a touch device
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
      smooth: 1.5, // Adjust smoothness
      effects: true,
      smoothTouch: 0, // This value is for non-touch devices
    });
    // Comment out normalizeScroll to test the behavior
    // ScrollTrigger.normalizeScroll(true);
  }
}

//
//------- Gradient Background Animation -------//
//

function gradientBg() {
  const elements = document.querySelectorAll(".gradient-bg");

  if (elements.length === 0) return;

  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
      : null;
  }

  elements.forEach((element) => {
    const styles = getComputedStyle(element);

    const accentHex = styles.getPropertyValue("--color--accent").trim();
    const accentTwoHex = styles.getPropertyValue("--color--accent-two").trim();
    const accentThreeHex = styles
      .getPropertyValue("--color--accent-three")
      .trim();

    const accent = hexToRgb(accentHex);
    const accentTwo = hexToRgb(accentTwoHex);
    const accentThree = hexToRgb(accentThreeHex);

    if (!accent || !accentTwo || !accentThree) return;

    const b1 = `
          linear-gradient(217deg, rgba(${accent}, 1), rgba(${accent}, 0) 50%),
          linear-gradient(127deg, rgba(${accentTwo}, 1), rgba(${accentTwo}, 1) 75%),
          linear-gradient(336deg, rgba(${accentThree}, 1), rgba(${accentThree}, 0) 50%)
        `;

    const b2 = `
          linear-gradient(17deg, rgba(${accentTwo}, 1), rgba(${accentTwo}, 0) 50%),
          linear-gradient(200deg, rgba(${accentThree}, 1), rgba(${accentThree}, 1) 75%),
          linear-gradient(336deg, rgba(${accent}, 1), rgba(${accent}, 0) 50%)
        `;

    gsap.fromTo(
      element,
      { background: b1 },
      {
        background: b2,
        ease: "none",
        duration: 3,
        repeat: -1,
        yoyo: true,
      }
    );
  });
}

//
//------- Scroll to URL Anchors -------//
//

function scrollToHash() {
  // Check if there is a hash in the URL
  const hash = window.location.hash;
  if (hash) {
    // Find the target element
    const targetElement = document.querySelector(hash);
    if (targetElement) {
      // Directly scroll to the element
      targetElement.scrollIntoView({ behavior: "auto" }); // Instant scroll for initial load
    }
  }
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
