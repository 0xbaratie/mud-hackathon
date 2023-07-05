import React, { FC } from 'react';
import DateTimePicker from './DateTimePicker';

const HackathonForm = () => {
  return (
    <div className="p-6">
      <h1 className="text-sm mb-2">Hackathon title</h1>
      <input type="text" placeholder="Enter your project title" className="input input-bordered w-full max-w-xs mt-2 text-gray-300" />
      <h1 className="text-sm mb-2 mt-6">Hackathon detail</h1>
      <p className="text-sm text-gray-500 mb-1">Please provide details of your hackathon.</p>
      <input type="text" placeholder="https://xxxxxxx.framer.website/" className="input input-bordered w-full max-w-xs mt-2 text-gray-300" />
      <h1 className="text-sm mb-2 mt-6 ">Prize token (Optimism chain)</h1>
      <select className="select select-bordered w-full max-w-xs text-gray-300">
        <option disabled selected  className="text-gray-300">Select a token</option>
        <option>ETH</option>
        <option>USDC</option>
        <option>DAI</option>
      </select>
      <h1 className="text-sm mb-2 mt-6">Deposit prize due datetime</h1>
      <DateTimePicker />
      <h1 className="text-sm mb-2 mt-6">Hack start datetime</h1>
      <DateTimePicker />
      <h1 className="text-sm mb-2 mt-6">Project submit due datetime</h1>
      <DateTimePicker />
      <h1 className="text-sm mb-2 mt-6">Voting due datetime</h1>
      <DateTimePicker />
      <h1 className="text-sm mb-2 mt-6">Cover image</h1>
      <p className="text-sm text-gray-500 mb-1">The ideal aspect ratio is 9 : 2 - for example 1440 x 320 px.</p>
      <input type="text" placeholder="http://arweave.net/xxxxxxxxxxxxxx" className="input input-bordered w-full max-w-xs mt-2 text-gray-300" />
      <div className="mt-6">
        <button className="btn bg-black text-white rounded-lg">Create a hackathon</button>
      </div>
    </div>
    
  );
};

export default HackathonForm;
