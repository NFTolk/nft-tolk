import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { authenticationService } from '../Services/authenticationService';
import { Button } from '@material-ui/core';

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
  },
}));

const getNfts = () => {
  return fetch(
    `${process.env.REACT_APP_API_URL}/api/blockchain/nft?publicAddress=${authenticationService.currentUserValue.publicAddress}`
  ).then(response => response.json());
};

const NftList = props => {
  const classes = useStyles();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    getNfts().then(res => setNfts(res));
  }, []);

  return (
    <List className={classes.list}>
      {nfts?.length > 0 ? (
        <React.Fragment>
          {nfts.map((nft, i) => (
            <ListItem className={classes.listItem} key={i} button>
              {/* <ListItemAvatar className={classes.avatar}>
                <Avatar>{commonUtilites.getInitialsFromName(u.name)}</Avatar>
              </ListItemAvatar> */}
              <ListItemText
                className={classes.subheaderText}
                primary={`${nft.tokenName} Contract:`}
                secondary={nft.contractAddress}
              />
              <Button color="primary" variant="contained" size="small">
                Start discussion
              </Button>
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
