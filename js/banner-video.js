// js/banner-video.js

// Total number of stream folders in your directory
const totalVideos = 7;

const videoElement = document.getElementById('heroVideo');
let hlsInstance = null; // Track the active hls.js instance
let currentVideoPath = ""; // Track current stream path to prevent repeats

// Generates the path to the playlist file (e.g., "videos/banner/3/stream.m3u8")
function getRandomStreamPath(previousPath = "") {
  let randomIndex;
  let newPath;
  do {
    randomIndex = Math.floor(Math.random() * totalVideos) + 1;
    newPath = `videos/banner/${randomIndex}/stream.m3u8`;
  } while (newPath === previousPath);
  return newPath;
}

function playRandomStream(previousPath = "") {
  const nextStreamPath = getRandomStreamPath(previousPath);

  // Scenario A: Browser needs hls.js (Chrome, Firefox, Edge, Android)
  if (Hls.isSupported()) {
    // Clean up old streams before loading a new one to prevent memory leaks
    if (hlsInstance) {
      hlsInstance.destroy();
    }

    hlsInstance = new Hls({ maxBufferLength: 10 });
    hlsInstance.loadSource(nextStreamPath);
    hlsInstance.attachMedia(videoElement);

    // Auto-play once the stream parses the first fragment
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      videoElement.play().catch(err => console.log("Autoplay blocked:", err));
    });
  }
  // Scenario B: Browser natively plays HLS streams (Safari, iOS)
  else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
    videoElement.src = nextStreamPath;
    videoElement.load();
    videoElement.play().catch(err => console.log("Autoplay blocked:", err));
  }

  return nextStreamPath;
}

// Listen for the stream to finish playing, then pick a new random one
videoElement.addEventListener('ended', () => {
  currentVideoPath = playRandomStream(currentVideoPath);
});

// Trigger the initial playback sequence safely after the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  currentVideoPath = playRandomStream();
});
