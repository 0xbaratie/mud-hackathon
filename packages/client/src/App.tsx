import { useComponentValue } from '@latticexyz/react';
import { useMUD } from './MUDContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EventCards } from './components/EventCards';
import React, { useState } from 'react';
import { SyncState } from '@latticexyz/network';

export const App = () => {
  return (
    <>
      <Header />
      <div className="text-center mt-12 mb-6">
        <h1 className="font-bold text-3xl">
          Autonomous World <br /> hackathons for future
        </h1>
        <p className="text-[#9D9D9D] text-xl mt-4 mb-8">
          Build products, practice skills, learn technologies, win prizes, and grow your network
        </p>
      </div>

      <EventCards />

      <Footer />
    </>
  );
};
