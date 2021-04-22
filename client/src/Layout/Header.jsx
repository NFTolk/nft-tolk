import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import logo from './logo.gif';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 0,
        display: 'flex',
        marginLeft: '-10px',
        transition: 'all .2s ease',
        zIndex: 10,
        "&:hover": {
            transform: 'scale(2.5)',
            marginLeft: '50px',
            position: 'relative',
            marginTop: '100px'
        },
    },
    userDropdown: {
        marginLeft: theme.spacing(2),
        padding: theme.spacing(1),
        [theme.breakpoints.down('xs')]: {
            marginLeft: 'auto',
        },
    },
    toolbar: {
        height: 100,
        zIndex: 5,
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logo: {
        width: '130px',
        height: '130px',
        borderRadius: '100%',
        display: 'flex',
        margin: '0 -10px -20px',
    },
    appBar: {
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0,0,0,.25)'
    },
    username: {
        overflow: 'hidden',
        width: '130px',
        textOverflow: 'ellipsis'
    }
}));

const Header = ({ currentUser, onLoggedOut }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleDropClose = () => {
        setDropdownOpen(false);
        setAnchorEl(null);
    };

    const handleDropOpen = event => {
        setDropdownOpen(true);
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        handleDropClose();
        onLoggedOut();
    }

    const arrowIcon = () => {
        if (dropdownOpen) {
            return <ArrowDropUpIcon />;
        }
        return <ArrowDropDownIcon />;
    };

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" color="transparent" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>

                    {/* <Tooltip title="About Us" aria-label="About Us" placement="right" arrow> */}
                        <Link href="https://hackerlink.io/en/Buidl/331" target="_blank" className={classes.title}>
                            <img src={logo} alt="Logo" className={classes.logo} />
                        </Link>
                    {/* </Tooltip> */}

                    {currentUser?.id ? (
                        <>
                            <Button
                                aria-owns={anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup="true"
                                onClick={handleDropOpen}
                                className={classes.userDropdown}
                                color="inherit"
                            >
                                <span className={classes.username}>
                                    {currentUser?.name}
                                </span>
                                {arrowIcon()}
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleDropClose}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : null}
                </Toolbar>

            </AppBar>
        </div>
    );
};

export default Header;
