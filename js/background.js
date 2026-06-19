const hexBg = document.getElementById('hexBg');

const colors = ['#4a90e2', '#357abd', '#2a5a88', '#6ba4e8', '#1c446e'];
const totalHexagons = 255; 

for (let i = 0; i < totalHexagons; i++) {
  const hex = document.createElement('div');
  hex.classList.add('hex');
  
  const randomTop = Math.floor(Math.random() * 100);
  const randomLeft = Math.floor(Math.random() * 100);
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // 1. Generate a random width between 50px and 200px
  const randomWidth = Math.floor(Math.random() * (200 - 20 + 1)) + 20;
  // 2. Calculate height to preserve perfect hexagon geometry (Width / 1.15)
  const calculatedHeight = Math.round(randomWidth / 1.15);
  
  // Apply positions and colors
  hex.style.top = `${randomTop}%`;
  hex.style.left = `${randomLeft}%`;
  hex.style.backgroundColor = randomColor;
  
  // 3. Dynamically set the unique sizes
  hex.style.width = `${randomWidth}px`;
  hex.style.height = `${calculatedHeight}px`;
  
  hexBg.appendChild(hex);
}
