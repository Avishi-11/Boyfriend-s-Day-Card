
const envelope = document.getElementById("envelope");
const loveLetter = document.getElementById("loveLetter");
const envelopeHint = document.getElementById("envelopeHint");
const startButton = document.getElementById("startButton");
const surpriseButton = document.getElementById("surpriseButton");
const surpriseMessage = document.getElementById("surpriseMessage");
const floatingHearts = document.getElementById("floatingHearts");

const musicToggle = document.getElementById("musicToggle");
const backgroundMusic = document.getElementById("backgroundMusic");

// Scroll to the letter and open it.
startButton.addEventListener("click", () => {
  document.getElementById("letter").scrollIntoView({
    behavior: "smooth"
  });

  openLetter();
  makeHearts(12);
});

// Open or close the envelope.
function openLetter() {
  const isOpen = envelope.classList.toggle("open");

  envelope.setAttribute("aria-expanded", String(isOpen));

  loveLetter.hidden = !isOpen;
  envelopeHint.textContent = isOpen
    ? "your little letter is open ♡"
    : "tap the envelope to open it ♡";

  if (isOpen) {
    makeHearts(8);
  }
}

envelope.addEventListener("click", openLetter);

// Reveal the final surprise.
surpriseButton.addEventListener("click", () => {
  const isHidden = surpriseMessage.hidden;

  surpriseMessage.hidden = !isHidden;
  surpriseButton.textContent = isHidden
    ? "A little more love ♡"
    : "One last surprise for you 💌";

  if (isHidden) {
    makeHearts(35);

    setTimeout(() => {
      surpriseMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);
  }
});

// Create floating hearts.
function makeHearts(count = 8) {
  const symbols = ["♡", "♥", "ღ", "✿"];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${14 + Math.random() * 22}px`;
    heart.style.animationDuration = `${3 + Math.random() * 3}s`;
    heart.style.animationDelay = `${Math.random() * 0.8}s`;

    floatingHearts.appendChild(heart);

    heart.addEventListener("animationend", () => {
      heart.remove();
    }, { once: true });
  }
}

// A few subtle hearts on the page.
setInterval(() => {
  if (!document.hidden) {
    makeHearts(1);
  }
}, 2400);

// Show a useful placeholder when a photo hasn't been added yet.

document.querySelectorAll(".photo-frame").forEach((frame) => {
  const image = frame.querySelector("img");
  const placeholder = frame.querySelector(".photo-placeholder");

  // Video frames do not contain images, so skip them.
  if (!image || !placeholder) return;

  function showPlaceholder() {
    image.style.display = "none";
    placeholder.style.display = "flex";
  }

  function showPhoto() {
    image.style.display = "block";
    placeholder.style.display = "none";
  }

  image.addEventListener("error", showPlaceholder);
  image.addEventListener("load", showPhoto);

  if (image.complete) {
    if (image.naturalWidth > 0) {
      showPhoto();
    } else {
      showPlaceholder();
    }
  }
});


// Optional background music.
// Browsers require a user action before audio can play.
musicToggle.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    try {
      await backgroundMusic.play();
      musicToggle.classList.add("playing");
      musicToggle.textContent = "♫";
      musicToggle.setAttribute("aria-label", "Pause background music");
    } catch (error) {
      console.error("Music could not be played:", error);
      alert("Please add music/our-song.mp3 and try again ♡");
    }
  } else {
    backgroundMusic.pause();
    musicToggle.classList.remove("playing");
    musicToggle.textContent = "♫";
    musicToggle.setAttribute("aria-label", "Play background music");
  }
});

const memoryVideos = document.querySelectorAll(".memory-video");

// Remember whether the background music was playing
// before the video started.
let resumeMusicAfterVideo = false;

memoryVideos.forEach((video) => {
  // Video starts: pause background music.
  video.addEventListener("play", () => {
    resumeMusicAfterVideo = !backgroundMusic.paused;

    if (resumeMusicAfterVideo) {
      backgroundMusic.pause();
      musicToggle.classList.remove("playing");
      musicToggle.setAttribute("aria-label", "Play background music");
    }
  });

  // Video pauses: resume music if it was playing before.
  video.addEventListener("pause", () => {
    if (resumeMusicAfterVideo && video.currentTime < video.duration) {
      resumeBackgroundMusic();
    }
  });

  // Video finishes: resume background music.
  video.addEventListener("ended", () => {
    if (resumeMusicAfterVideo) {
      resumeBackgroundMusic();
    }
  });

  // Video is interrupted or stops loading.
  video.addEventListener("error", () => {
    if (resumeMusicAfterVideo) {
      resumeBackgroundMusic();
    }
  });
});

async function resumeBackgroundMusic() {
  resumeMusicAfterVideo = false;

  try {
    await backgroundMusic.play();

    musicToggle.classList.add("playing");
    musicToggle.setAttribute("aria-label", "Pause background music");
  } catch (error) {
    // Some browsers may block automatic audio playback.
    musicToggle.classList.remove("playing");
    musicToggle.setAttribute("aria-label", "Play background music");
    console.log("Tap the music button to resume playback.");
  }
}

// Add a gentle reveal when sections enter the viewport.
const sections = document.querySelectorAll(
  ".section-heading, .photo-card, .reason-card"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [
            { opacity: 0.35, transform: "translateY(14px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          {
            duration: 650,
            easing: "ease-out",
            fill: "both"
          }
        );

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  sections.forEach((section) => observer.observe(section));
}
