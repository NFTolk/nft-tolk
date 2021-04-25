import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSendGlobalNftOffer } from '../Services/chatService';

export default function FormDialog({ nft }) {
  const [open, setOpen] = React.useState(false);
  const [newNftOfferPrice, setNewNftOfferPrice] = React.useState('');
  const sendGlobalNftOffer = useSendGlobalNftOffer();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!newNftOfferPrice) return;
    sendGlobalNftOffer({ price: newNftOfferPrice, nft }).then(() => {
      setNewNftOfferPrice('');
    });
    setOpen(false);
  };

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={handleClickOpen}
      >
        Sell NFT
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">NFT sell</DialogTitle>
        <DialogContent>
          <DialogContentText>Please set the selling price</DialogContentText>
          <TextField
            autoFocus
            value={newNftOfferPrice}
            onChange={e => setNewNftOfferPrice(e.target.value)}
            margin="dense"
            id="name"
            label="Sell BNC price"
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
