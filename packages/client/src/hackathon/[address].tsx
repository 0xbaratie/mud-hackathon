import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./../MUDContext";
import { Header } from "./../components/Header";
import { Footer } from "./../components/Footer";
import { EventCard } from "./../components/EventCard";
import React, { useState } from "react";

export const HackathonPage: React.FC = () => {
  const {
    components: { Counter },
    systemCalls: { increment },
    network: { singletonEntity },
  } = useMUD();

  const [activeTab, setActiveTab] = useState(1); // Initial active tab is 2

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <>
      <Header />
      <div className="artboard artboard-horizontal phone-6">1024×320</div>
      <div className="tabs">
        <a
          className={`tab tab-lifted ${activeTab === 1 ? 'tab-active' : ''}`}
          onClick={() => handleTabClick(1)}
        >
          Overview
        </a> 
        <a
          className={`tab tab-lifted ${activeTab === 2 ? 'tab-active' : ''}`}
          onClick={() => handleTabClick(2)}
        >
          Prizes
        </a> 
        <a
          className={`tab tab-lifted ${activeTab === 3 ? 'tab-active' : ''}`}
          onClick={() => handleTabClick(3)}
        >
          Projects
        </a>
        <a
          className={`tab tab-lifted ${activeTab === 4 ? 'tab-active' : ''}`}
          onClick={() => handleTabClick(4)}
        >
          Submit
        </a>
      </div>
      <Footer />
    </>
  );
};
