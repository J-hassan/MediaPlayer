let progress = document.getElementById('progress');
let song = document.getElementById('song');
let ctrlIcon = document.getElementById('ctrlIcons');
let image = document.querySelector('.song-img');
let currentIndex = 0; // Track the current song index
let progressInterval;

// Fetch the songs from the JSON file
let songs;
fetch('naats.json?v=' + Date.now())
  .then(response => response.json())
  .then(data => {
    songs = data;
    loadSong(currentIndex);
    createSongList(); // Call createSongList after songs are fetched
  })
  .catch(error => console.error('Error fetching songs:', error));

  function loadSong(direction) {
    if (direction === 'forward') {
      currentIndex = (currentIndex + 1) % songs.length;
    } else if (direction === 'backward') {
      currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    }
  
    const currentSong = songs[currentIndex];
    image.src = currentSong.image;
    image.alt = currentSong.title;
    document.querySelector('h1').textContent = currentSong.title;
  
    song.src = currentSong.audio;
    song.load(); // Load the new song
  
    // If the song is currently playing, start playing the new song
    if (!song.paused) {
      song.play().then(() => rotateImage()); // Start rotating the image when the song plays
    }
  
    // Update the play/pause icon based on the current state of the song
    ctrlIcon.classList.remove('fa-pause');
    ctrlIcon.classList.add('fa-play');
  }
  

function rotateImage() {
  const rotationAmount = (song.currentTime / song.duration) * 360;
  image.style.transform = `rotate(${rotationAmount}deg)`;
  requestAnimationFrame(rotateImage);
}

song.onloadedmetadata = function () {
  progress.max = song.duration;
  progress.value = song.currentTime;
  // Remove the following line to avoid immediate pausing after loading
  // song.pause();
};

function playpause() {
  if (song.paused) {
    song.play().then(() => {
        rotateImage();
        updateProgress();
    }); // Start rotating the image when the song plays
    ctrlIcon.classList.add('fa-pause');
    ctrlIcon.classList.remove('fa-play');
  } else {
    song.pause();
    ctrlIcon.classList.remove('fa-pause');
    ctrlIcon.classList.add('fa-play');
    cancelAnimationFrame(rotateImage); // Stop rotating when paused
  }
}

function updateProgress() {
  progress.value = song.currentTime;

  if (song.currentTime >= song.duration) {
    clearInterval(progressInterval);
    // Move to the next song when the current song ends
    loadSong('forward');
  }
}

progress.onchange = function () {
  song.currentTime = progress.value;
  ctrlIcon.classList.add('fa-pause');
  ctrlIcon.classList.remove('fa-play');

  // Clear the previous interval and set a new one
  clearInterval(progressInterval);
  progressInterval = setInterval(updateProgress, 500);
};

function toggleSongList() {
  const songListDiv = document.querySelector('.song-list');
  songListDiv.classList.toggle('show-list');
  console.log("bars is clicked!");
}


// Existing code ...

// Function to dynamically create the song list
function createSongList() {
  const songList = document.getElementById('songList');
  
  songs.forEach((song, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = song.title;
      listItem.addEventListener('click', () => {
          currentIndex = index; // Update the current index
          loadSong(); // Load and play the selected song
          toggleSongList();
      });
      songList.appendChild(listItem);
  });
}


