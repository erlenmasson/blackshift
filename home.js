/**
 * Script Purpose: Homepage Custom Script
 * Author: Erlen Masson
 * Version: 1
 * Last Updated: 22nd August 2024
 */

console.log("Script - Home");

//
//------- Hero Animations -------//
//

function initHeroAnimations() {
  document.fonts.ready
    .then(function () {
      const tl = gsap.timeline({ delay: 0.5 });
      gsap.set(".hero-title_line", { opacity: 0 });
      tl.to(".hero-title_line", {
        opacity: 1,
        duration: 1,
        stagger: 0.5,
        ease: "power1.inOut",
      });
    })
    .catch(function () {
      console.error("Font loading error");
    });
}

//
//------- Type Animations -------//
//

function initTypeAnimations() {
  document.fonts.ready
    .then(function () {
      const duration = 3;
      const easeType = "power1.inOut";
      const repeatDelay = 2;

      const tlBlack = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay });
      tlBlack.to(".flex-loop-black", {
        duration,
        ease: easeType,
        css: {
          "--wght": 1000,
          "--wdth": 100,
        },
      });

      const tlShift = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay });
      tlShift.to(".flex-loop-shift", {
        duration,
        ease: easeType,
        css: {
          "--wght": 600,
          "--wdth": 115,
          "--YOPQ": 135,
          "--XTRA": 603,
        },
      });
    })
    .catch(function () {
      console.error("Font loading error");
    });
}

//
//------- Drop Scroll Animation -------//
//

function dropSectionScroll() {
  const dropSections = document.querySelectorAll(".drop_section-wrapper");

  dropSections.forEach((dropSection) => {
    const dropHScroll = dropSection.querySelector(".drop_h-scroll");

    if (!dropSection || !dropHScroll) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: dropSection,
        start: "top top",
        end: () => "+=" + dropHScroll.offsetWidth,
        pin: true,
        scrub: true,
      },
    });

    tl.fromTo(dropHScroll, { x: "50vw" }, { x: "-50vw", ease: "power1.out" });
  });
}

//
//------- Drop Modals -------//
//

function ajaxModal() {
  let modal = $("[data-modal='modal']");
  let modalWrapper = $("[data-modal='modal-wrapper']");
  let modalClose = $("[data-modal='modal-close']").attr(
    "aria-label",
    "Close Modal"
  );
  let modalContent = $("[data-modal='modal-content']");
  let cmsLinkSelector = "[data-modal='cms-link']";
  let cmsPageContentSelector = "[data-modal='cms-content']";
  let initialPageTitle = document.title;
  let initialPageUrl = window.location.href;
  let focusedLink;

  function updatePageInfo(newTitle, newUrl) {
    modalContent.empty();
    document.title = newTitle;
    window.history.replaceState({}, "", newUrl);
  }

  let timeline = gsap.timeline({
    paused: true,
    onReverseComplete: () => {
      focusedLink.focus();
      updatePageInfo(initialPageTitle, initialPageUrl);
    },
    onComplete: () => {
      modalClose.focus();
    },
  });
  timeline.set("body", { overflow: "hidden" });
  timeline.set(modal, {
    display: "block",
    onComplete: () => {
      modalContent.scrollTop(0);
      modalWrapper.scrollTop(0);
      console.log("Modal content has been scrolled to the top.");
    },
  });

  timeline.from(modal, { opacity: 0, duration: 0.3 }, "<");
  timeline.from(modalWrapper, { y: "100vh", duration: 0.5 });

  function keepFocusWithinModal() {
    let lastFocusableChild = modal
      .find(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      )
      .not(":disabled")
      .not("[aria-hidden=true]")
      .last();
    lastFocusableChild.on("focusout", function () {
      modalClose.focus();
    });
  }

  function modalReady() {
    // Your code here
  }

  $(document).on("click", cmsLinkSelector, function (e) {
    focusedLink = $(this);
    initialPageUrl = window.location.href;
    e.preventDefault();
    let linkUrl = $(this).attr("href");
    $.ajax({
      url: linkUrl,
      success: function (response) {
        let cmsContent = $(response).find(cmsPageContentSelector);
        let cmsTitle = $(response).filter("title").text();
        let cmsUrl = window.location.origin + linkUrl;
        updatePageInfo(cmsTitle, cmsUrl);
        modalContent.append(cmsContent);
        cmsHeading();
        audioInsights();
        timeline.play();
        keepFocusWithinModal();
        modalReady();
      },
    });
  });

  modalClose.on("click", function () {
    stopAllAudio(); // Stop all audio when the modal closes
    timeline.reverse();
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      stopAllAudio(); // Stop all audio when escape key is pressed
      timeline.reverse();
    }
  });

  $(document).on("click", modal, function (e) {
    if (!$(e.target).is(modal.find("*"))) {
      stopAllAudio(); // Stop all audio if clicking outside the modal content
      timeline.reverse();
    }
  });
}

//
// Initialize on DOMContentLoaded
//

document.addEventListener("DOMContentLoaded", () => {
  initHeroAnimations();
  initTypeAnimations();

  // Only initialize dropSectionScroll on screens wider than 768px
  if (window.innerWidth > 768) {
    dropSectionScroll();
  }
  ajaxModal();
});
