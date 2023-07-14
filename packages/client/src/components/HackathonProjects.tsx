import React, { FC } from 'react';
import VotingBox from '../../public/voting_box.svg';
import HackathonProjectCard from './HackathonProjectCard';
const imageURL =
  'https://storage.googleapis.com/ethglobal-api-production/projects%2F0wa8j%2Fimages%2FToronto_in_COVID-19_times_by_tour_boat.png';
const HackathonProjects = ({ hackathonId, hackathonSubmitters }) => {
  console.log(hackathonSubmitters);
  return (
    <div className="flex flex-wrap justify-center">
      {hackathonSubmitters.map((submitter) => (
        <div key={submitter} className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2">
          <HackathonProjectCard hackathonId={hackathonId} submitter={submitter} />
        </div>
      ))}
    </div>
  );
};

export default HackathonProjects;
