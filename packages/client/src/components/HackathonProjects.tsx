import React, { FC } from 'react';
import VotingBox from '../../public/voting_box.svg';
import HackathonProjectCard  from './HackathonProjectCard';
const imageURL = "https://storage.googleapis.com/ethglobal-api-production/projects%2F0wa8j%2Fimages%2FToronto_in_COVID-19_times_by_tour_boat.png"
const HackathonProjects = () => {
  return (
    <div className="flex flex-wrap justify-center">
      <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2"><HackathonProjectCard /></div>
      <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2"><HackathonProjectCard /></div>
      <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2"><HackathonProjectCard /></div>
      <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2"><HackathonProjectCard /></div>
      <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2"><HackathonProjectCard /></div>
      <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2"><HackathonProjectCard /></div>
      <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2"><HackathonProjectCard /></div>
      <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2"><HackathonProjectCard /></div>
      <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3 p-2"><HackathonProjectCard /></div>
    </div>

  );  
};

export default HackathonProjects;
