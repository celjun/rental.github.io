document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('signup-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        // Get input values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const phone = document.getElementById('phone').value.trim();
        const role = document.getElementById('role').value;

        // Validate inputs
        if (!name || !email || !phone || !role) {
            alert('Please fill in all fields.');
            return;
        }

        // Get existing users from localStorage or initialize an empty array
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if email already exists
        if (users.some(user => user.email === email)) {
            document.getElementById('error-message').style.display = 'block';
            return;
        }

        // Save new user data
        const newUser = { name, email, phone, role };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Show success message and redirect to login page
        alert('Sign-up successful! Redirecting to login...');
        window.location.href = 'login.html'; // Redirect to login page
    });
});
