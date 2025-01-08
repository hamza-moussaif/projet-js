    // Menu toggle
    let menu = document.querySelector('#menu-icon');
    let navbar = document.querySelector('.navbar');

    menu.onclick = () => {
        menu.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };

    window.onscroll = () => {
        menu.classList.remove('bx-x');
        navbar.classList.remove('active');
    };

    // ScrollReveal animations
    const sr = ScrollReveal({
        distance: '60px',
        duration: 2500,
        delay: 400,
        reset: true,
    });

    sr.reveal('.text', { delay: 200, origin: 'top' });
    sr.reveal('.from-container form', { delay: 800, origin: 'left' });
    sr.reveal('.heading', { delay: 600, origin: 'top' });
    sr.reveal('.ride-container .box', { delay: 400, origin: 'top' });
    sr.reveal('.services-container .box', { delay: 400, origin: 'top' });
    sr.reveal('.about-container .box', { delay: 400, origin: 'top' });
    sr.reveal('.reviews-container', { delay: 400, origin: 'top' });
    sr.reveal('.newsletter .box', { delay: 300, origin: 'top' });

    // DOM Elements (shared across pages)
    const userInfo = document.getElementById("userInfo");
    const userEmailSpan = document.getElementById("userEmail");
    const logoutBtn = document.getElementById("logoutBtn");

    // Shared: Check if a user is logged in
    async function checkCurrentUser() {
        try {
            const response = await fetch('/current-user');
            if (response.ok) {
                const data = await response.json();
                displayLoggedInUser(data.email, data.role);
            } else {
                displayLoggedOutState();
            }
        } catch (error) {
            console.error('Error checking current user:', error);
        }
    }

    // Shared: Display logged-in user info
    function displayLoggedInUser(email, role) {
        if (userInfo && userEmailSpan) {
            userInfo.style.display = 'block';
            userEmailSpan.textContent = `${email} (${role})`;
        }
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    }

    // Shared: Display logged-out state
    function displayLoggedOutState() {
        if (userInfo && userEmailSpan) {
            userInfo.style.display = 'none';
            userEmailSpan.textContent = '';
        }
        if (logoutBtn) logoutBtn.style.display = 'none';
    }

    // Shared: Logout button click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/logout', { method: 'POST' });
                if (response.ok) {
                    alert('Logout successful');
                    displayLoggedOutState();
                } else {
                    alert('Logout failed');
                }
            } catch (error) {
                console.error('Error logging out:', error);
            }
        });
    }

    // Signup Page Logic
    if (document.getElementById('signupForm')) {
        const signupForm = document.getElementById('signupForm');

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const role = document.getElementById('signupRole').value; // Get the role

            if (!email || !password || !role) {
                alert('Please fill in all fields');
                return;
            }

            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, role }),
                });

                if (response.ok) {
                    alert('Signup successful! Please log in.');
                    signupForm.reset();
                    window.location.href = '/login.html'; // Redirect to signin page
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Signup failed');
                }
            } catch (error) {
                console.error('Error signing up:', error);
            }
        });
    }

    // Signin Page Logic
    if (document.getElementById('signinForm')) {
        const signinForm = document.getElementById('signinForm');

        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;

            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Login successful');
                    displayLoggedInUser(data.email, data.role);
                    window.location.href = '/dashboard'; // Redirect to dashboard or homepage
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error logging in:', error);
            }
        });
    }

    // Initialize (run only on pages with shared functionality)
    if (userInfo || logoutBtn) {
        checkCurrentUser();
    }
    // DOM Elements (shared across pages)
    const signInBtn = document.getElementById("signInBtn");

    // Shared: Check if a user is logged in
    async function checkCurrentUser() {
        try {
            const response = await fetch('/current-user');
            if (response.ok) {
                const data = await response.json();
                // Assuming 'data' contains both email and role
                displayLoggedInUser(data.email, data.role);  // Pass both email and role
            } else {
                displayLoggedOutState();
            }
        } catch (error) {
            console.error('Error checking current user:', error);
        }
    }

    // Shared: Display logged-in user info
    function displayLoggedInUser(email) {
        if (userInfo && userEmailSpan) {
            userInfo.style.display = 'block';
            userEmailSpan.textContent = `${email}`;
        }
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (signInBtn) signInBtn.style.display = 'none'; // Hide sign in button
    }

    // Shared: Display logged-out state
    function displayLoggedOutState() {
        if (userInfo && userEmailSpan) {
            userInfo.style.display = 'none';  // Hide user info
            userEmailSpan.textContent = '';   // Clear the email
        }
        if (logoutBtn) logoutBtn.style.display = 'none';  // Hide the logout button
        if (signInBtn) signInBtn.style.display = 'inline-block';  // Show the login button
    }

    // Shared: Logout button click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/logout', { method: 'POST' });
                if (response.ok) {
                    alert('Logout successful');
                    displayLoggedOutState();
                } else {
                    alert('Logout failed');
                }
            } catch (error) {
                console.error('Error logging out:', error);
            }
        });
    }

    // Initialize (run only on pages with shared functionality)
    if (userInfo || logoutBtn || signInBtn) {
        checkCurrentUser();
    }