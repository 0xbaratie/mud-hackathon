import { useMUD } from '../MUDContext';
import { ethers } from 'ethers';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import HackathonOverview from '../components/HackathonOverview';
import HackathonPrizes from '../components/HackathonPrizes';
import HackathonProjects from '../components/HackathonProjects';
import Timeline from '../components/Timeline';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const bgImage = '../../../public/cover.png';

export const HackathonPage = () => {
  const { id } = useParams();
  const {
    network: { worldContract },
  } = useMUD();
  const bigNum = ethers.BigNumber.from(id);
  const paddedHexStr = '0x' + bigNum.toHexString().slice(2).padStart(64, '0');

  const [counter, setCounter] = useState(0); //only used for re-rendering HackathonSubmit
  const [activeTab, setActiveTab] = useState(1);
  const [name, setName] = useState('');
  const [uri, setUri] = useState('');
  const [owner, setOwner] = useState('');
  const [prizeToken, setPrizeToken] = useState('');
  const [phase, setPhase] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState(0);
  const [submitPeriod, setSubmitPeriod] = useState(0);
  const [votingPeriod, setVotingPeriod] = useState(0);
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(0);

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  useEffect(() => {
    (async () => {
      const hackathon = await worldContract.getHackathon(paddedHexStr);
      setName(hackathon.name);
      setUri(hackathon.uri);
      setOwner(hackathon.owner);
      setPrizeToken(hackathon.prizeToken);
      setPhase(hackathon.phase);
      setStartTimestamp(hackathon.startTimestamp);
      setSubmitPeriod(hackathon.submitPeriod);
      setVotingPeriod(hackathon.votingPeriod);
      setWithdrawalPeriod(hackathon.withdrawalPeriod);
    })();
  }, [counter]);

  const OverviewTabContent: React.FC = () => {
    return <HackathonOverview uri={uri} name={name} owner={owner}  />;
  };

  const PrizesTabContent: React.FC = () => {
    return <HackathonPrizes hackathonId={paddedHexStr} prizeToken={prizeToken} />;
  };

  const ProjectsTabContent: React.FC = () => {
    return (
      <HackathonProjects
        hackathonId={paddedHexStr}
        phase={phase}
        counter={counter}
        setCounter={setCounter}
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
    activeTabContent = <ProjectsTabContent />;
    containerClassName = 'w-full';
  }

  return (
    <>
      <Header />
      <div>
        <div>
          <img src={bgImage} className="w-full" />
        </div>
        <div className="ml-4 tabs bg-black bg-opacity-70">
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
            Projects
          </a>
        </div>
      </div>
      <div className="flex mt-6 p-6">
        <div className={containerClassName}>{activeTabContent}</div>
        {activeTab !== 3 && (
          <Timeline
            hackathonId={paddedHexStr}
            phase={phase}
            startTimestamp={startTimestamp}
            submitPeriod={submitPeriod}
            votingPeriod={votingPeriod}
            withdrawalPeriod={withdrawalPeriod}
            setPhase={setPhase}
          />
        )}
      </div>
      <Footer />
    </>
  );
};
