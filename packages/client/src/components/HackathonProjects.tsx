import React, { FC } from 'react';
import VotingBox from '../../public/voting_box.svg';
import HackathonProjectCard  from './HackathonProjectCard';
const imageURL = "https://storage.googleapis.com/ethglobal-api-production/projects%2F0wa8j%2Fimages%2FToronto_in_COVID-19_times_by_tour_boat.png"
const HackathonProjects = () => {
  return (
    <div className="grid grid-cols-3">
      <HackathonProjectCard />
      <HackathonProjectCard />
      <HackathonProjectCard />
      <HackathonProjectCard />
      <HackathonProjectCard />
    </div>
  );  
};

export default HackathonProjects;
