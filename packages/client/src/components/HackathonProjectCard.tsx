import { useState, useEffect } from 'react';
import VotingBox from '../../public/voting_box.svg';
import FullScreenModal from './FullScreenModal';
import VoteModal from './VoteModal';
import { useMUD } from '../MUDContext';
import { PHASE } from '../constants/constants';
import { ToastError } from './ToastError';
import { ToastSuccess } from './ToastSuccess';

interface HackathonPrizesProps {
  hackathonId: string;
  submitter: string;
  phase: number;
}

const HackathonProjects = ({ hackathonId, submitter, phase }: HackathonPrizesProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

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

  useEffect(() => {
    (async () => {
      const submittion = await worldContract.getSubmission(hackathonId, submitter);
      // console.log('submittion: ', submittion);
      setName(submittion.name);
      setDescription(submittion.description);
      setURL(submittion.uri);
      setImageURL(submittion.imageUri);
      setVotes(submittion.votes.toNumber());
      setPrize(submittion.withdrawalPrize.toNumber());
    })();
  }, []);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [error, success]);

  return (
    <div className="mt-10 w-[390px] mx-auto">
      {error && <ToastError message={error} />}
      {success && <ToastSuccess message={success} />}
      <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
        <VoteModal
          onClose={closeModal}
          hackathonId={hackathonId}
          submitter={submitter}
          setError={setError}
          setSuccess={setSuccess}
        />
      </FullScreenModal>
      <a href={url} target="blank">
        <div className="border rounded-md shadow-md h-[438px] relative">
          <img className="h-[228px] w-full object-cover" src={imageURL} alt="Image"></img>
          <div className="p-4">
            <p className="font-bold text-xl mb-1">{name}</p>
            <p className="text-sm">{description}</p>
          </div>
          <div className="flex absolute bottom-4 right-0 pr-4">
            <img src={VotingBox} className="w-6" alt="Voting box icon" />
            <span className="ml-1 text-xl font-bold">{votes}</span>
          </div>
        </div>
      </a>
      {phase === PHASE.VOTING ? (
        <div className="flex justify-center items-center">
          <a onClick={openModal}>
            <button className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2 shadow-xl rounded-lg">
              Vote
            </button>
          </a>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <button
            className="mt-4 pl-10 pr-10 pt-2 pb-2 shadow-xl rounded-lg bg-gray-400 text-white"
            disabled
          >
            Vote
          </button>
        </div>
      )}
      {
        //TODO if address == owner
        prize > 0 && (
          <div className="flex justify-center items-center">
            <button
              className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2 shadow-xl rounded-lg"
              onClick={async (event) => {
                event.preventDefault();
                await withdrawPrize(hackathonId);
              }}
            >
              WithdrawPrize
            </button>
            
          </div>
        )
      }
    </div>
  );
};

export default HackathonProjects;
