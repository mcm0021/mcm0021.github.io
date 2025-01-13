    
  const imageContainer = document.getElementById("image-container");
  //imageContainer.remove();
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

  
  if (!time) {
    time = 120;
  }


  if (storedImages) {
    console.log("wird ausgeführt");
    unusedImages = JSON.parse(storedImages);
  } else {
    imageContainer.textContent = "Keine Bilder verfügbar.";
  }

  start();  
  

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
      return "Keine Bilder verfügbar.";
    }    
  }
  
  function randomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  function askPermission() {
        //console.log("Permission requested.");
    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
  
        DeviceMotionEvent.requestPermission().then(response => {
          if (response == 'granted') {
            getSensorData();
            document.getElementById("alpha").innerHTML = "permitted";
          } else {
            document.getElementById("alpha").innerHTML = "not permitted";
          }
        });
    } else {
      getSensorData();
    }
  }

  function getSensorData() {

    window.addEventListener('deviceorientation', (event) => {
      rotation_degrees = event.alpha;
      //document.getElementById("alpha").innerHTML = "permitted";
      //document.getElementById("alpha").innerHTML = "Rotation: " + rotation_degrees;
      frontToBack_degrees = event.beta;
      //document.getElementById("beta").innerHTML = "Front to back: " + frontToBack_degrees;
      leftToRight_degrees = event.gamma;
      document.getElementById("gamma").innerHTML = "Left to right: " + leftToRight_degrees;

      if (rotation_degrees == null || frontToBack_degrees == null || leftToRight_degrees == null) {
        imageContainer.textContent = "Keine Sensor Daten erkannt.";
      }
    

      if (!movementActive && leftToRight_degrees < rightTreshold && leftToRight_degrees > 0) {
        movementActive = true;
        document.getElementById("gyro").innerHTML = "Right";
        rightAnswer();
        changeImage();
      } else if (!movementActive && leftToRight_degrees > wrongTreshold && leftToRight_degrees < 0) {
        movementActive = true;
        document.getElementById("gyro").innerHTML = "Wrong";
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
    const time = new Date().getTime() - imageTimeStart;
    results.push(true);
    totalImages++;
    correctAnswers++;
    correctAnswersInARow++;
    timeForCorrectAnswersInARow += time;
    Math.max(logestTimeForCorrectAnswer, time);
  }

  function wrongAnswer() {
    results.push(false);
    totalImages++;
    wrongAnswers++;
    streak = Math.max(streak, correctAnswersInARow);
    streakTime = Math.max(streakTime, timeForCorrectAnswersInARow);
    correctAnswersInARow = 0;
  }
  
  function start() {
    imageTimeStart = new Date().getTime();
    const img = getRandomImage();
    imageContainer.appendChild(img);
    let countDownOne = time;
    const countDownElement = document.getElementById("countdown");
    countDownElement.innerHTML = countDownOne;
    const interval = setInterval(() => {
      countDownOne--;
      countDownElement.innerHTML = countDownOne;
      if (countDownOne == 0) {
        countDownElement.innerHTML = "";
        clearInterval(interval);
        imageContainer.remove();
      }
    }, 1000);
  }

  /*function countDown(seconds) {
    let countDownTwo = seconds;
    const countDownElement = document.getElementById("countdown");
    countDownElement.innerHTML = countDownTwo;
    const interval = setInterval(() => {
      countDownTwo--;
      countDownElement.innerHTML = countDownTwo;
      if (countDownTwo == 0) {
        countDownElement.innerHTML = "";
        clearInterval(interval); 
      }
    }, 1000);
  }*/

  function showResults() {
    imageContainer.remove();
    const countDownElement = document.getElementById("countdown");
    countDownElement.remove();
    const resultElement = document.getElementById("results");
    const resultText = document.createElement("p");
    resultText.textContent = "Ergebnisse:";
    resultElement.appendChild(resultText);
    const correctAnswersElement = document.createElement("p");
    correctAnswersElement.textContent = "Richtige Antworten: " + correctAnswers + " von " + totalImages;
    resultElement.appendChild(correctAnswersElement);
    const wrongAnswersElement = document.createElement("p");
  }

  