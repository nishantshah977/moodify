let currentAudio = null;
let currentButton = null;
let currentLoader = null;
const API_BASE = "https://moodify-server.vercel.app";

document.getElementById("queryForm").addEventListener("submit", fetchVideos);

function fetchVideos(e) {
  e.preventDefault();
  const searchTerm = document.getElementById("searchInput").value;
  const globalLoader = document.getElementById("globalLoader");

  globalLoader.classList.remove("hidden"); // Show the loader before fetching videos

  fetch(`${API_BASE}/query/${searchTerm}`)
    .then((response) => response.json())
    .then((data) => displayVideos(data))
    .catch((error) => console.error("Error fetching videos:", error))
    .finally(() => {
      globalLoader.classList.add("hidden"); // Hide the loader after fetching videos
    });
}

function displayVideos(videos) {
  const container = document.getElementById("videos");
  container.innerHTML = "";

  videos.forEach((video) => {
    const videoElement = document.createElement("div");
    videoElement.classList.add("bg-white", "p-4", "rounded", "shadow");

    videoElement.innerHTML = `
      <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-48 object-cover rounded">
      <h3 class="text-lg font-bold mt-2">${video.title}</h3>
      <button id="play-${video.id}" class="bg-green-500 text-white p-2 mt-2 w-full">
        <div id="loader-${video.id}" class="hidden inline">
          <svg width="20" height="20" fill="currentColor" class="mr-2 animate-spin inline" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
          </svg>
        </div>
        Play
      </button>
    `;
    container.appendChild(videoElement);

    const audio = new Audio();

    document
      .getElementById(`play-${video.id}`)
      .addEventListener("click", () => {
        const loader = document.getElementById(`loader-${video.id}`);
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          currentButton.innerText = "Play";
        }

        if (audio.paused) {
          loader.classList.remove("hidden"); // Show the loader for the audio fetch
          fetchAudioStream(video.link)
            .then((streamUrl) => {
              audio.src = streamUrl;
              audio.play();
              document.getElementById(`play-${video.id}`).innerText = "Pause";
              currentAudio = audio;
              currentButton = document.getElementById(`play-${video.id}`);
              currentLoader = loader;

              // Add ended event listener for auto-replay
              audio.addEventListener("ended", () => {
                audio.currentTime = 0;
                audio.play();
              });
            })
            .catch((error) =>
              console.error("Error fetching audio stream:", error)
            )
            .finally(() => {
              loader.classList.add("hidden"); // Hide the loader after the audio fetch
            });
        } else {
          audio.pause();
          document.getElementById(`play-${video.id}`).innerText = "Play";
          currentAudio = null;
          currentButton = null;
        }
      });
  });
}

function fetchAudioStream(videoLink) {
  return fetch(`${API_BASE}/download/${encodeURIComponent(videoLink)}`)
    .then((response) => response.json())
    .then((data) => data.stream_url);
}
