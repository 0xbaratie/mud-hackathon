import { useState, useEffect, useContext} from 'react';
import VotingBox from '../../public/voting_box.svg';
import { useMUD } from '../MUDContext';
import { PHASE } from '../constants/constants';
import { ToastError } from './ToastError';
import { walletContext } from '../WalletConnection'; 

interface HackathonPrizesProps {
  hackathonId: string;
  submitter: string;
  phase: number;
  votesNum: Record<string, number>;
  setVotesNum: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const HackathonProjects = ({ hackathonId, submitter, phase, votesNum, setVotesNum}: HackathonPrizesProps) => {
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
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  const handleVoteIncrease = () => {
      setVotesNum(prevVotes => ({
          ...prevVotes,
          [submitter]: (prevVotes[submitter] || 0) + 1
      }));
  };

  
const handleVoteDecrease = () => {
  if (votesNum[submitter] <= 0) {
    setError("You can't reduce votes below zero.");
    return;
  }
  setVotesNum(prevVotes => ({
    ...prevVotes,
    [submitter]: prevVotes[submitter] - 1
  }));
};

const { wallet } = useContext(walletContext)
const connectedWalletAddress = wallet?.accounts?.[0];

return (
    <div className="mt-10 w-[390px] mx-auto">
      {error && <ToastError message={error} />}
      <a href={url} target="blank">
        <div className="border rounded-md shadow-md h-[438px] relative">
          <img className="h-[228px] w-full object-cover" src={imageURL} alt="Image"></img>
          <div className="p-4">
            <p className="font-bold text-xl mb-1 break-words">{name.length > 40 ? `${name.slice(0, 40)}...` : name}</p>
            <p className="text-xs break-words">{description.length > 280 ? `${description.slice(0, 280)}...` : description}</p>
          </div>
          <div className="flex absolute bottom-4 right-0 pr-4">
            <img src={VotingBox} className="w-6" alt="Voting box icon" />
            <span className="ml-2 text-xl font-bold">{votes}</span>
          </div>
        </div>
      </a>
      {phase === PHASE.VOTING ? (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={handleVoteDecrease}
            className="font-bold pl-6 pr-6 pt-2 pb-2 shadow-xl rounded-lg"
          >
            -
          </button>
          <span className="text-xl font-bold">{votesNum[submitter] || 0}</span>
          <button
            onClick={handleVoteIncrease}
            className="font-bold pl-6 pr-6 pt-2 pb-2 shadow-xl rounded-lg"
          >
            +
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={handleVoteDecrease}
            className="font-bold pl-6 pr-6 pt-2 pb-2 shadow-xl rounded-lg bg-gray-400"
            disabled
          >
            -
          </button>
          <span className="text-xl font-bold">{votesNum[submitter] || 0}</span>
          <button
            onClick={handleVoteIncrease}
            className="font-bold pl-6 pr-6 pt-2 pb-2 shadow-xl rounded-lg bg-gray-400"
            disabled
          >
            +
          </button>
        </div>
      )}
      {
        connectedWalletAddress === submitter.toLowerCase() && prize > 0 && phase === PHASE.WITHDRAWING && (
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
