/**
 * Script Purpose: Launch Modal Pages
 * Author: Erlen Masson
 * Version: 5
 * Last Updated: November 19th 2024
 */

console.log("Script - Modal v5");

// Global Variables
let modal = $("[data-modal='modal']");
let modalWrapper = $("[data-modal='modal-wrapper']");
let modalClose = $("[data-modal='modal-close']").attr(
  "aria-label",
  "Close Modal"
);
let modalContent = $("[data-modal='modal-content']");
let initialPageTitle = document.title;
let initialPageUrl = window.location.href;
let focusedLink;
let modalAnimation;
let splideInstances = {};

let cardSlug = "[data-card-slug]";
let slideSlug = "[data-slide-slug]";
let slideTitle = $("[data-modal='title']");

let cmsPageContentSelector = "[data-modal='cms-content']";

// ------- Open / Close Modal ------- //
function openModal(dropNumber) {
  initModalAnimation(dropNumber);
  if (modalAnimation) modalAnimation.play();
  // console.log(`Modal opened for Drop ${dropNumber}`);
}

function closeModal() {
  if (modalAnimation) modalAnimation.reverse();
  setPageInfo(initialPageTitle, initialPageUrl);
  // console.log("Modal closed.");
  resetScroll();
  stopAllAudio();
}

function resetScroll() {
  modal.scrollTop(0);
  modalWrapper.scrollTop(0);
  modalContent.scrollTop(0);
}

function initModalAnimation(dropNumber) {
  let modal = $(`.modal_drop[data-drop="${dropNumber}"]`);
  let modalTrack = modal.find("[data-modal='slider']");

  // Check if modalTrack exists before attempting animation
  if (modalTrack.length) {
    $(".modal_drop").css("display", "none");
    modal.css("display", "flex");
    gsap.set(modalTrack, { y: "100vh" });

    modalAnimation = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        modal.css("display", "none");
        if (focusedLink) focusedLink.focus();
      },
      onComplete: () => {
        modalClose.focus();
      },
    });

    modalAnimation.set("body", { overflow: "hidden" });
    modalAnimation.fromTo(modalTrack, { y: "100vh" }, { y: 0, duration: 0.5 });

    modal.find("[data-modal='modal-close']").on("click", function () {
      closeModal();
    });

    $(document).on("keydown.modal", function (e) {
      if (e.key === "Escape") {
        closeModal();
      }
    });
  } else {
    console.warn("GSAP animation target not found:", modalTrack);
  }
}

// ------- Load Content ------- //
function loadContent(dropNumber, slideSlug) {
  let activeSlide = document.querySelector(
    `.modal_drop[data-drop="${dropNumber}"] .splide__slide[data-slide-slug="${slideSlug}"].is-active`
  );

  // Exit if the content is already loading or has been loaded
  if (
    activeSlide &&
    !activeSlide.classList.contains("content-loaded") &&
    !activeSlide.classList.contains("loading")
  ) {
    let contentUrl = `/drop-${dropNumber}/${slideSlug}`;
    console.log(`Loading content from URL: ${contentUrl}`);

    let slideContentContainer = activeSlide.querySelector(
      `[data-modal='modal-content']`
    );

    // Mark as loading to prevent duplicate calls
    activeSlide.classList.add("loading");

    $.ajax({
      url: contentUrl,
      success: function (response) {
        let cmsContent = $(response).find(cmsPageContentSelector);
        console.log("Loaded CMS Content:", cmsContent);

        if (cmsContent.length) {
          //$(cmsContent).appendTo(slideContentContainer).fadeIn();
          $(cmsContent).hide().appendTo(slideContentContainer).fadeIn();

          let cmsTitle = $(response).filter("title").text();
          setPageInfo(cmsTitle, contentUrl);
          cmsHeading();
          audioInsights();
          modalFocus();

          activeSlide.classList.remove("loading"); // Remove loading state
          activeSlide.classList.add("content-loaded"); // Mark content as loaded
          console.log(`Content successfully loaded for ${contentUrl}`);
        } else {
          console.error(
            "No content found with the specified cmsPageContentSelector"
          );
        }
      },
      error: function () {
        console.error(`Failed to load content from ${contentUrl}`);
        activeSlide.classList.remove("loading"); // Remove loading state on error
      },
    });
  } else {
    console.log("Content already loaded or active slide not found.");
  }
}

