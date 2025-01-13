  

  const nextButton = document.getElementById("next-button");
  const uploadedImages = [];
  
    nextButton.addEventListener("click", () => {

      const time = document.getElementById("seconds").value;
      sessionStorage.setItem("time", time);

      const savedFolders = JSON.parse(localStorage.getItem('folders')) || [];
      savedFolders.forEach((folderData, index) => {

        const folder = document.getElementById(`folder-${index + 1}`);
        const imagesContainer = folder.querySelector('.images');
          if (getComputedStyle(imagesContainer).display === 'block') {
            folderData.images.forEach((imageSrc) => {
            uploadedImages.push(imageSrc);
        });
          }
        
      });
        /*for (let i = 0; i < folderCount; i++) {
          const folderId = `folder-${i + 1}`;
          console.log(folderId);
          const folder = document.getElementById(folderId);
          const imagesContainer = folder.querySelector('.images');
          if (imagesContainer.style.display === 'block') {
            save
          }
        }*/
      sessionStorage.setItem("images", JSON.stringify(uploadedImages));
      window.location.href = "page2.html"; // Zur zweiten Seite navigieren
    });

  class folder {
    constructor(name, images, id, onDisplay) {
      this.id = id;
      this.name = name;
      this.images = images;
      onDisplay = true;
    }
  }

  let folderCount = 0;

    // Lade gespeicherte Daten beim Start
    window.onload = () => {
      const savedFolders = JSON.parse(localStorage.getItem('folders')) || [];
      savedFolders.forEach((folderData, index) => {
        createFolder(false); // Ordner erstellen
        const folder = document.getElementById(`folder-${index + 1}`);
        folderData.images.forEach((imageSrc) => {
          addImageToFolder(folder, imageSrc);
        });
      });
    };

    function createFolder(save = true) {
      const folderContainer = document.getElementById('folderContainer');
      folderCount++;
      //let folderDataElement= new folder
      const folderElement = document.createElement('div');
      folderElement.className = 'folder';
      folderElement.id = `folder-${folderCount}`;
      folderElement.innerHTML = `
        <input class="file" id="${folderElement.id}" type="text" id="name" placeholder="New Folder">
        <i class="fa fa-trash-o" onclick="deleteFolder('${folderElement.id}')"></i>
        <input class"file" type="file" multiple accept="image/*" onchange="uploadImages(event, '${folderElement.id}')">
        <div class="images"></div>`;

      folderElement.querySelector(`#${folderElement.id}`).addEventListener('click', () => toggleImages(folderElement.id));
        
      folderContainer.appendChild(folderElement);

      if (save) saveFolders(); // Speicher die neue Struktur
    }

    function uploadImages(event, folderId) {
      
      const folder = document.getElementById(folderId);
      const imagesContainer = folder.querySelector('.images');
    
      Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const imgSrc = reader.result;
          console.log(imgSrc);
          //const imgSrc = reader.result;
          addImageToFolder(folder, imgSrc);
          saveFolders(); // Speicher die neuen Bilder
        };
        reader.readAsDataURL(file);
      });
    }

    function addImageToFolder(folder, imgSrc) {
      const imagesContainer = folder.querySelector('.images');
      const img = document.createElement('img');
      img.src = imgSrc;
      img.className = 'image';
      imagesContainer.appendChild(img);
    }

    function toggleImages(folderId) {
      const folder = document.getElementById(folderId);
      const imagesContainer = folder.querySelector('.images');
      imagesContainer.style.display = imagesContainer.style.display === 'none' ? 'block' : 'none';
    }

    function deleteFolder(folderId) {
      const folder = document.getElementById(folderId);
      folder.remove();
      saveFolders(); // Speicher die neue Struktur
      //folderCount--;
    }

    function saveFolders() {
      const folders = [];
      document.querySelectorAll('.folder').forEach(folder => {
        const images = Array.from(folder.querySelectorAll('.image')).map(img => img.src);
        folders.push({ images });
      });
      localStorage.setItem('folders', JSON.stringify(folders));
    }
  