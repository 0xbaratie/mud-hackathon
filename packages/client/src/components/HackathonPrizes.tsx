import { useState, useEffect, useContext} from 'react';
import { useMUD } from '../MUDContext';
import FullScreenModal from './FullScreenModal';
import SpVoterModal from './SpVoterModal';
import HackathonPrizeModal from './HackathonPrizeModal';

import { PRIZE_TOKEN } from '../constants/constants';
import { BigNumber, ethers } from 'ethers';
import { getPrizeTokenSymbol, bigNumberToNumber } from '../utils/common';
import { ToastError } from '../components/ToastError';
import { ToastSuccess } from '../components/ToastSuccess';
import { useInterval } from '../hooks/useInterval';
import { PHASE } from '../constants/constants';
import { walletContext } from '../WalletConnection';

interface HackathonPrizesProps {
  hackathonId: string;
  prizeToken: string;
  winnerCount: number;
  phase: number;
  owner: string;
}

const HackathonPrizes = ({ hackathonId, prizeToken, winnerCount, phase, owner }: HackathonPrizesProps) => {
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
  const initialSponsors: [BigNumber[], string[]] = [[], []];
  const [hackathonSponsors, setHackathonSponsors] = useState(initialSponsors);
  
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
        const vote = await worldContract.getSpecialVote(hackathonId, voteAddress)
        fetchedSpecialVoters.push(vote.toNumber()); 
      }
      setSpecialVoters(fetchedSpecialVoters); 

      const hackathonSponsors = await worldContract.getHackathonSponsor(hackathonId);
      if (hackathonSponsors && hackathonSponsors.length > 0 && hackathonSponsors[0].length > 0 && hackathonSponsors[1].length > 0) {
        // Sorted in order of the amount deposited.
        const sortedSponsors = hackathonSponsors[0].map((value, index) => ({
          depositSum: value,
          address: hackathonSponsors[1][index],
        })).sort((a, b) => b.depositSum.sub(a.depositSum).toNumber());
  
        setHackathonSponsors([
          sortedSponsors.map(item => item.depositSum),
          sortedSponsors.map(item => item.address)
        ]);
      }

    })();
  }, []);

  const getDecimalForToken = (tokenSymbol: string) => {
    switch (tokenSymbol) {
      case 'USDC':
        return 6;
      default:
        return 18;
    }
  };

  const { wallet } = useContext(walletContext)
  const connectedWalletAddress = wallet?.accounts?.[0];

  return (
    <>
      {error && <ToastError message={error} />}
      {success && <ToastSuccess message={success} />}
      <div className="mr-10">
        <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
          <HackathonPrizeModal 
            onClose={closeModal} 
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
              <button
                className={`pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl text-white ${
                  phase === PHASE.PREPARE_PRIZE ? 'bg-[#333333]' : 'bg-gray-400'
                }`}
                disabled={phase !== PHASE.PREPARE_PRIZE}
              >
                Donate {getPrizeTokenSymbol(prizeToken, chainId)}
              </button>
            </a>
          </div>

        
        <p className={"mt-2"}>
          Those who wish to award prizes for the hackathon may donate.
        </p>
        {hackathonSponsors.length > 0 && hackathonSponsors[0].length > 0 ? ( 
          <div className="grid grid-cols-2 p-4 rounded-md shadow-md mt-4 mb-12">
            <div className="col-span-1 border-b font-bold pb-2">Account</div>
            <div className="col-span-1 border-b font-bold pb-2">Amount</div>

            {hackathonSponsors[0].map((depositSum, index) => (
              <>
                <div key={`sum-${index}`}>
                  <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">
                    <a
                        href={`https://optimistic.etherscan.io/address/${hackathonSponsors[1][index]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {`${hackathonSponsors[1][index].slice(0, 5)}...${hackathonSponsors[1][index].slice(-5)}`}
                      </a>
                  </div>
                </div>
                <div key={`sponsor-${index}`}>
                  <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">
                    {ethers.utils.formatUnits(depositSum, getDecimalForToken(getPrizeTokenSymbol(prizeToken, chainId) || "ETH"))}
                  </div>
                </div>
              </>
            ))}
          </div>
        ) : (
          null
        )}

        
        
      
        <div className="flex justify-between items-center mt-16">
          <h2 className="text-2xl font-bold">Voters</h2>
          {connectedWalletAddress === owner.toLowerCase() && (
            <a onClick={openModalSpVoter}>
              <button
                className={`pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl text-white ${
                  phase === PHASE.PREPARE_PRIZE ? 'bg-[#333333]' : 'bg-gray-400'
                }`}
                disabled={phase !== PHASE.PREPARE_PRIZE}
              >
                Add special voters
              </button>
            </a>
          )}
        </div>
      

        <p className={"mt-2"}>
          The hack owner can add people who are not entitled to vote when in Deposit prize status only.(Optional to do) 
        </p>
        {specialVoters.length > 0 ? ( 
          <div className="grid grid-cols-2 p-4 rounded-md shadow-md mt-4 mb-12">
            <div className="col-span-1 border-b font-bold pb-2">Account</div>
            <div className="col-span-1 border-b font-bold pb-2">Sum</div>

            {specialVoters.map((vote, index) => (
              <>
                <div key={`voter-${index}`} className="col-span-1 border-b pb-2 pt-2 text-gray-500">
                  <a
                    href={`https://optimistic.etherscan.io/address/${specialVotersAddress[index]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {`${specialVotersAddress[index].slice(0, 5)}...${specialVotersAddress[index].slice(-5)}`}
                  </a>
                </div>
                <div key={`count-${index}`} className="col-span-1 border-b pb-2 pt-2 text-gray-500">
                  {vote}
                </div>
              </>
            ))}
          </div>
        ) : (
          null
        )}
      </div>
    </>
  );
};

export default HackathonPrizes;
