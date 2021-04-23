import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Header from '../Layout/Header';
import ChatBox from './ChatBox';
import Conversations from './Conversations';
import Users from './Users';
import NftList from './NftList';
import { globalChatTitle, drawerWidth, drawerMaxWidth } from '../Utilities/constants';
import { authenticationService } from '../Services/authenticationService';

const useStyles = makeStyles(theme => ({
  paper: {
    minHeight: '100vh',
    borderRadius: 0,
  },
  sidebar: {
    zIndex: 8,
  },
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
  },

  root: {
    display: 'flex',
    height: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      maxWidth: drawerMaxWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    maxWidth: drawerMaxWidth,
  },
  content: {
    flexGrow: 1,
    display: 'flex',
  },
}));


const Chat = (props) => {
  const { window } = props;
  const theme = useTheme();
  const classes = useStyles();

  const [scope, setScope] = useState(globalChatTitle);
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null);
  const [currentUser = {}, setCurrentUser] = useState(
    authenticationService.currentUserValue
  );
  const [currentUserId, setCurrentUserId] = useState(
    authenticationService.currentUserValue?.id
  );

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onLoggedIn = user => {
    setCurrentUser(user);
    setCurrentUserId(user?.id);
  };

  const onLoggedOut = () => {
    authenticationService.logout();
    setCurrentUser(undefined);
    setCurrentUserId(undefined);
  };

  const handleChange = (e, newVal) => {
    setTab(newVal);
  };

  const drawer = (
    <Grid item className={classes.sidebar}>
      <Paper className={classes.paper}>
        <Header currentUser={currentUser} onLoggedOut={onLoggedOut} />
        <Tabs
          onChange={handleChange}
          variant="fullWidth"
          value={tab}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Users" />
          <Tab label="Chats" />
          {authenticationService.currentUserValue && (
            <Tab label="My NFTs" />
          )}
        </Tabs>

        {tab === 0 && <Users setUser={setUser} setScope={setScope} />}
        {tab === 1 && (
          <Conversations setUser={setUser} setScope={setScope} />
        )}
        {tab === 2 && <NftList />}
      </Paper>
    </Grid>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <nav className={classes.drawer} aria-label="navigation">
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          {/* <div className={classes.toolbar} /> */}

          <Grid item md={12}>
            <ChatBox
              scope={scope}
              user={user}
              onLoggedIn={onLoggedIn}
              currentUser={currentUser}
              currentUserId={currentUserId}
              handleDrawerToggle={handleDrawerToggle}
            />
          </Grid>
        </main>
      </div>

      {/*
      <Grid container>
        <Grid item md={4} className={classes.sidebar}>
          <Paper className={classes.paper}>
            <Header currentUser={currentUser} onLoggedOut={onLoggedOut} />
            <Tabs
              onChange={handleChange}
              variant="fullWidth"
              value={tab}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Users" />
              <Tab label="Chats" />
              {authenticationService.currentUserValue && (
                <Tab label="My NFTs" />
              )}
            </Tabs>

            {tab === 0 && <Users setUser={setUser} setScope={setScope} />}
            {tab === 1 && (
              <Conversations setUser={setUser} setScope={setScope} />
            )}
            {tab === 2 && <NftList />}
          </Paper>
        </Grid>

        <Grid item md={8}>
          <ChatBox
            scope={scope}
            user={user}
            onLoggedIn={onLoggedIn}
            currentUser={currentUser}
            currentUserId={currentUserId}
          />
        </Grid>
      </Grid> */}
    </>
  );
};

export default Chat;
