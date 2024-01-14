import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import { checksumAddress, parseGwei } from "viem";
import { deploy,  depositLiquidity } from "../scripts/helpers";
import { deployPriceAggregator, deployTokens } from "../scripts/mockHelper";

describe("PerpTrader", function () {

  const amount = parseGwei("100", "wei")

  async function deployTest() {

    const [user1, user2] = await viem.getWalletClients();

    const tokens  = await deployTokens()

    const priceAggregator = await deployPriceAggregator()

    const { perpTrader } = await deploy(tokens.gho.address, priceAggregator.ghoPriceFeeds.address)

    await perpTrader.write.addPriceFeed([tokens.btc.address, priceAggregator.btcPriceFeeds.address])

    await perpTrader.write.addPriceFeed([tokens.eth.address, priceAggregator.ethPriceFeeds.address])
    
    return { perpTrader, user1, user2, ...priceAggregator, ...tokens }

  }


  async function deployAndDepositTest() {

    const deploy = await deployTest()

    await depositLiquidity(deploy.gho.address, deploy.perpTrader.address, amount)

    await deploy.perpTrader.write.addPair([
      {
        baseCurrency: deploy.btc.address, 
        quoteCurrency: deploy.eth.address
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

      expect(await perpTrader.read.deposits()).to.be.equal(amount)

      expect(await perpTrader.read.myDeposits([user1.account.address])).to.be.equal(amount)

    })



    it("Should be able to withdraw amount deposited to the protocol", async() => {

      const { perpTrader, gho, user1 } = await loadFixture(deployTest)

      await gho.write.approve([perpTrader.address, amount])

      await perpTrader.write.deposit([amount])

      const userBalance = await gho.read.balanceOf([user1.account.address])

      await perpTrader.write.withdraw([amount])

      expect(await gho.read.balanceOf([user1.account.address])).to.be.equal(userBalance + amount)

      expect(await gho.read.balanceOf([perpTrader.address])).to.be.equal(0n)

      expect(await perpTrader.read.deposits()).to.be.equal(0n)

      expect(await perpTrader.read.myDeposits([user1.account.address])).to.be.equal(0n)

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

      const { perpTrader, gho, btc, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: checksumAddress(btc.address), quoteCurrency: checksumAddress(eth.address) }

      await gho.write.approve([perpTrader.address, 10n])

      await perpTrader.write.openPosition([pair, 100n, 10n, true])

      const position = await perpTrader.read.positions([1n])

      const pairKey = await perpTrader.read.getPairKey([pair])

      const price = 4400n

      expect(position).deep.be.equal([
        checksumAddress(user1.account.address),
        pair,
        100n,
        price,
        true,
        true
      ])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(100n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(0n)


      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(100n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(price)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(100n)

    })


    it("Should be able to open Position short position", async() => {

      const { perpTrader, gho, btc, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: checksumAddress(btc.address), quoteCurrency: checksumAddress(eth.address)}

      await gho.write.approve([perpTrader.address, 10n])

      await perpTrader.write.openPosition([pair, 100n, 10n, false])

      const position = await perpTrader.read.positions([1n])

      const pairKey = await perpTrader.read.getPairKey([pair])

      const price = 4400n

      expect(position).deep.be.equal([
        checksumAddress(user1.account.address), pair, 100n,
        price,false,true
      ])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(0n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(100n)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(100n)
      
      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(price)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(100n)

    })

  })

  describe("Calculate Profit and Loss", function () {

    it("Should calculate for long position", async() => {

      const { perpTrader, gho, btc, eth, btcPriceFeeds, btcInitailPrice, user1 } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc.address, quoteCurrency: eth.address}

      await gho.write.approve([perpTrader.address, 10n])

      await perpTrader.write.openPosition([pair, 100n, 10n, true])

      expect(await perpTrader.read.totalPnL()).to.be.equal(0n)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(0n)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(0n)

      // Increase BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice/2n])

      expect(await perpTrader.read.totalPnL()).to.be.equal(100n)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(100n)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(100n)

      // decrease BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice * 2n])

      expect(await perpTrader.read.totalPnL()).to.be.equal(-50n)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(-50n)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(-50n)

    })

    it("Should calculate for short position", async() => {

      const { perpTrader, gho, btc, eth, user1, btcPriceFeeds, btcInitailPrice } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: btc.address, quoteCurrency: eth.address}

      await gho.write.approve([perpTrader.address, 10n])

      await perpTrader.write.openPosition([pair, 100n, 10n, false])

      expect(await perpTrader.read.totalPnL()).to.be.equal(0n)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(0n)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(0n)

      // Increase BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice/2n])

      expect(await perpTrader.read.totalPnL()).to.be.equal(-100n)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(-100n)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(-100n)

      // decrease BTC Price relative to dollar by 50%
      await btcPriceFeeds.write.updateAnswer([btcInitailPrice * 2n])

      expect(await perpTrader.read.totalPnL()).to.be.equal(50n)
      expect(await perpTrader.read.traderPnL([user1.account.address])).to.be.equal(50n)
      expect(await perpTrader.read.positionPnl([1n])).to.be.equal(50n)
      
    })

  })

  describe("Close Position", function () {

    it("Should close position with no profit or loss", async() => {

      const { perpTrader, gho, btc, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: checksumAddress(btc.address), quoteCurrency: checksumAddress(eth.address) }

      const pairKey = await perpTrader.read.getPairKey([pair])

      await gho.write.approve([perpTrader.address, 10n])

      await perpTrader.write.openPosition([pair, 100n, 10n, true])

      await perpTrader.write.closePosition([1n])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(0n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(0n)

    })


    it("Should close position with profit", async() => {

      const { perpTrader, gho, btc, eth, user1 } = await loadFixture(deployAndDepositTest)

      const pair = {baseCurrency: checksumAddress(btc.address), quoteCurrency: checksumAddress(eth.address) }

      const pairKey = await perpTrader.read.getPairKey([pair])

      await gho.write.approve([perpTrader.address, 10n])

      await perpTrader.write.openPosition([pair, 100n, 10n, true])

      await perpTrader.write.closePosition([1n])

      expect(await perpTrader.read.totalOpenLongInterest()).to.be.equal(0n)
      expect(await perpTrader.read.totalOpenShortInterest()).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestInGho([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestInGho([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.openLongInterestIntokens([pairKey])).to.be.equal(0n)
      expect(await perpTrader.read.openShortInterestIntokens([pairKey])).to.be.equal(0n)

      expect(await perpTrader.read.myPositionSize([user1.account.address])).to.be.equal(0n)

    })

  })


  describe("Admin Functions", function () {

    it("Should be able add Pair", async() => {

      const { perpTrader, btc, eth } = await loadFixture(deployTest)

      const pair = {baseCurrency: btc.address, quoteCurrency: eth.address}

      const pairKey = await perpTrader.read.getPairKey([pair])

      await perpTrader.write.addPair([pair])

      expect(await perpTrader.read.supportedPairArray([0n])).deep.be.equal([
        checksumAddress(btc.address), checksumAddress(eth.address)
      ])

      expect(await perpTrader.read.supportedPair([pairKey])).to.be.true

    })

    // it("Should not be able to add pair, if call is not admin", async() => {

    //   const { perpTrader, btc, eth } = await loadFixture(deployTest)

    //   const pair = {baseCurrency: btc.address, quoteCurrency: eth.address}

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
