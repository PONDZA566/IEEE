const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');
const mqtt = require('mqtt'); // Import MQTT module

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
});

mqttClient.on('error', function (error) {
  // Handle errors
  console.error('MQTT error:', error);
});

// Function to send coordinates to MQTT topic
function sendCoordinatesToMQTT(x, y) {
  // Format coordinates as JSON
  const coordinates = { x: x, y: y };

  // Publish coordinates to MQTT topic
  mqttClient.publish('coordinates', JSON.stringify(coordinates), function (err) {
    if (!err) {
      console.log('Coordinates sent to MQTT topic:', coordinates);
    } else {
      console.error('Error publishing coordinates to MQTT:', err);
    }
  });
}

// Function to store coordinates in Google Sheets
async function storeCoordinates(x, y, date, time) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: '175TPRTJi41n7FJHvb_5cejFTJgudx-Wm11284OL_v2A',
      range: 'Sheet1!A2', // Start cell for appending data
      valueInputOption: 'RAW',
      requestBody: {
        values: [[x, y, date, time]] // Array of values to append (including date and time)
      },
    });
    console.log('Coordinates stored successfully');
  } catch (error) {
    console.error('Error storing coordinates:', error);
    throw error;
  }
}

// Endpoint to handle storing coordinates
app.post('/store-coordinates', express.json(), async (req, res) => {
  const { x, y, date, time } = req.body;

  try {
    // Store coordinates in Google Sheets
    await storeCoordinates(x, y, date, time);
    // Send coordinates to MQTT topic
    sendCoordinatesToMQTT(x, y);
    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to store coordinates:', error);
    res.status(500).json({ error: 'Failed to store coordinates' });
  }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
