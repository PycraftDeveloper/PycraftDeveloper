const hexBg = document.getElementById('hexBg');

const colors = ['#4a90e2', '#357abd', '#2a5a88', '#6ba4e8', '#1c446e'];
const totalHexagons = 128;

for (let i = 0; i < totalHexagons; i++) {
  const hex = document.createElement('div');
  hex.classList.add('hex');

  const randomTop = Math.floor(Math.random() * 100);
  const randomLeft = Math.floor(Math.random() * 100);
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Convert 20px - 200px logic into responsive viewport widths (approx 1vw to 10vw)
  // This makes them perfectly scalable when resizing screen width
  const randomWidthVw = (Math.random() * (10 - 1.5) + 1.5).toFixed(2);
  const calculatedHeightVw = (randomWidthVw / 1.15).toFixed(2);

  // Set position in percentages
  hex.style.top = `${randomTop}%`;
  hex.style.left = `${randomLeft}%`;

  // Pass size and color as CSS variables so CSS can build the bloom layers
  hex.style.setProperty('--hex-w', `${randomWidthVw}vw`);
  hex.style.setProperty('--hex-h', `${calculatedHeightVw}vw`);
  hex.style.setProperty('--hex-color', randomColor);

  hexBg.appendChild(hex);
}
