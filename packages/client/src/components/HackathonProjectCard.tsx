import React, { ReactNode, useContext, useState, createContext } from 'react';
import VotingBox from '../../public/voting_box.svg';
import FullScreenModal from './FullScreenModal';
import VoteModal from './VoteModal';
const imageURL = "https://storage.googleapis.com/ethglobal-api-production/projects%2F0wa8j%2Fimages%2FToronto_in_COVID-19_times_by_tour_boat.png"
const HackathonProjects = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="mt-10" style={{width: "390px"}}>
      <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
        <VoteModal />
      </FullScreenModal>
      <a href="/project/[address]" >
        <div className="border rounded-md shadow-md h-[438px] relative">
          <img className="h-[228px] w-full object-cover" src={imageURL} alt="Image"></img>
          <div className="p-4">
            <p className="font-bold text-xl mb-1">LPU NAME SERVICE</p>
            <p className="text-sm">Name Service for students to claim their credentials and documents whitch will be issued as NFT by Universities, like certificates and documents</p>
          </div>
          <div className="flex absolute bottom-4 right-0 pr-4">
            <img src={VotingBox} className="" alt="Voting box icon" />
            <span className="ml-1 text-md font-bold">123</span>
          </div>
        </div>
      </a>
      <div className="flex justify-center items-center">
        <a onClick={openModal}>
          <button className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2 shadow-xl rounded-lg">Vote</button>
        </a>
      </div>
    </div>
  );
};

export default HackathonProjects;
