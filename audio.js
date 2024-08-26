/**
 * Script Purpose: Custom Audio
 * Author: Erlen Masson
 * Version: 1
 * Last Updated: 26th August 2024
 */

console.log("Script - Audio");

let playingInterviews = []; // Define the array to track currently playing interviews

function audioInsights() {
  const buttons = document.querySelectorAll(".insights_button");
  let currentInterview = null; // Track the currently playing interview

  buttons.forEach((button) => {
    const url = button.querySelector(".audio_url").textContent;
    const insightsAudio = button.closest(".insights_audio");
    const scrubber = insightsAudio.querySelector(".scrubber");
    const progressBar = scrubber.querySelector(".progress-bar");

    const interview = new Howl({
      src: [url],
      volume: 0.3,
      onend: function () {
        button.classList.remove("playing");
        progressBar.style.width = "0%";
        currentInterview = null;
        playingInterviews = playingInterviews.filter((i) => i !== interview); // Remove from array when it ends
      },
    });

    button.addEventListener("click", () => {
      // Stop the currently playing interview if it's not the one being clicked
      if (currentInterview && currentInterview !== interview) {
        currentInterview.stop();
        document
          .querySelector(".insights_button.playing")
          ?.classList.remove("playing");
        playingInterviews = playingInterviews.filter(
          (i) => i !== currentInterview
        ); // Remove the stopped interview from the array
      }

      // Toggle play/pause for the clicked interview
      if (button.classList.contains("playing")) {
        interview.stop();
        button.classList.remove("playing");
        currentInterview = null;
        playingInterviews = playingInterviews.filter((i) => i !== interview); // Remove when stopped
      } else {
        stopAllAudio(); // Stop all other audio before playing the new one
        interview.play();
        button.classList.add("playing");
        currentInterview = interview;
        playingInterviews.push(interview); // Add to playingInterviews
        requestAnimationFrame(updateProgress);
      }
    });

    function updateProgress() {
      const progress = (interview.seek() || 0) / interview.duration();
      progressBar.style.width = progress * 100 + "%";

      if (interview.playing()) {
        requestAnimationFrame(updateProgress);
      }
    }

    scrubber.addEventListener("click", (e) => {
      const scrubberWidth = scrubber.clientWidth;
      const clickPosition = e.offsetX;
      const seekTo = (clickPosition / scrubberWidth) * interview.duration();
      interview.seek(seekTo);
      updateProgress();
    });
  });
}

// Function to stop all audio
function stopAllAudio() {
  playingInterviews.forEach((interview) => {
    interview.stop();
  });
  playingInterviews = []; // Clear the array after stopping all audio
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  audioInsights();
});
