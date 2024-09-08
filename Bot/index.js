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
app.post('/webhook', (req, res) => {
  const events = req.body.events;

  Promise.all(events.map(event => HandleMessageEvent(event, client)))
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});