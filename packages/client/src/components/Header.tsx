import React, { ReactNode, useContext, useState, createContext } from 'react';
import { Button, Container, Grid, SvgIcon, Typography, Menu, MenuItem, Box } from '@mui/material';
import MetaMaskIcon from '../MetaMaskIcon';
import FullScreenModal from './FullScreenModal';
import HackathonForm from './HackathonForm';
import TitleLogo from '../../public/logo.svg';

let injectedProvider = false;

if (typeof window.ethereum !== 'undefined') {
  injectedProvider = true;
}

const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false;
console.log(isMetaMask);

export const walletContext = createContext<any | null>(null);

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [wallet, setWallet] = useState({ accounts: [] });
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
    <div className="navbar bg-primary-content border border-b-gray-300">
      <div className="flex-1">
        <a href="/" className="ml-4 normal-case">
          <img src={TitleLogo} className="" alt="AW Hackathon logo" />
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li className="text-black font-bold">
            <a onClick={openModal}>Create a hackathon</a>
          </li>

          <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
            <HackathonForm />
          </FullScreenModal>
          <li className="text-black">
            {wallet.accounts.length > 0 ? (
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
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={handleConnect}
                  startIcon={<SvgIcon component={MetaMaskIcon} viewBox="0 0 300 300" />}
                  disabled={!isMetaMask}
                >
                  Connect
                </Button>
              </>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};