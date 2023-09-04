// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Hackathon, HackathonData, Submission, SubmissionData, HackathonPrize, HackathonVoteNft, HackathonVoteNftData, Config, Vote, VoteData} from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IL2VotingOnChainRequest {
  function vote(address, uint64) external;
  function erc721SnapBalance(address, address, uint256) external view returns (uint256);
  function testPlus() external;
}

contract SubmissionSystem is System {
  using SafeERC20 for IERC20;
  event Voted(address indexed holder);

  address public constant ETH_ADDRESS = 0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000;
  address public constant ERC721_L1_BALANCE_CHECK = 0xEe53229C1Ec56798963B703fD79CF409DF310858;
  address public voteToken;
  address public addressERC721;
  uint32 public chainId = 1;
  uint64 public snapshotBlock;
  IL2VotingOnChainRequest public l2VotingOnChainRequest;
  
  modifier onlyOwner(bytes32 _hackathonId) {
    require(Hackathon.get(_hackathonId).owner == _msgSender(), "Only owner can call this function.");
    _;
  }

  mapping(bytes32 => mapping(address => uint256)) public voteCount;

  //TODO
  function setVoteToken(address _voteToken) public {
    if(voteToken != address(0)) revert("Vote token already set.");
    voteToken = _voteToken;
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

  function vote(bytes32 _hackathonId, address _submitter ) public {    
    l2VotingOnChainRequest = IL2VotingOnChainRequest(address(0x112E07dbF91e6f97Fd2a4bF0851c1C5d959B756C));
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    //validate phase
    require(uint8(_hackathonData.phase) == uint8(Phase.VOTING), "Hackathon is not in VOTING phase.");

    HackathonVoteNftData memory _hackathonNftData = HackathonVoteNft.get(_hackathonId);
    addressERC721 = _hackathonNftData.voteNft;
    snapshotBlock = _hackathonNftData.voteNftSnapshot;
    
    VoteData memory _voteData = Vote.get(_hackathonId, address(_msgSender()));
    // Only one check for each address per hackathon to see if you have NFTs
    if (_voteData.aggregated == false) {
      l2VotingOnChainRequest.vote(addressERC721, snapshotBlock);
      uint256 nftBalance = l2VotingOnChainRequest.erc721SnapBalance(addressERC721, _msgSender(), snapshotBlock);
      // l2VotingOnChainRequest.testPlus();
      Vote.set(_hackathonId, address(_msgSender()), nftBalance, true);
    }
    
    // TODO: The condition is being changed for debugging purposes. Need to replace with commented out one later. 
    // require(_voteData.count > voteCount[_hackathonId][address(_msgSender())], "Your voting numbers had already exceed.");
    require(_voteData.count >= voteCount[_hackathonId][address(_msgSender())], "Your voting numbers had already exceed.");
    

    // validate submission
    SubmissionData memory _submissionData = Submission.get(_hackathonId, _submitter);
    require(bytes(_submissionData.name).length > 0, "Submission does not exist.");
    
    //increment votes
    voteCount[_hackathonId][address(_msgSender())] += 1;
    Submission.setVotes(_hackathonId, _submitter, _submissionData.votes + 1);
  }

  function addSpecialVoter(bytes32 _hackathonId, address _voter, uint32 voteSum) public onlyOwner(_hackathonId) {
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.PREPARE_PRIZE), "Hackathon is not in PREPARE_PRIZE phase.");
    Vote.set(_hackathonId, _voter, voteSum, true);
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
