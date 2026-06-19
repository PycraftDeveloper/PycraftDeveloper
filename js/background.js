const hexBg = document.getElementById('hexBg');

const colors = ['#4a90e2', '#357abd', '#2a5a88', '#6ba4e8', '#1c446e'];
const totalHexagons = 255;

// Get the current screen's scaling ratio (defaults to 1 if undetected)
const dpr = window.devicePixelRatio || 1;

for (let i = 0; i < totalHexagons; i++) {
  const hex = document.createElement('div');
  hex.classList.add('hex');

  const randomTop = Math.floor(Math.random() * 100);
  const randomLeft = Math.floor(Math.random() * 100);
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Scale your pixel boundaries (20px to 200px) by the device pixel ratio
  const minWidth = 20 * dpr;
  const maxWidth = 200 * dpr;

  // Generate random width within the DPR-adjusted range
  const randomWidth = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
  const calculatedHeight = Math.round(randomWidth / 1.15);

  // Apply positions and colors
  hex.style.top = `${randomTop}%`;
  hex.style.left = `${randomLeft}%`;
  hex.style.backgroundColor = randomColor;

  // Set the dynamic, resolution-independent sizes
  hex.style.width = `${randomWidth}px`;
  hex.style.height = `${calculatedHeight}px`;

  hexBg.appendChild(hex);
}
