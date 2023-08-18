// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { HackathonPrize,HackathonPrizeData,Hackathon,Config,HackathonData } from "../codegen/Tables.sol";
import { Phase } from "../codegen/Types.sol";
import { SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract HackathonPrizeSystem is System {
  using SafeERC20 for IERC20;

  function _incrementHackathonId() internal returns(bytes32 newHackathonId_){
    newHackathonId_ = bytes32(uint256(Config.get()) + 1);
    Config.set(newHackathonId_);
  }

  function createHackathonPrize(
    string memory _voteNft,
    uint256 _voteNftSnapshot
  ) public {
    HackathonPrize.set(
      _incrementHackathonId(),
      HackathonPrizeData(
        0,
        new address[](0),
        // _stringToAddress( '0xb1008c037aa0db479b9d5b0e49a27337fb29d72e'),
        address(0x0000000),
        _voteNftSnapshot
      )
    );
    // memo: For debug
    // Hackathon.setOwner(
    //   _incrementHackathonId(),
    //   _msgSender()
    // );
    // HackathonPrize.setDeposit(
    //   _incrementHackathonId(),
    //   0
    // );
    
  }

  function _stringToAddress(string memory _address) internal pure returns (address) {
      bytes memory temp = bytes(_address);
      uint160 addr = 0;
      uint160 b = 0;
      for (uint i = 2; i < 42; i+=2){
          addr *= 256;
          b = uint160(uint8(temp[i]));
          b -= (b < 58) ? 48 : 87;
          addr += b;
          b = uint160(uint8(temp[i+1]));
          b -= (b < 58) ? 48 : 87;
          addr += b;
      }
      return address(addr);
  }

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
