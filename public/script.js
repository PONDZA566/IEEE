document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');
    var image = document.getElementById('image'); // Get the image element
    var coordinates = document.getElementById("coordinates");
    var clearButton = document.getElementById("clearButton");
    var logoutButton = document.getElementById("logoutButton");

    // Define the size of the canvas and the grid
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var columns = 4;
    var rows = 4;

    // Variable to store the coordinates of the clicked point
    var clickedX = -1;
    var clickedY = -1;
    
    // Variable to store the reference of the currently clicked tile
    var currentTile = null;

    // Function to draw the gridlines
    function drawGrid() {
        // Calculate the width and height of each cell
        var cellWidth = canvasWidth / columns;
        var cellHeight = canvasHeight / rows;

        // Set the color and line width for the grid
        ctx.strokeStyle = '#000'; // black color
        ctx.lineWidth = 1;

        // Draw vertical gridlines
        for (var i = 1; i < columns; i++) {
            var x = i * cellWidth;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
        }

        // Draw horizontal gridlines
        for (var j = 1; j < rows; j++) {
            var y = j * cellHeight;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }
    }

    // Function to draw a red circle
    function drawCircle(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    // Initially hide the gridlines, the image, and the clear button
    hideGrid();
    hideImage();
    hideClearButton();
    hideLogoutButton();

    // Function to hide the gridlines
    function hideGrid() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    // Function to show the gridlines
    function showGrid() {
        drawGrid();
    }

    // Function to hide the image
    function hideImage() {
        image.style.display = "none";
    }

    // Function to show the image
    function showImage() {
        image.style.display = "block";
    }

    // Function to display the welcome message
    function showWelcomeMessage(username) {
        var welcomeMessage = document.createElement('div');
        welcomeMessage.textContent = "Welcome " + username;
        welcomeMessage.style.position = "absolute";
        welcomeMessage.style.top = "20px";
        welcomeMessage.style.left = "50%";
        welcomeMessage.style.transform = "translateX(-50%)";
        welcomeMessage.style.fontSize = "24px";
        document.body.appendChild(welcomeMessage);
    }

    // Function to display coordinates
    function showCoordinates(event) {
        var rect = canvas.getBoundingClientRect();
        clickedX = event.clientX - rect.left;
        clickedY = event.clientY - rect.top;
        console.log("Coordinates: (" + clickedX.toFixed(2) + ", " + clickedY.toFixed(2) + ")");
        coordinates.textContent = "Coordinates: (" + clickedX.toFixed(2) + ", " + clickedY.toFixed(2) + ")";
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        showGrid(); // Redraw the grid
        drawCircle(clickedX, clickedY); // Draw the circle at the clicked coordinates
    
        // Get the clicked tile
        var cellWidth = canvasWidth / columns;
        var cellHeight = canvasHeight / rows;
        
    }
    
    // Attach click event listener to the canvas
    canvas.addEventListener("click", showCoordinates);

    // Login form submission
    var form = document.getElementById("login-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        // Here you can add further validation or submit the form data to a server
        if (authenticate(username, password)) {
            hideLoginForm(); // Call function to hide the login form
            showGrid(); // Call function to show the gridlines
            showImage(); // Call function to show the image
            showWelcomeMessage(username); // Call function to display the welcome message
            showClearButton(); // Call function to show the clear button
            showLogoutButton(); // Call function to show the logout button
        } else {
            alert("Invalid username or password. Please try again.");
        }
    });

    // Authentication function (replace with your actual authentication logic)
    function authenticate(username, password) {
        return (username === "admin" && password === "123456789");
    }

    // Function to hide the login form after successful login
    function hideLoginForm() {
        var loginContainer = document.querySelector(".login-container");
        loginContainer.style.display = "none"; // Hide the login form container
    }

    // Function to clear the circle
    function clearCircle() {
        clickedX = -1;
        clickedY = -1;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        showGrid(); // Redraw the grid
    }

    // Function to hide the clear button
    function hideClearButton() {
        clearButton.style.display = "none";
    }

    // Function to show the clear button
    function showClearButton() {
        clearButton.style.display = "block";
    }

    // Function to hide the logout button
    function hideLogoutButton() {
        logoutButton.style.display = "none";
    }

    // Function to show the logout button
    function showLogoutButton() {
        logoutButton.style.display = "block";
    }
    
    clearButton.addEventListener("click", clearCircle);
    logoutButton.addEventListener("click", logout);

    // Function to log out
    function logout() {
        window.location.href = "index.html";
    }
});
