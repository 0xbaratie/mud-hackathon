// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { HackathonPrize,HackathonPrizeData,Hackathon,Config,HackathonData } from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";
import { SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract HackathonPrizeSystem is System {
  using SafeERC20 for IERC20;

  function depositPrize(
    bytes32 _hackathonId,
    uint256 _amount
  ) public  {
    //validate phase
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.PREPARE_PRIZE), "Hackathon is not in PREPARE_PRIZE phase.");

    //set deposit amount
    uint256 _deposit = HackathonPrize.getDeposit(_hackathonId);
    HackathonPrize.setDeposit(_hackathonId, _deposit + _amount);

    //transfer prize token
    IERC20(_hackathonData.prizeToken).safeTransferFrom(_msgSender(), address(this), _amount);
  }  

}
