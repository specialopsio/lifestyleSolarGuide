let isFullScreen = false
let isPaused = false
let isMuted = false
let vidPaused = false

async function loadOverlay() {
    const vidCon = document.querySelector('.video-player')
    const overlay = document.createElement('div')
    overlay.id = 'thumbnail-overlay'
    overlay.style.position = 'absolute'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100%'
    overlay.style.height = '100%'
    overlay.style.backgroundImage = `url('${thumbnailUrl}')`
    overlay.style.backgroundSize = 'cover'
    overlay.style.zIndex = '2'
    vidCon.appendChild(overlay)
}

async function loadAndPlayVideos(surveyResponse) {
    const videoClips = ['Intro.mp4', ...surveyResponse.map((ans, i) => `Q${i+1}A${ans+1}.mp4`),
        'Outro.mp4'
    ]
    const clipDuration = 30
    const totalDuration = videoClips.length * clipDuration
    const s3_base = 'https://s3.us-east-2.amazonaws.com/solarguidevideos'

    let currentClipIndex = 0
    let cumulativeDuration = 0
    let prevVol = 1

    const vidCon = document.querySelector('.video-player')
    const overlay = document.getElementById('thumbnail-overlay')
    const controls = document.querySelector('.controls')
    controls.style.zIndex = '3'
    let vidElem = document.getElementById('video')
    vidElem.removeAttribute('controls')
    const progressBar = document.querySelector(".timeline")
    progressBar.max = totalDuration
    const playButton = document.querySelector('.play-button.control-button');
    const soundButton = document.querySelector('.sound-button')
    const volumeSlider = document.querySelector('.volume-slider')
    const fullscreenButton = document.querySelector('.fullscreen-button')

    const music = new Audio(`${s3_base}/music.mp3`)

    vidCon.addEventListener('mouseenter', function () {
        controls.style.opacity = '1'
        controls.style.transition = 'opacity 0.5s'
    })

    vidCon.addEventListener('mouseleave', function () {
        if (!vidElem.paused) {
            controls.style.opacity = 0
        }
    })

    playButton.addEventListener('click', playPressed);
    vidCon.addEventListener('click', playPressed)

    soundButton.addEventListener('click', function (event) {
        if (event) {
            event.stopPropagation();
        }
        if (!isPaused) {
            isMuted = true
            music.volume = 0
            prevVol = volumeSlider.value
            volumeSlider.value = 0
        } else {
            volumeSlider.value = prevVol
            isMuted = false
            music.volume = 1
        }
        vidElem.muted = !vidElem.muted
        isPaused = !isPaused
        soundButton.innerHTML = isPaused ? mute : sound

    })
    volumeSlider.addEventListener('click', function(event){
        if(event){
            event.stopPropagation();
        }
    })
    volumeSlider.addEventListener('input', function (event) {
        if (event) {
            event.stopPropagation();
        }
        let volume = this.value
        vidElem.volume = volume
        music.volume = volume

        if (volume == 0) {
            vidElem.muted = true
            music.muted = true
            soundButton.innerHTML = mute
        } else {
            vidElem.muted = false
            music.muted = false
            soundButton.innerHTML = sound
        }
    })

    fullscreenButton.addEventListener('click', (event) => {
        if (event) {
          event.stopPropagation();
        }
        if (!document.fullscreenElement) {
          if (vidCon.requestFullscreen) {
            vidCon.requestFullscreen()
          } else if (vidCon.webkitRequestFullscreen) {
            vidCon.webkitRequestFullscreen()
          } else if (vidCon.mozRequestFullScreen) {
            vidCon.mozRequestFullScreen()
          } else if (vidCon.msRequestFullscreen) {
            vidCon.msRequestFullscreen()
          } else if (vidCon.webkitEnterFullscreen) {
            vidCon.webkitEnterFullscreen()
          } else if (vidElem.webkitEnterFullScreen) {
            vidElem.webkitEnterFullscreen()
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        }
    })

    let preLoadedVideo = null

    async function playPressed(event) {
        if (event) {
          event.stopPropagation();
        }
        if (!vidPaused) {
          overlay.style.display = 'none'
          if (vidElem.src !== `${s3_base}/${videoClips[currentClipIndex]}`) {
            loadVideoClip(videoClips[currentClipIndex])
          }
          vidElem.play()
          music.play()
          playButton.innerHTML = pause
        } else {
          vidElem.pause()
          if (!isMuted) {
            music.pause()
          }
          playButton.innerHTML = play
        }
        vidPaused = !vidPaused
      }

    function preloadVideoClip(index) {
        if (index < videoClips.length - 1) {
            const nextVideo = document.createElement("video")
            nextVideo.src = `${s3_base}/${videoClips[index + 1]}`
            nextVideo.load()
        }
    }

    function loadVideoClip(clipName, autoplay = false) {
        const videoSrc = `${s3_base}/${clipName}`
        if (preLoadedVideo) {
            vidElem = preLoadedVideo
        } else {
            if (vidElem.src !== videoSrc) {
                vidElem.src = videoSrc
                vidElem.load()
                preloadVideoClip(currentClipIndex)
            }
        }
    }
    vidElem.addEventListener('ended', function () {
        if (currentClipIndex < videoClips.length - 1) {
            currentClipIndex++
            cumulativeDuration += clipDuration
            loadVideoClip(videoClips[currentClipIndex])
            vidElem.play()
        } else {
            overlay.style.display = 'block'
            currentClipIndex = 0
            cumulativeDuration = 0
            playButton.innerHTML = play
            music.pause()
            music.currentTime = 0
        }
    })

    function timeUpdate() {
        if (music.paused && !vidElem.paused) {
            music.play()
        }
        let current = cumulativeDuration + vidElem.currentTime
        let progressPercent = (current / totalDuration) * 100
        progressBar.style.backgroundSize = `${progressPercent}% 100%`
        progressBar.value = current
    }

    vidElem.addEventListener('timeupdate', timeUpdate)

    progressBar.addEventListener('click', function (e) {
        if (e) {
            e.stopPropagation()
        }
        let rect = progressBar.getBoundingClientRect()
        let x = e.clientX - rect.left
        let clickedTime = (x / progressBar.offsetWidth) * totalDuration
        let newClipIndex = Math.floor(clickedTime / clipDuration)

        let progressPercent = (clickedTime / totalDuration) * 100
        progressBar.style.backgroundSize = `${progressPercent}% 100%`
        progressBar.value = clickedTime
        overlay.style.display = 'none'

        if (newClipIndex !== currentClipIndex) {
            currentClipIndex = newClipIndex
            cumulativeDuration = currentClipIndex * clipDuration
            loadVideoClip(videoClips[currentClipIndex])

            vidElem.removeEventListener('loadedmetadata', onVideoLoaded)
            vidElem.addEventListener('loadedmetadata', onVideoLoaded)
        } else if (newClipIndex === currentClipIndex) {
            let seekTime = clickedTime - cumulativeDuration
            vidElem.currentTime = seekTime
        }

        const musicTime = (clickedTime % 180)
        music.currentTime = musicTime

        function onVideoLoaded() {
            vidElem.currentTime = clickedTime % clipDuration
            vidElem.play()
            music.play()
            vidElem.removeEventListener('loadedmetadata', onVideoLoaded)
            playButton.innerHTML = pause
        }
    });

}
document.addEventListener("DOMContentLoaded", function () {
    loadOverlay()
})
const customerId = getCustomerIdFromUrl();
if (customerId) {
    fetchData(customerId);
} else {
    console.error("Customer ID not found in URL");
}

const playButton = document.querySelector('.play-button');
  const video = document.getElementById('video');
  const timeline = document.querySelector('.timeline');
  const soundButton = document.querySelector('.sound-button');
  const fullscreenButton = document.querySelector('.fullscreen-button');
  const videoContainer = document.querySelector('.video-player');
  
  playButton.addEventListener('click', function () {
    if (video.paused) {
      video.play();
      videoContainer.classList.add('playing');
      playButton.innerHTML = pause;
    } else {
      video.pause();
      videoContainer.classList.remove('playing');
      playButton.innerHTML = play;
    }
  })
  
  video.onended = function () {
    playButton.innerHTML = play;
  }
  
  video.ontimeupdate = function () {
    const percentagePosition = (100*video.currentTime) / video.duration;
    timeline.style.backgroundSize = `${percentagePosition}% 100%`;
    timeline.value = percentagePosition;
  }
  
  timeline.addEventListener('change', function () {
    const time = (timeline.value * video.duration) / 100;
    video.currentTime = time;
  });
  
  soundButton.addEventListener('click', function () {
    video.muted = !video.muted;
    soundButton.innerHTML = video.muted ? mute : sound;
  });