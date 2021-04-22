import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import socketIOClient from "socket.io-client";
import classnames from "classnames";
import commonUtilites from "../Utilities/common";
import {
  useGetGlobalMessages,
  useSendGlobalMessage,
  useGetConversationMessages,
  useSendConversationMessage,
} from "../Services/chatService";
import LoginWithMetaMask from './LoginWithMetaMask';
import { globalChatTitle } from '../Utilities/constants';
import LoginInfoDialog from './LoginInfoDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  headerRow: {
    maxHeight: 60,
    zIndex: 5,
  },
  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100px",
    color: theme.palette.primary.dark,
    boxShadow: 'none',
    borderBottom: '1px solid rgba(0,0,0, .25)'
  },
  messageContainer: {
    height: "100%",
    display: "flex",
    alignContent: "flex-end",
  },
  messagesRow: {
    maxHeight: "calc(100vh - 184px)",
    overflowY: "auto",
  },
  newMessageRow: {
    width: "100%",
    padding: theme.spacing(0, 2, 1),
  },
  messageBubble: {
    backgroundColor: "white",
    borderRadius: "0 10px 10px 10px",
    maxWidth: "40em",
  },
  messageBubbleRight: {
    borderRadius: "10px 0 10px 10px",
    backgroundColor: '#edf6fd',
    borderColor: '#edf6fd',
    padding: '10px',
    marginRight: '10px'
  },
  inputRow: {
    display: "flex",
    alignItems: "flex-end",
  },
  input: {
    padding: '10px',
  },
  form: {
    width: "100%",
  },
  avatar: {
    margin: theme.spacing(1, 0),
  },
  listItem: {
    display: "flex",
    width: "100%",
  },
  listItemRight: {
    flexDirection: "row-reverse",
  },
  username: {
    fontWeight: 500,
    opacity: 0.3,
  }
}));

const ChatBox = ({ scope, user, currentUser, currentUserId, onLoggedIn, conversationId }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);

  const getGlobalMessages = useGetGlobalMessages();
  const sendGlobalMessage = useSendGlobalMessage();
  const getConversationMessages = useGetConversationMessages();
  const sendConversationMessage = useSendConversationMessage();

  let chatBottom = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    reloadMessages();
    scrollToBottom();
  }, [lastMessage, scope, conversationId]);

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_API_URL);
    socket.on("messages", (data) => setLastMessage(data));
  }, []);

  const reloadMessages = () => {
    if (scope === globalChatTitle) {
      getGlobalMessages().then((res) => {
        setMessages(res);
      });
    } else if (scope !== null && conversationId !== null) {
      getConversationMessages(user._id).then((res) => setMessages(res));
    } else {
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    chatBottom.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (scope === globalChatTitle) {
      sendGlobalMessage(newMessage).then(() => {
        setNewMessage("");
      });
    } else {
      sendConversationMessage(user._id, newMessage).then((res) => {
        setNewMessage("");
      });
    }
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.headerRow}>
        <Paper className={classes.paper} square elevation={2}>
          <Typography color="inherit" variant="h6">
            {scope}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Grid container className={classes.messageContainer}>
          <Grid item xs={12} className={classes.messagesRow}>
            {messages.length ? (
              <List>
                {messages.map((m) => (
                  <ListItem
                    key={m._id}
                    className={classnames(classes.listItem, {
                      [`${classes.listItemRight}`]:
                        m.fromObj[0]._id === currentUserId,
                    })}
                    alignItems="flex-start"
                  >
                    <ListItemAvatar className={classes.avatar}>
                      <Avatar>
                        {commonUtilites.getInitialsFromName(m.fromObj[0].name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      classes={{
                        root: classnames(classes.messageBubble, {
                          [`${classes.messageBubbleRight}`]:
                            m.fromObj[0]._id === currentUserId,
                        }),
                      }}
                      primary={
                        <>
                          <div className={classes.username}>{m.fromObj[0] && m.fromObj[0].name}</div>
                          <div>{m.body}</div>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : null}
            <div ref={chatBottom} />
          </Grid>
          <Grid item xs={12} className={classes.inputRow}>

            {!currentUserId ? (
              <Grid
                container
                alignItems="center"
              >
                <Grid item xs={11}>
                  <LoginWithMetaMask onLoggedIn={onLoggedIn} />
                </Grid>
                <Grid item xs={1}>
                  <LoginInfoDialog />
                </Grid>
              </Grid>
            ) : (
              <ChatInput
                handleSubmit={handleSubmit}
                classes={classes}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const ChatInput = ({
  handleSubmit,
  classes,
  newMessage,
  setNewMessage,
}) => {
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Grid
        container
        className={classes.newMessageRow}
        alignItems="flex-end"
      >
        <Grid item xs={12}>
          <TextField
            id="message"
            className={classes.input}
            placeholder="Say something..."
            margin="dense"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default ChatBox;
