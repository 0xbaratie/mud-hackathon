// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { Hackathon,HackathonData,Config } from "../src/codegen/Tables.sol";

contract HackathonTest is MudV2Test {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testCreateHackathon() public {
    assertEq(Config.getMaxHackathonId(world), bytes32(uint256(0)));
    uint8 _prizeRank = 1;
    world.createHackathon(
      1,
      2,
      3,
      4,
      1,
      "test1",
      "uri1"
    );

    HackathonData memory _hackathon = Hackathon.get(world, bytes32(uint256(1)));
    assertEq(_hackathon.startTimestamp, 1);
    assertEq(_hackathon.submitPeriod, 2);
    assertEq(_hackathon.votingPeriod, 3);
    assertEq(_hackathon.withdrawalPeriod, 4);
    assertEq(_hackathon.name, "test1");
    assertEq(_hackathon.uri, "uri1");
    assertEq(Config.getMaxHackathonId(world), bytes32(uint256(1)));
    assertEq(_hackathon.prizeRank, 1);

    //increment
    world.createHackathon(
      5,
      6,
      7,
      8,
      2,
      "test2",
      "uri2"
    );
    HackathonData memory _hackathon2 = Hackathon.get(world, bytes32(uint256(2)));
    assertEq(_hackathon2.startTimestamp, 5);
    assertEq(_hackathon2.submitPeriod, 6);
    assertEq(_hackathon2.votingPeriod, 7);
    assertEq(_hackathon2.withdrawalPeriod, 8);
    assertEq(_hackathon2.name, "test2");
    assertEq(_hackathon2.uri, "uri2");
    assertEq(Config.getMaxHackathonId(world), bytes32(uint256(2)));
    assertEq(_hackathon2.prizeRank, 2);
  }

  
}
