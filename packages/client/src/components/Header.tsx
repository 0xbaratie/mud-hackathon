import React, { ReactNode, useContext, useState, createContext } from 'react';
import FullScreenModal from './FullScreenModal';
import HackathonForm from './HackathonForm';
import TitleLogo from '../../public/logo.svg';

import { ConnectButton } from '@rainbow-me/rainbowkit';


export const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
          <ConnectButton />
        </ul>
      </div>
    </div>
  );
};
