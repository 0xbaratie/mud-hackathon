// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Hackathon,Config,Owner } from "../codegen/Tables.sol";

contract HackathonSystem is System {

  modifier onlyOwner() {
    require(Owner.get(msg.sender), "Only owner can call this function.");
    _;
  }

  function createHackathon() public onlyOwner {
    // Hackathon.

  }

}
