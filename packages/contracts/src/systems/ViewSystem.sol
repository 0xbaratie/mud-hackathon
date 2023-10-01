// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { 
  Config,
  Hackathon,
  HackathonData,
  HackathonVoteNft,
  HackathonVoteNftData,
  HackathonPrize,
  HackathonPrizeData,
  Submission,
  SubmissionData,
  Vote,
  Administrator,
  HackathonPrizeSponsor,
  HackathonPrizeSponsorData,
  HackathonInfo,
  HackathonInfoData,
  SpecialVote
} from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";

contract ViewSystem is System {
  function getMaxHackathonId() public view returns(bytes32){
    return Config.get();
  }

  function getHackathonVoteNft(bytes32 _hackathonId) public view returns(HackathonVoteNftData memory){
    return HackathonVoteNft.get(_hackathonId);
  }

  function getHackathonPrize(bytes32 _hackathonId) public view returns(HackathonPrizeData memory){
    return HackathonPrize.get(_hackathonId);
  }

  function getSubmission(bytes32 _hackathonId, address _submitter) public view returns(SubmissionData memory){
    return Submission.get(_hackathonId, _submitter);
  }

  function getAdministrator() public view returns(address) {
    return Administrator.get();
  }

  function getHackathonSponsor(bytes32 _hackathonId) public view returns(uint256[] memory, address[] memory){
    HackathonPrizeSponsorData memory _data =  HackathonPrizeSponsor.get(_hackathonId);
    return (_data.amounts, _data.sponsors);
  }

  function getHackathonInfo(bytes32 _hackathonId) public view returns(HackathonInfoData memory){
    return HackathonInfo.get(_hackathonId);
  }

  function getHackathon(bytes32 _hackathonId) public view returns(HackathonData memory){
    return Hackathon.get(_hackathonId);
  }

  function getSpecialVote(bytes32 _hackathonId, address _voter)  public view returns(uint256){
    return SpecialVote.getCount(_hackathonId, _voter);
  }

}
