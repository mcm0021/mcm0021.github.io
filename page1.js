  const nextButton = document.getElementById("next-button");
  const uploadedImages = [];
  let folderCount = 0;

    //Navigates to the game page and saves the time and the selected images
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
      sessionStorage.setItem("images", JSON.stringify(uploadedImages));
      window.location.href = "page2.html";
    });

    //Loads the images from the local storage
    window.onload = () => {
      const savedFolders = JSON.parse(localStorage.getItem('folders')) || [];
      savedFolders.forEach((folderData, index) => {
        createFolder(false); 
        const folder = document.getElementById(`folder-${index + 1}`);
        folderData.images.forEach((imageSrc) => {
          addImageToFolder(folder, imageSrc);
        });
      });
    };

    //Creates a new folder
    function createFolder(save = true) {
      const folderContainer = document.getElementById('folderContainer');
      folderCount++;
      const folderElement = document.createElement('div');
      folderElement.className = 'folder';
      folderElement.id = `folder-${folderCount}`;
      folderElement.innerHTML = `
        <input id="text" type="text" placeholder="New Folder">
        <i class="fa fa-trash-o" onclick="deleteFolder('${folderElement.id}')"></i>
        <label>
          Add Images
        <input class="file" type="file" multiple accept="image/*" onchange="uploadImages(event, '${folderElement.id}')">
        </label>
        <div id="${folderElement.id}" >
          Hide/Choose
        <div class="images"></div>`;

      folderElement.querySelector(`#${folderElement.id}`).addEventListener('click', () => toggleImages(folderElement.id));
      folderContainer.appendChild(folderElement);

      if (save) saveFolders(); 
    }

    //Uploads the images to the folder
    function uploadImages(event, folderId) {
      
      const folder = document.getElementById(folderId);
      const imagesContainer = folder.querySelector('.images');
    
      Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const imgSrc = reader.result;
          addImageToFolder(folder, imgSrc);
          saveFolders(); 
        };
        reader.readAsDataURL(file);
      });
    }

    //Adds the image to the folder
    function addImageToFolder(folder, imgSrc) {
      const imagesContainer = folder.querySelector('.images');
      const img = document.createElement('img');
      img.src = imgSrc;
      img.className = 'image';
      imagesContainer.appendChild(img);
    }

    //Toggles the images of one folder on and off
    function toggleImages(folderId) {
      const folder = document.getElementById(folderId);
      const imagesContainer = folder.querySelector('.images');
      imagesContainer.style.display = imagesContainer.style.display === 'none' ? 'block' : 'none';
    }

    //Removes the folder from the page and its content from the local storage
    function deleteFolder(folderId) {
      const folder = document.getElementById(folderId);
      folder.remove();
      saveFolders();
    }

    //Save the folders in the local storage
    function saveFolders() {
      const folders = [];
      document.querySelectorAll('.folder').forEach(folder => {
        const images = Array.from(folder.querySelectorAll('.image')).map(img => img.src);
        folders.push({ images });
      });
      localStorage.setItem('folders', JSON.stringify(folders));
    }
  