document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Retrieve stored user data from localStorage
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (username === storedUsername && password === storedPassword) {
        // Login successful
        localStorage.setItem("isLoggedIn", "true"); // Set login status
        localStorage.setItem("name", username); // Set the user's name
        window.location.href = "index.html"; // Redirect to homepage
    } else {
        // Login failed
        errorMessage.textContent = "Invalid username or password. Please try again.";
    }
});