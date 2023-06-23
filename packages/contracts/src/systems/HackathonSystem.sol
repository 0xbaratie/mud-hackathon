// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Hackathon,Config,Owner,HackathonData } from "../codegen/Tables.sol";

contract HackathonSystem is System {

  modifier onlyOwner() {
    require(Owner.get(msg.sender), "Only owner can call this function.");
    _;
  }

  function _incrementHackathonId() internal returns(bytes32 newHackathonId_){
    newHackathonId_ = bytes32(uint256(Config.getMaxHackathonId()) + 1);
    Config.setMaxHackathonId(newHackathonId_);
  }

  function createHackathon(
    string memory _name,
    string memory _uri,
    uint256 _startTimestamp,
    uint256 _submitPeriod,
    uint256 _votingPeriod,
    uint256 _withdrawalPeriod
  ) public onlyOwner {
    HackathonData memory _hackathonData = HackathonData(
      _name,
      _uri,
      0,
      _startTimestamp,
      _submitPeriod,
      _votingPeriod,
      _withdrawalPeriod
    );
    Hackathon.set(_incrementHackathonId(),_hackathonData);
  }

}
