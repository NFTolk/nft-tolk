import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { authenticationService } from '../Services/authenticationService';
import useHandleResponse from '../Utilities/handle-response';
import DialogSell from './DialogSell';

const useStyles = makeStyles(theme => ({
  subheader: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  globe: {
    backgroundColor: theme.palette.primary.dark,
  },
  subheaderText: {
    color: theme.palette.primary.dark,
    width: '130px',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
  },
  list: {
    maxHeight: 'calc(100vh - 112px)',
    overflowY: 'auto',
  },
  avatar: {
    margin: theme.spacing(0, 3, 0, 1),
    width: '200px',
    height: '200px',
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2em',
  },
}));

const NftList = props => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  const handleResponse = useHandleResponse();

  useEffect(() => {
    setLoading(true);
    getOwnedNfts()
      .then(getNftDetails)
      .then(setNfts)
      .finally(() => setLoading(false));
  }, []);

  const getOwnedNfts = () => {
    const url = new URL(`${process.env.REACT_APP_API_URL}/api/blockchain/nft`);
    url.searchParams.set(
      'publicAddress',
      authenticationService.currentUserValue.publicAddress
    );

    return fetch(url).then(handleResponse);
  };

  const getNftDetails = nftList => {
    if (!nftList.length) return Promise.resolve([]);

    const nftsWithMetaRequests = nftList.map(el => {
      return fetch(el.url)
        .then(handleResponse)
        .then(nftMeta => {
          return {
            ...el,
            nftMeta,
          };
        });

      // TODO
      // if (el.url) {
      //   const url = new URL(url);
      //   do request
      // } else {
      //   return Promise.resolve(el);
      // }
    });

    return Promise.all(nftsWithMetaRequests);
  };

  if (loading)
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );

  return (
    <List className={classes.list}>
      {nfts?.length > 0 ? (
        <React.Fragment>
          {nfts.map((nft, i) => (
            <ListItem className={classes.listItem} key={i} button>
              <ListItemAvatar>
                <Avatar src={nft.nftMeta?.image} className={classes.avatar} />
              </ListItemAvatar>
              <ListItemText
                className={classes.subheaderText}
                primary={nft.nftMeta?.name}
                secondary={
                  <>
                    <span>{nft.nftMeta?.description}</span>
                    <br />
                    <DialogSell nft={nft} />
                  </>
                }
              />
            </ListItem>
          ))}
        </React.Fragment>
      ) : (
        <ListItem className={classes.listItem}>
          <div>You don't have any BSC NFTs yet</div>
        </ListItem>
      )}
    </List>
  );
};

export default NftList;
