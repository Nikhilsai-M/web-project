document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem("loggedInUser");
    let profileIcon = document.getElementById("profile-icon");
    let loginLink = document.getElementById("login-link");
    let profileMenu = document.getElementById("profile-menu");
    let welcomeMessage = document.getElementById("welcome-message");
    let logoutButton = document.getElementById("logout-button");
    let closeMenu = document.getElementById("close-menu");

    if (user) {
        // If logged in
        loginLink.style.display = "none"; // Hide "Sign in"
        profileIcon.style.cursor = "pointer";
        welcomeMessage.textContent = `Welcome, ${user}`;
        profileIcon.addEventListener("click", function () {
            profileMenu.classList.add("active");
        });

        closeMenu.addEventListener("click", function () {
            profileMenu.classList.remove("active");
        });

        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            window.location.reload(); // Reset UI
        });
    } else {
        profileIcon.style.display = "none"; // Hide profile icon when not logged in
    }
});
