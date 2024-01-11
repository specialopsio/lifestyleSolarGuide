if (window.location.href.indexOf("lsguide.webflow.io") !== -1) {
  const play = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
</svg>`;
  const pause = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`;
  const sound = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
</svg>`;
  const mute = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" />
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
</svg>`;
  const thumbnailUrl = 'https://solarguidevideos.s3.us-east-2.amazonaws.com/thumbail2.jpg';
  let videoClips = ['Intro.mp4', `Q1A1.mp4`, `Q2A1.mp4`, `Q3A1.mp4`, `Q4A1.mp4`, 'Outro.mp4']
  let endData
  // Function to extract 'id' query parameter from the URL
  function getCustomerIdFromUrl() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("id");
  }

  // Function to fetch data using the customer ID
  async function fetchData(customerId) {
    const url = `https://hook.us1.make.com/1lqfj9g8jrgqnkwodbt7ctn8uywfdiht?customerId=${customerId}`;

    try {
      const response = await fetch(url);
      const rawText = await response.text();
      const sanitizedText = sanitizeJSON(rawText);
      const data = JSON.parse(sanitizedText);

      updateHtmlWithData(data);
      displaySelectedAnswers(data.survey);
      updateDisplayAfterFetch();
      endData = data

      // Load and play videos based on survey response
      loadAndPlayVideos(data.survey);

      return data;
    } catch (error) {
      console.error("Error:", error);
      if (new URLSearchParams(window.location.search).get('id') === 'admin') {
        updateDisplayAfterFetch();
      }
    }
  }

  function sanitizeJSON(rawText) {
    rawText = rawText
      .replace(/\[,/g, "[null,")
      .replace(/,\]/g, ",null]")
      .replace(/,,/g, ",null,");
    rawText = rawText.replace(/:\s*,/g, ": null,");
    return rawText;
  }

  function safeRetrieve(obj, key) {
    return obj && obj[key] ? obj[key] : "";
  }

  function updateHtmlWithData(data) {
    if (!data) {
      console.error("Received null or invalid data");
      return;
    }

    for (let i = 1; i <= 4; i++) {
      const surveyElement = document.getElementById(`survey${i}`);
      if (surveyElement) {
        surveyElement.textContent =
          data.survey && data.survey.length >= i ? data.survey[i - 1] : "";
      }
    }

    document.getElementById("zip").textContent = safeRetrieve(data, "zip");
    document.getElementById("zip2").textContent = safeRetrieve(data, "zip");
    document.getElementById("zip3").textContent = safeRetrieve(data, "zip");
    updateRepresentativeInfo(data.rep || {});
  }

  function updateRepresentativeInfo(rep) {
    const repPhoneElement = document.getElementById("repPhone");
    const repEmailElement = document.getElementById("repEmail");
    const repContactElement = document.getElementById("repContact");
    const repPictureElement = document.getElementById("repPicture");

    document.getElementById("repName").textContent = safeRetrieve(rep, "name");
    document.getElementById("contactRepName").textContent = safeRetrieve(rep, "name");

    // Update phone
    if (rep.phone) {
      const formattedPhone = rep.phone.replace(/[ \(\)\-\+]/g, "");
      repPhoneElement.textContent = rep.phone;
      repPhoneElement.href = `tel:${formattedPhone}`;
      repPhoneElement.style.display = "block";
    } else {
      repPhoneElement.style.display = "none";
      document.getElementById("contactRepPhoneContainer").style.display = "none";
    }

    // Update email
    if (rep.email) {
      repEmailElement.href = `mailto:${rep.email}`;
      repEmailElement.style.display = "block";
      document.getElementById("contactRepEmail").textContent = rep.email;
    } else {
      repEmailElement.style.display = "none";
      document.getElementById("contactRepEmailContainer").style.display = "none";
    }

    // Update picture
    if (rep.picture) {
      repPictureElement.src = rep.picture;
      repPictureElement.style.display = "block";
      document.getElementById("contactRepPhone").textContent = rep.phone;
    } else {
      repPictureElement.style.display = "none";
    }

    // Hide contact elements if both phone and email are missing
    if (!rep.phone && !rep.email) {
      repPhoneElement.style.display = "none";
      repEmailElement.style.display = "none";
      if (repContactElement) {
        repContactElement.style.display = "none";
      }
    }
  }

  function updateDisplayAfterFetch() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("app").style.display = "block";
  }

  function displaySelectedAnswers(surveyData) {
    for (let questionNumber = 1; questionNumber <= surveyData.length; questionNumber++) {
      const selectedAnswer = surveyData[questionNumber - 1] + 1;
      const questionSection = document.getElementById(`q${questionNumber}`);

      if (questionSection) {
        const answerDivs = questionSection.querySelectorAll('div[answer]');
        answerDivs.forEach(div => {
          const answerNumber = parseInt(div.getAttribute('answer'));
          if (answerNumber !== selectedAnswer) {
            div.style.display = 'none';
          }
        });
      }
    }
  }
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
    videoClips = ['Intro.mp4', ...surveyResponse.map((ans, i) => `Q${i+1}A${ans+1}.mp4`),
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

    vidCon.addEventListener('mouseenter', function() {
      controls.style.opacity = '1'
      controls.style.transition = 'opacity 0.5s'
    })

    vidCon.addEventListener('mouseleave', function() {
      if (!vidElem.paused) {
        controls.style.opacity = 0
      }
    })

    playButton.addEventListener('click', playPressed);
    vidCon.addEventListener('click', playPressed)

    soundButton.addEventListener('click', function(event) {
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
    volumeSlider.addEventListener('click', function(event) {
      if (event) {
        event.stopPropagation();
      }
    })
    volumeSlider.addEventListener('input', function(event) {
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
    vidElem.addEventListener('ended', function() {
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

    progressBar.addEventListener('click', function(e) {
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
  document.addEventListener("DOMContentLoaded", function() {
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

  playButton.addEventListener('click', function() {
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

  video.ontimeupdate = function() {
    const percentagePosition = (100 * video.currentTime) / video.duration;
    timeline.style.backgroundSize = `${percentagePosition}% 100%`;
    timeline.value = percentagePosition;
  }

  timeline.addEventListener('change', function() {
    const time = (timeline.value * video.duration) / 100;
    video.currentTime = time;
  });

  soundButton.addEventListener('click', function() {
    video.muted = !video.muted;
    soundButton.innerHTML = video.muted ? mute : sound;
  });

  function createCharts() {
    const averageBillData = []
    let lastBill = endData && endData.bill ? parseInt(endData.bill) : 165
    const intervals = 10
    const yearsPerInterval = 2
    const pointsPerInterval = 4
    const totalPoints = intervals *
      pointsPerInterval
    const annualIncreaseRate = 0.037

    for (let point = 0; point <= totalPoints; point++) {
      const year = (point / pointsPerInterval) * yearsPerInterval
      if (point % pointsPerInterval === 0) {
        lastBill *= Math.pow(1 + annualIncreaseRate,
          yearsPerInterval)
      }
      const fluctuation = (Math.random() - 0.5) * 10;
      averageBillData.push({
        x: year,
        y: Math.max(150, lastBill + fluctuation)
      });
    }
    const solarBillRate = 165
    const solarBillData = Array.from({
      length: totalPoints + 1
    }, (_, i) => ({
      x: (i / pointsPerInterval) * yearsPerInterval,
      y: solarBillRate
    }));
    const totalDuration = 5000;
    const delayBetweenPoints = totalDuration / averageBillData.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y
    const animation = {
      x: {
        type: 'number',
        easing: 'easeInOutBounce',
        duration: delayBetweenPoints,
        from: NaN,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0
          }
          ctx.xStarted = true
          return ctx.index * delayBetweenPoints
        }
      },
      y: {
        type: 'number',
        easing: 'easeInOutBounce',
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0
          }
          ctx.yStarted = true
          return ctx.index * delayBetweenPoints
        }
      }
    }

    const options = {
      type: 'line',
      options: {
        responsive: true,
        animation,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Years Passed'
            },
            ticks: {
              callback: function(value) {
                if (value % 2 === 0)
                  return value;
              },
              stepSize: 2
            }
          },
          y: {
            min: 50,
            max: 400,
            stepSize: 50,
            title: {
              display: true,
              text: 'Bill Amount ($)'
            }
          }
        },
        plugins: {
          deferred: {
            xOffset: 100,
            yOffset: '50%',
            delay: 0
          },
          tooltip: {
            usePointStyle: true,
            callbacks: {
              title: function(context) {
                const startDate = new Date()
                const monthsToAdd = parseFloat(context[0].label) * 12
                startDate.setMonth(startDate.getMonth() + monthsToAdd)

                const month = startDate.toLocaleString('default', {
                  month: 'long'
                })
                const yearForX = startDate.getFullYear()
                const dateString = `${month} ${yearForX}`

                return dateString
              },
              label: function(context) {
                return `$${context.parsed.y.toFixed(2)}`;
              },
              labelPointStyle: function(context) {
                return {
                  pointStyle: false
                }
              }
            }
          },
          legend: {
            display: false,
            usePointStyle: true,
            pointStyle: 'line',
          }
        }
      }
    }
    const averageBillChart = new Chart(document.getElementById(
      'averageBillChart').getContext('2d'), {
      ...options,
      plugins: [ChartDeferred],
      data: {
        datasets: [{
          data: averageBillData,
          borderColor: '#E04D41',
          fill: false,
          pointStyle: false,
          tension: 0.4,
        }]
      }
    })

    const solarBillChart = new Chart(document.getElementById(
      'solarBillChart').getContext('2d'), {
      ...options,
      plugins: [ChartDeferred],
      data: {
        datasets: [{
          data: solarBillData,
          borderColor: '#00BA81',
          fill: false,
          pointStyle: false
        }]
      }
    });
    const combinedChart = new Chart(document.getElementById('combinedBillChart').getContext('2d'), {
      ...options,
      plugins: [ChartDeferred],
      data: {
        datasets: [{
            label: 'Without Solar',
            data: averageBillData,
            borderColor: '#E04D41',
            fill: false,
            pointStyle: false,
            tension: 0.4
          },
          {
            label: 'With Solar',
            data: solarBillData,
            borderColor: '#00BA81',
            fill: false,
            pointStyle: false
          }
        ]
      }

    })
  }

  function onIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // createCharts()
        observer.unobserve(entry.target)
      }
    })
  }

  let observer = new IntersectionObserver(onIntersection, {
    threshold: 0.5
  })

  document.addEventListener("DOMContentLoaded", () => {
    const factsElement = document.getElementById(
      'charts');
    if (factsElement) {
      console.log(
        "#charts element found. Starting to observe."
      )
      observer.observe(factsElement);
      createCharts()
    } else {
      console.error(
        'Element with ID #charts not found.');
    }
  })
  document.addEventListener('DOMContentLoaded', () => {
    const countUpElements = document.querySelectorAll('.count-up');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseFloat(element.textContent, 10); // Convert the text to a float
          element.textContent = '0'; // Reset the text to 0 without affecting the unit
          animateCountUp(element, 0, target, 2000); // Duration of 2000 ms
          observer.unobserve(element); // Stop observing after animating
        }
      });
    }, {
      threshold: 0.5 // Configure this value based on when you want the animation to start
    });

    countUpElements.forEach(element => {
      observer.observe(element);
    });

    function animateCountUp(elem, start, end, duration) {
      let startTime = null;
      const decimalPlaces = Math.max(
        (start.toString().split('.')[1] || '').length,
        (end.toString().split('.')[1] || '').length
      );

      // Easing function: easeOutQuad
      const easeOutQuad = t => t * (2 - t);

      const tick = currentTime => {
        if (!startTime) startTime = currentTime;
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutQuad(progress);

        const current = start + (end - start) * easedProgress;
        elem.textContent = current.toFixed(decimalPlaces); // Formats to fixed decimal places

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          elem.textContent = end.toFixed(decimalPlaces); // Ensure it ends on the exact target number
        }
      };

      requestAnimationFrame(tick);
    }
  });
  let map
  let geocoder

  function initLocal() {

    function waitForZip() {
      const data = endData
      if (data && data.zip) {
        initMap(endData.zip)
        fetchLocalData(endData.zip)
      } else {
        setTimeout(waitForZip, 100)
      }
    }

    waitForZip()
  }

  async function fetchLocalData(zipCode) {
    const url = `https://rk2ou3xhpk.execute-api.us-east-1.amazonaws.com/default/fetchPostal?zipCode=${zipCode}`;
    try {
      let stateCode;
      const response = await fetch(url);
      const resp_json = await response.json();
      const incentives = resp_json.incentives.data
      if (resp_json.carbon_offset_metric_tons) {
        stateCode = set_local_data(resp_json)
      } else {
        document.getElementById('localStats').style.display = 'none'
      }
      if (incentives) {
        setIncentives(incentives)
      } else {
        // document.getElementById('localIncentives').style.display = 'none'
      }
      document.querySelector('.local-focus').style.display = 'block'
      return resp_json;
    } catch (error) {
      document.querySelector('.local-focus').style.display = 'none'
      console.error("Error in fetch:", error);
    }
  }

  function formatMK(num) {
    if (num >= 1000000) {
      return {
        'num': (num / 1000000).toFixed(2),
        'suff': 'm'
      }
    } else if (num >= 1000) {
      return {
        'num': (num / 1000).toFixed(2),
        'suff': 'k'
      }
    } else {
      return {
        'num': num.toFixed(2),
        'suff': ''
      }
    }
  }

  async function setIncentives(incentives) {
    let table2List = document.querySelector('.table2_list')
    let templateItem = table2List.childNodes[0]
    let templateItemCom = table2List.childNodes[2]

    while (table2List.firstChild) {
      table2List.removeChild(table2List.firstChild)
    }

    incentives.sort((a, b) => {
      const sectorA = a.parameterSets[0] ? a.parameterSets[0].sectors[0].name : "--"
      const sectorB = b.parameterSets[0] ? b.parameterSets[0].sectors[0].name : "--"

      if (sectorA === sectorB) return 0;
      if (sectorA === "Residential") return -1
      if (sectorB === "Residential") return 1
      if (sectorA === "Commercial") return -1
      if (sectorB === "Commercial") return 1
      return 0
    });

    const residentialIncentives = incentives.filter(incentive => {
      return incentive.parameterSets[0] && incentive.parameterSets[0].sectors[0].name === "Residential" && incentive.websiteUrl;
    });

    const commercialIncentives = incentives.filter(incentive => {
      return incentive.parameterSets[0] && incentive.parameterSets[0].sectors[0].name === "Commercial" && incentive.websiteUrl;
    }).slice(0, 4)

    const unknownIncentives = incentives.filter(incentive => {
      return !incentive.parameterSets[0] || incentive.parameterSets[0].sectors[0].name === "--" && incentive.websiteUrl;
    }).slice(0, 3)

    document.querySelector('.incentivetotal').textContent = residentialIncentives.length + commercialIncentives.length + unknownIncentives.length - 1
    const sortedIncentives = [...residentialIncentives, ...commercialIncentives, ...unknownIncentives];

    sortedIncentives.forEach(incentive => {
      const inc_name = incentive.name
      const inc_type = incentive.typeObj.name
      const inc_sector = incentive.parameterSets[0] ? incentive.parameterSets[0].sectors[0].name : "--"
      const read_more_link = incentive.websiteUrl

      if (!read_more_link) {
        return
      }

      let temp_item = inc_sector === "Residential" ? templateItem.cloneNode(true) : templateItemCom.cloneNode(true)
      temp_item.childNodes[0].childNodes[0].textContent = inc_name
      inc_sector === "--" ? temp_item.querySelectorAll('.table2_column')[1].textContent = inc_sector : temp_item.childNodes[1].childNodes[0].textContent = inc_sector
      temp_item.childNodes[2].childNodes[0].textContent = inc_type
      temp_item.childNodes[3].childNodes[0].href = read_more_link

      table2List.appendChild(temp_item)
    })

    return true
  }


  function set_local_data(local_data) {
    const co2_tonnage = formatMK(local_data.carbon_offset_metric_tons)
    const tree_abatement = formatMK(local_data.carbon_offset_metric_tons / 0.039)
    const car_abatement = formatMK(local_data.carbon_offset_metric_tons / 4.73)
    document.getElementById('c02').childNodes[0].textContent = co2_tonnage.num
    document.getElementById('cars').childNodes[0].textContent = car_abatement.num
    document.getElementById('trees').childNodes[0].textContent = tree_abatement.num
    document.getElementById('c02').childNodes[1].textContent = co2_tonnage.suff
    document.getElementById('cars').childNodes[1].textContent = car_abatement.suff
    document.getElementById('trees').childNodes[1].textContent = tree_abatement.suff
  }

  function initMap(zipCode = '15203') {
    zipCode = document.getElementById('zip').textContent
    geocoder = new google.maps.Geocoder()
    let approximate_postcode = ''
    const mapOptions = {
      zoom: 6,
      mapTypeId: 'satellite',
      mapTypeControl: false,
      fullscreenControl: false,
      rotateControl: false,
      streetViewControl: false,
      zoomControl: false,
      center: {
        lat: -34.397,
        lng: 150.644
      }, // Default center, will change after geocoding
    }
    geocoder.geocode({
      'address': zipCode
    }, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location)
        approximate_postcode = results[0].address_components[0].long_name
        if (approximate_postcode) {
          const zips = [document.getElementById('zip'), document.getElementById('zip2'), document.getElementById('zip3')]
          zips.forEach((zip) => {
            zip.textContent = approximate_postcode
          })
        }
      } else {
        console.debug('Geocode was not successful for the following reason: ' + status);
      }
    });
    const map_container = document.getElementById('localMap')
    const default_map = map_container.childNodes[0]
    const map_div = document.createElement('div')
    map_div.style.width = '100%'
    map_div.style.height = 'auto'
    map_div.style.aspectRatio = '16/9'
    map_div.style.borderRadius = '1rem'
    map_div.style.border = 'none'
    default_map.style.display = 'none'
    map = new google.maps.Map(map_div, mapOptions)
    map_container.appendChild(map_div)

    return true
  }

  function setNames() {

  }

  function smoothZoom(map, targetZoom, duration) {
    let startZoom = map.getZoom()
    let step = (targetZoom - startZoom) / (duration / 50)
    let currentZoom = startZoom;
    let zoomInterval = setInterval(() => {
      if ((step > 0 && currentZoom >= targetZoom) || (step < 0 && currentZoom <= targetZoom)) {
        clearInterval(zoomInterval)
      } else {
        currentZoom += step
        map.setZoom(currentZoom)
      }
    }, 50)
  }

  function zoomToZipCode() {
    smoothZoom(map, 15, 5000);
  }

  function onIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        zoomToZipCode('15203')
        observer_two.unobserve(entry.target)
      }
    })
  }

  let observer_two = new IntersectionObserver(onIntersection, {
    threshold: 0.5
  })

  document.addEventListener("DOMContentLoaded", () => {
    initLocal()
    const factsElement = document.getElementById(
      'local');
    if (factsElement) {
      console.log(
        "#maps element found. Starting to observe."
      )
      observer_two.observe(factsElement);
    } else {
      console.error(
        'Element with ID #localMap not found.');
    }
  })

  function waitForEndData() {
    return new Promise((resolve, reject) => {
      const checkData = () => {
        const data = endData
        if (data && data.survey) {
          resolve(data)
        } else {
          setTimeout(checkData, 100)
        }
      };
      checkData()
    })
  }


  let base_inputs = []
  let current_inputs = []
  document.addEventListener("DOMContentLoaded", async () => {
    const queryParams = new URLSearchParams(window.location.search)
    const surveySelects = document.querySelectorAll('#survey select')
    const handleSelectChange = (event) => {
      const selectedIndex = event.target.selectedIndex
      const selectIndex = Array.from(surveySelects).indexOf(event.target)
      current_inputs[selectIndex] = selectedIndex
      endData ? endData.survey[selectIndex] = selectedIndex : ''
      videoClips = ['Intro.mp4', ...current_inputs.map((ans, i) => `Q${i+1}A${ans}.mp4`),
        'Outro.mp4'
      ]
      displaySelectedAnswer(selectIndex + 1, selectedIndex)

    };

    surveySelects.forEach(select => {
      select.addEventListener('change', handleSelectChange)
    })

    await setBaseSelectInputs()
    document.getElementById('random').addEventListener('click', randomizeSelectInputs)
    document.getElementById('reset').addEventListener('click', resetSelectedInputs)
    if (queryParams.get("admin") || queryParams.get('id') === 'admin') {
      document.getElementById('survey').style.display = 'block'
    }
  })

  function displaySelectedAnswer(questionNumber, selectedAnswer) {
    const questionSection = document.getElementById(`q${questionNumber}`);
    if (questionSection) {
      const answerDivs = questionSection.childNodes
      let currentVisibleAnswer = null
      answerDivs.forEach(div => {
        if (div.style.display === 'block') {
          currentVisibleAnswer = parseInt(div.getAttribute('answer'))
        }
        div.style.display = 'none'
      })
      if (currentVisibleAnswer !== selectedAnswer) {
        const selectedDiv = questionSection.querySelector(`div[answer="${selectedAnswer}"]`)
        if (selectedDiv) {
          selectedDiv.style.display = 'block'
        }
      }
    }
  }
  async function setBaseSelectInputs() {
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get('id') && queryParams.get('id') !== 'admin') {
      const base_data = await waitForEndData()
      base_inputs = [...base_data.survey]
      current_inputs = [...base_data.survey]
      document.querySelectorAll('#survey select').forEach((select, index) => {
        if (index < base_inputs.length) {
          select.selectedIndex = base_inputs[index] + 1
        }
      })
    } else {
      base_inputs = randomizeSelectInputs()
      loadAndPlayVideos(base_inputs)
      initMap()
      fetchLocalData("15203")
      document.getElementById('reset').style.display = 'none'
    }
  }

  function resetSelectedInputs() {
    const surveySelects = document.querySelectorAll('#survey select')
    surveySelects.forEach((select, index) => {
      if (index < base_inputs.length) {
        select.selectedIndex = base_inputs[index] + 1
        select.dispatchEvent(new Event('change'))
      }
    })
    current_inputs = [...base_inputs]
  }

  function randomizeSelectInputs() {
    let new_inputs = []
    const surveySelects = document.querySelectorAll('#survey select')

    surveySelects.forEach(select => {
      const optionsCount = select.options.length - 1
      const randomIndex = Math.floor(Math.random() * optionsCount)
      select.selectedIndex = randomIndex + 1
      new_inputs.push(randomIndex)
      select.dispatchEvent(new Event('change'))
    })
    current_inputs = new_inputs
    return new_inputs
  }
};