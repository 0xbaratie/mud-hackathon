import { useComponentValue } from '@latticexyz/react';
import { useMUD } from './MUDContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EventCard } from './components/EventCard';
import React, { useState } from 'react';

export const App = () => {
  const {
    components: { Counter },
    systemCalls: { increment },
    network: { singletonEntity },
  } = useMUD();
  const [activeTab, setActiveTab] = useState(1);

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
      <div className="bg-white mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8" style={{minHeight: "500px"}}>
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
      <Footer />
    </>
  );
};
