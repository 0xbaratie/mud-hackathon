import React, { FC } from 'react';
import { useMUD } from '../MUDContext';
import { useState } from 'react';
import { utils, Contract } from 'ethers';

const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

interface DepositProps {
  prizeTokenStr: string;
  hackathonId: string;
  prizeToken: string;
}

const DepositModal = ({ hackathonId, prizeTokenStr, prizeToken }: DepositProps) => {
  const [amount, setAmount] = useState(0);
  const {
    systemCalls: { depositPrize, depositPrizeEth },
    network: { worldContract, signerOrProvider },
  } = useMUD();

  const prizeTokenERC20 = new Contract(prizeToken, abi, signerOrProvider);

  return (
    <div className="p-6">
      <p className="font-bold text-sm">Deposit {prizeTokenStr}</p>
      <div className="mt-4 w-full">
        <input
          type="number"
          placeholder="0.0"
          className="input input-bordered w-full text-gray-900"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <button
          className="btn bg-[#333333] text-white rounded-lg"
          onClick={async (event) => {
            event.preventDefault();
            //TODO decimal if USDC or DAI
            await prizeTokenERC20.approve(worldContract.address, utils.parseEther('0.1'));
          }}
        >
          Approve
        </button>
        <button
          className="btn bg-[#333333] text-white rounded-lg"
          onClick={async (event) => {
            event.preventDefault();
            //TODO decimal if USDC or DAI
            await depositPrize(hackathonId, utils.parseEther('0.1'));
          }}
        >
          Deposit
        </button>
      </div>
    </div>
  );
};

export default DepositModal;
