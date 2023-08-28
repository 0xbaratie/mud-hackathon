import { PRIZE_TOKEN, PRIZE_TOKEN_TEST } from '../constants/constants';

export const getPrizeTokenSymbol = (input: string, chainId: number): string | undefined => {
  const prizeToken = chainId === 10 ? PRIZE_TOKEN : PRIZE_TOKEN_TEST;
  return Object.keys(prizeToken).find(
    (key) => prizeToken[key].toLowerCase() === input.toLowerCase(),
  );
};
