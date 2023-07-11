import { getComponentValue } from '@latticexyz/recs';
import { awaitStreamValue } from '@latticexyz/utils';
import { ClientComponents } from './createClientComponents';
import { SetupNetworkResult } from './setupNetwork';

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { Counter }: ClientComponents,
) {
  const increment = async () => {
    const tx = await worldSend('increment', []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };
  const createHackathon = async (
    _prizeToken: string,
    _startTimestamp: number,
    _submitPeriod: number,
    _votingPeriod: number,
    _withdrawalPeriod: number,
    _winnerCount: number,
    _name: string,
    _uri: string,
    _imageUri: string,
  ) => {
    const tx = await worldSend('createHackathon', [
      _prizeToken,
      _startTimestamp,
      _submitPeriod,
      _votingPeriod,
      _withdrawalPeriod,
      _winnerCount,
      _name,
      _uri,
      _imageUri,
    ]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  return {
    increment,
    createHackathon,
  };
}
