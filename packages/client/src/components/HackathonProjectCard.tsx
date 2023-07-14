import React, { ReactNode, useContext, useState, useEffect } from 'react';
import VotingBox from '../../public/voting_box.svg';
import FullScreenModal from './FullScreenModal';
import VoteModal from './VoteModal';
import { useComponentValue, useEntityQuery } from '@latticexyz/react';
import { useMUD } from '../MUDContext';

const imageURL =
  'https://storage.googleapis.com/ethglobal-api-production/projects%2F0wa8j%2Fimages%2FToronto_in_COVID-19_times_by_tour_boat.png';

const HackathonProjects = ({ hackathonId, submitter, phase }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  console.log('submitter', submitter);
  const {
    network: { worldContract },
    systemCalls: { withdrawPrize },
  } = useMUD();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [votes, setVotes] = useState(0);
  const [prize, setPrize] = useState(0);

  //TODO
  useEffect(() => {
    (async () => {
      const submittion = await worldContract.getSubmission(hackathonId, submitter);
      console.log('submittion: ', submittion);
      setName(submittion.name);
      setDescription(submittion.description);
      setURL(submittion.uri);
      setImageURL(submittion.imageUri);
      setVotes(submittion.votes.toNumber());
      setPrize(submittion.withdrawalPrize.toNumber());
    })();
  }, []);

  return (
    <div className="mt-10 w-[390px] mx-auto">
      <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
        <VoteModal hackathonId={hackathonId} submitter={submitter} />
      </FullScreenModal>
      <a href={url} target="blank">
        <div className="border rounded-md shadow-md h-[438px] relative">
          <img className="h-[228px] w-full object-cover" src={imageURL} alt="Image"></img>
          <div className="p-4">
            <p className="font-bold text-xl mb-1">{name}</p>
            <p className="text-sm">{description}</p>
          </div>
          <div className="flex absolute bottom-4 right-0 pr-4">
            <img src={VotingBox} className="" alt="Voting box icon" />
            <span className="ml-1 text-md font-bold">{votes}</span>
          </div>
        </div>
      </a>
      {phase === 4 && (
        <div className="flex justify-center items-center">
          <a onClick={openModal}>
            <button className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2 shadow-xl rounded-lg">
              Vote
            </button>
          </a>
        </div>
      )}
      {
        //TODO if address == owner
        prize > 0 && (
          <div className="flex justify-center items-center">
            <a onClick={openModal}>
              <button
                className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2 shadow-xl rounded-lg"
                onClick={async (event) => {
                  event.preventDefault();
                  await withdrawPrize(hackathonId);
                }}
              >
                WithdrawPrize
              </button>
            </a>
          </div>
        )
      }
    </div>
  );
};

export default HackathonProjects;
