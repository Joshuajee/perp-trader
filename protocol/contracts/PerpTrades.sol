// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract PerpTrades is ERC4626, Ownable {

    event DepositLiquidity(address indexed liquidityProvider, uint assets);
    event DepositCollateral(address indexed liquidityProvider, uint assets);
    event WithdrawLiquidity(address indexed gho, address indexed trader, uint assets);
    event PositionOpened(address indexed collateral, address indexed gho, address indexed trader, uint256 size, bool isLong);
    event PositionClosed(address indexed collateral, address indexed gho, address indexed trader, uint256 size);
    event PositionSizeIncrease(uint indexed id, uint inc);
    event PositionCollateralIncreased(uint indexed id, uint inc);
    event PositionCollateralDecreased(uint indexed id, uint desc);

    using SafeERC20 for IERC20;

    struct PositionStruct {
        address trader;
        address baseCurrency;
        address quoteCurrency;
        uint size;
        uint value;
        bool isLong;
        bool isOpen;
    }

    uint constant BASE_PRICE = 1 ether;

    uint constant public MAX_UTILIZATION_PERCENTAGE = 50;

    uint public positionId = 0;

    // store deposits
    mapping(address => uint) public deposits;
    // store user deposits for a given gho
    mapping(address => mapping(address => uint)) public myDeposits;

    uint public totalLongInterest;
    uint public totalLongInterestInTokens;
    uint public totalShortInterest;
    uint public totalShortInterestInTokens;

    // mapping position ID to position
    mapping(uint => PositionStruct) public positions;


    uint8 constant public MAX_LEVERAGE = 20;
    uint constant public LOT_SIZE = 0.01 ether;

    uint public tradingLiquidity = 0;

    IERC20 gho;


    constructor(IERC20 _gho, string memory _name, string memory _symbol) ERC4626(_gho) ERC20(_name, _symbol) Ownable(msg.sender) {
        gho = _gho;
    }


    function deposit(uint256 assets) external returns (uint256) {
        address liquidityProvider = msg.sender;
        gho.safeTransferFrom(liquidityProvider, address(this), assets);
        deposits[address(gho)] += assets;
        myDeposits[liquidityProvider][address(gho)] += assets;
        emit DepositLiquidity(liquidityProvider, assets);
        return super.deposit(assets, liquidityProvider);
    }

    function withdraw(uint256 assets) external returns (uint256) {
        address liquidityProvider = msg.sender; 
        address _gho = address(gho);
        deposits[_gho]-= assets;
        myDeposits[liquidityProvider][_gho] -= assets;
        emit WithdrawLiquidity(_gho, liquidityProvider, assets);
        return super.withdraw(assets, liquidityProvider, liquidityProvider); 
    }


}

