// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./CollateralBank.sol";
import "hardhat/console.sol";

contract PerpTrades is ERC4626, Ownable {

    struct TraderProfile {
        address trader;
        uint collateral;
        int pnl;
        uint16 usedLeverage;
        uint16 maxLeverage;
        uint liquidationFee;
    }

    struct PairStruct {
        string baseCurrency;
        string quoteCurrency;
    }

    struct PositionStruct {
        address trader;
        PairStruct pair;
        uint size;
        uint value;
        uint openedAt;
        bool isLong;
        bool isOpen;
    }

    struct PositionInfoStruct {
        PositionStruct position;
        int pnl;
    }

    error PairAlreadyExist();
    error PairNotSupported(PairStruct pair);
    error MaximumNumberOfPairReached();
    error TraderOverLeveraged(address trader, uint maxLeverage, uint leverage);
    error CannotWithdrawAboveAvailableLiquidity(uint amount, uint availableLiquidity);
    error CannotLiquidateTrader(uint traderLeverage, uint maxLeverage);
    error LiquidityNotEnoughToSupportPosition();

    event DepositLiquidity(address indexed liquidityProvider, uint assets);
    event DepositCollateral(address indexed liquidityProvider, uint assets);
    event WithdrawLiquidity(address indexed trader, uint assets);
    event PositionOpened(uint indexed positionId, PairStruct indexed pair, address indexed trader, uint256 size, bool isLong);
    event PositionClosed(uint indexed positionId, PairStruct indexed pair, address indexed trader, uint256 size);
    event PositionSizeIncrease(uint indexed id, uint inc);
    event PositionCollateralIncreased(uint indexed id, uint inc);
    event PositionCollateralDecreased(uint indexed id, uint desc);
    event LiquidateTrader(address indexed liquidator, address indexed trader, uint liquidationFee);
    event LiquidatePosition(address indexed liquidator, address indexed trader, uint indexed positionId);

    using SafeERC20 for IERC20;

    uint constant DECIMAL = 10**38;
    uint constant public MAX_UTILIZATION_PERCENTAGE = 50;

    uint public positionId = 0;

    // store collaterals
    uint public collaterals;
    
    uint public totalOpenLongInterest;
    uint public totalLongInterestInTokens;
    uint public totalOpenShortInterest;
    uint public totalShortInterestInTokens;

    IERC20 public immutable gho;
    CollateralBank public  collateralBank;
    AggregatorV3Interface public immutable ghoPriceFeeds;

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
    mapping(string => AggregatorV3Interface) public priceFeeds;
    
    //store user open positons in an array
    mapping(address => uint[]) public myPositionIds;

    PairStruct [] public supportedPairArray;
    mapping(bytes32 => bool) public supportedPair;

    // Admin Variables
    uint8 public maximumNumberOfPairs = 100;
    // interest rate per year
    uint8 public interestRate = 5;
    uint8 public liquidationFeePercent = 5;
    uint16 public maxLeverage = 500;


    mapping(address => bool) hasTraded;
    address [] traders;

    constructor(IERC20 _gho, address _ghoPriceFeeds, string memory _name, string memory _symbol) ERC4626(_gho) ERC20(_name, _symbol) {
        collateralBank = new CollateralBank(_gho);
        gho = _gho;
        ghoPriceFeeds = AggregatorV3Interface(_ghoPriceFeeds);
    }


    function deposit(uint256 assets) external {
        address liquidityProvider = msg.sender;

        super.deposit(assets, liquidityProvider);

        emit DepositLiquidity(liquidityProvider, assets);
    }

    function withdraw(uint256 assets) external {
        address liquidityProvider = msg.sender; 
        super.withdraw(assets, liquidityProvider, liquidityProvider); 
        emit WithdrawLiquidity(liquidityProvider, assets);
    }



    function liquidateTrader(address trader) external {
        address liquidator = msg.sender;
        uint liquidationFee = calculateLiquidationFee(trader);
        uint leverage = getTraderLeverage(trader);
        if (leverage < maxLeverage) revert CannotLiquidateTrader(leverage, maxLeverage);
        uint [] memory _positionIds = myPositionIds[trader];
        for (uint i = 0; i < _positionIds.length; i++) {
            uint _positionId = _positionIds[i];
            closePosition(_positionId);
            uint _leverage = getTraderLeverage(trader);
            emit LiquidatePosition(liquidator, trader, positionId);
            if (_leverage < maxLeverage) break; 
        }

        gho.transfer(liquidator, liquidationFee);

        emit LiquidateTrader(liquidator, trader, liquidationFee);
    }


    /************************************************************************
     *                         Trader Write Functions                       *
     ************************************************************************/

    function addCollateral(uint256 assets) public {
        address trader = msg.sender; 
        gho.safeTransferFrom(trader, address(collateralBank), assets);
        collaterals += assets;
        myCollateral[trader] += assets;
        if (!hasTraded[trader]) {
            hasTraded[trader] = true;
            traders.push(trader);
        }
        emit DepositCollateral(trader, assets);
    }

    function removeCollateral(uint256 assets) public {
        address trader = msg.sender; 
        collaterals -= assets;
        myCollateral[trader] -= assets;
        collateralBank.withdraw(trader, assets);
        uint traderPositons = myPositionIds[trader].length;
        if (traderPositons > 0) {
            uint leverage = getTraderLeverage(msg.sender);
            if (leverage  > maxLeverage) revert TraderOverLeveraged(msg.sender, leverage, maxLeverage);
        }
        emit DepositCollateral(trader, assets);
    }

    function openPosition(PairStruct memory pair, uint _size, uint _collateral, bool _isLong) external onlySupportedPair(pair) {
        uint amount = getPairPrice(pair) * _size;
        positions[++positionId] = PositionStruct({
            trader: msg.sender,
            pair: pair,
            size: _size,
            value: amount,
            openedAt: block.timestamp,
            isLong: _isLong,
            isOpen: true
        });
        myPositionIds[msg.sender].push(positionId); 
        if (_collateral > 0) addCollateral(_collateral);
        _updatePositions(pair, _size, amount, _isLong);
        emit PositionOpened(positionId, pair, msg.sender, _size, true);
    }


    function closePosition(uint _positionId) public  {
        
        PositionStruct memory position = positions[_positionId];
        positions[_positionId].isOpen = false;

        int pnl = positionPnl(_positionId);

        if (pnl > 0) {
            uint profit = uint(pnl);
            gho.safeTransfer(address(collateralBank), profit);
            myCollateral[position.trader] += profit; 
            collaterals += profit;
        } else if (pnl < 0) {
            uint loss = uint(-1 * pnl);
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


    function increasePositionSize(uint id,  uint inc) external {
        PositionStruct storage position = positions[id];
        position.size += inc;
        position.value = getPairPrice(position.pair) * position.size;
        _updatePositions(position.pair, position.size, position.value, position.isLong);
        emit PositionSizeIncrease(id, inc);
    }


    /************************************************************************
     *                          Public View Functions                       *
     ************************************************************************/

    function getSupportedPairs () external view returns (PairStruct [] memory) {
        return supportedPairArray;
    }

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

            uint interest = calculateInterest(position.size, position.openedAt);

            uint currentPrice = getPairPrice(position.pair);

            if (position.isLong) {
                pnl += int(position.value / currentPrice) - int(position.size);
            } else {
                pnl += int(position.size) - int(position.value / currentPrice);
            }

            pnl -= int(interest);

        }

    }


    function positionPnl(uint _positionId) public view returns(int pnl) {

        PositionStruct memory position = positions[_positionId];

        uint interest = calculateInterest(position.size, position.openedAt);

        uint currentPrice = getPairPrice(position.pair);

        if (position.isLong) {
            pnl += int(position.value / currentPrice) - int(position.size);
        } else {
            pnl += int(position.size) - int(position.value / currentPrice);
        }

        pnl -= int(interest);

    }

    function getTraderLeverage(address trader) public view returns(uint leverage) {
        int traderPositionValue = int(myCollateral[trader]) + traderPnL(trader);
        // set leverage to 2x max leverage when user collateral is less than the loses
        if (traderPositionValue < 1) return maxLeverage * 2;
        leverage = myPositionSize[trader]  / uint(traderPositionValue);
    }

    function calculateInterest(uint _size, uint _openedAt) public view returns (uint) {
        return _size * (block.timestamp - _openedAt) * interestRate / (365 days);
    }

    function calculateLiquidationFee(address trader) public view returns (uint) {
        int pnl = traderPnL(trader);
        if (pnl > 0) return 0;
        uint loss = uint(-1 * pnl);
        uint collateral = myCollateral[trader];
        if (collateral < loss) {
            return collateral * liquidationFeePercent / 100;
        }
        return (collateral - loss)* liquidationFeePercent / 100;
    }

    function availableLiquidity() view public returns (uint) {
        uint currentValueOfAssets = totalAssets();
        uint totalDepositedAssets = gho.balanceOf(address(this));
        uint totalOpenInterest = totalOpenLongInterest + totalOpenShortInterest;
        if (currentValueOfAssets > totalDepositedAssets) {
            return totalDepositedAssets - totalOpenInterest;
        } 
        if (currentValueOfAssets < totalOpenInterest) return 0;
        return currentValueOfAssets - totalOpenInterest;
    }

    function maximumRemovableCollateral(address trader) view public {
        //uint leverage = getTraderLeverage(trader);
        //uint collateral
    }


    function getVaultInfo() external view returns (uint, uint, uint8) {
        return (totalAssets(), availableLiquidity(), interestRate);
    }

    function getLPSharesInGHO(address liquidityProvider) external view returns (uint) {
        uint lpBalance = IERC20(address(this)).balanceOf(liquidityProvider);
        if (totalSupply() == 0) return 0;
        return lpBalance * totalAssets() / totalSupply();
    }

    function maxUtilizationPercentage() public view returns(bool, uint) {
        uint totalOpenInterest = totalOpenLongInterest + totalOpenShortInterest;
        uint maxAllowed = IERC20(address(gho)).balanceOf(address(this)) * MAX_UTILIZATION_PERCENTAGE;
        return (totalOpenInterest < maxAllowed, maxAllowed);
    }


    function getTraderPositions(address trader) external view returns (PositionInfoStruct[] memory) {
        
        uint [] memory _positionIds = myPositionIds[trader];
        uint length = _positionIds.length;
        PositionInfoStruct [] memory _positions = new PositionInfoStruct[](length);

        for (uint i = 0; i < length; i++) {
            uint _positionId = _positionIds[i];
            _positions[i] = PositionInfoStruct({
                position: positions[_positionId],
                pnl: positionPnl(_positionId)
            });
        }

        return _positions;
    }


    // unsafe loop
    function getTradersInfo() external view returns (TraderProfile [] memory) {
        uint length = traders.length;
        TraderProfile [] memory traderProfiles = new TraderProfile[](length);

        for (uint i = 0; i < traders.length; i++) {
            address trader = traders[i];
            uint16 leverage = uint16(getTraderLeverage(trader));
            uint16 _maxLeverage = maxLeverage;
            traderProfiles[i] = TraderProfile({
                trader: trader,
                collateral: myCollateral[trader],
                pnl: traderPnL(trader),
                usedLeverage: leverage,
                maxLeverage: _maxLeverage,
                liquidationFee: leverage > _maxLeverage ? calculateLiquidationFee(trader) : 0
            });
        }

        return traderProfiles;
    }




    /************************************************************************
     *                          Internal Functions                          *
     ************************************************************************/    

    function _updatePositions(PairStruct memory _pair, uint _size, uint _amount, bool _isLong) internal isBelowLeverage {
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
        (bool canOpen, ) = maxUtilizationPercentage();
        if (!canOpen) revert LiquidityNotEnoughToSupportPosition();
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

    function addPriceFeed(string memory _token, address _priceFeeds) external onlyOwner {
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

    modifier isBelowLeverage() {
        _;
        uint leverage = getTraderLeverage(msg.sender);
        if (leverage > maxLeverage) revert TraderOverLeveraged(msg.sender, leverage, maxLeverage);
    }



    /************************************************************************
     *                            ERC4646 Overrides                         *
     ************************************************************************/

    // function totalAssets() public view override returns (uint) {
    //     int pnl = totalPnL();
    //     uint _totalAssets = super.totalAssets();

    //     if (pnl > 0) {
    //         if (_totalAssets < uint(pnl)) return 1;
    //         return _totalAssets - uint(pnl);
    //     }

    //     return _totalAssets + uint(-1 * pnl);
  
    // }


    // function _withdraw(
    //     address caller,
    //     address receiver,
    //     address owner,
    //     uint256 assets,
    //     uint256 shares
    // ) internal override {

    //     if (caller != owner) {
    //         _spendAllowance(owner, caller, shares);
    //     }

    //     uint _availableLiquidity = availableLiquidity();
    //     if (assets < _availableLiquidity) revert CannotWithdrawAboveAvailableLiquidity(assets, _availableLiquidity);

    //     // If _asset is ERC-777, `transfer` can trigger a reentrancy AFTER the transfer happens through the
    //     // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
    //     // calls the vault, which is assumed not malicious.
    //     //
    //     // Conclusion: we need to do the transfer after the burn so that any reentrancy would happen after the
    //     // shares are burned and after the assets are transferred, which is a valid state.
    //     _burn(owner, shares);

    //     SafeERC20.safeTransfer(IERC20(asset()), receiver, assets);

    //     emit Withdraw(caller, receiver, owner, assets, shares);
    // }



}

