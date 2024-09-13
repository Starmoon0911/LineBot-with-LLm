// index.js
require('module-alias/register');
const express = require('express');
const bodyParser = require('body-parser');
const HandleMessageEvent = require('./events/onMessageCreate.js');
const app = express();
const port = process.env.PORT || 3000;
const BotClient = require('./Botclient.js')
// Create a new LineBot instance
const client = new BotClient()
// Middleware to parse incoming webhook requests
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
/**
 * Handles incoming webhook requests from Line platform.
 *
 * @param {Object} req - The request object containing the incoming webhook data.
 * @param {Object} res - The response object to send back to Line platform.
 *
 * @returns {void}
 */
app.post('/webhook', (req, res) => {
  // Extract events from the request body
  const events = req.body.events;

  // Process each event using the HandleMessageEvent function
  Promise.all(events.map(event => HandleMessageEvent(event, client)))
    .then(() => {
      // If all events are processed successfully, send a 200 status code
      res.sendStatus(200);
    })
    .catch((err) => {
      // If any error occurs during event processing, log the error and send a 500 status code
      console.error(err);
      res.sendStatus(500);
    });
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});