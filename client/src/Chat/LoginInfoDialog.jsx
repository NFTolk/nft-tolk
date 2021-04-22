import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const LoginInfoDialog = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>

      <IconButton type="submit" onClick={handleClickOpen}>
        <HelpOutlineIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}
      >
        <DialogTitle id="alert-dialog-title">{"How I can use it?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Metamask is used here to create and access account in secure way. <br />
            You can <a href="https://metamask.io/" target="_blank">install it here</a>.
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            At this phase the app is limited to <a href="https://www.binance.org/en/smartChain" target="_blank">Binance Smart Chain (BSC)</a> blockchain, so we don't meshup accounts from diferent networks. It could be expanded to use more blockchains later though.
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            BSC isn't available in Metamask be default, so you need to add it manually.
            It is pretty easy and quick config. You can find step-by-step instructions <a href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain" target="_blank">here</a>.
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            <br />
            <hr />
            <br />
            <p>
              Read about the project and support it if you like it with a vote: <a href="https://hackerlink.io/en/Buidl/331" target="_blank">https://hackerlink.io/en/Buidl/331</a>
            </p>
            <p>
              Project is open-sourced and can be found on github: <a href="https://github.com/NFTolk" target="_blank">https://github.com/NFTolk</a>
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Super!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LoginInfoDialog;