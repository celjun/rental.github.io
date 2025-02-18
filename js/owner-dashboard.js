document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById("logout-btn");
    const editProfileButton = document.getElementById("edit-profile-btn");
    const profileInfoSection = document.getElementById("profile-info");
    const editFormSection = document.getElementById("edit-form");
    const addListingBtn = document.getElementById("add-listing-btn");
    const addListingForm = document.getElementById("add-listing-form");
    const listingForm = document.getElementById("listing-form");
    const studioListings = document.getElementById("studio-listings");

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
    logoutButton.addEventListener("click", function() {
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

    // ------------------ LISTING MANAGEMENT ------------------

    // Load owner's listings
    function loadListings() {
        let listings = JSON.parse(localStorage.getItem('listings')) || [];
        let ownerListings = listings.filter(listing => listing.ownerEmail === loggedInUser.email);

        studioListings.innerHTML = "";

        ownerListings.forEach((listing, index) => {
            const listingElement = document.createElement("div");
            listingElement.classList.add("listing-item");
            listingElement.innerHTML = `
                <h4>${listing.name}</h4>
                <p><strong>Address:</strong> ${listing.address}</p>
                <p><strong>Area:</strong> ${listing.area} m²</p>
                <p><strong>Type:</strong> ${listing.type}</p>
                <p><strong>Capacity:</strong> ${listing.capacity}</p>
                <p><strong>Parking:</strong> ${listing.parking ? "Yes" : "No"}</p>
                <p><strong>Public Transport:</strong> ${listing.publicTransport ? "Yes" : "No"}</p>
                <p><strong>Availability:</strong> ${listing.available ? "Available" : "Not Available"}</p>
                <p><strong>Rental Term:</strong> ${listing.rentalTerm}</p>
                <p><strong>Price:</strong> $${listing.price} per term</p>
                <button onclick="editListing(${index})">Edit</button>
                <button onclick="deleteListing(${index})">Delete</button>
            `;
            studioListings.appendChild(listingElement);
        });
    }

    // Show Add Listing Form
    addListingBtn.addEventListener("click", function() {
        addListingForm.style.display = "block";
        listingForm.reset(); // Reset the form fields
        listingForm.onsubmit = addListing; // Set form submission to add a new listing
    });

    // Add Listing
    function addListing(event) {
        event.preventDefault();

        let newListing = {
            ownerPhone: loggedInUser.phone,
            ownerEmail: loggedInUser.email,
            name: document.getElementById("studio-name").value,
            address: document.getElementById("studio-address").value,
            area: document.getElementById("studio-area").value,
            type: document.getElementById("studio-type").value,
            capacity: document.getElementById("studio-capacity").value,
            parking: document.getElementById("studio-parking").checked,
            publicTransport: document.getElementById("studio-public-transport").checked,
            available: document.getElementById("studio-available").checked,
            rentalTerm: document.getElementById("studio-rental-term").value,
            price: document.getElementById("studio-price").value
        };

        let listings = JSON.parse(localStorage.getItem('listings')) || [];
        listings.push(newListing);
        localStorage.setItem('listings', JSON.stringify(listings));

        listingForm.reset();
        addListingForm.style.display = "none";
        loadListings();
    }

    // Edit Listing
    window.editListing = function(index) {
        let listings = JSON.parse(localStorage.getItem('listings')) || [];
        let ownerListings = listings.filter(listing => listing.ownerEmail === loggedInUser.email);
        let listing = ownerListings[index];

        // Pre-fill the form with the selected listing's data
        document.getElementById("studio-name").value = listing.name;
        document.getElementById("studio-address").value = listing.address;
        document.getElementById("studio-area").value = listing.area;
        document.getElementById("studio-type").value = listing.type;
        document.getElementById("studio-capacity").value = listing.capacity;
        document.getElementById("studio-parking").checked = listing.parking;
        document.getElementById("studio-public-transport").checked = listing.publicTransport;
        document.getElementById("studio-available").checked = listing.available;
        document.getElementById("studio-rental-term").value = listing.rentalTerm;
        document.getElementById("studio-price").value = listing.price;

        addListingForm.style.display = "block";

        // Set the form submission to update the existing listing
        listingForm.onsubmit = function(event) {
            event.preventDefault();

            let updatedListing = {
                ownerPhone: loggedInUser.phone,
                ownerEmail: loggedInUser.email,
                name: document.getElementById("studio-name").value,
                address: document.getElementById("studio-address").value,
                area: document.getElementById("studio-area").value,
                type: document.getElementById("studio-type").value,
                capacity: document.getElementById("studio-capacity").value,
                parking: document.getElementById("studio-parking").checked,
                publicTransport: document.getElementById("studio-public-transport").checked,
                available: document.getElementById("studio-available").checked,
                rentalTerm: document.getElementById("studio-rental-term").value,
                price: document.getElementById("studio-price").value
            };

            listings[ownerListings.indexOf(listing)] = updatedListing; // Update the listing
            localStorage.setItem('listings', JSON.stringify(listings));

            listingForm.reset();
            addListingForm.style.display = "none";
            loadListings();
        };
    };

    // Delete Listing
    window.deleteListing = function(index) {
        let listings = JSON.parse(localStorage.getItem('listings')) || [];
        listings.splice(index, 1);
        localStorage.setItem('listings', JSON.stringify(listings));
        loadListings();
    };

    loadListings();
});
