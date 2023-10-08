// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Hackathon,Config,HackathonData,HackathonPrize,HackathonPrizeData,Submission,SubmissionData,HackathonVoteNft,HackathonVoteNftData,Administrator,HackathonPrizeSponsor,HackathonInfo,HackathonInfoData } from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract HackathonSystem is System {
  using SafeERC20 for IERC20;

  address private constant ETH_ADDRESS = 0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000;
  address public owner;
  address[] specialVoters;

  modifier onlyOwner(bytes32 _hackathonId) {
    require(Hackathon.get(_hackathonId).owner == _msgSender(), "Only owner can call this function.");
    _;
  }

  modifier onlyAdmin() {
    require(Administrator.get() == _msgSender(), "Only administrator can call this function.");
    _;
  }

  function _incrementHackathonId() internal returns(bytes32 newHackathonId_){
    newHackathonId_ = bytes32(uint256(Config.get()) + 1);
    Config.set(newHackathonId_);
  }

  function createHackathon(
    address _prizeToken,
    uint256 _startTimestamp,
    uint256 _submitPeriod,
    uint256 _votingPeriod,
    uint256 _withdrawalPeriod,
    uint8 _winnerCount,
    HackathonInfoData memory _hackathonInfo,
    address _voteNft
  ) public  {
    require(_startTimestamp >= block.timestamp, "StartTimestamp is not future.");
    bytes32 _hackathonId = _incrementHackathonId();
    Hackathon.set(_hackathonId,HackathonData(
      _msgSender(),
      _prizeToken,
      uint8(Phase.PREPARE_PRIZE),
      _startTimestamp,
      _submitPeriod,
      _votingPeriod,
      _withdrawalPeriod,
      _winnerCount
    ));
    HackathonInfo.set(_hackathonId,_hackathonInfo);
    HackathonVoteNft.set(_hackathonId,
      HackathonVoteNftData(_voteNft, specialVoters)
    );
    HackathonPrize.set(_hackathonId,
      HackathonPrizeData( 0, new address[](0))
    );
    // To avoid voting for any project
    Submission.setName(_hackathonId, address(0x0000000000000000000000000000000000000000), "Vote None");
  }
  
  function updateHackathon(
    bytes32 _hackathonId,
    address _prizeToken,
    uint256 _startTimestamp,
    uint256 _submitPeriod,
    uint256 _votingPeriod,
    uint256 _withdrawalPeriod,
    uint8 _winnerCount,
    HackathonInfoData memory _hackathonInfo,
    address _voteNft
  ) public onlyOwner(_hackathonId) {
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.PREPARE_PRIZE), "Hackathon is not in PREPARE_PRIZE phase.");

    HackathonData memory _newHackathonData = HackathonData(
      _msgSender(),
      _prizeToken,
      uint8(Phase.PREPARE_PRIZE),
      _startTimestamp,
      _submitPeriod,
      _votingPeriod,
      _withdrawalPeriod,
      _winnerCount
    );
    Hackathon.set(_hackathonId,_newHackathonData);
    HackathonInfo.set(_hackathonId,_hackathonInfo);

    HackathonVoteNft.set(_hackathonId,
      HackathonVoteNftData(_voteNft, specialVoters)
    );
  }

  function deleteHackathon(bytes32 _hackathonId) public onlyOwner(_hackathonId) {
    _deleteHackathon(_hackathonId);
  }

  function deleteHackathonByAdmin(bytes32 _hackathonId) public onlyAdmin() {
    _deleteHackathon(_hackathonId);
  }

  function _deleteHackathon(bytes32 _hackathonId) internal {
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.PREPARE_PRIZE), "Hackathon is not in PREPARE_PRIZE phase.");

    Hackathon.deleteRecord(_hackathonId);
    HackathonInfo.deleteRecord(_hackathonId);
    HackathonVoteNft.deleteRecord(_hackathonId);
    HackathonPrize.deleteRecord(_hackathonId);

    // return prize to sponsor and delete record
    uint[] memory _amounts = HackathonPrizeSponsor.getAmounts(_hackathonId);
    address[] memory _sponsors = HackathonPrizeSponsor.getSponsors(_hackathonId);
    uint _len = _amounts.length;
    if(_hackathonData.prizeToken == ETH_ADDRESS){
      for(uint i = 0; i < _len; i++){
        payable(_sponsors[i]).transfer(_amounts[i]);
      }
    }else{
      for(uint i = 0; i < _len; i++){
        IERC20(_hackathonData.prizeToken).safeTransfer(_sponsors[i], _amounts[i]);
      }
    }
    HackathonPrizeSponsor.deleteRecord(_hackathonId);
  }

  function proceedPhase(bytes32 _hackathonId) public onlyOwner(_hackathonId) {
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);

    if(_hackathonData.phase == uint8(Phase.PREPARE_PRIZE)){
      require(_hackathonData.startTimestamp < block.timestamp, "StartTimestamp is not passed.");
      Hackathon.setPhase(_hackathonId,uint8(Phase.HACKING));

    }else if(_hackathonData.phase == uint8(Phase.HACKING)){
      // startTimestamp + submitPeriod is past
      require(_hackathonData.submitPeriod < block.timestamp, "SubmitPeriod is not passed.");
      Hackathon.setPhase(_hackathonId,uint8(Phase.VOTING));

    }else if(_hackathonData.phase == uint8(Phase.VOTING)){
      // startTimestamp + submitPeriod + votingPeriod is past
      require(_hackathonData.votingPeriod < block.timestamp, "VotingPeriod is not passed.");
      Hackathon.setPhase(_hackathonId,uint8(Phase.WITHDRAWING));
      _finishVoting(_hackathonId);

    }else if(_hackathonData.phase == uint8(Phase.WITHDRAWING)){
      // startTimestamp + submitPeriod + votingPeriod + withdrawalPeriod is past
      require(_hackathonData.withdrawalPeriod < block.timestamp, "WithdrawalPeriod is not passed.");
      Hackathon.setPhase(_hackathonId,uint8(Phase.END));

    }else{
      revert("Cannot proceed phase.");
    }
  }

  struct SubmitterWithVote{
    address submitter;
    uint256 votes;
  }

  function _finishVoting(bytes32 _hackathonId) internal {
    //judge and set winners by votes, the number of winners is _hackathonData.winnerCount
    address[] memory _submitters = HackathonPrize.getSubmitters(_hackathonId);
    uint8 _submittersLength = uint8(_submitters.length);
    uint8 _winnerCount = Hackathon.get(_hackathonId).winnerCount;
    if(_submittersLength < _winnerCount) {
        // Just return if there are not enough submitters
        return;
    }

    //set memory
    SubmitterWithVote[] memory _submittersWithVotes = new SubmitterWithVote[](_submittersLength);

    //sort by votes
    for(uint8 i =0; i < _submittersLength; i++){
      _submittersWithVotes[i] = SubmitterWithVote(_submitters[i], Submission.getVotes(_hackathonId,_submitters[i]));
    }
    for(uint8 i =0; i < uint8(_submittersLength); i++){
      for(uint8 j =0; j < uint8(_submittersLength) - i - 1; j++){
        if(_submittersWithVotes[j].votes < _submittersWithVotes[j+1].votes){
          SubmitterWithVote memory temp = _submittersWithVotes[j];
          _submittersWithVotes[j] = _submittersWithVotes[j+1];
          _submittersWithVotes[j+1] = temp;
        }
      }
    }

    // count winners. if there are same votes, they are all winners.
    for(uint8 i = _winnerCount; i < _submittersLength; i++){
      if(_submittersWithVotes[i - 1].votes == _submittersWithVotes[i].votes){
        _winnerCount++;
      }else{
        break;
      }
    }

    //set winners
    uint256 _prize = HackathonPrize.getDeposit(_hackathonId) / _winnerCount;
    for(uint8 i = 0; i < _winnerCount; i++){
      Submission.setWithdrawalPrize(_hackathonId,_submittersWithVotes[i].submitter, _prize);
    }
  }

  function withdrawByOwner(bytes32 _hackathonId) public onlyOwner(_hackathonId) {
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.END), "Hackathon is not in END phase.");

    //if deposit is left, withdraw to owner
    uint256 _deposit = HackathonPrize.getDeposit(_hackathonId);
    if(_deposit > 0){
      HackathonPrize.setDeposit(_hackathonId,0);
      IERC20(_hackathonData.prizeToken).safeTransfer(_msgSender(), _deposit);
    }

  }

}
