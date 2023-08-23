import React, { FC } from 'react';
import { useMUD } from '../MUDContext';
import { useState } from 'react';
import { ethers } from 'ethers';

interface DepositProps {
  prizeTokenStr: string;
  hackathonId: string;
  setError: (error: string | null) => void; 
  setSuccess: (success: string | null) => void;
}

const DepositModal = ({ hackathonId, prizeTokenStr, setError, setSuccess}: DepositProps) => {
  const [amount, setAmount] = useState(0);
  const {
    systemCalls: { depositPrize, depositPrizeEth },
  } = useMUD();

  return (
    <div className="p-6">
      <p className="font-bold text-sm">Deposit {prizeTokenStr}</p>
      <div className="mt-4 w-full">
        <input
          type="text"
          placeholder="0.0"
          className="input input-bordered w-full text-gray-900"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <button
          className="btn bg-[#333333] text-white rounded-lg"
          onClick={async (event) => {
            event.preventDefault();
            
            try {
              //TODO decimal if USDC or DAI
              await depositPrizeEth(hackathonId, ethers.utils.parseEther('0.1'));
              setSuccess('Your hackathon has been created!.');
            } catch (error) {
              setError('An error occurred while creating the hackathon.');
            }
          }}
        >
          Deposit
        </button>
      </div>
    </div>
  );
};

export default DepositModal;
