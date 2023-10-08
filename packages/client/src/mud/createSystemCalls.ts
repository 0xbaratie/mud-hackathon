import { getComponentValue } from '@latticexyz/recs';
import { awaitStreamValue } from '@latticexyz/utils';
import { ClientComponents } from './createClientComponents';
import { SetupNetworkResult } from './setupNetwork';
import { ethers } from 'ethers';

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { Counter }: ClientComponents,
) {
  const increment = async () => {
    const tx = await worldSend('increment', []);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
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
    _description: string,
    _voteNft: string,
  ) => {
    const tx = await worldSend('createHackathon', [
      _prizeToken,
      _startTimestamp,
      _submitPeriod,
      _votingPeriod,
      _withdrawalPeriod,
      _winnerCount,
      { name: _name, uri: _uri, imageUri: _imageUri, description: _description },
      _voteNft
    ]);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const updateHackathon = async (
    _hackathonId: string,
    _prizeToken: string,
    _startTimestamp: number,
    _submitPeriod: number,
    _votingPeriod: number,
    _withdrawalPeriod: number,
    _winnerCount: number,
    _name: string,
    _uri: string,
    _imageUri: string,
    _description: string,
    _voteNft: string,
  ) => {
    const tx = await worldSend('updateHackathon', [
      _hackathonId,
      _prizeToken,
      _startTimestamp,
      _submitPeriod,
      _votingPeriod,
      _withdrawalPeriod,
      _winnerCount,
      { name: _name, uri: _uri, imageUri: _imageUri, description: _description},
      _voteNft
    ]);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const deleteHackathon = async (_hackathonId: string) => {
    const tx = await worldSend('deleteHackathon', [_hackathonId]);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const deleteHackathonByAdmin = async (_hackathonId: string) => {
    const tx = await worldSend('deleteHackathon', [_hackathonId]);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const proceedPhase = async (_hackathonId: string) => {
    const tx = await worldSend('proceedPhase', [_hackathonId]);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const depositPrize = async (_hackathonId: string, _amount: ethers.BigNumber) => {
    const tx = await worldSend('depositPrize', [_hackathonId, _amount]);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const depositPrizeEth = async (_hackathonId: string, _amount: ethers.BigNumber) => {
    const tx = await worldSend('depositPrizeEth', [_hackathonId, _amount], {
      value: _amount.toNumber(),
    });
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const addSpecialVoter = async (_hackathonId: string, _voterAddress: string, _amount: number) => {
    const tx = await worldSend('addSpecialVoter', [_hackathonId, _voterAddress, _amount]);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };


  const submit = async (
    _hackathonId: string,
    _name: string,
    _description: string,
    _uri: string,
    _imageUri: string,
  ) => {
    const tx = await worldSend('submit', [_hackathonId, _name, _description, _uri, _imageUri]);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const vote = async (_hackathonId: string, _submitters: string[]) => {
    const tx = await worldSend('vote', [_hackathonId, _submitters]);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const withdrawPrize = async (_hackathonId: string) => {
    const tx = await worldSend('withdrawPrize', [_hackathonId]);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const withdrawByOwner = async (_hackathonId: string) => {
    const tx = await worldSend('withdrawByOwner', [_hackathonId]);
  };

  return {
    increment,
    createHackathon,
    updateHackathon,
    deleteHackathon,
    deleteHackathonByAdmin,
    proceedPhase,
    depositPrize,
    depositPrizeEth,
    addSpecialVoter,
    submit,
    vote,
    withdrawPrize,
    withdrawByOwner,
  };
}
