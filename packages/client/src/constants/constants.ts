export const PRIZE_TOKEN: { [key: string]: { address: string; decimal: number } } = {
  ETH: { address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000', decimal: 18 },
  USDC: { address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', decimal: 6 },
  DAI: { address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimal: 18 },
};

export const PRIZE_TOKEN_TEST: { [key: string]: { address: string; decimal: number } } = {
  ETH: { address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000', decimal: 18 },
  USDC: { address: '0x9aE6CFbd1C1B3110778310f1De1DdE5279695c26', decimal: 6 },
  DAI: { address: '0x1CD1F384e92de13ed3BEaf7eCA8238Db4d3f59e7', decimal: 18 },
};

export const PHASE = {
  NONE: 0,
  PREPARE_PRIZE: 1,
  HACKING: 2,
  VOTING: 3,
  WITHDRAWING: 4,
  END: 5,
};
