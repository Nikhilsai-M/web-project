document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('laptopSellForm'); // Ensure this matches the form ID in your sell-laptop.ejs

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Create FormData object for file uploads
            const formData = new FormData(form);

            // Log form data (for debugging)
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            try {
                // Send form data to server
                const response = await fetch('/api/sell-laptop', {
                    method: 'POST',
                    body: formData, // Send the FormData directly
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
});

const input = document.getElementById('device-image');
const fileName = document.getElementById('file-name');

input.addEventListener('change', () => {
  if (input.files.length > 0) {
    fileName.textContent = input.files[0].name;
  } else {
    fileName.textContent = "No file chosen";
  }
});

//image preview
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');

input.addEventListener('change', () => {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    fileName.textContent = file.name;
    fileName.style.color = '#007bff';

    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    fileName.textContent = "No file chosen";
    imagePreview.style.display = 'none';
  }
});
