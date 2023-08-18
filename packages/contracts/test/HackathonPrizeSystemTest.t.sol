// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { HackathonPrize, HackathonPrizeData, Config } from "../src/codegen/Tables.sol";
import { MockERC20, MockERC721} from "./HackathonSystemTest.t.sol";

contract HackathonPrizeSystemTest is MudV2Test {
  IWorld public world;
  MockERC20 mock;
  MockERC721 nft;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);

    //set prize token
    mock = new MockERC20("Mock", "Mock", 6);
    deal(address(mock), address(this), 100000e6);
  }

  function testCreateHackathonPrize() public {
    assertEq(Config.get(world), bytes32(uint256(0)));
    world.createHackathonPrize(
      "0x00000",
      17928076
    );

    HackathonPrizeData memory _hackathonPrize = HackathonPrize.get(world, bytes32(uint256(1)));
    assertEq(_hackathonPrize.deposit, 0);
    assertEq(_hackathonPrize.submitters[0], address(1));
    assertEq(_hackathonPrize.voteNft, _stringToAddress("0x00000"));
    assertEq(_hackathonPrize.voteNftSnapshot, 17928076);
    assertEq(Config.get(world), bytes32(uint256(1)));
  }

  function _stringToAddress(string memory _address) internal pure returns (address) {
      bytes memory temp = bytes(_address);
      uint160 addr = 0;
      uint160 b = 0;
      for (uint i = 2; i < 42; i+=2){
          addr *= 256;
          b = uint160(uint8(temp[i]));
          b -= (b < 58) ? 48 : 87;
          addr += b;
          b = uint160(uint8(temp[i+1]));
          b -= (b < 58) ? 48 : 87;
          addr += b;
      }
      return address(addr);
  }

  function testDepositPrize() public {
    world.createHackathon(address(mock),1,2,3,4,1,"test1","uri1","imageUri1");

    mock.approve(address(world), 100000e6);    
    world.depositPrize(bytes32(uint256(1)), 1000e6);
    assertEq(HackathonPrize.getDeposit(world, bytes32(uint256(1))), 1000e6);
    assertEq(mock.balanceOf(address(world)), 1000e6);
    assertEq(mock.balanceOf(address(this)), 99000e6);
    //twice
    deal(address(mock), address(1), 100000e6);
    vm.startPrank(address(1));
    mock.approve(address(world), 100000e6);    
    world.depositPrize(bytes32(uint256(1)), 500e6);
    vm.stopPrank();
    assertEq(HackathonPrize.getDeposit(world, bytes32(uint256(1))), 1500e6);
    assertEq(mock.balanceOf(address(world)), 1500e6);
  }

}
