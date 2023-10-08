import { BigNumber, ethers } from 'ethers';
import { useMUD } from '../MUDContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPrizeTokenSymbol, bigNumberToNumber } from '../utils/common';

interface EventcardProps {
  hackathonNum: number;
}

export const EventCard = ({ hackathonNum }: EventcardProps) => {
  const {
    // components: { Hackathon, HackathonPrize },
    network: { worldContract, chainId },
  } = useMUD();
  const [imageUri, setImageUri] = useState('');
  const [name, setName] = useState('');
  const [projectsSum, setProjectsSum] = useState(0);
  const [submitPeriod, setSubmitPeriod] = useState(BigNumber.from(0));
  const [deposit, setDeposit] = useState(BigNumber.from(0));
  const [prizeToken, setPrizeToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const bigNum = ethers.BigNumber.from(hackathonNum);
        const paddedHexStr = '0x' + bigNum.toHexString().slice(2).padStart(64, '0');

        const hackathon = await worldContract.getHackathon(paddedHexStr);
        const hackathonInfo = await worldContract.getHackathonInfo(paddedHexStr);
        console.log('hackathon', hackathon);
        console.log('hackathonInfo', hackathonInfo);
        setName(hackathonInfo.name);
        setImageUri(hackathonInfo.imageUri);
        setSubmitPeriod(hackathon.submitPeriod);
        setPrizeToken(hackathon.prizeToken);

        const hackathonPrize = await worldContract.getHackathonPrize(paddedHexStr);
        setDeposit(hackathonPrize.deposit);
        const projectSum = hackathonPrize?.submitters.length ? hackathonPrize.submitters.length : 0;
        setProjectsSum(projectSum);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, []);

  const calculateTimeRemaining = () => {
    const timeInSeconds = Number(submitPeriod) - Date.now() / 1000;
    const hoursRemaining = Math.floor(Math.abs(timeInSeconds) / 3600);

    let timeRemaining;
    if (hoursRemaining >= 24) {
      const daysRemaining = Math.floor(Math.abs(timeInSeconds) / 86400);
      timeRemaining = `${daysRemaining} days`;
    } else {
      timeRemaining = `${hoursRemaining} hours`;
    }
    return timeInSeconds >= 0 ? `about ${timeRemaining}` : `Finished`;
  };

  const depositAmount = deposit
    ? bigNumberToNumber(deposit, getDecimalPlaces(prizeToken, chainId))
    : 0;

  function getDecimalPlaces(prizeToken: string, chainId: number): number {
    return getPrizeTokenSymbol(prizeToken, chainId) === 'USDC' ? 6: 18;
  }

  return loading ? (
    <div className="flex items-center justify-center">
      <span className="loading loading-bars loading-lg"></span>
    </div>
  ) : name ? (
    <Link to={`/hackathon/${hackathonNum}`}>
      <div className="flex items-center space-x-4 custom-border h-[190px]">
        <div className="ml-3">
          <figure>
            <img 
              src={imageUri.startsWith('http') ? imageUri : 'http://arweave.net/SFQNZecr_C3oxxsJBFItR6HYnlVyC4vAzsV_PlKcn5E'} 
              alt="Hackathon image" 
              className="w-[108px] h-[108px] object-cover " 
            />
          </figure>
        </div>
        <div className="card-compact">
          <h2 className="card-title text-md">{name}</h2>
          <div className="card-actions mt-2">
            <button className="bg-[#333333] text-white pl-4 pr-4 pt-1 pb-1 text-sm rounded-3xl">
              {calculateTimeRemaining()}
            </button>
          </div>
          <div className="mt-2">
            <span className="font-bold">
              {depositAmount} {getPrizeTokenSymbol(prizeToken, chainId)}
            </span>
            <span className="p-2 text-gray-600">deposited</span>
            <span className="font-bold">{projectsSum}</span>
            <span className="p-2 text-gray-600">projects</span>
          </div>
        </div>
      </div>
    </Link>
  ) : null;
};
