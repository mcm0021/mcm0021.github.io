document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const nextButton = document.getElementById("next-button");
  
    // Speichert die hochgeladenen Bilder
    const uploadedImages = [];
  
    fileInput.addEventListener("change", (event) => {
      const files = event.target.files;
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          uploadedImages.push(reader.result); // Base64-Daten speichern
          console.log("Bild hochgeladen:", reader.result);
        };
        reader.readAsDataURL(file); // Bild in Base64 konvertieren
      });
    });
  
    nextButton.addEventListener("click", () => {
      if (uploadedImages.length > 0) {
        sessionStorage.setItem("images", JSON.stringify(uploadedImages));
      }
      window.location.href = "page2.html"; // Zur zweiten Seite navigieren
    });
  });
  