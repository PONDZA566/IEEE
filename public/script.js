document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("login-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        // Here you can add further validation or submit the form data to a server
        if (authenticate(username, password)) {
            hideLoginForm(); // Call function to hide the login form
            showClickableBox(); // Call function to show the clickable box
        } else {
            alert("Invalid username or password. Please try again.");
        }
    });

    function authenticate(username, password) {
        // Here, you can replace this logic with actual authentication logic,
        // such as checking against a database or predefined credentials.
        // For demonstration purposes, let's assume the correct credentials are "admin" and "123456789".
        return (username === "admin" && password === "123456789");
    }

    function hideLoginForm() {
        var loginContainer = document.querySelector(".login-container");
        loginContainer.style.display = "none"; // Hide the login form container
    }

    function showClickableBox() {
        var box = document.getElementById("box");
        box.style.display = "block"; // Show the box
        var coordinates = document.getElementById("coordinates");
        coordinates.style.display = "block"; // Show the coordinates
    }

    var box = document.getElementById("box");
    box.addEventListener("click", function(event) {
        var rect = box.getBoundingClientRect();
        var x = (event.clientX - rect.left) / 100;
        var y = (event.clientY - rect.top) / 100;
        var coordinates = document.getElementById("coordinates");
        coordinates.innerText = "Coordinates: (" + x.toFixed(2) + ", " + y.toFixed(2) + ")";
        console.log("Coordinates: (" + x.toFixed(2) + ", " + y.toFixed(2) + ")");
    });
});
