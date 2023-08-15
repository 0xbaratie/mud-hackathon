import { BigNumber, ethers } from 'ethers';
import { useMUD } from '../MUDContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const EventCard = ({ hackathonNum }) => {
  const {
    // components: { Hackathon, HackathonPrize },
    network: { worldContract },
  } = useMUD();
  const [imageUri, setImageUri] = useState('');
  const [name, setName] = useState('');
  const [submitPeriod, setSubmitPeriod] = useState(BigNumber.from(0));
  const [deposit, setDeposit] = useState(BigNumber.from(0));

  useEffect(() => {
    (async () => {
      const bigNum = ethers.BigNumber.from(hackathonNum);
      const paddedHexStr = '0x' + bigNum.toHexString().slice(2).padStart(64, '0');

      const hackathon = await worldContract.getHackathon(paddedHexStr);
      setImageUri(hackathon.imageUri);
      setName(hackathon.name);
      setSubmitPeriod(hackathon.submitPeriod);

      const hakcathonPrize = await worldContract.getHackathonPrize(paddedHexStr);
      setDeposit(hakcathonPrize.deposit);
    })();
  }, []);

  return (
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
            <span className="font-bold">{deposit ? Number(deposit) : 0} ETH</span>
            <span className="p-2 text-gray-600">in prizes</span>
            {/* <span className="font-bold">
              {hackathonPrize?.submitters.length ? hackathonPrize.submitters.length : 0}
            </span> */}
            <span className="p-2 text-gray-600">projects</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
