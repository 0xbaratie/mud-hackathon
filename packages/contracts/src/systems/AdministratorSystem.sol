// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Administrator } from "../codegen/Tables.sol";
import { Hackathon,HackathonData,HackathonPrize,Submission,HackathonVoteNft } from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";

contract AdministratorSystem is System {

  modifier onlyAdmin() {
    require(Administrator.get() == _msgSender(), "Only owner can call this function.");
    _;
  }

  function deleteHackathonByAdmin(bytes32 _hackathonId) public onlyAdmin() {
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.PREPARE_PRIZE), "Hackathon is not in PREPARE_PRIZE phase.");

    Hackathon.deleteRecord(_hackathonId);
    HackathonVoteNft.deleteRecord(_hackathonId);
    HackathonPrize.deleteRecord(_hackathonId);
  }
}
