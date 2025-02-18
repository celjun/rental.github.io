document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        const email = document.getElementById('email').value.trim().toLowerCase();

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Find user by email (no password needed)
        const loggedInUser = users.find(user => user.email === email);

        if (loggedInUser) {
            // Save logged-in user data to localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            // Redirect to the appropriate dashboard based on the user's role
            if (loggedInUser.role === "owner") {
                window.location.href = 'owner-dashboard.html';
            } else if (loggedInUser.role === "renter") {
                window.location.href = 'renter-dashboard.html';
            }
        } else {
            document.getElementById('error-message').style.display = 'block';
        }
    });
});
