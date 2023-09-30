// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Hackathon, HackathonData, Submission, SubmissionData, HackathonPrize, HackathonVoteNft, HackathonVoteNftData, SpecialVote, Config, Vote} from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


interface IERC721Enumerable {
    function balanceOf(address owner) external view returns (uint256 balance);
    function tokenOfOwnerByIndex(address owner, uint256 index) external view virtual returns (uint256);
}

struct VoteData {
  address voter;
}


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

  function vote(bytes32 _hackathonId, address[] memory submissionAddresses ) public {    
    // Validate phase
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(uint8(_hackathonData.phase) == uint8(Phase.VOTING), "Hackathon is not in VOTING phase.");

    // Get NFT
    HackathonVoteNftData memory _hackathonNftData = HackathonVoteNft.get(_hackathonId);
    addressERC721 = _hackathonNftData.voteNft;
    
    // VoteSum
    uint256 votesCast = IERC721Enumerable(addressERC721).balanceOf(_msgSender());
    require(submissionAddresses.length <= votesCast, "Voting sum exceed.");

    // After examining the token ID, the Id is utilized to cast a vote.
    for (uint i = 0; i < votesCast; i++) {
      uint256 tokenId = IERC721Enumerable(addressERC721).tokenOfOwnerByIndex(_msgSender(), i);
      SubmissionData memory _submissionData = Submission.get(_hackathonId, submissionAddresses[i]);

      address voter = Vote.get(_hackathonId, tokenId);
      require(voter == address(0), "This tokenId has already been used to vote.");
      
      // Vote counts for submitted projects
      require(bytes(_submissionData.name).length > 0, "Submission does not exist.");
      Submission.setVotes(_hackathonId, submissionAddresses[i], _submissionData.votes + 1);
      
      // Keep a record of who has voted utilizing which Id.
      Vote.set(_hackathonId, tokenId, address(_msgSender()));
    }
  }

  function addSpecialVoter(bytes32 _hackathonId, address _voter, uint32 voteSum) public onlyOwner(_hackathonId) {    
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.PREPARE_PRIZE), "Hackathon is not in PREPARE_PRIZE phase.");

    SpecialVote.set(_hackathonId, _voter, voteSum);
    // Needed to list by hackathon
    HackathonVoteNft.pushSpecialVoters(_hackathonId, _voter);  
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
