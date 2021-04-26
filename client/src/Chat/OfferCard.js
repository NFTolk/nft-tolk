import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';

import useHandleResponse from '../Utilities/handle-response';
import { authenticationService } from '../Services/authenticationService';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    height: 420,
  },
  media: {
    height: 200,
  },
  buyButton: {
    marginLeft: 'auto !important',
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    height: 200,
    width: 300,
  },
  progressImg: {
    alignSelf: 'center',
  },
  placeholder: {
    height: 250,
  },
});

export default function OfferCard({ message }) {
  const handleResponse = useHandleResponse();
  const [nftDetails, setNftDetails] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const classes = useStyles();
  const offer = message.body.nft;

  React.useEffect(() => {
    setLoaded(true);
    getNftDetails();
  }, []);

  const getNftDetails = nftList => {
    if (!offer.url) return;
    return fetch(offer.url)
      .then(handleResponse)
      .then(nftMeta => {
        setNftDetails({
          ...offer,
          ...nftMeta,
        });
        setLoaded(false);
      });
  };

  if (!offer.url) return null;

  return (
    <ListItem alignItems="flex-start">
      <Card className={classes.root} elevation={2}>
        <CardHeader
          avatar={
            <Typography variant="h4" component="h4">
              💎
            </Typography>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="NFT Offer Posted"
          subheader={new Date(+message.date).toLocaleString('en-US', {
            hour12: false,
          })}
        />
        <CardActionArea>
          {loaded ? (
            <div className={classes.placeholder}>
              <div className={classes.progress}>
                <CircularProgress
                  className={classes.progressImg}
                  color="secondary"
                />
              </div>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {nftDetails.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {nftDetails.description}
                </Typography>
              </CardContent>
            </div>
          ) : (
            <>
              <CardMedia className={classes.media} image={nftDetails.image} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {nftDetails.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {nftDetails.description}
                </Typography>
              </CardContent>
            </>
          )}
        </CardActionArea>
        <CardActions>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <Button
            size="small"
            color="primary"
            disabled={!authenticationService.currentUserValue}
            className={classes.buyButton}
          >
            Buy for BNB {message.body.price}
          </Button>
        </CardActions>
      </Card>
    </ListItem>
  );
}
