// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Hackathon, HackathonData, Submission, SubmissionData, HackathonPrize, HackathonVoteNft, HackathonVoteNftData, Config, Vote, VoteData} from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

struct StateQuery {
    uint32 chainId;
    uint64 blockNumber;
    address fromAddress;
    address toAddress;
    bytes toCalldata;
}

interface IStateQueryGateway {
    function requestStateQuery(
        StateQuery calldata _query,
        bytes4 _callbackMethod,
        bytes calldata _callbackData
    ) external;
}

interface IFeeVault {
    function depositNative(address _account) external payable;
    // function deposit(address _account, address _token, uint256 _amount) external;
}


contract SubmissionSystem is System {
  using SafeERC20 for IERC20;
  event Voted(address indexed holder);

  address public constant ETH_ADDRESS = 0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000;
  address public voteToken;
  // WARNING: Not compatible with Optimism Mainnet at this time.
  address public STATE_QUERY_GATEWAY = address(0x1b132819aFE2AFD5b76eF6721bCCC6Ede40cd9eC);
  address public FEE_VAULT = address(0x608c92Cfc42cd214FCbc3AF9AD799a7E1DfA6De2);
  address public addressERC721;
  uint32 public chainId = 1;
  uint64 public snapshotBlock;

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
    //validate phase
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    HackathonVoteNftData memory _hackathonNftData = HackathonVoteNft.get(_hackathonId);
    require(uint8(_hackathonData.phase) == uint8(Phase.VOTING), "Hackathon is not in VOTING phase.");

    snapshotBlock = _hackathonNftData.voteNftSnapshot;
    addressERC721 = _hackathonNftData.voteNft;

    // Only certain L1 NFT owners
    StateQuery memory stateQuery = StateQuery({
        chainId: chainId,
        blockNumber: snapshotBlock,
        fromAddress: address(0),
        toAddress: addressERC721,
        toCalldata: abi.encodeWithSelector(IERC721.balanceOf.selector, address(_msgSender()))
    });
    
    // TODO: To be fixed after
    // if (voteCount[_hackathonId][address(_msgSender())] == 0) {
    //   IStateQueryGateway(STATE_QUERY_GATEWAY).requestStateQuery(
    //       stateQuery,
    //       SubmissionSystem.continueVote.selector,
    //       abi.encode(_hackathonId, address(_msgSender()))
    //   );
    //   uint256 feePerRequest = 0.003 ether + 100000 gwei;
    //   IFeeVault(FEE_VAULT).depositNative{value: feePerRequest}(address(this));
    // }
    voteCount[_hackathonId][address(_msgSender())] = 1;

    // validate submission
    SubmissionData memory _submissionData = Submission.get(_hackathonId, _submitter);
    VoteData memory _voteData = Vote.get(_hackathonId, address(_msgSender()));
    require(bytes(_submissionData.name).length > 0, "Submission does not exist.");
    require(voteCount[_hackathonId][address(_msgSender())] > _voteData.count, "Your voting numbers had already exceed.");
    //increment votes
    Submission.setVotes(_hackathonId, _submitter, _submissionData.votes + 1);

    //set Vote
    Vote.set(_hackathonId, _submitter, _voteData.count + 1, false);
  }

  function continueVote(bytes memory _requestResult, bytes memory _callbackExtraData) external {
      require(address(_msgSender()) == STATE_QUERY_GATEWAY, "Only STATE_QUERY_GATEWAY can call this function.");
      uint256 balance = abi.decode(_requestResult, (uint256));
      // (uint256 _hackathonId, address _msgSender()) = abi.decode(_callbackExtraData, (uint256, address));
      (bytes32 _hackathonId, address _msgSender) = abi.decode(_callbackExtraData, (bytes32, address));
      if (balance >= 1) {
        voteCount[_hackathonId][_msgSender] = balance;
      }
      emit Voted(_msgSender);
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
