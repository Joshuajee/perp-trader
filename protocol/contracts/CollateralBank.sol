// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract CollateralBank is Ownable {

    event DepositCollateral(address indexed liquidityProvider, uint assets);

    using SafeERC20 for IERC20;

    IERC20 gho;

    constructor(IERC20 _gho) {
        gho = _gho;
    }

    function withdraw(address receiver, uint value) external onlyOwner() {
        gho.safeTransfer(receiver, value);
    }

}

