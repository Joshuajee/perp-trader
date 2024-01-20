import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import { checksumAddress, parseEther, parseGwei } from "viem";
import { deploy,  depositLiquidity, tokenSymbols } from "../scripts/helpers";
import { calculatePrice, deployPriceAggregator, deployTokens } from "../scripts/mockHelper";



describe("PerpTrader", function () {

  const amount = parseEther("100", "wei")

  const sizeAmount = parseEther("10", "wei")

  const collateralAmount = parseEther("1", "wei")

  async function deployTest() {

    const [user1, user2] = await viem.getWalletClients();

    const gho = await viem.deployContract("MockERC20", ["aGho", "aGho"])

    const tokens  = tokenSymbols()

    const priceAggregator = await deployPriceAggregator()

    const { perpTrader } = await deploy(gho.address, priceAggregator.ghoPriceFeeds.address)

    await perpTrader.write.addPriceFeed([tokens.btc, priceAggregator.btcPriceFeeds.address])

    await perpTrader.write.addPriceFeed([tokens.eth, priceAggregator.ethPriceFeeds.address])
    
    return { perpTrader, gho, user1, user2, ...priceAggregator, ...tokens }

  }


  async function deployAndDepositTest() {

    const deploy = await deployTest()

    await depositLiquidity(deploy.gho.address, deploy.perpTrader.address, amount)

    await deploy.perpTrader.write.addPair([
      {
        baseCurrency: deploy.btc, 
        quoteCurrency: deploy.eth
      }]
    )
    
    return { ...deploy }

  }

  describe("Deposits", function () {

    it("Should deposit to the protocol and give the depositor shares", async() => {

      const { perpTrader, gho, user1 } = await loadFixture(deployTest)

      const userBalance = await gho.read.balanceOf([user1.account.address])

      await gho.write.approve([perpTrader.address, amount])

      await perpTrader.write.deposit([amount])

      expect(await gho.read.balanceOf([user1.account.address])).to.be.equal(userBalance - amount)

      expect(await gho.read.balanceOf([perpTrader.address])).to.be.equal(amount)

      expect(await perpTrader.read.totalSupply()).to.be.equal(amount)

      expect(await perpTrader.read.getLPSharesInGHO([user1.account.address])).to.be.equal(amount)

      expect(await perpTrader.read.totalAssets()).to.be.equal(amount)

    })


    it("Should be able to withdraw amount deposited to the protocol", async() => {

      const { perpTrader, gho, user1 } = await loadFixture(deployTest)

      await gho.write.approve([perpTrader.address, amount])

      await perpTrader.write.deposit([amount])

      const userBalance = await gho.read.balanceOf([user1.account.address])

      await perpTrader.write.withdraw([amount])

      expect(await gho.read.balanceOf([user1.account.address])).to.be.equal(userBalance + amount)

      expect(await gho.read.balanceOf([perpTrader.address])).to.be.equal(0n)

      expect(await perpTrader.read.totalSupply()).to.be.equal(0n)

      expect(await perpTrader.read.getLPSharesInGHO([user1.account.address])).to.be.equal(0n)

      expect(await perpTrader.read.totalAssets()).to.be.equal(0n)

    })

  });



  describe("Collateral", function () {

    it("Should add collateral to the protocol", async() => {

      const { perpTrader, gho, user1 } = await loadFixture(deployTest)

      const userBalance = await gho.read.balanceOf([user1.account.address])

      await gho.write.approve([perpTrader.address, amount])

      await perpTrader.write.addCollateral([amount])

      expect(await gho.read.balanceOf([user1.account.address])).to.be.equal(userBalance - amount)

      expect(await gho.read.balanceOf([await perpTrader.read.getCollateralBankAddress()])).to.be.equal(amount)

      expect(await perpTrader.read.collaterals()).to.be.equal(amount)

      expect(await perpTrader.read.myCollateral([user1.account.address])).to.be.equal(amount)
      

    })

    it("Should be able to withdraw Collateral deposited to the protocol", async() => {

      const { perpTrader, gho, user1 } = await loadFixture(deployTest)

      await gho.write.approve([perpTrader.address, amount])

      await perpTrader.write.addCollateral([amount])

      const userBalance = await gho.read.balanceOf([user1.account.address])

      await perpTrader.write.removeCollateral([amount])

      expect(await gho.read.balanceOf([user1.account.address])).to.be.equal(userBalance + amount)

      expect(await gho.read.balanceOf([await perpTrader.read.getCollateralBankAddress()])).to.be.equal(0n)

      expect(await perpTrader.read.collaterals()).to.be.equal(0n)

      expect(await perpTrader.read.myCollateral([user1.account.address])).to.be.equal(0n)

    })

  });



  describe("Open Position", function () {

    it("Should be able to open Position long position", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, ethPriceFeeds } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc, quoteCurrency: eth }

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      const positionOpenedTime = BigInt(await time.latest());

      const position = await perpTrader.read.positions([1n])

      const pairKey = await perpTrader.read.getPairKey([pair])

      const price = await calculatePrice(sizeAmount, btcPriceFeeds.address, ethPriceFeeds.address)

      expect(position).deep.be.equal([
        checksumAddress(user1.account.address), pair,
        sizeAmount, price, positionOpenedTime, true, true
      ])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(sizeAmount)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(sizeAmount)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(price)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(sizeAmount)

      await perpTrader.write.openPosition([pair, sizeAmount, 0n, true])
      

    })


    it("Should be able to open Position short position", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, ethPriceFeeds } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc, quoteCurrency: eth}

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, false])

      const positionOpenedTime = BigInt(await time.latest());

      const position = await perpTrader.read.positions([1n])

      const pairKey = await perpTrader.read.getPairKey([pair])

      const price = await calculatePrice(sizeAmount, btcPriceFeeds.address, ethPriceFeeds.address)

      expect(position).deep.be.equal([
        checksumAddress(user1.account.address), pair, sizeAmount,
        price, positionOpenedTime, false, true
      ])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(0n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(sizeAmount)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(sizeAmount)
      
      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(price)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(sizeAmount)

    })

  })

  describe("Calculate Profit and Loss", function () {

    it("Should calculate for long position", async() => {

      const { perpTrader, gho, btc, eth, btcPriceFeeds, btcInitailPrice, user1 } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc, quoteCurrency: eth}

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      const positionOpenedTime = BigInt(await time.latest())

      expect(await perpTrader.read.totalPnL()).to.be.equal(0n)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(0n)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(0n)

      expect(await perpTrader.read.totalAssets()).to.be.equal(amount)

      // Increase BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice/2n])

      console.log(await perpTrader.read.totalPnL())

      const interest1 = await perpTrader.read.calculateInterest([sizeAmount, positionOpenedTime])

      expect(await perpTrader.read.totalPnL()).to.be.equal(sizeAmount)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(sizeAmount - interest1)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(sizeAmount - interest1)

      expect(await perpTrader.read.totalAssets()).to.be.equal(amount)

      // decrease BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice * 2n])

      const interest2 = await perpTrader.read.calculateInterest([sizeAmount, positionOpenedTime])

      const expectedPnl = -sizeAmount / 2n

      console.log({expectedPnl, interest2})

      expect(await perpTrader.read.totalPnL()).to.be.equal(expectedPnl)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(expectedPnl - interest2)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(expectedPnl - interest2)

      expect(await perpTrader.read.totalAssets()).to.be.equal(amount)

    })

    it("Should calculate for short position", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, btcInitailPrice } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc, quoteCurrency: eth}

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, false])

      const positionOpenedTime = BigInt(await time.latest())

      expect(await perpTrader.read.totalPnL()).to.be.equal(0n)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(0n)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(0n)

      expect(await perpTrader.read.totalAssets()).to.be.equal(amount)

      // Increase BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice/2n])

      const interest1 = await perpTrader.read.calculateInterest([sizeAmount, positionOpenedTime])

      expect(await perpTrader.read.totalPnL()).to.be.equal(-sizeAmount)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(-sizeAmount - interest1)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(-sizeAmount - interest1)

      expect(await perpTrader.read.totalAssets()).to.be.equal(amount)

      // decrease BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice * 2n])

      const interest2 = await perpTrader.read.calculateInterest([sizeAmount, positionOpenedTime])

      const expectedPnl = sizeAmount / 2n

      expect(await perpTrader.read.totalPnL()).to.be.equal(expectedPnl)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(expectedPnl - interest2)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(expectedPnl - interest2)

      expect(await perpTrader.read.totalAssets()).to.be.equal(amount)
      
    })


    it("Calculate Leverage", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, btcInitailPrice } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc, quoteCurrency: eth}

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, false])

      expect(await perpTrader.read.getTraderLeverage([user1.account.address])).to.be.equal(10n)

      // Increase BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice * 2n])

      expect(await perpTrader.read.getTraderLeverage([user1.account.address])).to.be.equal(1n)

      // decrease BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice / 2n])

      expect(await perpTrader.read.getTraderLeverage([user1.account.address])).to.be.equal(1000n)

    })

  })


  describe("Close Position", function () {

    it("Should close long position with no profit or loss", async() => {

      const { perpTrader, gho, btc, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = {
        baseCurrency: btc, 
        quoteCurrency: eth 
      }

      const pairKey = await perpTrader.read.getPairKey([pair])

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      const positionOpenedTime = BigInt(await time.latest())

      await perpTrader.write.closePosition([1n])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(0n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(0n)

      const interest = await perpTrader.read.calculateInterest([sizeAmount, positionOpenedTime])

      const collateral = collateralAmount - interest;

      expect(await gho.read.balanceOf([await perpTrader.read.getCollateralBankAddress()])).to.be.equal(collateral)
      expect(await perpTrader.read.collaterals()).to.be.equal(collateral)
      expect(await perpTrader.read.myCollateral([user1.account.address])).to.be.equal(collateral)

      await expect(perpTrader.read.myPositionIds([user1.account.address, 1n])).rejectedWith("")

    })


    it("Should close long position with profit", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, btcInitailPrice } = await loadFixture(deployAndDepositTest)

      const pair = { baseCurrency: btc, quoteCurrency: eth }

      const pairKey = await perpTrader.read.getPairKey([pair])

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      const positionOpenedTime = BigInt(await time.latest())

      // Increase BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice/2n])

      await perpTrader.write.closePosition([1n])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(0n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(0n)

      const interest = await perpTrader.read.calculateInterest([sizeAmount, positionOpenedTime])

      const collateral = collateralAmount + (collateralAmount / 2n) - interest;

      expect(await gho.read.balanceOf([await perpTrader.read.getCollateralBankAddress()])).to.be.equal(collateral)
      expect(await perpTrader.read.collaterals()).to.be.equal(collateral)
      expect(await perpTrader.read.myCollateral([user1.account.address])).to.be.equal(collateral)

      await expect(perpTrader.read.myPositionIds([user1.account.address, 1n])).rejectedWith("")

    })


    it("Should close long position with loss", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, btcInitailPrice } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc, quoteCurrency: eth }

      const pairKey = await perpTrader.read.getPairKey([pair])

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      // decrease BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice * 2n])

      await perpTrader.write.closePosition([1n])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(0n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(0n)

      expect(await gho.read.balanceOf([await perpTrader.read.getCollateralBankAddress()])).to.be.equal(0n)
      expect(await perpTrader.read.collaterals()).to.be.equal(0n)
      expect(await perpTrader.read.myCollateral([user1.account.address])).to.be.equal(0n)

      await expect(perpTrader.read.myPositionIds([user1.account.address, 1n])).rejectedWith("")

    })


    it("Should close short position with no profit or loss", async() => {

      const { perpTrader, gho, btc, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = { baseCurrency: btc, quoteCurrency: eth }

      const pairKey = await perpTrader.read.getPairKey([pair])

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, false])

      const positionOpenedTime = BigInt(await time.latest())

      await perpTrader.write.closePosition([1n])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(0n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(0n)

      const interest = await perpTrader.read.calculateInterest([sizeAmount, positionOpenedTime])

      const collateral = collateralAmount - interest;

      expect(await gho.read.balanceOf([await perpTrader.read.getCollateralBankAddress()])).to.be.equal(collateral)
      expect(await perpTrader.read.collaterals()).to.be.equal(collateral)
      expect(await perpTrader.read.myCollateral([user1.account.address])).to.be.equal(collateral)

      await expect(perpTrader.read.myPositionIds([user1.account.address, 1n])).rejectedWith("")

    })


    it("Should close short position with profit", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, btcInitailPrice } = await loadFixture(deployAndDepositTest)

      const pair = {  baseCurrency: btc, quoteCurrency: eth   }

      const pairKey = await perpTrader.read.getPairKey([pair])

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, false])

      const positionOpenedTime = BigInt(await time.latest())

      // Decrease BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice * 2n])

      await perpTrader.write.closePosition([1n])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(0n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(0n)

      const interest = await perpTrader.read.calculateInterest([sizeAmount, positionOpenedTime])

      const collateral = (6n * 10n ** 18n) - interest + 1n;

      expect(await gho.read.balanceOf([await perpTrader.read.getCollateralBankAddress()])).to.be.equal(collateral)
      expect(await perpTrader.read.collaterals()).to.be.equal(collateral)
      expect(await perpTrader.read.myCollateral([user1.account.address])).to.be.equal(collateral)

      await expect(perpTrader.read.myPositionIds([user1.account.address, 1n])).rejectedWith("")

    })


    it("Should close short position with loss", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, btcInitailPrice } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc, quoteCurrency: eth }

      const pairKey = await perpTrader.read.getPairKey([pair])

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, false])

      // Increase BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice / 2n])

      await perpTrader.write.closePosition([1n])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(0n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(0n)

      expect(await gho.read.balanceOf([await perpTrader.read.getCollateralBankAddress()])).to.be.equal(0n)
      expect(await perpTrader.read.collaterals()).to.be.equal(0n)
      expect(await perpTrader.read.myCollateral([user1.account.address])).to.be.equal(0n)

      await expect(perpTrader.read.myPositionIds([user1.account.address, 1n])).rejectedWith("")

    })


    it("Should close multiple positions", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, btcInitailPrice } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc, quoteCurrency: eth }

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, false])

      await perpTrader.write.openPosition([pair, sizeAmount, 0n, false])

      await perpTrader.write.openPosition([pair, sizeAmount, 0n, false])

      await perpTrader.write.openPosition([pair, sizeAmount, 0n, false])

      // Increase BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice / 2n])

      await perpTrader.write.closePosition([1n])

      await expect(perpTrader.read.myPositionIds([user1.account.address, 3n])).to.be.rejectedWith("")

      await perpTrader.write.closePosition([2n])

      await expect(perpTrader.read.myPositionIds([user1.account.address, 2n])).to.be.rejectedWith("")

      await perpTrader.write.closePosition([3n])

      await expect(perpTrader.read.myPositionIds([user1.account.address, 1n])).to.be.rejectedWith("")

      await perpTrader.write.closePosition([4n])

      await expect(perpTrader.read.myPositionIds([user1.account.address, 0n])).to.be.rejectedWith("")

    })



  })


  describe("Increase and Decrease Position", function () {

    it("Should Increase position", async() => {

      const { perpTrader, gho, btc, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = { baseCurrency: btc, quoteCurrency: eth }

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      const initialPosition = await perpTrader.read.positions([1n])

      const initialCollateral = await perpTrader.read.myCollateral([user1.account.address])

      await perpTrader.write.increasePositionSize([1n, sizeAmount])

      const currentPosition = await perpTrader.read.positions([1n])

      const currentCollateral = await perpTrader.read.myCollateral([user1.account.address])

      const interest = await perpTrader.read.calculateInterest([initialPosition[2], initialPosition[4]])

      expect(currentPosition[2]).to.be.equal(initialPosition[2] * 2n)

      expect(currentPosition[3]).to.be.equal(initialPosition[3] * 2n)

      expect(initialCollateral).to.be.equal(currentCollateral + interest)

    })


    it("Should Decrease position", async() => {

      const { perpTrader, gho, btc, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = { baseCurrency: btc, quoteCurrency: eth }

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      const initialPosition = await perpTrader.read.positions([1n])

      const initialCollateral = await perpTrader.read.myCollateral([user1.account.address])

      const decSize = sizeAmount / 2n

      await perpTrader.write.decreasePositionSize([1n, decSize])

      const currentPosition = await perpTrader.read.positions([1n])

      const currentCollateral = await perpTrader.read.myCollateral([user1.account.address])

      const interest = await perpTrader.read.calculateInterest([initialPosition[2], initialPosition[4]])

      expect(currentPosition[2]).to.be.equal(initialPosition[2] / 2n)

      expect(currentPosition[3]).to.be.equal(initialPosition[3] / 2n)

      expect(initialCollateral).to.be.equal(currentCollateral + interest)

    })

    it("Should Decrease position with profit", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, btcInitailPrice } = await loadFixture(deployAndDepositTest)

      const pair = { baseCurrency: btc, quoteCurrency: eth }

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      const initialPosition = await perpTrader.read.positions([1n])

      const initialCollateral = await perpTrader.read.myCollateral([user1.account.address])

      await btcPriceFeeds.write.updateAnswer([btcInitailPrice / 2n])

      const initialPnl = await perpTrader.read.positionPnl([1n])

      const decSize = sizeAmount / 2n

      const interest = await perpTrader.read.calculateInterest([initialPosition[2], initialPosition[4]])

      await perpTrader.write.decreasePositionSize([1n, decSize])

      const currentPosition = await perpTrader.read.positions([1n])

      const currentCollateral = await perpTrader.read.myCollateral([user1.account.address])

      expect(currentPosition[2]).to.be.equal(initialPosition[2] / 2n)

      console.log(initialPosition)

      console.log(currentPosition)

      console.log({initialCollateral, currentCollateral, interest, initialPnl})

      //expect(currentPosition[3]).to.be.equal(initialPosition[3] + (initialPosition[3] / 2n))

      expect(currentCollateral).to.be.equal(initialCollateral - interest + ((initialPnl + interest) / 2n))

    })

  })



  describe("Liquidate Trader", function () {

    it("Should not be able to Liquidate Trader that is not over Leveraged", async() => {

      const { perpTrader, gho, btc, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = { baseCurrency: btc, quoteCurrency: eth }

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      await expect(perpTrader.write.liquidateTrader([user1.account.address])).to.be.rejectedWith("CannotLiquidateTrader")
     
    })

    it("Should be able to Liquidate Trader that is not over Leveraged", async() => {

      const { perpTrader, gho, btc, btcPriceFeeds, btcInitailPrice, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = { baseCurrency: btc, quoteCurrency: eth }

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      // decrease BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice * 2n])

      await perpTrader.write.liquidateTrader([user1.account.address])
     
    })

  })



  describe("Get Traders Positions", function () {

    it("Should be able get open Trades and positions", async() => {

      const { perpTrader, gho, btc, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc, quoteCurrency: eth }

      await gho.write.approve([perpTrader.address, collateralAmount])

      await perpTrader.write.openPosition([pair, sizeAmount, collateralAmount, true])

      await perpTrader.write.openPosition([pair, sizeAmount, 0n, true])

      console.log(await perpTrader.read.getTradersInfo())

      console.log(await perpTrader.read.getVaultInfo())

      console.log(await perpTrader.read.getTraderPositions([user1.account.address]))

    })

  })


  describe("Admin Functions", function () {

    it("Should be able add Pair", async() => {

      const { perpTrader, btc, eth } = await loadFixture(deployTest)

      const pair = {baseCurrency: btc, quoteCurrency: eth}

      const pairKey = await perpTrader.read.getPairKey([pair])

      await perpTrader.write.addPair([pair])

      expect(await perpTrader.read.supportedPairArray([0n])).deep.be.equal([
        btc, eth
      ])

      expect(await perpTrader.read.supportedPair([pairKey])).to.be.true

    })

    // it("Should not be able to add pair, if call is not admin", async() => {

    //   const { perpTrader, btc, eth } = await loadFixture(deployTest)

    //   const pair = {baseCurrency: btc, quoteCurrency: eth}

    //   const pairKey = await perpTrader.read.getPairKey([pair])

    //   await perpTrader.simulate().addPair([pair])

    // })

  })
  

  describe("Events", function () {
    it("Should emit an event on deposit", async function () {
      const { perpTrader, gho, user1 } = await loadFixture(deployTest);

      await gho.write.approve([perpTrader.address, amount])

      await perpTrader.write.deposit([amount])

      const withdrawalEvents = await perpTrader.getEvents.DepositLiquidity()

      expect(withdrawalEvents).to.have.lengthOf(1);
      expect(withdrawalEvents[0].args.liquidityProvider).to.be.equals(checksumAddress(user1.account.address));
      expect(withdrawalEvents[0].args.assets).to.be.equal(amount);

    });

  });


});
