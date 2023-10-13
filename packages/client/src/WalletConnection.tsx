import React, { ReactNode, useState, createContext, useEffect } from 'react';
import { Button, Menu, MenuItem} from '@mui/material';
import './index.css';
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
    } else {
      setNetwork(`0x${chainIdNumber.toString(16)}`);
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
    if (isMetaMask) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        updateWallet(accounts);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.warn('WalletConnect is not available.');
    }
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
          <>
            <a 
              href={"https://komorebi88.notion.site/AW-Hack-doc-e82110e8c392409aadc3f5bee09239fc"} 
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="pl-2 pr-2 pt-2 pb-2 mr-2 font-bold text-sm">
                About AWHack
              </button>
            </a>
            {wallet.accounts.length > 0 && network === NETWORK_ID ? (
              
                <button
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  className="btn bg-[#333333] text-white rounded-lg"
                >
                  {(wallet.accounts[0] as string)?.slice(0, 5)}...
                  {(wallet.accounts[0] as string)?.slice(-5)}
                </button>
              
            ) : network === NETWORK_ID ? (
              
                <button
                  onClick={handleConnect}
                  disabled={!isMetaMask}
                  className="btn bg-[#333333] text-white rounded-lg"
                >
                  connect
                </button>
              
            ) : (
              
                <Button
                  variant="outlined"
                  onClick={switchToNetwork}
                  sx={{ color: 'red', borderColor: 'red' }} // Change text and border color to red
                >
                  Wrong Network
                </Button>
              
            )}
          </>
        </div>
      </div>
    
      {isMetaMask ? (
        wallet.accounts.length > 0 && network === NETWORK_ID ? (
          <>
            <walletContext.Provider value={{ wallet }}>{children}</walletContext.Provider>
          </>
        ) : (
          <>
            <walletContext.Provider value={{ wallet }}>{children}</walletContext.Provider>
          </>
        )
      ) : (
        <>
          <walletContext.Provider value={{ wallet }}>{children}</walletContext.Provider>
        </>
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
