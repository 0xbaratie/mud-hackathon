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
  VoteData,
  Administrator
} from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";

contract ViewSystem is System {
  function getMaxHackathonId() public view returns(bytes32){
    return Config.get();
  }

  function getHackathon(bytes32 _hackathonId) public view returns(HackathonData memory){
    return Hackathon.get(_hackathonId);
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

  function getVote(bytes32 _hackathonId, address _voter)  public view returns(VoteData memory){
    return Vote.get(_hackathonId, _voter);
  }

  function getAdministrator() public view returns(address) {
    return Administrator.get();
  }

}
