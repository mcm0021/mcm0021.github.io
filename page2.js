    
  const imageContainer = document.getElementById("image-container");
  const storedImages = sessionStorage.getItem("images");
  let images;
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
    images = JSON.parse(storedImages);
  } else {
    imageContainer.textContent = "No images selected";
  }

  document.addEventListener("DOMContentLoaded", () => {
    start();  
  });

  //Selects a random image from the unused images from the local storage
  function getRandomImage() {

    const img = document.createElement("img");
    let randomImage;
    do {
      randomImage = images[randomNumber(images.length - 1)]
    } while (usedImagesInOrder.includes(randomImage));
    img.src = randomImage
    usedImagesInOrder.push(randomImage);
    return img;
  }
  
  //Returns a random number between 0 and the given max
  function randomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  //Only necassary on IOS to get the sensor data
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
 
  //Receives the sensor data and checks if the device is tilted to the right or left respectively in our case up or down
  //If movement is detected the correct or wrong answer is processed and the image is changed
  //After this the device has to be in a neutral position to detect the next movement
  function getSensorData() {
    
    window.addEventListener('deviceorientation', (event) => {

      rotation_degrees = event.alpha;
      frontToBack_degrees = event.beta;
      leftToRight_degrees = event.gamma;

      if (rotation_degrees == null || frontToBack_degrees == null || leftToRight_degrees == null) {
        imageContainer.textContent = "No sensor data";
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

  const result = false; 
  //Changes the image 
  function changeImage() {
    
    if (!result && totalImages >= images.length) {
      result = true;
      document.getElementById("countdown").innerHTML = "";
      clearInterval(interval);
      showResults();
      return;
    }
    ima
    geContainer.innerHTML = "";
    const img = getRandomImage();
    imageContainer.appendChild(img);
  }

  //Actions when a correct answer is detected
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

  //Actions when a wrong answer is detected 
  function wrongAnswer() {
    results.push(false);
    totalImages++;
    wrongAnswers++;
    streak = Math.max(streak, correctAnswersInARow);
    correctAnswersInARow = 0; 
    streakTime = Math.max(streakTime, timeForCorrectAnswersInARow);
    timeForCorrectAnswersInARow = 0;
  }
  
  //Starts the game
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

  //Shows the results
  function showResults() {
    imageContainer.remove();
    var resultElement = document.getElementsByClassName("resultTable")[0];
    var correctAnswersDiv = document.createElement("div");
    correctAnswersDiv.innerHTML = correctAnswers + " out of " + totalImages + " correct";
    resultElement.appendChild(correctAnswersDiv);
    var streakDiv = document.createElement("div");
    streakDiv.innerHTML = "Longest: " + streak + " in " + streakTime + "s";
    resultElement.appendChild(streakDiv);
    var longestTimeDiv = document.createElement("div");
    longestTimeDiv.innerHTML = "Longest time for correct answer: " + logestTimeForCorrectAnswer + "s";
    resultElement.appendChild(longestTimeDiv);
    var fastestTimeDiv = document.createElement("div");
    fastestTimeDiv.innerHTML = "Fastest time for correct answer: " + fastestTime + "s";
    resultElement.appendChild(fastestTimeDiv);
    var averageTimeDiv = document.createElement("div");
    averageTimeDiv.innerHTML = "Average timer for correct answer: " + totalTimeCorrectAnswers / correctAnswers + "s";
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

  