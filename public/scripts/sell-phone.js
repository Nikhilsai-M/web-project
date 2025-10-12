document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('phone-selling-form');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      // Log form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      try {
        const response = await fetch('/api/sell-phone', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          window.location.href = '/listings';
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please try again later.');
      }
    });
  }
<<<<<<< HEAD
=======
});

const fileInput = document.getElementById("device-image");
const fileName = document.getElementById("file-name");
const previewBox = document.getElementById("image-preview");
const previewImg = document.getElementById("preview-img");

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        fileName.textContent = `File selected: ${file.name}`;
        const reader = new FileReader();
        reader.onload = (event) => {
            previewImg.src = event.target.result;
            previewBox.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        fileName.textContent = "No file chosen";
        previewBox.style.display = "none";
        previewImg.src = "";
    }
>>>>>>> 5d58b6310197f69d572bb914d8144818d95747cd
});