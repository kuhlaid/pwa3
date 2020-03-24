/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// include NPM packages
const express = require('express'); // include the Express js framework (https://expressjs.com/)
const bodyParser = require('body-parser');  // incldue Node.js body parsing middleware - Parse incoming request bodies in middleware before your handlers (https://www.npmjs.com/package/body-parser)
const fs = require('fs'); // include file system module (https://nodejs.org/api/fs.html)
const app = express();  // creates an Express application

// This serves static files from the application build directory
app.use(express.static(__dirname + '/build')); 

app.use(bodyParser.json()); // returns middleware that only parses json
app.use(bodyParser.urlencoded({extended: true}));

// if the user is requesting the root URL or index.html URL, then load the index.html script
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// this route provides an API to show all events
app.get('/api/getAll', (req, res) => {
  let options = {
    root: __dirname + '/server-data/'
  };

  // this pulls event entries from a static JSON file (on production we would want this to come from an ajax call the a PHP script or something pulling data from our database in the cloud)
  const fileName = 'events.json';
  res.sendFile(fileName, options, (err) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
  });
});

// provides an API to add an event
app.post('/api/add', (req, res) => {
  let jsonFile = __dirname + '/server-data/events.json';
  let newEvent = req.body;
  console.log('Adding new event:', newEvent);
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let events = JSON.parse(data);
    events.push(newEvent);
    let eventsJson = JSON.stringify(events, null, 2);
    fs.writeFile(jsonFile, eventsJson, err => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      // You could also respond with the database json to save a round trip
      res.sendStatus(200);
    });
  });
});

// API to delete an event
app.post('/api/delete', (req, res) => {
  let jsonFile = __dirname + '/server-data/events.json';
  let id = req.body.id;
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let events = JSON.parse(data);
    let index = events.findIndex(event => event.id == id);
    events.splice(index, 1);

    let eventsJson = JSON.stringify(events, null, 2);

    fs.writeFile(jsonFile, eventsJson, err => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

const server = app.listen(8081, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});