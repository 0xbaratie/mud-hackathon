// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Config,Owner } from "../codegen/Tables.sol";

contract ConfigSystem is System {
  modifier onlyOwner() {
    // require(Owner.get(msg.sender), "Only owner can call this function.");
    _;
  }

  function setOwner(address _owner, bool _isActive) public onlyOwner {
    Owner.set(_owner, _isActive);
  }

  function setPrizeToken(address _prizeToken) public onlyOwner {
    Config.setPrizeToken(_prizeToken);
  }
}
