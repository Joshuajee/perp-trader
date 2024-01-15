// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./CollateralBank.sol";
import "hardhat/console.sol";

contract PerpTrades is ERC4626, Ownable {

    struct PairStruct {
        address baseCurrency;
        address quoteCurrency;
    }

    struct PositionStruct {
        address trader;
        PairStruct pair;
        uint size;
        uint value;
        bool isLong;
        bool isOpen;
    }

    error PairAlreadyExist();
    error PairNotSupported(PairStruct pair);
    error MaximumNumberOfPairReached();

    event DepositLiquidity(address indexed liquidityProvider, uint assets);
    event DepositCollateral(address indexed liquidityProvider, uint assets);
    event WithdrawLiquidity(address indexed trader, uint assets);
    event PositionOpened(uint indexed positionId, PairStruct indexed pair, address indexed trader, uint256 size, bool isLong);
    event PositionClosed(uint indexed positionId, PairStruct indexed pair, address indexed trader, uint256 size);
    event PositionSizeIncrease(uint indexed id, uint inc);
    event PositionCollateralIncreased(uint indexed id, uint inc);
    event PositionCollateralDecreased(uint indexed id, uint desc);

    using SafeERC20 for IERC20;

    uint constant DECIMAL = 10**38;

    uint constant public MAX_UTILIZATION_PERCENTAGE = 50;

    uint public positionId = 0;

    // store deposits

    uint public deposits;
    uint public collaterals;
    
    uint public totalOpenLongInterest;
    uint public totalLongInterestInTokens;
    uint public totalOpenShortInterest;
    uint public totalShortInterestInTokens;

    IERC20 public immutable gho;
    CollateralBank public immutable collateralBank;
    AggregatorV3Interface public immutable ghoPriceFeeds;


    // store user deposits for a given liquidityProvider
    mapping(address => uint) public myDeposits;

    // store user deposits for a given trader
    mapping(address => uint) public myCollateral;

    // store positionSize for a given trader
    mapping(address => uint) public myPositionSize;


    mapping(bytes32 => uint) public openLongInterestInGho;
    mapping(bytes32 => uint) public openShortInterestInGho;

    mapping(bytes32 => uint) public openLongInterestIntokens;
    mapping(bytes32 => uint) public openShortInterestIntokens;

    // mapping position ID to position
    mapping(uint => PositionStruct) public positions;

    // mapping tokens to price feeds
    mapping(address => AggregatorV3Interface) public priceFeeds;
    
    //store user open positons in an array
    mapping(address => uint[]) public myPositionIds;

    PairStruct [] public supportedPairArray;
    mapping(bytes32 => bool) public supportedPair;



    // Admin Variables
    uint8 public maximumNumberOfPairs = 100;
    uint8 public interestRate = 5;
    uint8 public liquidationFeePercent = 5;
    uint16 public maxLeverage = 500;



    constructor(IERC20 _gho, address _ghoPriceFeeds, string memory _name, string memory _symbol) ERC4626(_gho) ERC20(_name, _symbol) Ownable(msg.sender) {
        collateralBank = new CollateralBank(_gho);
        gho = _gho;
        ghoPriceFeeds = AggregatorV3Interface(_ghoPriceFeeds);
    }


    function deposit(uint256 assets) external returns (uint256) {
        address liquidityProvider = msg.sender;
        deposits += assets;
        myDeposits[liquidityProvider] += assets;
        emit DepositLiquidity(liquidityProvider, assets);
        return super.deposit(assets, liquidityProvider);
    }

    function withdraw(uint256 assets) external returns (uint256) {
        address liquidityProvider = msg.sender; 
        deposits -= assets;
        myDeposits[liquidityProvider] -= assets;
        emit WithdrawLiquidity(liquidityProvider, assets);
        return super.withdraw(assets, liquidityProvider, liquidityProvider); 
    }

    function addCollateral(uint256 assets) public {
        address trader = msg.sender; 
        gho.safeTransferFrom(trader, address(collateralBank), assets);
        collaterals += assets;
        myCollateral[trader] += assets;
        emit DepositCollateral(trader, assets);
    }

    function removeCollateral(uint256 assets) public {
        address trader = msg.sender; 
        collaterals -= assets;
        myCollateral[trader] -= assets;
        collateralBank.withdraw(trader, assets);
        emit DepositCollateral(trader, assets);
    }



    function openPosition(PairStruct memory pair, uint _size, uint _collateral, bool _isLong) external onlySupportedPair(pair) {
        uint amount = getPairPrice(pair) * _size;
        
        positions[++positionId] = PositionStruct({
            trader: msg.sender,
            pair: pair,
            size: _size,
            value: amount,
            isLong: _isLong,
            isOpen: true
        });
        _updatePositions(pair, _size, amount, _isLong);
        myPositionIds[msg.sender].push(positionId); 
        if (_collateral > 0) addCollateral(_collateral);
        emit PositionOpened(positionId, pair, msg.sender, _size, true);
    }


    function closePosition(uint _positionId) public {
        
        PositionStruct memory position = positions[_positionId];
        int pnl = positionPnl(_positionId);

        if (pnl > 0) {
            uint profit = uint(pnl);
            gho.safeTransfer(address(collateralBank), profit);
            myCollateral[position.trader] += profit; 
            collaterals += profit;
        } else {
            uint loss = uint(pnl);
            if (loss > myCollateral[position.trader]) {
                collateralBank.withdraw(address(this), myCollateral[position.trader]);
                collaterals -= myCollateral[position.trader];
                myCollateral[position.trader] = 0;
            } else {
                collateralBank.withdraw(address(this), loss);
                myCollateral[position.trader] -= loss;
                collaterals -= loss;
            }
        }

        _reducePositions(position.pair, position.size, position.value, position.isLong);

        uint [] memory positionIds = myPositionIds[position.trader];

        for (uint i = 0; i < positionIds.length; ++i) {
            if (positionIds[i] == positionId) {
                myPositionIds[position.trader][i] = positionIds[positionIds.length - 1];
                myPositionIds[position.trader].pop();
                break;
            }
        }



        emit PositionClosed(positionId, position.pair, position.trader, position.size);
        
    }


    /************************************************************************
     *                          Public View Functions                       *
     ************************************************************************/

    function getPairKey(PairStruct memory pair) public pure returns(bytes32) {
        return keccak256(abi.encode(pair));
    }

    function getCollateralBankAddress() public view returns (address) {
        return address(collateralBank);
    }

    function getPairPrice(PairStruct memory pair) public view returns (uint) {
        (, int256 basePrice,,,) = priceFeeds[pair.baseCurrency].latestRoundData();
        (, int256 quotePrice,,,) = priceFeeds[pair.quoteCurrency].latestRoundData();
        return uint(basePrice * int(DECIMAL) / quotePrice);
    }

    function convertPriceToGho(address _token) public view returns (uint) {
        (, int256 ghoPrice,,,) = ghoPriceFeeds.latestRoundData();
        (, int256 assetPrice,,,) = priceFeeds[_token].latestRoundData();
        return uint(assetPrice * int(DECIMAL) / ghoPrice);
    }

    function totalPnL() public view returns(int pnl) {
        for (uint i = 0; i < supportedPairArray.length; i++) {

            PairStruct memory pair = supportedPairArray[i];

            bytes32 pairKey = getPairKey(pair);
            
            uint currentPrice = getPairPrice(pair);

            int longPnl = int(int(openLongInterestIntokens[pairKey] / currentPrice) - int(openLongInterestInGho[pairKey]));

            int shortPnl = int(int(openShortInterestInGho[pairKey]) - int(openShortInterestIntokens[pairKey] / currentPrice));

            pnl += (longPnl + shortPnl);

        }
    }

    function traderPnL(address trader) public view returns(int pnl) {
        uint[] memory _myPositionIds = myPositionIds[trader]; 
        for (uint i = 0; i < _myPositionIds.length; i++) {

            PositionStruct memory position = positions[_myPositionIds[i]];

            uint currentPrice = getPairPrice(position.pair);

            if (position.isLong) {
                pnl += int(position.value / currentPrice) - int(position.size);
            } else {
                pnl += int(position.size) - int(position.value / currentPrice);
            }

        }

    }


    function positionPnl(uint _positionId) public view returns(int pnl) {

        PositionStruct memory position = positions[_positionId];

        uint currentPrice = getPairPrice(position.pair);

        if (position.isLong) {
            pnl += int(position.value / currentPrice) - int(position.size);
        } else {
            pnl += int(position.size) - int(position.value / currentPrice);
        }

    }


    function getTraderLeverage(address trader) public view returns(uint leverage) {
        int traderPositionValue = int(myCollateral[trader]) + traderPnL(trader);
        console.logInt(traderPositionValue);
        // set leverage to 2x max leverage when user collateral is less than the loses
        if (traderPositionValue < 1) return maxLeverage * 2;
        leverage = myPositionSize[trader]  / uint(traderPositionValue);
    }


    /************************************************************************
     *                          Internal Functions                          *
     ************************************************************************/    

    function _updatePositions(PairStruct memory _pair, uint _size, uint _amount, bool _isLong) internal {
        bytes32 pairKey = getPairKey(_pair);
        if (_isLong) {
            totalOpenLongInterest += _size;    
            openLongInterestInGho[pairKey] += _size;    
            openLongInterestIntokens[pairKey] += _amount;    
        }   else {
            totalOpenShortInterest += _size;
            openShortInterestInGho[pairKey] += _size;
            openShortInterestIntokens[pairKey] += _amount;  
        }
        myPositionSize[msg.sender] += _size;
    }

    function _reducePositions(PairStruct memory _pair, uint _size, uint _amount, bool _isLong) internal {
        bytes32 pairKey = getPairKey(_pair);
        if (_isLong) {
            totalOpenLongInterest -= _size;    
            openLongInterestInGho[pairKey] -= _size;    
            openLongInterestIntokens[pairKey] -= _amount;    
        }   else {
            totalOpenShortInterest -= _size;
            openShortInterestInGho[pairKey] -= _size;
            openShortInterestIntokens[pairKey] -= _amount;  
        }
        myPositionSize[msg.sender] -= _size;
    }


    /************************************************************************
     *                          Admin Only Functions                        *
     ************************************************************************/

    function addPriceFeed(address _token, address _priceFeeds) external onlyOwner {
        priceFeeds[_token] = AggregatorV3Interface(_priceFeeds);
    }

    function addPair(PairStruct memory pair) external onlyOwner {
        bytes32 pairKey = getPairKey(pair);
        if (supportedPair[pairKey]) revert PairAlreadyExist();
        if (supportedPairArray.length > maximumNumberOfPairs - 1) revert MaximumNumberOfPairReached();
        supportedPair[pairKey] = true;
        supportedPairArray.push(pair);
    }

    /************************************************************************
     *                               Modifiers                              *
     ************************************************************************/

    modifier onlySupportedPair(PairStruct memory pair) {
        bytes32 pairKey = getPairKey(pair);
        if (!supportedPair[pairKey]) revert PairNotSupported(pair);
        _;
    }


}

