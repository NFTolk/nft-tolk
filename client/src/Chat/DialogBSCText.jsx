import React from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';

export const DialogBSCText = () => {
    return (
        <>
            <DialogContentText id="alert-dialog-description">
                At this phase the app is limited to <a href="https://www.binance.org/en/smartChain" target="_blank" rel="noopener noreferrer">Binance Smart Chain (BSC)</a> Mainnet blockchain, so we don't meshup accounts from diferent networks. It could be expanded to use more blockchains later though.
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
                BSC Mainnet isn't available in Metamask be default, so you need to add it manually.
                It is pretty easy and quick config. Read this <a href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain" target="_blank" rel="noopener noreferrer">step-by-step instructions</a>.
            </DialogContentText>
        </>
    )
};

export default DialogBSCText;
