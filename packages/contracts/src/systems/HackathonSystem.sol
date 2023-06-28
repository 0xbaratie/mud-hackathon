// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Hackathon,Config,HackathonData,HackathonPrize,Submission } from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract HackathonSystem is System {
  using SafeERC20 for IERC20;

  modifier onlyOwner() {
    //TODO
    // require(Owner.get(_msgSender()), "Only owner can call this function.");
    _;
  }

  modifier onlyPhasePrepare(bytes32 _hackathonId) {
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.PREPARE_PRIZE), "Hackathon is not in PREPARE_PRIZE phase.");
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
    string memory _name,
    string memory _uri
  ) public {
    Hackathon.set(_incrementHackathonId(),HackathonData(
      _msgSender(),
      _prizeToken,
      uint8(Phase.PREPARE_PRIZE),
      _startTimestamp,
      _submitPeriod,
      _votingPeriod,
      _withdrawalPeriod,
      _winnerCount,
      _name,
      _uri
    ));
  }
  
  function updateHackathon(
    bytes32 _hackathonId,
    address _prizeToken,
    uint256 _startTimestamp,
    uint256 _submitPeriod,
    uint256 _votingPeriod,
    uint256 _withdrawalPeriod,
    uint8 _winnerCount,
    string memory _name,
    string memory _uri
  ) public onlyOwner onlyPhasePrepare(_hackathonId) {
    Hackathon.set(_hackathonId,HackathonData(
      _msgSender(),
      _prizeToken,
      uint8(Phase.PREPARE_PRIZE),
      _startTimestamp,
      _submitPeriod,
      _votingPeriod,
      _withdrawalPeriod,
      _winnerCount,
      _name,
      _uri
    ));
  }

  function fixHackathon(bytes32 _hackathonId) public onlyOwner onlyPhasePrepare(_hackathonId){
    uint256 _deposit = HackathonPrize.getDeposit(_hackathonId);
    require(_deposit > 0, "Deposit amount must be greater than 0.");
    Hackathon.setPhase(_hackathonId,uint8(Phase.FIXED_PRIZE));
  }

  function proceedPhase(bytes32 _hackathonId) public {
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    if(_hackathonData.phase == uint8(Phase.FIXED_PRIZE)){
      require(_hackathonData.startTimestamp < block.timestamp, "StartTimestamp is not passed.");
      Hackathon.setPhase(_hackathonId,uint8(Phase.HACKING));

    }else if(_hackathonData.phase == uint8(Phase.HACKING)){
      // startTimestamp + submitPeriod is past
      require(_hackathonData.startTimestamp + _hackathonData.submitPeriod < block.timestamp, "SubmitPeriod is not passed.");
      Hackathon.setPhase(_hackathonId,uint8(Phase.VOTING));

    }else if(_hackathonData.phase == uint8(Phase.VOTING)){
      // startTimestamp + submitPeriod + votingPeriod is past
      require(_hackathonData.startTimestamp + _hackathonData.submitPeriod + _hackathonData.votingPeriod < block.timestamp, "VotingPeriod is not passed.");
      Hackathon.setPhase(_hackathonId,uint8(Phase.WITHDRAWING));
      _finishVoting(_hackathonId);

    }else if(_hackathonData.phase == uint8(Phase.WITHDRAWING)){
      // startTimestamp + submitPeriod + votingPeriod + withdrawalPeriod is past
      require(_hackathonData.startTimestamp + _hackathonData.submitPeriod + _hackathonData.votingPeriod + _hackathonData.withdrawalPeriod < block.timestamp, "WithdrawalPeriod is not passed.");
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
    if(_submittersLength < _winnerCount) revert ("The number of submitters is less than the number of winners.");

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

  function withdrawByOwner(bytes32 _hackathonId) public onlyOwner {
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
