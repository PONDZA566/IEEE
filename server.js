const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');

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

// Function to store coordinates in Google Sheets
async function storeCoordinates(x, y, date) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: '175TPRTJi41n7FJHvb_5cejFTJgudx-Wm11284OL_v2A',
      range: 'Sheet1!A2', // Start cell for appending data
      valueInputOption: 'RAW',
      requestBody: {
        values: [[x, y, date]] // Array of values to append (including dateTime)
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
    const { x, y, date } = req.body;
  
    try {
      // Store coordinates in Google Sheets
      await storeCoordinates(x, y, date);
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
app.get('/store-coordinates', (req, res) => {
  res.status(405).send('Method Not Allowed'); // Respond with a 405 Method Not Allowed status
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
