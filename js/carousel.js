// carousel.js
// Pixel-based slide sizing and transforms to guarantee exact alignment.
// Auto-rotate, random start, arrow + dot navigation, keyboard and touch support.
// Recalculates sizes on resize.

document.addEventListener('DOMContentLoaded', function () {
  const slidesData = [
    {
      title: "PMMA - Python Multi-Media API",
      subtitle: "(Click to find out more)",
      image: "images/Featured/pmma.jpg",
      target: "#pmma"
    },
    {
      title: "Ghouls and Gold",
      subtitle: "(Click to find out more)",
      image: "images/Featured/ghouls_and_gold.jpg",
      target: "#Ghouls-And-Gold"
    },
    {
      title: "How To Train Your Dragon Game",
      subtitle: "(Click to find out more)",
      image: "images/Featured/httyd_game.jpg",
      target: "#httyd-game"
    },
    {
      title: "Gourmet Heaven",
      subtitle: "(Click to find out more)",
      image: "images/Featured/gourmet_heaven.jpg",
      target: "#gourmet-heaven"
    }
  ];

  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const caption = document.getElementById('carouselCaption');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const viewport = document.querySelector('.carousel-viewport');

  let current = Math.floor(Math.random() * slidesData.length); // random start
  const slideCount = slidesData.length;
  let slideWidth = 0;
  let isPlaying = true;
  const intervalMs = 15000;
  let timer = null;

  // build slides + dots
  slidesData.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.style.backgroundImage = `url("${s.image}")`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slidesData.length}`);
    slide.setAttribute('data-index', i);

    slide.addEventListener('click', () => {
      const target = slidesData[i].target;
      if (target) {
        document.querySelector(target).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });

    const overlay = document.createElement('div');
    overlay.className = 'slide-overlay';
    slide.appendChild(overlay);

    const info = document.createElement('div');
    info.className = 'slide-info';
    info.innerHTML = `<div>${s.title}</div><div style="font-weight:400;font-size:18px;margin-top:6px;font-style:italic;">${s.subtitle}</div>`;
    slide.appendChild(info);

    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('data-index', i);
    dot.addEventListener('click', () => moveTo(i));
    dotsContainer.appendChild(dot);
  });

  const slides = Array.from(track.children);
  const dots = Array.from(dotsContainer.children);

  // Set widths in pixels so each slide exactly matches the visible viewport.
  function setSizes(animate = false) {
    // measure viewport available width (includes viewport padding)
    slideWidth = Math.max(0, viewport.clientWidth);

    // disable transition when resizing to avoid animation jump
    track.style.transition = animate ? 'transform 480ms cubic-bezier(.22,.9,.2,1)' : 'none';

    // assign each slide an explicit pixel width
    slides.forEach(s => {
      s.style.width = `${slideWidth}px`;
    });

    // set explicit track width
    track.style.width = `${slideWidth * slideCount}px`;

    // set transform to place the correct slide
    track.style.transform = `translateX(${-current * slideWidth}px)`;
  }

  function updateUI() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    caption.textContent = slidesData[current].title;
  }

  function moveTo(index, animate = true) {
    current = (index + slideCount) % slideCount;
    // ensure transition is enabled
    track.style.transition = animate ? 'transform 480ms cubic-bezier(.22,.9,.2,1)' : 'none';
    // use pixel transform for exact alignment
    track.style.transform = `translateX(${-current * slideWidth}px)`;
    updateUI();
    restartTimer();
  }

  function next() { moveTo(current + 1); }
  function prev() { moveTo(current - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // keyboard support (focusable viewport)
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // autoplay
  function startTimer() {
    stopTimer();
    timer = setInterval(next, intervalMs);
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

  // pause on hover/focus
  viewport.addEventListener('mouseenter', stopTimer);
  viewport.addEventListener('mouseleave', startTimer);
  viewport.addEventListener('focusin', stopTimer);
  viewport.addEventListener('focusout', startTimer);

  // touch support: swipe
  let touchStartX = 0;
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, {passive:true});
  viewport.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) prev();
      else next();
    }
  });

  // debounce resize
  let resizeTimer = null;
  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    // recalc after a short pause to let layout settle
    resizeTimer = setTimeout(() => {
      // keep the same logical slide visible; no animation
      setSizes(false);
    }, 120);
  }
  window.addEventListener('resize', onResize);

  // ensure sizes are set after images/fonts load
  function init() {
    setSizes(false);       // compute sizes without animation
    updateUI();
    // start the autoplay after layout settled
    startTimer();
  }

  // Try to initialize after images have loaded; also fallback to rAF
  let imagesToLoad = 0;
  slides.forEach(sl => {
    const bg = sl.style.backgroundImage;
    const match = bg && bg.match(/url\("(.*)"\)/);
    if (match && match[1]) {
      imagesToLoad++;
      const img = new Image();
      img.src = match[1];
      img.onload = img.onerror = () => {
        imagesToLoad--;
        if (imagesToLoad === 0) requestAnimationFrame(init);
      };
    }
  });
  // if there are no background images (or already cached), just init
  if (imagesToLoad === 0) requestAnimationFrame(init);

  // expose for debugging
  window.__portfolioCarousel = {
    moveTo, next, prev, getCurrent: () => current, recalc: () => setSizes(false)
  };
});

const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
