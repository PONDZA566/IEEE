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

document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');
    var image = document.getElementById('image'); // Get the image element
    var coordinates = document.getElementById("coordinates");
    var clearButton = document.getElementById("clearButton");
    var logoutButton = document.getElementById("logoutButton");
    var sendButton = document.getElementById("sendButton");

    // Initially hide the send button
    sendButton.style.display = "none";

    // Define the size of the canvas and the grid
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var columns = 4;
    var rows = 4;

    // Variable to store the coordinates of the clicked point
    var clickedX = -1;
    var clickedY = -1;

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

        // Send coordinates to the server
        sendDataToServer(clickedX, clickedY);
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
            showSendButton(); // Call function to show the send button
            showGoogleSheetsButton(); // Call function to show the Google Sheets button
        } else {
            alert("Invalid username or password. Please try again.");
        }
    });

    googleSheetsButton.addEventListener("click", function() {
        // Define your Google Sheets URL
        var googleSheetsURL = "https://docs.google.com/spreadsheets/d/175TPRTJi41n7FJHvb_5cejFTJgudx-Wm11284OL_v2A/edit#gid=0";
        
        // Open the Google Sheets link in a new tab/window
        window.open(googleSheetsURL, "_blank");
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

    // Function to show the send button
    function showSendButton() {
        sendButton.style.display = "block";
    }

    // Function to show the Google Sheets button
    function showGoogleSheetsButton() {
        googleSheetsButton.style.display = "block";
    }

    clearButton.addEventListener("click", clearCircle);

    // Function to log out
    function logout() {
        window.location.href = "index.html";
    }

    logoutButton.addEventListener("click", logout);

    // Function to send data to the server
    // Function to send data to the server
// Function to send data to the server
function sendDataToServer(x, y) {
    // Get the current date and time in Thailand timezone
    var currentDate = new Date().toLocaleString('en-US', {timeZone: 'Asia/Bangkok'});
    currentDate = new Date(currentDate);

    // Extract date components
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns month index starting from 0
    var day = ('0' + currentDate.getDate()).slice(-2);
    var date = year + '-' + month + '-' + day;

    // Extract time components
    var hours = ('0' + currentDate.getHours()).slice(-2);
    var minutes = ('0' + currentDate.getMinutes()).slice(-2);
    var seconds = ('0' + currentDate.getSeconds()).slice(-2);
    var time = hours + ':' + minutes + ':' + seconds;

    // Send HTTP POST request to the server
    fetch('/store-coordinates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ x: x, y: y, date: date, time: time }) // Include date and time separately in the request body
    })
    .then(response => {
        if (response.ok) {
            console.log('Coordinates sent successfully');
        } else {
            console.error('Failed to send coordinates');
        }
    })
    .catch(error => {
        console.error('Error sending coordinates:', error);
    });
}


});