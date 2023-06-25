// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Hackathon, HackathonData,Submission,SubmissionData,HackathonPrize,Config,Vote } from "../codegen/Tables.sol";
import {Phase} from "./HackathonSystem.sol";
import { SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract SubmissionSystem is System {
  using SafeERC20 for IERC20;
  address public voteToken;

  //TODO
  function setVoteToken(address _voteToken) public {
    if(voteToken != address(0)) revert("Vote token already set.");
    voteToken = _voteToken;
  }

  function submit(
    bytes32 _hackathonId,
    string memory _name,
    string memory _uri
  ) public {
    //validate phase
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.HACKING), "Hackathon is not in SUBMISSION phase.");

    //if new submission, push submitter
    SubmissionData memory _submissionData = Submission.get(_hackathonId, msg.sender);
    if(bytes(_submissionData.name).length == 0){
      HackathonPrize.pushSubmitters(_hackathonId, msg.sender);
    }

    Submission.setName(_hackathonId, msg.sender, _name);
    Submission.setUri(_hackathonId, msg.sender, _uri);
  }

  function vote(bytes32 _hackathonId, address _submitter, uint256 _tokenId) public {
    //validate phase
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.VOTING), "Hackathon is not in VOTING phase.");

    // only NFT owners
    require(IERC721(voteToken).ownerOf(_tokenId) == msg.sender, "Only NFT owners can vote.");

    // if already voted, revert
    require(!Vote.get(_hackathonId, _tokenId), "Already voted.");

    //validate submission
    SubmissionData memory _submissionData = Submission.get(_hackathonId, _submitter);
    require(bytes(_submissionData.name).length > 0, "Submission does not exist.");

    //increment votes
    Submission.setVotes(_hackathonId, _submitter, _submissionData.votes + 1);

    //set Vote
    Vote.set(_hackathonId, _tokenId, true);
  }

  function withdrawPrize(bytes32 _hackathonId) public {
    //validate phase
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.WITHDRAWING), "Hackathon is not in WITHDRAWING phase.");

    uint256 _prize = Submission.getWithdrawalPrize(_hackathonId, msg.sender);
    Submission.setWithdrawalPrize(_hackathonId, msg.sender, 0);

    uint256 _deposit = HackathonPrize.getDeposit(_hackathonId);
    HackathonPrize.setDeposit(_hackathonId, _deposit - _prize);

    IERC20(_hackathonData.prizeToken).safeTransfer(msg.sender, _prize);
  }
}
