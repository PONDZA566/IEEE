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

function showPoolsize(){
    var poolsize = document.createElement('div');
    poolsize.textContent = "***The pool size is 4*8 meters***"
    poolsize.style.position = "absolute";
    poolsize.style.top = "600px";
    poolsize.style.left = "75%";
    poolsize.style.transform = "translateX(-50%)";
    poolsize.style.fontSize = "20px";
    document.body.appendChild(poolsize);
}

function showSubscribeMessage(){
    var poolsize = document.createElement('div');
    poolsize.textContent = "Message from MQTT"
    poolsize.style.position = "absolute";
    poolsize.style.top = "675px";
    poolsize.style.left = "48%";
    poolsize.style.transform = "translateX(-50%)";
    poolsize.style.fontSize = "20px";
    document.body.appendChild(poolsize);
}


document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');
    var image = document.getElementById('image'); // Get the image element
    var coordinates = document.getElementById("coordinates");
    var clearButton = document.getElementById("clearButton");
    var logoutButton = document.getElementById("logoutButton");
    var sendButton = document.getElementById("sendButton");
    var googleSheetsButton = document.getElementById("googleSheetsButton"); // Added this line
    var username;
    var password;

    // Variables to store previous coordinates
    var prevClickedX = -1;
    var prevClickedY = -1;

    // Initially hide the send button
    sendButton.style.display = "none";

    // Define the size of the canvas and the grid
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var columns = 8;
    var rows = 4;

    // Variables to store the coordinates of the clicked point
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

    function drawImage(x, y) {
        var img = new Image();
        img.onload = function() {
            var imageWidth = 50; // Adjust as needed
            var imageHeight = 120; // Adjust as needed
            var imageX = x - imageWidth / 2; // Calculate x-coordinate for centering the image within the circle
            var imageY = y - imageHeight / 2; // Calculate y-coordinate for centering the image within the circle
            ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
        };
        img.src = 'boat.png'; // Replace 'path_to_your_image' with the path to your image file
    }

    function drawCircle2(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = "purple";
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    function drawCircle3(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = "green";
        ctx.lineWidth = 5;
        ctx.stroke();
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
        drawAxes();
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

    // Function to display coordinates and draw arrow from previous point
    function showCoordinates(event) {
        var rect = canvas.getBoundingClientRect();
        clickedX = event.clientX - rect.left;
        clickedY = event.clientY - rect.top;
        var showclickY = clickedY;
        clickedY = Math.abs(clickedY - 400); // Adjusting Y-coordinate

        if (prevClickedX !== -1 && prevClickedY !== -1) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
            showGrid(); // Redraw the grid
            //drawImage(prevClickedX, prevClickedY); // Draw previous circle
            drawCircle2(prevClickedX, prevClickedY); // Draw previous circle
            drawArrow(prevClickedX, prevClickedY, clickedX, clickedY); // Draw arrow
        }

        // Draw circle at the present point
        drawImage(clickedX, showclickY);
        drawCircle3(clickedX, showclickY); // Draw circle

        prevClickedX = clickedX;
        prevClickedY = clickedY;

        coordinates.textContent = "Coordinates: (" + clickedX.toFixed(2) + ", " + clickedY.toFixed(2) + ")";
    }

    // Attach click event listener to the canvas
    canvas.addEventListener("click", function(event) {
        // Check if the user is logged in before executing showCoordinates
        if (username) {
            showCoordinates(event);
        }
    });

    function drawArrow(fromX, fromY, toX, toY) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
        showGrid(); // Redraw the grid
        firstY = Math.abs(fromY - 400);
        drawImage(fromX, firstY); // Draw previous circle
        drawCircle2(fromX, firstY); // Draw previous circle
    
        // Calculate the angle of the arrow
        var angle = Math.atan2(toY - fromY, toX - fromX);
    
        // Calculate the end point of the arrow, stopping short of the circle's center
        var arrowLength = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        var radius = 20; // Radius of the red circle plus some padding
        var endX = toX - radius * Math.cos(angle);
        var endY = toY - radius * Math.sin(angle);
        var adjustedEndY = Math.abs(endY - 400); // Adjust endY for the canvas
    
        // Draw the arrow line
        ctx.beginPath();
        ctx.moveTo(fromX, firstY);
        ctx.lineTo(endX, adjustedEndY);
        ctx.strokeStyle = 'black'; // Arrow color
        ctx.lineWidth = 3; // Arrow line width
        ctx.stroke();
    
        // Draw arrowhead
        var headLength = 20; // Length of the arrowhead
        ctx.beginPath();
        ctx.moveTo(endX, adjustedEndY);
        ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), adjustedEndY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX, adjustedEndY); // Ensure a single connected path
        ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), adjustedEndY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }
    
    // Function to draw X and Y axes
    // Function to draw X and Y axes with arrowheads
    function drawAxes() {
        // Draw X axis
        ctx.beginPath();
        ctx.moveTo(0, canvasHeight); // Start point for X-axis
        ctx.lineTo(canvasWidth, canvasHeight); // End point for X-axis
        ctx.strokeStyle = '#000'; // Black color
        ctx.lineWidth = 8;
        ctx.stroke();

        // Draw X-axis arrowhead
        var arrowSize = 20;
        ctx.beginPath();
        ctx.moveTo(canvasWidth, canvasHeight); // Arrow base
        ctx.lineTo(canvasWidth - arrowSize, canvasHeight - arrowSize / 2); // Left side
        ctx.lineTo(canvasWidth - arrowSize, canvasHeight + arrowSize / 2); // Right side
        ctx.closePath();
        ctx.fillStyle = '#000'; // Black color
        ctx.fill();

        // Draw Y axis
        ctx.beginPath();
        ctx.moveTo(0, canvasHeight); // Start point for Y-axis
        ctx.lineTo(0, 0); // End point for Y-axis
        ctx.strokeStyle = '#000'; // Black color
        ctx.lineWidth = 8;
        ctx.stroke();

        // Draw Y-axis arrowhead
        ctx.beginPath();
        ctx.moveTo(0, 0); // Arrow base
        ctx.lineTo(-arrowSize / 2, arrowSize); // Left side
        ctx.lineTo(arrowSize / 2, arrowSize); // Right side
        ctx.closePath();
        ctx.fillStyle = '#000'; // Black color
        ctx.fill();

        // Label for X-axis
        ctx.font = '18px Arial';
        ctx.fillStyle = '#000'; // Black color
        ctx.fillText('X', canvasWidth - 15, canvasHeight - 10);

        // Label for Y-axis
        ctx.save(); // Save the current state of the canvas
        ctx.translate(10, canvasHeight/16); // Translate to the desired position for Y-axis label
        ctx.fillText('Y', 0, 0); // Draw the Y-axis label
        ctx.restore(); // Restore the saved state of the canvas
    }

    
    // Login form submission
    var form = document.getElementById("login-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        username = document.getElementById("username").value;
        password = document.getElementById("password").value;

        // Here you can add further validation or submit the form data to a server
        if (authenticate(username, password)) {
            hideLoginForm(); // Call function to hide the login form
            showGrid(); // Call function to show the gridlines
            showImage(); // Call function to show the image
            showWelcomeMessage(username); // Call function to display the welcome message
            showPoolsize();// Call function to display size of the pool
            showSubscribeMessage();
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
        return (username === "admin" && password === "1");
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

    // Function to send coordinates to MQTT
    function sendCoordinatesToMQTT(client,x, y) {
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
    function sendCoordinatesToGoogleSheets(x, y, username) {
        // Format coordinates and current timestamp
        var currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
        var dateParts = currentDate.split(", ");
        var date = dateParts[0];
        var time = dateParts[1];
        var data = {
            username: username,
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

    // Send button click event
    sendButton.addEventListener("click", function() {
        if (clickedX !== -1 && clickedY !== -1) { // Check if coordinates are valid
            sendCoordinatesToGoogleSheets(clickedX, clickedY, username); // Call function to send coordinates to Google Sheets
            sendCoordinatesToMQTT(client,clickedX, clickedY); // Pass mqttClient to the function
        } else {
            alert("Please select coordinates before sending.");
        }
    });

    const socket = io();

socket.on('mqttMessage', function(data) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `Topic: ${data.topic}, Message: ${data.message}`;
    
    // Get the messages container
    const messagesContainer = document.getElementById('messages');
    
    // Insert the new message before the first child of messages container
    messagesContainer.insertBefore(messageDiv, messagesContainer.firstChild);
});

socket.on('connect_error', function(error) {
    console.error('Socket.IO error:', error);
});

});
