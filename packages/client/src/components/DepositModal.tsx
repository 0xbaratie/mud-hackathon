import React, { useEffect } from 'react';
import { useMUD } from '../MUDContext';
import { useState } from 'react';
import { utils, Contract, BigNumber } from 'ethers';
import { getPrizeTokenSymbol } from '../utils/common';
import { erc20abi } from '../constants/erc20abi';

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
  const [decimal, setDecimal] = useState(0);

  const prizeTokenERC20 = new Contract(prizeToken, erc20abi, signerOrProvider);

  const stringToBigNumber = (amount: number, decimal: number): BigNumber => {
    // console.log('amount', amount.toString());

    let bigNumber: BigNumber;
    try {
      bigNumber = utils.parseUnits(amount.toString(), decimal);
    } catch (e) {
      // console.log('error', e);
      bigNumber = BigNumber.from('0');
    }
    // console.log('bigNumber', bigNumber.toNumber());
    return bigNumber;
  };

  useEffect(() => {
    (async () => {
      const decimal = await prizeTokenERC20.decimals();
      setDecimal(decimal.toNumber());
    })();
  }, []);

  //Timer
  useEffect(() => {
    const fetchData = async () => {
      const myAddress = await signerOrProvider.getAddress();
      console.log('myAddress', myAddress);
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
      <p className="font-bold text-sm">Deposit {getPrizeTokenSymbol(prizeToken, chainId)}</p>
      <div className="mt-4 w-full">
        <input
          type="number"
          placeholder="0.0"
          className="input input-bordered w-full text-gray-900"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />

        <div className="text-center">
          {amount && allowance < stringToBigNumber(amount, decimal) ? (
            <button
              className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2  bg-[#333333] text-white rounded-lg"
              onClick={async (event) => {
                event.preventDefault();
                //TODO decimal if USDC or DAI
                await prizeTokenERC20.approve(worldContract.address, utils.parseEther('0.1'));
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
          {amount && allowance >= stringToBigNumber(amount, decimal) ? (
            <button
              className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2  bg-[#333333] text-white rounded-lg"
              onClick={async (event) => {
                event.preventDefault();
                //TODO decimal if USDC or DAI
                await depositPrize(hackathonId, stringToBigNumber(amount, 6));
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
      </div>
    </div>
  );
};

export default DepositModal;
