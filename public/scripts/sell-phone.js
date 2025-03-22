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
});