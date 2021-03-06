const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const verify = require('../../utilities/verify-token');
const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const GlobalMessage = require('../../models/GlobalMessage');
const GlobalOffer = require('../../models/GlobalOffer');

const secretOrKey = process.env.SECRET_OR_KEY;
let jwtUser = null;

// Get global messages
router.get('/global', (req, res) => {
  GlobalMessage.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'from',
        foreignField: '_id',
        as: 'fromObj',
      },
    },
  ])
    .project({
      'fromObj.publicAddress': 0,
      'fromObj.__v': 0,
      'fromObj.date': 0,
    })
    .exec((err, messages) => {
      if (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
      } else {
        res.send(messages);
      }
    });
});

// Get global offers
router.get('/globaloffer', (req, res) => {
  GlobalOffer.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'from',
        foreignField: '_id',
        as: 'fromObj',
      },
    },
  ])
    .project({
      'fromObj.publicAddress': 0,
      'fromObj.__v': 0,
      'fromObj.date': 0,
    })
    .exec((err, messages) => {
      if (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
      } else {
        res.send(messages);
      }
    });
});

// Post global message
// Token verfication middleware
router
  .use(function(req, res, next) {
    try {
      jwtUser = jwt.verify(verify(req), secretOrKey);
      next();
    } catch (err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Unauthorized' }));
      res.sendStatus(401);
    }
  })
  .post('/global', (req, res) => {
    let message = new GlobalMessage({
      from: jwtUser.id,
      body: req.body.body,
    });

    req.io.sockets.emit('messages', req.body.body);

    message.save(err => {
      if (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Success' }));
      }
    });
  });

// Post global message
// Token verfication middleware
router
  .use(function(req, res, next) {
    try {
      jwtUser = jwt.verify(verify(req), secretOrKey);
      next();
    } catch (err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Unauthorized' }));
      res.sendStatus(401);
    }
  })
  .post('/globaloffer', (req, res) => {
    let message = new GlobalOffer({
      from: jwtUser.id,
      body: req.body.body,
    });

    const priceEqualZero = parseInt(req.body.body.price) === 0;

    req.io.sockets.emit('offers', req.body.body);
    GlobalOffer.find({ 'body.nft.tokenID': req.body.body.nft.tokenID })
      .deleteMany()
      .exec(err => {
        if (err) {
          console.log(err);
        } else if (priceEqualZero) {
          // dont create new item when price is 0, just remove old one
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Success' }));
        } else {
          message.save(err => {
            if (err) {
              console.log(err);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Failure' }));
              res.sendStatus(500);
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Success' }));
            }
          });
        }
      });
  });

// Get conversations list
router.get('/conversations', (req, res) => {
  let from = mongoose.Types.ObjectId(jwtUser.id);
  Conversation.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'recipients',
        foreignField: '_id',
        as: 'recipientObj',
      },
    },
  ])
    .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
    .project({
      'recipientObj.publicAddress': 0,
      'recipientObj.__v': 0,
      'recipientObj.date': 0,
    })
    .exec((err, conversations) => {
      if (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
      } else {
        res.send(conversations);
      }
    });
});

// Get messages from conversation
// based on to & from
router.get('/conversations/query', (req, res) => {
  let user1 = mongoose.Types.ObjectId(jwtUser.id);
  let user2 = mongoose.Types.ObjectId(req.query.userId);
  Message.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'to',
        foreignField: '_id',
        as: 'toObj',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'from',
        foreignField: '_id',
        as: 'fromObj',
      },
    },
  ])
    .match({
      $or: [
        { $and: [{ to: user1 }, { from: user2 }] },
        { $and: [{ to: user2 }, { from: user1 }] },
      ],
    })
    .project({
      'toObj.publicAddress': 0,
      'toObj.__v': 0,
      'toObj.date': 0,
      'fromObj.publicAddress': 0,
      'fromObj.__v': 0,
      'fromObj.date': 0,
    })
    .exec((err, messages) => {
      if (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
      } else {
        res.send(messages);
      }
    });
});

// Post private message
router.post('/', (req, res) => {
  let from = mongoose.Types.ObjectId(jwtUser.id);
  let to = mongoose.Types.ObjectId(req.body.to);

  Conversation.findOneAndUpdate(
    {
      recipients: {
        $all: [{ $elemMatch: { $eq: from } }, { $elemMatch: { $eq: to } }],
      },
    },
    {
      recipients: [jwtUser.id, req.body.to],
      lastMessage: req.body.body,
      date: Date.now(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
    function(err, conversation) {
      if (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
      } else {
        let message = new Message({
          conversation: conversation._id,
          to: req.body.to,
          from: jwtUser.id,
          body: req.body.body,
        });

        req.io.sockets.emit('messages', req.body.body);

        message.save(err => {
          if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Failure' }));
            res.sendStatus(500);
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                message: 'Success',
                conversationId: conversation._id,
              })
            );
          }
        });
      }
    }
  );
});

module.exports = router;
