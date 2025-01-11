    
    const imageContainer = document.getElementById("image-container");
    const storedImages = sessionStorage.getItem("images");
    let movementActive = false;
    const rightTreshold = 20; 
    const wrongTreshold = -20;
    const deadZoneOne = 75; 
    const deadZoneTwo = -75;
  
    if (storedImages) {
      const images = JSON.parse(storedImages);
      /*images.forEach((imageData) => {
        const img = document.createElement("img");
        img.src = imageData;
        img.alt = "Hochgeladenes Bild";
        img.style.maxWidth = "200px";
        img.style.margin = "10px";
        imageContainer.appendChild(img);
      });*/
      const img = document.createElement("img");
      img.src = images[randomNumber(images.length - 1)];
      imageContainer.appendChild(img);
    } else {
      imageContainer.textContent = "Keine Bilder verfügbar.";
    }
  
  
  function randomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  function askPermission(){
    if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission();
    }
  }

  function getGyro() {
    askPermission();
    window.addEventListener('deviceorientation', (event) => {
      rotation_degrees = event.alpha;
      document.getElementById("alpha").innerHTML = "Rotation: " + rotation_degrees;
      frontToBack_degrees = event.beta;
      document.getElementById("beta").innerHTML = "Front to back: " + frontToBack_degrees;
      leftToRight_degrees = event.gamma;
      document.getElementById("gamma").innerHTML = "Left to right: " + leftToRight_degrees;

      if (!movementActive && leftToRight_degrees < rightTreshold && leftToRight_degrees > 0) {
        document.getElementById("gyro").innerHTML = "Right";
        movementActive = true;
      } else if (!movementActive && leftToRight_degrees > wrongTreshold && leftToRight_degrees < 0) {
        document.getElementById("gyro").innerHTML = "Wrong";
        movementActive = true;
      }

      if (movementActive && (leftToRight_degrees > deadZoneOne || leftToRight_degrees < deadZoneTwo)) {
        movementActive = false;
      }
    })
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
  
 