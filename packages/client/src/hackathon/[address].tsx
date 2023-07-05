import { useMUD } from "./../MUDContext";
import { Header } from "./../components/Header";
import { Footer } from "./../components/Footer";
import React, { useState } from "react";
import CheckCircleIcon from "../../public/icon_check_circle.svg";
import NotFinishedIcon from "../../public/icon_not_finished.svg";



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

  const bgImage = "https://beiz.jp/images_T/black/black_00053.jpg";

  const OverviewTabContent: React.FC = () => {
    return (
      <div>
        Overview タブのコンテンツ
      </div>
    );
  };

  const PrizesTabContent: React.FC = () => {
    return (
      <div>
        Prizes タブのコンテンツ
      </div>
    );
  };

  const ProjectsTabContent: React.FC = () => {
    return (
      <div>
        Projects タブのコンテンツ
      </div>
    );
  };

  const SubmitTabContent: React.FC = () => {
    return (
      <div>
        Submit タブのコンテンツ
      </div>
    );
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
            className={`tab tab-lifted font-bold ${activeTab === 1 ? 'tab-active bg-white text-black' : 'text-white '}`}
            onClick={() => handleTabClick(1)}
          >
            Overview
          </a> 
          <a
            className={`tab tab-lifted font-bold ${activeTab === 2 ? 'tab-active bg-white text-black' : 'text-white '}`}
            onClick={() => handleTabClick(2)}
          >
            Prizes
          </a> 
          <a
            className={`tab tab-lifted font-bold ${activeTab === 3 ? 'tab-active bg-white text-black' : 'text-white '}`}
            onClick={() => handleTabClick(3)}
          >
            Projects
          </a>
          <a
            className={`tab tab-lifted font-bold ${activeTab === 4 ? 'tab-active bg-white text-black' : 'text-white '}`}
            onClick={() => handleTabClick(4)}
          >
            Submit
          </a>
        </div>
      </div>
      <div className="flex mt-4"> {/* Flex container to layout activeTabContent and the side menu */}
        <div className="w-3/4"> {/* activeTabContent takes up 3/4 of the width */}
          {activeTabContent}
        </div>
        <div className="w-1/4 relative h-100"> {/* Add 'relative' here */}
          <div className="mt-2">
            <div className="absolute">
              <img src={CheckCircleIcon} className=" -ml-2" alt="Check circle icon" />
            </div>
            <div className="pl-4 z-0 relative">
              <h2 className="font-bold">Creating the hackathon project</h2>
              <p className="text-gray-500">July 3, 2023, 4:23pm UTC</p>            
            </div>
          </div>
          <div className="mt-8">
            <div className="absolute">
              <img src={CheckCircleIcon} className=" -ml-2" alt="Check circle icon" />
            </div>
            <div className="pl-4 z-0 relative">
              <h2 className="font-bold">Creating the hackathon project</h2>
              <p className="text-gray-500">July 3, 2023, 4:23pm UTC</p>            
            </div>
          </div>
          <div className="mt-8">
            <div className="absolute">
              <img src={NotFinishedIcon} className=" -ml-2" alt="Check circle icon" />
            </div>
            <div className="pl-4 z-0 relative">
              <h2 className="font-bold text-[#4D4D4D]">Creating the hackathon project</h2>
              <p className="text-gray-500">July 3, 2023, 4:23pm UTC</p>            
            </div>
          </div>
          <div className="mt-8">
            <div className="absolute">
              <img src={NotFinishedIcon} className=" -ml-2" alt="Check circle icon" />
            </div>
            <div className="pl-4 z-0 relative">
              <h2 className="font-bold text-[#4D4D4D]">Creating the hackathon project</h2>
              <p className="text-gray-500">July 3, 2023, 4:23pm UTC</p>            
            </div>
          </div>
          
        </div>

      </div>
      <Footer />
    </>
  );
};
