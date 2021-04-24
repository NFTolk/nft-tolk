const express = require('express');
const router = express.Router();
const axios = require('axios');
const web3abi = require('web3-eth-abi');

const jsonInterface = {
  inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
  name: 'tokenURI',
  outputs: [{ internalType: 'string', name: '', type: 'string' }],
  stateMutability: 'view',
  type: 'function',
};

const getEthCallData = parameters =>
  web3abi.encodeFunctionCall(jsonInterface, parameters);

const lastUniqueBy = (arr, prop) => {
  return arr.reduceRight((accumulator, current) => {
    if (!accumulator.some(x => x[prop] === current[prop])) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
};

const byOwner = ownerId => val => val.to === ownerId;

const fetchAllNfts = nfts => {
  return Promise.all(
    nfts.map(nft => {
      return axios.post(process.env.MAINNET_URL, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [
          {
            from: nft.from,
            data: getEthCallData([nft.tokenID]),
            to: nft.contractAddress,
          },
          'latest',
        ],
      });
    })
  );
};

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
        if (data.message === 'OK' && data.result.length > 0) {
          const userNfts = lastUniqueBy(data.result, 'tokenID').filter(
            byOwner(req.query.publicAddress.toLowerCase())
          );
          fetchAllNfts(userNfts)
            .then(responses => {
              const nftsWithData = responses.map((response, index) => {
                const nftRaw = userNfts[index];
                // Decode answer
                const urlObject = web3abi.decodeLog(
                  [{ internalType: 'string', name: '', type: 'string' }],
                  response.data.result
                );
                return { ...nftRaw, url: urlObject[0] };
              });
              res.send(nftsWithData);
            })
            .catch(err => console.log(err));
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
