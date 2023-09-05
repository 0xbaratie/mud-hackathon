import React, { ReactNode, useContext, useState, createContext, useEffect } from 'react';
import { Button, Container, Grid, SvgIcon, Typography, Menu, MenuItem, Box } from '@mui/material';
import MetaMaskIcon from './MetaMaskIcon';
import './index.css';
import { ethers } from 'ethers';
import TitleLogo from '../public/logo.svg';

const chainIdFromEnv = import.meta.env.VITE_CHAIN_ID; // Gets the value from .env with Vite
const chainIdNumber = Number(chainIdFromEnv);
const NETWORK_ID = `0x${chainIdNumber.toString(16)}`;

let injectedProvider = false;

if (typeof window.ethereum !== 'undefined') {
  injectedProvider = true;
}

const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false;
console.log(isMetaMask);

export const walletContext = createContext<any | null>(null);

type Props = {
  children: ReactNode;
};
const WalletConnection = ({ children }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [wallet, setWallet] = useState({ accounts: [] });
  const [network, setNetwork] = useState<string>('');

  // Fetch the current network when the component is mounted
  useEffect(() => {
    (async () => {
      handleConnect();
    })();
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_chainId' }).then((currentChainId: string) => {
        setNetwork(currentChainId);
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setNetwork(chainId);
      });
    }
    return () => {
      // Clean up the event listener when the component is unmounted
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', setNetwork);
      }
    };
  }, []);

  const switchToNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_ID }],
      });
    } catch (switchError) {
      console.error(switchError);
    }
  };

  const updateWallet = async (accounts: any) => {
    setWallet({ accounts });
  };

  const handleConnect = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    updateWallet(accounts);
  };
  const handleDisconnect = async () => {
    await window.ethereum.request({
      method: 'eth_requestAccounts',
      params: [{ eth_accounts: {} }],
    });
    updateWallet([]);
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="navbar bg-primary-content border border-b-gray-300">
        <div className="flex-1 ml-2">
          <a href="/" className="ml-4 normal-case">
            <img src={TitleLogo} className="" alt="AW Hackathon logo" />
          </a>
        </div>
        <div className="flex-none mr-4">
          {wallet.accounts.length > 0 && network === NETWORK_ID ? (
            <>
              <Button
                variant="outlined"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                startIcon={<SvgIcon component={MetaMaskIcon} viewBox="0 0 300 300" />}
              >
                {(wallet.accounts[0] as string)?.slice(0, 5)}...
                {(wallet.accounts[0] as string)?.slice(-5)}
              </Button>
            </>
          ) : network === NETWORK_ID ? (
            <>
              <Button
                variant="outlined"
                onClick={handleConnect}
                startIcon={<SvgIcon component={MetaMaskIcon} viewBox="0 0 300 300" />}
                disabled={!isMetaMask}
              >
                connect
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={switchToNetwork}
                startIcon={<SvgIcon component={MetaMaskIcon} viewBox="0 0 300 300" />}
                sx={{ color: 'red', borderColor: 'red' }} // Change text and border color to red
              >
                Wrong Network
              </Button>
            </>
          )}
        </div>
      </div>
    
        {isMetaMask ? (
          wallet.accounts.length > 0 && network === NETWORK_ID ? (
            <>
              <walletContext.Provider value={{ wallet }}>{children}</walletContext.Provider>
            </>
          ) : (
            <></>
          )
        ) : (
          <div className="mt-8">Please Install Metamask</div>
        )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
      </Menu>
    </>
  );
};

export default WalletConnection;
