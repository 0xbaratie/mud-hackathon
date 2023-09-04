import { useState, useEffect } from 'react';
import { useMUD } from '../MUDContext';
import FullScreenModal from './FullScreenModal';
import DepositModal from './DepositModal';
import SpVoterModal from './SpVoterModal';
import { PRIZE_TOKEN } from '../constants/constants';
import { BigNumber, ethers } from 'ethers';
import { getPrizeTokenSymbol, bigNumberToNumber } from '../utils/common';
import { ToastError } from '../components/ToastError';
import { ToastSuccess } from '../components/ToastSuccess';
import { useInterval } from '../hooks/useInterval';

interface HackathonPrizesProps {
  hackathonId: string;
  prizeToken: string;
  winnerCount: number;
}

const HackathonPrizes = ({ hackathonId, prizeToken, winnerCount }: HackathonPrizesProps) => {
  const {
    network: { worldContract, chainId },
  } = useMUD();

  const [deposit, setDeposit] = useState(BigNumber.from(0));

  useInterval(() => {
    (async () => {
      const hackathonPrize = await worldContract.getHackathonPrize(hackathonId);
      setDeposit(hackathonPrize?.deposit ? hackathonPrize.deposit : BigNumber.from(0));
    })();
  }, 5000);

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const [modalSpVoter, setModalSpVoter] = useState(false);
  const openModalSpVoter = () => {
    setModalSpVoter(true);
  };

  const closeModalSpVoter = () => {
    setModalSpVoter(false);
  };

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [specialVoters, setSpecialVoters] = useState<number[]>([]);
  const [specialVotersAddress, setSpecialVotersAddress] = useState<string[]>([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 10000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [error, success]);

  useEffect(() => {
    (async () => {
      const fetchedSpecialVoters: number[] = [];
      const hackathonVoteNft = await worldContract.getHackathonVoteNft(hackathonId);
      setSpecialVotersAddress(hackathonVoteNft.specialVoters);
      for (const voteAddress of hackathonVoteNft.specialVoters) {
        const vote = await worldContract.getVote(hackathonId, voteAddress)
        fetchedSpecialVoters.push(parseInt(vote.count)); 
      }
      setSpecialVoters(fetchedSpecialVoters); 
    })();

    console.log("@@@specialVoters=", specialVoters);
  }, []);

  return (
    <>
      {error && <ToastError message={error} />}
      {success && <ToastSuccess message={success} />}
      <div className="mr-10">
        <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
          <DepositModal
            hackathonId={hackathonId}
            prizeToken={prizeToken}
            setError={setError}
            setSuccess={setSuccess}
          />
        </FullScreenModal>
        <FullScreenModal isOpen={modalSpVoter} onClose={closeModalSpVoter}>
          <SpVoterModal
            onClose={closeModalSpVoter}
            hackathonId={hackathonId}
            setError={setError}
            setSuccess={setSuccess}
          />
        </FullScreenModal>
        <div className="flex justify-between items-center ">
          <h2 className="text-2xl font-bold">Prizes</h2>
          <a onClick={openModal}>
            <button className="bg-[#333333] text-white pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl">
              Donate {getPrizeTokenSymbol(prizeToken, chainId)}
            </button>
          </a>
        </div>

        <p>
          {getPrizeTokenSymbol(prizeToken, chainId) === 'ETH' ? (
            <span>{deposit ? bigNumberToNumber(deposit, 18) : 0}</span>
          ) : (
            <span>{deposit ? bigNumberToNumber(deposit, 6) : 0}</span>
          )}{' '}
          {getPrizeTokenSymbol(prizeToken, chainId)} will be distributed to the top {winnerCount}{' '}
          winners.
        </p>

        <div className="flex justify-between items-center mt-8">
          <h2 className="text-2xl font-bold">Voters</h2>
          <a onClick={openModalSpVoter}>
            <button className="bg-[#333333] text-white pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl">
              Add special voters
            </button>
          </a>
        </div>

        <p className={"mt-2"}>
            The hack owner can add people who are not entitled to vote when in Deposit prize status only.
        </p>
        <div className="grid grid-cols-2 p-4 rounded-md shadow-md mt-4 mb-12">
          <div className="col-span-1 border-b font-bold pb-2">Account</div>
          <div className="col-span-1 border-b font-bold pb-2">Sum</div>

          {specialVoters &&
            specialVoters.map((vote, index) => [
              <div key={`voter-${index}`} className="col-span-1 border-b pb-2 pt-2 text-gray-500">
                {`${specialVotersAddress[index].slice(0, 5)}...${specialVotersAddress[index].slice(-5)}`}
              </div>,
              <div key={`count-${index}`} className="col-span-1 border-b pb-2 pt-2 text-gray-500">
                {vote}
              </div>,
            ])
          }
        
        </div>
        

      </div>
    </>
    
  );
};

export default HackathonPrizes;
