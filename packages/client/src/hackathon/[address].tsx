import { useMUD } from './../MUDContext';
import { Header } from './../components/Header';
import { Footer } from './../components/Footer';
import HackathonOverview  from './../components/HackathonOverview';
import Timeline from './../components/Timeline';
import React, { useState } from 'react';

export const HackathonPage: React.FC = () => {
  const {
    components: { Counter },
    systemCalls: { increment },
    network: { singletonEntity },
  } = useMUD();

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const bgImage = 'https://beiz.jp/images_T/black/black_00053.jpg';

  const OverviewTabContent: React.FC = () => {
    return <HackathonOverview />;
  };

  const PrizesTabContent: React.FC = () => {
    return <div>Prizes タブのコンテンツ</div>;
  };

  const ProjectsTabContent: React.FC = () => {
    return <div>Projects タブのコンテンツ</div>;
  };

  const SubmitTabContent: React.FC = () => {
    return <div>Submit タブのコンテンツ</div>;
  };

  let activeTabContent;

  if (activeTab === 1) {
    activeTabContent = <OverviewTabContent />;
  } else if (activeTab === 2) {
    activeTabContent = <PrizesTabContent />;
  } else if (activeTab === 3) {
    activeTabContent = <ProjectsTabContent />;
  } else if (activeTab === 4) {
    activeTabContent = <SubmitTabContent />;
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
            Projects
          </a>
          <a
            className={`tab tab-lifted font-bold ${
              activeTab === 4 ? 'tab-active bg-white text-black' : 'text-white '
            }`}
            onClick={() => handleTabClick(4)}
          >
            Submit
          </a>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="w-3/4">{activeTabContent}</div>
        <Timeline />
      </div>
      <Footer />
    </>
  );
};
