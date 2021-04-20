const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const verify = require('../../utilities/verify-token');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const User = require('../../models/User');

const secretOrKey = process.env.SECRET_OR_KEY;

router.get('/', (req, res) => {
  User.aggregate()
    .project({
      password: 0,
      __v: 0,
      date: 0,
    })
    .exec((err, users) => {
      if (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
      } else {
        res.send(users);
      }
    });
});

router.get('/find', (req, res) => {
  // If a query string ?publicAddress=... is given, then filter results
	// const whereClause =
  // req.query && req.query.publicAddress
  //   ? {
  //       publicAddress: req.query.publicAddress
  //     }
  //   : undefined;
  res.send([]);

  User.aggregate()
    // .match(whereClause)
    .project({
      password: 0,
      __v: 0,
      date: 0,
    })
    .exec((err, users) => {
      if (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
      } else {
        res.send(users);
      }
    });
});

router.post('/', (req, res) => {
  const user = new User(req.body);
  res.json(user);
});

router.post('/register', (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              const payload = {
                id: user.id,
                name: user.name,
              };
              // Sign token
              jwt.sign(
                payload,
                secretOrKey,
                {
                  expiresIn: 31556926, // 1 year in seconds
                },
                (err, token) => {
                  if (err) {
                    console.log(err);
                  } else {
                    req.io.sockets.emit('users', user.username);
                    res.json({
                      success: true,
                      token: 'Bearer ' + token,
                      name: user.name,
                    });
                  }
                }
              );
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post('/login', (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const username = req.body.username;
  const password = req.body.password;
  // Find user by username
  User.findOne({ username }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ usernamenotfound: 'Username not found' });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
              name: user.name,
              username: user.username,
              userId: user._id,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: 'Password incorrect' });
      }
    });
  });
});

module.exports = router;
