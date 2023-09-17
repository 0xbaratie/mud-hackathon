// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Administrator,HackathonPrizeData,Hackathon,Config,HackathonData,HackathonPrizeSponsor } from "../codegen/Tables.sol";

contract AdministratorSystem is System {

  modifier onlyAdmin() {
    require(Administrator.get() == _msgSender(), "Only administrator can call this function.");
    _;
  }

  function setAdmin(address _newAdmin) public {
    require(Administrator.get() == address(0), "Already set.");
    Administrator.set(_newAdmin);
  }

  function changeAdmin(address _newAdmin) public onlyAdmin {
    Administrator.set(_newAdmin);
  }

}
