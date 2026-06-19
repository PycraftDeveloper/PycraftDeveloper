const hexBg = document.getElementById('hexBg');

const colors = ['#4a90e2', '#357abd', '#2a5a88', '#6ba4e8', '#1c446e'];
const totalHexagons = 128;
const dpr = window.devicePixelRatio || 1;

// Clear any broken elements first
hexBg.innerHTML = '';

for (let i = 0; i < totalHexagons; i++) {
  const randomTop = Math.floor(Math.random() * 100);
  const randomLeft = Math.floor(Math.random() * 100);
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const minWidth = 20 * dpr;
  const maxWidth = 200 * dpr;
  const randomWidth = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
  const calculatedHeight = Math.round(randomWidth / 1.15);

  // Calculate a dynamic line thickness based on width (e.g., 2% of the width)
const dynamicStroke = Math.max(2, Math.round(randomWidth * 0.03));

const svgString = `
  <svg class="hex" viewBox="0 0 100 100" preserveAspectRatio="none"
       style="top: ${randomTop}%; left: ${randomLeft}%; width: ${randomWidth}px; height: ${calculatedHeight}px;">
    <polygon points="25,2 75,2 98,50 75,98 25,98 2,50"
             stroke="${randomColor}"
             vector-effect="non-scaling-stroke" />
  </svg>
`;


  hexBg.insertAdjacentHTML('beforeend', svgString);
}
