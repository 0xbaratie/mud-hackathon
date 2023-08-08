import React, { FC, useState, useEffect } from 'react';
import { useMUD } from '../MUDContext';
import VotingBox from '../../public/voting_box.svg';
import HackathonProjectCard from './HackathonProjectCard';
const imageURL =
  'https://storage.googleapis.com/ethglobal-api-production/projects%2F0wa8j%2Fimages%2FToronto_in_COVID-19_times_by_tour_boat.png';
const HackathonProjects = ({ hackathonId, phase }) => {
  const {
    network: { worldContract },
  } = useMUD();

  const [hackathonSubmitters, setHackathonSubmitters] = useState([]);
  useEffect(() => {
    (async () => {
      const hackathonPrize = await worldContract.getHackathonPrize(hackathonId);
      setHackathonSubmitters(hackathonPrize?.submitters);
    })();
  }, []);
  console.log(hackathonSubmitters);
  return (
    <div className="flex flex-wrap justify-center mb-40">
      {hackathonSubmitters &&
        hackathonSubmitters.map((submitter) => (
          <div key={submitter} className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2">
            <HackathonProjectCard hackathonId={hackathonId} submitter={submitter} phase={phase} />
          </div>
        ))}
    </div>
  );
};

export default HackathonProjects;
