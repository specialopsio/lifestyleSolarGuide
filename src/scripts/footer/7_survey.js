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
  if(queryParams.get("admin") || queryParams.get('id') === 'admin'){
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
  async function setBaseSelectInputs(){
    const queryParams = new URLSearchParams(window.location.search)
    if(queryParams.get('id') && queryParams.get('id') !== 'admin'){
      const base_data = await waitForEndData()
      base_inputs = [...base_data.survey]
      current_inputs = [...base_data.survey]
      document.querySelectorAll('#survey select').forEach((select, index) => {
        if(index < base_inputs.length){
          select.selectedIndex = base_inputs[index] + 1
        }
      })
    } else {
      base_inputs = randomizeSelectInputs()
      loadAndPlayVideos(base_inputs)
      initMap()
      fetchLocalData("15203")
      createCharts()
      document.getElementById('reset').style.display = 'none'
    }
  }
  
  function resetSelectedInputs(){
    const surveySelects = document.querySelectorAll('#survey select')
    surveySelects.forEach((select, index) => {
      if(index < base_inputs.length){
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