import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Header from '../Layout/Header';
import ChatBox from './ChatBox';
import Conversations from './Conversations';
import Users from './Users';

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
}));

const Chat = () => {
    const [scope, setScope] = useState('Global Chat');
    const [tab, setTab] = useState(0);
    const [user, setUser] = useState(null);
    const classes = useStyles();

    const handleChange = (e, newVal) => {
        setTab(newVal);
    };

    return (
        <React.Fragment>
            <Grid container>
                <Grid item md={4} className={classes.sidebar}>
                    <Paper className={classes.paper}>

                        <Header />
                        <Tabs
                            onChange={handleChange}
                            variant="fullWidth"
                            value={tab}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label="Users" />
                            <Tab label="Chats" />
                        </Tabs>

                        {tab === 0 && (
                            <Users setUser={setUser} setScope={setScope} />
                        )}
                        {tab === 1 && (
                            <Conversations
                                setUser={setUser}
                                setScope={setScope}
                            />
                        )}
                    </Paper>
                </Grid>

                <Grid item md={8}>
                    <ChatBox scope={scope} user={user} />
                </Grid>

            </Grid>
        </React.Fragment>
    );
};

export default Chat;
