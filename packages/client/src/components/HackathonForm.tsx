import React, { FC } from 'react';
import DateTimePicker from './DateTimePicker';
import { useMUD } from '../MUDContext';
import { useState } from 'react';
import { PRIZE_TOKEN } from '../constants/constants';

type HackathonFormProps = {
  onClose: () => void;
};

const HackathonForm: FC<HackathonFormProps> = ({ onClose }) => {
  const getWeeksLater = (weeks: number) => {
    const date = new Date();
    date.setDate(date.getDate() + 7 * weeks);
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(0);
    return date;
  };

  const getTimestampFromDate = (date: Date) => {
    return Math.floor(date.getTime() / 1000);
  };

  const {
    systemCalls: { createHackathon },
  } = useMUD();
  const [prizeToken, setPrizeToken] = useState(PRIZE_TOKEN.ETH);
  const [startTimestamp, setStartTimestamp] = useState(getWeeksLater(-1));
  const [submitPeriod, setSubmitPeriod] = useState(getWeeksLater(-1));
  const [votingPeriod, setVotingPeriod] = useState(getWeeksLater(-1));
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(getWeeksLater(-1));
  const [winnerCount, setWinnerCount] = useState(1);
  const [name, setName] = useState('Hackathon1');
  const [uri, setUri] = useState('https://url1');
  const [imageUri, setImageUri] = useState(
    'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
  );

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
        value={uri}
        onChange={(e) => setUri(e.target.value)}
      />
      <h1 className="text-sm mb-1 mt-3 ">Prize token (Optimism chain)</h1>
      {/* <select
        className="select select-bordered w-full max-w-xs text-gray-900"
        value={prizeToken}
        onChange={(e) => setPrizeToken(e.target.value)}
      >
        <option value={PRIZE_TOKEN.ETH}>ETH</option>
        <option value={PRIZE_TOKEN.USDC}>USDC</option>
        <option value={PRIZE_TOKEN.DAI}>DAI</option>
      </select> */}
      <input
        type="text"
        placeholder="0x"
        className="input input-bordered w-full max-w-xs text-gray-900"
        value={prizeToken}
        onChange={(e) => setPrizeToken(e.target.value)}
      />
      <div className="flex">
        <div className="flex-1">
          <h1 className="text-sm mb-1 mt-3">Hack start datetime</h1>
          <DateTimePicker selectedDateTime={startTimestamp} setSelectedDateTime={setStartTimestamp} style={{ width: '100%' }} />
        </div>
      </div>
      <div className="flex">
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
      </div>
      <div className="flex">
        <div className="flex-1">
          <h1 className="text-sm mb-1 mt-3">Withdrawing due datetime</h1>
          <DateTimePicker selectedDateTime={withdrawalPeriod} setSelectedDateTime={setWithdrawalPeriod} />
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
        value={imageUri}
        onChange={(e) => setImageUri(e.target.value)}
      />
      <div className="mt-3">
        <button
          className="btn bg-[#333333] text-white rounded-lg"
          onClick={async (event) => {
            event.preventDefault();
            await createHackathon(
              prizeToken,
              getTimestampFromDate(startTimestamp),
              getTimestampFromDate(submitPeriod),
              getTimestampFromDate(votingPeriod),
              getTimestampFromDate(withdrawalPeriod),
              winnerCount,
              name,
              uri,
              imageUri,
            );
            onClose(); 
          }}
        >
          Create hackathon
        </button>
      </div>
    </div>
  );
};

export default HackathonForm;
