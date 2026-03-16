// js/banner-video.js

// Total number of videos in your folder
const totalVideos = 1; // change this to match your video count

const videoElement = document.getElementById('heroVideo');

function getRandomVideo(previousVideo = "") {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * totalVideos) + 1;
  } while (`videos/banner/${randomIndex}.mp4` === previousVideo); // avoid repeating
  return `videos/banner/${randomIndex}.mp4`;
}

function playRandomVideo(previousVideo = "") {
  const newVideo = getRandomVideo(previousVideo);
  videoElement.src = newVideo;
  videoElement.load();
  videoElement.play();
  return newVideo;
}

let currentVideo = ""; // track current video

videoElement.addEventListener('ended', () => {
  currentVideo = playRandomVideo(currentVideo);
});

// Start with a random video on page load
window.addEventListener('DOMContentLoaded', () => {
  currentVideo = playRandomVideo();
});