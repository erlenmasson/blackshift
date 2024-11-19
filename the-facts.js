/**
 * Script Purpose: Custom Code for Black Shift - The Facts
 * Author: Erlen Masson
 * Last Updated: 18th July 2024
 */

console.log("Script - The Facts v4");

//
//------- Spline -------//
//

function addSlideEventListeners(customSplide) {
  // Add event listener to handle clicks on slides and their child elements
  customSplide.root
    .querySelectorAll(".splide__slide")
    .forEach((slide, index) => {
      slide.addEventListener("click", (event) => {
        const button = event.target.closest(".button");

        // Check if a .button or any other specific child element was clicked
        if (button) {
          customSplide.Components.Autoplay.pause();

          // Allow the child button's default action to proceed
          // If needed, call any specific function related to the button here
          // E.g., openShareDialog(button);

          // Do not stop propagation if you want the button to perform its intended functionality
          return;
        }

        // Existing logic to handle slide click
        if (slide.classList.contains("is-active")) {
          if (event.target.classList.contains("poster")) {
            if (customSplide.Components.Autoplay.isPaused()) {
              customSplide.Components.Autoplay.play();
            } else {
              customSplide.Components.Autoplay.pause();
            }
          }
        } else {
          customSplide.go(index);
        }
      });
    });
}

// Research Posters Slider with Autoplay
function posterSliderAuto() {
  let splides = document.querySelectorAll(".poster-slider-auto");
  for (let splide of splides) {
    let customSplide = new Splide(splide, {
      autoWidth: true,
      pagination: false,
      focus: "center",
      perPage: 1,
      trimSpace: false,
      gap: "2rem",
      drag: "free",
      snap: true,
      easing: "ease-out",
      omitEnd: true,
      autoplay: true, // Ensure autoplay is enabled
      pauseOnHover: false, // Prevent pausing on hover
      resetProgress: false,
      intersection: {
        inView: { autoplay: true },
        outView: { autoplay: false },
        rootMargin: "0px", // Ensure no margin for the root
        threshold: 1.0, // Ensure the slider is fully in view before triggering
      },
      breakpoints: {
        600: {
          gap: "1rem",
          easing: "ease-out",
        },
      },
    });

    // Add shared event listeners
    addSlideEventListeners(customSplide);

    customSplide.mount(window.splide.Extensions);
  }
}

// Research Posters Slider without Autoplay
function posterSlider() {
  let splides = document.querySelectorAll(".poster-slider");
  for (let splide of splides) {
    let customSplide = new Splide(splide, {
      autoWidth: true,
      pagination: false,
      focus: "center",
      perPage: 1,
      trimSpace: false,
      gap: "2rem",
      drag: "free",
      snap: true,
      easing: "ease-out",
      omitEnd: true,
      autoplay: false, // Autoplay disabled
      pauseOnHover: false, // Prevent pausing on hover
      resetProgress: false,
      breakpoints: {
        600: {
          gap: "1rem",
        },
      },
    });

    // Add shared event listeners
    addSlideEventListeners(customSplide);

    customSplide.mount();
  }
}

// Initialize all functions
document.addEventListener("DOMContentLoaded", () => {
  posterSlider();
  posterSliderAuto();
});
