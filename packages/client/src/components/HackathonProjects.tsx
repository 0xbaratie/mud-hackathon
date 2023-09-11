import React, { FC, useState, useEffect } from 'react';
import { useMUD } from '../MUDContext';
import VotingBox from '../../public/voting_box.svg';
import HackathonProjectCard from './HackathonProjectCard';
import FullScreenModal from './FullScreenModal';
import HackathonSubmit from './HackathonSubmit';
import { PHASE } from '../constants/constants';
import { useInterval } from '../hooks/useInterval';
import VoteNone from './VoteNone';

const imageURL =
  'https://storage.googleapis.com/ethglobal-api-production/projects%2F0wa8j%2Fimages%2FToronto_in_COVID-19_times_by_tour_boat.png';
interface HackathonProjectsProps {
  hackathonId: string;
  phase: number;
}

const HackathonProjects = ({ hackathonId, phase }: HackathonProjectsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const {
    network: { worldContract },
  } = useMUD();

  const [hackathonSubmitters, setHackathonSubmitters] = useState([]);
  useInterval(() => {
    (async () => {
      const hackathonPrize = await worldContract.getHackathonPrize(hackathonId);
      setHackathonSubmitters(hackathonPrize?.submitters);
    })();
  }, 5000);

  return (
    <>
      <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
        <HackathonSubmit onClose={closeModal} hackathonId={hackathonId} />
      </FullScreenModal>

      <div className="flex flex-wrap justify-center mb-20">
        {hackathonSubmitters &&
          hackathonSubmitters.map((submitter) => (
            <div key={submitter} className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2">
              <HackathonProjectCard hackathonId={hackathonId} submitter={submitter} phase={phase} />
            </div>
          ))
        }
        <VoteNone hackathonId={hackathonId} phase={phase} />
      </div>
      {phase === PHASE.HACKING ? (
        <div className="text-center mb-10">
          <a onClick={openModal}>
            <button className="btn bg-[#333333] text-white rounded-lg">Submit project</button>
          </a>
        </div>
      ) : (
        <div className="text-center mb-10">
          <button
            className="mt-4 text-white pl-10 pr-10 pt-2 pb-2 shadow-xl rounded-lg bg-gray-400"
            disabled
          >
            Submit project
          </button>
        </div>
      )}
    </>
  );
};

export default HackathonProjects;
