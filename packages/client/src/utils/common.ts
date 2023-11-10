import { PRIZE_TOKEN, PRIZE_TOKEN_TEST } from '../constants/constants';
import { BigNumber, utils } from 'ethers';

export const getPrizeTokenSymbol = (tokenAddress: string, chainId: number): string | undefined => {
  const prizeToken = chainId === 10 ? PRIZE_TOKEN : PRIZE_TOKEN_TEST;
  return Object.keys(prizeToken).find(
    (key) => prizeToken[key].address.toLowerCase() === tokenAddress.toLowerCase(),
  );
};

export const getPrizeTokenDecimalBySymbol = (symbol: string): number => {
  return PRIZE_TOKEN[symbol].decimal;
};

export const numberToBigNumber = (amount: number, decimal: number): BigNumber => {
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

export const bigNumberToNumber = (amount: BigNumber, decimal: number): number => {
  let ret: number;
  try {
    ret = Number(utils.formatUnits(amount, decimal));
    if (Math.abs(ret) < 1e-15) {
      ret = 0;
    }
  } catch (e) {
    ret = 0;
  }
  return ret;
};

