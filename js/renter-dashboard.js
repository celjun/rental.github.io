document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout-btn");
    const editProfileButton = document.getElementById("edit-profile-btn");
    const profileInfoSection = document.getElementById("profile-info");
    const editFormSection = document.getElementById("edit-form");
    const studioList = document.getElementById("studio-list");
    const listingModal = document.getElementById("listing-modal");
    const closeModalButton = document.getElementById("close-modal");
    const listingDetails = document.getElementById("listing-details");

    // Load logged-in user data from localStorage
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        // Display user profile info on dashboard
        displayUserInfo(loggedInUser);
    } else {
        // If no logged-in user, redirect to login page
        window.location.href = 'login.html';
    }

    // Logout button functionality
    logoutButton.addEventListener("click", function () {
        // Clear logged-in user data from localStorage
        localStorage.removeItem('loggedInUser');

        // Redirect to index page
        window.location.href = '../index.html';
    });

    // Edit Profile button functionality
    editProfileButton.addEventListener("click", function() {
        // Show edit profile form with current user info
        profileInfoSection.style.display = 'none';
        editFormSection.style.display = 'block';

        // Fill the form with current data
        document.getElementById('edit-name').value = loggedInUser.name;
        document.getElementById('edit-email').value = loggedInUser.email;
        document.getElementById('edit-phone').value = loggedInUser.phone;

        // Disable email input to prevent editing
        document.getElementById('edit-email').disabled = true;
    });

    // Update profile form submission
    document.getElementById('update-profile-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedName = document.getElementById('edit-name').value.trim();
        const updatedPhone = document.getElementById('edit-phone').value.trim();

        // Validation: Make sure all fields are filled (except email, which is disabled)
        if (!updatedName || !updatedPhone) {
            alert('Please fill in all fields.');
            return;
        }

        // Update logged-in user data in the object (in-memory)
        loggedInUser.name = updatedName;
        loggedInUser.phone = updatedPhone;

        // Save updated logged-in user data back to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        // Get the users array from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Find the index of the corresponding user in the users array
        const userIndex = users.findIndex(user => user.email.trim().toLowerCase() === loggedInUser.email.trim().toLowerCase());

        if (userIndex !== -1) {
            // Update the user data in the users array
            users[userIndex].name = updatedName;
            users[userIndex].phone = updatedPhone;

            // Save the updated users array back to localStorage
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Display updated profile information
        displayUserInfo(loggedInUser);

        // Hide edit form and show updated info
        profileInfoSection.style.display = 'block';
        editFormSection.style.display = 'none';
    });

    // Function to display user profile information on the dashboard
    function displayUserInfo(user) {
        profileInfoSection.innerHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
        `;
    }

    // Load and display studio listings
    function loadListings() {
        let listings = JSON.parse(localStorage.getItem('listings')) || [];
        studioList.innerHTML = "";

        listings.forEach((listing, index) => {
            const listingElement = document.createElement("div");
            listingElement.classList.add("listing-item");
            listingElement.innerHTML = `
                <h4>${listing.name}</h4>
                <p><strong>Address:</strong> ${listing.address}</p>
                <p><strong>Area:</strong> ${listing.area} m²</p>
                <p><strong>Type:</strong> ${listing.type}</p>
                <p><strong>Price:</strong> $${listing.price} per term</p>
                <button class="inquire-btn" onclick="showListingDetails(${index})">Inquire</button>
            `;
            studioList.appendChild(listingElement);
        });
    }

    // Show the modal with full listing details
    window.showListingDetails = function (index) {
    let listings = JSON.parse(localStorage.getItem('listings')) || [];
    let listing = listings[index];

    listingDetails.innerHTML = `
        <h3>${listing.name}</h3>
        <p><strong>Address:</strong> ${listing.address}</p>
        <p><strong>Area:</strong> ${listing.area} m²</p>
        <p><strong>Type:</strong> ${listing.type}</p>
        <p><strong>Capacity:</strong> ${listing.capacity}</p>
        <p><strong>Parking:</strong> ${listing.parking ? "Yes" : "No"}</p>
        <p><strong>Public Transport:</strong> ${listing.publicTransport ? "Yes" : "No"}</p>
        <p><strong>Availability:</strong> ${listing.available ? "Available" : "Not Available"}</p>
        <p><strong>Rental Term:</strong> ${listing.rentalTerm}</p>
        <p><strong>Price:</strong> $${listing.price} per term</p>
        <p><strong>Owner Contact Email:</strong> ${listing.ownerEmail}</p>
        <p><strong>Owner Contact Phone:</strong> ${listing.ownerPhone}</p>
        
        
    `;

    listingModal.style.display = "block";
};

    // Close the modal
    closeModalButton.addEventListener("click", function () {
        listingModal.style.display = "none";
    });

    // Close the modal when clicked outside of the modal content
    window.onclick = function (event) {
        if (event.target === listingModal) {
            listingModal.style.display = "none";
        }
    };

    loadListings();
});
