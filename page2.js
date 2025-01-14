    
  const imageContainer = document.getElementById("image-container");
  const storedImages = sessionStorage.getItem("images");
  let unusedImages;
  let usedImagesInOrder = [];
  let movementActive = false;
  const rightTreshold = 20; 
  const wrongTreshold = -20;
  const deadZoneOne = 75; 
  const deadZoneTwo = -75;
  let results = [];
  let time = sessionStorage.getItem("time"); 
  let interval;
  let totalImages = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let correctAnswersInARow = 0;
  let streak = 0;
  let timeForCorrectAnswersInARow = 0;
  let streakTime = 0;
  let logestTimeForCorrectAnswer = 0; 
  let timeForCurrentImage = 0;
  let imageTimeStart = 0; 
  let totalTimeCorrectAnswers = 0;
  let fastestTime = Infinity;

  
  if (!time || time < 0) {
    time = 120;
  }


  if (storedImages) {
    unusedImages = JSON.parse(storedImages);
  } else {
    imageContainer.textContent = "Keine Bilder verfügbar.";
  }

  document.addEventListener("DOMContentLoaded", () => {
    start();  
  });

  function getRandomImage() {
    if (unusedImages.length > 0 && usedImagesInOrder.length < unusedImages.length) {
      const images = unusedImages;
      const img = document.createElement("img");
      let randomImage;
      do {
        randomImage = images[randomNumber(images.length - 1)]
      } while (usedImagesInOrder.includes(randomImage));
      img.src = randomImage
      usedImagesInOrder.push(randomImage);
      return img; 
    } else {
      clearInterval(interval);
      countDownElement.innerHTML = "";
      showResults();
    }    
  }
  
  function randomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  function askPermission() {

    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission().then(response => {
          if (response == 'granted') {
            getSensorData();
          }
        });
    } else {
      getSensorData();
    }
  }

  function getSensorData() {

    window.addEventListener('deviceorientation', (event) => {

      rotation_degrees = event.alpha;
      frontToBack_degrees = event.beta;
      leftToRight_degrees = event.gamma;

      if (rotation_degrees == null || frontToBack_degrees == null || leftToRight_degrees == null) {
        imageContainer.textContent = "Keine Sensor Daten erkannt.";
      }
    

      if (!movementActive && leftToRight_degrees < rightTreshold && leftToRight_degrees > 0) {
        movementActive = true;
        rightAnswer();
        changeImage();
      } else if (!movementActive && leftToRight_degrees > wrongTreshold && leftToRight_degrees < 0) {
        movementActive = true;
        wrongAnswer();
        changeImage();
      }

      if (movementActive && (leftToRight_degrees > deadZoneOne || leftToRight_degrees < deadZoneTwo)) {
        movementActive = false;
      }
    });
  }

  function changeImage() {
    imageContainer.innerHTML = "";
    const img = getRandomImage();
    imageContainer.appendChild(img);
  }

  function rightAnswer() {
    const time = (new Date().getTime() - imageTimeStart) / 1000;
    imageTimeStart = new Date().getTime();
    results.push(true);
    streakTime += time;
    totalImages++;
    correctAnswers++;
    correctAnswersInARow++;
    timeForCorrectAnswersInARow += time;
    logestTimeForCorrectAnswer = Math.max(logestTimeForCorrectAnswer, time);
    totalTimeCorrectAnswers += time;
    fastestTime = Math.min(fastestTime, time);
  }

  function wrongAnswer() {
    results.push(false);
    totalImages++;
    wrongAnswers++;
    streak = Math.max(streak, correctAnswersInARow);
    correctAnswersInARow = 0; 
    streakTime = Math.max(streakTime, timeForCorrectAnswersInARow);
    timeForCorrectAnswersInARow = 0;
  }
  
  function start() {
    
    askPermission();

    imageTimeStart = new Date().getTime();
    const img = getRandomImage();
    imageContainer.appendChild(img);
    let countDownOne = time;
    const countDownElement = document.getElementById("countdown");
    countDownElement.innerHTML = countDownOne;
    interval = setInterval(() => {
      countDownOne--;
      countDownElement.innerHTML = countDownOne;
      if (countDownOne == 0) {
        countDownElement.innerHTML = "";
        clearInterval(interval);
        showResults();
      }
    }, 1000);
  }

  function showResults() {
    imageContainer.remove();
    var resultElement = document.getElementsByClassName("resultTable")[0];
    var correctAnswersDiv = document.createElement("div");
    correctAnswersDiv.innerHTML = correctAnswers + " von " + totalImages + " richtig";
    resultElement.appendChild(correctAnswersDiv);
    var streakDiv = document.createElement("div");
    streakDiv.innerHTML = "Längste Serie: " + streak + " in " + streakTime + "s";
    resultElement.appendChild(streakDiv);
    var longestTimeDiv = document.createElement("div");
    longestTimeDiv.innerHTML = "Längste Zeit für eine richtige Antwort: " + logestTimeForCorrectAnswer + "s";
    resultElement.appendChild(longestTimeDiv);
    var fastestTimeDiv = document.createElement("div");
    fastestTimeDiv.innerHTML = "Schnellste Zeit für eine richtige Antwort: " + fastestTime + "s";
    resultElement.appendChild(fastestTimeDiv);
    var averageTimeDiv = document.createElement("div");
    averageTimeDiv.innerHTML = "Durchschnittliche Zeit für eine richtige Antwort: " + totalTimeCorrectAnswers / correctAnswers + "s";
    resultElement.appendChild(averageTimeDiv);
    for (let i = 0; i < results.length; i++) {
      var result = document.createElement("div"); 
      result.style.border =`5px solid ${results[i] ? "green" : "red"}`;
      const img = document.createElement("img");
      img.src = usedImagesInOrder[i];
      result.appendChild(img);
      resultElement.appendChild(result);
    }
  }

  