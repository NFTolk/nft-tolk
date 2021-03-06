import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from "notistack";

import getWeb3 from "../Utilities/getWeb3";
import { currentUserSubject } from "../Services/authenticationService";
import metamaskLogo from './metamask-logo.webp';
import WrongNetworkDialog from './WrongNetworkDialog'

const useStyles = makeStyles(theme => ({
    metamaskLogo: {
        width: 30,
        height: 30,
        marginRight: 20
    },
    buttonWrapper: {
        padding: '1.5em',
        width: '100%',
    },
    button: {
        width: '100%',
        fontSize: '1.5em',
        borderWidth: '2px !important'
    }
}));

const networkIdBSC = 56;

export default function LoginWithMetaMask({ onLoggedIn }) {
    const [loading, setLoading] = React.useState(false);
    const [wrongNetworkError, setWrongNetworkError] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
        setWrongNetworkError(false);
    }

    const login = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            const coinbase = await web3.eth.getCoinbase();
            if (!coinbase) {
                enqueueSnackbar("Please activate MetaMask first.", {
                    variant: "info",
                });
                return;
            }

            const networkId = await web3.eth.net.getId();
            // ATM we support only BSC network
            if (networkId !== networkIdBSC) {
                setWrongNetworkError(true);
                return;
            }

            const publicAddress = coinbase.toLowerCase();
            setLoading(true);

            // Look if user with current publicAddress is already present on backend
            fetch(
                `${process.env.REACT_APP_API_URL}/api/users/find?publicAddress=${publicAddress}`
            )
                .then((response) => response.json())
                // If yes, retrieve it. If no, create it.
                .then((users) => {
                    return users.length ? users[0] : handleSignup(publicAddress);
                })
                // Popup MetaMask confirmation modal to sign message
                .then(handleSignMessage)
                // Send signature to backend on the /auth route
                .then(handleAuthenticate)
                .then((user) => {
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    currentUserSubject.next(user);
                    return user;
                })
                .then(onLoggedIn)
                .catch((err) => {
                    window.alert(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            // Catch any errors for any of the above operations.
            enqueueSnackbar("You need to allow MetaMask", {
                variant: "info",
            });
            console.error(error);
        }
    };

    const handleSignMessage = async ({ publicAddress, nonce }) => {
        try {
            const web3 = await getWeb3();
            const signature = await web3.eth.personal.sign(
                `I am signing my one-time nonce: ${nonce}`,
                publicAddress,
                "" // MetaMask will ignore the password argument here
            );

            return { publicAddress, signature };
        } catch (err) {
            throw new Error("You need to sign the message to be able to log in.");
        }
    };

    const handleAuthenticate = ({ publicAddress, signature }) => {
        return fetch(`${process.env.REACT_APP_API_URL}/api/auth`, {
            body: JSON.stringify({ publicAddress, signature }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        }).then((response) => response.json());
    };

    const handleSignup = (publicAddress) => {
        return fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
            body: JSON.stringify({ publicAddress }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        }).then((response) => response.json());
    };

    const classes = useStyles();

    return (
        <div className={classes.buttonWrapper}>
            <Button
                color="primary"
                variant="contained"
                size="large"
                onClick={login}
                variant="outlined"
                className={classes.button}
                startIcon={
                    <>
                        <img src={metamaskLogo} alt="Metamask Logo" className={classes.metamaskLogo} />
                    </>
                }
            >
                {loading ? (
                    <>Loading...</>
                ) : (
                    <>Join with MetaMask</>
                )}
            </Button>

            <WrongNetworkDialog isOpen={wrongNetworkError} handleClose={handleClose} />
        </div>
    );
}
