// Function to display a welcome message
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

    // Google Sheets button click event
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
        coordinates.textContent = "";
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

    // Clear button click event
    clearButton.addEventListener("click", clearCircle);

    // Logout button click event
    logoutButton.addEventListener("click", function() {
        window.location.href = "index.html";
    });

    // Send button click event
    sendButton.addEventListener("click", function() {
        if (clickedX !== -1 && clickedY !== -1) { // Check if coordinates are valid
            sendCoordinatesToGoogleSheets(clickedX, clickedY); // Call function to send coordinates to Google Sheets
            sendCoordinatesToMQTT(clickedX, clickedY); // Call function to send coordinates to MQTT
        } else {
            alert("Please select coordinates before sending.");
        }
    });

    // MQTT integration
    const mqtt = require('mqtt');

    // MQTT broker connection options
    const brokerUrl = 'mqtt://test.mosquitto.org:1883'; // Update with your MQTT broker URL
    const options = {
        clientId: 'angkaewone', // Client ID
        clean: true, // Clean session
        connectTimeout: 4000, // Timeout in milliseconds
    };

    // Connect to MQTT broker
    const client = mqtt.connect(brokerUrl, options);

    // MQTT connection event handlers
    client.on('connect', function () {
        console.log('Connected to MQTT broker');
    });

    client.on('error', function (error) {
        // Handle errors
        console.error('MQTT error:', error);
    });

    // Function to send coordinates to MQTT
function sendCoordinatesToMQTT(x, y) {
    // Format coordinates as JSON
    const coordinates = { x: x, y: y };

    // Publish coordinates to MQTT topic
    client.publish('coordinates', JSON.stringify(coordinates), function (err) {
        if (!err) {
            console.log('Coordinates sent to MQTT topic:', coordinates);
        } else {
            console.error('Error publishing coordinates to MQTT:', err);
        }
    });
}

// Function to send coordinates to Google Sheets
function sendCoordinatesToGoogleSheets(x, y) {
    // Format coordinates and current timestamp
    var currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
    var dateParts = currentDate.split(", ");
    var date = dateParts[0];
    var time = dateParts[1];
    var data = {
        x: x,
        y: y,
        date: date,
        time: time
    };

    // Send data to Google Sheets endpoint
    fetch('/store-coordinates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            console.log('Coordinates sent to Google Sheets:', data);
        } else {
            console.error('Failed to send coordinates to Google Sheets');
        }
    })
    .catch(error => {
        console.error('Error sending coordinates to Google Sheets:', error);
    });
    }
});
