import React, { FC } from 'react';
import DateTimePicker from './DateTimePicker';
import { useMUD } from '../MUDContext';
import { useState } from 'react';

const HackathonForm = () => {
  const {
    systemCalls: { createHackathon },
  } = useMUD();
  const [prizeToken, setPrizeToken] = useState('');
  const [startTimestamp, setStartTimestamp] = useState(0);
  const [submitPeriod, setSubmitPeriod] = useState(0);
  const [votingPeriod, setVotingPeriod] = useState(0);
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(0);
  const [winnerCount, setWinnerCount] = useState(0);
  const [name, setName] = useState('');
  const [uri, setUri] = useState('');

  return (
    <div className="p-4">
      <h1 className="text-sm mb-1">Hackathon title</h1>
      <input
        type="text"
        placeholder="Enter your project title"
        className="input input-bordered w-full max-w-xs text-gray-900"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h1 className="text-sm mb-1 mt-3">Hackathon detail</h1>
      <p className="text-sm text-gray-500 mb-1">Please provide details of your hackathon.</p>
      <input
        type="text"
        placeholder="https://xxxxxxx.framer.website/"
        className="input input-bordered w-full max-w-xs text-gray-900"
      />
      <h1 className="text-sm mb-1 mt-3 ">Prize token (Optimism chain)</h1>
      <select
        className="select select-bordered w-full max-w-xs text-gray-900"
        value={prizeToken}
        onChange={(e) => setPrizeToken(e.target.value)}
      >
        <option disabled value="" className="text-gray-900">
          Select a token
        </option>
        <option value="0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000">ETH</option> {/* OPGoerli ETH */}
        <option>USDC</option>
        <option>DAI</option>
      </select>
      <div className="flex">
        <div className="flex-1">
          <h1 className="text-sm mb-1 mt-3">Hack start datetime</h1>
          <DateTimePicker
            selectedDateTime={startTimestamp}
            setSelectedDateTime={setStartTimestamp}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-sm mb-1 mt-3">Project submit due datetime</h1>
          <DateTimePicker selectedDateTime={submitPeriod} setSelectedDateTime={setSubmitPeriod} />
        </div>
      </div>
      <div className="flex">
        <div className="flex-1">
          <h1 className="text-sm mb-1 mt-3">Voting due datetime</h1>
          <DateTimePicker selectedDateTime={votingPeriod} setSelectedDateTime={setVotingPeriod} />
        </div>
        <div className="flex-1">
          <h1 className="text-sm mb-1 mt-3">Withdrawing due datetime</h1>
          <DateTimePicker
            selectedDateTime={withdrawalPeriod}
            setSelectedDateTime={setWithdrawalPeriod}
          />
        </div>
      </div>
      <h1 className="text-sm mb-1 mt-3">Number of winners</h1>
      <input
        type="number"
        placeholder="1"
        className="input input-bordered w-full max-w-xs text-gray-900"
        value={winnerCount}
        onChange={(e) => setWinnerCount(e.target.value)}
      />
      <h1 className="text-sm mb-1 mt-3">Cover image</h1>
      <p className="text-sm text-gray-500 mb-1">
        The ideal aspect ratio is 9 : 2 - for example 1440 x 320 px.
      </p>
      <input
        type="text"
        placeholder="http://arweave.net/xxxxxxxxxxxxxx"
        className="input input-bordered w-full max-w-xs text-gray-900"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
      />
      <div className="mt-3">
        <button
          className="btn bg-[#333333] text-white rounded-lg"
          onClick={async (event) => {
            event.preventDefault();
            await createHackathon(
              prizeToken,
              startTimestamp,
              submitPeriod,
              votingPeriod,
              withdrawalPeriod,
              winnerCount,
              name,
              uri,
            );
          }}
        >
          Create a hackathon
        </button>
      </div>
    </div>
  );
};

export default HackathonForm;
