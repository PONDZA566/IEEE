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
    // Create the first div for the pool size
    var poolsize = document.createElement('div');
    poolsize.textContent = "The pool size in this prototype is 4 x 4 square meter."
    poolsize.style.position = "absolute";
    poolsize.style.top = "575px";
    poolsize.style.left = "74.5%";
    poolsize.style.transform = "translateX(-50%)";
    poolsize.style.fontSize = "16px";
    document.body.appendChild(poolsize);

    // Create the second div for the additional phrase
    var dimensions = document.createElement('div');
    dimensions.textContent = "All dimensions are in meters.";
    dimensions.style.position = "absolute";
    dimensions.style.top = "625px"; // Adjust the position to be below the first text
    dimensions.style.left = "69.5%";
    dimensions.style.transform = "translateX(-50%)";
    dimensions.style.fontSize = "17px";
    document.body.appendChild(dimensions);

    var scale = document.createElement('div');
    scale.textContent = "Define 1 block as 1 x 1 square meter.";
    scale.style.position = "absolute";
    scale.style.top = "600px"; // Adjust the position to be below the first text
    scale.style.left = "71%";
    scale.style.transform = "translateX(-50%)";
    scale.style.fontSize = "16px";
    document.body.appendChild(scale);
}

function showSubscribeMessage(){
    var poolsize = document.createElement('div');
    poolsize.textContent = "Message from Angkaew-One"
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
    var boatAngle = 0; // Initialize boat angle

    // Variables to store previous coordinates
    var prevClickedX = -1;
    var prevClickedY = -1;

    // Initially hide the send button
    sendButton.style.display = "none";

    // Define the size of the canvas and the grid
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var columns = 4;
    var rows = 4;

    // Variables to store the coordinates of the clicked point
    var clickedX = -1;
    var clickedY = -1;

    // Previous clicked points
    var prevClickedPoints = [];

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
            ctx.lineTo(x, canvasHeight+1);
            ctx.stroke();
        }

        // Draw horizontal gridlines
        for (var j = 1; j < rows; j++) {
            var y = j * cellHeight;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth+1, y);
            ctx.stroke();
        }
    }

    
    function drawImage(x, y, angle) {
        var img = new Image();
        img.onload = function() {
            var imageWidth = 90; // Adjust as needed
            var imageHeight = 40; // Adjust as needed
            var imageX = x - imageWidth / 2; // Calculate x-coordinate for centering the image within the circle
            var imageY = y - imageHeight / 2; // Calculate y-coordinate for centering the image within the circle
            
            // Save the current canvas state
            ctx.save();
            
            // Move the canvas origin to the center of the image
            ctx.translate(x, y);
            
            // Rotate the canvas
            ctx.rotate(angle * Math.PI / 180);
            
            // Draw the image centered on the new origin
            ctx.drawImage(img, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
            
            // Restore the canvas to its previous state
            ctx.restore();
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

    function drawCircle3(x, y, color) {
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
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

    function drawNumber(x, y, number) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        var textY = y + 45; // Adjust 60 as needed to position the text below the circle
        ctx.fillText(number, x - 10, textY); // Adjust x - 10 to center the text horizontally
    }

    // Function to display coordinates and draw only two boat images from the previous two points
    function showCoordinates(event) {
        if (prevClickedPoints.length >= 1) {
            alert("You can only mark one points.");
            return;
        }
    
        var rect = canvas.getBoundingClientRect();
        clickedX = event.clientX - rect.left;
        clickedY = event.clientY - rect.top;
        var showclickY = clickedY;
        clickedY = Math.abs(clickedY - 400); // Adjusting Y-coordinate
        
    
        // Add the clicked point to the array of previous points
        prevClickedPoints.push({ x: clickedX, y: clickedY });
    
        // Clear the canvas before redrawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Redraw the grid
        showGrid();
    
        // Draw boat images and circles for the three most recent points
        prevClickedPoints.forEach(function (coordinate, index) {
            drawImage(coordinate.x, Math.abs(coordinate.y - 400));
            let color;
            if (index === 0) {
                color = "red";
            } else if (index === 1) {
                color = "darkgreen";
            } else {
                color = "brown";
            }
            drawCircle3(coordinate.x, Math.abs(coordinate.y - 400), color);
            drawNumber(coordinate.x, Math.abs(coordinate.y - 400), index + 1); // Draw the number next to the point
        });
    
        // // Draw arrows between the points
        // if (prevClickedPoints.length > 1) {
        //     for (let i = 0; i < prevClickedPoints.length - 1; i++) {
        //         drawArrow(
        //             prevClickedPoints[i].x,
        //             Math.abs(prevClickedPoints[i].y - 400),
        //             prevClickedPoints[i + 1].x,
        //             Math.abs(prevClickedPoints[i + 1].y - 400)
        //         );
        //     }
        // }
    
        // Update the coordinates text content
        coordinates.textContent = "Coordinates: (" + clickedX.toFixed(2)/100 + ", " + clickedY.toFixed(2)/100 + ")";
    
        // Display the coordinates in the coordinatesList element
        var coordinatesList = document.getElementById("coordinatesList");
        coordinatesList.innerHTML = "<h3>Stored Coordinates:</h3>";
        prevClickedPoints.forEach(function (coordinate, index) {
            var color = index === 0 ? "red" : index === 1 ? "darkgreen" : "brown"; // Choose color based on index
            var coordinateHTML = "<p style='color: " + color + ";'>Point " + (index + 1) + ": (" + coordinate.x.toFixed(2)/100 + ", " + coordinate.y.toFixed(2)/100 + ")</p>";
            coordinatesList.innerHTML += coordinateHTML;
        });
    }

    // Attach click event listener to the canvas
    canvas.addEventListener("click", function(event) {
        // Check if the user is logged in before executing showCoordinates
        if (username) {
            showCoordinates(event);
        }
        
    });

    function drawArrow(fromX, fromY, toX, toY) {
        // Calculate the angle of the arrow
        var angle = Math.atan2(toY - fromY, toX - fromX);
    
        // Calculate the end point of the arrow, stopping short of the circle's center
        var radius = 10; // Radius of the circle plus some padding
        var endX = toX - radius * Math.cos(angle);
        var endY = toY - radius * Math.sin(angle);
    
        // Draw the arrow line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'black'; // Arrow color
        ctx.lineWidth = 3; // Arrow line width
        ctx.stroke();
    
        // Draw arrowhead
        var headLength = 10; // Length of the arrowhead
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX, endY); // Ensure a single connected path
        ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.fillStyle = 'black'; // Arrowhead color
        ctx.fill();
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
        var arrowSize = 26;
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
        ctx.font = '32px Arial';
        ctx.fillStyle = '#000'; // Black color
        ctx.fillText('X', canvasWidth - 15, canvasHeight - 10);

        // Label for Y-axis
        ctx.save(); // Save the current state of the canvas
        ctx.translate(10, canvasHeight/16); // Translate to the desired position for Y-axis label
        ctx.fillText('Y', 0, 0); // Draw the Y-axis label
        ctx.restore(); // Restore the saved state of the canvas
    }

    // Function to clear the most recent point
    // function clearPreviousPoint() {
    //     if (prevClickedPoints.length > 0) {
    //         // Remove the most recent point from the array
    //         prevClickedPoints.pop();

    //         // Clear the canvas before redrawing
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);

    //         // Redraw the grid
    //         showGrid();

    //         // Redraw the remaining points
    //         prevClickedPoints.forEach(function (coordinate, index) {
    //             drawImage(coordinate.x, Math.abs(coordinate.y - 400));
    //             let color;
    //             if (index === 0) {
    //                 color = "darkblue";
    //             } else if (index === 1) {
    //                 color = "darkgreen";
    //             } else {
    //                 color = "brown";
    //             }
    //             drawCircle3(coordinate.x, Math.abs(coordinate.y - 400), color);
    //             drawNumber(coordinate.x, Math.abs(coordinate.y - 400), index + 1);
    //         });

    //         // Redraw arrows between the remaining points
    //         if (prevClickedPoints.length > 1) {
    //             for (let i = 0; i < prevClickedPoints.length - 1; i++) {
    //                 drawArrow(
    //                     prevClickedPoints[i].x,
    //                     Math.abs(prevClickedPoints[i].y - 400),
    //                     prevClickedPoints[i + 1].x,
    //                     Math.abs(prevClickedPoints[i + 1].y - 400)
    //                 );
    //             }
    //         }

    //         // Update the coordinates list
    //         var coordinatesList = document.getElementById("coordinatesList");
    //         coordinatesList.innerHTML = "<h3>Stored Coordinates:</h3>";
    //         prevClickedPoints.forEach(function (coordinate, index) {
    //             var color = index === 0 ? "darkblue" : index === 1 ? "darkgreen" : "brown";
    //             var coordinateHTML = "<p style='color: " + color + ";'>Point " + (index + 1) + ": (" + coordinate.x.toFixed(2)/100 + ", " + coordinate.y.toFixed(2)/100 + ")</p>";
    //             coordinatesList.innerHTML += coordinateHTML;
    //         });

    //         // Clear the coordinates text if no points are left
    //         if (prevClickedPoints.length === 0) {
    //             coordinates.textContent = "";
    //         }
    //     }
    // }

    // // Add the event listener for the clear previous button
    // var clearPreviousButton = document.getElementById("clearPreviousButton");
    // clearPreviousButton.addEventListener("click", clearPreviousPoint);

    // // Function to show the clear previous button
    // function showClearPreviousButton() {
    //     clearPreviousButton.style.display = "block";
    // }

    // Function to hide the clear previous button
    // function hideClearPreviousButton() {
    //     clearPreviousButton.style.display = "none";
    // }


    
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
            //showClearPreviousButton();
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
    // Define your list of username/password pairs
    const users = [
        { username: "admin", password: "1" },
        { username: "user1", password: "11" },
        { username: "user2", password: "22" }
        
    ];

    // Check if the provided username/password matches any entry in the users array
    return users.some(user => user.username === username && user.password === password);
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
        prevClickedPoints = []; // Clear the stored coordinates
        var coordinatesList = document.getElementById("coordinatesList");
        coordinatesList.innerHTML = ""; // Clear the coordinates list
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

    function sendCoordinatesToMQTT(client, coordinatesArray) {
        coordinatesArray.forEach(function(coordinate, index) {
            // Format coordinates as JSON
            const coordinates = { x: coordinate.x, y: coordinate.y  };
    
            // Publish coordinates to MQTT topic
            client.publish('coordinates', JSON.stringify(coordinates), function(err) {
                if (!err) {
                    console.log('Coordinates sent to MQTT topic:', coordinates);
                    
                    // Check if it is the third coordinate
                    if ((index + 1) % 3 === 0) {
                        // Publish '+' sign to MQTT topic
                        client.publish('coordinates', '+', function(err) {
                            if (!err) {
                                console.log('Plus sign sent to MQTT topic');
                            } else {
                                console.error('Error publishing plus sign to MQTT:', err);
                            }
                        });
                    }
                } else {
                    console.error('Error publishing coordinates to MQTT:', err);
                }
            });
        });
    }
    

    // Send button click event
    sendButton.addEventListener("click", function() {
        if (prevClickedPoints.length >= 1) { // Check if at least three coordinates are selected
            // Extract the first three coordinates
            var coordinatesArray = prevClickedPoints.slice(0, 1).map(function(coordinate) {
                return { x: coordinate.x, y: coordinate.y };
            });

            // Send coordinates to Google Sheets
            sendCoordinatesToGoogleSheets(coordinatesArray, username);
            
            // Send coordinates to MQTT with delay
            sendCoordinatesToMQTTWithDelay(client, coordinatesArray, 0);
        } else {
            alert("Please select at least one coordinate before sending.");
        }
    });

    // Function to send coordinates array to Google Sheets
    async function sendCoordinatesToGoogleSheets(coordinatesArray, username) {
        var currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
        var dateParts = currentDate.split(", ");
        var date = dateParts[0];
        var time = dateParts[1];

        try {
            // Iterate over each coordinate and send it to Google Sheets
            for (const coordinate of coordinatesArray) {
                // Prepare the payload for the current coordinate
                const payload = {
                    username: username,
                    coordinates: [{ x: coordinate.x/100, y: coordinate.y/100 }],
                    date: date,
                    time: time
                };

                // Send data to Google Sheets endpoint
                const response = await fetch('/store-coordinates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                // Check if the request was successful
                if (response.ok) {
                    console.log('Coordinate sent to Google Sheets:', payload.coordinates[0]);
                } else {
                    console.error('Failed to send coordinate to Google Sheets');
                }
            }
        } catch (error) {
            console.error('Error sending coordinates to Google Sheets:', error);
        }
    }

    // Function to send coordinates to MQTT with delay
    function sendCoordinatesToMQTTWithDelay(client, coordinatesArray, delay) {
        setTimeout(() => {
            sendCoordinatesToMQTT(client, coordinatesArray);
        }, delay);
    }


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

socket.on('boatAngle', function(angle) {
    // Update the boat angle here
    console.log('Received boat angle:', angle);
    // Call a function to update the boat image with the received angle
    drawImage(x,y,angle);
  });

});
