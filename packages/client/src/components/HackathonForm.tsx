import { FC, useEffect } from 'react';
import DateTimePicker from './DateTimePicker';
import { useMUD } from '../MUDContext';
import { useState } from 'react';
import { PRIZE_TOKEN, PRIZE_TOKEN_TEST } from '../constants/constants';

type HackathonFormProps = {
  onClose: () => void;
  maxHackathonNum: number;
  setMaxHackathonNum: (num: number) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
};

const HackathonForm: FC<HackathonFormProps> = ({
  onClose,
  maxHackathonNum,
  setMaxHackathonNum,
  setError,
  setSuccess,
}) => {
  const prizeTokens = import.meta.env.VITE_CHAIN_ID == 10 ? PRIZE_TOKEN : PRIZE_TOKEN_TEST;

  const getWeeksLater = (weeks: number) => {
    const date = new Date();
    date.setDate(date.getDate() + 7 * weeks);
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(0);
    return date;
  };

  const getTimestampFromDateAsUTC = (date: Date) => {
    // getTimezoneOffset() returns the difference from UTC in minutes
    const offsetMinutes = date.getTimezoneOffset();

    // Adjust the date using the offset
    const adjustedDate = new Date(date.getTime() - offsetMinutes * 60 * 1000);

    // Return the UNIX timestamp of the adjusted date
    return Math.floor(adjustedDate.getTime() / 1000);
  };

  const {
    systemCalls: { createHackathon },
  } = useMUD();
  const [prizeToken, setPrizeToken] = useState(prizeTokens.ETH.address);
  const [startTimestamp, setStartTimestamp] = useState(getWeeksLater(1.0));
  const [submitPeriod, setSubmitPeriod] = useState(getWeeksLater(2.5));
  const [votingPeriod, setVotingPeriod] = useState(getWeeksLater(3.0));
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(getWeeksLater(4.5));
  const [winnerCount, setWinnerCount] = useState(1);
  const [name, setName] = useState('');
  const [uri, setUri] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [description, setDescription] = useState('');
  const [voteNft, setVoteNft] = useState('');

  return (
    <div className="p-4 overflow-y-auto max-h-[800px]">
      <h1 className="text-sm mb-1 font-bold">Title</h1>
      <input
        type="text"
        placeholder="Enter your project title"
        className="input input-bordered w-full max-w-xs text-gray-900"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h1 className="text-sm mb-1 mt-4 font-bold">Detail URL</h1>
      <p className="text-sm text-gray-500 mb-1">Please provide details of your hackathon.</p>
      <input
        type="text"
        placeholder="https://xxxxxxx.framer.website/"
        className="input input-bordered w-full max-w-xs text-gray-900"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
      />
      <h1 className="text-sm mb-1 mt-4 font-bold">Title image</h1>
      <p className="text-sm text-gray-500 mb-1">
        The ideal aspect ratio is 1 : 1 - for example 512 x 512 px.
      </p>
      <input
        type="text"
        placeholder="http://arweave.net/xxxxxxxxxxxxxx"
        className="input input-bordered w-full max-w-ms text-gray-900"
        value={imageUri}
        onChange={(e) => setImageUri(e.target.value)}
      />
      <h1 className="text-sm mt-4 mb-1 font-bold">Description</h1>
      <textarea
        placeholder="Enter your project overview"
        className="input input-bordered w-full max-w-ms text-gray-900 pt-2"
        value={description}
        maxLength={200}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <div className="flex">
        <div className="flex-1">
          <h1 className="text-sm mb-1 mt-4 font-bold">Hack start(GMT)</h1>
          <DateTimePicker
            selectedDateTime={startTimestamp}
            setSelectedDateTime={setStartTimestamp}
          />
        </div>
      </div>
      <div className="flex">
        <div className="flex-1">
          <h1 className="text-sm mb-1 mt-4 font-bold">Project submit due(GMT)</h1>
          <DateTimePicker selectedDateTime={submitPeriod} setSelectedDateTime={setSubmitPeriod} />
        </div>
      </div>
      <div className="flex">
        <div className="flex-1">
          <h1 className="text-sm mb-1 mt-4 font-bold">Voting due(GMT)</h1>
          <DateTimePicker selectedDateTime={votingPeriod} setSelectedDateTime={setVotingPeriod} />
        </div>
      </div>
      <div className="flex">
        <div className="flex-1">
          <h1 className="text-sm mb-1 mt-4 font-bold">Withdrawing due(GMT)</h1>
          <DateTimePicker
            selectedDateTime={withdrawalPeriod}
            setSelectedDateTime={setWithdrawalPeriod}
          />
        </div>
      </div>
      <h1 className="text-sm mb-1 mt-4 font-bold">Winners</h1>
      <input
        type="number"
        placeholder="1"
        className="input input-bordered w-full max-w-xs text-gray-900"
        value={winnerCount}
        onChange={(e) => setWinnerCount(parseFloat(e.target.value))}
      />
      <h1 className="text-sm mb-1 mt-4 font-bold">Prize token (Optimism chain)</h1>
      <select
        className="select select-bordered w-full max-w-xs text-gray-900"
        value={prizeToken}
        onChange={(e) => setPrizeToken(e.target.value)}
      >
        <option value={prizeTokens.ETH.address}>ETH</option>
        <option value={prizeTokens.USDC.address}>USDC</option>
        <option value={prizeTokens.DAI.address}>DAI</option>
      </select>
      <h1 className="text-sm mb-1 mt-4 font-bold">Vote NFT Address</h1>
      <p className="text-sm text-gray-500 mb-1">
        This vote contract is only ERC721(With Enumerable) on Optimism only.
      </p>
      <input
        type="text"
        placeholder="0xb1008c037aA0dB479B9D5b0E49a27337fB29D72E"
        className="input input-bordered w-full max-w-s text-gray-900"
        value={voteNft}
        onChange={(e) => setVoteNft(e.target.value)}
      />

      <div className="mt-4">
        <button
          className="btn bg-[#333333] text-white rounded-lg"
          onClick={async (event) => {
            event.preventDefault();
            try {
              await createHackathon(
                prizeToken,
                getTimestampFromDateAsUTC(startTimestamp),
                getTimestampFromDateAsUTC(submitPeriod),
                getTimestampFromDateAsUTC(votingPeriod),
                getTimestampFromDateAsUTC(withdrawalPeriod),
                winnerCount,
                name,
                uri,
                imageUri,
                description,
                voteNft,
              );
              const newMaxHackathonNum = maxHackathonNum + 1;
              setMaxHackathonNum(newMaxHackathonNum);
              setSuccess('Your hackathon has been created!.');
            } catch (error) {
              console.error(error);
              setError('An error occurred while creating the hackathon.');
            }
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
