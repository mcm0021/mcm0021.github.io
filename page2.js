    
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

  
  if (time) {
    countDown(time);
  } else {
    time = 120; 
  }

  if (storedImages) {
    console.log("wird ausgeführt");
    unusedImages = JSON.parse(storedImages);

    /*images.forEach((imageData) => {
      const img = document.createElement("img");
      img.src = imageData;
      img.alt = "Hochgeladenes Bild";
      img.style.maxWidth = "200px";
      img.style.margin = "10px";
      imageContainer.appendChild(img);
    });*/
    //const img = getRandomImage();
    //imageContainer.appendChild("");
    askPermission();
  } else {
    imageContainer.textContent = "Keine Bilder verfügbar.";
  }
  

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
        console.log("Permission requested.");
    //if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
  
        DeviceMotionEvent.requestPermission().then(response => {
          if (response == 'granted') {
            getSensorData();
          }
        });
    //}
  }

  function getSensorData() {
    window.addEventListener('deviceorientation', (event) => {
      rotation_degrees = event.alpha;
      document.getElementById("alpha").innerHTML = "Rotation: " + rotation_degrees;
      frontToBack_degrees = event.beta;
      document.getElementById("beta").innerHTML = "Front to back: " + frontToBack_degrees;
      leftToRight_degrees = event.gamma;
      document.getElementById("gamma").innerHTML = "Left to right: " + leftToRight_degrees;

      if (rotation_degrees == null || frontToBack_degrees == null || leftToRight_degrees == null) {
        imageContainer.textContent = "Keine Sensor Daten erkannt.";
      } else {
        start();
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
    
    imageContainer.removeChild(imageContainer.firstChild);
    const img = getRandomImage();
    imageContainer.appendChild(img);
  }

  function rightAnswer() {
    const time = new Date().now.getTime() - imageTimeStart;
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
    if (countDown(5)) {
      const img = getRandomImage();
      imageContainer.appendChild(img);
      imageTimeStart = new Date().now.getTime();
      if (countDown(time)) {
        //showResults();
      }
    }
  }

  function countDown(time) {
    let countDown = time;
    const countDownElement = document.getElementById("countdown");
    countDownElement.innerHTML = countDown;
    const interval = setInterval(() => {
      countDown--;
      countDownElement.innerHTML = countDown;
      if (countDown == 0) {
        countDownElement.innerHTML = "";
        clearInterval(interval);
        return true; 
      }
    }, 1000);
  }

  function startThreeSecondsCountDown() {
    let countDown = 5;
    const countDownElement = document.getElementById("countdown");
    countDownElement.innerHTML = countDown;
    const interval = setInterval(() => {
      countDown--;
      countDownElement.innerHTML = countDown;
      if (countDown == 0) {
        countDownElement.innerHTML = "";
        clearInterval(interval);
        
      }
    }, 1000);
  }



  /*function getGyro() {
    DeviceOrientationEvent.requestPermission().then(response => {
      if (response == 'granted') {
        window.addEventListener('deviceorientation', (event) => {
          rotation_degrees = event.alpha;
          frontToBack_degrees = event.beta;
          leftToRight_degrees = event.gamma;
          if (frontToBack_degrees > treshold) {
            document.getElementById("gyro").innerHTML = "Front to back: " + frontToBack_degrees;
          } else if (leftToRight_degrees > treshold) {
            document.getElementById("gyro").innerHTML = "Left to right: " + leftToRight_degrees;
          } else {
            document.getElementById("gyro").innerHTML = "No movement detected.";
          }
        })
      }
    })
  }
  
  function getGyro() {
    DeviceOrientationEvent.requestPermission().then(response => {
      if (response == 'granted') {
        let gyro = new Gyroscope({ frequency: 60 });
        gyro.addEventListener("reading", e => {
          document.getElementById("gyro").innerHTML = "Angular velocity along the X-axis " + gyro.x; 
        });
        gyro.start();
        document.getElementById("gyro").innerHTML = "Gyroscope is supported.";
      } else {
        document.getElementById("gyro").innerHTML = "Gyroscope permission denied.";
      }
    });
  }

  function askPermission() {
    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission();
    }
  }



  let gyro = new Gyroscope({ frequency: 60 });

  if (gyro != null) {
     gyro.addEventListener("reading", e => {
    console.log("yeah");
    console.log("Angular velocity along the X-axis " + gyro.x);
    console.log("Angular velocity along the Y-axis " + gyro.y);
    console.log("Angular velocity along the Z-axis " + gyro.z);
  });
  gyro.start();
  document.getElementById("gyro").innerHTML = "Gyroscope is supported.";
  } else {
    document.getElementById("gyro").innerHTML = "Gyroscope is not supported.";
  }

  if ("DeviceOrientationEvent" in window) {
    window.addEventListener("deviceorientation", function(event) {
      console.log("Alpha: " + event.alpha); // Drehung um die Z-Achse
      console.log("Beta: " + event.beta);   // Drehung um die X-Achse
      console.log("Gamma: " + event.gamma); // Drehung um die Y-Achse
    });
  } else {
    console.log("Gyroskop ist nicht verfügbar.");
  }*/
  
 