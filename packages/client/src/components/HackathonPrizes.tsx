import { useState, useEffect } from 'react';
import { useMUD } from '../MUDContext';
import FullScreenModal from './FullScreenModal';
import DepositModal from './DepositModal';
import { PRIZE_TOKEN } from '../constants/constants';
import { BigNumber, ethers } from 'ethers';
import { getPrizeTokenSymbol, bigNumberToNumber } from '../utils/common';

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
  useEffect(() => {
    (async () => {
      const hackathonPrize = await worldContract.getHackathonPrize(hackathonId);
      setDeposit(hackathonPrize?.deposit ? hackathonPrize.deposit : BigNumber.from(0));
    })();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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
    <div className="mr-10">
      <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
        <DepositModal
          hackathonId={hackathonId}
          prizeToken={prizeToken}
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
      {/* <h2 className="text-2xl font-bold mt-4">Transactions</h2>
      <div className="grid grid-cols-4 p-4 rounded-md shadow-md">
        <div className="col-span-1 border-b font-bold pb-2">Account</div>
        <div className="col-span-1 border-b font-bold pb-2">To</div>
        <div className="col-span-1 border-b font-bold pb-2">Token Amount</div>
        <div className="col-span-1 border-b font-bold pb-2">Time</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 5</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 6</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 7</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 8</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 9</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 10</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 11</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 12</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 13</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 14</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 15</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 16</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 17</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 18</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 19</div>
        <div className="col-span-1 border-b pb-2 pt-2 text-gray-500">Cell 20</div>
      </div> */}
    </div>
  );
};

export default HackathonPrizes;
