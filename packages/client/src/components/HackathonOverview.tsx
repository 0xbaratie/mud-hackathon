import { useMUD } from '../MUDContext';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useInterval } from '../hooks/useInterval';
import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';
import { PHASE } from '../constants/constants';

interface HackathonOverviewProps {
  uri: string;
  name: string;
  description: string;
  owner: string;
  hackathonId: string;
  winnerCount: number;
  voteNft: string;
  phase: number;
}

const HackathonOverview = ({
  uri,
  name,
  description,
  owner,
  hackathonId,
  winnerCount,
  voteNft,
  phase,
}: HackathonOverviewProps) => {
  const { showToast, toastType } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [myAddress, setMyAddress] = useState('');
  const [administrator, setAdministrator] = useState('');

  const {
    systemCalls: { deleteHackathon, deleteHackathonByAdmin },
    network: { signerOrProvider, worldContract },
  } = useMUD();

  useEffect(() => {
    (async () => {
      const _administrator = await worldContract.getAdministrator();
      setAdministrator(_administrator);
    })();
  });

  useInterval(() => {
    (async () => {
      const _myAddress = await signerOrProvider.getAddress();
      setMyAddress(_myAddress);
    })();
  }, 5000);

  if (shouldRedirect) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="ml-2 mr-2">
      <Toast toastType={toastType} />
      <div className="font-bold">
        <p className="text-2xl">{name}</p>
      </div>
      <div className="mt-1">
          <p className="break-words">{description}</p>
      </div>
      <div className="mt-4 flex items-center">
        <p className="text-xl mr-2">Number of winners</p>
        <p className="mt-1 font-bold">{winnerCount}</p>
      </div>
      <div className="mt-4 flex items-center">
        <p className="text-xl mr-2">Author</p>
        <p className="mt-1 font-bold">{owner}</p>
      </div>

      <div className="mt-4">
        <p className="text-xl">Voter</p>
        <p className="w-full mt-2">
          Optimism NFT (
          <a
            href={`https://optimistic.etherscan.io/address/${voteNft}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            {voteNft}
          </a>
          ) holders can vote.
        </p>
      </div>

      <button className="mt-6 bg-[#333333] text-white pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl mr-2">
        <a href={uri} target="_blank" rel="noopener noreferrer">
          Detail
        </a>
      </button>
      {myAddress === owner && phase === PHASE.PREPARE_PRIZE && (
        <button
          className="mt-6 bg-white text-[#333333] border border-[#333333] pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl"
          onClick={async (event) => {
            event.preventDefault();
            try {
              await deleteHackathon(hackathonId);
              showToast('success');
              setShouldRedirect(true);
            } catch (error) {
              console.error(error);
              showToast('error');
            }
          }}
        >
          Delete hackathon
        </button>
      )}
      {myAddress === administrator && phase === PHASE.PREPARE_PRIZE && (
        <button
          className="mt-6 bg-white text-[#333333] border border-[#333333] pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl"
          onClick={async (event) => {
            event.preventDefault();
            try {
              await deleteHackathonByAdmin(hackathonId);
              showToast('success');
              setShouldRedirect(true);
            } catch (error) {
              console.error(error);
              showToast('error');
            }
          }}
        >
          Delete hackathon
        </button>
      )}
    </div>
  );
};

export default HackathonOverview;
