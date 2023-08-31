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

  useEffect(() => {
    (async () => {
      const bigNum = ethers.BigNumber.from(hackathonNum);
      const paddedHexStr = '0x' + bigNum.toHexString().slice(2).padStart(64, '0');

      const hackathon = await worldContract.getHackathon(paddedHexStr);
      setImageUri(hackathon.imageUri);
      setName(hackathon.name);
      setSubmitPeriod(hackathon.submitPeriod);
      setPrizeToken(hackathon.prizeToken);
      console.log('prizeToken', prizeToken);

      const hackathonPrize = await worldContract.getHackathonPrize(paddedHexStr);
      setDeposit(hackathonPrize.deposit);
      const projectSum = hackathonPrize?.submitters.length ? hackathonPrize.submitters.length : 0;
      setProjectsSum(projectSum);
    })();
  }, []);

  return (
    name ? (
    <Link to={`/hackathon/${hackathonNum}`}>
      <div className="flex items-center space-x-4 custom-border h-[190px]">
        <div className="ml-3">
          <figure>
            <img src={imageUri} alt="Shoes" className="w-[108px] h-[108px] object-cover " />
          </figure>
        </div>
        <div className="card-body">
          <h2 className="card-title text-md">{name}</h2>
          <div className="card-actions mt-2">
            <button className="bg-[#333333] text-white pl-4 pr-4 pt-1 pb-1 text-sm rounded-3xl">
              about {Math.floor((Number(submitPeriod) - Date.now() / 1000) / 3600)} hours
            </button>
          </div>
          <div className="mt-2">
            {getPrizeTokenSymbol(prizeToken, chainId) === 'ETH' ? (
              <span className="font-bold">
                {deposit ? bigNumberToNumber(deposit, 18) : 0}{' '}
                {getPrizeTokenSymbol(prizeToken, chainId)}
              </span>
            ) : (
              <span className="font-bold">
                {deposit ? bigNumberToNumber(deposit, 6) : 0}{' '}
                {getPrizeTokenSymbol(prizeToken, chainId)}
              </span>
            )}
            <span className="p-2 text-gray-600">in prizes</span>
            <span className="font-bold">{projectsSum}</span>
            <span className="p-2 text-gray-600">projects</span>
          </div>
        </div>
      </div>
    </Link>
    ) : null
  );
};
