import React, { useEffect } from 'react';
import { useMUD } from '../MUDContext';
import { useState } from 'react';
import { utils, Contract, BigNumber } from 'ethers';
import { getPrizeTokenSymbol, numberToBigNumber } from '../utils/common';
import { erc20abi } from '../constants/erc20abi';
import { worldAbi } from '../constants/worldAbi';

interface DepositProps {
  hackathonId: string;
  prizeToken: string;
}

const DepositModal = ({ hackathonId, prizeToken }: DepositProps) => {
  const {
    systemCalls: { depositPrize, depositPrizeEth },
    network: { worldContract, signerOrProvider, chainId },
  } = useMUD();
  const [amount, setAmount] = useState(0);
  const [allowance, setAllowance] = useState(BigNumber.from('0'));
  const prizeTokenSymbol = getPrizeTokenSymbol(prizeToken, chainId);

  //Timer
  useEffect(() => {
    if (prizeTokenSymbol === 'ETH') return;
    const fetchData = async () => {
      const myAddress = await signerOrProvider.getAddress();
      console.log('myAddress', myAddress);
      const prizeTokenERC20 = new Contract(prizeToken, erc20abi, signerOrProvider);
      const _allowance = await prizeTokenERC20.allowance(myAddress, worldContract.address);
      console.log('allowance', _allowance.toNumber());
      setAllowance(_allowance.toNumber());
    };

    // Fetch data initially and every 5 seconds
    fetchData();
    const interval = setInterval(fetchData, 5000);

    // Clean up the interval to avoid memory leaks
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <p className="font-bold text-sm">Deposit {prizeTokenSymbol}</p>
      <div className="mt-4 w-full">
        <input
          type="number"
          placeholder="0.0"
          className="input input-bordered w-full text-gray-900"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />

        {prizeTokenSymbol === 'ETH' ? (
          <div className="text-center">
            <button
              className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2  bg-[#333333] text-white rounded-lg"
              onClick={async (event) => {
                event.preventDefault();
                const world = new Contract(worldContract.address, worldAbi, signerOrProvider);
                await world.depositPrizeEth(hackathonId, numberToBigNumber(amount, 18), {
                  value: numberToBigNumber(amount, 18),
                });
              }}
            >
              Deposit
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              {amount && allowance < numberToBigNumber(amount, 6) ? (
                <button
                  className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2  bg-[#333333] text-white rounded-lg"
                  onClick={async (event) => {
                    event.preventDefault();
                    const prizeTokenERC20 = new Contract(prizeToken, erc20abi, signerOrProvider);
                    await prizeTokenERC20.approve(
                      worldContract.address,
                      numberToBigNumber(amount, 6),
                    );
                  }}
                >
                  Approve
                </button>
              ) : (
                <button
                  className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2 shadow-xl rounded-lg bg-gray-400"
                  disabled
                >
                  Approve
                </button>
              )}
            </div>
            <div className="text-center">
              {amount && allowance >= numberToBigNumber(amount, 6) ? (
                <button
                  className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2  bg-[#333333] text-white rounded-lg"
                  onClick={async (event) => {
                    event.preventDefault();
                    //TODO decimal if USDC or DAI
                    await depositPrize(hackathonId, numberToBigNumber(amount, 6));
                  }}
                >
                  Deposit
                </button>
              ) : (
                <button
                  className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2 shadow-xl rounded-lg bg-gray-400"
                  disabled
                >
                  Deposit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DepositModal;
