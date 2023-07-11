import { useComponentValue } from '@latticexyz/react';
import { ethers } from 'ethers';
import { useMUD } from '../MUDContext';

export const EventCard = ({ hackathonNum }) => {
  const {
    components: { Hackathon },
    network: { singletonEntity },
  } = useMUD();

  const bigNum = ethers.BigNumber.from(hackathonNum);
  const paddedHexStr = '0x' + bigNum.toHexString().slice(2).padStart(64, '0');
  // console.log(paddedHexStr);

  const hackathon = useComponentValue(Hackathon, paddedHexStr);
  console.log(hackathon);

  return (
    <a href={'/hackathon/' + hackathonNum}>
      <div className="flex items-center space-x-4 custom-border h-[190px]">
        <div className="ml-3">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
              alt="Shoes"
              className="w-[108px] h-[108px] object-cover "
            />
          </figure>
        </div>
        <div className="card-body">
          <h2 className="card-title text-md">{hackathon.name}</h2>
          <div className="card-actions mt-2">
            <button className="bg-[#333333] text-white pl-4 pr-4 pt-1 pb-1 text-sm rounded-3xl">
              about {Math.floor((Number(hackathon.submitPeriod) - Date.now() / 1000) / 3600)} hours
            </button>
          </div>
          <div className="mt-2">
            <span className="font-bold">22.5ETH</span>
            <span className="p-2 text-gray-600">in prizes</span>
            <span className="font-bold">243</span>
            <span className="p-2 text-gray-600">projects</span>
          </div>
        </div>
      </div>
    </a>
  );
};
