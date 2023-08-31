import { PRIZE_TOKEN, PRIZE_TOKEN_TEST } from '../constants/constants';
import { BigNumber, utils } from 'ethers';

export const getPrizeTokenSymbol = (input: string, chainId: number): string | undefined => {
  const prizeToken = chainId === 10 ? PRIZE_TOKEN : PRIZE_TOKEN_TEST;
  return Object.keys(prizeToken).find(
    (key) => prizeToken[key].toLowerCase() === input.toLowerCase(),
  );
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
  } catch (e) {
    // console.log('error', e);
    ret = 0;
  }
  // console.log('bigNumber', bigNumber.toNumber());
  return ret;
};
