# 🗯 NFTolk

This is prototype app for NFT chat app. We use it as working directory for BSC NFT & DEFI HACKATHON - RUSSIA & CIS GRANT.

Project details: https://hackerlink.io/en/Buidl/331
Hackathon details: https://hackerlink.io/en/Grant/RCIS/Round/1/detail

## Vision

🗯 NFTolk is simple way to communicate with NFT holders, create chat rooms for NFT fans, public & private rooms and more.

## Technical Details

High-level app architecture looks like this:

![NFTolk Acrhitecture](https://raw.githubusercontent.com/NFTolk/nft-tolk/master/assets/nft-infra.svg)

This is a full-stack chat application that can be up and running with just a few steps.
Its frontend is built with React.
The backend is built with Express.js and Node.js.
Real-time message broadcasting is developed using [Socket.IO](https://socket.io/).
Metamask is used to provide user unique ID and to sign access key with crypto [Related Article](https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial)


### How to run dev server

Prerequisites:
- You need mongodb up and running locally. The simplest way would be to start docker mongodb image
- Create `.env` file based on `.env-example` (for localhost MONGO_DB_URI might be `mongodb://127.0.0.1:27017`)

To install dev dependecies run these commands within project folder:
```sh
# install the dependencies of the Node.js server
npm install

# install the dependencies of the frontend
npm run client-install
```

Finally, all you have to do is simply run:
```sh
npm run dev
```

If this command fails, try installing the package [concurrently](https://www.npmjs.com/package/concurrently) globally by running `npm install -g concurrently` and then running the `dev` command.

You can have this application up and running with just a few steps because it has both the frontend and the backend in a single repository. Follow the steps below to do so.
