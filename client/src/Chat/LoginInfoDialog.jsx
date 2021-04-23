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

import DialogBSCText from './DialogBSCText';

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
        <HelpOutlineIcon fontSize="large" />
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
            You can <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">install it here</a>.
          </DialogContentText>

          <DialogBSCText />

          <DialogContentText id="alert-dialog-description">
            <br />
            <hr />
            <br />
            <p>
              Read about the project and support it if you like it with a vote: <a href="https://hackerlink.io/en/Buidl/331" target="_blank" rel="noopener noreferrer">https://hackerlink.io/en/Buidl/331</a>
            </p>
            <p>
              Project is open-sourced and can be found on github: <a href="https://github.com/NFTolk" target="_blank" rel="noopener noreferrer">https://github.com/NFTolk</a>
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
