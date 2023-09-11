// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { HackathonPrize,HackathonPrizeData,Hackathon,Config,HackathonData,HackathonPrizeSponsor } from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";
import { SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract HackathonPrizeSystem is System {
  using SafeERC20 for IERC20;

  modifier deposit(
    bytes32 _hackathonId,
    uint256 _amount
  ){
    //validate phase
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    require(_hackathonData.phase == uint8(Phase.PREPARE_PRIZE), "Hackathon is not in PREPARE_PRIZE phase.");

    //set deposit amount
    uint256 _deposit = HackathonPrize.getDeposit(_hackathonId);
    HackathonPrize.setDeposit(_hackathonId, _deposit + _amount);

    // push HackathonPrizeSponsor amounts
    HackathonPrizeSponsor.pushAmounts(_hackathonId, _amount);
    HackathonPrizeSponsor.pushSponsors(_hackathonId, _msgSender());

    _;
  }

  function depositPrize(
    bytes32 _hackathonId,
    uint256 _amount
  ) public deposit(_hackathonId, _amount) {
    //transfer prize token
    HackathonData memory _hackathonData = Hackathon.get(_hackathonId);
    IERC20(_hackathonData.prizeToken).safeTransferFrom(_msgSender(), address(this), _amount);
  }  
  
  function depositPrizeEth(
    bytes32 _hackathonId,
    uint256 _amount
  ) public payable deposit(_hackathonId, _amount) {
    //transfer ETH
    require(msg.value == _amount, "ETH amount is not equal to the amount specified.");
  }  

}
