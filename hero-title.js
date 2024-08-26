/**
 * Script Purpose: Custom Code for Black Shift
 * Author: Erlen Masson
 * Version: 4
 * Last Updated: 18th July 2024
 */

console.log("Script - Hero Title");

//
//------- Hero Animations-------//
//

document.fonts.ready
  .then(function () {
    // Create a GSAP timeline with a delay to account for the loading screen
    const tl = gsap.timeline({ delay: 0.5 }); // Adjust delay as needed to sync with your loading screen

    // Set initial state for the hero-title_line elements
    gsap.set(".hero-title_line", { opacity: 0 });

    // Animate each .hero-title_line with a stagger
    tl.to(".hero-title_line", {
      opacity: 1,
      duration: 1,
      stagger: 0.5, // Delay between each animation
      ease: "power1.inOut",
    });
  })
  .catch(function () {
    console.error("Font loading error");
    // Fallback or additional error handling
  });

//
//------- Type Animations-------//
//

document.fonts.ready
  .then(function () {
    // Shared timing and delay settings
    const duration = 3; // Duration of the animation
    const easeType = "power1.inOut"; // Ease type for the animation
    const repeatDelay = 2; // Pause duration between repeats

    // Create a GSAP timeline for the "BLACK" text
    const tlBlack = gsap.timeline({
      repeat: -1,
      yoyo: true,
      repeatDelay: repeatDelay,
    }); // repeatDelay adds a pause between repeats
    tlBlack.to(".flex-loop-black", {
      duration: duration,
      ease: easeType,
      css: {
        "--wght": 1000, // Target weight value
        "--wdth": 100, // Target width value
      },
    });

    // Create a GSAP timeline for the "SHIFT" text
    const tlShift = gsap.timeline({
      repeat: -1,
      yoyo: true,
      repeatDelay: repeatDelay,
    }); // repeatDelay adds a pause between repeats
    tlShift.to(".flex-loop-shift", {
      duration: duration,
      ease: easeType,
      css: {
        "--wght": 600, // Target weight value
        "--wdth": 115, // Target width value
        "--YOPQ": 135, // Target YOPQ value
        "--XTRA": 603, // Target XTRA value
      },
    });
  })
  .catch(function () {
    console.error("Font loading error");
    // Fallback or additional error handling
  });
