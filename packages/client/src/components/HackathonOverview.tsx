import React, { FC } from 'react';
import DateTimePicker from './DateTimePicker';

const HackathonOverview = () => {
  return (
    <div className="p-6">
      <div className="flex">
        <img
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
          className="w-[24px] h-[24px] object-cover rounded-full"
        />
        <span className="ml-2 font-bold">libdefi</span>
        <div className="ml-2 bg-gray-200 text-gray-400 rounded-lg pr-2 pl-2">0xCDF4</div>
        <div className="ml-2 bg-gray-200 text-gray-400 rounded-lg pr-2 pl-2">June 1st, 2023</div>
      </div>
      <button className="mt-6 bg-[#333333] text-white pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl">
        <a href="https://oasys.framer.website/" target="_blank" rel="noopener noreferrer" >
          Hackathon detail
        </a>
      </button>
    </div>
  );
};

export default HackathonOverview;
