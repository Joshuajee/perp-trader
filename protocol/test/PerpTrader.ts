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

    const { ghoPriceFeeds } = await deployPriceAggregator()

    const { perpTrader } = await deploy(tokens.gho.address, ghoPriceFeeds.address)
    
    return { perpTrader, user1, user2, ghoPriceFeeds, ...tokens }

  }


  async function deployAndDepositTest() {

    const deploy = await deployTest()

    await depositLiquidity(deploy.gho.address, deploy.perpTrader.address, amount)
    
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



  describe("Open Postion", function () {

    it("Should be able to open Position", async() => {

      const { perpTrader, btc, eth } = await loadFixture(deployAndDepositTest)

      // await perpTrader.write.openPosition([
      //   [btc.address, eth.address],
      //   100n,
      //   true
      // ])


    })


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
