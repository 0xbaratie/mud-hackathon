// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { Owner,Config } from "../src/codegen/Tables.sol";

contract ConfigSystemTest is MudV2Test {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testSetOwner() public {
    world.setOwner(address(0x1234), true);
    assertEq(Owner.get(world,address(0x1234)), true);
  }

  function testSetPrizeToken() public {
    world.setPrizeToken(address(0x1234));
    assertEq(Config.getPrizeToken(world), address(0x1234));
  }

}
