// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { Administrator } from "../src/codegen/Tables.sol";

contract AdministratorSystemTest is MudV2Test {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testChangeAdmin() public {
    world.setAdmin(address(1));
    assertEq(Administrator.get(world), address(1));
    vm.prank(address(1));
    world.changeAdmin(address(2));
    assertEq(Administrator.get(world), address(2));
  }

  function testChangeAdmin2() public {
    world.setAdmin(address(1));
    vm.expectRevert(bytes("Only administrator can call this function."));
    world.changeAdmin(address(1));
    vm.expectRevert(bytes("Already set."));
    world.setAdmin(address(1));
  }

}
