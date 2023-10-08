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
    systemCalls: { deleteHackathon, deleteHackathonByAdmin, withdrawByOwner},
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
    <div className="ml-2 mr-8">
      <Toast toastType={toastType} />
      <div className="font-bold">
        <p className="text-2xl">{name}</p>
      </div>
      <div className="mt-1">
          <p className="break-words">{description}</p>
      </div>
      <button className="mt-6 bg-[#333333] text-white pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl mr-2">
        <a href={uri} target="_blank" rel="noopener noreferrer">
          Detail
        </a>
      </button>
      <div className="overflow-x-auto mt-8 h-48">
        <table className="table table-pin-rows">
          <tbody>
            <tr><td>Winners: {winnerCount}</td></tr>
            <tr><td>Author: {owner}</td></tr>
            <tr><td>Voter: 
          <a
            href={`https://optimistic.etherscan.io/address/${voteNft}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 ml-1 mr-1"
          >
            {voteNft }
          </a>
          holders can vote.</td></tr>
          </tbody>
        </table>
      </div>

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
      {myAddress === owner && phase === PHASE.END && (
        <button
          className="mt-6 bg-white text-[#333333] border border-[#333333] pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl"
          onClick={async (event) => {
            event.preventDefault();
            try {
              await withdrawByOwner(hackathonId);
              showToast('success');
            } catch (error) {
              console.error(error);
              showToast('error');
            }
          }}
        >
          Withdraw rest of prize
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