// ------- Recently Read ------- //
function recentlyRead(dropNumber, slideSlug) {
  let correspondingCard = document.querySelector(
    `.card_drop[data-drop="${dropNumber}"][data-card-slug="${slideSlug}"]`
  );

  if (correspondingCard) {
    correspondingCard.classList.add("recently-read");
  }
}

//------- Page Info -------//
function setPageInfo(newTitle, newUrl) {
  document.title = newTitle || slideTitle.text();
  window.history.replaceState({}, "", newUrl);
}

// ------- Setting Modal Focus for Accessibility ------- //
function modalFocus() {
  let modalClose = document.querySelector("[data-modal='modal-close']");
  let focusableElements = modal.find(
    "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
  );

  if (focusableElements.length > 0) {
    let lastElement = focusableElements[focusableElements.length - 1];
    lastElement.addEventListener("focusout", () => {
      modalClose.focus();
    });
  } else {
    modalClose.focus();
  }
}

// ------- Splide Modal ------- //
function splideModal() {
  let splides = document.querySelectorAll(".modal_drop.splide");

  splides.forEach((splideElement) => {
    let dropNumber = splideElement.getAttribute("data-drop");

    let splideInstance = new Splide(splideElement, {
      pagination: false,
      perPage: 1,
      trimSpace: false,
      focus: "center",
      gap: "2rem",
      drag: "free",
      snap: true,
      autoWidth: true,
      pagination: true, // Enable pagination
      easing: "ease-out",
      arrows: true,
      breakpoints: {
        600: { gap: "1rem" },
      },
    }).mount();
    splideInstances[dropNumber] = splideInstance;
    slideChange(dropNumber);
    // console.log(`Initialized Splide instance for Drop ${dropNumber}`);
  });
}

// ------- Slide Change ------- //
function slideChange(dropNumber) {
  let splideInstance = splideInstances[dropNumber];

  function handleSlideChange() {
    let activeSlide = splideInstance.Components.Elements.slides.find((slide) =>
      slide.classList.contains("is-active")
    );

    if (activeSlide) {
      let slideSlug = activeSlide.getAttribute("data-slide-slug");
      let newTitle =
        activeSlide.querySelector("[data-modal='title']").textContent ||
        document.title;
      let newUrl = `/drop-${dropNumber}/${slideSlug}`;

      setPageInfo(newTitle, newUrl);
      loadContent(dropNumber, slideSlug);
      recentlyRead(dropNumber, slideSlug); // Pass dropNumber and slideSlug
      stopAllAudio();

      // console.log(`Slide changed to ${slideSlug} in Drop ${dropNumber}`);
    }
  }

  splideInstance.on("moved", handleSlideChange);
  splideInstance.on("scrolled", handleSlideChange);
}

// ------- Move to Correct Slide in the Modal Slider ------- //
function moveSlide(dropNumber, clickedSlug) {
  let splideInstance = splideInstances[dropNumber];

  if (splideInstance) {
    let slideIndex = Array.from(
      splideInstance.Components.Elements.slides
    ).findIndex(
      (slide) => slide.getAttribute("data-slide-slug") === clickedSlug
    );
    if (slideIndex !== -1) {
      splideInstance.go(slideIndex);
    }
  }
}

function checkActiveSlide(dropNumber) {
  let activeSlide = document.querySelector(
    `.modal_drop[data-drop="${dropNumber}"] .splide__slide.is-active`
  );

  if (activeSlide && !activeSlide.classList.contains("content-loaded")) {
    let slideSlug = activeSlide.getAttribute("data-slide-slug");
    loadContent(dropNumber, slideSlug);
  }
}

// ------- Initial Click to Open Modal ------- //
$(document).on("click", ".card_drop", function (e) {
  e.preventDefault();
  // focusedLink = $(this);

  let dropNumber = $(this).attr("data-drop");
  let clickedSlug = $(this).attr("data-card-slug");

  console.log(`Clicked Drop: ${dropNumber}, Card Slug: ${clickedSlug}`);

  let newTitle = slideTitle.text() || document.title;
  let newUrl = `/drop-${dropNumber}/${clickedSlug}`;
  setPageInfo(newTitle, newUrl);
  openModal(dropNumber);

  setTimeout(function () {
    moveSlide(dropNumber, clickedSlug);
    checkActiveSlide(dropNumber);
    recentlyRead(dropNumber, clickedSlug);
  }, 300);
});

// ------- Initialize Modal Functionality ------- //
function initializeModal() {
  splideModal();
  initModalAnimation();
}
// Event listener to initialize modal setup once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", initializeModal);
