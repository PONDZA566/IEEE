const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');
const mqtt = require('mqtt'); // Import MQTT module
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import socket.io

const app = express();
const port = 3000;

// Load the credentials from the service account key file
const credentials = require('./secrets.json');

// Authenticate with the Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// Create a client instance for Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

// MQTT broker connection options
const brokerUrl = 'mqtt://test.mosquitto.org'; // Update with your MQTT broker URL
const mqttOptions = {
  clientId: 'angkaewone', // Client ID
  clean: true, // Clean session
  connectTimeout: 4000, // Timeout in milliseconds
};

// Connect to MQTT broker
const mqttClient = mqtt.connect(brokerUrl, mqttOptions);

// MQTT connection event handlers
mqttClient.on('connect', function () {
  console.log('Connected to MQTT broker');
  // Subscribe to the desired MQTT topic
  mqttClient.subscribe('robot/command', function (err) {
      if (!err) {
          console.log('Subscribed to MQTT topic');
      } else {
          console.error('Error subscribing to MQTT topic:', err);
      }
  });
});

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server
const io = new Server(server);

// Handle incoming MQTT messages
mqttClient.on('message', function (topic, message) {
  // Convert message to appropriate format and process it
  console.log('Received message on topic', topic, ':', message.toString());
  // Broadcast the message to all connected Socket.IO clients
  io.emit('mqttMessage', { topic, message: message.toString() });
});

mqttClient.on('error', function (error) {
  // Handle errors
  console.error('MQTT error:', error);
});

  // Endpoint to handle storing coordinates
  app.post('/store-coordinates', express.json(), async (req, res) => {
    const { username, coordinates, date, time } = req.body; // Include username, coordinates, date, and time in the request body

    try {
        // Ensure coordinates is an array and not undefined
        if (!Array.isArray(coordinates)) {
            throw new Error('Coordinates must be an array');
        }

        // Store each coordinate along with username, date, and time in Google Sheets
        await Promise.all(coordinates.map(async (coord) => {
            const { x, y } = coord;
            await storeCoordinates(username, x, y, date, time);
            sendCoordinatesToMQTT(x, y);
        }));

        res.sendStatus(200);
    } catch (error) {
        console.error('Failed to store coordinates:', error);
        res.status(500).json({ error: 'Failed to store coordinates' });
    }
  });

// Function to store coordinates in Google Sheets
async function storeCoordinates(username, x, y, date, time) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: '175TPRTJi41n7FJHvb_5cejFTJgudx-Wm11284OL_v2A',
      range: 'Sheet1!A2', // Start cell for appending data
      valueInputOption: 'RAW',
      requestBody: {
        values: [[username, date, time, x, y]] // Include username in the values array
      },
    });
    console.log('Coordinates stored successfully');
  } catch (error) {
    console.error('Error storing coordinates:', error);
    throw error;
  }
}

// Updated function to send coordinates to MQTT topic
function sendCoordinatesToMQTT(x, y) {
  // Format coordinates as JSON
  const coordinates = { x: x, y: y };

  // Publish coordinates to MQTT topic
  mqttClient.publish('angkaewone/1', JSON.stringify(coordinates), function (err) {
    if (!err) {
      console.log('Coordinates sent to MQTT topic:', coordinates);
    } else {
      console.error('Error publishing coordinates to MQTT:', err);
    }
  });
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});
