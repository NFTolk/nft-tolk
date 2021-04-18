const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

const users = require('./routes/api/users');
const messages = require('./routes/api/messages');

const app = express();

// Port that the webserver listens to
const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

const io = require('socket.io').listen(server);
io.origins([
  'http://localhost:3000',
  'http://localhost:5000',
  'https://nft-tolk.herokuapp.com',
]);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Body Parser middleware to parse request bodies
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Database configuration
const db = process.env.MONGO_DB_URI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Successfully Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);

// Assign socket object to every request
app.use(function(req, res, next) {
  req.io = io;
  next();
});

// Routes
app.use('/api/users', users);
app.use('/api/messages', messages);
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});
