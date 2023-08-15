import React, { ReactNode, useContext, useState, createContext } from 'react';
import TitleLogo from '../../public/logo.svg';
// import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  return (
    <div className="navbar bg-primary-content border border-b-gray-300">
      <div className="flex-1">
        <a href="/" className="ml-4 normal-case">
          <img src={TitleLogo} className="" alt="AW Hackathon logo" />
        </a>
      </div>
      <div className="flex-none">{/* <ConnectButton /> */}</div>
    </div>
  );
};
