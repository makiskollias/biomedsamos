console.log("landing.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const heroSlides = document.querySelectorAll(".hero__slide");
  const heroTexts = document.querySelectorAll(".hero__text");

  if (heroSlides.length > 1 && heroTexts.length > 1) {
    let currentHeroSlide = 0;

    setInterval(() => {
      heroSlides[currentHeroSlide].classList.remove("is-active");
      heroTexts[currentHeroSlide].classList.remove("is-active");

      currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;

      heroSlides[currentHeroSlide].classList.add("is-active");
      heroTexts[currentHeroSlide].classList.add("is-active");
    }, 5000);
  }

  const burger = document.querySelector(".burger");
  const navlinks = document.querySelector(".navlinks");
  const overlay = document.querySelector(".nav-overlay");

  if (burger && navlinks && overlay) {
    const closeMenu = () => {
      navlinks.classList.remove("is-open");
      overlay.classList.remove("is-active");
      burger.classList.remove("is-open");
    };

    burger.addEventListener("click", () => {
      navlinks.classList.toggle("is-open");
      overlay.classList.toggle("is-active");
      burger.classList.toggle("is-open");
    });

    overlay.addEventListener("click", closeMenu);

    navlinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  const labTrack = document.querySelector(".lab-slider__track");
  const labSlides = document.querySelectorAll(".lab-slider__track img");

  if (labTrack && labSlides.length > 1) {
    let labIndex = 0;
    let labTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    const updateLabSlider = () => {
      labTrack.style.transform = `translateX(-${labIndex * 100}%)`;
    };

    const goToNextLabSlide = () => {
      labIndex = (labIndex + 1) % labSlides.length;
      updateLabSlider();
    };

    const goToPrevLabSlide = () => {
      labIndex = (labIndex - 1 + labSlides.length) % labSlides.length;
      updateLabSlider();
    };

    const startLabSlider = () => {
      stopLabSlider();
      labTimer = setInterval(goToNextLabSlide, 3500);
    };

    const stopLabSlider = () => {
      if (labTimer) {
        clearInterval(labTimer);
        labTimer = null;
      }
    };

    labTrack.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].screenX;
      stopLabSlider();
    }, { passive: true });

    labTrack.addEventListener("touchend", (event) => {
      touchEndX = event.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;

      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          goToNextLabSlide();
        } else {
          goToPrevLabSlide();
        }
      }

      startLabSlider();
    }, { passive: true });

    updateLabSlider();
    startLabSlider();
  }
});