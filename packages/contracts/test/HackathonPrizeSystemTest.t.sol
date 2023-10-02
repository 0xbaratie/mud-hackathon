// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { HackathonPrize,HackathonInfoData } from "../src/codegen/Tables.sol";
import { MockERC20} from "./HackathonSystemTest.t.sol";

contract HackathonPrizeSystemTest is MudV2Test {
  IWorld public world;
  MockERC20 mock;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);

    //set prize token
    mock = new MockERC20("Mock", "Mock", 6);
    deal(address(mock), address(this), 100000e6);
  }

  function testDepositPrize() public {
    world.createHackathon(address(mock),block.timestamp + 1,2,3,4,1,HackathonInfoData("test1","uri1","imageUri1","hackathon description1"), 0xb1008c037aA0dB479B9D5b0E49a27337fB29D72E);

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
