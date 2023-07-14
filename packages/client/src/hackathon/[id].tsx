import { useMUD } from '../MUDContext';
import { ethers } from 'ethers';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import HackathonOverview from '../components/HackathonOverview';
import HackathonPrizes from '../components/HackathonPrizes';
import HackathonProjects from '../components/HackathonProjects';
import HackathonSubmit from '../components/HackathonSubmit';
import Timeline from '../components/Timeline';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useComponentValue } from '@latticexyz/react';

export const HackathonPage = () => {
  const { id } = useParams();
  const {
    components: { Hackathon, HackathonPrize },
    network: { singletonEntity },
  } = useMUD();
  const bigNum = ethers.BigNumber.from(id);
  const paddedHexStr = '0x' + bigNum.toHexString().slice(2).padStart(64, '0');
  const hackathon = useComponentValue(Hackathon, paddedHexStr);
  const hackathonPrize = useComponentValue(HackathonPrize, paddedHexStr);

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const bgImage = 'https://beiz.jp/images_T/black/black_00053.jpg';

  const OverviewTabContent: React.FC = () => {
    return <HackathonOverview uri={hackathon.uri} />;
  };

  console.log(hackathon.prizeToken);

  const PrizesTabContent: React.FC = () => {
    return (
      <HackathonPrizes
        hackathonId={paddedHexStr}
        deposit={hackathonPrize?.deposit ? Number(hackathonPrize.deposit) : 0}
        prizeToken={hackathon.prizeToken}
      />
    );
  };

  const SubmitTabContent: React.FC = () => {
    return <HackathonSubmit hackathonId={paddedHexStr} />;
  };

  const ProjectsTabContent: React.FC = () => {
    return (
      <HackathonProjects
        hackathonId={paddedHexStr}
        hackathonSubmitters={hackathonPrize.submitters}
      />
    );
  };

  let activeTabContent;
  let containerClassName = 'w-3/4';
  if (activeTab === 1) {
    activeTabContent = <OverviewTabContent />;
  } else if (activeTab === 2) {
    activeTabContent = <PrizesTabContent />;
  } else if (activeTab === 3) {
    activeTabContent = <SubmitTabContent />;
  } else if (activeTab === 4) {
    activeTabContent = <ProjectsTabContent />;
    containerClassName = 'w-full';
  }

  return (
    <>
      <Header />
      <div className="w-full h-60 relative" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="ml-4 tabs bg-black bg-opacity-70 absolute bottom-0 left-0 right-0">
          <a
            className={`tab tab-lifted font-bold ${
              activeTab === 1 ? 'tab-active bg-white text-black' : 'text-white '
            }`}
            onClick={() => handleTabClick(1)}
          >
            Overview
          </a>
          <a
            className={`tab tab-lifted font-bold ${
              activeTab === 2 ? 'tab-active bg-white text-black' : 'text-white '
            }`}
            onClick={() => handleTabClick(2)}
          >
            Prizes
          </a>
          <a
            className={`tab tab-lifted font-bold ${
              activeTab === 3 ? 'tab-active bg-white text-black' : 'text-white '
            }`}
            onClick={() => handleTabClick(3)}
          >
            Submit
          </a>
          <a
            className={`tab tab-lifted font-bold ${
              activeTab === 4 ? 'tab-active bg-white text-black' : 'text-white '
            }`}
            onClick={() => handleTabClick(4)}
          >
            Projects
          </a>
        </div>
      </div>
      <div className="flex mt-6 p-6">
        <div className={containerClassName}>{activeTabContent}</div>
        {activeTab !== 4 && (
          <Timeline
            hackathonId={paddedHexStr}
            phase={hackathon.phase}
            startTimestamp={hackathon.startTimestamp}
            submitPeriod={hackathon.submitPeriod}
            votingPeriod={hackathon.votingPeriod}
            withdrawalPeriod={hackathon.withdrawalPeriod}
          />
        )}
      </div>
      <Footer />
    </>
  );
};
