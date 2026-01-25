// carousel.js
// Simple carousel with auto-rotate, random start, arrow + dot navigation, and touch support.
// Updated slide transform logic so slides align precisely and are centered.

document.addEventListener('DOMContentLoaded', function () {
  const slidesData = [
    {
      title: "How To Train Your Dragon Game",
      subtitle: "Click to find out more",
      image: "images/featured1.jpg"
    },
    {
      title: "Project Two — Experimental Renderer",
      subtitle: "Click to find out more",
      image: "images/featured2.jpg"
    },
    {
      title: "Mobile Puzzle Prototype",
      subtitle: "Click to find out more",
      image: "images/featured3.jpg"
    },
    {
      title: "Research Paper — PMMA",
      subtitle: "Click to find out more",
      image: "images/featured4.jpg"
    }
  ];

  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const caption = document.getElementById('carouselCaption');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let current = Math.floor(Math.random() * slidesData.length); // random start
  let slideCount = slidesData.length;
  let isPlaying = true;
  const intervalMs = 5000;
  let timer = null;

  // build slides
  slidesData.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.style.backgroundImage = `url("${s.image}")`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slidesData.length}`);
    slide.setAttribute('data-index', i);

    const overlay = document.createElement('div');
    overlay.className = 'slide-overlay';
    slide.appendChild(overlay);

    // caption inside slide (bottom-left)
    const info = document.createElement('div');
    info.className = 'slide-info';
    info.innerHTML = `<div>${s.title}</div><div style="font-weight:400;font-size:18px;margin-top:6px;">${s.subtitle}</div>`;
    slide.appendChild(info);

    track.appendChild(slide);

    // dot
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('data-index', i);
    dot.addEventListener('click', () => moveTo(i));
    dotsContainer.appendChild(dot);
  });

  const slides = Array.from(track.children);
  const dots = Array.from(dotsContainer.children);

  function update() {
    // compute percent shift relative to the track width so that each slide aligns
    // track width = 100% * slideCount; moving by one slide equals (100 / slideCount)%
    const shiftPercent = -current * (100 / slideCount);
    track.style.transform = `translateX(${shiftPercent}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    caption.textContent = slidesData[current].title;
  }

  function moveTo(index) {
    current = (index + slideCount) % slideCount;
    update();
    restartTimer();
  }

  function next() {
    moveTo(current + 1);
  }

  function prev() {
    moveTo(current - 1);
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // keyboard support
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // auto-play
  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      next();
    }, intervalMs);
    isPlaying = true;
  }
  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
    isPlaying = false;
  }
  function restartTimer() {
    stopTimer();
    startTimer();
  }

  // pause on hover/focus (attach to viewport so hover on arrows doesn't accidentally pause incorrectly)
  const viewport = document.querySelector('.carousel-viewport');
  viewport.addEventListener('mouseenter', stopTimer);
  viewport.addEventListener('mouseleave', startTimer);
  viewport.addEventListener('focusin', stopTimer);
  viewport.addEventListener('focusout', startTimer);

  // touch support for swipe
  let touchStartX = 0;
  let touchEndX = 0;
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive:true});
  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) prev(); else next();
    }
  });

  // initialize
  // Force a reflow/read to ensure layout is ready (helps in some browsers)
  window.requestAnimationFrame(() => {
    update();
    startTimer();
  });

  // expose for debugging (optional)
  window.__portfolioCarousel = {
    moveTo, next, prev, getCurrent: () => current
  };
});