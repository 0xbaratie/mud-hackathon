import React, { FC } from 'react';
import { useMUD } from '../MUDContext';
import { useState } from 'react';
import { ethers } from 'ethers';

const DepositModal = ({ hackathonId, prizeTokenStr }) => {
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
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="btn bg-[#333333] text-white rounded-lg"
          onClick={async (event) => {
            event.preventDefault();
            //TODO decimal if USDC or DAI
            await depositPrizeEth(hackathonId, ethers.utils.parseEther('0.1'));
          }}
        >
          Deposit
        </button>
      </div>
    </div>
  );
};

export default DepositModal;
