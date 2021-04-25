import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";

import useHandleResponse from "../Utilities/handle-response";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  buyButton: {
    marginLeft: "auto !important",
  },
});

export default function OfferCard({ message }) {
  const handleResponse = useHandleResponse();
  const [nftDetails, setNftDetails] = React.useState({});
  const classes = useStyles();

  React.useEffect(() => {
    getNftDetails();
  }, []);

  const getNftDetails = (nftList) => {
    const offer = message.body.nft;
    if (!offer.url) return;

    return fetch(offer.url)
      .then(handleResponse)
      .then((nftMeta) => {
        setNftDetails({
          ...offer,
          ...nftMeta,
        });
      });
  };

  if (!nftDetails.name) return null;

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
          subheader="April 25, 2021"
        />
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={nftDetails.image}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {nftDetails.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
                {nftDetails.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <Button size="small" color="primary" className={classes.buyButton}>
            Buy for BNB {message.body.price}
          </Button>
        </CardActions>
      </Card>
    </ListItem>
  );
}
