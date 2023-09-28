// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Hackathon, HackathonData, Submission, SubmissionData, HackathonPrize, HackathonVoteNft, HackathonVoteNftData, Config, Vote} from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract SubmissionSystem is System {
  using SafeERC20 for IERC20;
  event Voted(address indexed holder);

  address private constant ETH_ADDRESS = 0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000;
  address public addressERC721;
  uint32 public chainId = 1;
  // IL2VotingOnChainRequest public l2VotingOnChainRequest;
  
  modifier onlyOwner(bytes32 _hackathonId) {
    require(Hackathon.get(_hackathonId).owner == _msgSender(), "Only owner can call this function.");
    _;
  }

  function submit(
    bytes32 _hackathonId,
    string memory _name,
    string memory _description,
    string memory _uri,
    string memory _imageUri
  ) public {
    //validate phase
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.HACKING), "Hackathon is not in SUBMISSION phase.");

    //if new submission, push submitter
    SubmissionData memory _submissionData = Submission.get(_hackathonId, _msgSender());
    if(bytes(_submissionData.name).length == 0){
      HackathonPrize.pushSubmitters(_hackathonId, _msgSender());
    }

    Submission.setName(_hackathonId, _msgSender(), _name);
    Submission.setDescription(_hackathonId, _msgSender(), _description);
    Submission.setUri(_hackathonId, _msgSender(), _uri);
    Submission.setImageUri(_hackathonId, _msgSender(), _imageUri);
  }

  function vote(bytes32 _hackathonId, uint256[] memory submissionIds ) public {    
    // Validate phase
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(uint8(_hackathonData.phase) == uint8(Phase.VOTING), "Hackathon is not in VOTING phase.");

    // Get NFT
    HackathonVoteNftData memory _hackathonNftData = HackathonVoteNft.get(_hackathonId);
    addressERC721 = _hackathonNftData.voteNft;
    
    // VoteSum
    uint256 votesCast = IERC721(addressERC721).balanceOf(_msgSender());
    require(submissionIds.length <= votesCast, "Voting sum exceed.");

    // TODO: Obtain a token ID for each


    // TODO: Add the number of votes to each utilizing the TokenID obtained.
    // validate submission
    // SubmissionData memory _submissionData = Submission.get(_hackathonId, _submitter);
    // require(bytes(_submissionData.name).length > 0, "Submission does not exist.");
    // //increment votes
    // Submission.setVotes(_hackathonId, _submitter, _submissionData.votes + 1);
  }

  function withdrawPrize(bytes32 _hackathonId) public payable {
    //validate phase
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.WITHDRAWING), "Hackathon is not in WITHDRAWING phase.");

    uint256 _prize = Submission.getWithdrawalPrize(_hackathonId, _msgSender());
    Submission.setWithdrawalPrize(_hackathonId, _msgSender(), 0);

    uint256 _deposit = HackathonPrize.getDeposit(_hackathonId);
    HackathonPrize.setDeposit(_hackathonId, _deposit - _prize);

    //if prizeToken is ETH
    if(_hackathonData.prizeToken == ETH_ADDRESS){
      payable(_msgSender()).transfer(_prize);
    }else{
      IERC20(_hackathonData.prizeToken).safeTransfer(_msgSender(), _prize);
    }
  }
}
