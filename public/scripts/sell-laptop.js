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