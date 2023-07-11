// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { Hackathon,HackathonData,Config,Submission } from "../src/codegen/Tables.sol";
import { Phase } from "../src/systems/HackathonSystem.sol";
import { ERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC721, IERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC20 is ERC20 {
  uint8 _decimals;
  constructor(string memory name_, string memory symbol_, uint8 __decimals) ERC20(name_, symbol_) {
    _decimals = __decimals;
  }
  function decimals() public view override returns (uint8) {
    return _decimals;
  }
}

contract MockERC721 is ERC721 {
  constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}
  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }
}

contract HackathonSystemTest is MudV2Test {
  IWorld public world;
  MockERC20 mock;
  MockERC721 nft;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);

    //set prize token
    mock = new MockERC20("Mock", "Mock", 6);
    deal(address(mock), address(this), 100000e6);
    //mint nft
    nft = new MockERC721("NFT", "NFT");
    nft.mint(address(this), 1);
    nft.mint(address(this), 2);
    nft.mint(address(this), 3);
    nft.mint(address(1), 4);
    world.setVoteToken(address(nft));
  }

  function testCreateHackathon() public {
    assertEq(Config.get(world), bytes32(uint256(0)));
    world.createHackathon(
      address(mock),
      1,
      2,
      3,
      4,
      1,
      "test1",
      "uri1","imageUri1"
    );

    HackathonData memory _hackathon = Hackathon.get(world, bytes32(uint256(1)));
    assertEq(_hackathon.owner, address(this));
    assertEq(_hackathon.prizeToken, address(mock));
    assertEq(_hackathon.phase, uint8(Phase.PREPARE_PRIZE));
    assertEq(_hackathon.startTimestamp, 1);
    assertEq(_hackathon.submitPeriod, 2);
    assertEq(_hackathon.votingPeriod, 3);
    assertEq(_hackathon.withdrawalPeriod, 4);
    assertEq(_hackathon.name, "test1");
    assertEq(_hackathon.uri, "uri1");
    assertEq(_hackathon.winnerCount, 1);
    assertEq(Config.get(world), bytes32(uint256(1)));

    //increment by another
    vm.prank(address(1));
    world.createHackathon(
      address(2),
      5,
      6,
      7,
      8,
      2,
      "test2",
      "uri2","imageUri2"
    );
    HackathonData memory _hackathon2 = Hackathon.get(world, bytes32(uint256(2)));
    assertEq(_hackathon2.owner, address(1));
    assertEq(_hackathon2.prizeToken, address(2));
    assertEq(_hackathon2.phase, uint8(Phase.PREPARE_PRIZE));
    assertEq(_hackathon2.startTimestamp, 5);
    assertEq(_hackathon2.submitPeriod, 6);
    assertEq(_hackathon2.votingPeriod, 7);
    assertEq(_hackathon2.withdrawalPeriod, 8);
    assertEq(_hackathon2.name, "test2");
    assertEq(_hackathon2.uri, "uri2");
    assertEq(_hackathon2.winnerCount, 2);
    assertEq(Config.get(world), bytes32(uint256(2)));
  }

  function testUpdateHackathon() public {
    world.createHackathon(
      address(mock),
      1,
      2,
      3,
      4,
      1,
      "test1",
      "uri1","imageUri1"
    );

    world.updateHackathon(
      bytes32(uint256(1)),
      address(1),
      5,
      6,
      7,
      8,
      2,
      "test2",
      "uri2","imageUri2"
    );
    HackathonData memory _hackathon = Hackathon.get(world, bytes32(uint256(1)));
    assertEq(_hackathon.owner, address(this));
    assertEq(_hackathon.prizeToken, address(1));
    assertEq(_hackathon.phase, uint8(Phase.PREPARE_PRIZE));
    assertEq(_hackathon.startTimestamp, 5);
    assertEq(_hackathon.submitPeriod, 6);
    assertEq(_hackathon.votingPeriod, 7);
    assertEq(_hackathon.withdrawalPeriod, 8);
    assertEq(_hackathon.winnerCount, 2);
    assertEq(_hackathon.name, "test2");
    assertEq(_hackathon.uri, "uri2");
    assertEq(Config.get(world), bytes32(uint256(1)));
  }

  function testFixHackathon() public {
    world.createHackathon(address(mock),1,2,3,4,1,"test1","uri1","imageUri1");

    //revert
    vm.expectRevert(bytes("Deposit amount must be greater than 0."));    
    world.fixHackathon(bytes32(uint256(1)));

    mock.approve(address(world), 100000e6);    
    world.depositPrize(bytes32(uint256(1)), 100);
    world.fixHackathon(bytes32(uint256(1)));
    assertEq(Hackathon.get(world, bytes32(uint256(1))).phase, uint8(Phase.FIXED_PRIZE));
  }

  function testProceedPhase() public {
    world.createHackathon(address(mock),block.timestamp + 1,2,3,4,1,"test1","uri1","imageUri1");

    vm.expectRevert(bytes("Cannot proceed phase."));
    world.proceedPhase(bytes32(uint256(1)));

    //fix
    mock.approve(address(world), 100000e6);    
    world.depositPrize(bytes32(uint256(1)), 100);
    world.fixHackathon(bytes32(uint256(1)));

    //proceed HACKING
    vm.expectRevert(bytes("StartTimestamp is not passed."));
    world.proceedPhase(bytes32(uint256(1)));

    skip(2);
    world.proceedPhase(bytes32(uint256(1)));
    assertEq(Hackathon.get(world, bytes32(uint256(1))).phase, uint8(Phase.HACKING));

    //proceed VOTING
    vm.expectRevert(bytes("SubmitPeriod is not passed."));
    world.proceedPhase(bytes32(uint256(1)));

    world.submit(bytes32(uint256(1)), "submit1","submit1","submitImage1"); //submit
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));
    assertEq(Hackathon.get(world, bytes32(uint256(1))).phase, uint8(Phase.VOTING));

    //proceed WITHDRAWING
    vm.expectRevert(bytes("VotingPeriod is not passed."));
    world.proceedPhase(bytes32(uint256(1)));

    skip(3);
    world.proceedPhase(bytes32(uint256(1)));
    assertEq(Hackathon.get(world, bytes32(uint256(1))).phase, uint8(Phase.WITHDRAWING));

    //proceed END
    vm.expectRevert(bytes("WithdrawalPeriod is not passed."));
    world.proceedPhase(bytes32(uint256(1)));

    skip(4);
    world.proceedPhase(bytes32(uint256(1)));
    assertEq(Hackathon.get(world, bytes32(uint256(1))).phase, uint8(Phase.END));
  }

  function testFinishVotingRevert() public {
    world.createHackathon(address(mock),block.timestamp + 1,2,3,4,
      2, // 2 winners
      "test1","uri1","imageUri1");

    //fix
    mock.approve(address(world), 100000e6);    
    world.depositPrize(bytes32(uint256(1)), 100);
    world.fixHackathon(bytes32(uint256(1)));

    //proceed HACKING
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));

    //proceed VOTING
    world.submit(bytes32(uint256(1)), "submit1","submit1","submitImage1"); //submit only 1
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));

    //proceed WITHDRAWING
    skip(3);
    vm.expectRevert(bytes("The number of submitters is less than the number of winners."));
    world.proceedPhase(bytes32(uint256(1)));

  }

  function testFinishVoting1() public {
    world.createHackathon(address(mock),block.timestamp + 1,2,3,4,1,"test1","uri1","imageUri1");

    //fix
    mock.approve(address(world), 100000e6);    
    world.depositPrize(bytes32(uint256(1)), 100);
    world.fixHackathon(bytes32(uint256(1)));

    //proceed HACKING
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));

    //proceed VOTING
    world.submit(bytes32(uint256(1)), "submit1","submit1","submitImage1"); //submit
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));

    //proceed WITHDRAWING
    skip(3);
    world.proceedPhase(bytes32(uint256(1)));

    assertEq(Submission.getWithdrawalPrize(world, bytes32(uint256(1)), address(this)), 100);
  }

  function testFinishVoting2() public {
    world.createHackathon(address(mock),block.timestamp + 1,2,3,4,
      2, // 2 winners
      "test1","uri1","imageUri1");

    //fix
    mock.approve(address(world), 100000e6);    
    world.depositPrize(bytes32(uint256(1)), 100);
    world.fixHackathon(bytes32(uint256(1)));

    //proceed HACKING
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));

    //proceed VOTING
    world.submit(bytes32(uint256(1)), "submit1","submit1","submitImage1"); //submit
    vm.prank(address(1));
    world.submit(bytes32(uint256(1)), "submit2","submit2","submitImage2"); //submit
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));

    //proceed WITHDRAWING
    skip(3);
    world.proceedPhase(bytes32(uint256(1)));

    assertEq(Submission.getWithdrawalPrize(world, bytes32(uint256(1)), address(this)), 50);
    assertEq(Submission.getWithdrawalPrize(world, bytes32(uint256(1)), address(1)), 50);
  }

  function testFinishVoting3() public { //winnerCount is 2 but really 3
    world.createHackathon(address(mock),block.timestamp + 1,2,3,4,
      2, // 2 winners
      "test1","uri1","imageUri1");

    //fix
    mock.approve(address(world), 100000e6);    
    world.depositPrize(bytes32(uint256(1)), 100);
    world.fixHackathon(bytes32(uint256(1)));

    //proceed HACKING
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));

    world.submit(bytes32(uint256(1)), "submit1","submit1","submitImage1"); //submit
    vm.prank(address(1));
    world.submit(bytes32(uint256(1)), "submit2","submit2","submitImage2"); //submit
    vm.prank(address(2));
    world.submit(bytes32(uint256(1)), "submit3","submit3","submitImage3"); //submit
    vm.prank(address(3));
    world.submit(bytes32(uint256(1)), "submit4","submit4","submitImage4"); //submit

    //proceed VOTING
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));
    world.vote(bytes32(uint256(1)), address(this), 1);
    world.vote(bytes32(uint256(1)), address(1), 2);
    world.vote(bytes32(uint256(1)), address(2), 3);

    //proceed WITHDRAWING
    skip(3);
    world.proceedPhase(bytes32(uint256(1)));

    assertEq(Submission.getWithdrawalPrize(world, bytes32(uint256(1)), address(this)), 33);
    assertEq(Submission.getWithdrawalPrize(world, bytes32(uint256(1)), address(1)), 33);
    assertEq(Submission.getWithdrawalPrize(world, bytes32(uint256(1)), address(2)), 33);
    assertEq(Submission.getWithdrawalPrize(world, bytes32(uint256(1)), address(3)), 0);
  }

  function testWithdrawByOwner() public {
    world.createHackathon(address(mock),block.timestamp + 1,2,3,4,1,"test1","uri1","imageUri1");

    vm.expectRevert(bytes("Hackathon is not in END phase."));
    world.withdrawByOwner(bytes32(uint256(1)));

    //fix
    mock.approve(address(world), 100000e6);    
    world.depositPrize(bytes32(uint256(1)), 100);
    world.fixHackathon(bytes32(uint256(1)));

    //proceed HACKING
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));

    //proceed VOTING
    world.submit(bytes32(uint256(1)), "submit1","submit1","submitImage1"); //submit
    skip(2);
    world.proceedPhase(bytes32(uint256(1)));

    //proceed WITHDRAWING
    skip(3);
    world.proceedPhase(bytes32(uint256(1)));

    //proceed END
    skip(4);
    world.proceedPhase(bytes32(uint256(1)));

    // withdrawByOwner
    world.withdrawByOwner(bytes32(uint256(1)));
    assertEq(mock.balanceOf(address(world)), 0);
    assertEq(mock.balanceOf(address(this)), 100000e6);
  }

}
