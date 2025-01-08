// Logout button click event
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Clear any user data saved in the frontend (like session or local storage)
        localStorage.removeItem('userEmail'); // Example of removing data from localStorage
        
        // Optionally, you can clear other things like sessionStorage, cookies, etc.
        sessionStorage.removeItem('userEmail'); // Example of removing data from sessionStorage

        // Update the UI (you can show the sign-in button, hide the user info, etc.)
        displayLoggedOutState();

        // Redirect to the login page
        window.location.href = '/login.html'; // Change this to your login page
    });
}

// Display logged-out state (hide user info, show sign-in button)
function displayLoggedOutState() {
    if (userInfo) {
        userInfo.style.display = 'none';
    }
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
    if (signInBtn) {
        signInBtn.style.display = 'inline-block'; // Show sign-in button if you have one
    }
}
