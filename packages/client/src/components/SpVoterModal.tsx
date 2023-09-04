import React, { useEffect } from 'react';
import { useMUD } from '../MUDContext';
import { useState } from 'react';

interface SpVoterProps {
  onClose: () => void;
  hackathonId: string;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

const SpVoterModal = ({ onClose, hackathonId, setError, setSuccess }: SpVoterProps) => {
  const {
    systemCalls: { addSpecialVoter },
  } = useMUD();
  const [amount, setAmount] = useState(0);
  const [voteNft, setVoteNft] = useState('0xb1008c037aA0dB479B9D5b0E49a27337fB29D72E');

  return (
    <div className="p-6">
      <div className="mt-4 w-full">
        <h1 className="text-sm mb-1 mt-3">Wallet Address</h1>
        <p className="text-sm text-gray-500 mb-1">Input the wallet address to be added to this hackathon even if you do not have an NFT to vote for.</p>
        <input
          type="text"
          className="input input-bordered w-full  text-gray-900"
          value={voteNft}
          onChange={(e) => setVoteNft(e.target.value)}
        />
        <h1 className="text-sm mb-1 mt-3">Number of votes</h1>
        <input
          type="number"
          placeholder="0.0"
          className="input input-bordered w-full text-gray-900"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />

        <>
          <div className="text-center">
            <button
              className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2  bg-[#333333] text-white rounded-lg"
              onClick={async (event) => {
                event.preventDefault();
                try {
                  await addSpecialVoter(hackathonId, voteNft, amount);
                  setSuccess('The special voter has been added');
                } catch (error) {
                  console.error(error);
                  setError('An error occurred while adding a special voter');
                }
                onClose();
              }}
            >
              Add Voter
            </button>
          </div>
        </>
        
      </div>
    </div>
  );
};

export default SpVoterModal;
