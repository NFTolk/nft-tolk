const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/nft', (req, res) => {
  if (!req.query && !req.query.publicAddress) {
    return res.status(400).json('publicAddress query is required');
  } else {
    axios
      .get(
        `https://api.bscscan.com/api?module=account&action=tokennfttx&address=${req.query.publicAddress}&startblock=0&endblock=999999999&sort=asc&apikey=${process.env.BNB_SEARCH_API_KEY}`
      )
      .then(({ data }) => {
        // return list of nfts
        if (data.message === 'OK') {
          res.send(data.result);
        } else {
          res.send([]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
});

module.exports = router;
