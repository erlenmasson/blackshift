/**
 * Script Purpose: TextAnimations
 * Author: Erlen Masson
 * Version: 1.0
 * Started: 19th November 2024
 */

console.log("Script - Text Animations");

// ------- Configurable Parameters ------- //
const fadeStart = window.innerWidth < 768 ? "top 100%" : "top 85%";
const fadeEnd = window.innerWidth < 768 ? "top 60%" : "bottom 75%";
const fadeEnd2 = window.innerWidth < 768 ? "top 50%" : "bottom 75%";
const animationStagger = { chars: 0.05, words: 0.1, lines: 0.15 };
const debounceTimeout = 150;

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let splitTextInstances = [];

//
//------- Animations -------//
//

function textAnimations() {
  // Select all elements with the [data-text-animate] attribute
  const animatedElements = document.querySelectorAll("[data-text-animate]");

  animatedElements.forEach((element) => {
    // Set the aria-label attribute to the original text
    element.setAttribute("aria-label", element.textContent);
  });

  fadeCharacters();
  fadeWords();
  fadeLines();
  fadeRichText();
  fadeElements();
  fadeList();
}

// Fade by Characters
function fadeCharacters() {
  splitTextInstances.forEach((instance) => instance.revert());
  splitTextInstances = [];

  gsap.utils.toArray("[data-text-animate='chars']").forEach((element) => {
    const split = new SplitText(element, { type: "chars" });
    splitTextInstances.push(split);
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
        stagger: animationStagger.chars,
      });
  });
}

// Fade by Words
function fadeWords() {
  gsap.utils.toArray("[data-text-animate='words']").forEach((element) => {
    const split = new SplitText(element, { type: "words" });
    splitTextInstances.push(split);
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
        stagger: animationStagger.words,
      });
  });
}

// Fade by Lines
function fadeLines() {
  gsap.utils.toArray("[data-text-animate='lines']").forEach((element) => {
    const split = new SplitText(element, { type: "lines" });
    splitTextInstances.push(split);
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
        stagger: animationStagger.lines,
      });
  });
}

// Fade by Rich Text Lines
function fadeRichText() {
  gsap.utils
    .toArray("[data-text-animate='rich-text']")
    .forEach((richTextElement) => {
      gsap.utils
        .toArray(
          richTextElement.querySelectorAll("h1, h2, h3, p, li, blockquote")
        )
        .forEach((element) => {
          const split = new SplitText(element, { type: "lines" });
          splitTextInstances.push(split);
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
              stagger: animationStagger.lines,
            });
        });
    });
}

// Fade by Individual Elements
function fadeElements() {
  gsap.utils.toArray("[data-text-animate='element']").forEach((element) => {
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
}

// Fade byList Items
function fadeList() {
  gsap.utils.toArray("[data-text-animate='list']").forEach((list) => {
    const items = gsap.utils.toArray(list.children);
    items.forEach((item) => {
      gsap.set(item, { opacity: 0 });
      gsap.to(item, {
        opacity: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: item,
          start: fadeStart,
          end: fadeEnd,
          scrub: true,
        },
      });
    });
  });
}

// Ensure fonts are loaded before running animations
document.fonts.ready
  .then(function () {
    console.log("Fonts loaded successfully");
    textAnimations();
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
  textAnimations();
}

// Optional: Add event listener for window resize if needed
function addResizeListener() {
  window.addEventListener("resize", debounce(handleResize));
}
