const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const User = require('../../models/User');

router.post('/', (req, res) => {
  const { signature, publicAddress } = req.body;
  if (!signature && !publicAddress) {
    return res
      .status(400)
      .json('Request should have signature and publicAddress');
  } else {
    User.findOne({ publicAddress }).then(user => {
      if (!user) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failure' }));
        res.sendStatus(500);
      } else {
        const msg = `I am signing my one-time nonce: ${user.nonce}`;

        // We now are in possession of msg, publicAddress and signature. We
        // will use a helper from eth-sig-util to extract the address from the signature
        const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
        const address = recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature,
        });

        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial publicAddress
        if (address.toLowerCase() === publicAddress.toLowerCase()) {
          user.nonce = Math.floor(Math.random() * 10000);
          user.save().then(user => {
            const payload = {
              id: user.id,
              name: user.name,
              publicAddress,
            };
            // Sign token
            jwt.sign(
              payload,
              process.env.SECRET_OR_KEY,
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
          });
        } else {
          res.status(401).send({
            error: 'Signature verification failed',
          });

          return null;
        }
      }
    });
  }
});

module.exports = router;
