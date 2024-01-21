import { deployPriceAggregator, deployTokens } from "./mockHelper";
import { deploy, depositLiquidity, tokenSymbols } from "./helpers";
import { parseEther } from "viem";
import { viem } from "hardhat";

const amount = parseEther("100", "wei")


async function main() {

  const gho = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60"

  const { ghoToken, btc, eth, xau, eur }  = tokenSymbols()

  console.log("-------------------------------------------------------------------")

  console.log("Tokens Deployed")

  console.log("GHO:   ", gho)

  const ghoPriceFeeds = "0x635A86F9fdD16Ff09A0701C305D3a845F1758b8E"

  const btcPriceFeeds = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"

  const ethPriceFeeds = "0x694AA1769357215DE4FAC081bf1f309aDC325306"

  const xauPriceFeeds = "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea"

  const eurPriceFeeds = "0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910"

  console.log("-------------------------------------------------------------------")

  console.log("GHO Price Feeds:   ", ghoPriceFeeds)

  console.log("BTC Price Feeds:   ", btcPriceFeeds)

  console.log("ETH Price Feeds:   ", ethPriceFeeds)

  console.log("XAU Price Feeds:  ", xauPriceFeeds)

  console.log("EUR Price Feeds: ", eurPriceFeeds)

  console.log("-------------------------------------------------------------------")

  const perpTrader = await viem.deployContract("PerpTrades", [gho, ghoPriceFeeds, "Perp-gho", "Perp-gho"])
  
  //const { perpTrader } = await deploy(gho, ghoPriceFeeds)

  await perpTrader.write.addPriceFeed([btc, btcPriceFeeds])

  await perpTrader.write.addPriceFeed([eth, ethPriceFeeds])

  await perpTrader.write.addPriceFeed([xau, xauPriceFeeds])

  await perpTrader.write.addPriceFeed([eur, eurPriceFeeds])

  console.log("PerpTrader Deployed")

  console.log("PerpTrader: ", perpTrader.address)

  console.log("-------------------------------------------------------------------")

  //await depositLiquidity(gho, perpTrader.address, amount)

  await perpTrader.write.addPair([
    {
      baseCurrency: btc, 
      quoteCurrency: eth
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: btc, 
      quoteCurrency: xau
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: eth, 
      quoteCurrency: xau
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: btc, 
      quoteCurrency: eur
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: eth, 
      quoteCurrency: eur
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: xau, 
      quoteCurrency: eur
    }]
  )


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
